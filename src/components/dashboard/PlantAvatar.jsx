// src/components/dashboard/PlantAvatar.js
import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { usePlant } from '../../contexts/PlantContext';
import { useSensor } from '../../contexts/SensorContext';

// Keyframe animations for plant movements
const gentleSway = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
`;

const droopAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(10deg) translateY(10px); }
`;

const shakeAnimation = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  10% { transform: translate(-2px, -2px) rotate(-2deg); }
  20% { transform: translate(2px, -2px) rotate(2deg); }
  30% { transform: translate(-2px, 2px) rotate(-1deg); }
  40% { transform: translate(2px, 2px) rotate(1deg); }
  50% { transform: translate(-2px, -2px) rotate(-1deg); }
  60% { transform: translate(2px, -2px) rotate(1deg); }
  70% { transform: translate(-2px, 2px) rotate(-2deg); }
  80% { transform: translate(2px, 2px) rotate(2deg); }
  90% { transform: translate(-2px, -2px) rotate(-1deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 300px;
  height: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

const Pot = styled.div`
  width: 150px;
  height: 120px;
  background: linear-gradient(to bottom, #c87137, #a0522d);
  border-radius: 15px 15px 75px 75px;
  position: relative;
  z-index: 1;
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    height: 30px;
    background: #8B4513;
    border-radius: 15px 15px 0 0;
    z-index: 2;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 20px;
    background: #A0522D;
    border-radius: 50%;
    z-index: 3;
  }
`;

const Soil = styled.div`
  position: absolute;
  top: 20px;
  left: 15px;
  right: 15px;
  height: 30px;
  background-color: ${({ moisture, theme }) => {
    if (moisture < 30) return theme.colors.soil.dry;
    if (moisture < 60) return theme.colors.soil.moist;
    return theme.colors.soil.wet;
  }};
  border-radius: 50%;
  z-index: 2;
`;

const Plant = styled.div`
  position: relative;
  z-index: 5;
  transform-origin: bottom center;
  
  ${({ status }) => {
    switch (status) {
      case 'thirsty':
        return css`animation: ${droopAnimation} 2s ease-in-out infinite alternate;`;
      case 'cold':
        return css`animation: ${shakeAnimation} 5s ease-in-out infinite;`;
      case 'hot':
        return css`animation: ${droopAnimation} 3s ease-in-out infinite alternate;`;
      default: // healthy
        return css`animation: ${gentleSway} 8s ease-in-out infinite;`;
    }
  }}
`;

const Stem = styled.div`
  width: 10px;
  height: 150px;
  background: linear-gradient(to top, #2E7D32, #4CAF50);
  position: relative;
  margin: 0 auto;
  border-radius: 5px;
  z-index: 1;
`;

const Leaf = styled.div`
  position: absolute;
  width: 60px;
  height: 30px;
  background-color: ${({ health, theme }) => {
    switch (health) {
      case 'thirsty':
        return '#AED581';
      case 'cold':
        return '#78909C';
      case 'hot':
        return '#FFD54F';
      default: // healthy
        return theme.colors.primary;
    }
  }};
  border-radius: 50% 50% 50% 0;
  transform: rotate(${({ rotation }) => rotation}deg);
  transform-origin: 0 50%;
  left: ${({ left }) => left}px;
  top: ${({ top }) => top}px;
  z-index: ${({ zIndex }) => zIndex || 1};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, rgba(255,255,255,0.1), rgba(255,255,255,0));
    border-radius: 50% 50% 50% 0;
  }
`;

const Eyes = styled.div`
  position: absolute;
  top: ${({ status }) => status === 'thirsty' ? '50px' : '30px'};
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 20px;
  z-index: 10;
`;

const Eye = styled.div`
  width: 12px;
  height: ${({ status }) => status === 'thirsty' ? '5px' : '12px'};
  background-color: #263238;
  border-radius: ${({ status }) => status === 'thirsty' ? '50% 50% 0 0' : '50%'};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    right: 2px;
    width: 4px;
    height: 4px;
    background-color: white;
    border-radius: 50%;
    opacity: ${({ status }) => status === 'thirsty' ? 0 : 1};
  }
`;

const Mouth = styled.div`
  position: absolute;
  top: 55px;
  left: 50%;
  transform: translateX(-50%);
  width: ${({ status }) => {
    switch (status) {
      case 'thirsty': return '15px';
      case 'hot': return '25px';
      default: return '20px';
    }
  }};
  height: ${({ status }) => {
    switch (status) {
      case 'thirsty': return '15px';
      case 'hot': return '10px';
      default: return '5px';
    }
  }};
  border: 2px solid #263238;
  border-radius: ${({ status }) => {
    switch (status) {
      case 'thirsty': return '50%';
      case 'hot': return '50% 50% 50% 50% / 0 0 100% 100%';
      default: return '0 0 50% 50%';
    }
  }};
  border-top: ${({ status }) => status === 'thirsty' || status === 'hot' ? 'none' : '2px solid #263238'};
  background-color: ${({ status }) => status === 'hot' ? '#F44336' : 'transparent'};
  z-index: 10;
`;

const WaterDroplet = styled.div`
  position: absolute;
  top: 70px;
  left: 10px;
  width: 10px;
  height: 15px;
  background-color: #2196F3;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.3s ease;
  z-index: 10;
  
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 3px;
    height: 3px;
    background-color: white;
    border-radius: 50%;
  }
`;

const PlantAvatar = () => {
  const { plant } = usePlant();
  const { sensorData } = useSensor();
  const [showDroplet, setShowDroplet] = useState(false);
  
  // Toggle water droplet visibility periodically for thirsty plants
  useEffect(() => {
    if (plant.status === 'thirsty') {
      const timer = setInterval(() => {
        setShowDroplet(prev => !prev);
      }, 1500);
      
      return () => clearInterval(timer);
    } else {
      setShowDroplet(false);
    }
  }, [plant.status]);
  
  // Generate random leaf positions for visual interest
  const generateLeaves = (count, status) => {
    const leaves = [];
    for (let i = 0; i < count; i++) {
      const isLeft = i % 2 === 0;
      leaves.push({
        rotation: isLeft ? -(45 + Math.random() * 45) : (45 + Math.random() * 45),
        left: isLeft ? -55 : 5,
        top: 20 + i * 25 + Math.random() * 10,
        zIndex: isLeft ? 0 : 2
      });
    }
    return leaves;
  };
  
  const leaves = generateLeaves(5, plant.status);
  
  return (
    <AvatarContainer>
      <Plant status={plant.status}>
        <Eyes status={plant.status}>
          <Eye status={plant.status} />
          <Eye status={plant.status} />
        </Eyes>
        <Mouth status={plant.status} />
        <WaterDroplet visible={showDroplet} />
        
        <Stem>
          {leaves.map((leaf, index) => (
            <Leaf 
              key={index}
              rotation={leaf.rotation}
              left={leaf.left}
              top={leaf.top}
              zIndex={leaf.zIndex}
              health={plant.status}
            />
          ))}
        </Stem>
      </Plant>
      
      <Pot>
        <Soil moisture={sensorData.soilMoisture} />
      </Pot>
    </AvatarContainer>
  );
};

export default PlantAvatar;