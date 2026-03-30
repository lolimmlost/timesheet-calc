import React from 'react';
import TimeInput from './TimeInput';
import BreakInput from './BreakInput';
import { 
  calculateDailyHours, 
  formatHoursDisplay, 
  validateTimeInput, 
  validateBreakInput,
  isValidTimeRange 
} from '../utils/timeCalculations';

/**
 * DayRow component for a single day's timesheet entry
 * @param {Object} props - Component props
 * @param {string} props.day - Day name (e.g., 'monday')
 * @param {string} props.dayLabel - Display label for the day
 * @param {Object} props.dayData - Data for this day
 * @param {Function} props.onDayChange - Handler for day data changes
 * @param {boolean} props.isOvernight - Whether this is an overnight shift
 */
const DayRow = ({ 
  day, 
  dayLabel, 
  dayData, 
  onDayChange,
  isOvernight = false 
}) => {
  const {
    startHour,
    startMinute,
    startPeriod,
    endHour,
    endMinute,
    endPeriod,
    breakHours,
    breakMinutes,
    isOvernight: dayIsOvernight
  } = dayData;

  // Calculate daily hours
  const dailyHours = calculateDailyHours(
    startHour ? { hour: parseInt(startHour), minute: parseInt(startMinute), period: startPeriod } : null,
    endHour ? { hour: parseInt(endHour), minute: parseInt(endMinute), period: endPeriod } : null,
    { hours: parseInt(breakHours), minutes: parseInt(breakMinutes) },
    dayIsOvernight || isOvernight
  );

  // Validate inputs
  const hasStartTimeError = startHour && !validateTimeInput(parseInt(startHour), parseInt(startMinute), startPeriod);
  const hasEndTimeError = endHour && !validateTimeInput(parseInt(endHour), parseInt(endMinute), endPeriod);
  const hasBreakError = !validateBreakInput(parseInt(breakHours), parseInt(breakMinutes));
  const hasTimeRangeError = startHour && endHour && !isValidTimeRange(
    { hour: parseInt(startHour), minute: parseInt(startMinute), period: startPeriod },
    { hour: parseInt(endHour), minute: parseInt(endMinute), period: endPeriod },
    dayIsOvernight || isOvernight
  );

  // Handle field changes
  const handleFieldChange = (field, value) => {
    onDayChange(day, field, value);
  };

  const handleStartTimeChange = (field, value) => {
    handleFieldChange(`start${field}`, value);
  };

  const handleEndTimeChange = (field, value) => {
    handleFieldChange(`end${field}`, value);
  };

  const handleBreakChange = (field, value) => {
    handleFieldChange(`break${field}`, value);
  };

  const handleOvernightToggle = (checked) => {
    handleFieldChange('isOvernight', checked);
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Day */}
      <td className="py-3 px-2 md:px-4 text-sm font-medium text-gray-900">
        {dayLabel}
      </td>

      {/* Starting Time */}
      <td className="py-3 px-2 md:px-4">
        <TimeInput
          hour={startHour}
          minute={startMinute}
          period={startPeriod}
          onHourChange={(value) => handleStartTimeChange('Hour', value)}
          onMinuteChange={(value) => handleStartTimeChange('Minute', value)}
          onPeriodChange={(value) => handleStartTimeChange('Period', value)}
          hasError={hasStartTimeError}
          ariaLabel={`${dayLabel} start time`}
        />
      </td>

      {/* Ending Time */}
      <td className="py-3 px-2 md:px-4">
        <TimeInput
          hour={endHour}
          minute={endMinute}
          period={endPeriod}
          onHourChange={(value) => handleEndTimeChange('Hour', value)}
          onMinuteChange={(value) => handleEndTimeChange('Minute', value)}
          onPeriodChange={(value) => handleEndTimeChange('Period', value)}
          hasError={hasEndTimeError || hasTimeRangeError}
          ariaLabel={`${dayLabel} end time`}
        />
      </td>

      {/* Break Deduction */}
      <td className="py-3 px-2 md:px-4">
        <BreakInput
          hours={breakHours}
          minutes={breakMinutes}
          onHoursChange={(value) => handleBreakChange('Hours', value)}
          onMinutesChange={(value) => handleBreakChange('Minutes', value)}
          hasError={hasBreakError}
          ariaLabel={`${dayLabel} break duration`}
        />
      </td>

      {/* Total Hours */}
      <td className="py-3 px-2 md:px-4 text-right">
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-900 min-w-[60px] text-right">
            {formatHoursDisplay(dailyHours)}
          </span>
          {(hasStartTimeError || hasEndTimeError || hasTimeRangeError || hasBreakError) && (
            <span className="text-xs text-red-500 mt-1">Invalid</span>
          )}
        </div>
      </td>

      {/* Overnight Shift Checkbox */}
      <td className="py-3 px-2 md:px-4 text-center">
        <label className="flex items-center justify-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={dayIsOvernight || isOvernight}
            onChange={(e) => handleOvernightToggle(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            aria-label={`${dayLabel} overnight shift`}
          />
          <span className="text-xs text-gray-600">Overnight</span>
        </label>
      </td>
    </tr>
  );
};

export default DayRow;
