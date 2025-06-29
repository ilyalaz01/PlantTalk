// src/services/firebase.js - COMPLETE VERSION with Base64 storage only
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  addDoc,
  query,
  deleteDoc,
  where,
  orderBy,
  limit,
  Timestamp
} from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configure Google Auth Provider
const googleProvider = new GoogleAuthProvider();

console.log('🔥 Firebase initialized successfully');

// ==================== AUTH FUNCTIONS ====================

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    // Create user profile in Firestore
    const userProfileData = {
      displayName: displayName || '',
      email: email,
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
    
    const result = await createUserProfile(userCredential.user.uid, userProfileData);
    console.log('✅ User profile creation result:', result);
    
    console.log('✅ Sign up successful:', userCredential.user.email);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('❌ Sign up error:', error.message);
    return { user: null, error: error.message };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Sign in successful:', userCredential.user.email);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('❌ Sign in error:', error.message);
    return { user: null, error: error.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if this is a new user and create profile if needed
    const userProfile = await getUserProfile(result.user.uid);
    if (!userProfile) {
      await createUserProfile(result.user.uid, {
        displayName: result.user.displayName || '',
        email: result.user.email,
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
      });
    }
    
    console.log('✅ Google sign in successful:', result.user.email);
    return { user: result.user, error: null };
  } catch (error) {
    console.error('❌ Google sign in error:', error.message);
    return { user: null, error: error.message };
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ Sign out successful');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Sign out error:', error.message);
    return { success: false, error: error.message };
  }
};

// ==================== USER PROFILE FUNCTIONS ====================

// Create user profile
export const createUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, profileData);
    console.log('✅ User profile created');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    } else {
      console.log('❌ No user profile found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, updates);
    console.log('✅ User profile updated');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

// ==================== PLANT FUNCTIONS ====================

// Create user plant
export const createUserPlant = async (userId, plantData) => {
  try {
    const plantRef = doc(db, 'plants', `${userId}_plant`);
    const plantDoc = {
      ...plantData,
      userId: userId,
      createdAt: Timestamp.now(),
      photos: [],
      careHistory: [],
      sensorData: {
        soilMoisture: 0,
        temperature: 20,
        humidity: 50,
        light: 50,
        normalizedTemperature: 50
      }
    };
    
    await setDoc(plantRef, plantDoc);
    console.log('✅ Plant created successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Error creating plant:', error);
    return { success: false, error: error.message };
  }
};

// Get user plant
export const getUserPlant = async (userId) => {
  try {
    const plantRef = doc(db, 'plants', `${userId}_plant`);
    const plantSnap = await getDoc(plantRef);
    
    if (plantSnap.exists()) {
      return { id: plantSnap.id, ...plantSnap.data() };
    } else {
      console.log('❌ No plant found for user');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting plant:', error);
    return null;
  }
};

// Delete user plant and all associated data
export const deleteUserPlant = async (userId) => {
  try {
    const plantRef = doc(db, 'plants', `${userId}_plant`);
    
    // Delete the plant document (photos are stored as base64 in the document)
    await deleteDoc(plantRef);
    
    console.log('✅ Plant deleted successfully');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Error deleting plant:', error);
    return { success: false, error: error.message };
  }
};

// ==================== PHOTO FUNCTIONS (Base64 Storage) ====================

// Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Compress image using canvas
const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw compressed image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob with compression
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Upload plant photo using base64 encoding to Firestore
export const uploadPlantPhoto = async (userId, file, note = '') => {
  try {
    console.log('📸 uploadPlantPhoto called with:', { userId, fileName: file?.name, note });
    
    // Validate file
    if (!file || !file.type.startsWith('image/')) {
      return { success: false, error: 'Please select a valid image file' };
    }

    // Check file size (max 4MB for base64)
    if (file.size > 4 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 4MB' };
    }

    console.log('📸 Processing photo for base64 storage...');
    
    // Use more aggressive compression for larger files
    let maxWidth = 1000;
    let quality = 0.8;
    
    // More compression for files over 1MB
    if (file.size > 1024 * 1024) {
      maxWidth = 800;
      quality = 0.6;
    }
    
    // Even more compression for files over 2MB
    if (file.size > 2 * 1024 * 1024) {
      maxWidth = 600;
      quality = 0.5;
    }
    
    // Compress image to reduce size
    const compressedFile = await compressImage(file, maxWidth, quality);
    console.log('🗜️ Image compressed from', file.size, 'to', compressedFile.size, 'bytes');
    
    // Convert to base64
    const base64Data = await fileToBase64(compressedFile);
    console.log('✅ Photo converted to base64, length:', base64Data.length);
    
    // Create photo object
    const photoData = {
      base64: base64Data,
      timestamp: Timestamp.now(),
      note: note.trim(),
      originalSize: file.size,
      compressedSize: compressedFile.size,
      fileName: file.name,
      type: file.type,
      uploadDate: new Date().toISOString()
    };
    
    // Update plant document with new photo
    const plantRef = doc(db, 'plants', `${userId}_plant`);
    const plantDoc = await getDoc(plantRef);
    
    if (plantDoc.exists()) {
      const currentPhotos = plantDoc.data().photos || [];
      const updatedPhotos = [photoData, ...currentPhotos]; // Add new photo at the beginning
      
      console.log('📝 Updating plant document with new photo...');
      await updateDoc(plantRef, {
        photos: updatedPhotos,
        lastPhotoDate: Timestamp.now(),
        totalPhotos: updatedPhotos.length
      });
      
      console.log('✅ Plant document updated with new photo');
    } else {
      console.error('❌ Plant document not found');
      return { success: false, error: 'Plant not found' };
    }
    
    return { 
      success: true, 
      photo: {
        ...photoData,
        url: base64Data // For compatibility with existing components
      },
      message: 'Photo uploaded successfully!' 
    };
    
  } catch (error) {
    console.error('❌ Error uploading photo:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to upload photo' 
    };
  }
};

// Delete a plant photo from Firestore
export const deletePlantPhoto = async (userId, photoIndex) => {
  try {
    console.log('🗑️ Deleting photo at index:', photoIndex, 'for user:', userId);
    
    const plantRef = doc(db, 'plants', `${userId}_plant`);
    const plantDoc = await getDoc(plantRef);
    
    if (plantDoc.exists()) {
      const currentPhotos = plantDoc.data().photos || [];
      
      if (photoIndex >= 0 && photoIndex < currentPhotos.length) {
        const updatedPhotos = currentPhotos.filter((_, index) => index !== photoIndex);
        
        await updateDoc(plantRef, {
          photos: updatedPhotos,
          totalPhotos: updatedPhotos.length
        });
        
        console.log('✅ Photo deleted from plant document');
        return { success: true, message: 'Photo deleted successfully!' };
      } else {
        return { success: false, error: 'Photo not found' };
      }
    } else {
      return { success: false, error: 'Plant not found' };
    }
    
  } catch (error) {
    console.error('❌ Error deleting photo:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to delete photo' 
    };
  }
};

// Get all photos for a plant, sorted by date (newest first)
export const getPlantPhotos = async (userId) => {
  try {
    const plantRef = doc(db, 'plants', `${userId}_plant`);
    const plantDoc = await getDoc(plantRef);
    
    if (plantDoc.exists()) {
      const photos = plantDoc.data().photos || [];
      
      // Sort by timestamp (newest first) and add url compatibility
      return photos
        .map(photo => ({
          ...photo,
          url: photo.base64 || photo.url // Support both base64 and url formats
        }))
        .sort((a, b) => {
          const aTime = a.timestamp?.toDate?.() || new Date(a.timestamp);
          const bTime = b.timestamp?.toDate?.() || new Date(b.timestamp);
          return bTime - aTime;
        });
    }
    
    return [];
  } catch (error) {
    console.error('❌ Error fetching photos:', error);
    return [];
  }
};

// Get photo count for a user
export const getPhotoCount = async (userId) => {
  try {
    const plantRef = doc(db, 'plants', `${userId}_plant`);
    const plantDoc = await getDoc(plantRef);
    
    if (plantDoc.exists()) {
      const photos = plantDoc.data().photos || [];
      return photos.length;
    }
    
    return 0;
  } catch (error) {
    console.error('❌ Error getting photo count:', error);
    return 0;
  }
};

// Get growth timeline (photos grouped by weeks)
export const getGrowthTimeline = async (userId) => {
  try {
    const photos = await getPlantPhotos(userId);
    
    if (photos.length === 0) {
      return { weeks: {}, stats: { totalPhotos: 0, trackingDays: 0, weeksCovered: 0 } };
    }
    
    const weeks = {};
    const now = new Date();
    
    photos.forEach((photo) => {
      const photoDate = photo.timestamp?.toDate ? photo.timestamp.toDate() : new Date(photo.timestamp);
      const diffTime = Math.abs(now - photoDate);
      const weekNumber = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      
      if (!weeks[weekNumber]) {
        weeks[weekNumber] = [];
      }
      weeks[weekNumber].push(photo);
    });
    
    // Calculate stats
    const firstPhoto = photos[photos.length - 1];
    const latestPhoto = photos[0];
    
    let trackingDays = 0;
    if (firstPhoto && latestPhoto) {
      const firstDate = firstPhoto.timestamp?.toDate ? firstPhoto.timestamp.toDate() : new Date(firstPhoto.timestamp);
      const latestDate = latestPhoto.timestamp?.toDate ? latestPhoto.timestamp.toDate() : new Date(latestPhoto.timestamp);
      trackingDays = Math.floor((latestDate - firstDate) / (1000 * 60 * 60 * 24));
    }
    
    const stats = {
      totalPhotos: photos.length,
      trackingDays,
      weeksCovered: Object.keys(weeks).length
    };
    
    return { weeks, stats };
  } catch (error) {
    console.error('❌ Error getting growth timeline:', error);
    return { weeks: {}, stats: { totalPhotos: 0, trackingDays: 0, weeksCovered: 0 } };
  }
};

// ==================== SENSOR DATA & STREAK FUNCTIONS ====================

// Add sensor log
export const addSensorLog = async (userId, sensorData) => {
  try {
    const logRef = collection(db, 'logs');
    
    // Check if all sensors are in healthy range
    const isHealthy = (
      sensorData.soilMoisture >= 30 && sensorData.soilMoisture <= 70 &&
      sensorData.temperature >= 17 && sensorData.temperature <= 27 &&
      sensorData.humidity >= 40 && sensorData.humidity <= 70 &&
      (sensorData.light >= 30 && sensorData.light <= 80)
    );
    
    const logData = {
      userId: userId,
      timestamp: Timestamp.now(),
      ...sensorData,
      isHealthy: isHealthy
    };
    
    await addDoc(logRef, logData);
    console.log('✅ Sensor log added');
    return { success: true, error: null };
  } catch (error) {
    console.error('❌ Error adding sensor log:', error);
    return { success: false, error: error.message };
  }
};

// Calculate user streak
export const calculateUserStreak = async (userId) => {
  try {
    const logsRef = collection(db, 'logs');
    const q = query(
      logsRef, 
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(168) // Last 7 days * 24 hours
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { currentStreak: 0, bestStreak: 0 };
    }
    
    // Group logs by day
    const dayGroups = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.timestamp.toDate();
      const dayKey = date.toDateString();
      
      if (!dayGroups[dayKey]) {
        dayGroups[dayKey] = [];
      }
      dayGroups[dayKey].push(data);
    });
    
    // Calculate streaks
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    const sortedDays = Object.keys(dayGroups).sort((a, b) => new Date(b) - new Date(a));
    
    for (const day of sortedDays) {
      const dayLogs = dayGroups[day];
      
      // Check if day has enough readings (at least 4 readings for a full day)
      if (dayLogs.length >= 4) {
        const healthyReadings = dayLogs.filter(log => log.isHealthy).length;
        const healthyPercentage = healthyReadings / dayLogs.length;
        
        // Day is considered "good" if 80% or more readings are healthy
        if (healthyPercentage >= 0.8) {
          tempStreak++;
          if (day === sortedDays[0]) { // Most recent day
            currentStreak = tempStreak;
          }
        } else {
          if (day === sortedDays[0]) { // Most recent day was not good
            currentStreak = 0;
          }
          bestStreak = Math.max(bestStreak, tempStreak);
          tempStreak = 0;
        }
      } else {
        // Not enough data for this day
        if (day === sortedDays[0]) {
          currentStreak = 0;
        }
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    
    bestStreak = Math.max(bestStreak, tempStreak);
    
    console.log(`✅ Streak calculated: current=${currentStreak}, best=${bestStreak}`);
    return { currentStreak, bestStreak };
  } catch (error) {
    console.error('❌ Error calculating streak:', error);
    return { currentStreak: 0, bestStreak: 0 };
  }
};

// ==================== CARE ACTIONS ====================

// Record care action
export const recordCareAction = async (userId, action, notes = '') => {
  try {
    const plantRef = doc(db, 'plants', `${userId}_plant`);
    const plantSnap = await getDoc(plantRef);
    
    if (plantSnap.exists()) {
      const plantData = plantSnap.data();
      const newCareAction = {
        action: action,
        notes: notes,
        timestamp: Timestamp.now(),
        date: new Date().toISOString()
      };
      
      const updatedCareHistory = [...(plantData.careHistory || []), newCareAction];
      
      await updateDoc(plantRef, {
        careHistory: updatedCareHistory,
        lastCareAction: newCareAction
      });
      
      console.log('✅ Care action recorded');
      return { success: true, error: null };
    } else {
      return { success: false, error: 'Plant not found' };
    }
  } catch (error) {
    console.error('❌ Error recording care action:', error);
    return { success: false, error: error.message };
  }
};

// ==================== EXPORTS ====================

export { 
  auth, 
  db, 
  onAuthStateChanged, 
  Timestamp
};

export default app;