import ArticleCard from '../components/ArticleCard';
import ArticleDetail from '../components/ArticleDetail';
import { Loader2 } from 'lucide-react';

const ArticlesPage = ({
  articles,
  loading,
  error,
  selectedArticle,
  onArticleClick,
  onCloseDetail,
  onRetry
}) => {
  return (
    <main className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-2">Error loading articles</p>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={onRetry}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-gray-600 text-lg">No articles found</p>
            <p className="text-gray-500 mt-2">
              Try scraping some articles first
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              All Articles
            </h2>
            <p className="text-gray-600">
              {articles.length} article{articles.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article._id}
                article={article}
                onClick={() => onArticleClick(article)}
              />
            ))}
          </div>
        </>
      )}

      {selectedArticle && (
        <ArticleDetail
          article={selectedArticle}
          onClose={onCloseDetail}
        />
      )}
    </main>
  );
};

export default ArticlesPage;
