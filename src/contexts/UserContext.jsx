// src/contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile, updateUserPreferences } from '../services/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Yelena',
    email: 'yelena@example.com',
    joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    preferences: {
      notifications: true,
      reminderTime: '09:00',
      theme: 'light',
      units: 'imperial', // imperial or metric
      language: 'en',
    },
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      coordinates: {
        latitude: 47.6062,
        longitude: -122.3321,
      },
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // In a real application, this would fetch from an API
      // const data = await getUserProfile();
      // setUser(data);
      
      // For demo purposes, just simulate a delay
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Could not fetch user profile');
      setLoading(false);
    }
  };

  // Update user preferences
  const updatePreferences = async (newPreferences) => {
    try {
      setLoading(true);
      
      // In a real application, this would update via API
      // await updateUserPreferences(newPreferences);
      
      // Update local state
      setUser(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          ...newPreferences
        }
      }));
      
      setLoading(false);
      return true;
    } catch (err) {
      setError('Could not update preferences');
      setLoading(false);
      return false;
    }
  };

  // Update user location
  const updateLocation = async (newLocation) => {
    try {
      setLoading(true);
      
      // In a real application, this would update via API
      // await updateUserLocation(newLocation);
      
      // Update local state
      setUser(prev => ({
        ...prev,
        location: {
          ...prev.location,
          ...newLocation
        }
      }));
      
      setLoading(false);
      return true;
    } catch (err) {
      setError('Could not update location');
      setLoading(false);
      return false;
    }
  };

  // Get user's first name
  const getFirstName = () => {
    return user.name.split(' ')[0];
  };

  // Check if user has completed onboarding
  const hasCompletedOnboarding = () => {
    // For simplicity, we'll say they have if they have a saved plant
    return true;
  };

  // Get user's preferred temperature unit
  const getTemperatureUnit = () => {
    return user.preferences.units === 'imperial' ? '°F' : '°C';
  };

  // Get user's readable join date
  const getJoinDate = () => {
    return user.joinDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Initialize user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Value object to be provided to consumers
  const value = {
    user,
    loading,
    error,
    updatePreferences,
    updateLocation,
    getFirstName,
    hasCompletedOnboarding,
    getTemperatureUnit,
    getJoinDate,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;