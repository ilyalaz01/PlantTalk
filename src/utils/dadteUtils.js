// src/utils/dateUtils.js

/**
 * Utility functions for date and time handling
 */

// Format date as "Month Day, Year" (e.g., "June 15, 2023")
export const formatFullDate = (date) => {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format date as "Month Day" (e.g., "June 15")
  export const formatShortDate = (date) => {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format date as "Mon DD" (e.g., "Jun 15")
  export const formatCompactDate = (date) => {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time as "HH:MM AM/PM" (e.g., "2:30 PM")
  export const formatTime = (date) => {
    if (!date) return '';
    
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Format date and time together
  export const formatDateTime = (date) => {
    if (!date) return '';
    
    return `${formatShortDate(date)} at ${formatTime(date)}`;
  };
  
  // Get relative time (e.g., "2 hours ago", "yesterday", "just now")
  export const getRelativeTime = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
    } else if (diffDay === 1) {
      return 'yesterday';
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
    } else {
      return formatShortDate(date);
    }
  };
  
  // Check if a date is today
  export const isToday = (date) => {
    if (!date) return false;
    
    const today = new Date();
    const checkDate = new Date(date);
    
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };
  
  // Check if a date is yesterday
  export const isYesterday = (date) => {
    if (!date) return false;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const checkDate = new Date(date);
    
    return (
      checkDate.getDate() === yesterday.getDate() &&
      checkDate.getMonth() === yesterday.getMonth() &&
      checkDate.getFullYear() === yesterday.getFullYear()
    );
  };
  
  // Check if a date is within the last N days
  export const isWithinDays = (date, days) => {
    if (!date) return false;
    
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    return diffDays <= days;
  };
  
  // Format the duration between two dates
  export const formatDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    
    // Convert to appropriate unit
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} day${diffDay === 1 ? '' : 's'}`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour === 1 ? '' : 's'}`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin === 1 ? '' : 's'}`;
    } else {
      return `${diffSec} second${diffSec === 1 ? '' : 's'}`;
    }
  };
  
  // Get the start of the day
  export const startOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };
  
  // Get the end of the day
  export const endOfDay = (date) => {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };
  
  // Get the start of the week (Sunday)
  export const startOfWeek = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    newDate.setDate(newDate.getDate() - day);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };
  
  // Get the end of the week (Saturday)
  export const endOfWeek = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    newDate.setDate(newDate.getDate() + (6 - day));
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  };
  
  // Get an array of dates for a given range
  export const getDateRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
    
    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };
  
  // Get the day of the week as a string
  export const getDayOfWeek = (date, format = 'long') => {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString('en-US', {
      weekday: format
    });
  };
  
  // Add days to a date
  export const addDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  };
  
  // Subtract days from a date
  export const subtractDays = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - days);
    return newDate;
  };
  
  // Format a date range
  export const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If dates are in the same year
    if (start.getFullYear() === end.getFullYear()) {
      // If dates are in the same month
      if (start.getMonth() === end.getMonth()) {
        return `${formatFullDate(start)} - ${end.getDate()}, ${end.getFullYear()}`;
      } else {
        return `${formatShortDate(start)} - ${formatShortDate(end)}, ${end.getFullYear()}`;
      }
    } else {
      return `${formatFullDate(start)} - ${formatFullDate(end)}`;
    }
  };