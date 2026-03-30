/**
 * Time calculation utilities for the timesheet calculator
 */

/**
 * Convert 12-hour time to 24-hour format
 * @param {number} hour - Hour (1-12)
 * @param {string} period - 'AM' or 'PM'
 * @returns {number} - Hour in 24-hour format (0-23)
 */
export const convertTo24Hour = (hour, period) => {
  if (period === 'AM') {
    return hour === 12 ? 0 : hour;
  } else {
    return hour === 12 ? 12 : hour + 12;
  }
};

/**
 * Convert time components to total minutes since midnight
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {number} - Total minutes since midnight
 */
export const timeToMinutes = (hour, minute) => {
  return hour * 60 + minute;
};

/**
 * Convert minutes to decimal hours
 * @param {number} minutes - Total minutes
 * @returns {number} - Decimal hours (e.g., 7.5 for 7 hours 30 minutes)
 */
export const minutesToDecimalHours = (minutes) => {
  return minutes / 60;
};

/**
 * Calculate daily hours worked
 * @param {Object} startTime - { hour, minute, period }
 * @param {Object} endTime - { hour, minute, period }
 * @param {Object} breakTime - { hours, minutes }
 * @param {boolean} isOvernight - Whether the shift spans midnight
 * @returns {number} - Decimal hours worked
 */
export const calculateDailyHours = (startTime, endTime, breakTime = { hours: 0, minutes: 0 }, isOvernight = false) => {
  // Validate inputs
  if (!startTime || !endTime) return 0;
  
  const { hour: startHour, minute: startMinute, period: startPeriod } = startTime;
  const { hour: endHour, minute: endMinute, period: endPeriod } = endTime;
  const { hours: breakHours, minutes: breakMinutes } = breakTime;
  
  // Convert to 24-hour format
  const start24Hour = convertTo24Hour(startHour, startPeriod);
  const end24Hour = convertTo24Hour(endHour, endPeriod);
  
  // Convert to minutes
  const startMinutes = timeToMinutes(start24Hour, startMinute);
  let endMinutes = timeToMinutes(end24Hour, endMinute);
  
  // Handle overnight shifts
  if (isOvernight || endMinutes < startMinutes) {
    endMinutes += 24 * 60; // Add 24 hours to end time
  }
  
  // Calculate work duration in minutes
  const workMinutes = endMinutes - startMinutes;
  
  // Calculate break duration in minutes
  const breakTotalMinutes = breakHours * 60 + breakMinutes;
  
  // Calculate total worked minutes
  const totalWorkedMinutes = Math.max(0, workMinutes - breakTotalMinutes);
  
  return minutesToDecimalHours(totalWorkedMinutes);
};

/**
 * Calculate weekly total hours
 * @param {Array} dailyHours - Array of daily hours
 * @returns {number} - Total weekly hours
 */
export const calculateWeeklyTotal = (dailyHours) => {
  return dailyHours.reduce((total, hours) => total + hours, 0);
};

/**
 * Format decimal hours to time string (HH:MM)
 * @param {number} decimalHours - Decimal hours
 * @returns {string} - Formatted time string
 */
export const formatDecimalToTime = (decimalHours) => {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Format hours for display with 2 decimal places
 * @param {number} hours - Hours to format
 * @returns {string} - Formatted hours string
 */
export const formatHoursDisplay = (hours) => {
  return hours.toFixed(2);
};

/**
 * Validate time input
 * @param {number} hour - Hour value
 * @param {number} minute - Minute value
 * @param {string} period - AM/PM period
 * @returns {boolean} - True if valid
 */
export const validateTimeInput = (hour, minute, period) => {
  // Check if hour is valid (1-12 for 12-hour format)
  if (!hour || hour < 1 || hour > 12) return false;
  
  // Check if minute is valid (0-59)
  if (minute === null || minute === undefined || minute < 0 || minute > 59) return false;
  
  // Check if period is valid
  if (!period || !['AM', 'PM'].includes(period)) return false;
  
  return true;
};

/**
 * Validate break input
 * @param {number} hours - Break hours
 * @param {number} minutes - Break minutes
 * @returns {boolean} - True if valid
 */
export const validateBreakInput = (hours, minutes) => {
  if (hours === null || hours === undefined || hours < 0 || hours > 24) return false;
  if (minutes === null || minutes === undefined || minutes < 0 || minutes > 59) return false;
  return true;
};

/**
 * Check if end time is valid for given start time
 * @param {Object} startTime - Start time object
 * @param {Object} endTime - End time object
 * @param {boolean} isOvernight - Whether shift is overnight
 * @returns {boolean} - True if valid
 */
export const isValidTimeRange = (startTime, endTime, isOvernight = false) => {
  if (!validateTimeInput(startTime?.hour, startTime?.minute, startTime?.period) ||
      !validateTimeInput(endTime?.hour, endTime?.minute, endTime?.period)) {
    return false;
  }
  
  const start24Hour = convertTo24Hour(startTime.hour, startTime.period);
  const end24Hour = convertTo24Hour(endTime.hour, endTime.period);
  
  if (!isOvernight && end24Hour < start24Hour) {
    return false;
  }
  
  return true;
};

/**
 * Generate time options for dropdown
 * @param {string} type - 'hour' or 'minute'
 * @returns {Array} - Array of options
 */
export const generateTimeOptions = (type) => {
  if (type === 'hour') {
    return Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: (i + 1).toString().padStart(2, '0')
    }));
  } else if (type === 'minute') {
    return Array.from({ length: 60 }, (_, i) => ({
      value: i,
      label: i.toString().padStart(2, '0')
    }));
  }
  return [];
};
