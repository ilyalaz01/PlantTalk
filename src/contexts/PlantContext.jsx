// src/contexts/PlantContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPlantData } from '../services/api';

const PlantContext = createContext();

export const usePlant = () => {
  const context = useContext(PlantContext);
  if (!context) {
    throw new Error('usePlant must be used within a PlantProvider');
  }
  return context;
};

export const PlantProvider = ({ children }) => {
  const [plant, setPlant] = useState({
    id: 1,
    name: 'Fern Friend',
    species: 'Boston Fern',
    age: '3 months',
    status: 'healthy', // healthy, thirsty, cold, hot, etc.
    lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    careSchedule: {
      watering: 'every 3 days',
      sunlight: 'indirect light',
      optimalTemperature: '65-75°F',
      optimalHumidity: '50-60%',
    },
    streak: 7, // Days in a row with proper care
    photos: [
      {
        id: 1,
        url: '/assets/images/plant-week1.jpg',
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        note: 'First day home!',
      },
      {
        id: 2,
        url: '/assets/images/plant-week2.jpg',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        note: 'Growing nicely',
      },
      {
        id: 3,
        url: '/assets/images/plant-week3.jpg',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        note: 'New leaves!',
      },
    ],
    careHistory: [
      { action: 'watered', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
      { action: 'misted', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      { action: 'watered', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { action: 'fertilized', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch plant data from API
  const refreshPlantData = async () => {
    try {
      setLoading(true);
      // In a real application, this would fetch from an API
      // const data = await fetchPlantData(plant.id);
      // setPlant(data);
      
      // For now, just simulate a delay
      setTimeout(() => {
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('Could not fetch plant data');
      setLoading(false);
    }
  };

  // Function to update plant status based on sensor data
  const updatePlantStatus = (sensorData) => {
    let newStatus = 'healthy';
    
    if (sensorData.soilMoisture < 30) {
      newStatus = 'thirsty';
    } else if (sensorData.temperature < 60) {
      newStatus = 'cold';
    } else if (sensorData.temperature > 80) {
      newStatus = 'hot';
    } else if (sensorData.humidity < 40) {
      newStatus = 'dry';
    }
    
    setPlant(prev => ({
      ...prev,
      status: newStatus
    }));
  };

  // Function to record plant care actions
  const recordCareAction = (action) => {
    const now = new Date();
    
    setPlant(prev => ({
      ...prev,
      lastWatered: action === 'watered' ? now : prev.lastWatered,
      streak: prev.streak + 1,
      careHistory: [
        { action, date: now },
        ...prev.careHistory
      ]
    }));
  };

  // Function to add a new plant photo
  const addPlantPhoto = (photoUrl, note = '') => {
    const newPhoto = {
      id: plant.photos.length + 1,
      url: photoUrl,
      date: new Date(),
      note,
    };
    
    setPlant(prev => ({
      ...prev,
      photos: [newPhoto, ...prev.photos]
    }));
  };

  useEffect(() => {
    refreshPlantData();
    
    // Set up a refresh interval - in a real app, this might
    // poll for updated sensor data
    const interval = setInterval(() => {
      refreshPlantData();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    plant,
    loading,
    error,
    updatePlantStatus,
    recordCareAction,
    addPlantPhoto,
    refreshPlantData,
  };

  return <PlantContext.Provider value={value}>{children}</PlantContext.Provider>;
};