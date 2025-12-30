import { fetchArticles } from "./services/articleFetcher.js";
import { googleSearch } from "./services/googleSearch.js";

const fetchOriginalArticles = async () => {
  const articles = await fetchArticles();
  const originalArticles =articles.filter(
      article => article.status === 'original'
    );
  console.log(`Fetched ${originalArticles.length} articles`);
   for (const article of originalArticles) {
    const links = await googleSearch(article.title);
    console.log(article.title, links);
  }
};

// fetchOriginalArticles();
