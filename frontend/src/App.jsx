import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ArticlesPage from './pages/ArticlesPage';
import { articlesAPI } from './api/article.api';

function App() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await articlesAPI.getAll();

      setArticles(response || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
  <Navbar />

  <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <ArticlesPage
      articles={articles}
      loading={loading}
      error={error}
      selectedArticle={selectedArticle}
      onArticleClick={setSelectedArticle}
      onCloseDetail={() => setSelectedArticle(null)}
      onRetry={fetchArticles}
    />
  </div>
</div>

  );
}

export default App;
