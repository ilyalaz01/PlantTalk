// src/hooks/useEcologicalModel.js
import { useState, useEffect } from 'react';
import { useSensor } from '../contexts/SensorContext';
import { usePlant } from '../contexts/PlantContext';

/**
 * Hook to implement the ecological models described in the project
 * 
 * This hook integrates:
 * 1. Conceptual models (rules-based relationships)
 * 2. Weather integration model
 * 3. Mechanistic model (soil moisture depletion)
 */
const useEcologicalModel = () => {
  const { sensorData, sensorHistory } = useSensor();
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
  const baseTemperature = 50; // Base temperature for calculation in Fahrenheit
  
  // Run conceptual model to determine plant status and environment health
  const runConceptualModel = () => {
    // Evaluate soil moisture
    let moistureStatus = 'optimal';
    if (sensorData.soilMoisture < 30) {
      moistureStatus = 'low';
    } else if (sensorData.soilMoisture > 70) {
      moistureStatus = 'high';
    }
    
    // Evaluate temperature
    let temperatureStatus = 'optimal';
    if (sensorData.temperature < 60) {
      temperatureStatus = 'low';
    } else if (sensorData.temperature > 75) {
      temperatureStatus = 'high';
    }
    
    // Evaluate humidity
    let humidityStatus = 'optimal';
    if (sensorData.humidity < 40) {
      humidityStatus = 'low';
    } else if (sensorData.humidity > 70) {
      humidityStatus = 'high';
    }
    
    // Evaluate light
    let lightStatus = 'optimal';
    if (sensorData.light < 30) {
      lightStatus = 'low';
    } else if (sensorData.light > 80) {
      lightStatus = 'high';
    }
    
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
    const T = sensorData.temperature;
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
    // For demo, we'll use simulated weather
    const simulatedWeather = {
      condition: 'sunny',
      temperature: 75,
      humidity: 45,
      forecast: [
        { day: 'today', condition: 'sunny', temperature: 75 },
        { day: 'tomorrow', condition: 'partly cloudy', temperature: 72 },
        { day: 'day3', condition: 'chance of rain', temperature: 68 }
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
    
    // Add recommendation for plant protection if extreme weather
    if (simulatedWeather.temperature > 85) {
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
    let recommendations = [];
    
    // Add recommendations based on moisture
    if (moisture === 'low') {
      recommendations.push({
        type: 'water',
        text: 'Water your plant thoroughly.',
        timing: daysUntilWaterNeeded <= 0 ? 'Today' : 'In ' + Math.ceil(daysUntilWaterNeeded) + ' days',
        priority: 'high'
      });
    } else if (moisture === 'high') {
      recommendations.push({
        type: 'drain',
        text: 'Check that your pot is draining properly. Let soil dry out before watering again.',
        priority: 'medium'
      });
    }
    
    // Add recommendations based on temperature
    if (temperature === 'low') {
      recommendations.push({
        type: 'move',
        text: 'Move your plant to a warmer location away from drafts and cold windows.',
        priority: 'high'
      });
    } else if (temperature === 'high') {
      recommendations.push({
        type: 'move',
        text: 'Move your plant to a cooler location away from heat sources and direct sun.',
        priority: 'high'
      });
    }
    
    // Add recommendations based on humidity
    if (humidity === 'low') {
      recommendations.push({
        type: 'mist',
        text: 'Increase humidity by misting your plant or using a humidifier.',
        priority: 'medium'
      });
    } else if (humidity === 'high') {
      recommendations.push({
        type: 'air',
        text: 'Improve air circulation around your plant to prevent fungal issues.',
        priority: 'low'
      });
    }
    
    // Add recommendations based on light
    if (light === 'low') {
      recommendations.push({
        type: 'light',
        text: 'Move your plant to a brighter location with more indirect sunlight.',
        priority: 'medium'
      });
    } else if (light === 'high') {
      recommendations.push({
        type: 'shade',
        text: 'Your plant may be getting too much direct light. Consider moving it to a location with filtered light.',
        priority: 'medium'
      });
    }
    
    // Adjust recommendations based on weather forecast
    recommendations = adjustForWeather(recommendations);
    
    // Add routine care recommendations if no urgent items
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'maintain',
        text: 'Your plant is doing well! Continue with your regular care routine.',
        priority: 'low'
      });
      
      // Add rotation recommendation every 2 weeks
      if (plant.careHistory.filter(action => action.action === 'rotated').length === 0) {
        recommendations.push({
          type: 'rotate',
          text: 'Consider rotating your plant to ensure even growth.',
          priority: 'low'
        });
      }
    }
    
    setCareRecommendations(recommendations);
  };
  
  // Run models when sensor data changes
  useEffect(() => {
    runConceptualModel();
    runMechanisticModel();
  }, [
    sensorData.soilMoisture, 
    sensorData.temperature, 
    sensorData.humidity, 
    sensorData.light
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