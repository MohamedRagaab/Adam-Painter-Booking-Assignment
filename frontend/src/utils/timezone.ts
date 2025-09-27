/**
 * Timezone utility functions for handling UTC conversion
 */

/**
 * Converts a local datetime string to UTC ISO string
 * @param localDateTimeString - Local datetime string (e.g., from datetime-local input)
 * @returns UTC ISO string (e.g., "2025-01-15T14:30:00.000Z")
 */
export const convertToUTC = (localDateTimeString: string): string => {
  if (!localDateTimeString) {
    throw new Error('DateTime string is required');
  }
  
  const localDate = new Date(localDateTimeString);
  
  if (isNaN(localDate.getTime())) {
    throw new Error('Invalid datetime string');
  }
  
  return localDate.toISOString();
};

/**
 * Converts a UTC ISO string to local datetime string for display
 * @param utcIsoString - UTC ISO string
 * @returns Local datetime string for datetime-local input
 */
export const convertFromUTCToLocal = (utcIsoString: string): string => {
  if (!utcIsoString) {
    throw new Error('UTC ISO string is required');
  }
  
  const utcDate = new Date(utcIsoString);
  
  if (isNaN(utcDate.getTime())) {
    throw new Error('Invalid UTC ISO string');
  }
  
  // Format for datetime-local input (YYYY-MM-DDTHH:mm)
  const year = utcDate.getFullYear();
  const month = String(utcDate.getMonth() + 1).padStart(2, '0');
  const day = String(utcDate.getDate()).padStart(2, '0');
  const hours = String(utcDate.getHours()).padStart(2, '0');
  const minutes = String(utcDate.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Validates that a datetime string is in the future
 * @param datetimeString - Datetime string to validate
 * @returns true if datetime is in the future
 */
export const isFutureDateTime = (datetimeString: string): boolean => {
  const date = new Date(datetimeString);
  const now = new Date();
  return date > now;
};

/**
 * Validates that end time is after start time
 * @param startTime - Start datetime string
 * @param endTime - End datetime string
 * @returns true if end time is after start time
 */
export const isValidTimeRange = (startTime: string, endTime: string): boolean => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return end > start;
};
