// src/utils/formatUtils.js

/**
 * Utility functions for formatting data
 */

// Format a number with commas (e.g., 1,234,567)
export const formatNumber = (number) => {
    if (number === null || number === undefined) return '';
    
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  // Format a percentage (e.g., 75%)
  export const formatPercentage = (value, decimalPlaces = 0) => {
    if (value === null || value === undefined) return '';
    
    return `${parseFloat(value).toFixed(decimalPlaces)}%`;
  };
  
  // Format a temperature based on units (Fahrenheit or Celsius)
  export const formatTemperature = (value, unit = 'F', decimalPlaces = 1) => {
    if (value === null || value === undefined) return '';
    
    const formattedValue = parseFloat(value).toFixed(decimalPlaces);
    
    if (unit === 'C') {
      return `${formattedValue}°C`;
    } else {
      return `${formattedValue}°F`;
    }
  };
  
  // Convert Fahrenheit to Celsius
  export const fahrenheitToCelsius = (fahrenheit) => {
    return (fahrenheit - 32) * 5 / 9;
  };
  
  // Convert Celsius to Fahrenheit
  export const celsiusToFahrenheit = (celsius) => {
    return (celsius * 9 / 5) + 32;
  };
  
  // Capitalize first letter of a string
  export const capitalizeFirst = (string) => {
    if (!string) return '';
    
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // Capitalize first letter of each word
  export const capitalizeEachWord = (string) => {
    if (!string) return '';
    
    return string
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Format a file size (e.g., 1.5 MB)
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Truncate text with ellipsis
  export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    return text.slice(0, maxLength) + '...';
  };
  
  // Format a phone number as (XXX) XXX-XXXX
  export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Remove all non-digit characters
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    
    // Check if the input is of correct length
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    
    return phoneNumber;
  };
  
  // Format a value with appropriate unit
  export const formatWithUnit = (value, unit, decimalPlaces = 0) => {
    if (value === null || value === undefined) return '';
    
    const formattedValue = parseFloat(value).toFixed(decimalPlaces);
    
    if (unit) {
      // Add space only if unit is not a symbol like % or °
      const symbolUnits = ['%', '°', '°F', '°C'];
      const needsSpace = !symbolUnits.includes(unit);
      
      return `${formattedValue}${needsSpace ? ' ' : ''}${unit}`;
    } else {
      return formattedValue;
    }
  };
  
  // Format a time duration in seconds to MM:SS
  export const formatDuration = (seconds) => {
    if (seconds === null || seconds === undefined) return '';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format a name as initials (e.g., John Doe -> JD)
  export const getInitials = (name) => {
    if (!name) return '';
    
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  // Format a currency value
  export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
    if (value === null || value === undefined) return '';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
  };
  
  // Format a list as a comma-separated string
  export const formatList = (items, conjunction = 'and') => {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    
    if (items.length === 2) {
      return `${items[0]} ${conjunction} ${items[1]}`;
    }
    
    const lastItem = items[items.length - 1];
    const otherItems = items.slice(0, items.length - 1);
    
    return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
  };
  
  // Format a number with specified decimals
  export const formatDecimal = (number, decimals = 2) => {
    if (number === null || number === undefined) return '';
    
    return parseFloat(number).toFixed(decimals);
  };
  
  // Format a date range for a pleasant display
  export const formatDateRange = (startDate, endDate, format = 'long') => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Options for date formatting
    let options;
    if (format === 'short') {
      options = { month: 'short', day: 'numeric' };
    } else if (format === 'medium') {
      options = { month: 'short', day: 'numeric', year: 'numeric' };
    } else {
      options = { month: 'long', day: 'numeric', year: 'numeric' };
    }
    
    // If dates are in the same year
    if (start.getFullYear() === end.getFullYear()) {
      // If dates are in the same month
      if (start.getMonth() === end.getMonth()) {
        return `${start.toLocaleDateString('en-US', { ...options, year: undefined })} - ${end.getDate()}, ${end.getFullYear()}`;
      } else {
        return `${start.toLocaleDateString('en-US', { ...options, year: undefined })} - ${end.toLocaleDateString('en-US', options)}`;
      }
    } else {
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    }
  };
  
  // Format bytes to human-readable format for sensor data
  export const formatSensorValue = (value, sensorType) => {
    if (value === null || value === undefined) return '';
    
    switch (sensorType) {
      case 'temperature':
        return formatTemperature(value);
      case 'moisture':
      case 'humidity':
      case 'light':
        return formatPercentage(value);
      default:
        return value.toString();
    }
  };
  
  // Format sensor status for display
  export const formatSensorStatus = (status) => {
    if (!status) return '';
    
    const statusMap = {
      'low': 'Low',
      'optimal': 'Optimal',
      'high': 'High',
      'error': 'Error'
    };
    
    return statusMap[status] || capitalizeFirst(status);
  };
  
  // Format a plant care action for display
  export const formatCareAction = (action) => {
    if (!action) return '';
    
    const actionMap = {
      'watered': 'Watered',
      'fertilized': 'Fertilized',
      'pruned': 'Pruned',
      'repotted': 'Repotted',
      'misted': 'Misted',
      'rotated': 'Rotated',
      'cleaned': 'Cleaned leaves',
      'checked': 'Checked on'
    };
    
    return actionMap[action] || capitalizeFirst(action);
  };
  
  // Get icon for plant care action
  export const getCareActionIcon = (action) => {
    if (!action) return '🌱';
    
    const iconMap = {
      'watered': '💧',
      'fertilized': '🧪',
      'pruned': '✂️',
      'repotted': '🪴',
      'misted': '💦',
      'rotated': '🔄',
      'cleaned': '🧹',
      'checked': '👁️'
    };
    
    return iconMap[action] || '🌱';
  };
  
  // Get color for sensor status
  export const getSensorStatusColor = (status, theme) => {
    if (!status || !theme) return '';
    
    const colorMap = {
      'low': theme.colors.status.danger,
      'optimal': theme.colors.status.healthy,
      'high': theme.colors.status.warning,
      'error': theme.colors.status.danger
    };
    
    return colorMap[status] || theme.colors.primary;
  };