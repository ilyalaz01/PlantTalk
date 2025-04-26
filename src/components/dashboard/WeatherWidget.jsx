// src/components/dashboard/WeatherWidget.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const WidgetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const Location = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const WeatherContent = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WeatherIcon = styled.div`
  font-size: 48px;
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const WeatherInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Temperature = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Condition = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ParametersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Parameter = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ParameterIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.primary};
  width: 24px;
  text-align: center;
`;

const ParameterValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PlantTips = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const TipsTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TipsText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.md};
`;

// Function to get weather icon based on condition
const getWeatherIcon = (condition) => {
  switch (condition.toLowerCase()) {
    case 'clear':
    case 'sunny':
      return '☀️';
    case 'partly cloudy':
      return '⛅';
    case 'cloudy':
      return '☁️';
    case 'rainy':
    case 'rain':
      return '🌧️';
    case 'stormy':
    case 'thunderstorm':
      return '⛈️';
    case 'snowy':
    case 'snow':
      return '❄️';
    case 'foggy':
    case 'fog':
      return '🌫️';
    default:
      return '🌤️';
  }
};

// Function to generate plant care tips based on weather
const getPlantTips = (weather) => {
  if (weather.temperature > 85) {
    return "It's quite hot today! Consider moving your plant away from direct sunlight and check water more frequently.";
  } else if (weather.temperature < 60) {
    return "Temperatures are cool today. Make sure your plant is away from cold drafts and avoid watering with cold water.";
  } else if (weather.condition.toLowerCase().includes('rain')) {
    return "It's rainy today, which means higher humidity. Indoor plants might need less water than usual.";
  } else if (weather.condition.toLowerCase().includes('sunny') || weather.condition.toLowerCase().includes('clear')) {
    return "It's sunny today! Good time to give your plant some indirect natural light, but avoid direct harsh sunlight.";
  } else {
    return "Today's weather is moderate. Perfect conditions to maintain your regular plant care routine.";
  }
};

const WeatherWidget = () => {
  // In a real app, this would fetch from a weather API
  const [weather, setWeather] = useState({
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    location: 'Seattle, WA',
    lastUpdated: new Date(),
  });
  
  const [loading, setLoading] = useState(false);
  
  // Simulate fetching weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const data = await weatherService.getCurrentWeather();
        // setWeather(data);
        
        // For demo, just update slightly
        setTimeout(() => {
          setWeather(prev => ({
            ...prev,
            temperature: prev.temperature + (Math.random() * 2 - 1),
            humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() * 5 - 2.5))),
            windSpeed: Math.max(0, prev.windSpeed + (Math.random() * 2 - 1)),
            lastUpdated: new Date()
          }));
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setLoading(false);
      }
    };
    
    fetchWeather();
    
    // Refresh weather periodically
    const interval = setInterval(fetchWeather, 30 * 60 * 1000); // every 30 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  const weatherIcon = getWeatherIcon(weather.condition);
  const plantTips = getPlantTips(weather);
  
  return (
    <WidgetContainer>
      <WidgetHeader>
        <Title>Local Weather</Title>
        <Location>{weather.location}</Location>
      </WidgetHeader>
      
      <WeatherContent>
        <WeatherIcon>{weatherIcon}</WeatherIcon>
        <WeatherInfo>
          <Temperature>{Math.round(weather.temperature)}°F</Temperature>
          <Condition>{weather.condition}</Condition>
        </WeatherInfo>
      </WeatherContent>
      
      <ParametersGrid>
        <Parameter>
          <ParameterIcon>💧</ParameterIcon>
          <ParameterValue>Humidity: {Math.round(weather.humidity)}%</ParameterValue>
        </Parameter>
        <Parameter>
          <ParameterIcon>💨</ParameterIcon>
          <ParameterValue>Wind: {Math.round(weather.windSpeed)} mph</ParameterValue>
        </Parameter>
      </ParametersGrid>
      
      <PlantTips>
        <TipsTitle>Today's Plant Care Tip</TipsTitle>
        <TipsText>{plantTips}</TipsText>
      </PlantTips>
    </WidgetContainer>
  );
};

export default WeatherWidget;