import React, { useState, useRef } from 'react';

/**
 * BreakInput component for entering break duration
 * Uses text inputs with smart focus/blur formatting
 */
const BreakInput = ({
  hours,
  minutes,
  onHoursChange,
  onMinutesChange,
  disabled = false,
  hasError = false,
  label,
  ariaLabel
}) => {
  const [hoursFocused, setHoursFocused] = useState(false);
  const [minutesFocused, setMinutesFocused] = useState(false);
  const minutesRef = useRef(null);

  const selectAll = (e) => e.target.select();

  // Parse hours input - accepts 0-23
  const handleHoursInput = (value) => {
    if (value === '') {
      onHoursChange('0');
      return;
    }
    const num = value.replace(/\D/g, '');
    if (num === '') return;

    const parsed = parseInt(num);
    if (parsed >= 0 && parsed <= 23) {
      onHoursChange(parsed.toString());
      // Auto-advance to minutes after definitive entry
      if (num.length >= 2 || parsed > 2) {
        minutesRef.current?.focus();
      }
    }
  };

  // Parse minutes input - accepts 0-59
  const handleMinutesInput = (value) => {
    if (value === '') {
      onMinutesChange('0');
      return;
    }
    const num = value.replace(/\D/g, '');
    if (num === '') return;

    const parsed = parseInt(num);
    if (parsed >= 0 && parsed <= 59) {
      onMinutesChange(parsed.toString());
    }
  };

  // Display helpers: show empty when focused and value is zero, padded when blurred
  const hoursDisplay = () => {
    if (hoursFocused) return hours === '0' ? '' : (hours || '');
    return hours || '0';
  };

  const minutesDisplay = () => {
    if (minutesFocused) return minutes === '0' || minutes === '00' ? '' : (minutes || '');
    const val = minutes || '0';
    return val === '0' || val === '00' ? '00' : val.toString().padStart(2, '0');
  };

  const inputClasses = `
    w-10 h-9 px-1 text-center text-sm font-medium
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
        aria-label={ariaLabel || label || 'Break duration'}
      >
        {/* Hours input */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={hoursDisplay()}
          onChange={(e) => handleHoursInput(e.target.value)}
          onFocus={(e) => { setHoursFocused(true); setTimeout(() => e.target.select(), 0); }}
          onBlur={() => setHoursFocused(false)}
          disabled={disabled}
          placeholder="0"
          className={inputClasses}
          aria-label="Break hours"
        />

        <span className="text-gray-500 text-xs font-medium">h</span>

        {/* Minutes input */}
        <input
          ref={minutesRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={minutesDisplay()}
          onChange={(e) => handleMinutesInput(e.target.value)}
          onFocus={(e) => { setMinutesFocused(true); setTimeout(() => e.target.select(), 0); }}
          onBlur={() => setMinutesFocused(false)}
          disabled={disabled}
          placeholder="0"
          className={inputClasses}
          aria-label="Break minutes"
        />

        <span className="text-gray-500 text-xs font-medium">m</span>
      </div>

      {/* Error indicator */}
      {hasError && (
        <p className="text-red-500 text-xs mt-1" role="alert">
          Invalid break duration
        </p>
      )}
    </div>
  );
};

export default BreakInput;
