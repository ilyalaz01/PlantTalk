// src/hooks/useSensorData.js
// HARDCODED USER ID VERSION - Fixed to access actual sensor data location

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { fetchSensorHistory, fetchFirebaseSensorHistory } from '../services/sensorService';
import { useAuth } from '../contexts/AuthContext';

const useSensorData = (plantId) => {
  console.log('🚀 Hardcoded user ID hook initialized');
  
  const { user } = useAuth();
  const hasInitialized = useRef(false);
  
  // State with realistic initial values
  const [currentData, setCurrentData] = useState({
    soilMoisture: 35,
    temperature: 22,
    humidity: 45,
    light: 65,
    lastUpdated: new Date()
  });
  
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('initializing');
  const [usingMockData, setUsingMockData] = useState(true);
  const [lastSuccessfulFetch, setLastSuccessfulFetch] = useState(null);

  // Fetch current sensor data from Railway API
  const fetchCurrentData = useCallback(async () => {
    console.log('📡 Fetching current sensor data from Railway API...');
    
    try {
      const response = await fetch('https://basil-pca-api-production.up.railway.app/api/garden', {
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Got real current sensor data:', data);
        
        if (data.temperature && data.humidity && data.soil) {
          // Validate current temperature readings
          let temperature = Number(data.temperature.value) || 22;
          
          if (temperature > 50) {
            console.warn(`🌡️ CURRENT: Suspicious temperature ${temperature}°C from Railway API`);
            
            if (temperature > 60 && temperature < 120) {
              const celsius = (temperature - 32) * 5/9;
              console.log(`🌡️ CURRENT: Converting ${temperature}°F -> ${celsius.toFixed(1)}°C`);
              temperature = celsius;
            } else {
              temperature = 22;
              console.log(`🌡️ CURRENT: Using safe default temperature: ${temperature}°C`);
            }
          }
          
          setCurrentData({
            soilMoisture: Math.round(data.soil.percent || 35),
            temperature: Math.round(temperature * 10) / 10,
            humidity: Math.round(data.humidity.value || 45),
            light: 65,
            lastUpdated: new Date()
          });
          setConnectionStatus('connected');
          setUsingMockData(false);
          setError(null);
          setLastSuccessfulFetch(new Date());
        } else {
          throw new Error('Invalid current data structure');
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
      
    } catch (err) {
      console.log('⚠️ Using mock current data due to:', err.message);
      
      setCurrentData({
        soilMoisture: 30 + Math.floor(Math.random() * 30),
        temperature: 20 + Math.floor(Math.random() * 8),
        humidity: 40 + Math.floor(Math.random() * 20),
        light: 65,
        lastUpdated: new Date()
      });
      setConnectionStatus('failed');
      setUsingMockData(true);
      setError('Using demo data - current sensors unavailable');
    }
  }, []);

  // Fetch historical data from Firebase using hardcoded user ID
  const fetchHistoricalData = useCallback(async (days = 3) => {
    console.log(`📊 🔧 Fetching Firebase data using HARDCODED user ID (not current user)`);
    
    try {
      // Always use the fetchSensorHistory function which now has hardcoded user ID
      const data = await fetchSensorHistory(days);
      
      console.log('📊 Raw Firebase data received:', data?.length || 0, 'records');
      
      if (data && Array.isArray(data) && data.length > 0) {
        console.log('📊 ✅ SUCCESS! Got real Firebase sensor data');
        console.log('📊 Sample Firebase data:', data.slice(0, 2));
        
        // Additional validation at hook level
        const validated = data.map(entry => {
          let temp = Number(entry.temperature) || 22;
          
          if (temp > 40) {
            console.warn(`🌡️ HOOK: Clamping high temperature ${temp}°C to 25°C`);
            temp = 25;
          }
          if (temp < 5) {
            console.warn(`🌡️ HOOK: Clamping low temperature ${temp}°C to 20°C`);
            temp = 20;
          }
          
          return {
            ...entry,
            temperature: temp,
            soilMoisture: Math.max(0, Math.min(100, Number(entry.soilMoisture) || 0)),
            humidity: Math.max(0, Math.min(100, Number(entry.humidity) || 0)),
            light: Math.max(0, Math.min(100, Number(entry.light) || 65))
          };
        });
        
        // Filter for recent data
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        const filtered = validated
          .filter(entry => {
            try {
              const entryDate = new Date(entry.timestamp);
              return entryDate >= cutoff && entryDate <= new Date();
            } catch {
              return false;
            }
          })
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        console.log('📊 Filtered to', filtered.length, 'valid Firebase records');
        
        if (filtered.length > 0) {
          // Log ranges for debugging
          const temps = filtered.map(d => d.temperature);
          const moisture = filtered.map(d => d.soilMoisture);
          console.log(`🌡️ FINAL TEMPERATURE RANGE: ${Math.min(...temps).toFixed(1)}°C - ${Math.max(...temps).toFixed(1)}°C`);
          console.log(`💧 MOISTURE RANGE: ${Math.min(...moisture).toFixed(1)}% - ${Math.max(...moisture).toFixed(1)}%`);
          console.log(`📅 DATE RANGE: ${new Date(filtered[0].timestamp).toLocaleDateString()} - ${new Date(filtered[filtered.length-1].timestamp).toLocaleDateString()}`);
          
          setHistoricalData(filtered);
          setUsingMockData(false);
          setError(null);
          return filtered;
        } else {
          throw new Error('No valid Firebase data after filtering');
        }
      } else {
        throw new Error('No Firebase data available from hardcoded user');
      }
      
    } catch (err) {
      console.log('📊 ❌ Firebase failed, generating realistic mock data:', err.message);
      setError(`Firebase data unavailable: ${err.message}`);
      
      // Generate realistic mock historical data
      const mockHistory = [];
      const now = new Date();
      
      for (let i = days * 24; i >= 0; i--) {
        const date = new Date(now);
        date.setHours(date.getHours() - i);
        date.setMinutes(Math.floor(Math.random() * 60), 0, 0);
        
        const baseTemp = 23;
        const hourVariation = Math.sin((date.getHours() / 24) * Math.PI * 2) * 3;
        const randomVariation = (Math.random() - 0.5) * 2;
        const temperature = baseTemp + hourVariation + randomVariation;
        
        mockHistory.push({
          timestamp: date.toISOString(),
          soilMoisture: Math.max(20, 60 - (i * 0.3) + Math.floor(Math.random() * 15)),
          temperature: Math.round(temperature * 10) / 10,
          humidity: 45 + Math.floor(Math.random() * 20),
          light: 60 + Math.floor(Math.random() * 15),
          isHealthy: Math.random() > 0.2,
          id: `mock_${i}`
        });
      }
      
      console.log('📊 Generated', mockHistory.length, 'realistic mock records');
      
      setHistoricalData(mockHistory);
      setUsingMockData(true);
      return mockHistory;
    }
  }, []); // Remove user dependency since we're using hardcoded user ID

  // Manual refresh function
  const refreshData = useCallback(async () => {
    console.log('🔄 Manual refresh triggered');
    setConnectionStatus('connecting');
    setError(null);
    
    try {
      await Promise.all([
        fetchCurrentData(),
        fetchHistoricalData(3)
      ]);
      console.log('✅ Manual refresh completed');
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
      setError('Refresh failed');
    }
  }, [fetchCurrentData, fetchHistoricalData]);

  // fetchHistory function for components
  const fetchHistory = useCallback((days = 3) => {
    console.log('📊 fetchHistory called with', days, 'days');
    return fetchHistoricalData(days);
  }, [fetchHistoricalData]);

  // INITIALIZATION
  useEffect(() => {
    if (hasInitialized.current) {
      console.log('🚫 Initialization already completed, skipping...');
      return;
    }
    
    // Don't wait for user auth since we're using hardcoded user ID
    hasInitialized.current = true;
    console.log('🚀 🔧 Starting initialization with HARDCODED user ID (not waiting for auth)');
    
    const init = async () => {
      setLoading(true);
      
      try {
        await fetchCurrentData();
        console.log('✅ Current data fetch complete');
        
        await fetchHistoricalData(3);
        console.log('✅ Historical data fetch complete');
        
      } catch (error) {
        console.error('❌ Initialization error:', error);
        setError('Initialization failed');
      } finally {
        setLoading(false);
        console.log('✅ Initialization complete!');
      }
    };
    
    init();
  }, [fetchCurrentData, fetchHistoricalData]); // Remove user dependency

  // MEMOIZED calculations (same as before)
  const trends = useMemo(() => {
    if (!historicalData || historicalData.length < 2) {
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
      if (!current || !previous || isNaN(current) || isNaN(previous)) return 'stable';
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

  const healthScores = useMemo(() => {
    if (!currentData) {
      return { moisture: 50, temperature: 50, humidity: 50, light: 50, overall: 50 };
    }
    
    const getTemperatureScore = (value) => {
      if (value < 10) return Math.max(0, (value + 10) * 5);
      if (value < 20) return 50 + (value - 10) * 5;
      if (value >= 20 && value <= 30) return 100;
      if (value < 35) return 100 - (value - 30) * 10;
      return Math.max(0, 100 - (value - 35) * 20);
    };
    
    const getMoistureScore = (value) => {
      if (value < 20) return value * 2.5;
      if (value < 30) return 50 + (value - 20) * 5;
      if (value <= 70) return 100;
      if (value < 80) return 100 - (value - 70) * 5;
      return Math.max(0, 100 - (value - 80) * 10);
    };
    
    const getHumidityScore = (value) => {
      if (value < 30) return value * 10 / 3;
      if (value < 40) return 100 - (40 - value) * 2;
      if (value <= 70) return 100;
      if (value < 80) return 100 - (value - 70) * 2;
      return Math.max(0, 100 - (value - 80) * 5);
    };
    
    const getLightScore = (value) => {
      if (value < 20) return value * 5;
      if (value <= 80) return 100;
      return Math.max(0, 100 - (value - 80) * 5);
    };
    
    const moistureScore = getMoistureScore(currentData.soilMoisture);
    const temperatureScore = getTemperatureScore(currentData.temperature);
    const humidityScore = getHumidityScore(currentData.humidity);
    const lightScore = getLightScore(currentData.light);
    
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

  const daysUntilWaterNeeded = useMemo(() => {
    if (!currentData || !currentData.temperature || !currentData.humidity || !currentData.soilMoisture) {
      return 3;
    }
    
    const k = 0.1;
    const tBase = 20;
    
    const depletionRate = -k * (currentData.temperature - tBase) * (1 - currentData.humidity / 100);
    const daysUntilCritical = (currentData.soilMoisture - 25) / (-depletionRate * 24);
    
    return Math.max(1, Math.round(daysUntilCritical * 10) / 10);
  }, [currentData]);

  // Helper functions
  const getStatusMessage = () => {
    if (usingMockData) return 'Using realistic demo data - Firebase connection issues';
    
    switch (connectionStatus) {
      case 'connected': return 'Live sensor data + Real Firebase history (hardcoded user)';
      case 'sensors_offline': return 'Real Firebase data available - current sensors offline';
      case 'connecting': return 'Connecting to sensors...';
      case 'initializing': return 'Loading Firebase data...';
      case 'failed': return 'Using demo data - sensors offline';
      default: return 'Demo mode';
    }
  };

  const getDataAge = () => {
    if (!currentData?.lastUpdated) return 'Unknown';
    try {
      const seconds = Math.floor((Date.now() - currentData.lastUpdated.getTime()) / 1000);
      if (seconds < 60) return `${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    } catch {
      return 'Unknown';
    }
  };

  const isDataStale = () => {
    if (!lastSuccessfulFetch) return true;
    const staleThreshold = 5 * 60 * 1000;
    return Date.now() - lastSuccessfulFetch.getTime() > staleThreshold;
  };

  // Return object
  return useMemo(() => {
    const result = {
      currentData,
      historicalData,
      loading,
      error,
      connectionStatus,
      usingMockData,
      lastSuccessfulFetch,
      statusMessage: getStatusMessage(),
      trends,
      daysUntilWaterNeeded,
      healthScores,
      refreshData,
      fetchHistory,
      getDataAge,
      isLive: connectionStatus === 'connected' && !usingMockData,
      isStale: connectionStatus === 'failed' || usingMockData,
      isDataStale,
      userId: user?.uid,
      dataSource: usingMockData ? 'realistic_mock' : 'firebase_hardcoded_user',
      plantId: 'basilPlant1'
    };

    console.log('🔄 HARDCODED USER HOOK RETURNING:', {
      loading: result.loading,
      connectionStatus: result.connectionStatus,
      hasCurrentData: !!result.currentData,
      currentTemp: result.currentData?.temperature + '°C',
      historyCount: result.historicalData.length,
      tempRange: result.historicalData.length > 0 ? 
        `${Math.min(...result.historicalData.map(d => d.temperature)).toFixed(1)}°C - ${Math.max(...result.historicalData.map(d => d.temperature)).toFixed(1)}°C` 
        : 'No data',
      moistureRange: result.historicalData.length > 0 ? 
        `${Math.min(...result.historicalData.map(d => d.soilMoisture)).toFixed(1)}% - ${Math.max(...result.historicalData.map(d => d.soilMoisture)).toFixed(1)}%` 
        : 'No data',
      usingMockData: result.usingMockData,
      dataSource: result.dataSource
    });

    return result;
  }, [
    currentData,
    historicalData,
    loading,
    error,
    connectionStatus,
    usingMockData,
    lastSuccessfulFetch,
    trends,
    daysUntilWaterNeeded,
    healthScores,
    refreshData,
    fetchHistory,
    user?.uid
  ]);
};

export default useSensorData;