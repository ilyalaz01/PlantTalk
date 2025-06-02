// src/hooks/useSensorData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchSensorData, fetchSensorHistory } from '../services/sensorService';
/**
 * Custom hook for fetching and processing sensor data
 * This hook handles both real-time data and historical data
 */
const useSensorData = (plantId, refreshInterval = 30000) => {
const [currentData, setCurrentData] = useState({
  soilMoisture: 0,
  temperature: 0,
  humidity: 0,
  light: 0,
  lastUpdated: null
});

  
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to fetch current sensor readings
const fetchCurrentData = useCallback(async () => {
  try {
    const response = await fetch("/api/garden/");
    const contentType = response.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text(); // read as string for debugging
      console.error("Invalid JSON response:", text.slice(0, 200));
      throw new Error("Invalid JSON response from gardenpi");
    }

    const liveData = await response.json();

    if (
      !liveData ||
      typeof liveData.temperature?.value !== "number" ||
      typeof liveData.humidity?.value !== "number" ||
      typeof liveData.soil?.percent !== "number"
    ) {
      throw new Error("Incomplete sensor data");
    }

    const roundedData = {
      soilMoisture: Math.round(liveData.soil.percent),
      temperature: Math.round(liveData.temperature.value * 10) / 10,
      humidity: Math.round(liveData.humidity.value),
      light: 65, // still hardcoded unless you have real light data
      lastUpdated: new Date()
    };

    setCurrentData(roundedData);
  } catch (err) {
    console.error("Error fetching real-time data:", err);

    // Prevent crashing due to null access
    setCurrentData({
      soilMoisture: 0,
      temperature: 0,
      humidity: 0,
      light: 0,
      lastUpdated: null
    });
  }
}, []);
  
  // Function to fetch historical sensor data
  //const fetchHistoricalData = useCallback(async (days = 7) => {
    //try {
      //setLoading(true);
      
      // In a real app, this would call the API
      // const data = await fetchSensorHistory(plantId, {
      //   startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      //   endDate: new Date(),
      //   interval: 'daily'
      // });
      
      // For demo purposes, generate simulated historical data
      //const simulatedHistory = [];
      //for (let i = days; i >= 0; i--) {
        //const date = new Date();
       // date.setDate(date.getDate() - i);
      //  
     //   simulatedHistory.push({
    //      timestamp: date,
   //       soilMoisture: 70 - i * 3 + Math.floor(Math.random() * 10),
  //        temperature: 72 + Math.floor(Math.random() * 4 - 2),
  //        humidity: 55 + Math.floor(Math.random() * 10 - 5),
 //         light: 65 + Math.floor(Math.random() * 10 - 5)
//       });
//    }
 //     
 //     setHistoricalData(simulatedHistory);
 //     setLoading(false);
 //   } catch (err) {
 //     console.error('Error fetching sensor history:', err);
 //     setError('Failed to fetch historical sensor data');
 //     setLoading(false);
 //   }
 // }, [plantId]);


  const fetchHistoricalData = useCallback(async (days = 7) => {
  try {
    setLoading(true);
    const data = await fetchSensorHistory();

    // Map it if needed
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const filtered = data
      .filter(entry => new Date(entry.timestamp) >= cutoff)
      .map(entry => ({
        timestamp: entry.timestamp,
        soilMoisture: entry.soilMoisture // ← should match your parsed object key
      }));

    setHistoricalData(filtered);
  } catch (err) {
    console.error('Error fetching sensor history:', err);
    setError('Failed to fetch historical sensor data');
  } finally {
    setLoading(false);
  }
}, []);


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
    fetchCurrentData(); // ✅ Fetch immediately
    const interval = setInterval(fetchCurrentData, refreshInterval);
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