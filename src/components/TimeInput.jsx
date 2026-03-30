import React, { useState, useRef } from 'react';

/**
 * TimeInput component for selecting hour, minute, and AM/PM
 * Uses text inputs with smart focus/blur formatting
 */
const TimeInput = ({
  label,
  hour,
  minute,
  period,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
  disabled = false,
  hasError = false,
  ariaLabel
}) => {
  const [minuteFocused, setMinuteFocused] = useState(false);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  const selectAll = (e) => e.target.select();

  // Parse hour input - accepts 1-12
  const handleHourInput = (value) => {
    if (value === '') {
      onHourChange('');
      return;
    }
    const num = value.replace(/\D/g, '');
    if (num === '') return;

    const parsed = parseInt(num);
    if (parsed >= 1 && parsed <= 12) {
      onHourChange(parsed.toString());
      // Auto-advance to minutes after definitive hour entry (2+ digits or single digit > 1)
      if (num.length >= 2 || parsed > 1) {
        minuteRef.current?.focus();
      }
    }
  };

  // Parse minute input - accepts 0-59
  const handleMinuteInput = (value) => {
    if (value === '') {
      onMinuteChange('0');
      return;
    }
    const num = value.replace(/\D/g, '');
    if (num === '') return;

    const parsed = parseInt(num);
    if (parsed >= 0 && parsed <= 59) {
      onMinuteChange(parsed.toString());
    }
  };

  // Display value for minute field: raw when focused, padded when blurred
  const minuteDisplay = () => {
    if (minuteFocused) {
      return minute === '0' ? '' : (minute || '');
    }
    return minute === '0' || minute === '' ? '00' : (minute || '').toString().padStart(2, '0');
  };

  const inputClasses = `
    w-12 h-9 px-1 text-center text-sm font-medium
    border rounded-md
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
  `;

  const labelClasses = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-1">
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      <div
        className="flex items-center gap-1"
        role="group"
        aria-label={ariaLabel || label}
      >
        {/* Hour input */}
        <input
          ref={hourRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={hour}
          onChange={(e) => handleHourInput(e.target.value)}
          onFocus={selectAll}
          disabled={disabled}
          placeholder="H"
          className={inputClasses}
          aria-label={`${label || 'Time'} hour`}
        />

        <span className="text-gray-500 font-medium">:</span>

        {/* Minute input */}
        <input
          ref={minuteRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={minuteDisplay()}
          onChange={(e) => handleMinuteInput(e.target.value)}
          onFocus={(e) => { setMinuteFocused(true); setTimeout(() => e.target.select(), 0); }}
          onBlur={() => setMinuteFocused(false)}
          disabled={disabled}
          placeholder="MM"
          className={inputClasses}
          aria-label={`${label || 'Time'} minute`}
        />

        {/* AM/PM toggle buttons */}
        <div className="flex rounded-md border border-gray-300 overflow-hidden">
          <button
            type="button"
            onClick={() => onPeriodChange('AM')}
            disabled={disabled}
            className={`
              h-9 px-2 text-xs font-bold transition-colors
              ${period === 'AM'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            aria-label={`${label || 'Time'} AM`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => onPeriodChange('PM')}
            disabled={disabled}
            className={`
              h-9 px-2 text-xs font-bold transition-colors
              ${period === 'PM'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }
              ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            aria-label={`${label || 'Time'} PM`}
          >
            PM
          </button>
        </div>
      </div>

      {/* Error indicator */}
      {hasError && (
        <p className="text-red-500 text-xs mt-1" role="alert">
          Please enter a valid time
        </p>
      )}
    </div>
  );
};

export default TimeInput;
