// src/components/common/Navigation.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const NavContainer = styled.nav`
  display: flex;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.surface};
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    padding: ${({ theme }) => theme.spacing.sm} 0;
    z-index: 100;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: space-around;
  }
`;

const NavItem = styled.li`
  margin: 0 ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0;
    flex: 1;
    text-align: center;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.text.secondary};
  font-weight: ${({ active, theme }) => 
    active ? theme.typography.fontWeight.semiBold : theme.typography.fontWeight.regular};
  text-decoration: none;
  border-bottom: 3px solid ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.medium};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    border-bottom: none;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
  
  &:hover, &:focus {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Icon = styled.div`
  font-size: 24px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavText = styled.span`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const Navigation = () => {
  const location = useLocation();
  
  // Navigation items with icons and paths
  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/profile', label: 'Profile', icon: '🌱' },
    { path: '/simulator', label: 'Simulator', icon: '🔬' },
    { path: '/insights', label: 'Insights', icon: '📊' },
  ];
  
  return (
    <NavContainer>
      <NavList>
        {navItems.map((item) => (
          <NavItem key={item.path}>
            <NavLink 
              to={item.path} 
              active={location.pathname === item.path ? 1 : 0}
            >
              <Icon>{item.icon}</Icon>
              <NavText>{item.label}</NavText>
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </NavContainer>
  );
};

export default Navigation;