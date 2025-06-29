// src/App.jsx - WITH ROUTE PROTECTION
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './contexts/AuthContext';
import { PlantProvider } from './contexts/PlantContext';
import { SensorProvider } from './contexts/SensorContext';
import GlobalStyles from './styles/GlobalStyles';
import theme from './styles/theme';

// Import route protection
import { ProtectedRoute, PublicRoute } from './components/auth/ProtectedRoute';

// Import pages
import AuthPage from './pages/AuthPage';
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
      <AuthProvider>
        <PlantProvider>
          <SensorProvider>
            <Router>
              <Routes>
                {/* PUBLIC ROUTE - Login page (redirects if logged in) */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute redirectToDashboard={
                      <>
                        <Header />
                        <Dashboard />
                      </>
                    }>
                      <AuthPage />
                    </PublicRoute>
                  } 
                />

                {/* PROTECTED ROUTES - Require login */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute redirectToLogin={<AuthPage />}>
                      <>
                        <Header />
                        <Dashboard />
                      </>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute redirectToLogin={<AuthPage />}>
                      <>
                        <Header />
                        <ChatPage />
                      </>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute redirectToLogin={<AuthPage />}>
                      <>
                        <Header />
                        <ProfilePage />
                      </>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/simulator" 
                  element={
                    <ProtectedRoute redirectToLogin={<AuthPage />}>
                      <>
                        <Header />
                        <SimulatorPage />
                      </>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/insights" 
                  element={
                    <ProtectedRoute redirectToLogin={<AuthPage />}>
                      <>
                        <Header />
                        <ModelInsights />
                      </>
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Router>
          </SensorProvider>
        </PlantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;