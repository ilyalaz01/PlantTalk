// src/components/common/Button.js
import React from 'react';
import styled, { css } from 'styled-components';

const ButtonWrapper = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme, size }) => 
    size === 'large' ? `${theme.spacing.md} ${theme.spacing.xl}` :
    size === 'small' ? `${theme.spacing.xs} ${theme.spacing.md}` :
    `${theme.spacing.sm} ${theme.spacing.lg}`
  };
  font-size: ${({ theme, size }) => 
    size === 'large' ? theme.typography.fontSize.md :
    size === 'small' ? theme.typography.fontSize.xs :
    theme.typography.fontSize.sm
  };
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.medium};
  cursor: pointer;
  text-align: center;
  border: none;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.text.inverse};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.accent};
            box-shadow: ${theme.shadows.md};
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.text.inverse};
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          box-shadow: none;
          
          &:hover:not(:disabled) {
            background-color: rgba(76, 175, 80, 0.1);
          }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.inverse};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.accent};
            box-shadow: ${theme.shadows.md};
          }
        `;
    }
  }}
`;

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false, 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <ButtonWrapper
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </ButtonWrapper>
  );
};

export default Button;