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

// ==== Google Sheets Sensor History (CORS-friendly version) ====

const SHEET_ID = '1kRgZwsISHOaA0EtDxQPibWbpdy-TMQnD7nsmjhAXNWo';

export const fetchSensorHistory = async () => {
  try {
    // Use CSV export which is more CORS-friendly than JSON API
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0`;
    
    // Add mode: 'cors' to handle CORS properly
    const response = await fetch(csvUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'text/csv,text/plain,*/*',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('CSV Response received:', csvText.substring(0, 200));
    
    // Parse CSV data
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) {
      throw new Error('No data rows found in CSV');
    }
    
    // Skip header row and parse data
    const dataRows = lines.slice(1).map((line, index) => {
      try {
        // Handle CSV with potential commas in values
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        const cleanValues = values.map(val => val.replace(/"/g, '').trim());
        
        const [timestamp, moisture, temperature, humidity] = cleanValues;
        
        if (!timestamp || !moisture || !temperature || !humidity) {
          console.warn(`Skipping row ${index + 2}: missing data`, cleanValues);
          return null;
        }
        
        const parsedData = {
          timestamp: new Date(timestamp),
          soilMoisture: parseFloat(moisture),
          temperature: parseFloat(temperature),
          humidity: parseFloat(humidity),
          light: 65
        };
        
        // Validate parsed data
        if (isNaN(parsedData.timestamp.getTime()) || 
            isNaN(parsedData.soilMoisture) || 
            isNaN(parsedData.temperature) || 
            isNaN(parsedData.humidity)) {
          console.warn(`Skipping row ${index + 2}: invalid data`, parsedData);
          return null;
        }
        
        return parsedData;
      } catch (error) {
        console.warn(`Error parsing row ${index + 2}:`, error, line);
        return null;
      }
    }).filter(row => row !== null);
    
    console.log(`Successfully parsed ${dataRows.length} rows from CSV`);
    return dataRows;
    
  } catch (error) {
    console.error('Error fetching sensor history:', error);
    
    // If CORS is still blocking, try using a CORS proxy (not recommended for production)
    if (error.message.includes('CORS') || error instanceof TypeError) {
      console.warn('CORS error detected. Falling back to alternative method...');
      
      try {
        // Alternative: Try the JSON API with a CORS proxy (use sparingly)
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const targetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=0`;
        const proxiedUrl = proxyUrl + encodeURIComponent(targetUrl);
        
        const proxyResponse = await fetch(proxiedUrl);
        const proxyData = await proxyResponse.json();
        
        if (proxyData.contents) {
          const text = proxyData.contents;
          const jsonStart = text.indexOf('(') + 1;
          const jsonEnd = text.lastIndexOf(')');
          const jsonString = text.substring(jsonStart, jsonEnd);
          const json = JSON.parse(jsonString);
          
          if (json.table && json.table.rows) {
            return json.table.rows.map(row => {
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
            }).filter(row => row !== null);
          }
        }
      } catch (proxyError) {
        console.error('Proxy method also failed:', proxyError);
      }
    }
    
    // Return empty array instead of throwing
    console.warn('Returning empty array due to fetch failure');
    return [];
  }
};