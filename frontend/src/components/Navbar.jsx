import React from 'react';
import { FileText } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">
              Article Viewer
            </h1>
          </div>
          <div className="text-sm text-gray-600">
            BeyondChats Blog Collection
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;