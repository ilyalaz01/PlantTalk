// src/services/api.js
/**
 * Main API service for handling general API requests
 */

// Base API URL - would be configured based on environment in real app
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.planttalk.app/v1';

// Helper function for API requests
const fetchWithAuth = async (endpoint, options = {}) => {
  // In a real app, this would include authentication headers
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};

// Plant data API functions
export const fetchPlantData = async (plantId) => {
  return fetchWithAuth(`/plants/${plantId}`);
};

export const updatePlantData = async (plantId, data) => {
  return fetchWithAuth(`/plants/${plantId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const recordCareAction = async (plantId, action) => {
  return fetchWithAuth(`/plants/${plantId}/care`, {
    method: 'POST',
    body: JSON.stringify({ action, timestamp: new Date() }),
  });
};

export const uploadPlantPhoto = async (plantId, formData) => {
  // Special case for file uploads - don't use JSON content type
  return fetch(`${API_BASE_URL}/plants/${plantId}/photos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData, // FormData for file uploads
  });
};

// User API functions
export const getUserProfile = async () => {
  return fetchWithAuth('/user/profile');
};

export const updateUserPreferences = async (preferences) => {
  return fetchWithAuth('/user/preferences', {
    method: 'PATCH',
    body: JSON.stringify(preferences),
  });
};

// src/services/sensorService.js
/**
 * Service for handling sensor data API requests
 */

import { fetchWithAuth } from './api';

// Get latest sensor readings
export const fetchSensorData = async (plantId) => {
  return fetchWithAuth(`/plants/${plantId}/sensors/current`);
};

// Get historical sensor data
export const fetchSensorHistory = async (plantId, options = {}) => {
  const { startDate, endDate, interval } = options;
  let url = `/plants/${plantId}/sensors/history`;
  
  // Add query parameters if provided
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate.toISOString());
  if (endDate) params.append('endDate', endDate.toISOString());
  if (interval) params.append('interval', interval);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  return fetchWithAuth(url);
};

// Calculate health metrics based on sensor data
export const calculateHealthMetrics = async (plantId) => {
  return fetchWithAuth(`/plants/${plantId}/health-metrics`);
};

// Predict optimal care schedule
export const predictCareSchedule = async (plantId) => {
  return fetchWithAuth(`/plants/${plantId}/care-predictions`);
};

// Get soil moisture depletion rate
export const getSoilMoistureDepletion = async (plantId) => {
  return fetchWithAuth(`/plants/${plantId}/moisture-depletion`);
};

// src/services/weatherService.js
/**
 * Service for handling weather API requests
 */

import { fetchWithAuth } from './api';

// Get current weather for user's location
export const getCurrentWeather = async () => {
  return fetchWithAuth('/weather/current');
};

// Get weather forecast
export const getWeatherForecast = async (days = 5) => {
  return fetchWithAuth(`/weather/forecast?days=${days}`);
};

// Get location from browser geolocation
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          resolve(location);
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

// Update user's location manually
export const updateUserLocation = async (location) => {
  return fetchWithAuth('/user/location', {
    method: 'PATCH',
    body: JSON.stringify(location),
  });
};