
// src/components/simulator/SimulationDisplay.js
import React from 'react';
import styled from 'styled-components';
import PlantAvatar from '../dashboard/PlantAvatar';
import SpeechBubble from '../dashboard/SpeechBubble';

const DisplayContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DisplayTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

const FeedbackContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 100%;
`;

const FeedbackTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const FeedbackText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.md};
  margin: 0;
`;

const SimulationDisplay = ({ simulatedPlant, simulatedSensor }) => {
  // Generate educational feedback based on the current plant state
  const generateFeedback = () => {
    if (simulatedSensor.soilMoisture < 30) {
      return "Low soil moisture causes the plant to wilt and droop. When plants don't have enough water, they can't maintain turgidity in their cells, leading to wilting. Extended periods of drought can damage or kill plants.";
    } else if (simulatedSensor.soilMoisture > 70) {
      return "Excessively wet soil can lead to root rot, as roots need oxygen to function properly. When soil is waterlogged, oxygen can't reach the roots, leading to stress and potential fungal problems.";
    } else if (simulatedSensor.temperature < 65) {
      return "Cold temperatures slow plant metabolism and growth. Many indoor plants are tropical in origin and prefer temperatures above 65°F. Cold stress can cause leaf drop and dormancy.";
    } else if (simulatedSensor.temperature > 75) {
      return "High temperatures increase water loss through transpiration, potentially leading to heat stress. Plants may wilt even with adequate soil moisture if temperatures are too high.";
    } else if (simulatedSensor.humidity < 40) {
      return "Low humidity causes increased water loss through leaves, leading to browning leaf tips and edges. Many houseplants evolved in tropical areas with high humidity and struggle in dry indoor air.";
    } else if (simulatedSensor.light < 30) {
      return "Insufficient light reduces photosynthesis, causing plants to grow leggy as they stretch toward light sources. Leaves may become smaller and growth slows significantly.";
    } else if (simulatedSensor.light > 80) {
      return "Excessive direct light can cause leaf burn and stress in plants adapted to filtered light. The equivalent of sunburn in plants can damage leaf tissue permanently.";
    } else {
      return "Your plant is in optimal conditions! Notice how it displays healthy growth and vibrant color. The balance of water, light, temperature, and humidity is creating an ideal environment for your plant to thrive.";
    }
  };
  
  return (
    <DisplayContainer>
      <DisplayTitle>Plant Response Simulation</DisplayTitle>
      
      <PlantAvatar plant={simulatedPlant} sensorData={simulatedSensor} />
      <SpeechBubble plant={simulatedPlant} sensorData={simulatedSensor} />
      
      <FeedbackContainer>
        <FeedbackTitle>What's Happening</FeedbackTitle>
        <FeedbackText>{generateFeedback()}</FeedbackText>
      </FeedbackContainer>
    </DisplayContainer>
  );
};

export default SimulationDisplay;