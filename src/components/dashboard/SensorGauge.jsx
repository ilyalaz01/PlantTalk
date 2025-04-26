// src/components/dashboard/SensorGauge.js
import React from 'react';
import styled from 'styled-components';

const GaugeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  width: 100%;
  max-width: 200px;
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const GaugeTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

const GaugeIconWrapper = styled.div`
  font-size: 32px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const GaugeVisual = styled.div`
  width: 100%;
  height: 16px;
  background-color: #e0e0e0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const GaugeFill = styled.div`
  height: 100%;
  width: ${({ value }) => `${value}%`};
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'low':
        return theme.colors.status.danger;
      case 'optimal':
        return theme.colors.status.healthy;
      case 'high':
        return theme.colors.status.warning;
      default:
        return theme.colors.status.info;
    }
  }};
  transition: width 0.5s ease-out;
`;

const GaugeValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'low':
        return theme.colors.status.danger;
      case 'optimal':
        return theme.colors.status.healthy;
      case 'high':
        return theme.colors.status.warning;
      default:
        return theme.colors.status.info;
    }
  }};
`;

const GaugeUnit = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const GaugeStatus = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const getStatusMessage = (type, value) => {
  switch (type) {
    case 'moisture':
      if (value < 30) return 'Too Dry';
      if (value > 70) return 'Too Wet';
      return 'Perfect';
      
    case 'temperature':
      if (value < 18) return 'Too Cold';
      if (value > 24) return 'Too Hot';
      return 'Perfect';
      
    case 'humidity':
      if (value < 40) return 'Too Dry';
      if (value > 70) return 'Too Humid';
      return 'Perfect';
      
    case 'light':
      if (value < 30) return 'Too Dark';
      if (value > 80) return 'Too Bright';
      return 'Perfect';
      
    default:
      return '';
  }
};

const getIcon = (type) => {
  switch (type) {
    case 'moisture':
      return '💧';
    case 'temperature':
      return '🌡️';
    case 'humidity':
      return '💦';
    case 'light':
      return '☀️';
    default:
      return '📊';
  }
};

const getStatus = (type, value) => {
  switch (type) {
    case 'moisture':
      if (value < 30) return 'low';
      if (value > 70) return 'high';
      return 'optimal';
      
    case 'temperature':
      if (value < 18) return 'low';
      if (value > 24) return 'high';
      return 'optimal';
      
    case 'humidity':
      if (value < 40) return 'low';
      if (value > 70) return 'high';
      return 'optimal';
      
    case 'light':
      if (value < 30) return 'low';
      if (value > 80) return 'high';
      return 'optimal';
      
    default:
      return 'optimal';
  }
};

const normalizeValue = (type, value) => {
  if (type === 'temperature') {
    // Clamp value between 0°C and 40°C, then scale to 0-100%
    const clamped = Math.min(Math.max(value, 0), 40);
    return (clamped / 40) * 100;
  }
  return value; // For other types, leave it as is
};

const getUnit = (type) => {
  switch (type) {
    case 'moisture':
    case 'humidity':
    case 'light':
      return '%';
    case 'temperature':
      return '°C';
    default:
      return '';
  }
};

const SensorGauge = ({ type, value, title }) => {
  const status = getStatus(type, value);
  const statusMessage = getStatusMessage(type, value);
  const icon = getIcon(type);
  const unit = getUnit(type);
  const normalizedValue = normalizeValue(type, value);

  
  return (
    <GaugeContainer>
      <GaugeTitle>{title}</GaugeTitle>
      <GaugeIconWrapper>{icon}</GaugeIconWrapper>
      <GaugeVisual>
        <GaugeFill value={normalizedValue} status={status} />
      </GaugeVisual>
      <GaugeValue status={status}>
        {value}
        <GaugeUnit>{unit}</GaugeUnit>
      </GaugeValue>
      <GaugeStatus>{statusMessage}</GaugeStatus>
    </GaugeContainer>
  );
};

export default SensorGauge;