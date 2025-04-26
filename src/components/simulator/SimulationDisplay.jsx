
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


const feedbackConditions = [
  { 
    condition: (sensor) => sensor.soilMoisture < 30, 
    message: (sensor) => `Low soil moisture (${sensor.soilMoisture}%). Plants wilt when they can't maintain water pressure in their cells.` 
  },
  { 
    condition: (sensor) => sensor.soilMoisture > 70, 
    message: (sensor) => `Excessively wet soil (${sensor.soilMoisture}%) can cause root rot. Roots need oxygen to survive!`
  },
  { 
    condition: (sensor) => sensor.temperature < 17, 
    message: (sensor) => `Cold temperature detected (${sensor.temperature}°C). Growth slows down and leaves may drop.`
  },
  { 
    condition: (sensor) => sensor.temperature > 27, 
    message: (sensor) => `High temperature (${sensor.temperature}°C). Plants lose water faster and might wilt.`
  },
  { 
    condition: (sensor) => sensor.humidity < 40, 
    message: (sensor) => `Low humidity (${sensor.humidity}%). Leaves may brown at the tips and edges.`
  },
  { 
    condition: (sensor) => sensor.light < 30, 
    message: (sensor) => `Low light detected (${sensor.light}%). The plant may grow leggy and weak.`
  },
  { 
    condition: (sensor) => sensor.light > 80, 
    message: (sensor) => `Too much light (${sensor.light}%). Leaves might burn if exposed too long.`
  },
];



const SimulationDisplay = ({ simulatedPlant, simulatedSensor }) => {
  const generateFeedback = () => {
    const triggeredMessages = [];

    for (const feedback of feedbackConditions) {
      if (feedback.condition(simulatedSensor)) {
        triggeredMessages.push(feedback.message(simulatedSensor));
      }
    }

    if (triggeredMessages.length === 0) {
      return "Your plant is in optimal conditions! All values are within healthy ranges.";
    }

    let intro = "Your plant needs attention! ";
    let problems = triggeredMessages.join(" Also, ");
    let advice = " Please address these issues to help your plant thrive.";
    
    return intro + problems + advice;
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