import { fetchArticles } from "./services/articleFetcher.js";
import { updateArticle } from "./services/articleUpdate.js";
import { scrapeMultipleArticles } from "./services/contentScraper.js";
import { googleSearch } from "./services/googleSearch.js";
import { rewriteArticle } from "./services/llmRewriter.js";

const run = async () => {
    try {
        const articles = await fetchArticles();
        const originalArticles = articles.filter(
            article => article.status === 'original'
        );
        const results = {
            total: originalArticles.length,
            success: 0,
            failed: 0,
            errors: []
        };
        console.log(`Fetched ${originalArticles.length} articles`);
        for (const article of originalArticles) {
            const result = await processArticle(article);

            if (result.success) {
                results.success++;
            } else {
                results.failed++;
                results.errors.push({
                    title: article.title,
                    reason: result.reason
                });
            }

            console.log('Wait 5 sec before next article\n');
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        console.log(`Total articles: ${results.total}`);
        console.log(`Successfully processed: ${results.success}`);
        console.log(`Failed: ${results.failed}`);

        if (results.errors.length > 0) {
            console.log('\nFailed articles:');
            results.errors.forEach(err => {
                console.log(`${err.title}: ${err.reason}`);
            });
        }
    } catch (error) {
        console.error('Fatal error:', error.message);
        process.exit(1);
    }
};

async function processArticle(article) {
    try {
        console.log(`Processing: ${article.title}`);

        console.log('Step 1: Searching Google...');
        const searchResults = await googleSearch(article.title);

        if (searchResults.length < 2) {
            console.log('Not enough search results. Skipping');
            return { success: false, reason: 'Insufficient search results' };
        }

        console.log('Step 2: Scraping reference articles');
        const scrapedArticles = await scrapeMultipleArticles(searchResults);

        if (scrapedArticles.length < 2) {
            console.log('Could not scrape enough articles. Skipping...');
            return { success: false, reason: 'Scraping failed' };
        }

        console.log('Step 3: Rewriting article with LLM...');
        const rewrittenContent = await rewriteArticle(article, scrapedArticles);

        if (!rewrittenContent) {
            console.log('LLM rewrite failed. Skipping...');
            return { success: false, reason: 'LLM failed' };
        }

        console.log('Step 4: Updating article via API...');
        await updateArticle(article._id, rewrittenContent, scrapedArticles);

        console.log('Article processed successfully!\n');
        return { success: true };

    } catch (error) {
        console.error(`Error processing article: ${error.message}\n`);
        return { success: false, reason: error.message };
    }
}

// run();
