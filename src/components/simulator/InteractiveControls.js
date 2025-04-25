// src/components/simulator/InteractiveControls.js
import React from 'react';
import styled from 'styled-components';

const ControlsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ControlsTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ControlsDescription = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.md};
`;

const SliderContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SliderLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SliderValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme, status }) => {
    switch (status) {
      case 'low':
        return theme.colors.status.danger;
      case 'optimal':
        return theme.colors.status.healthy;
      case 'high':
        return theme.colors.status.warning;
      default:
        return theme.colors.text.primary;
    }
  }};
`;

const SliderInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ value, theme }) => {
    const percentage = ((value - 0) * 100) / (100 - 0);
    return `linear-gradient(to right, 
      ${theme.colors.primary} 0%, 
      ${theme.colors.primary} ${percentage}%, 
      #e0e0e0 ${percentage}%, 
      #e0e0e0 100%)`;
  }};
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  
  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ active, theme, color }) => 
    active ? (color || theme.colors.primary) : theme.colors.text.secondary};
  font-weight: ${({ active, theme }) => 
    active ? theme.typography.fontWeight.medium : theme.typography.fontWeight.regular};
`;

const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ active, theme, color }) => 
    active ? (color || theme.colors.primary) : '#e0e0e0'};
`;

const getStatus = (type, value) => {
  switch (type) {
    case 'moisture':
      if (value < 30) return 'low';
      if (value > 70) return 'high';
      return 'optimal';
      
    case 'temperature':
      if (value < 65) return 'low';
      if (value > 75) return 'high';
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

const getUnit = (type) => {
  switch (type) {
    case 'moisture':
    case 'humidity':
    case 'light':
      return '%';
    case 'temperature':
      return '°F';
    default:
      return '';
  }
};

const getStatusColors = (theme) => ({
  low: theme.colors.status.danger,
  optimal: theme.colors.status.healthy,
  high: theme.colors.status.warning
});

const InteractiveControls = ({ values, onChange }) => {
  const handleSliderChange = (type, value) => {
    onChange(type, parseInt(value, 10));
  };
  
  const statusColors = getStatusColors(useTheme());
  
  return (
    <ControlsContainer>
      <ControlsTitle>Interactive Plant Simulator</ControlsTitle>
      <ControlsDescription>
        Adjust the sliders to see how different environmental conditions affect your plant's health and behavior.
      </ControlsDescription>
      
      <SliderContainer>
        <SliderHeader>
          <SliderLabel htmlFor="moisture-slider">Soil Moisture</SliderLabel>
          <SliderValue status={getStatus('moisture', values.moisture)}>
            {values.moisture}{getUnit('moisture')}
          </SliderValue>
        </SliderHeader>
        <SliderInput
          id="moisture-slider"
          type="range"
          min="0"
          max="100"
          value={values.moisture}
          onChange={(e) => handleSliderChange('moisture', e.target.value)}
        />
        <StatusIndicator>
          <StatusItem 
            active={getStatus('moisture', values.moisture) === 'low'}
            color={statusColors.low}
          >
            <StatusDot 
              active={getStatus('moisture', values.moisture) === 'low'}
              color={statusColors.low}
            />
            Dry
          </StatusItem>
          <StatusItem 
            active={getStatus('moisture', values.moisture) === 'optimal'}
            color={statusColors.optimal}
          >
            <StatusDot 
              active={getStatus('moisture', values.moisture) === 'optimal'}
              color={statusColors.optimal}
            />
            Optimal
          </StatusItem>
          <StatusItem 
            active={getStatus('moisture', values.moisture) === 'high'}
            color={statusColors.high}
          >
            <StatusDot 
              active={getStatus('moisture', values.moisture) === 'high'}
              color={statusColors.high}
            />
            Wet
          </StatusItem>
        </StatusIndicator>
      </SliderContainer>
      
      <SliderContainer>
        <SliderHeader>
          <SliderLabel htmlFor="temperature-slider">Temperature</SliderLabel>
          <SliderValue status={getStatus('temperature', values.temperature)}>
            {values.temperature}{getUnit('temperature')}
          </SliderValue>
        </SliderHeader>
        <SliderInput
          id="temperature-slider"
          type="range"
          min="40"
          max="100"
          value={values.temperature}
          onChange={(e) => handleSliderChange('temperature', e.target.value)}
        />
        <StatusIndicator>
          <StatusItem 
            active={getStatus('temperature', values.temperature) === 'low'}
            color={statusColors.low}
          >
            <StatusDot 
              active={getStatus('temperature', values.temperature) === 'low'}
              color={statusColors.low}
            />
            Cold
          </StatusItem>
          <StatusItem 
            active={getStatus('temperature', values.temperature) === 'optimal'}
            color={statusColors.optimal}
          >
            <StatusDot 
              active={getStatus('temperature', values.temperature) === 'optimal'}
              color={statusColors.optimal}
            />
            Optimal
          </StatusItem>
          <StatusItem 
            active={getStatus('temperature', values.temperature) === 'high'}
            color={statusColors.high}
          >
            <StatusDot 
              active={getStatus('temperature', values.temperature) === 'high'}
              color={statusColors.high}
            />
            Hot
          </StatusItem>
        </StatusIndicator>
      </SliderContainer>
      
      <SliderContainer>
        <SliderHeader>
          <SliderLabel htmlFor="humidity-slider">Humidity</SliderLabel>
          <SliderValue status={getStatus('humidity', values.humidity)}>
            {values.humidity}{getUnit('humidity')}
          </SliderValue>
        </SliderHeader>
        <SliderInput
          id="humidity-slider"
          type="range"
          min="0"
          max="100"
          value={values.humidity}
          onChange={(e) => handleSliderChange('humidity', e.target.value)}
        />
        <StatusIndicator>
          <StatusItem 
            active={getStatus('humidity', values.humidity) === 'low'}
            color={statusColors.low}
          >
            <StatusDot 
              active={getStatus('humidity', values.humidity) === 'low'}
              color={statusColors.low}
            />
            Dry
          </StatusItem>
          <StatusItem 
            active={getStatus('humidity', values.humidity) === 'optimal'}
            color={statusColors.optimal}
          >
            <StatusDot 
              active={getStatus('humidity', values.humidity) === 'optimal'}
              color={statusColors.optimal}
            />
            Optimal
          </StatusItem>
          <StatusItem 
            active={getStatus('humidity', values.humidity) === 'high'}
            color={statusColors.high}
          >
            <StatusDot 
              active={getStatus('humidity', values.humidity) === 'high'}
              color={statusColors.high}
            />
            Humid
          </StatusItem>
        </StatusIndicator>
      </SliderContainer>
      
      <SliderContainer>
        <SliderHeader>
          <SliderLabel htmlFor="light-slider">Light Level</SliderLabel>
          <SliderValue status={getStatus('light', values.light)}>
            {values.light}{getUnit('light')}
          </SliderValue>
        </SliderHeader>
        <SliderInput
          id="light-slider"
          type="range"
          min="0"
          max="100"
          value={values.light}
          onChange={(e) => handleSliderChange('light', e.target.value)}
        />
        <StatusIndicator>
          <StatusItem 
            active={getStatus('light', values.light) === 'low'}
            color={statusColors.low}
          >
            <StatusDot 
              active={getStatus('light', values.light) === 'low'}
              color={statusColors.low}
            />
            Dark
          </StatusItem>
          <StatusItem 
            active={getStatus('light', values.light) === 'optimal'}
            color={statusColors.optimal}
          >
            <StatusDot 
              active={getStatus('light', values.light) === 'optimal'}
              color={statusColors.optimal}
            />
            Optimal
          </StatusItem>
          <StatusItem 
            active={getStatus('light', values.light) === 'high'}
            color={statusColors.high}
          >
            <StatusDot 
              active={getStatus('light', values.light) === 'high'}
              color={statusColors.high}
            />
            Bright
          </StatusItem>
        </StatusIndicator>
      </SliderContainer>
    </ControlsContainer>
  );
};

// Workaround to use theme in a statically defined object
function useTheme() {
  return React.useContext(styled.ThemeContext);
}

export default InteractiveControls;