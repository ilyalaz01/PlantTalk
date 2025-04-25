// src/contexts/SensorContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSensorData, fetchSensorHistory } from '../services/sensorService';
import { usePlant } from './PlantContext';

const SensorContext = createContext();

export const useSensor = () => {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error('useSensor must be used within a SensorProvider');
  }
  return context;
};

export const SensorProvider = ({ children }) => {
  const { updatePlantStatus } = usePlant();
  
  const [sensorData, setSensorData] = useState({
    soilMoisture: 45, // percentage
    temperature: 72, // Fahrenheit
    humidity: 55, // percentage
    light: 65, // percentage
    lastUpdated: new Date(),
  });
  
  const [sensorHistory, setSensorHistory] = useState([
    // Initial history data - in a real app this would come from an API
    { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), soilMoisture: 75, temperature: 72, humidity: 60, light: 70 },
    { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), soilMoisture: 68, temperature: 73, humidity: 58, light: 65 },
    { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), soilMoisture: 60, temperature: 74, humidity: 55, light: 60 },
    { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), soilMoisture: 52, temperature: 73, humidity: 54, light: 68 },
    { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), soilMoisture: 82, temperature: 71, humidity: 57, light: 72 },
    { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), soilMoisture: 75, temperature: 70, humidity: 59, light: 70 },
    { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), soilMoisture: 65, temperature: 72, humidity: 56, light: 65 },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch latest sensor data
  const refreshSensorData = () => {
    try {
      setLoading(true);
      
      // In a real application, this would fetch from an API
      // const data = await fetchSensorData();
      // setSensorData(data);
      
      // For demo purposes, simulate changing sensor values
      const newSoilMoisture = Math.max(5, sensorData.soilMoisture - Math.random() * 2);
      const newTemperature = sensorData.temperature + (Math.random() * 2 - 1);
      const newHumidity = Math.max(30, Math.min(80, sensorData.humidity + (Math.random() * 3 - 1.5)));
      const newLight = Math.max(10, Math.min(90, sensorData.light + (Math.random() * 5 - 2.5)));
      
      const newData = {
        soilMoisture: Math.round(newSoilMoisture),
        temperature: Math.round(newTemperature * 10) / 10,
        humidity: Math.round(newHumidity),
        light: Math.round(newLight),
        lastUpdated: new Date(),
      };
      
      setSensorData(newData);
      
      // Add to history every few hours
      const lastHistoryTimestamp = sensorHistory[0]?.timestamp;
      if (!lastHistoryTimestamp || (new Date() - lastHistoryTimestamp) > 3 * 60 * 60 * 1000) {
        setSensorHistory(prev => [
          { ...newData, timestamp: new Date() },
          ...prev
        ]);
      }
      
      // Update plant status based on new sensor data
      updatePlantStatus(newData);
      
      setLoading(false);
    } catch (err) {
      setError('Could not fetch sensor data');
      setLoading(false);
    }
  };

  // Calculate derived values
  const getSensorTrends = () => {
    if (sensorHistory.length < 2) return { soilMoisture: 'stable', temperature: 'stable', humidity: 'stable', light: 'stable' };
    
    const current = sensorHistory[0];
    const previous = sensorHistory[1];
    
    return {
      soilMoisture: getTrend(current.soilMoisture, previous.soilMoisture),
      temperature: getTrend(current.temperature, previous.temperature),
      humidity: getTrend(current.humidity, previous.humidity),
      light: getTrend(current.light, previous.light)
    };
  };
  
  const getTrend = (current, previous) => {
    const diff = current - previous;
    if (Math.abs(diff) < 3) return 'stable';
    return diff > 0 ? 'rising' : 'falling';
  };

  const calculateSoilMoistureDepletion = () => {
    // Implement mechanistic model: dM/dt = -k · (T - Tbase) · (1 - H/100)
    const k = 0.1; // Coefficient depending on soil type
    const tBase = 50; // Base temperature in Fahrenheit
    
    const depletionRate = -k * (sensorData.temperature - tBase) * (1 - sensorData.humidity / 100);
    
    // Predict days until soil moisture reaches critical level (25%)
    const daysUntilCritical = (sensorData.soilMoisture - 25) / (-depletionRate * 24);
    
    return Math.max(0, Math.round(daysUntilCritical * 10) / 10);
  };

  // Set up regular refresh of sensor data
  // FIXED: Removed sensorData values from dependency array to prevent infinite loop
  useEffect(() => {
    refreshSensorData();
    
    const interval = setInterval(() => {
      refreshSensorData();
    }, 30000); // Refresh every 30 seconds for demo
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this only runs once on mount

  // Value object to be provided to consumers
  const value = {
    sensorData,
    sensorHistory,
    loading,
    error,
    refreshSensorData,
    trends: getSensorTrends(),
    daysUntilWaterNeeded: calculateSoilMoistureDepletion(),
  };

  return <SensorContext.Provider value={value}>{children}</SensorContext.Provider>;
};

export default SensorContext;