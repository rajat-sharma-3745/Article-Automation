import React from 'react';
import { FileText } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <FileText className="w-5 h-5 text-primary" />
        </div>

        <div className="leading-tight">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Article Viewer
          </h1>
          <p className="hidden sm:block text-xs text-gray-500">
            BeyondChats Blog Collection
          </p>
        </div>
      </div>

      <div className="hidden md:block text-sm text-gray-600">
        Curated & Updated Articles
      </div>
    </div>
  </div>
</nav>

  );
};

export default Navbar;