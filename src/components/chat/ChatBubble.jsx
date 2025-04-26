// src/components/chat/ChatBubble.js
import React from 'react';
import styled, { css, keyframes } from 'styled-components';

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

const BubbleContainer = styled.div`
  display: flex;
  flex-direction: ${({ isPlant }) => isPlant ? 'row' : 'row-reverse'};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  animation: ${fadeIn} 0.3s ease-out;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background-color: ${({ isPlant, theme }) => 
    isPlant ? theme.colors.primary : '#E0E0E0'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: ${({ isPlant, theme }) => isPlant ? theme.spacing.md : 0};
  margin-left: ${({ isPlant, theme }) => isPlant ? 0 : theme.spacing.md};
  flex-shrink: 0;
`;

const Bubble = styled.div`
  max-width: 70%;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme, isPlant }) => 
    isPlant 
      ? `${theme.borderRadius.md} ${theme.borderRadius.lg} ${theme.borderRadius.lg} ${theme.borderRadius.xs}`
      : `${theme.borderRadius.lg} ${theme.borderRadius.md} ${theme.borderRadius.xs} ${theme.borderRadius.lg}`
  };
  background-color: ${({ isPlant, theme }) => 
    isPlant ? 'rgba(76, 175, 80, 0.1)' : theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative;
  
  ${({ isTyping }) => isTyping && css`
    &:after {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-left: ${({ theme }) => theme.spacing.xs};
      background-color: ${({ theme }) => theme.colors.primary};
      border-radius: 50%;
      animation: blink 1s infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 0.2; }
      50% { opacity: 1; }
    }
  `}
`;

const Timestamp = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  text-align: right;
`;

const ChatBubble = ({ 
  message, 
  isPlant = false, 
  isTyping = false,
}) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <BubbleContainer isPlant={isPlant}>
      <Avatar isPlant={isPlant}>
        {isPlant ? '🌿' : '👤'}
      </Avatar>
      <Bubble isPlant={isPlant} isTyping={isTyping}>
        {message.text}
        {!isTyping && <Timestamp>{formatTime(message.timestamp)}</Timestamp>}
      </Bubble>
    </BubbleContainer>
  );
};

export default ChatBubble;