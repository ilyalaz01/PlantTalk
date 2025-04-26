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
  
  // Initial mock state (will be replaced by real sensor data soon)
  const [sensorData, setSensorData] = useState({
    soilMoisture: 45,      // %
    temperature: 22,       // °C
    humidity: 55,          // %
    light: 65,             // %
    lastUpdated: new Date(),
  });
  
  // Mock history (replace with fetchSensorHistory for real data)
  const [sensorHistory, setSensorHistory] = useState([
    { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), soilMoisture: 75, temperature: 22, humidity: 60, light: 70 },
    { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), soilMoisture: 68, temperature: 23, humidity: 58, light: 65 },
    { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), soilMoisture: 60, temperature: 24, humidity: 55, light: 60 },
    { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), soilMoisture: 52, temperature: 23, humidity: 54, light: 68 },
    { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), soilMoisture: 82, temperature: 21, humidity: 57, light: 72 },
    { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), soilMoisture: 75, temperature: 20, humidity: 59, light: 70 },
    { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), soilMoisture: 65, temperature: 22, humidity: 56, light: 65 },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch latest sensor data (mock or real)
  const refreshSensorData = async () => {
    try {
      setLoading(true);
      
      // Uncomment when real API is ready:
      // const data = await fetchSensorData();
      // setSensorData({
      //   soilMoisture: data.soilMoisture,
      //   temperature: data.temperature, // already in °C
      //   humidity: data.humidity,
      //   light: data.light,
      //   lastUpdated: new Date(data.timestamp),
      // });
      
      // --- MOCK: simulate sensor changes ---
      const newSoilMoisture = Math.max(5, sensorData.soilMoisture - Math.random() * 2);
      const newTemperature = sensorData.temperature + (Math.random() * 1 - 0.5);
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
      
      // Append to history every 3+ hours
      const lastHistory = sensorHistory[0]?.timestamp;
      if (!lastHistory || (new Date() - lastHistory) > 3 * 60 * 60 * 1000) {
        setSensorHistory(prev => [{ ...newData, timestamp: new Date() }, ...prev]);
      }
      
      // Update plant status
      updatePlantStatus(newData);
      setLoading(false);
    } catch (err) {
      setError('לא ניתן לעדכן נתוני חיישן');
      setLoading(false);
    }
  };

  // Determine sensor trends
  const getSensorTrends = () => {
    if (sensorHistory.length < 2) return { soilMoisture: 'stable', temperature: 'stable', humidity: 'stable', light: 'stable' };
    const [current, previous] = sensorHistory;
    return {
      soilMoisture: getTrend(current.soilMoisture, previous.soilMoisture),
      temperature: getTrend(current.temperature, previous.temperature),
      humidity: getTrend(current.humidity, previous.humidity),
      light: getTrend(current.light, previous.light),
    };
  };
  const getTrend = (curr, prev) => {
    const diff = curr - prev;
    if (Math.abs(diff) < 1) return 'stable';
    return diff > 0 ? 'rising' : 'falling';
  };

  // Predict days until soil moisture hits critical level (25%)
  const calculateSoilMoistureDepletion = () => {
    const k = 0.1;       // soil coefficient
    const tBase = 10;    // base temp in °C
    const depletionRate = -k * (sensorData.temperature - tBase) * (1 - sensorData.humidity / 100);
    const days = (sensorData.soilMoisture - 25) / (-depletionRate * 24);
    return Math.max(0, Math.round(days * 10) / 10);
  };

  // Auto-refresh on mount and interval
  useEffect(() => {
    refreshSensorData();
    const interval = setInterval(refreshSensorData, 30000);
    return () => clearInterval(interval);
  }, []);

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