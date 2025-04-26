import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Your main App component

// == IMPORT YOUR GLOBAL STYLES HERE ==
// Make sure the path is correct based on your file structure
// It's likely:
import './styles/GlobalStyles.jsx';
// If you have other base CSS like index.css, import it too:
// import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// reportWebVitals is typically removed when migrating from CRA