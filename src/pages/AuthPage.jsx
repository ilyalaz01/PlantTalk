// src/pages/AuthPage.jsx - Simple Working Version
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  padding: 20px;
`;

const AuthCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 30px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
`;

const Label = styled.label`
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const Button = styled.button`
  background: #4CAF50;
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:hover {
    background: #45a049;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ToggleText = styled.p`
  color: #666;
  margin-top: 20px;
  
  button {
    background: none;
    border: none;
    color: #4CAF50;
    text-decoration: underline;
    cursor: pointer;
    font-size: inherit;
  }
`;

const Message = styled.div`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  background: ${props => props.type === 'error' ? '#ffebee' : '#e8f5e8'};
  color: ${props => props.type === 'error' ? '#c62828' : '#2e7d32'};
  border-left: 4px solid ${props => props.type === 'error' ? '#c62828' : '#4CAF50'};
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const { signUp, signIn, loading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear message when user starts typing
    if (message) {
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.email || !formData.password) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    if (!isLogin && !formData.displayName) {
      setMessage('Please enter your name');
      setMessageType('error');
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, formData.displayName);
      }

      if (result.success) {
        setMessage(isLogin ? 'Login successful!' : 'Account created successfully!');
        setMessageType('success');
        // Navigation will be handled by AuthContext auth state change
      } else {
        setMessage(result.error);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      setMessageType('error');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', displayName: '' });
    setMessage('');
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Logo>🌱</Logo>
        <Title>
          {isLogin ? 'Welcome Back!' : 'Join PlantTalk'}
        </Title>
        <Subtitle>
          {isLogin 
            ? 'Sign in to check on your plant' 
            : 'Start your plant care journey'}
        </Subtitle>

        {message && (
          <Message type={messageType}>
            {message}
          </Message>
        )}

        <Form>
          {!isLogin && (
            <InputGroup>
              <Label>Your Name</Label>
              <Input
                name="displayName"
                type="text"
                placeholder="Enter your name"
                value={formData.displayName}
                onChange={handleInputChange}
              />
            </InputGroup>
          )}

          <InputGroup>
            <Label>Email Address</Label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </InputGroup>

          <InputGroup>
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </InputGroup>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <LoadingSpinner />}
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </Form>

        <ToggleText>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} disabled={loading}>
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </ToggleText>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthPage;