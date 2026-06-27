import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400 dark:text-neutral-600 mb-6">
        <HelpCircle className="w-10 h-10" />
      </div>
      
      <h1 className="text-4xl font-extrabold font-display tracking-tight mb-2">404 - Page Not Found</h1>
      
      <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-sm mb-8 leading-relaxed">
        The link you followed may be broken or the candidate file you are trying to view does not exist.
      </p>

      <Link
        to="/dashboard"
        className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-md shadow-primary-500/10 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default NotFound;
