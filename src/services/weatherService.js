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