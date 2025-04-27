// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { PlantProvider } from './contexts/PlantContext';
import { SensorProvider } from './contexts/SensorContext';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';
import Header from './components/common/Header';
import Dashboard from './pages/Dashboard';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SimulatorPage from './pages/SimulatorPage';
import ModelInsights from './pages/ModelInsight';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <PlantProvider>
        <SensorProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
              <Route path="/insights" element={<ModelInsights />} />
            </Routes>
          </Router>
        </SensorProvider>
      </PlantProvider>
    </ThemeProvider>
  );
};

export default App;