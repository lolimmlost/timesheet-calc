import React from 'react';

/**
 * BreakInput component for entering break duration
 * Uses text inputs for quick typing
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
          value={hours}
          onChange={(e) => handleHoursInput(e.target.value)}
          disabled={disabled}
          placeholder="0"
          className={inputClasses}
          aria-label="Break hours"
        />

        <span className="text-gray-500 text-xs font-medium">h</span>

        {/* Minutes input */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={minutes}
          onChange={(e) => handleMinutesInput(e.target.value)}
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
