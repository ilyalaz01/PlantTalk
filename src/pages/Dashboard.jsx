// src/pages/Dashboard.js
import React, { useEffect } from 'react';
import styled from 'styled-components';
import PlantAvatar from '../components/dashboard/PlantAvatar';
import SpeechBubble from '../components/dashboard/SpeechBubble';
import SensorGauge from '../components/dashboard/SensorGauge';
import ActionButton from '../components/dashboard/ActionButton';
import StreakCalendar from '../components/dashboard/StreakCalendar';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import useSensorData from '../hooks/useSensorData';
import { usePlant } from '../contexts/PlantContext';

const DashboardContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SensorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const WelcomeMessage = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.status.danger};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const Dashboard = () => {
  // Use REAL sensor data from Railway API - not mock data!
  const sensorDataHook = useSensorData();
  const { currentData, fetchHistory, historicalData, loading, error } = sensorDataHook;
  
  const { plant, loading: plantLoading, error: plantError } = usePlant();
  
  useEffect(() => {
    fetchHistory(7);
  }, []);
  
  // REAL sensor data from Railway API: temperature, humidity, soil moisture  
  const realSensorData = currentData || {
    soilMoisture: 0,
    temperature: 0,
    humidity: 0,
    light: 65, // hardcoded as per useSensorData
    lastUpdated: null
  };
  
  // Get user's name - in a real app, this would come from a user context or profile
  const userName = "Yelena";
  
  if (loading || plantLoading) {
    return (
      <DashboardContainer>
        <LoadingIndicator>
          🌱 Loading your plant data...
        </LoadingIndicator>
      </DashboardContainer>
    );
  }
  
  if (error || plantError) {
    return (
      <DashboardContainer>
        <ErrorMessage>
          Sorry, we couldn't load your plant data. Please try again later.
          <br />
          <small>Error: {error?.message || plantError || 'Unknown error occurred'}</small>
        </ErrorMessage>
      </DashboardContainer>
    );
  }
  
  return (
    <DashboardContainer>
      <WelcomeMessage>Welcome back, {userName}!</WelcomeMessage>
      
      {/* Pass REAL sensor data from Railway API to PlantAvatar */}
      <PlantAvatar plant={plant} sensorData={realSensorData} />
      <SpeechBubble plant={plant} sensorData={realSensorData} />
      
      <SensorGrid>
        <SensorGauge 
          type="moisture" 
          value={realSensorData.soilMoisture ?? 0} 
          title="Soil Moisture" 
        />
        <SensorGauge 
          type="temperature" 
          value={realSensorData.temperature ?? 0} 
          title="Temperature" 
        />
        <SensorGauge 
          type="humidity" 
          value={realSensorData.humidity ?? 0} 
          title="Humidity" 
        />
        <SensorGauge 
          type="light" 
          value={realSensorData.light ?? 0} 
          title="Light Level" 
        />
      </SensorGrid>
      
      <ActionButton />
      
      <BottomSection>
        <StreakCalendar streak={plant?.streak || 0} careHistory={plant?.careHistory || []} />
        <WeatherWidget />
      </BottomSection>
    </DashboardContainer>
  );
};

export default Dashboard;