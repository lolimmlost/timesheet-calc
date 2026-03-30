import React from 'react';

/**
 * TimeInput component for selecting hour, minute, and AM/PM
 * Uses text inputs for quick typing (e.g., "9" for 9, "10" for 10)
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
    } else if (parsed > 12 && parsed <= 99) {
      const lastDigit = parsed % 10;
      if (lastDigit >= 1 && lastDigit <= 9) {
        onHourChange(lastDigit.toString());
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
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={hour}
          onChange={(e) => handleHourInput(e.target.value)}
          disabled={disabled}
          placeholder="H"
          className={inputClasses}
          aria-label={`${label || 'Time'} hour`}
        />

        <span className="text-gray-500 font-medium">:</span>

        {/* Minute input */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={minute === '0' ? '00' : (minute || '').toString().padStart(2, '0')}
          onChange={(e) => handleMinuteInput(e.target.value)}
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
