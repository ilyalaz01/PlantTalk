// src/components/profile/PlantInfo.jsx - Fixed Age Calculation
import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import useEcologicalModel from '../../hooks/useEcologicalModel';
import useSensorData from '../../hooks/useSensorData';

const InfoContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const NameSection = styled.div`
  flex: 1;
`;

const PlantName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PlantSpecies = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatusBadge = styled.div`
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'thirsty':
        return 'rgba(255, 193, 7, 0.2)';
      case 'cold':
        return 'rgba(33, 150, 243, 0.2)';
      case 'hot':
        return 'rgba(244, 67, 54, 0.2)';
      default:
        return 'rgba(76, 175, 80, 0.2)';
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'thirsty':
        return theme.colors.status.warning;
      case 'cold':
        return theme.colors.status.info;
      case 'hot':
        return theme.colors.status.danger;
      default:
        return theme.colors.status.healthy;
    }
  }};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StatusIcon = styled.span`
  font-size: 16px;
`;

const DetailsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const DetailValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CareInfoList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const CareInfoTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CareInfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const CareInfoIcon = styled.span`
  font-size: 24px;
  width: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const CareInfoText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const getStatusDetails = (status) => {
  switch (status) {
    case 'thirsty':
      return { text: 'Needs Water', icon: '💧' };
    case 'cold':
      return { text: 'Too Cold', icon: '❄️' };
    case 'hot':
      return { text: 'Too Hot', icon: '🔥' };
    case 'overwatered':
      return { text: 'Too Wet', icon: '🌊' };
    case 'stressed':
      return { text: 'Stressed', icon: '⚠️' };
    default:
      return { text: 'Healthy', icon: '✅' };
  }
};

const PlantInfo = () => {
  const { plant, user } = useAuth();
  const ecologicalModel = useEcologicalModel(useSensorData());

  const statusDetails = getStatusDetails(ecologicalModel.plantStatus);
  
  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate age consistently (same logic as PlantManagement)
  const calculateAge = () => {
    if (!plant) return 'Unknown';
    
    let startDate;
    
    // If user specified age during creation, use planted date
    if (plant.plantedDate) {
      startDate = plant.plantedDate.toDate ? plant.plantedDate.toDate() : new Date(plant.plantedDate);
    } 
    // If user specified age number/unit, calculate from that
    else if (plant.ageNumber && plant.ageUnit) {
      const now = new Date();
      let daysToSubtract = plant.ageNumber;
      
      switch (plant.ageUnit) {
        case 'weeks':
          daysToSubtract = plant.ageNumber * 7;
          break;
        case 'months':
          daysToSubtract = plant.ageNumber * 30;
          break;
        default: // days
          daysToSubtract = plant.ageNumber;
      }
      
      startDate = new Date(now.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
    }
    // Fallback to creation date
    else if (plant.createdAt) {
      startDate = plant.createdAt.toDate ? plant.createdAt.toDate() : new Date(plant.createdAt);
    } 
    else {
      return 'Unknown';
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month' : `${months} months`;
    }
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year' : `${years} years`;
  };
  
  return (
    <InfoContainer>
      <InfoHeader>
        <ProfileImage>🌿</ProfileImage>
        <NameSection>
          <PlantName>{plant?.name || 'My Basil'}</PlantName>
          <PlantSpecies>{plant?.species || 'Unknown Basil Variety'}</PlantSpecies>
        </NameSection>
        <StatusBadge status={ecologicalModel.plantStatus}>
          <StatusIcon>{statusDetails.icon}</StatusIcon>
          {statusDetails.text}
        </StatusBadge>
      </InfoHeader>
      
      <DetailsList>
        <DetailItem>
          <DetailLabel>Age</DetailLabel>
          <DetailValue>{calculateAge()}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Plant Parent</DetailLabel>
          <DetailValue>{user?.displayName || 'Basil Parent'}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Care Streak</DetailLabel>
          <DetailValue>{user?.streakCount || 0} days</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Location</DetailLabel>
          <DetailValue>{plant?.location || 'Not specified'}</DetailValue>
        </DetailItem>
      </DetailsList>
      
      <CareInfoList>
        <CareInfoTitle>Environment Status</CareInfoTitle>

        <CareInfoItem>
          <CareInfoIcon>💧</CareInfoIcon>
          <CareInfoText>
            Moisture level is <strong>{ecologicalModel.environmentalHealth.moisture}</strong>
          </CareInfoText>
        </CareInfoItem>

        <CareInfoItem>
          <CareInfoIcon>☀️</CareInfoIcon>
          <CareInfoText>
            Light level is <strong>{ecologicalModel.environmentalHealth.light}</strong>
          </CareInfoText>
        </CareInfoItem>

        <CareInfoItem>
          <CareInfoIcon>🌡️</CareInfoIcon>
          <CareInfoText>
            Temperature is <strong>{ecologicalModel.environmentalHealth.temperature}</strong>
          </CareInfoText>
        </CareInfoItem>

        <CareInfoItem>
          <CareInfoIcon>💦</CareInfoIcon>
          <CareInfoText>
            Humidity is <strong>{ecologicalModel.environmentalHealth.humidity}</strong>
          </CareInfoText>
        </CareInfoItem>
      </CareInfoList>
      
      {plant?.notes && (
        <CareInfoList>
          <CareInfoTitle>Notes</CareInfoTitle>
          <CareInfoText>{plant.notes}</CareInfoText>
        </CareInfoList>
      )}
    </InfoContainer>
  );
};

export default PlantInfo;