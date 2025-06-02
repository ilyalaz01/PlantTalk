// src/services/sensorService.jsx

import { fetchWithAuth } from './api';
//import { google } from 'googleapis';
//import credentials from '../../credentials.json';

// ==== Cloud API Requests (if applicable in your system) ====

// Get latest sensor readings
export const fetchSensorData = async (plantId) => {
  return fetchWithAuth(`/plants/${plantId}/sensors/current`);
};

// Get historical sensor data from backend
export const fetchBackendSensorHistory = async (plantId, options = {}) => {
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

// ==== Google Sheets Sensor History (for real data logging) ====

const SHEET_ID = '1kRgZwsISHOaA0EtDxQPibWbpdy-TMQnD7nsmjhAXNWo';
const SHEET_NAME = 'Basil Logger';

export const fetchSensorHistory = async () => {
  try {
    const jsonUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
    const response = await fetch(jsonUrl);
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);

    const text = await response.text();
    const jsonStart = text.indexOf('(') + 1;
    const jsonEnd = text.lastIndexOf(')');
    const jsonString = text.substring(jsonStart, jsonEnd);
    const json = JSON.parse(jsonString);

    if (!json.table || !json.table.rows) throw new Error('No table data found in response');

    return json.table.rows
      .map(row => {
        const cells = row.c || [];
        const [timestampCell, moistureCell, temperatureCell, humidityCell] = cells;
        if (!timestampCell || !moistureCell || !temperatureCell || !humidityCell) return null;
        return {
          timestamp: new Date(timestampCell.v),
          soilMoisture: Number(moistureCell.v),
          temperature: Number(temperatureCell.v),
          humidity: Number(humidityCell.v),
          light: 65,
        };
      })
      .filter(row => row !== null && !isNaN(row.timestamp.getTime()));
  } catch (error) {
    console.error('Primary fetch failed:', error);
    // Try fallback
    try {
      const fallbackUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=0`;
      const response = await fetch(fallbackUrl);
      if (!response.ok) throw new Error(`Fallback fetch failed: ${response.statusText}`);
      const text = await response.text();
      const jsonStart = text.indexOf('(') + 1;
      const jsonEnd = text.lastIndexOf(')');
      const jsonString = text.substring(jsonStart, jsonEnd);
      const json = JSON.parse(jsonString);

      if (!json.table || !json.table.rows) throw new Error('No table data in fallback');

      return json.table.rows
        .map(row => {
          const cells = row.c || [];
          const [timestampCell, moistureCell, temperatureCell, humidityCell] = cells;
          if (!timestampCell || !moistureCell || !temperatureCell || !humidityCell) return null;
          return {
            timestamp: new Date(timestampCell.v),
            soilMoisture: Number(moistureCell.v),
            temperature: Number(temperatureCell.v),
            humidity: Number(humidityCell.v),
            light: 65,
          };
        })
        .filter(row => row !== null && !isNaN(row.timestamp.getTime()));
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
};