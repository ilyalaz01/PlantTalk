// src/pages/Dashboard.js
import React from 'react';
import styled from 'styled-components';
import PlantAvatar from '../components/dashboard/PlantAvatar';
import SpeechBubble from '../components/dashboard/SpeechBubble';
import SensorGauge from '../components/dashboard/SensorGauge';
import ActionButton from '../components/dashboard/ActionButton';
import StreakCalendar from '../components/dashboard/StreakCalendar';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import { useSensor } from '../contexts/SensorContext';
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
  const { sensorData, loading: sensorLoading, error: sensorError } = useSensor();
  const { plant, loading: plantLoading, error: plantError } = usePlant();
  
  // Get user's name - in a real app, this would come from a user context or profile
  const userName = "Yelena";
  
  if (sensorLoading || plantLoading) {
    return (
      <DashboardContainer>
        <LoadingIndicator>
          🌱 Loading your plant data...
        </LoadingIndicator>
      </DashboardContainer>
    );
  }
  
  if (sensorError || plantError) {
    return (
      <DashboardContainer>
        <ErrorMessage>
          Sorry, we couldn't load your plant data. Please try again later.
        </ErrorMessage>
      </DashboardContainer>
    );
  }
  
  return (
    <DashboardContainer>
      <WelcomeMessage>Welcome back, {userName}!</WelcomeMessage>
      
      <PlantAvatar />
      <SpeechBubble />
      
      <SensorGrid>
        <SensorGauge 
          type="moisture" 
          value={sensorData.soilMoisture} 
          title="Soil Moisture" 
        />
        <SensorGauge 
          type="temperature" 
          value={sensorData.temperature} 
          title="Temperature" 
        />
        <SensorGauge 
          type="humidity" 
          value={sensorData.humidity} 
          title="Humidity" 
        />
        <SensorGauge 
          type="light" 
          value={sensorData.light} 
          title="Light Level" 
        />
      </SensorGrid>
      
      <ActionButton />
      
      <BottomSection>
        <StreakCalendar streak={plant.streak} careHistory={plant.careHistory} />
        <WeatherWidget />
      </BottomSection>
    </DashboardContainer>
  );
};

export default Dashboard;