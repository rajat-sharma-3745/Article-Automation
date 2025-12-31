import axios from 'axios'
import * as cheerio from 'cheerio'
import { ApiError } from '../utils/errorHandler.js';
import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'


const BASE_URL = 'https://beyondchats.com/blogs';
const ARTICLES_TO_SCRAPE = 5;


async function findLastPage() {
    try {
        const { data } = await axios.get(BASE_URL)
        const $ = cheerio.load(data);
        const pageNumbers = [];
        $('a[href*="/blogs/page/"]').each((i, elem) => {
            const href = $(elem).attr('href');
            const match = href.match(/\/page\/(\d+)\//);
            if (match) {
                pageNumbers.push(parseInt(match[1]));
            }
        });

        return pageNumbers.length > 0 ? Math.max(...pageNumbers) : 1;

    } catch (error) {
        console.error('Error finding last page:', error.message);
        throw new ApiError('Error finding last page', 500);
    }
}

export async function scrapeFullArticleContent(articleUrl) {
    try {
        console.log(`Fetching full content from: ${articleUrl}`);

        const { data: html } = await axios.get(articleUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            },
            timeout: 15000,
        });

        const $ = cheerio.load(html);

        // const $article = $(".elementor-widget-theme-post-content");
        const $article = $(".elementor-widget-theme-post-content, article, .entry-content, .post-content, main").first();

        if (!$article.length) {
            console.warn("Main article container not found");
            return null;
        }

        const contentParts = [];

        $article.children().each((_, el) => {
            const tag = el.tagName?.toLowerCase();

            if (["h2", "h3", "h4"].includes(tag)) {
                const text = $(el).text().trim();
                if (text) contentParts.push(`\n## ${text}\n`);
            }

            if (tag === "p") {
                const text = $(el).text().trim();
                if (text.length > 20) {
                    contentParts.push(text);
                }
            }

            if (tag === "ol" || tag === "ul") {
                $(el)
                    .find("li")
                    .each((i, li) => {
                        const text = $(li).text().trim();
                        if (text) {
                            contentParts.push(`- ${text}`);
                        }
                    });
            }
        });

        const finalContent = contentParts.join("\n\n").trim();

        const content = finalContent
            .replace(/\s+\n/g, "\n")
            .replace(/\n\s+/g, "\n")
            .split(/\n{2,}/)
            .map(p => p.trim())
            .filter(Boolean)
            .join("\n\n");

        return content || finalContent || null;
    } catch (error) {
        console.error(
            `Error scraping article content from ${articleUrl}:`,
            error.message
        );
        return null;
    }
}

async function scrapeArticlesFromPage(pageNumber) {
    try {
        const url = pageNumber === 1 ? BASE_URL : `${BASE_URL}/page/${pageNumber}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const articles = [];
        const seenUrls = new Set();

        $('article, .post, [class*="blog"]').each((i, elem) => {
            const $article = $(elem);

            const titleElem = $article.find('h2 a, h3 a, .entry-title a').first();
            const title = titleElem.text().trim();
            const articleUrl = titleElem.attr('href');

            if (!title || !articleUrl || seenUrls.has(articleUrl)) return;

            const author = $article.find('[class*="author"] a, .author a').text().trim() || 'Unknown';
            const date = $article.find('[class*="date"], time').first().text().trim() || 'Unknown';
            // const description = $article.find('p').first().text().trim() || '';
            const image = $article.find('img').first().attr('src') || '';

            const tags = [];
            $article.find('a[rel="tag"], [class*="tag"] a').each((j, tag) => {
                const tagText = $(tag).text().trim();
                if (tagText) tags.push(tagText);
            });

            articles.push({
                title,
                url: articleUrl,
                author,
                date,
                image,
                tags
            });
        });
        return articles;
    } catch (error) {
        console.error(`Error scraping page ${pageNumber}:`, error.message);
        return [];
    }
}

export async function scrapeOldestArticles(count = ARTICLES_TO_SCRAPE) {
    try {
        console.log('Finding last page...');
        const lastPage = await findLastPage();
        console.log(`Last page found: ${lastPage}`);

        const allArticles = [];
        let currentPage = lastPage;

        while (allArticles.length < count && currentPage > 0) {
            console.log(`Scraping page ${currentPage}...`);
            const remaining = count - allArticles.length
            const articles = await scrapeArticlesFromPage(currentPage);
            console.log(`Found ${articles.length} articles on page ${currentPage}`);
            allArticles.push(...articles.slice(-remaining));

            currentPage--;

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        allArticles.reverse();
        const oldestArticles = allArticles.slice(0, count);
        console.log(`\nFetching full content for ${oldestArticles.length} articles...`);

        for (let i = 0; i < oldestArticles.length; i++) {
            console.log(`Fetching content ${i + 1}/${oldestArticles.length}...`);
            const fullContent = await scrapeFullArticleContent(oldestArticles[i].url);
            oldestArticles[i].description = fullContent;

            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`\nTotal articles scraped with full content: ${oldestArticles.length}`);

        return oldestArticles;
    } catch (error) {
        console.error('Error in scraping process:', error.message);
        throw error;
    }
}
