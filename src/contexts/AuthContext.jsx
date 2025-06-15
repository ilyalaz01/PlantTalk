// src/contexts/AuthContext.jsx - COMPLETE VERSION
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged,
  signUpWithEmail,
  signInWithEmail, 
  signInWithGoogle,
  signOutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserPlant,
  createUserPlant,
  getUserPlant,
  createUserProfile,
  calculateUserStreak,
  uploadPlantPhoto,
  deletePlantPhoto, 
  getPlantPhotos, 
  getPhotoCount,
  getGrowthTimeline,
  recordCareAction,
  Timestamp
} from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Keep the same API as the old UserContext for compatibility
export const useUser = () => {
  return useAuth();
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userPlant, setUserPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // ==================== AUTH FUNCTIONS ====================
  
  const signUp = async (email, password, displayName) => {
    setAuthLoading(true);
    setError(null);
    
    try {
      const result = await signUpWithEmail(email, password, displayName);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, user: result.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setAuthLoading(true);
    setError(null);
    
    try {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, user: result.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const signInWithGoogleProvider = async () => {
    setAuthLoading(true);
    setError(null);
    
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      return { success: true, user: result.user };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthLoading(true);
    try {
      await signOutUser();
      setCurrentUser(null);
      setUserProfile(null);
      setUserPlant(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setAuthLoading(false);
    }
  };

  // ==================== USER PROFILE FUNCTIONS ====================

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      let profile = await getUserProfile(userId);
      
      // If no profile exists, create one automatically
      if (!profile) {
        console.log('📝 No user profile found, creating one...');
        
        const profileData = {
          displayName: currentUser?.displayName || 'Basil Parent',
          email: currentUser?.email || '',
          createdAt: Timestamp.now(),
          streakCount: 0,
          bestStreak: 0,
          preferences: {
            notifications: true,
            reminderTime: '09:00',
            theme: 'light',
            units: 'imperial',
            language: 'en',
          }
        };
        
        const result = await createUserProfile(userId, profileData);
        console.log('✅ User profile creation result:', result);
        
        if (result.success) {
          profile = await getUserProfile(userId); // Fetch the newly created profile
        }
      }
      
      if (profile) {
        setUserProfile(profile);
        
        // Also fetch user's plant
        const plant = await getUserPlant(userId);
        if (plant) {
          setUserPlant(plant);
        }
        
        // Calculate current streak
        const streakData = await calculateUserStreak(userId);
        if (streakData.currentStreak !== profile.streakCount) {
          // Update streak in profile
          await updateUserProfile(userId, {
            streakCount: streakData.currentStreak,
            bestStreak: Math.max(profile.bestStreak || 0, streakData.bestStreak)
          });
          
          setUserProfile(prev => ({
            ...prev,
            streakCount: streakData.currentStreak,
            bestStreak: Math.max(prev.bestStreak || 0, streakData.bestStreak)
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Could not fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  // Update user preferences (maintains old API)
  const updatePreferences = async (newPreferences) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    try {
      setLoading(true);
      
      const result = await updateUserProfile(currentUser.uid, {
        preferences: { ...userProfile.preferences, ...newPreferences }
      });
      
      if (result.success) {
        setUserProfile(prev => ({
          ...prev,
          preferences: { ...prev.preferences, ...newPreferences }
        }));
      }
      
      return result;
    } catch (err) {
      setError('Could not update preferences');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update user location (maintains old API)
  const updateLocation = async (newLocation) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    try {
      setLoading(true);
      
      const result = await updateUserProfile(currentUser.uid, {
        location: { ...userProfile.location, ...newLocation }
      });
      
      if (result.success) {
        setUserProfile(prev => ({
          ...prev,
          location: { ...prev.location, ...newLocation }
        }));
      }
      
      return result;
    } catch (err) {
      setError('Could not update location');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ==================== PLANT FUNCTIONS ====================

  const createPlant = async (plantData) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    try {
      setLoading(true);
      const result = await createUserPlant(currentUser.uid, plantData);
      
      if (result.success) {
        // Fetch the created plant
        const plant = await getUserPlant(currentUser.uid);
        setUserPlant(plant);
      }
      
      return result;
    } catch (err) {
      setError('Could not create plant');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const refreshPlantData = async () => {
    if (!currentUser) return;
    
    try {
      const plant = await getUserPlant(currentUser.uid);
      setUserPlant(plant);
    } catch (err) {
      console.error('Error refreshing plant data:', err);
    }
  };

  // Delete user plant
  const deletePlant = async () => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    try {
      setLoading(true);
      const result = await deleteUserPlant(currentUser.uid);
      
      if (result.success) {
        setUserPlant(null); // Clear plant from state
        console.log('✅ Plant deleted successfully from context');
      }
      
      return result;
    } catch (err) {
      setError('Could not delete plant');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ==================== PHOTO FUNCTIONS ====================

  // Upload a plant photo
  const addPlantPhoto = async (file, note = '') => {
    console.log('🎯 AuthContext.addPlantPhoto called');
    console.log('📁 File:', file?.name, file?.size, 'bytes');
    console.log('📝 Note:', note);
    console.log('👤 Current user:', currentUser?.uid);
    
    if (!currentUser) {
      console.error('❌ No current user found');
      return { success: false, error: 'Not authenticated' };
    }
    
    console.log('📸 Calling uploadPlantPhoto function...');
    
    try {
      const result = await uploadPlantPhoto(currentUser.uid, file, note);
      console.log('📤 uploadPlantPhoto result:', result);
      
      if (result.success) {
        console.log('✅ Photo upload successful, refreshing plant data...');
        // Refresh plant data to get updated photos
        await refreshPlantData();
        console.log('🔄 Plant data refreshed');
        
        return {
          success: true,
          photo: result.photo,
          message: 'Photo uploaded successfully!'
        };
      } else {
        console.error('❌ Photo upload failed:', result.error);
        return result;
      }
    } catch (err) {
      console.error('💥 Exception in addPlantPhoto:', err);
      return { success: false, error: err.message };
    }
  };

  // Delete a plant photo
  const removePlantPhoto = async (photoIndex) => {
    if (!currentUser) {
      return { success: false, error: 'Please log in to delete photos' };
    }

    try {
      const result = await deletePlantPhoto(currentUser.uid, photoIndex);
      
      if (result.success) {
        // Refresh plant data to reflect deletion
        await refreshPlantData();
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error removing photo:', error);
      return {
        success: false,
        error: 'Failed to delete photo'
      };
    }
  };

  // Get plant photos with enhanced data
  const getPhotos = async () => {
    if (!currentUser) return [];
    
    try {
      return await getPlantPhotos(currentUser.uid);
    } catch (error) {
      console.error('❌ Error getting photos:', error);
      return [];
    }
  };

  // Get photo statistics
  const getPhotoStats = async () => {
    if (!currentUser) return { totalPhotos: 0, trackingDays: 0, weeksCovered: 0 };
    
    try {
      const timeline = await getGrowthTimeline(currentUser.uid);
      return timeline.stats;
    } catch (error) {
      console.error('❌ Error getting photo stats:', error);
      return { totalPhotos: 0, trackingDays: 0, weeksCovered: 0 };
    }
  };

  // Get growth timeline for photos
  const getPhotoTimeline = async () => {
    if (!currentUser) return { weeks: {}, stats: { totalPhotos: 0, trackingDays: 0, weeksCovered: 0 } };
    
    try {
      return await getGrowthTimeline(currentUser.uid);
    } catch (error) {
      console.error('❌ Error getting photo timeline:', error);
      return { weeks: {}, stats: { totalPhotos: 0, trackingDays: 0, weeksCovered: 0 } };
    }
  };

  // ==================== COMPATIBILITY FUNCTIONS (maintain old API) ====================

  // Get user's first name
  const getFirstName = () => {
    return userProfile?.displayName?.split(' ')[0] || currentUser?.displayName?.split(' ')[0] || 'User';
  };

  // Check if user has completed onboarding
  const hasCompletedOnboarding = () => {
    return !!userPlant;
  };

  // Get user's preferred temperature unit
  const getTemperatureUnit = () => {
    return userProfile?.preferences?.units === 'imperial' ? '°F' : '°C';
  };

  // Get user's readable join date
  const getJoinDate = () => {
    const joinDate = userProfile?.createdAt?.toDate() || currentUser?.metadata?.creationTime;
    if (!joinDate) return 'Recently';
    
    return new Date(joinDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Update plant status based on sensor data (maintains old API)
  const updatePlantStatus = (sensorData) => {
    if (!userPlant) return;
    
    let newStatus = 'healthy';
  
    if (sensorData.soilMoisture < 30) {
      newStatus = 'thirsty';
    } else if (sensorData.temperature < 17) {
      newStatus = 'cold';
    } else if (sensorData.temperature > 27) {
      newStatus = 'hot';
    } else if (sensorData.humidity < 40) {
      newStatus = 'dry';
    }
  
    setUserPlant(prev => ({
      ...prev,
      status: newStatus,
      sensorData: {
        soilMoisture: sensorData.soilMoisture,
        humidity: sensorData.humidity,
        temperature: sensorData.temperature,
        normalizedTemperature: (sensorData.temperature / 40) * 100, // normalize to 0-100
        light: sensorData.light,
      },
    }));
  };

  // Record plant care actions (maintains old API)
  const recordCareActionContext = async (action, notes = '') => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };
    
    try {
      const result = await recordCareAction(currentUser.uid, action, notes);
      
      if (result.success) {
        // Refresh plant data to get updated care history
        await refreshPlantData();
      }
      
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ==================== AUTH STATE LISTENER ====================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'logged in' : 'logged out');
      
      if (user) {
        setCurrentUser(user);
        await fetchUserProfile(user.uid);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setUserPlant(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // ==================== VALUE OBJECT ====================

  const value = {
    // Auth state
    currentUser,
    userProfile,
    loading: loading || authLoading,
    error,
    
    // Auth functions
    signUp,
    signIn,
    signInWithGoogle: signInWithGoogleProvider,
    signOut,
    deletePlant,
    
    // Photo functions
    addPlantPhoto,
    removePlantPhoto,
    getPhotos,
    getPhotoStats,
    getPhotoTimeline,

    // User functions (maintains old API)
    user: userProfile || {
      id: currentUser?.uid,
      name: currentUser?.displayName || '',
      email: currentUser?.email || '',
      joinDate: currentUser?.metadata?.creationTime || new Date(),
      preferences: {
        notifications: true,
        reminderTime: '09:00',
        theme: 'light',
        units: 'imperial',
        language: 'en',
      },
      streak: userProfile?.streakCount || 0,
      ...userProfile
    },
    plant: userPlant || {
      id: `${currentUser?.uid}_plant`,
      name: 'My Plant',
      species: '',
      age: '0 days',
      status: 'healthy',
      lastWatered: new Date(),
      careSchedule: {
        watering: 'every 2 days',
        sunlight: 'indirect light',
        optimalTemperature: '17-27°C',
        optimalHumidity: '40-70%',
      },
      streak: userProfile?.streakCount || 0,
      photos: [],
      careHistory: [],
      ...userPlant
    },
    
    // Functions (maintains old API)
    updatePreferences,
    updateLocation,
    updatePlantStatus,
    recordCareAction: recordCareActionContext,
    refreshPlantData,
    createPlant,
    getFirstName,
    hasCompletedOnboarding,
    getTemperatureUnit,
    getJoinDate,
    
    // Auth specific
    isAuthenticated: !!currentUser,
    isNewUser: currentUser && !userProfile?.createdAt
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;