import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, Calendar, User, Tag } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

const ArticleDetail = ({ article, onClose }) => {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedUpdated, setCopiedUpdated] = useState(false);

  const copyToClipboard = async (text, setStateFn) => {
    try {
      await navigator.clipboard.writeText(text);
      setStateFn(true);
      setTimeout(() => setStateFn(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
  <div className="min-h-screen flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8">
    <div className="w-full max-w-5xl bg-white rounded-lg shadow-2xl flex flex-col max-h-[95vh]">

      <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-lg px-4 sm:px-6 py-3 sm:py-4 flex items-start sm:items-center justify-between z-10">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 flex-1 pr-3 wrap-break-word">
          {article.title}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto">
        <div className="flex flex-wrap gap-3 mb-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="font-medium">{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{article.date}</span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              article.status === 'updated'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {article.status === 'updated' ? 'Updated' : 'Original'}
          </span>
        </div>

        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {article.image && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {article.url && (
          <div className="mb-6">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              View Original Source
            </a>
          </div>
        )}

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              Original Content
            </h3>
            <button
              onClick={() =>
                copyToClipboard(article.description, setCopiedOriginal)
              }
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
            >
              {copiedOriginal ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {article.description}
            </p>
          </div>
        </div>

        {article.updatedContent && (
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                AI-Enhanced Content
              </h3>
              <button
                onClick={() =>
                  copyToClipboard(article.updatedContent, setCopiedUpdated)
                }
                className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors text-sm"
              >
                {copiedUpdated ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-linear-to-br from-green-50 to-blue-50 rounded-lg p-4 sm:p-6 border border-green-200">
              <MarkdownRenderer content={article.updatedContent} />
            </div>
          </div>
        )}

        {article.references?.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              References
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
              <ol className="space-y-3">
                {article.references.map((ref, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="font-semibold text-gray-700 min-w-6">
                      {index + 1}.
                    </span>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 hover:underline flex items-center gap-2 flex-1"
                    >
                      <span className="wrap-break-word">{ref.title}</span>
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 rounded-b-lg">
        <button
          onClick={onClose}
          className="w-full cursor-pointer sm:w-auto px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default ArticleDetail;