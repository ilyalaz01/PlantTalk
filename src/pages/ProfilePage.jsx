// src/pages/ProfilePage.js
import React from 'react';
import styled from 'styled-components';
import PlantInfo from '../components/profile/PlantInfo';
import CareHistory from '../components/profile/CareHistory';
import PhotoGallery from '../components/profile/PhotoGallery';
import { usePlant } from '../contexts/PlantContext';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ProfileTitle = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.status.danger};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const ProfilePage = () => {
  const { plant, loading, error } = usePlant();
  
  if (loading) {
    return (
      <ProfileContainer>
        <LoadingIndicator>
          🌱 Loading plant profile...
        </LoadingIndicator>
      </ProfileContainer>
    );
  }
  
  if (error) {
    return (
      <ProfileContainer>
        <ErrorMessage>
          Sorry, we couldn't load your plant's profile. Please try again later.
        </ErrorMessage>
      </ProfileContainer>
    );
  }
  
  return (
    <ProfileContainer>
      <ProfileTitle>{plant.name}'s Profile</ProfileTitle>
      
      <PlantInfo />
      <CareHistory />
      <PhotoGallery />
    </ProfileContainer>
  );
};

export default ProfilePage;