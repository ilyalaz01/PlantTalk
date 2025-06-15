// src/pages/Dashboard.js - Mobile Responsive Dashboard
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
  max-width: 1000px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  }
`;

const WelcomeMessage = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const PlantSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: 480px) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const SensorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.xl} 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: ${({ theme }) => theme.spacing.sm};
    margin: ${({ theme }) => theme.spacing.lg} 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.xs};
    margin: ${({ theme }) => theme.spacing.md} 0;
  }

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ActionSection = styled.div`
  margin: ${({ theme }) => theme.spacing.xl} 0;

  @media (max-width: 768px) {
    margin: ${({ theme }) => theme.spacing.lg} 0;
  }

  @media (max-width: 480px) {
    margin: ${({ theme }) => theme.spacing.md} 0;
  }
`;

const BottomSection = styled.div`
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(280px, 1fr);
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  
  /* Ensure both items have adequate minimum width */
  > * {
    min-width: 0; /* Allows items to shrink below content size when needed */
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
    margin-top: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: 480px) {
    gap: ${({ theme }) => theme.spacing.md};
    margin-top: ${({ theme }) => theme.spacing.md};
  }
  
  @media (max-width: 360px) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    height: 200px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: 480px) {
    height: 150px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.status.danger};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.md};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.lg} 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.sm};
    margin: ${({ theme }) => theme.spacing.md} 0;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  small {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.sm};
    font-size: 0.8em;
    opacity: 0.8;
    word-break: break-word;

    @media (max-width: 480px) {
      margin-top: ${({ theme }) => theme.spacing.xs};
      font-size: 0.75em;
    }
  }
`;

const SensorSection = styled.div`
  margin: ${({ theme }) => theme.spacing.xl} 0;

  @media (max-width: 768px) {
    margin: ${({ theme }) => theme.spacing.lg} 0;
  }

  @media (max-width: 480px) {
    margin: ${({ theme }) => theme.spacing.md} 0;
  }
`;

const SensorTitle = styled.h3`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

const Dashboard = () => {
  // Use REAL sensor data from Railway API - not mock data!
  const sensorDataHook = useSensorData();
  const { currentData, fetchHistory, historicalData, loading, error } = sensorDataHook;
  
  const { plant, loading: plantLoading, error: plantError } = usePlant();
  
  useEffect(() => {
    fetchHistory(7);
  }, []);
  
  // 🔍 DEBUG: Let's see what currentData actually contains
  console.log('🔍 Dashboard Debug - Raw currentData:', currentData);
  console.log('🔍 Dashboard Debug - currentData type:', typeof currentData);
  console.log('🔍 Dashboard Debug - currentData keys:', currentData ? Object.keys(currentData) : 'null/undefined');
  
  // Check the actual structure
  if (currentData) {
    console.log('🔍 Raw sensor values:');
    console.log('  - soilMoisture:', currentData.soilMoisture);
    console.log('  - temperature:', currentData.temperature);  
    console.log('  - humidity:', currentData.humidity);
    console.log('  - light:', currentData.light);
    
    // Also check if it's nested differently
    console.log('🔍 Nested check:');
    console.log('  - currentData.soil:', currentData.soil);
    console.log('  - currentData.humidity (nested):', currentData.humidity);
    console.log('  - currentData.temperature (nested):', currentData.temperature);
  }
  
  // REAL sensor data from Railway API: temperature, humidity, soil moisture  
  const realSensorData = currentData ? {
  // Handle both nested object format and direct value format
  soilMoisture: currentData.soilMoisture || currentData.soil?.value || currentData.soil || 0,
  temperature: currentData.temperature?.value || currentData.temperature || 0,
  humidity: currentData.humidity?.value || currentData.humidity || 0,
  light: currentData.light?.value || currentData.light || 65,
  lastUpdated: currentData.lastUpdated || null
} : {
  soilMoisture: 0,
  temperature: 0,
  humidity: 0,
  light: 65,
  lastUpdated: null
};

// 🔍 DEBUG: Let's see what we're getting
console.log('🔍 Dashboard - currentData:', currentData);
console.log('🔍 Dashboard - mapped realSensorData:', realSensorData);
  
  // 🔍 DEBUG: Let's see what we're actually passing to the gauges
  console.log('🔍 Final realSensorData being passed to gauges:', realSensorData);
  console.log('🔍 Individual values:');
  console.log('  - Moisture value:', realSensorData.soilMoisture ?? 0);
  console.log('  - Temperature value:', realSensorData.temperature ?? 0);
  console.log('  - Humidity value:', realSensorData.humidity ?? 0);
  console.log('  - Light value:', realSensorData.light ?? 0);
  
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
          <small>Error: {error?.message || plantError || 'Unknown error occurred'}</small>
        </ErrorMessage>
      </DashboardContainer>
    );
  }
  
  return (
    <DashboardContainer>
      <WelcomeMessage>Welcome back, {userName}!</WelcomeMessage>
      
      {/* Plant Avatar and Speech Bubble */}
      <PlantSection>
        {/* Pass REAL sensor data from Railway API to PlantAvatar */}
        <PlantAvatar plant={plant} sensorData={realSensorData} />
        <SpeechBubble plant={plant} sensorData={realSensorData} />
      </PlantSection>
      
      {/* Sensor Data Grid */}
      <SensorSection>
        <SensorTitle>Plant Health Monitoring</SensorTitle>
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
      </SensorSection>
      
      {/* Action Button */}
      <ActionSection>
        <ActionButton />
      </ActionSection>
      
      {/* Bottom Section with Calendar and Weather */}
      <BottomSection>
        <StreakCalendar 
        sensorData={historicalData || []}
        careHistory={plant?.careHistory || []} 
      />
        <WeatherWidget />
      </BottomSection>
    </DashboardContainer>
  );
};

export default Dashboard;