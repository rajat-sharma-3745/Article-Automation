import { fetchArticles } from "./services/articleFetcher.js";

const fetchOriginalArticles = async () => {
  const articles = await fetchArticles();
  const originalArticles =articles.filter(
      article => article.status === 'original'
    );
  console.log(`Fetched ${originalArticles.length} articles`);
};

fetchOriginalArticles();
