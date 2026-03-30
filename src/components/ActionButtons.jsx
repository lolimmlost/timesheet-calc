import React from 'react';
import { Printer, RefreshCw, Trash2 } from 'lucide-react';

/**
 * ActionButtons component for timesheet actions
 * Mobile-optimized with larger touch targets
 */
const ActionButtons = ({
  onPrint,
  onCalculate,
  onClear,
  isCalculating = false,
  disabled = false
}) => {
  const handlePrint = () => {
    if (onPrint && !disabled) {
      onPrint();
    }
  };

  const handleCalculate = () => {
    if (onCalculate && !disabled && !isCalculating) {
      onCalculate();
    }
  };

  const handleClear = () => {
    if (onClear && !disabled) {
      onClear();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 no-print">
      {/* Print Button - Primary action */}
      <button
        onClick={handlePrint}
        disabled={disabled}
        className="
          flex-1 sm:flex-initial
          flex items-center justify-center gap-2
          h-12 px-6
          bg-green-500 hover:bg-green-600 active:bg-green-700
          text-white font-semibold
          rounded-xl
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-sm hover:shadow-md
        "
        aria-label="Print timesheet"
        title="Print timesheet"
      >
        <Printer size={20} />
        <span>Print</span>
      </button>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={disabled || isCalculating}
        className="
          flex-1 sm:flex-initial
          flex items-center justify-center gap-2
          h-12 px-6
          bg-gray-100 hover:bg-gray-200 active:bg-gray-300
          text-gray-700 font-semibold
          rounded-xl
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        aria-label="Recalculate hours"
        title="Recalculate hours"
      >
        <RefreshCw size={20} className={isCalculating ? 'animate-spin' : ''} />
        <span>{isCalculating ? 'Calculating...' : 'Recalculate'}</span>
      </button>

      {/* Clear All Button */}
      <button
        onClick={handleClear}
        disabled={disabled}
        className="
          flex-1 sm:flex-initial
          flex items-center justify-center gap-2
          h-12 px-6
          bg-red-50 hover:bg-red-100 active:bg-red-200
          text-red-600 font-semibold
          rounded-xl
          border-2 border-red-200 hover:border-red-300
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        aria-label="Clear all entries"
        title="Clear all timesheet entries"
      >
        <Trash2 size={20} />
        <span>Clear All</span>
      </button>
    </div>
  );
};

export default ActionButtons;
