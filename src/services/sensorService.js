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

