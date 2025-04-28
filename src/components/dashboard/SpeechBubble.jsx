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
  const [emotion, setEmotion] = useState('😊 Happy');
  
  // Use props if provided, otherwise use context
  const plant = propPlant || contextPlant || {};
  const sensorData = propSensor || contextSensor || {
    soilMoisture: 50,
    temperature: 22,
    humidity: 50,
    light: 60
  };
  
  // Determine plant's condition based on all sensor data
  const determineCondition = () => {
    // Check conditions in order of priority
    
    // Moisture conditions - critical for plant survival
    if (sensorData.soilMoisture < 30) {
      return 'thirsty';
    }
    if (sensorData.soilMoisture > 70) {
      return 'overwatered';
    }
    
    // Temperature extremes
    if (sensorData.temperature < 17) {
      return 'cold';
    }
    if (sensorData.temperature > 27) {
      return 'hot';
    }
    
    // Humidity issues
    if (sensorData.humidity < 40) {
      return 'dry';
    }
    if (sensorData.humidity > 70) {
      return 'humid';
    }
    
    // Light issues
    if (sensorData.light < 30) {
      return 'dark';
    }
    if (sensorData.light > 80) {
      return 'bright';
    }
    
    // All conditions are optimal
    return 'happy';
  };
  
  // Get emotion based on plant condition
  const getEmotion = (condition) => {
    switch (condition) {
      case 'thirsty':
        return '😫 Thirsty';
      case 'overwatered':
        return '😵 Overwatered';
      case 'cold':
        return '🥶 Cold';
      case 'hot':
        return '🥵 Hot';
      case 'dry':
        return '🏜️ Parched';
      case 'humid':
        return '💦 Humid';
      case 'dark':
        return '🌑 Low Light';
      case 'bright':
        return '☀️ Bright';
      default:
        return '😊 Happy';
    }
  };
  
  // Generate appropriate message based on plant condition and sensor data
  const generateMessage = (condition) => {
    const timeOfDay = new Date().getHours();
    const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 18 ? 'Good afternoon' : 'Good evening';
    
    switch (condition) {
      case 'thirsty':
        return `${greeting}! I'm feeling quite thirsty! My soil moisture is only ${sensorData.soilMoisture}%. Could you water me soon?`;
      
      case 'overwatered':
        return `${greeting}! I'm feeling waterlogged at ${sensorData.soilMoisture}% moisture. My roots need some air to breathe!`;
      
      case 'cold':
        return `Brrrr! ${greeting}! I'm feeling too cold at ${sensorData.temperature}°C. Could you move me somewhere warmer?`;
      
      case 'hot':
        return `Whew! ${greeting}! It's too hot for me at ${sensorData.temperature}°C. Could you move me to a cooler spot or provide some shade?`;
      
      case 'dry':
        return `${greeting}! The air is so dry at ${sensorData.humidity}% humidity. My leaves are feeling crispy. Could you mist me or add a humidifier nearby?`;
      
      case 'humid':
        return `${greeting}! It's very humid here at ${sensorData.humidity}% humidity. My leaves are staying wet which could invite disease. Could you improve air circulation?`;
      
      case 'dark':
        return `${greeting}! I'm not getting enough light at ${sensorData.light}%. Could you move me closer to a window or provide more light?`;
      
      case 'bright':
        return `${greeting}! It's very bright here at ${sensorData.light}% light intensity. I might get sunburned! Could you provide some light filtering?`;
      
      default:
        // Happy and no immediate concerns
        if (daysUntilWaterNeeded <= 1) {
          return `${greeting}! I'm doing well, but I'll need water tomorrow. My soil moisture is at ${sensorData.soilMoisture}%.`;
        } else if (daysUntilWaterNeeded <= 3) {
          return `${greeting}! I'm feeling great today. I'll need water in about ${Math.round(daysUntilWaterNeeded)} days. Thanks for taking such good care of me!`;
        } else {
          return `${greeting}! I'm feeling absolutely perfect! All my environmental conditions are ideal. Thanks for being such a great plant parent!`;
        }
    }
  };
  
  // Update message when plant status or sensor data changes
  useEffect(() => {
    const condition = determineCondition();
    const newEmotion = getEmotion(condition);
    const newMessage = generateMessage(condition);
    
    setEmotion(newEmotion);
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
  }, [
    plant?.status, 
    sensorData?.soilMoisture, 
    sensorData?.temperature, 
    sensorData?.humidity, 
    sensorData?.light, 
    daysUntilWaterNeeded
  ]);
  
  return (
    <BubbleContainer>
      <BubbleHeader>
        <PlantName>{plant?.name || 'Fern Friend'}</PlantName>
        <PlantMood>{emotion}</PlantMood>
      </BubbleHeader>
      <BubbleText typing={isTyping}>
        {currentMessage}
      </BubbleText>
    </BubbleContainer>
  );
};

export default SpeechBubble;