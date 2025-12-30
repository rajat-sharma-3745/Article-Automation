import axios from 'axios'
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const scrapeArticleContent = async (url) => {

    try {
        console.log(`Scraping: ${url}`);

        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            timeout: 10000
        });

        const dom = new JSDOM(html, { url });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();
        if (!article) {
            console.log('Could not extract content from:', url);
            return null;
        }

        return {
            title: article.title,
            content: article.textContent,
            excerpt: article.excerpt
        };
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return null;
    }
}

export async function scrapeMultipleArticles(urls, requiredCount = 2) {
  const results = [];
  
  for (const urlObj of urls) {
    if (results.length === requiredCount) break;
    const content = await scrapeArticleContent(urlObj.url);
    if (content) {
      results.push({
        ...urlObj,
        ...content
      });
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return results;
}