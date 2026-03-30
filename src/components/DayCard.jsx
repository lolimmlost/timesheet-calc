import React, { useRef, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Moon, Clock } from 'lucide-react';
import {
  calculateDailyHours,
  formatHoursDisplay,
  validateTimeInput,
  validateBreakInput,
  isValidTimeRange
} from '../utils/timeCalculations';

/**
 * Mobile-friendly DayCard component for a single day's timesheet entry
 * Uses a card-based layout optimized for touch interactions
 */
const DayCard = ({
  day,
  dayLabel,
  dayData,
  onDayChange,
  isExpanded,
  onToggleExpand
}) => {
  const cardRef = useRef(null);
  const startMinuteRef = useRef(null);
  const endMinuteRef = useRef(null);
  const breakMinuteRef = useRef(null);

  // Track which minute fields are focused for display formatting
  const [focusedField, setFocusedField] = useState(null);

  const {
    startHour,
    startMinute,
    startPeriod,
    endHour,
    endMinute,
    endPeriod,
    breakHours,
    breakMinutes,
    isOvernight
  } = dayData;

  // Calculate daily hours
  const dailyHours = calculateDailyHours(
    startHour ? { hour: parseInt(startHour), minute: parseInt(startMinute), period: startPeriod } : null,
    endHour ? { hour: parseInt(endHour), minute: parseInt(endMinute), period: endPeriod } : null,
    { hours: parseInt(breakHours), minutes: parseInt(breakMinutes) },
    isOvernight
  );

  // Check if day has any data entered
  const hasData = startHour || endHour;

  // Validate inputs
  const hasStartTimeError = startHour && !validateTimeInput(parseInt(startHour), parseInt(startMinute), startPeriod);
  const hasEndTimeError = endHour && !validateTimeInput(parseInt(endHour), parseInt(endMinute), endPeriod);
  const hasBreakError = !validateBreakInput(parseInt(breakHours), parseInt(breakMinutes));
  const hasTimeRangeError = startHour && endHour && !isValidTimeRange(
    { hour: parseInt(startHour), minute: parseInt(startMinute), period: startPeriod },
    { hour: parseInt(endHour), minute: parseInt(endMinute), period: endPeriod },
    isOvernight
  );
  const hasError = hasStartTimeError || hasEndTimeError || hasBreakError || hasTimeRangeError;

  // Scroll into view when expanded
  useEffect(() => {
    if (isExpanded && cardRef.current) {
      setTimeout(() => {
        cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [isExpanded]);

  // Handle field changes
  const handleFieldChange = (field, value) => {
    onDayChange(day, field, value);
  };

  const selectAll = (e) => setTimeout(() => e.target.select(), 0);

  // Parse hour input - accepts 1-12, auto-advances to minute field
  const handleHourInput = (field, value, minuteFieldRef) => {
    if (value === '') {
      handleFieldChange(field, '');
      return;
    }
    const num = value.replace(/\D/g, '');
    if (num === '') return;

    const parsed = parseInt(num);
    if (parsed >= 1 && parsed <= 12) {
      handleFieldChange(field, parsed.toString());
      // Auto-advance after definitive entry
      if (num.length >= 2 || parsed > 1) {
        minuteFieldRef?.current?.focus();
      }
    } else if (parsed > 12 && parsed <= 99) {
      const lastDigit = parsed % 10;
      if (lastDigit >= 1 && lastDigit <= 9) {
        handleFieldChange(field, lastDigit.toString());
      }
    }
  };

  // Parse minute input - accepts 0-59
  const handleMinuteInput = (field, value) => {
    if (value === '') {
      handleFieldChange(field, '0');
      return;
    }
    const num = value.replace(/\D/g, '');
    if (num === '') return;

    const parsed = parseInt(num);
    if (parsed >= 0 && parsed <= 59) {
      handleFieldChange(field, parsed.toString());
    }
  };

  // Parse break hours input
  const handleBreakHourInput = (value) => {
    if (value === '') {
      handleFieldChange('breakHours', '0');
      return;
    }
    const num = value.replace(/\D/g, '');
    if (num === '') return;

    const parsed = parseInt(num);
    if (parsed >= 0 && parsed <= 23) {
      handleFieldChange('breakHours', parsed.toString());
      if (num.length >= 2 || parsed > 2) {
        breakMinuteRef.current?.focus();
      }
    }
  };

  // Parse break minutes input
  const handleBreakMinuteInput = (value) => {
    if (value === '') {
      handleFieldChange('breakMinutes', '0');
      return;
    }
    const num = value.replace(/\D/g, '');
    if (num === '') return;

    const parsed = parseInt(num);
    if (parsed >= 0 && parsed <= 59) {
      handleFieldChange('breakMinutes', parsed.toString());
    }
  };

  // Display helpers: raw when focused, formatted when blurred
  const minuteDisplay = (value, fieldName) => {
    if (focusedField === fieldName) {
      return value === '0' || value === '00' ? '' : (value || '');
    }
    const v = value || '0';
    return v === '0' || v === '00' ? '00' : v.toString().padStart(2, '0');
  };

  const breakHoursDisplay = () => {
    if (focusedField === 'breakHours') return breakHours === '0' ? '' : (breakHours || '');
    return breakHours || '0';
  };

  // Time display helpers
  const formatTimeDisplay = (hour, minute, period) => {
    if (!hour) return '--:--';
    return `${hour}:${(minute || '0').toString().padStart(2, '0')} ${period}`;
  };

  const handleToggle = () => {
    onToggleExpand(day);
  };

  return (
    <div
      ref={cardRef}
      className={`
        bg-white rounded-xl shadow-sm border-2 transition-all duration-200
        ${hasError ? 'border-red-300' : hasData ? 'border-primary-200' : 'border-gray-100'}
        ${isExpanded ? 'shadow-md' : ''}
      `}
    >
      {/* Collapsed Header - Always Visible */}
      <button
        onClick={handleToggle}
        className="w-full p-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded-xl"
        aria-expanded={isExpanded}
        aria-controls={`day-${day}-content`}
      >
        <div className="flex items-center gap-3">
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg
            ${hasData ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'}
          `}>
            {dayLabel.substring(0, 2)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{dayLabel}</h3>
            <p className="text-sm text-gray-500">
              {hasData
                ? `${formatTimeDisplay(startHour, startMinute, startPeriod)} - ${formatTimeDisplay(endHour, endMinute, endPeriod)}`
                : 'Tap to add hours'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isOvernight && (
            <Moon size={16} className="text-indigo-500" />
          )}
          <div className={`
            text-lg font-bold tabular-nums
            ${dailyHours > 0 ? 'text-primary-600' : 'text-gray-300'}
          `}>
            {formatHoursDisplay(dailyHours)}
          </div>
          {isExpanded ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          id={`day-${day}-content`}
          className="px-4 pb-4 space-y-4 animate-fade-in"
        >
          <div className="border-t border-gray-100 pt-4">
            {/* Start Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock size={14} />
                Start Time
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={startHour}
                  onChange={(e) => handleHourInput('startHour', e.target.value, startMinuteRef)}
                  onFocus={(e) => selectAll(e)}
                  placeholder="H"
                  className={`
                    w-16 h-12 px-3 rounded-lg border-2 text-center text-lg font-medium
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${hasStartTimeError ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                  `}
                  aria-label="Start hour"
                />
                <span className="text-xl text-gray-400 font-bold">:</span>
                <input
                  ref={startMinuteRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={minuteDisplay(startMinute, 'startMinute')}
                  onChange={(e) => handleMinuteInput('startMinute', e.target.value)}
                  onFocus={(e) => { setFocusedField('startMinute'); selectAll(e); }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="MM"
                  className={`
                    w-16 h-12 px-3 rounded-lg border-2 text-center text-lg font-medium
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${hasStartTimeError ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                  `}
                  aria-label="Start minute"
                />
                <div className="flex rounded-lg border-2 border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('startPeriod', 'AM')}
                    className={`
                      h-12 px-4 text-sm font-bold transition-colors
                      ${startPeriod === 'AM'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('startPeriod', 'PM')}
                    className={`
                      h-12 px-4 text-sm font-bold transition-colors
                      ${startPeriod === 'PM'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            {/* End Time */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Clock size={14} />
                End Time
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={endHour}
                  onChange={(e) => handleHourInput('endHour', e.target.value, endMinuteRef)}
                  onFocus={(e) => selectAll(e)}
                  placeholder="H"
                  className={`
                    w-16 h-12 px-3 rounded-lg border-2 text-center text-lg font-medium
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${hasEndTimeError || hasTimeRangeError ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                  `}
                  aria-label="End hour"
                />
                <span className="text-xl text-gray-400 font-bold">:</span>
                <input
                  ref={endMinuteRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={minuteDisplay(endMinute, 'endMinute')}
                  onChange={(e) => handleMinuteInput('endMinute', e.target.value)}
                  onFocus={(e) => { setFocusedField('endMinute'); selectAll(e); }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="MM"
                  className={`
                    w-16 h-12 px-3 rounded-lg border-2 text-center text-lg font-medium
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${hasEndTimeError || hasTimeRangeError ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                  `}
                  aria-label="End minute"
                />
                <div className="flex rounded-lg border-2 border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handleFieldChange('endPeriod', 'AM')}
                    className={`
                      h-12 px-4 text-sm font-bold transition-colors
                      ${endPeriod === 'AM'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFieldChange('endPeriod', 'PM')}
                    className={`
                      h-12 px-4 text-sm font-bold transition-colors
                      ${endPeriod === 'PM'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>

            {/* Break Duration */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Break Duration
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={breakHoursDisplay()}
                  onChange={(e) => handleBreakHourInput(e.target.value)}
                  onFocus={(e) => { setFocusedField('breakHours'); selectAll(e); }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="0"
                  className={`
                    w-16 h-12 px-3 rounded-lg border-2 text-center text-lg font-medium
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${hasBreakError ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                  `}
                  aria-label="Break hours"
                />
                <span className="text-sm text-gray-500 font-medium">hrs</span>
                <input
                  ref={breakMinuteRef}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={minuteDisplay(breakMinutes, 'breakMinutes')}
                  onChange={(e) => handleBreakMinuteInput(e.target.value)}
                  onFocus={(e) => { setFocusedField('breakMinutes'); selectAll(e); }}
                  onBlur={() => setFocusedField(null)}
                  placeholder="0"
                  className={`
                    w-16 h-12 px-3 rounded-lg border-2 text-center text-lg font-medium
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${hasBreakError ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                  `}
                  aria-label="Break minutes"
                />
                <span className="text-sm text-gray-500 font-medium">min</span>
              </div>
            </div>

            {/* Overnight Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Moon size={18} className="text-indigo-500" />
                <span className="font-medium text-gray-700">Overnight Shift</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isOvernight}
                onClick={() => handleFieldChange('isOvernight', !isOvernight)}
                className={`
                  relative inline-flex h-7 w-12 items-center rounded-full transition-colors
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  ${isOvernight ? 'bg-indigo-600' : 'bg-gray-300'}
                `}
              >
                <span
                  className={`
                    inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform
                    ${isOvernight ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Quick presets:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '9-5', start: { h: '9', m: '0', p: 'AM' }, end: { h: '5', m: '0', p: 'PM' } },
                  { label: '8-4', start: { h: '8', m: '0', p: 'AM' }, end: { h: '4', m: '0', p: 'PM' } },
                  { label: '8-5', start: { h: '8', m: '0', p: 'AM' }, end: { h: '5', m: '0', p: 'PM' } },
                  { label: '7-3', start: { h: '7', m: '0', p: 'AM' }, end: { h: '3', m: '0', p: 'PM' } },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      handleFieldChange('startHour', preset.start.h);
                      handleFieldChange('startMinute', preset.start.m);
                      handleFieldChange('startPeriod', preset.start.p);
                      handleFieldChange('endHour', preset.end.h);
                      handleFieldChange('endMinute', preset.end.m);
                      handleFieldChange('endPeriod', preset.end.p);
                    }}
                    className="px-3 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    handleFieldChange('startHour', '');
                    handleFieldChange('startMinute', '0');
                    handleFieldChange('startPeriod', 'AM');
                    handleFieldChange('endHour', '');
                    handleFieldChange('endMinute', '0');
                    handleFieldChange('endPeriod', 'PM');
                    handleFieldChange('breakHours', '0');
                    handleFieldChange('breakMinutes', '0');
                    handleFieldChange('isOvernight', false);
                  }}
                  className="px-3 py-1.5 text-sm font-medium bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Error Message */}
            {hasError && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">
                  {hasTimeRangeError
                    ? 'End time must be after start time (or enable overnight shift)'
                    : 'Please check your time entries'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayCard;
