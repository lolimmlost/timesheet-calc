import React from 'react';
import { Check, Smartphone, Printer } from 'lucide-react';

/**
 * Footer component for the timesheet application
 * Mobile-optimized with minimal footprint on small screens
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Mobile-first layout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-xs md:text-sm text-gray-600">
              Time Card Calculator {currentYear}
            </p>
          </div>

          {/* Features - inline on mobile, row on desktop */}
          <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Check size={12} className="text-green-500" />
              Auto-save
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Printer size={12} className="text-green-500" />
              Print-ready
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Smartphone size={12} className="text-green-500" />
              Mobile-friendly
            </span>
          </div>
        </div>

        {/* Print footer - only visible when printing */}
        <div className="print-only hidden print:block mt-6 pt-4 border-t border-gray-300">
          <div className="flex justify-between items-center text-xs text-gray-600">
            <p>
              Printed on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
            <p>Time Card Calculator</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
