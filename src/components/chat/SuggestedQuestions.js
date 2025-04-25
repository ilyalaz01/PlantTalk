// src/components/chat/SuggestedQuestions.js
import React from 'react';
import styled from 'styled-components';
import { usePlant } from '../../contexts/PlantContext';
import { useSensor } from '../../contexts/SensorContext';

const SuggestionsContainer = styled.div`
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const Title = styled.h4`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const QuestionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const QuestionChip = styled.button`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: rgba(76, 175, 80, 0.1);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuggestedQuestions = ({ onSelectQuestion, isPlantTyping }) => {
  const { plant } = usePlant();
  const { sensorData } = useSensor();
  
  // Generate context-aware questions based on plant status and sensor data
  const generateQuestions = () => {
    const generalQuestions = [
      "How often should I water you?",
      "What's the best temperature for you?",
      "Do you need direct sunlight?",
      "How do I know if you're healthy?"
    ];
    
    let contextualQuestions = [];
    
    // Add questions based on plant status
    switch (plant.status) {
      case 'thirsty':
        contextualQuestions.push(
          "Why do you need more water?",
          "How much water should I give you?"
        );
        break;
      case 'cold':
        contextualQuestions.push(
          "What's your ideal temperature?",
          "How does cold affect you?"
        );
        break;
      case 'hot':
        contextualQuestions.push(
          "Why is too much heat bad for you?",
          "How can I cool you down?"
        );
        break;
      default:
        break;
    }
    
    // Add questions based on sensor readings
    if (sensorData.soilMoisture < 40) {
      contextualQuestions.push("When will you need water again?");
    }
    
    if (sensorData.light < 40) {
      contextualQuestions.push("Do you need more light?");
    }
    
    // Combine and return uniquified questions
    const allQuestions = [...contextualQuestions, ...generalQuestions];
    return allQuestions.slice(0, 5); // Limit to 5 suggestions
  };
  
  const suggestedQuestions = generateQuestions();
  
  return (
    <SuggestionsContainer>
      <Title>Suggested Questions</Title>
      <QuestionsList>
        {suggestedQuestions.map((question, index) => (
          <QuestionChip
            key={index}
            onClick={() => onSelectQuestion(question)}
            disabled={isPlantTyping}
          >
            {question}
          </QuestionChip>
        ))}
      </QuestionsList>
    </SuggestionsContainer>
  );
};

export default SuggestedQuestions;