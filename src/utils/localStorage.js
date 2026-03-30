/**
 * LocalStorage utilities for the timesheet calculator
 */

const STORAGE_KEY = 'timesheet-data';

/**
 * Default structure for timesheet data
 */
const DEFAULT_TIMESHEET_DATA = {
  name: '',
  dateRange: '',
  days: {
    monday: {
      startHour: '',
      startMinute: '0',
      startPeriod: 'AM',
      endHour: '',
      endMinute: '0',
      endPeriod: 'PM',
      breakHours: '0',
      breakMinutes: '0',
      isOvernight: false
    },
    tuesday: {
      startHour: '',
      startMinute: '0',
      startPeriod: 'AM',
      endHour: '',
      endMinute: '0',
      endPeriod: 'PM',
      breakHours: '0',
      breakMinutes: '0',
      isOvernight: false
    },
    wednesday: {
      startHour: '',
      startMinute: '0',
      startPeriod: 'AM',
      endHour: '',
      endMinute: '0',
      endPeriod: 'PM',
      breakHours: '0',
      breakMinutes: '0',
      isOvernight: false
    },
    thursday: {
      startHour: '',
      startMinute: '0',
      startPeriod: 'AM',
      endHour: '',
      endMinute: '0',
      endPeriod: 'PM',
      breakHours: '0',
      breakMinutes: '0',
      isOvernight: false
    },
    friday: {
      startHour: '',
      startMinute: '0',
      startPeriod: 'AM',
      endHour: '',
      endMinute: '0',
      endPeriod: 'PM',
      breakHours: '0',
      breakMinutes: '0',
      isOvernight: false
    },
    saturday: {
      startHour: '',
      startMinute: '0',
      startPeriod: 'AM',
      endHour: '',
      endMinute: '0',
      endPeriod: 'PM',
      breakHours: '0',
      breakMinutes: '0',
      isOvernight: false
    },
    sunday: {
      startHour: '',
      startMinute: '0',
      startPeriod: 'AM',
      endHour: '',
      endMinute: '0',
      endPeriod: 'PM',
      breakHours: '0',
      breakMinutes: '0',
      isOvernight: false
    }
  }
};

/**
 * Save timesheet data to localStorage
 * @param {Object} data - Timesheet data to save
 */
export const saveTimesheetData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving timesheet data to localStorage:', error);
  }
};

/**
 * Load timesheet data from localStorage
 * @returns {Object} - Loaded timesheet data or default data
 */
export const loadTimesheetData = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Merge with default to ensure all required fields exist
      return mergeWithDefaults(parsedData, DEFAULT_TIMESHEET_DATA);
    }
  } catch (error) {
    console.error('Error loading timesheet data from localStorage:', error);
  }
  
  // Return default data if nothing is saved or there's an error
  return { ...DEFAULT_TIMESHEET_DATA };
};

/**
 * Clear timesheet data from localStorage
 */
export const clearTimesheetData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing timesheet data from localStorage:', error);
  }
};

/**
 * Merge saved data with default structure to ensure all fields exist
 * @param {Object} savedData - Data loaded from localStorage
 * @param {Object} defaultData - Default data structure
 * @returns {Object} - Merged data
 */
const mergeWithDefaults = (savedData, defaultData) => {
  const merged = { ...defaultData };
  
  // Merge top-level fields
  if (savedData.name !== undefined) merged.name = savedData.name;
  if (savedData.dateRange !== undefined) merged.dateRange = savedData.dateRange;
  
  // Merge day data
  if (savedData.days) {
    Object.keys(defaultData.days).forEach(day => {
      if (savedData.days[day]) {
        merged.days[day] = { ...defaultData.days[day], ...savedData.days[day] };
      }
    });
  }
  
  return merged;
};

/**
 * Auto-save functionality with debouncing
 * @param {Function} saveFunction - Function to call for saving
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {Function} - Debounced save function
 */
export const createAutoSave = (saveFunction, delay = 300) => {
  let timeoutId;
  
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      saveFunction(...args);
    }, delay);
  };
};

/**
 * Check if localStorage is available
 * @returns {boolean} - True if localStorage is available
 */
export const isLocalStorageAvailable = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Export timesheet data as JSON string
 * @param {Object} data - Timesheet data to export
 * @returns {string} - JSON string representation
 */
export const exportTimesheetData = (data) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting timesheet data:', error);
    return null;
  }
};

/**
 * Import timesheet data from JSON string
 * @param {string} jsonString - JSON string to import
 * @returns {Object|null} - Imported data or null if error
 */
export const importTimesheetData = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    return mergeWithDefaults(data, DEFAULT_TIMESHEET_DATA);
  } catch (error) {
    console.error('Error importing timesheet data:', error);
    return null;
  }
};
