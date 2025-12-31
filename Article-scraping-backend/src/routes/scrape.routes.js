import express from "express";
import { scrapeOldestArticles } from "../scrapers/article.scraper.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Article from "../models/Article.js";

const router = express.Router();

router.post("/", asyncHandler(async (req, res) => {
    const count = req.body?.count ?? 5;

    console.log(`Scraping ${count} articles...`);
    const scrapedArticles = await scrapeOldestArticles(count);

    const savedArticles = [];
    for (const article of scrapedArticles) {
        const saved = await Article.findOneAndUpdate(
            { url: article.url },
            article,
            { upsert: true, new: true }
        );
        savedArticles.push(saved);
    }

    res.status(201).json({
        success: true,
        message: `Successfully scraped and saved ${savedArticles.length} articles`,
        data: savedArticles
    });
}));

export default router;
