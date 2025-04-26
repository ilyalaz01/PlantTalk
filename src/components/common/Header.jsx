// src/components/common/Header.js
import React from 'react';
import styled from 'styled-components';
import Navigation from './Navigation';
import { usePlant } from '../../contexts/PlantContext';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const PlantName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Header = () => {
  const { plant } = usePlant();
  
  return (
    <HeaderContainer>
      <Logo>
        <LogoIcon>🌿</LogoIcon>
        <LogoText>PlantTalk</LogoText>
      </Logo>
      
      <PlantName>{plant.name}</PlantName>
      
      <Navigation />
    </HeaderContainer>
  );
};

export default Header;