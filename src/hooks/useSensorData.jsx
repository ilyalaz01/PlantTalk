// src/hooks/useSensorData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchSensorData, fetchSensorHistory } from '../services/sensorService';

/**
 * Custom hook for fetching and processing sensor data
 * This hook handles both real-time data and historical data
 */
const useSensorData = (plantId, refreshInterval = 30000) => {
  const [currentData, setCurrentData] = useState({
    soilMoisture: 50,
    temperature: 72,
    humidity: 55, 
    light: 65,
    lastUpdated: new Date()
  });
  
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to fetch current sensor readings
  const fetchCurrentData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("https://gardenpi.duckdns.org/");
      const liveData = await response.json();

      // In a real app, this would call the API
      // const data = await fetchSensorData(plantId);
      
      // For demo purposes, generate simulated data
      const simulatedData = {
        soilMoisture: Math.max(10, Math.min(90, currentData.soilMoisture + (Math.random() * 4 - 2))),
        temperature: Math.max(60, Math.min(85, currentData.temperature + (Math.random() * 2 - 1))),
        humidity: Math.max(30, Math.min(80, currentData.humidity + (Math.random() * 3 - 1.5))),
        light: Math.max(10, Math.min(90, currentData.light + (Math.random() * 5 - 2.5))),
        lastUpdated: new Date()
      };
      

      const roundedData = {
        soilMoisture: Math.round(liveData.soil.percent),
        temperature: Math.round(liveData.temperature.value * 10) / 10,
        humidity: Math.round(liveData.humidity.value),
        light: Math.round(liveData.light.value || 65), // fallback or add logic for light if missing
        lastUpdated: new Date()
      };

      setCurrentData(roundedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sensor data:', err);
      setError('Failed to fetch current sensor data');
      setLoading(false);
    }
  }, [plantId, currentData]);
  
  // Function to fetch historical sensor data
  const fetchHistoricalData = useCallback(async (days = 7) => {
    try {
      setLoading(true);
      
      // In a real app, this would call the API
      // const data = await fetchSensorHistory(plantId, {
      //   startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      //   endDate: new Date(),
      //   interval: 'daily'
      // });
      
      // For demo purposes, generate simulated historical data
      const simulatedHistory = [];
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        simulatedHistory.push({
          timestamp: date,
          soilMoisture: 70 - i * 3 + Math.floor(Math.random() * 10),
          temperature: 72 + Math.floor(Math.random() * 4 - 2),
          humidity: 55 + Math.floor(Math.random() * 10 - 5),
          light: 65 + Math.floor(Math.random() * 10 - 5)
        });
      }
      
      setHistoricalData(simulatedHistory);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sensor history:', err);
      setError('Failed to fetch historical sensor data');
      setLoading(false);
    }
  }, [plantId]);
  
  // Calculate sensor trends
  const calculateTrends = useCallback(() => {
    if (historicalData.length < 2) {
      return {
        soilMoisture: 'stable',
        temperature: 'stable',
        humidity: 'stable',
        light: 'stable'
      };
    }
    
    const latest = historicalData[historicalData.length - 1];
    const previous = historicalData[historicalData.length - 2];
    
    const getTrend = (current, previous, threshold = 3) => {
      const diff = current - previous;
      if (Math.abs(diff) < threshold) return 'stable';
      return diff > 0 ? 'rising' : 'falling';
    };
    
    return {
      soilMoisture: getTrend(latest.soilMoisture, previous.soilMoisture),
      temperature: getTrend(latest.temperature, previous.temperature, 1),
      humidity: getTrend(latest.humidity, previous.humidity, 5),
      light: getTrend(latest.light, previous.light, 5)
    };
  }, [historicalData]);
  
  // Calculate soil moisture depletion rate using the mechanistic model
  const calculateMoistureDepletion = useCallback(() => {
    // Implement mechanistic model: dM/dt = -k · (T - Tbase) · (1 - H/100)
    const k = 0.1; // Coefficient depending on soil type
    const tBase = 50; // Base temperature in Fahrenheit
    
    const depletionRate = -k * (currentData.temperature - tBase) * (1 - currentData.humidity / 100);
    
    // Predict days until soil moisture reaches critical level (25%)
    const daysUntilCritical = (currentData.soilMoisture - 25) / (-depletionRate * 24);
    
    return Math.max(0, Math.round(daysUntilCritical * 10) / 10);
  }, [currentData]);
  
  // Calculate health scores based on sensor data
  const calculateHealthScores = useCallback(() => {
    // Calculate score for each parameter (0-100)
    const getMoistureScore = (value) => {
      if (value < 20) return value * 2.5; // 0-50 for very dry
      if (value < 30) return 50 + (value - 20) * 5; // 50-100 for approaching optimal
      if (value <= 70) return 100; // 100 for optimal range
      if (value < 80) return 100 - (value - 70) * 5; // 50-100 for slightly wet
      return Math.max(0, 100 - (value - 80) * 10); // 0-50 for very wet
    };
    
    const getTemperatureScore = (value) => {
      if (value < 60) return Math.max(0, value - 40) * 5; // 0-100 for cold
      if (value <= 75) return 100; // 100 for optimal range
      if (value < 85) return 100 - (value - 75) * 10; // 0-100 for hot
      return 0; // Too hot
    };
    
    const getHumidityScore = (value) => {
      if (value < 30) return value * 10 / 3; // 0-100 for very dry
      if (value < 40) return 100 - (40 - value) * 2; // 80-100 for approaching optimal
      if (value <= 70) return 100; // 100 for optimal range
      if (value < 80) return 100 - (value - 70) * 2; // 80-100 for slightly humid
      return Math.max(0, 100 - (value - 80) * 5); // 0-80 for very humid
    };
    
    const getLightScore = (value) => {
      if (value < 20) return value * 5; // 0-100 for very dark
      if (value <= 80) return 100; // 100 for optimal range
      return Math.max(0, 100 - (value - 80) * 5); // 0-100 for very bright
    };
    
    const moistureScore = getMoistureScore(currentData.soilMoisture);
    const temperatureScore = getTemperatureScore(currentData.temperature);
    const humidityScore = getHumidityScore(currentData.humidity);
    const lightScore = getLightScore(currentData.light);
    
    // Overall health is weighted average
    const overallScore = Math.round(
      (moistureScore * 0.4) + 
      (temperatureScore * 0.3) + 
      (humidityScore * 0.15) + 
      (lightScore * 0.15)
    );
    
    return {
      moisture: Math.round(moistureScore),
      temperature: Math.round(temperatureScore),
      humidity: Math.round(humidityScore),
      light: Math.round(lightScore),
      overall: overallScore
    };
  }, [currentData]);
  
  // Initial data fetch on mount
  useEffect(() => {
    fetchCurrentData();
    fetchHistoricalData();
    
    // Set up polling interval for real-time data
    const interval = setInterval(() => {
      fetchCurrentData();
    }, refreshInterval);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, [fetchCurrentData, fetchHistoricalData, refreshInterval]);
  
  // Function to manually refresh data
  const refreshData = () => {
    fetchCurrentData();
  };
  
  // Fetch historical data for a specific period
  const fetchHistory = (days) => {
    fetchHistoricalData(days);
  };
  
  // Calculate values derived from sensor data
  const trends = calculateTrends();
  const daysUntilWaterNeeded = calculateMoistureDepletion();
  const healthScores = calculateHealthScores();
  
  return {
    currentData,
    historicalData,
    loading,
    error,
    trends,
    daysUntilWaterNeeded,
    healthScores,
    refreshData,
    fetchHistory
  };
};

export default useSensorData;