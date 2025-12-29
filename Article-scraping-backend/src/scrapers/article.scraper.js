import axios from 'axios'
import * as cheerio from 'cheerio'
import { ApiError } from '../utils/errorHandler.js';

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

async function scrapeArticlesFromPage(pageNumber) {
    try {
        const url = pageNumber === 1 ? BASE_URL : `${BASE_URL}/page/${pageNumber}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const articles = [];

        $('article, .post, [class*="blog"]').each((i, elem) => {
            const $article = $(elem);

            const titleElem = $article.find('h2 a, h3 a, .entry-title a').first();
            const title = titleElem.text().trim();
            const url = titleElem.attr('href');

            if (!title || !url) return;

            const author = $article.find('[class*="author"] a, .author a').text().trim() || 'Unknown';
            const date = $article.find('[class*="date"], time').text().trim() || 'Unknown';
            const description = $article.find('p').first().text().trim() || '';
            const image = $article.find('img').first().attr('src') || '';

            const tags = [];
            $article.find('a[rel="tag"], [class*="tag"] a').each((j, tag) => {
                tags.push($(tag).text().trim());
            });

            articles.push({
                title,
                url,
                author,
                date,
                description,
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
            const remaining = count-allArticles.length
            const articles = await scrapeArticlesFromPage(currentPage);
            console.log(`Found ${articles.length} articles on page ${currentPage}`);
            allArticles.push(...articles.slice(-remaining));

            currentPage--;

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        allArticles.reverse();
        const oldestArticles = allArticles.slice(0, count);
        console.log(`\nTotal articles scraped: ${oldestArticles.length}`);

        return oldestArticles;
    } catch (error) {
        console.error('Error in scraping process:', error.message);
        throw error;
    }
}
