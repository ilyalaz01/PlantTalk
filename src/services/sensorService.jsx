// src/services/sensorService.jsx

import { fetchWithAuth } from './api';

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
const SHEET_NAME = 'Basil Logger'; // Sheet tab name

export const fetchSensorHistory = async () => {
  try {
    // Use Google Sheets JSON API endpoint (this is what returns the JSON with row.c structure)
    const jsonUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
    
    const response = await fetch(jsonUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log('Raw response:', text.substring(0, 200) + '...');
    
    // Google returns JSON wrapped in JS callback: "google.visualization.Query.setResponse(...)"
    // Extract the JSON part
    const jsonStart = text.indexOf('(') + 1;
    const jsonEnd = text.lastIndexOf(')');
    const jsonString = text.substring(jsonStart, jsonEnd);
    
    const json = JSON.parse(jsonString);
    console.log('Parsed JSON:', json);
    
    // Check if we have table data
    if (!json.table || !json.table.rows) {
      throw new Error('No table data found in response');
    }
    
    const rows = json.table.rows;
    
    // Map the rows to your data format
    const mappedData = rows.map(row => {
      // Handle cases where cells might be null or undefined
      const cells = row.c || [];
      const [timestampCell, moistureCell, temperatureCell, humidityCell] = cells;
      
      // Skip rows with missing essential data
      if (!timestampCell || !moistureCell || !temperatureCell || !humidityCell) {
        return null;
      }
      
      return {
        timestamp: new Date(timestampCell.v),
        soilMoisture: Number(moistureCell.v),
        temperature: Number(temperatureCell.v),
        humidity: Number(humidityCell.v),
        light: 65, // Optional fallback
      };
    }).filter(row => row !== null && !isNaN(row.timestamp.getTime())); // Filter out null rows and invalid dates
    
    console.log('Mapped data:', mappedData);
    return mappedData;
    
  } catch (error) {
    console.error('Error fetching sensor history:', error);
    
    // Try alternative URL format (without sheet name)
    try {
      const alternativeUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=0`;
      
      const response = await fetch(alternativeUrl);
      if (!response.ok) {
        throw new Error(`Alternative fetch failed: ${response.statusText}`);
      }
      
      const text = await response.text();
      const jsonStart = text.indexOf('(') + 1;
      const jsonEnd = text.lastIndexOf(')');
      const jsonString = text.substring(jsonStart, jsonEnd);
      
      const json = JSON.parse(jsonString);
      
      if (!json.table || !json.table.rows) {
        throw new Error('No table data found in alternative response');
      }
      
      const rows = json.table.rows;
      
      return rows.map(row => {
        const cells = row.c || [];
        const [timestampCell, moistureCell, temperatureCell, humidityCell] = cells;
        
        if (!timestampCell || !moistureCell || !temperatureCell || !humidityCell) {
          return null;
        }
        
        return {
          timestamp: new Date(timestampCell.v),
          soilMoisture: Number(moistureCell.v),
          temperature: Number(temperatureCell.v),
          humidity: Number(humidityCell.v),
          light: 65,
        };
      }).filter(row => row !== null && !isNaN(row.timestamp.getTime()));
      
    } catch (alternativeError) {
      console.error('Alternative fetch also failed:', alternativeError);
      
      // Return empty array instead of hardcoded data
      return [];
    }
  }
};