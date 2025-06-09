// src/hooks/useEcologicalModel.js
import { useState, useEffect } from 'react';
import useSensorData from '../hooks/useSensorData';
import { usePlant } from '../contexts/PlantContext';

/**
 * Hook to implement the ecological models described in the project
 * 
 * This hook integrates:
 * 1. Conceptual models (rules-based relationships)
 * 2. Weather integration model
 * 3. Mechanistic model (soil moisture depletion)
 */
const useEcologicalModel = (sensorDataHook) => {
  const { currentData: sensorData, historicalData: sensorHistory } = sensorDataHook;
  const { plant } = usePlant();
  
  const [plantStatus, setPlantStatus] = useState('healthy');
  const [moistureDepletionRate, setMoistureDepletionRate] = useState(0);
  const [daysUntilWaterNeeded, setDaysUntilWaterNeeded] = useState(0);
  const [careRecommendations, setCareRecommendations] = useState([]);
  const [environmentalHealth, setEnvironmentalHealth] = useState({
    moisture: 'optimal',
    temperature: 'optimal',
    humidity: 'optimal',
    light: 'optimal'
  });
  
  // Soil type coefficient for the mechanistic model
  // This would ideally come from plant species database
  const soilCoefficient = 0.1; // Default for potting mix
  const baseTemperature = 10; // Base temperature in Celsius (minimum temp for growth)
  
  // Run conceptual model to determine plant status and environment health
    const runConceptualModel = () => {
    const { soilMoisture: moisture, temperature: temp, humidity, light } = sensorData;
    // 🌱 Data-driven rule based model based on research
    let status;
    if (moisture < 30 || (temp > 32 && humidity < 40)) {
      status = 'thirsty';
    } else if (moisture > 75 && (humidity > 75 || temp < 20)) {
      status = 'overwatered';
    } else if (moisture >= 40 && moisture <= 70 && temp >= 21 && temp <= 30 && humidity >= 40 && humidity <= 70) {
      status = 'healthy';
    } else {
      status = 'stressed';
    }
    setPlantStatus(status);
    // Environmental health breakdown
    const moistureStatus = moisture < 30 ? 'low' : moisture > 75 ? 'high' : 'optimal';
    const temperatureStatus = temp < 21 ? 'low' : temp > 30 ? 'high' : 'optimal';
    const humidityStatus = humidity < 40 ? 'low' : humidity > 70 ? 'high' : 'optimal';
    const lightStatus = light < 30 ? 'low' : light > 80 ? 'high' : 'optimal';
    
    // Set environmental health statuses
    setEnvironmentalHealth({
      moisture: moistureStatus,
      temperature: temperatureStatus,
      humidity: humidityStatus,
      light: lightStatus
    });
    
    // Determine overall plant status - prioritize water, then temperature
    if (moistureStatus === 'low') {
      setPlantStatus('thirsty');
    } else if (temperatureStatus === 'low') {
      setPlantStatus('cold');
    } else if (temperatureStatus === 'high') {
      setPlantStatus('hot');
    } else if (moistureStatus === 'high') {
      setPlantStatus('overwatered');
    } else {
      setPlantStatus('healthy');
    }
    
    // Generate care recommendations based on status
    generateCareRecommendations(moistureStatus, temperatureStatus, humidityStatus, lightStatus);
  };
  
  // Run mechanistic model to calculate moisture depletion rate
  const runMechanisticModel = () => {
    // Implement the moisture depletion model: dM/dt = -k · (T - Tbase) · (1 - H/100)
    const k = soilCoefficient;
    const T = sensorData.temperature; // Already in Celsius
    const H = sensorData.humidity;
    
    // Calculate daily moisture depletion rate (percentage points per day)
    const depletionRate = -k * (T - baseTemperature) * (1 - H / 100) * 24; // Convert to daily rate
    
    setMoistureDepletionRate(Math.abs(depletionRate));
    
    // Calculate days until critical moisture level (30%)
    const daysUntil = (sensorData.soilMoisture - 30) / Math.abs(depletionRate);
    
    // Ensure we don't show negative days
    setDaysUntilWaterNeeded(Math.max(0, daysUntil));
  };
  
  // Weather integration model - adjust recommendations based on weather
  const adjustForWeather = (recommendations) => {
    // In a real app, this would use actual weather data
    // For demo, we'll use simulated weather (now in Celsius)
    const simulatedWeather = {
      condition: 'sunny',
      temperature: 24, // in Celsius
      humidity: 45,
      forecast: [
        { day: 'today', condition: 'sunny', temperature: 24 }, // in Celsius
        { day: 'tomorrow', condition: 'partly cloudy', temperature: 22 }, // in Celsius
        { day: 'day3', condition: 'chance of rain', temperature: 20 } // in Celsius
      ]
    };
    
    let adjustedRecommendations = [...recommendations];
    
    // Adjust watering timing based on forecast
    if (recommendations.some(rec => rec.type === 'water')) {
      const wateringRec = recommendations.find(rec => rec.type === 'water');
      
      // If rain is forecast, suggest waiting
      if (simulatedWeather.forecast.some(day => 
          day.condition.includes('rain') && day.day === 'tomorrow'
      )) {
        const index = adjustedRecommendations.findIndex(rec => rec.type === 'water');
        adjustedRecommendations[index] = {
          ...wateringRec,
          timing: 'Consider waiting until after the rain forecast for tomorrow.'
        };
      }
    }
    
    // Add recommendation for plant protection if extreme weather (29°C is about 85°F)
    if (simulatedWeather.temperature > 29) {
      adjustedRecommendations.push({
        type: 'protect',
        text: 'High outdoor temperatures forecast. Keep plant away from hot windows.',
        priority: 'medium'
      });
    }
    
    return adjustedRecommendations;
  };
  
  // Generate care recommendations based on environmental status
  const generateCareRecommendations = (moisture, temperature, humidity, light) => {
      const m = sensorData.soilMoisture;
      const t = sensorData.temperature;
      const h = sensorData.humidity;

      let recommendations = [];

      if (plantStatus === 'thirsty') {
        recommendations.push({
          type: 'water',
          text: `Soil is dry (${m}%). Water thoroughly.`,
          timing: daysUntilWaterNeeded <= 0 ? 'Today' : `In ${Math.ceil(daysUntilWaterNeeded)} days`,
          priority: 'high'
        });
      } else if (plantStatus === 'overwatered') {
        recommendations.push({
          type: 'drain',
          text: `Soil is very wet (${m}%) and humidity is high. Improve drainage.`,
          priority: 'high'
        });
      } else if (plantStatus === 'stressed') {
        recommendations.push({
          type: 'adjust',
          text: `Conditions are not ideal. Moisture: ${m}%, Temp: ${t}°C, Humidity: ${h}%.`,
          priority: 'medium'
        });
      }

      if (temperature === 'low') {
        recommendations.push({
          type: 'move',
          text: `Move plant to warmer area. Current temperature is ${t}°C.`,
          priority: 'medium'
        });
      } else if (temperature === 'high') {
        recommendations.push({
          type: 'shade',
          text: `Too hot (${t}°C). Shade the plant or move it.`,
          priority: 'medium'
        });
      }

      if (humidity === 'low') {
        recommendations.push({
          type: 'mist',
          text: `Humidity low at ${h}%. Mist the plant or use humidifier.`,
          priority: 'low'
        });
      } else if (humidity === 'high') {
        recommendations.push({
          type: 'air',
          text: `Humidity high (${h}%). Ensure good airflow.`,
          priority: 'low'
        });
      }

      if (light === 'low') {
        recommendations.push({
          type: 'light',
          text: `Light level too low. Move to a brighter spot.`,
          priority: 'medium'
        });
      } else if (light === 'high') {
        recommendations.push({
          type: 'shade',
          text: `Light is too intense. Consider filtered sunlight.`,
          priority: 'medium'
        });
      }

      if (recommendations.length === 0) {
        recommendations.push({
          type: 'maintain',
          text: 'All conditions are optimal. Keep regular care routine.',
          priority: 'low'
        });
      }

      setCareRecommendations(adjustForWeather(recommendations));
    };
  
  // Run models when sensor data changes
  useEffect(() => {
    if (sensorData) {
      runConceptualModel();
      runMechanisticModel();
    }
  }, [
    sensorData?.soilMoisture, 
    sensorData?.temperature, 
    sensorData?.humidity, 
    sensorData?.light
  ]);
  
  return {
    plantStatus,
    environmentalHealth,
    moistureDepletionRate,
    daysUntilWaterNeeded,
    careRecommendations
  };
};

export default useEcologicalModel;