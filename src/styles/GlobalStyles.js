// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html {
    font-size: 100%;
    -webkit-text-size-adjust: 100%;
  }
  
  body {
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.xs};
    line-height: ${theme.typography.lineHeight.md};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background};
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeight.semiBold};
    line-height: ${theme.typography.lineHeight.sm};
    color: ${theme.colors.text.primary};
  }
  
  h1 {
    font-size: ${theme.typography.fontSize.xxl};
  }
  
  h2 {
    font-size: ${theme.typography.fontSize.xl};
  }
  
  h3 {
    font-size: ${theme.typography.fontSize.lg};
  }
  
  h4 {
    font-size: ${theme.typography.fontSize.md};
  }
  
  p {
    margin-bottom: ${theme.spacing.md};
    font-size: ${theme.typography.fontSize.sm};
    line-height: ${theme.typography.lineHeight.md};
  }
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color ${theme.transitions.short};
    
    &:hover {
      color: ${theme.colors.accent};
    }
  }
  
  button {
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.sm};
    cursor: pointer;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  
  // Accessibility improvements
  :focus {
    outline: 3px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
  
  // Improved scrollbar for older users
  ::-webkit-scrollbar {
    width: 12px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${theme.colors.background};
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.secondary};
    border-radius: 10px;
    border: 3px solid ${theme.colors.background};
  }
`;

export default GlobalStyles;