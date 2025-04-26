// src/hooks/useWeatherData.js
import { useState, useEffect, useCallback } from 'react';
import { getCurrentWeather, getWeatherForecast, getUserLocation } from '../services/weatherService';
import { useUser } from '../contexts/UserContext';

/**
 * Custom hook for fetching and processing weather data
 */
const useWeatherData = () => {
  const { user } = useUser();
  
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    feelsLike: 73,
    location: 'Seattle, WA',
    lastUpdated: new Date()
  });
  
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch current weather data
  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      
      // In a real app, this would call the API
      // const data = await getCurrentWeather();
      
      // For demo purposes, generate simulated weather data
      const simulatedWeather = {
        temperature: Math.round(65 + Math.random() * 15),
        condition: getRandomCondition(),
        humidity: Math.round(50 + Math.random() * 30),
        windSpeed: Math.round(5 + Math.random() * 10),
        feelsLike: Math.round(65 + Math.random() * 15),
        location: user.location.city + ', ' + user.location.state,
        lastUpdated: new Date()
      };
      
      setCurrentWeather(simulatedWeather);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data');
      setLoading(false);
    }
  }, [user.location]);

  // Function to fetch weather forecast
  const fetchForecast = useCallback(async (days = 5) => {
    try {
      setLoading(true);
      
      // In a real app, this would call the API
      // const data = await getWeatherForecast(days);
      
      // For demo purposes, generate simulated forecast data
      const simulatedForecast = [];
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rain', 'Thunderstorm'];
      const baseTemp = 65 + Math.random() * 10;
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        // Create some weather trend for more realistic forecast
        const tempVariation = Math.sin(i * 0.5) * 7;
        
        simulatedForecast.push({
          date,
          dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          highTemp: Math.round(baseTemp + tempVariation + Math.random() * 5),
          lowTemp: Math.round(baseTemp + tempVariation - 10 + Math.random() * 5),
          rainChance: Math.round(Math.random() * 100),
          humidity: Math.round(40 + Math.random() * 40),
          sunrise: '6:' + (Math.floor(Math.random() * 60)).toString().padStart(2, '0') + ' AM',
          sunset: '7:' + (Math.floor(Math.random() * 60)).toString().padStart(2, '0') + ' PM',
        });
      }
      
      setForecast(simulatedForecast);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather forecast:', err);
      setError('Failed to fetch weather forecast');
      setLoading(false);
    }
  }, []);

  // Helper function to generate random weather condition
  const getRandomCondition = () => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Rain', 'Thunderstorm'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    if (!condition) return '🌤️';
    
    const lowerCaseCondition = condition.toLowerCase();
    
    if (lowerCaseCondition.includes('sunny') || lowerCaseCondition.includes('clear')) {
      return '☀️';
    } else if (lowerCaseCondition.includes('partly cloudy')) {
      return '⛅';
    } else if (lowerCaseCondition.includes('cloudy')) {
      return '☁️';
    } else if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('shower')) {
      return '🌧️';
    } else if (lowerCaseCondition.includes('thunderstorm') || lowerCaseCondition.includes('lightning')) {
      return '⛈️';
    } else if (lowerCaseCondition.includes('snow')) {
      return '❄️';
    } else if (lowerCaseCondition.includes('fog') || lowerCaseCondition.includes('mist')) {
      return '🌫️';
    } else {
      return '🌤️';
    }
  };

  // Generate plant care tip based on weather
  const generatePlantCareTip = useCallback(() => {
    if (!currentWeather) return '';
    
    if (currentWeather.temperature > 85) {
      return "It's quite hot today! Consider moving your plant away from direct sunlight and check water more frequently.";
    } else if (currentWeather.temperature < 60) {
      return "Temperatures are cool today. Make sure your plant is away from cold drafts and avoid watering with cold water.";
    } else if (currentWeather.condition.toLowerCase().includes('rain')) {
      return "It's rainy today, which means higher humidity. Indoor plants might need less water than usual.";
    } else if (currentWeather.condition.toLowerCase().includes('sunny') || currentWeather.condition.toLowerCase().includes('clear')) {
      return "It's sunny today! Good time to give your plant some indirect natural light, but avoid direct harsh sunlight.";
    } else {
      return "Today's weather is moderate. Perfect conditions to maintain your regular plant care routine.";
    }
  }, [currentWeather]);

  // Get user's location if needed
  const detectLocation = async () => {
    try {
      setLoading(true);
      const location = await getUserLocation();
      // In a real app, you would update the user's location with this data
      setLoading(false);
      return location;
    } catch (err) {
      console.error('Error getting user location:', err);
      setError('Failed to detect location');
      setLoading(false);
      return null;
    }
  };

  // Initial data fetch on mount
  useEffect(() => {
    fetchWeather();
    fetchForecast();
    
    // Refresh weather data every 30 minutes
    const interval = setInterval(() => {
      fetchWeather();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchWeather, fetchForecast]);

  // Generate plant care tip when weather changes
  const plantCareTip = generatePlantCareTip();

  // Function to manually refresh data
  const refreshWeather = () => {
    fetchWeather();
    fetchForecast();
  };

  return {
    currentWeather,
    forecast,
    loading,
    error,
    getWeatherIcon,
    plantCareTip,
    refreshWeather,
    detectLocation
  };
};

export default useWeatherData;