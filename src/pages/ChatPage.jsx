// src/pages/ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import SuggestedQuestions from '../components/chat/SuggestedQuestions';
import { usePlant } from '../contexts/PlantContext';
import { useSensor } from '../contexts/SensorContext';

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ChatTitle = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ChatWindow = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  /* Custom scrollbar for better usability */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.primary} ${({ theme }) => theme.colors.background};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 20px;
    border: 2px solid ${({ theme }) => theme.colors.background};
  }
`;

const EmptyChat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// Function to generate plant responses based on questions
const generatePlantResponse = (question, plantData, sensorData) => {
  // Convert question to lowercase for easier matching
  const q = question.toLowerCase();
  
  // Check for water-related questions
  if (q.includes('water') || q.includes('thirsty') || q.includes('dry')) {
    if (sensorData.soilMoisture < 30) {
      return `Yes, I'm quite thirsty! My soil moisture is at ${sensorData.soilMoisture}%. I'd love some water right now.`;
    } else if (sensorData.soilMoisture > 70) {
      return `I have plenty of water right now! My soil moisture is at ${sensorData.soilMoisture}%. No need to water me for a few days.`;
    } else {
      return `I should be watered when my soil moisture drops below 30%. Right now I'm at ${sensorData.soilMoisture}%, so I'm doing fine!`;
    }
  }
  
  // Check for temperature-related questions
  if (q.includes('temperature') || q.includes('hot') || q.includes('cold') || q.includes('warm')) {
    if (sensorData.temperature < 65) {
      return `It's a bit chilly for me at ${sensorData.temperature}°F. I prefer temperatures between 65°F and 75°F. Maybe move me away from drafty windows?`;
    } else if (sensorData.temperature > 75) {
      return `It's getting warm for me at ${sensorData.temperature}°F. I prefer temperatures between 65°F and 75°F. Could you move me somewhere cooler or away from direct heat?`;
    } else {
      return `The current temperature of ${sensorData.temperature}°F is perfect for me! I thrive in temperatures between 65°F and 75°F.`;
    }
  }
  
  // Check for light-related questions
  if (q.includes('light') || q.includes('sun') || q.includes('bright') || q.includes('dark')) {
    if (sensorData.light < 30) {
      return `I could use more light! My current light level is only ${sensorData.light}%. As a ${plantData.species}, I prefer bright, indirect sunlight.`;
    } else if (sensorData.light > 80) {
      return `I might be getting a bit too much direct sunlight at ${sensorData.light}%. As a ${plantData.species}, I prefer bright, indirect light rather than harsh direct sun.`;
    } else {
      return `My current light level of ${sensorData.light}% is great! As a ${plantData.species}, I enjoy bright, indirect sunlight.`;
    }
  }
  
  // Check for health-related questions
  if (q.includes('healthy') || q.includes('health') || q.includes('doing')) {
    switch (plantData.status) {
      case 'thirsty':
        return `I'm a bit thirsty right now, but otherwise doing fine! My soil moisture is at ${sensorData.soilMoisture}%, which is getting low.`;
      case 'cold':
        return `I'm feeling cold at ${sensorData.temperature}°F. I'd be healthier if you could move me to a warmer spot.`;
      case 'hot':
        return `I'm feeling a bit too warm at ${sensorData.temperature}°F. I'd be healthier in a cooler location.`;
      default:
        return `I'm feeling great! All my vital signs are in the optimal range. Thanks for taking such good care of me!`;
    }
  }
  
  // Default response if no specific category is matched
  const defaultResponses = [
    `As a ${plantData.species}, I'm happiest with regular watering when my soil gets dry, bright indirect light, and temperatures between 65-75°F.`,
    `I've been with you for ${plantData.age} now. Thanks for taking care of me!`,
    `Plants like me communicate through our appearance and growing habits. Thanks for checking in with me!`,
    `I don't quite understand that question, but I can tell you that my soil moisture is ${sensorData.soilMoisture}%, the temperature is ${sensorData.temperature}°F, and the humidity is ${sensorData.humidity}%.`
  ];
  
  // Return a random default response
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
};

const ChatPage = () => {
  const { plant } = usePlant();
  const { sensorData } = useSensor();
  const [messages, setMessages] = useState([]);
  const [isPlantTyping, setIsPlantTyping] = useState(false);
  const chatWindowRef = useRef(null);
  
  // Initial greeting when chat page loads
  useEffect(() => {
    if (messages.length === 0) {
      const initialGreeting = {
        id: 1,
        sender: 'plant',
        text: `Hi there! I'm ${plant.name}, your ${plant.species}. How can I help you today?`,
        timestamp: new Date()
      };
      
      setMessages([initialGreeting]);
    }
  }, []);
  
  // Auto-scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Handle sending a new message
  const handleSendMessage = (text) => {
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate plant typing
    setIsPlantTyping(true);
    
    // Generate plant response after a short delay to simulate thinking
    setTimeout(() => {
      const responseText = generatePlantResponse(text, plant, sensorData);
      
      const plantResponse = {
        id: messages.length + 2,
        sender: 'plant',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, plantResponse]);
      setIsPlantTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
  };
  
  return (
    <ChatContainer>
      <ChatTitle>Chat with {plant.name}</ChatTitle>
      
      <ChatWindow ref={chatWindowRef}>
        {messages.length === 0 ? (
          <EmptyChat>
            <EmptyIcon>💬</EmptyIcon>
            <p>No messages yet. Start a conversation with your plant!</p>
          </EmptyChat>
        ) : (
          messages.map(message => (
            <ChatBubble
              key={message.id}
              message={message}
              isPlant={message.sender === 'plant'}
            />
          ))
        )}
        
        {isPlantTyping && (
          <ChatBubble
            message={{ text: '...', timestamp: new Date() }}
            isPlant={true}
            isTyping={true}
          />
        )}
      </ChatWindow>
      
      <SuggestedQuestions 
        onSelectQuestion={handleSendMessage}
        isPlantTyping={isPlantTyping}
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isPlantTyping={isPlantTyping}
      />
    </ChatContainer>
  );
};

export default ChatPage;