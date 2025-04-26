// src/components/profile/PlantInfo.js
import React from 'react';
import styled from 'styled-components';
import { usePlant } from '../../contexts/PlantContext';

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
    default:
      return { text: 'Healthy', icon: '✅' };
  }
};

const PlantInfo = () => {
  const { plant } = usePlant();
  const statusDetails = getStatusDetails(plant.status);
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <InfoContainer>
      <InfoHeader>
        <ProfileImage>🌿</ProfileImage>
        <NameSection>
          <PlantName>{plant.name}</PlantName>
          <PlantSpecies>{plant.species}</PlantSpecies>
        </NameSection>
        <StatusBadge status={plant.status}>
          <StatusIcon>{statusDetails.icon}</StatusIcon>
          {statusDetails.text}
        </StatusBadge>
      </InfoHeader>
      
      <DetailsList>
        <DetailItem>
          <DetailLabel>Age</DetailLabel>
          <DetailValue>{plant.age}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Last Watered</DetailLabel>
          <DetailValue>{formatDate(plant.lastWatered)}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Care Streak</DetailLabel>
          <DetailValue>{plant.streak} days</DetailValue>
        </DetailItem>
      </DetailsList>
      
      <CareInfoList>
        <CareInfoTitle>Care Requirements</CareInfoTitle>
        <CareInfoItem>
          <CareInfoIcon>💧</CareInfoIcon>
          <CareInfoText>Water {plant.careSchedule.watering}</CareInfoText>
        </CareInfoItem>
        <CareInfoItem>
          <CareInfoIcon>☀️</CareInfoIcon>
          <CareInfoText>Needs {plant.careSchedule.sunlight}</CareInfoText>
        </CareInfoItem>
        <CareInfoItem>
          <CareInfoIcon>🌡️</CareInfoIcon>
          <CareInfoText>Optimal temperature: {plant.careSchedule.optimalTemperature}</CareInfoText>
        </CareInfoItem>
        <CareInfoItem>
          <CareInfoIcon>💦</CareInfoIcon>
          <CareInfoText>Optimal humidity: {plant.careSchedule.optimalHumidity}</CareInfoText>
        </CareInfoItem>
      </CareInfoList>
    </InfoContainer>
  );
};

export default PlantInfo;