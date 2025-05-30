/**
 * ==========================================
 * MOCK API Service (No real network calls)
 * ==========================================
 * This file simulates API responses for development when the backend is unavailable.
 */

// Simulate network delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const MOCK_DELAY = 300; // milliseconds

console.log('%c MOCK API LOADED ', 'background: orange; color: black; font-weight: bold;');

// --- Mock Data ---

const mockPlant = {
  id: 'plant123',
  name: 'Ficus Fred',
  species: 'Ficus Lyrata',
  lastWatered: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  lastFertilized: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
  optimalConditions: {
    temperature: { min: 18, max: 24 }, // Celsius
    humidity: { min: 40, max: 60 }, // Percent
    light: { min: 500, max: 2000 }, // Lux
    moisture: { min: 30, max: 70 } // Percent
  },
  photos: [
    { id: 'photo1', url: 'https://via.placeholder.com/300/92c952', uploadedAt: new Date().toISOString() },
    { id: 'photo2', url: 'https://via.placeholder.com/300/771796', uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString() }
  ],
  careHistory: [
    { id: 'care1', action: 'watered', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'care2', action: 'fertilized', timestamp: new Date(Date.now() - 86400000 * 14).toISOString() },
    { id: 'care3', action: 'watered', timestamp: new Date(Date.now() - 86400000 * 7).toISOString() },
  ],
  careSchedule: {
    watering: 'Every 5-7 days',
    fertilizing: 'Once a month during growing season'
  }
};

const mockUserProfile = {
  id: 'user001',
  name: 'Ilya',
  email: 'ilya.dev@example.com',
  streak: 5, // Example streak
  preferences: {
    units: 'metric', // 'metric' or 'imperial'
    notifications: {
      watering: true,
      lowBattery: false
    }
  },
  linkedPlants: ['plant123'] // IDs of plants associated with user
};

// --- Mock API Functions ---

// Helper function simulation (not really used by mocks below but keeps structure)
export const fetchWithAuth = async (endpoint, options = {}) => {
  console.warn('[MOCK API] fetchWithAuth called (should ideally be bypassed by mocks)', endpoint, options);
  await delay(MOCK_DELAY);
  // In a real mock, you might route based on endpoint here, but we mock specific functions below
  return Promise.resolve({ message: `Mock response for ${endpoint}` });
};

// Plant data API functions
export const fetchPlantData = async (plantId) => {
  console.log('[MOCK API] Fetching plant data for ID:', plantId);
  await delay(MOCK_DELAY);
  // Return a copy to prevent accidental modification of the mock source
  return Promise.resolve({ ...mockPlant, id: plantId });
};

export const updatePlantData = async (plantId, data) => {
  console.log('[MOCK API] Updating plant data for ID:', plantId, data);
  await delay(MOCK_DELAY);
  // Simulate successful update by returning the updated data merged with mock
  const updatedPlant = { ...mockPlant, ...data, id: plantId };
  // You could update the main mockPlant here if you want persistence during the session
  // Object.assign(mockPlant, data);
  return Promise.resolve(updatedPlant);
};

export const recordCareAction = async (plantId, action) => {
  console.log('[MOCK API] Recording care action for ID:', plantId, action);
  await delay(MOCK_DELAY);
  const newAction = { id: `care${Date.now()}`, ...action };
  // Optionally add to mockPlant.careHistory for session persistence
  // mockPlant.careHistory.unshift(newAction);
  return Promise.resolve({ success: true, action: newAction });
};

export const uploadPlantPhoto = async (plantId, formData) => {
  console.log('[MOCK API] Uploading plant photo for ID:', plantId, /* formData cannot be easily logged */);
  await delay(MOCK_DELAY * 2); // Simulate slightly longer upload
  const newPhoto = {
    id: `photo${Date.now()}`,
    url: `https://via.placeholder.com/300/${Math.floor(Math.random() * 16777215).toString(16)}`, // Random placeholder
    uploadedAt: new Date().toISOString()
  };
  // Optionally add to mockPlant.photos for session persistence
  // mockPlant.photos.unshift(newPhoto);
  return Promise.resolve({ success: true, photo: newPhoto });
};

// User API functions
export const getUserProfile = async () => {
  console.log('[MOCK API] Fetching user profile');
  await delay(MOCK_DELAY);
  return Promise.resolve({ ...mockUserProfile }); // Return a copy
};

export const updateUserPreferences = async (preferences) => {
  console.log('[MOCK API] Updating user preferences', preferences);
  await delay(MOCK_DELAY);
  // Simulate success by returning the updated preferences merged with mock
  const updatedProfile = { ...mockUserProfile, preferences: { ...mockUserProfile.preferences, ...preferences } };
  // You could update the main mockUserProfile here if you want persistence during the session
  // Object.assign(mockUserProfile.preferences, preferences);
  return Promise.resolve(updatedProfile);
};


// Note: The original Base URL and fetch implementation are removed/commented out
// const API_BASE_URL = ...