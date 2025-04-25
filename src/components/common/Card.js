// src/components/common/Card.js
import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme, padding }) => padding || theme.spacing.lg};
  box-shadow: ${({ theme, elevation }) => 
    elevation === 'high' ? theme.shadows.lg : 
    elevation === 'medium' ? theme.shadows.md : 
    theme.shadows.sm
  };
  margin-bottom: ${({ theme, marginBottom }) => marginBottom || theme.spacing.md};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  transition: all ${({ theme }) => theme.transitions.medium};
  
  ${({ clickable, theme }) => clickable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.md};
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme, divider }) => divider ? theme.spacing.sm : 0};
  border-bottom: ${({ theme, divider }) => divider ? `1px solid ${theme.colors.background}` : 'none'};
`;

const CardTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const CardAction = styled.div`
  display: flex;
  align-items: center;
`;

const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: ${({ align }) => align || 'flex-start'};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme, divider }) => divider ? theme.spacing.sm : 0};
  border-top: ${({ theme, divider }) => divider ? `1px solid ${theme.colors.background}` : 'none'};
`;

const Card = ({ 
  children, 
  title,
  action,
  footer,
  elevation = 'low',
  padding,
  marginBottom,
  fullWidth = false,
  clickable = false,
  headerDivider = false,
  footerDivider = false,
  footerAlign = 'flex-start',
  onClick,
  ...props 
}) => {
  return (
    <CardContainer 
      elevation={elevation}
      padding={padding}
      marginBottom={marginBottom}
      fullWidth={fullWidth}
      clickable={clickable}
      onClick={onClick}
      {...props}
    >
      {(title || action) && (
        <CardHeader divider={headerDivider}>
          {title && <CardTitle>{title}</CardTitle>}
          {action && <CardAction>{action}</CardAction>}
        </CardHeader>
      )}
      
      <CardContent>
        {children}
      </CardContent>
      
      {footer && (
        <CardFooter divider={footerDivider} align={footerAlign}>
          {footer}
        </CardFooter>
      )}
    </CardContainer>
  );
};

export default Card;