import { fetchArticles } from "./services/article.service.js";

const run = async () => {
  const articles = await fetchArticles();
  console.log(`Fetched ${articles.length} articles`);
};

run();
