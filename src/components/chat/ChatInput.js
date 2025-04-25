// src/components/chat/ChatInput.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.sm};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TextInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.7;
  }
`;

const InputIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:disabled {
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ChatInput = ({ onSendMessage, isPlantTyping }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !isPlantTyping) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputContainer>
        <TextInput
          ref={inputRef}
          type="text"
          placeholder="Ask your plant a question..."
          value={message}
          onChange={handleInputChange}
          disabled={isPlantTyping}
        />
        <InputIconButton 
          type="submit" 
          disabled={!message.trim() || isPlantTyping}
        >
          📤
        </InputIconButton>
      </InputContainer>
    </form>
  );
};

export default ChatInput;