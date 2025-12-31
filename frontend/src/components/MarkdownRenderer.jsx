import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-slate max-w-none"
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-800" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl font-bold mt-5 mb-3 text-gray-800" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-bold mt-4 mb-2 text-gray-800" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-4 text-gray-700 leading-relaxed" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700" {...props} />
        ),
        li: ({ node, ...props }) => (
          <li className="ml-4" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-primary hover:text-primary/80 underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-primary pl-4 italic my-4 text-gray-600"
            {...props}
          />
        ),
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={tomorrow}
              language={match[1]}
              PreTag="div"
              className="rounded-lg my-4"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code
              className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
              {...props}
            >
              {children}
            </code>
          );
        },
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border-collapse border border-gray-300" {...props} />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left font-semibold" {...props} />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-300 px-4 py-2" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;