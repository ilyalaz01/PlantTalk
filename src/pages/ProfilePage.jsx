// src/pages/ProfilePage.jsx - Mobile Responsive Profile Page
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import PlantOnboarding from '../components/auth/PlantOnboarding';
import PlantManagement from '../components/profile/PlantManagement';
import PlantInfo from '../components/profile/PlantInfo';
import CareHistory from '../components/profile/CareHistory';
import PhotoGallery from '../components/profile/PhotoGallery';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.sm};
  }
`;

const ProfileTitle = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    gap: ${({ theme }) => theme.spacing.xs};
    flex-direction: column;
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const ProfileIcon = styled.span`
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    height: 200px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    padding: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: 480px) {
    height: 150px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.status.danger};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.md};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.lg} 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.sm};
    margin: ${({ theme }) => theme.spacing.md} 0;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }

  small {
    display: block;
    margin-top: ${({ theme }) => theme.spacing.sm};
    font-size: 0.8em;
    opacity: 0.8;
  }
`;

const WelcomeContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const WelcomeIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    font-size: 3rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const WelcomeTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    line-height: 1.3;
  }
`;

const WelcomeText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    line-height: 1.4;
  }
`;

const EditModeContainer = styled.div`
  background: ${({ theme }) => theme.colors.primary}10;
  border: 2px solid ${({ theme }) => theme.colors.primary}40;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.spacing.xs};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    border-width: 1px;
  }
`;

const EditModeTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    gap: ${({ theme }) => theme.spacing.xs};
    flex-direction: column;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

const EditModeText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    line-height: 1.3;
  }
`;

const CancelEditButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spacing.sm};
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background: ${({ theme }) => theme.colors.text.secondary};
    color: white;
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    margin-top: ${({ theme }) => theme.spacing.xs};
  }

  @media (max-width: 480px) {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    font-size: 0.75rem;
    width: 100%;
    max-width: 200px;
  }
`;

const ComponentWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: 480px) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { loading, error, hasCompletedOnboarding, plant, user } = useAuth();
  
  if (loading) {
    return (
      <ProfileContainer>
        <LoadingIndicator>
          🌱 Loading your basil profile...
        </LoadingIndicator>
      </ProfileContainer>
    );
  }
  
  if (error) {
    return (
      <ProfileContainer>
        <ErrorMessage>
          Sorry, we couldn't load your basil profile. Please try again later.
          <small>{error}</small>
        </ErrorMessage>
      </ProfileContainer>
    );
  }
  
  // Show plant creation form if user hasn't created a plant yet
  if (!hasCompletedOnboarding()) {
    return (
      <ProfileContainer>
        <WelcomeContainer>
          <WelcomeIcon>🌿</WelcomeIcon>
          <WelcomeTitle>Welcome to your Basil Profile, {user?.displayName || 'Basil Parent'}!</WelcomeTitle>
          <WelcomeText>
            Let's create your basil plant profile to start tracking its health and growth.
          </WelcomeText>
        </WelcomeContainer>
        <PlantOnboarding isEditing={false} />
      </ProfileContainer>
    );
  }

  // Show edit form if user is editing their plant
  if (isEditing) {
    return (
      <ProfileContainer>
        <EditModeContainer>
          <EditModeTitle>
            ✏️ Editing Plant Profile
          </EditModeTitle>
          <EditModeText>
            Update your basil information below. Changes will be saved automatically.
          </EditModeText>
          <CancelEditButton onClick={() => setIsEditing(false)}>
            Cancel Editing
          </CancelEditButton>
        </EditModeContainer>
        <PlantOnboarding 
          isEditing={true} 
          existingPlant={plant}
          onComplete={() => setIsEditing(false)}
        />
      </ProfileContainer>
    );
  }
  
  // Show full plant profile if user has a plant
  return (
    <ProfileContainer>
      <ProfileTitle>
        <ProfileIcon>🌿</ProfileIcon>
        {plant?.name || 'My Basil'}'s Profile
      </ProfileTitle>
      
      {/* Plant Information */}
      <ComponentWrapper>
        <PlantInfo />
      </ComponentWrapper>
      
      {/* Plant Management - Edit/Delete options */}
      <ComponentWrapper>
        <PlantManagement onEditPlant={() => setIsEditing(true)} />
      </ComponentWrapper>

      {/* Care History with improved no-data handling */}
      <ComponentWrapper>
        <CareHistory />
      </ComponentWrapper>
      
      {/* Photo Gallery with Firebase Storage */}
      <ComponentWrapper>
        <PhotoGallery />
      </ComponentWrapper>
    </ProfileContainer>
  );
};

export default ProfilePage;