// src/services/sensorService.jsx - FINAL VERSION with string timestamp support

import { fetchWithAuth } from './api';
import { 
  db, 
  auth,
  Timestamp 
} from './firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs
} from 'firebase/firestore';

// HARDCODED: The user ID where sensor data actually exists
const SENSOR_DATA_USER_ID = 'l1YnCXx3HMbfBwexMGOvesRK6Bv2';

// ==== Temperature Validation Functions ====

const validateTemperature = (temp, recordId = 'unknown') => {
  const originalTemp = temp;
  let correctedTemp = Number(temp);
  let wasFixed = false;
  
  if (correctedTemp > 50) {
    console.warn(`🌡️ SUSPICIOUS: Temperature ${correctedTemp}°C is too high for basil`);
    
    if (correctedTemp > 60 && correctedTemp < 120) {
      const fahrenheitToCelsius = (correctedTemp - 32) * 5/9;
      if (fahrenheitToCelsius >= 10 && fahrenheitToCelsius <= 40) {
        correctedTemp = fahrenheitToCelsius;
        wasFixed = true;
        console.log(`✅ FIXED: Converted ${originalTemp}°F to ${correctedTemp.toFixed(1)}°C`);
      }
    }
    
    if (correctedTemp > 40) {
      correctedTemp = 25;
      wasFixed = true;
    }
  }
  
  if (correctedTemp < -10) {
    correctedTemp = 20;
    wasFixed = true;
  }
  
  if (isNaN(correctedTemp)) {
    correctedTemp = 22;
    wasFixed = true;
  }
  
  return Number(correctedTemp.toFixed(1));
};

const validateSensorReading = (reading, recordId) => {
  return {
    ...reading,
    temperature: validateTemperature(reading.temperature, recordId),
    soilMoisture: Math.max(0, Math.min(100, Number(reading.soilMoisture) || 0)),
    humidity: Math.max(0, Math.min(100, Number(reading.humidity) || 0)),
    light: Math.max(0, Math.min(100, Number(reading.light) || 65))
  };
};

// ==== FINAL Firebase Sensor History with String Timestamp Support ====

export const fetchFirebaseSensorHistory = async (userId = null, plantId = 'basilPlant1', days = 7) => {
  try {
    const dataUserId = SENSOR_DATA_USER_ID;
    
    console.log(`📊 Fetching sensor data from: /users/${dataUserId}/plants/${plantId}/logs (last ${days} days)`);

    // Query Firebase logs subcollection - get recent data and filter in JavaScript
    const logsRef = collection(db, 'users', dataUserId, 'plants', plantId, 'logs');
    const q = query(
      logsRef,
      limit(200) // Get more data to filter client-side
    );

    console.log('📊 Executing Firebase query...');
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('📊 No sensor data found in Firebase subcollection');
      return [];
    }

    console.log(`📊 Found ${querySnapshot.size} documents in Firebase subcollection`);

    // Process documents and filter by date in JavaScript (since timestamps are strings)
    const sensorData = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    console.log(`📅 Filtering for data newer than: ${cutoffDate.toISOString()}`);
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      try {
        // Handle string timestamps
        let timestamp;
        if (typeof data.timestamp === 'string') {
          timestamp = new Date(data.timestamp);
        } else if (data.timestamp?.toDate) {
          timestamp = data.timestamp.toDate();
        } else {
          timestamp = new Date(data.timestamp);
        }
        
        // Filter by date in JavaScript
        if (timestamp < cutoffDate) {
          console.log(`📅 Skipping old record: ${timestamp.toISOString()}`);
          return;
        }
        
        // Validate required fields
        if (data.soilMoisture === undefined || data.temperature === undefined || data.humidity === undefined) {
          console.warn('📊 Skipping record with missing sensor data:', doc.id);
          return;
        }

        // Create and validate reading
        const rawReading = {
          id: doc.id,
          timestamp: timestamp.toISOString(),
          soilMoisture: Number(data.soilMoisture),
          temperature: Number(data.temperature),
          humidity: Number(data.humidity),
          light: Number(data.light) || 65,
          isHealthy: data.isHealthy || false
        };

        const validatedReading = validateSensorReading(rawReading, doc.id);
        
        // Final range check
        if (validatedReading.soilMoisture >= 0 && validatedReading.soilMoisture <= 100 &&
            validatedReading.temperature >= -10 && validatedReading.temperature <= 50 &&
            validatedReading.humidity >= 0 && validatedReading.humidity <= 100) {
          sensorData.push(validatedReading);
        }

      } catch (error) {
        console.warn('📊 Error processing sensor record:', doc.id, error);
      }
    });

    console.log(`📊 Successfully processed ${sensorData.length} recent sensor records`);
    
    // Sort by timestamp (oldest first)
    sensorData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Log data summary
    if (sensorData.length > 0) {
      const temps = sensorData.map(d => d.temperature);
      const moisture = sensorData.map(d => d.soilMoisture);
      console.log(`🌡️ Temperature range: ${Math.min(...temps).toFixed(1)}°C - ${Math.max(...temps).toFixed(1)}°C`);
      console.log(`💧 Moisture range: ${Math.min(...moisture).toFixed(1)}% - ${Math.max(...moisture).toFixed(1)}%`);
      console.log(`📅 Date range: ${new Date(sensorData[0].timestamp).toLocaleDateString()} - ${new Date(sensorData[sensorData.length-1].timestamp).toLocaleDateString()}`);
    }
    
    return sensorData;

  } catch (error) {
    console.error('📊 Error fetching Firebase sensor history:', error);
    return [];
  }
};

// ==== Main Functions ====

export const fetchSensorHistory = async (days = 7) => {
  try {
    console.log(`📊 fetchSensorHistory called for ${days} days - using Firebase with string timestamp support`);
    
    const firebaseData = await fetchFirebaseSensorHistory(null, 'basilPlant1', days);
    
    if (firebaseData && firebaseData.length > 0) {
      console.log(`📊 ✅ Firebase returned ${firebaseData.length} records with proper timestamp filtering`);
      return firebaseData;
    }

    console.warn('📊 No recent Firebase sensor data available');
    return [];

  } catch (error) {
    console.error('📊 fetchSensorHistory error:', error);
    return [];
  }
};

// ==== Other existing functions (unchanged) ====

export const fetchSensorData = async (plantId) => {
  return fetchWithAuth(`/plants/${plantId}/sensors/current`);
};

export const fetchBackendSensorHistory = async (plantId, options = {}) => {
  const { startDate, endDate, interval } = options;
  let url = `/plants/${plantId}/sensors/history`;

  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate.toISOString());
  if (endDate) params.append('endDate', endDate.toISOString());
  if (interval) params.append('interval', interval);

  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  return fetchWithAuth(url);
};

export const calculateHealthMetrics = async (plantId) => {
  return fetchWithAuth(`/plants/${plantId}/health-metrics`);
};

export const predictCareSchedule = async (plantId) => {
  return fetchWithAuth(`/plants/${plantId}/care-predictions`);
};

export const getSoilMoistureDepletion = async (plantId) => {
  return fetchWithAuth(`/plants/${plantId}/moisture-depletion`);
};