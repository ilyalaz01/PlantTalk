// src/styles/theme.js
const theme = {
    colors: {
      primary: '#4CAF50', // Main green
      secondary: '#81C784', // Lighter green
      accent: '#388E3C', // Darker green
      background: '#F5F7F5', // Off-white with slight green tint
      surface: '#FFFFFF', // White
      text: {
        primary: '#263238', // Dark gray for main text
        secondary: '#546E7A', // Medium gray for secondary text
        inverse: '#FFFFFF', // White text for dark backgrounds
        accent: '#388E3C', // Accent text color
      },
      status: {
        healthy: '#4CAF50', // Green
        warning: '#FFC107', // Amber
        danger: '#F44336', // Red
        info: '#2196F3', // Blue
      },
      soil: {
        dry: '#D7CCC8', // Light brown
        moist: '#8D6E63', // Medium brown
        wet: '#5D4037', // Dark brown
      }
    },
    typography: {
      fontFamily: "'Poppins', 'Helvetica Neue', sans-serif",
      fontSize: {
        xs: '16px', // Base size - larger than normal to accommodate older users
        sm: '18px',
        md: '22px',
        lg: '28px',
        xl: '36px',
        xxl: '48px',
      },
      fontWeight: {
        regular: 400,
        medium: 500,
        semiBold: 600,
        bold: 700,
      },
      lineHeight: {
        xs: 1.4,
        sm: 1.5,
        md: 1.6,
        lg: 1.7,
        xl: 1.8,
      },
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
      xxxl: '64px',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
      circle: '50%',
    },
    shadows: {
      sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      md: '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
      lg: '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
      xl: '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
    },
    transitions: {
      short: '0.2s ease',
      medium: '0.3s ease',
      long: '0.5s ease',
    },
    breakpoints: {
      xs: '320px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
  };
  
  export default theme;