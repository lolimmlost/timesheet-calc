import React, { useState, useEffect, useCallback, useRef } from 'react';
import DayRow from './DayRow';
import DayCard from './DayCard';
import ActionButtons from './ActionButtons';
import PrintView from './PrintView';
import {
  calculateWeeklyTotal,
  formatHoursDisplay,
  calculateDailyHours
} from '../utils/timeCalculations';
import { saveTimesheetData } from '../utils/localStorage';
import { Calendar, User, Clock, TrendingUp } from 'lucide-react';

// Days of the week - defined outside component to avoid recreating on each render
const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' }
];

/**
 * TimesheetForm component for the main timesheet interface
 * Responsive design with card layout for mobile and table for desktop
 */
const TimesheetForm = ({
  initialData,
  onDataChange,
  onClear
}) => {
  const [timesheetData, setTimesheetData] = useState(initialData);
  const [isCalculating, setIsCalculating] = useState(false);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);

  // Track if data change is from user action (not from prop change)
  const isUserChangeRef = useRef(false);
  const saveTimeoutRef = useRef(null);

  // Toggle expanded day - only one can be open at a time
  const handleToggleExpand = (day) => {
    setExpandedDay(prev => prev === day ? null : day);
  };

  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Debounced save function
  const debouncedSave = useCallback((data) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveTimesheetData(data);
      if (onDataChange) {
        onDataChange(data);
      }
    }, 300);
  }, [onDataChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Calculate daily hours for a given day
  const getDailyHours = useCallback((key) => {
    const dayData = timesheetData.days[key];
    return calculateDailyHours(
      dayData.startHour ? {
        hour: parseInt(dayData.startHour),
        minute: parseInt(dayData.startMinute),
        period: dayData.startPeriod
      } : null,
      dayData.endHour ? {
        hour: parseInt(dayData.endHour),
        minute: parseInt(dayData.endMinute),
        period: dayData.endPeriod
      } : null,
      {
        hours: parseInt(dayData.breakHours),
        minutes: parseInt(dayData.breakMinutes)
      },
      dayData.isOvernight
    );
  }, [timesheetData.days]);

  // Calculate weekly total whenever data changes
  useEffect(() => {
    const dailyHours = DAYS_OF_WEEK.map(({ key }) => getDailyHours(key));
    const total = calculateWeeklyTotal(dailyHours);
    setWeeklyTotal(total);
  }, [getDailyHours]);

  // Auto-save only when user makes changes (not when props change)
  useEffect(() => {
    if (isUserChangeRef.current) {
      debouncedSave(timesheetData);
      isUserChangeRef.current = false;
    }
  }, [timesheetData, debouncedSave]);

  // Update data when initial data changes (from parent, e.g., after clear)
  useEffect(() => {
    // Cancel any pending debounced save so it doesn't overwrite the fresh data
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    // Don't trigger auto-save when setting from props
    isUserChangeRef.current = false;
    setTimesheetData(initialData);
    setExpandedDay(null);
  }, [initialData]);

  // Handle name change
  const handleNameChange = (value) => {
    isUserChangeRef.current = true;
    setTimesheetData(prev => ({
      ...prev,
      name: value
    }));
  };

  // Handle date range change
  const handleDateRangeChange = (value) => {
    isUserChangeRef.current = true;
    setTimesheetData(prev => ({
      ...prev,
      dateRange: value
    }));
  };

  // Handle day data change
  const handleDayChange = (day, field, value) => {
    isUserChangeRef.current = true;
    setTimesheetData(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          [field]: value
        }
      }
    }));
  };

  // Handle print action
  const handlePrint = () => {
    window.print();
  };

  // Handle calculate action (manual trigger)
  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 500);
  };

  // Handle clear action
  const handleClearAll = () => {
    if (onClear) {
      onClear();
    }
  };

  // Count days with hours
  const daysWorked = DAYS_OF_WEEK.filter(({ key }) => getDailyHours(key) > 0).length;

  // Calculate average hours per day worked
  const avgHoursPerDay = daysWorked > 0 ? weeklyTotal / daysWorked : 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:p-4">
      {/* Stats Summary - Mobile Optimized */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <Clock size={14} />
            <span>Total Hours</span>
          </div>
          <p className="text-2xl font-bold text-primary-600 tabular-nums">
            {formatHoursDisplay(weeklyTotal)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <Calendar size={14} />
            <span>Days Worked</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 tabular-nums">
            {daysWorked}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <TrendingUp size={14} />
            <span>Avg/Day</span>
          </div>
          <p className="text-2xl font-bold text-gray-800 tabular-nums">
            {formatHoursDisplay(avgHoursPerDay)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <Clock size={14} />
            <span>Overtime (40h)</span>
          </div>
          <p className={`text-2xl font-bold tabular-nums ${weeklyTotal > 40 ? 'text-orange-500' : 'text-gray-400'}`}>
            {weeklyTotal > 40 ? formatHoursDisplay(weeklyTotal - 40) : '--:--'}
          </p>
        </div>
      </div>

      {/* Name and Date Range Inputs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Input */}
          <div>
            <label htmlFor="employee-name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User size={14} />
              Employee Name (Optional)
            </label>
            <input
              id="employee-name"
              type="text"
              value={timesheetData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter your name"
              className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-base"
              aria-label="Employee name"
            />
          </div>

          {/* Date Range Input */}
          <div>
            <label htmlFor="date-range" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar size={14} />
              Date Range (Optional)
            </label>
            <input
              id="date-range"
              type="text"
              value={timesheetData.dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              placeholder="e.g., Jan 1-7, 2024"
              className="w-full h-12 px-4 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-base"
              aria-label="Date range"
            />
          </div>
        </div>

        {/* Employee and Date Display (for print) */}
        {(timesheetData.name || timesheetData.dateRange) && (
          <div className="print-only hidden print:block mt-6 p-4 bg-gray-50 rounded-lg">
            {timesheetData.name && (
              <p className="text-sm font-semibold mb-2">
                Employee: <span className="font-normal">{timesheetData.name}</span>
              </p>
            )}
            {timesheetData.dateRange && (
              <p className="text-sm font-semibold">
                Period: <span className="font-normal">{timesheetData.dateRange}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Mobile View - Card Layout */}
      {isMobileView ? (
        <div className="space-y-3 mb-6">
          {DAYS_OF_WEEK.map(({ key, label }) => (
            <DayCard
              key={key}
              day={key}
              dayLabel={label}
              dayData={timesheetData.days[key]}
              onDayChange={handleDayChange}
              isExpanded={expandedDay === key}
              onToggleExpand={handleToggleExpand}
            />
          ))}

          {/* Weekly Total - Mobile */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Weekly Total</span>
              <span className="text-3xl font-bold tabular-nums">
                {formatHoursDisplay(weeklyTotal)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop View - Table Layout */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-900">
                    Day
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-900">
                    Starting Time
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-900">
                    Ending Time
                  </th>
                  <th className="text-left py-3 px-2 md:px-4 text-sm font-semibold text-gray-900">
                    Break Deduction
                  </th>
                  <th className="text-right py-3 px-2 md:px-4 text-sm font-semibold text-gray-900">
                    Total Hours
                  </th>
                  <th className="text-center py-3 px-2 md:px-4 text-sm font-semibold text-gray-900 print:hidden">
                    Options
                  </th>
                </tr>
              </thead>
              <tbody>
                {DAYS_OF_WEEK.map(({ key, label }) => (
                  <DayRow
                    key={key}
                    day={key}
                    dayLabel={label}
                    dayData={timesheetData.days[key]}
                    onDayChange={handleDayChange}
                  />
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-100">
                  <td
                    colSpan="4"
                    className="py-4 px-2 md:px-4 text-right font-bold text-gray-900"
                  >
                    Weekly Total:
                  </td>
                  <td className="py-4 px-2 md:px-4 text-right">
                    <span className="text-lg font-bold text-primary-600 tabular-nums">
                      {formatHoursDisplay(weeklyTotal)}
                    </span>
                  </td>
                  <td className="print:hidden"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6">
        <ActionButtons
          onPrint={handlePrint}
          onCalculate={handleCalculate}
          onClear={handleClearAll}
          isCalculating={isCalculating}
        />
      </div>

      {/* Instructions - Collapsible on Mobile */}
      <details className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:hidden instructions">
        <summary className="p-4 cursor-pointer text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between">
          <span>How to Use</span>
          <span className="text-xs text-gray-400">Tap to expand</span>
        </summary>
        <ul className="p-4 pt-0 text-sm text-gray-600 space-y-2 list-disc list-inside">
          <li>Tap on any day to expand and enter your hours</li>
          <li>Use quick presets (9-5, 8-4, etc.) for faster entry</li>
          <li>Include break duration if applicable</li>
          <li>Enable "Overnight" for shifts that cross midnight</li>
          <li>Your data is automatically saved locally</li>
          <li>Use PRINT to generate a printable timesheet</li>
          <li>CLEAR ALL will reset all entries</li>
        </ul>
      </details>

      {/* Print-only view - hidden on screen, shown when printing */}
      <PrintView timesheetData={timesheetData} weeklyTotal={weeklyTotal} />
    </div>
  );
};

export default TimesheetForm;
