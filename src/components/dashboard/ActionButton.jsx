// src/components/dashboard/ActionButton.js
import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { usePlant } from '../../contexts/PlantContext';
import { useSensor } from '../../contexts/SensorContext';

// Define keyframes at the top of the file
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
`;

const splash = keyframes`
  0% {
    opacity: 1;
    transform: scale(0);
  }
  
  70% {
    opacity: 0.7;
  }
  
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
`;

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

const ActionButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const ButtonWrapper = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StyledButton = styled.button`
  background-color: ${({ theme, urgent }) => 
    urgent ? theme.colors.status.danger : theme.colors.primary};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all ${({ theme }) => theme.transitions.medium};
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 200px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  ${({ urgent }) => urgent && css`
    animation: ${pulse} 2s infinite;
  `}
  
  &:hover {
    background-color: ${({ theme, urgent }) => 
      urgent ? theme.colors.status.danger : theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ButtonIcon = styled.span`
  font-size: 24px;
`;

const SplashEffect = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  z-index: -1;
  animation: ${splash} 1s ease-out forwards;
  opacity: 0;
  pointer-events: none;
`;

const ActionDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
  margin: 0;
  max-width: 300px;
`;

const FeedbackMessage = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme, success }) => 
    success ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, success }) => 
    success ? theme.colors.status.healthy : theme.colors.status.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
  max-width: 300px;
`;

const ActionButton = () => {
  const { plant, recordCareAction } = usePlant();
  const { sensorData, refreshSensorData } = useSensor();
  const [showSplash, setShowSplash] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  // Determine the appropriate action based on plant status
  const getAction = () => {
    switch (plant.status) {
      case 'thirsty':
        return {
          text: 'Water Me Now',
          icon: '💧',
          action: 'watered',
          description: 'Your plant needs water! Soil moisture is low.',
          urgent: true
        };
      case 'cold':
        return {
          text: 'Move Me',
          icon: '🔥',
          action: 'moved',
          description: 'Your plant is too cold. Move to a warmer location.',
          urgent: true
        };
      case 'hot':
        return {
          text: 'Move Me',
          icon: '❄️',
          action: 'moved',
          description: 'Your plant is too hot. Move to a cooler location.',
          urgent: true
        };
      default:
        if (sensorData.soilMoisture < 40) {
          return {
            text: 'Water Soon',
            icon: '💧',
            action: 'watered',
            description: 'Your plant will need water soon.',
            urgent: false
          };
        } else {
          return {
            text: 'Check on Me',
            icon: '👀',
            action: 'checked',
            description: 'Your plant is doing well! Just checking in?',
            urgent: false
          };
        }
    }
  };
  
  const actionInfo = getAction();
  
  const handleAction = () => {
    // Set splash effect
    setShowSplash(true);
    
    // Record the care action
    recordCareAction(actionInfo.action);
    
    // Update sensor readings
    if (actionInfo.action === 'watered') {
      // Update soil moisture (would be done by real sensors in a real app)
      // For the demo, we'll simulate it
      refreshSensorData();
    }
    
    // Show feedback message
    setFeedback({
      success: true,
      message: `Great job! You've ${actionInfo.action} your plant. It's happy now!`
    });
    
    // Remove splash effect and feedback after delay
    setTimeout(() => {
      setShowSplash(false);
    }, 1000);
    
    setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };
  
  return (
    <ActionButtonContainer>
      <ButtonWrapper>
        <StyledButton 
          onClick={handleAction}
          urgent={actionInfo.urgent}
        >
          <ButtonIcon>{actionInfo.icon}</ButtonIcon>
          {actionInfo.text}
        </StyledButton>
        {showSplash && <SplashEffect />}
      </ButtonWrapper>
      
      <ActionDescription>
        {actionInfo.description}
      </ActionDescription>
      
      {feedback && (
        <FeedbackMessage success={feedback.success}>
          {feedback.message}
        </FeedbackMessage>
      )}
    </ActionButtonContainer>
  );
};

export default ActionButton;