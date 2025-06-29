// src/components/common/Header.jsx - Responsive Navigation
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  z-index: 1002;

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const LogoIcon = styled.span`
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Navigation = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.surface || '#ffffff'};
    flex-direction: column;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.xl};
    transform: translateX(${({ isOpen }) => isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease-in-out;
    z-index: 1002;
    padding: ${({ theme }) => theme.spacing.xl};
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    pointer-events: ${({ isOpen }) => isOpen ? 'auto' : 'none'};
  }
`;

const NavLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme, active }) => 
    active ? theme.colors.primary : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}10;
  }

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    text-align: center;
    width: 100%;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin: ${({ theme }) => theme.spacing.sm} 0;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    
    &:active {
      transform: scale(0.98);
      background: ${({ theme }) => theme.colors.primary}20;
    }
  }
`;

const MobileCloseButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.text.primary};
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.circle};
    transition: all 0.2s ease;
    pointer-events: auto;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary}10;
      transform: rotate(90deg);
    }

    &:active {
      transform: rotate(90deg) scale(0.95);
      background: ${({ theme }) => theme.colors.primary}20;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  z-index: 1003;
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  z-index: 1002;

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.inverse};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 480px) {
    display: none;
  }
`;

const UserName = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.md};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const UserStreak = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.colors.surface || '#ffffff'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg || '0 10px 25px rgba(0, 0, 0, 0.15)'};
  min-width: 200px;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  z-index: 1003;
  margin-top: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 20px;
    left: 20px;
    right: 20px;
    min-width: auto;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    z-index: 1004;
  }
`;

const DropdownItem = styled.button`
  background: none;
  border: none;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  text-align: left;
  color: ${({ theme, danger }) => 
    danger ? theme.colors.status.danger : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background: ${({ theme, danger }) => 
      danger ? theme.colors.status.danger + '10' : theme.colors.background};
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    text-align: center;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(0,0,0,0.1);
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

const UserDropdown = styled.div`
  position: relative;
`;

const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    z-index: 1001;
    backdrop-filter: blur(2px);
  }
`;

const Header = () => {
  const { user, plant, signOut, getFirstName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowDropdown(false);
    navigate('/login');
  };

  const handleUserClick = () => {
    setShowDropdown(!showDropdown);
  };

  const getUserInitials = () => {
    const firstName = getFirstName();
    return firstName.charAt(0).toUpperCase();
  };

  const navigationItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/chat', label: 'Chat' },
    { path: '/profile', label: 'Profile' },
    { path: '/simulator', label: 'Simulator' },
    { path: '/insights', label: 'Insights' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
    console.log('Navigating to:', path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && 
          !event.target.closest('[data-mobile-nav]') && 
          !event.target.closest('[data-mobile-menu-button]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('[data-user-dropdown]')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Logo onClick={() => handleNavigation('/')}>
            <LogoIcon>🌱</LogoIcon>
            PlantTalk
          </Logo>

          <Navigation isOpen={isMobileMenuOpen} data-mobile-nav>
            <MobileCloseButton onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(false);
            }}>
              ✕
            </MobileCloseButton>
            {navigationItems.map(item => (
              <NavLink
                key={item.path}
                active={location.pathname === item.path}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation(item.path);
                }}
              >
                {item.label}
              </NavLink>
            ))}
          </Navigation>

          <UserSection>
            <MobileMenuButton 
              onClick={toggleMobileMenu}
              data-mobile-menu-button
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </MobileMenuButton>

            <UserDropdown data-user-dropdown>
              <UserInfo onClick={handleUserClick}>
                <UserAvatar>
                  {getUserInitials()}
                </UserAvatar>
                <UserDetails>
                  <UserName>{getFirstName()}</UserName>
                  <UserStreak>
                    🔥 {user?.streakCount || 0} day streak
                  </UserStreak>
                </UserDetails>
              </UserInfo>

              {showDropdown && (
                <DropdownMenu>
                  <DropdownItem onClick={() => {
                    handleNavigation('/profile');
                    setShowDropdown(false);
                  }}>
                    👤 My Profile
                  </DropdownItem>
                  
                  <DropdownItem onClick={() => {
                    setShowDropdown(false);
                    // Handle settings
                  }}>
                    ⚙️ Settings
                  </DropdownItem>
                  
                  <DropdownItem onClick={() => {
                    setShowDropdown(false);
                    // Handle help
                  }}>
                    ❓ Help & Support
                  </DropdownItem>
                  
                  <DropdownDivider />
                  
                  <DropdownItem danger onClick={handleSignOut}>
                    🚪 Sign Out
                  </DropdownItem>
                </DropdownMenu>
              )}
            </UserDropdown>
          </UserSection>
        </HeaderContent>
      </HeaderContainer>

      <Overlay 
        isOpen={isMobileMenuOpen} 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsMobileMenuOpen(false);
          }
        }} 
      />
    </>
  );
};

export default Header;