// src/services/api.js
/**
 * Main API service for handling general API requests
 */

// Base API URL - would be configured based on environment in real app
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.planttalk.app/v1';

// Helper function for API requests - export this for other services to use
export const fetchWithAuth = async (endpoint, options = {}) => {
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