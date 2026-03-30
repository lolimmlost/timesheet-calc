import React from 'react';
import { Clock } from 'lucide-react';

/**
 * Header component for the timesheet application
 * Mobile-optimized with compact layout on small screens
 */
const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary-700 to-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          {/* Title and Logo */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight">
                Time Card Calculator
              </h1>
              <p className="text-primary-200 text-xs md:text-sm hidden sm:block">
                Track your weekly work hours
              </p>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs md:text-sm text-white/90 hidden sm:inline">Auto-save on</span>
            <span className="text-xs text-white/90 sm:hidden">Saved</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
