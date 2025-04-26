import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

// --- Configuration ---
const WEATHERAPI_KEY = import.meta.env.VITE_WEATHERAPI_KEY; // Use your new env variable name

// Cities for weatherapi.com (can use city name directly)
const CITIES = [
  { name: 'Haifa, Israel', query: 'Haifa' },
  { name: 'Karmiel, Israel', query: 'Karmiel' }, // Check spelling if needed by API
  { name: 'Tel Aviv, Israel', query: 'Tel Aviv' },
];

// --- Styled Components (Keep as they were) ---
const WidgetContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative; /* For potential loading overlays or modals */
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

const LocationButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
  }
`;

const WeatherContent = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  min-height: 60px; /* Prevent layout shift during loading */
`;

const WeatherIcon = styled.img` /* Use <img> for weatherapi icons */
  width: 52px; /* Adjust size as needed */
  height: 52px;
  margin-right: ${({ theme }) => theme.spacing.md};
  line-height: 1; /* Align icon better */
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
  text-transform: capitalize; /* Nicer display */
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

const StatusOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure it's on top */
`;

const ModalContent = styled.div`
  background-color: white;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 250px;
`;

const ModalTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
  text-align: center;
`;

const CityOptionButton = styled(LocationButton)`
  width: 100%;
  text-align: center;
  background-color: ${({ theme, isSelected }) => isSelected ? 'rgba(76, 175, 80, 0.2)' : 'transparent'};
`;

// --- Helper Functions ---

// Plant tips function (same as before, uses Celsius)
const getPlantTips = (weather) => {
  if (!weather) return "Checking the weather for tips...";

  const tempC = weather.temperature; // Already in Celsius
  const condition = weather.condition?.toLowerCase() || '';

  if (tempC > 30) { // e.g., > 30°C
    return "It's quite hot today! Consider moving sensitive plants away from direct afternoon sun and check water needs more often.";
  } else if (tempC < 15) { // e.g., < 15°C
    return "Temperatures are cool. Make sure your plants are away from cold drafts or open windows. Avoid watering with very cold water.";
  } else if (condition.includes('rain') || condition.includes('drizzle')) {
    return "It's rainy/drizzly, which might increase humidity. Indoor plants might need less frequent watering.";
  } else if (condition.includes('clear') || condition.includes('sunny')) {
    return "It's clear and sunny! Great day for photosynthesis. Ensure plants get the right amount of indirect light, avoiding harsh midday sun.";
  } else {
    return "Today's weather seems moderate. A good day to stick to your regular plant care routine!";
  }
};


// --- Component ---
const WeatherWidget = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]); // Default to Haifa
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading initially
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWeather = useCallback(async (city) => {
    if (!WEATHERAPI_KEY) {
        setError("API key is missing. Please configure WeatherAPI key.");
        setLoading(false);
        console.error("WeatherAPI Key is not set in environment variables.");
        return;
    }
    if (!city) return;

    setLoading(true);
    setError(null);

    // weatherapi.com URL structure
    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${encodeURIComponent(city.query)}&aqi=no`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        // weatherapi.com returns error details in the body even for non-200 responses
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error?.message || 'Failed to fetch weather'}`);
      }
      const data = await response.json();

      // Extract relevant data from weatherapi.com structure
      setWeather({
        temperature: data.current.temp_c, // Use temp_c for Celsius
        condition: data.current.condition.text, // Text description
        icon: data.current.condition.icon, // Icon URL provided by API
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph, // Wind speed in kph
        location: `${data.location.name}, ${data.location.region || data.location.country}`, // Use location data from API
        lastUpdated: new Date(data.current.last_updated_epoch * 1000), // Convert epoch to Date
      });
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []); // API key is read at runtime, no dependencies needed here

  // Fetch weather on initial mount and when selectedCity changes
  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity, fetchWeather]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setIsModalOpen(false);
  };

  const plantTips = getPlantTips(weather); // Generate tips based on fetched weather

  return (
    <WidgetContainer>
      {loading && <StatusOverlay>Loading weather...</StatusOverlay>}
      {error && !loading && <StatusOverlay>Error: {error}</StatusOverlay>}

      <WidgetHeader>
        <Title>Local Weather</Title>
        <LocationButton onClick={() => setIsModalOpen(true)}>
          {weather?.location || selectedCity.name} ▾
        </LocationButton>
      </WidgetHeader>

      {!loading && !error && weather && (
        <>
          <WeatherContent>
             {/* Use img tag for weatherapi icon URL */}
             <WeatherIcon src={weather.icon} alt={weather.condition} />
            <WeatherInfo>
              <Temperature>{Math.round(weather.temperature)}°C</Temperature>
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
              {/* Display Wind Speed in kph */}
              <ParameterValue>Wind: {weather.windSpeed.toFixed(1)} kph</ParameterValue>
            </Parameter>
          </ParametersGrid>

          <PlantTips>
            <TipsTitle>Today's Plant Care Tip</TipsTitle>
            <TipsText>{plantTips}</TipsText>
          </PlantTips>
        </>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
           <ModalContent onClick={(e) => e.stopPropagation()}>
             <ModalTitle>Select City</ModalTitle>
             {CITIES.map(city => (
               <CityOptionButton
                 key={city.query} // Use query as key
                 isSelected={selectedCity.query === city.query}
                 onClick={() => handleCitySelect(city)}
               >
                 {city.name}
               </CityOptionButton>
             ))}
           </ModalContent>
        </ModalOverlay>
      )}
    </WidgetContainer>
  );
};

export default WeatherWidget;