import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid ${({ theme }) => theme.colors.primary}20;
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  text-align: center;
`;

const LoadingIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// Component that requires authentication
const ProtectedRoute = ({ children, redirectToLogin }) => {
  const { currentUser, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingIcon>🌱</LoadingIcon>
        <LoadingSpinner />
        <LoadingText>Loading your plant data...</LoadingText>
      </LoadingContainer>
    );
  }

  // Show login if not authenticated
  if (!currentUser) {
    return redirectToLogin;
  }

  return children;
};

// Component that redirects authenticated users away from auth pages
const PublicRoute = ({ children, redirectToDashboard }) => {
  const { currentUser, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingIcon>🌱</LoadingIcon>
        <LoadingSpinner />
        <LoadingText>Checking authentication...</LoadingText>
      </LoadingContainer>
    );
  }

  // Show dashboard if already authenticated
  if (currentUser) {
    return redirectToDashboard;
  }

  return children;
};

// Onboarding route - for users who need to create their first plant
const OnboardingRoute = ({ children, fallback, redirectToLogin }) => {
  const { currentUser, hasCompletedOnboarding, loading } = useAuth();

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingIcon>🌱</LoadingIcon>
        <LoadingSpinner />
        <LoadingText>Loading your profile...</LoadingText>
      </LoadingContainer>
    );
  }

  if (!currentUser) {
    return redirectToLogin;
  }

  // If user hasn't completed onboarding, show the onboarding component
  if (!hasCompletedOnboarding()) {
    return fallback;
  }

  return children;
};

export { ProtectedRoute, PublicRoute, OnboardingRoute };