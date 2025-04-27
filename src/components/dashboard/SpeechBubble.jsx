// src/components/dashboard/SpeechBubble.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { usePlant } from '../../contexts/PlantContext';
import { useSensor } from '../../contexts/SensorContext';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const typingAnimation = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`;

const blinkCaret = keyframes`
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const BubbleContainer = styled.div`
  position: relative;
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} auto;
  max-width: 90%;
  width: 400px;
  min-height: 120px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  animation: ${fadeIn} 0.5s ease-out;
  
  &:after {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid white;
  }
`;

const BubbleHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PlantName = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const PlantMood = styled.span`
  display: inline-block;
  margin-left: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const BubbleText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  line-height: ${({ theme }) => theme.typography.lineHeight.md};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 3em;
  
  ${({ typing, theme }) => typing && css`
    white-space: nowrap;
    overflow: hidden;
    width: 0;
    border-right: 3px solid;
    animation: 
      ${typingAnimation} 2s steps(40, end) forwards,
      ${blinkCaret} 0.75s step-end infinite;
  `}
`;

const SpeechBubble = ({ plant: propPlant, sensorData: propSensor }) => {
  const { plant: contextPlant } = usePlant();
  const { sensorData: contextSensor, daysUntilWaterNeeded } = useSensor();
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const plant = propPlant || contextPlant;
  const sensorData = propSensor || contextSensor;
  // Get emotion based on plant status
  
  const getEmotion = (status) => {
    switch (status) {
      case 'thirsty':
        return '😫 Thirsty';
      case 'cold':
        return '🥶 Cold';
      case 'hot':
        return '🥵 Hot';
      default:
        return '😊 Happy';
    }
  };
  
  // Generate appropriate message based on plant status and sensor data
  const generateMessage = () => {
    const timeOfDay = new Date().getHours();
    const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 18 ? 'Good afternoon' : 'Good evening';
    
    switch (plant.status) {
      case 'thirsty':
        return `${greeting}, I'm feeling quite thirsty! My soil is getting dry. Could you water me soon?`;
      case 'cold':
        return `Brrrr! ${greeting}, but I'm feeling a bit cold. The temperature is ${sensorData.temperature}°C. Could you move me somewhere warmer?`;
      case 'hot':
        return `Whew! ${greeting}, but it's too hot for me at ${sensorData.temperature}°C. Could you move me to a cooler spot?`;
      default:
        if (daysUntilWaterNeeded <= 1) {
          return `${greeting}! I'm doing well, but I'll need water tomorrow. My soil moisture is at ${sensorData.soilMoisture}%.`;
        } else if (sensorData.light < 30) {
          return `${greeting}! I'm healthy, but I could use a bit more light. Maybe move me closer to a window?`;
        } else {
          return `${greeting}! I'm feeling great today. Thanks for taking such good care of me!`;
        }
    }
  };
  
  // Update message when plant status or sensor data changes
  useEffect(() => {
    const newMessage = generateMessage();
    setIsTyping(true);
    setCurrentMessage('');
    
    // Simulate typing effect
    const typingTimeout = setTimeout(() => {
      setCurrentMessage(newMessage);
      
      // End typing animation after message is displayed
      const endTypingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      
      return () => clearTimeout(endTypingTimeout);
    }, 500);
    
    return () => clearTimeout(typingTimeout);
  }, [plant.status, sensorData, daysUntilWaterNeeded]);
  
  return (
    <BubbleContainer>
      <BubbleHeader>
        <PlantName>{plant.name}</PlantName>
        <PlantMood>{getEmotion(plant.status)}</PlantMood>
      </BubbleHeader>
      <BubbleText typing={isTyping}>
        {currentMessage}
      </BubbleText>
    </BubbleContainer>
  );
};

export default SpeechBubble;