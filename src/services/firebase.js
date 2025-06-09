// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_hwr5ZvSnA8oR-BfLIzviJq0yGugQVbE",
  authDomain: "planttalk-c187b.firebaseapp.com",
  projectId: "planttalk-c187b",
  storageBucket: "planttalk-c187b.firebasestorage.app",
  messagingSenderId: "631411487761",
  appId: "1:631411487761:web:44ccc75698a521f5c36db0",
  measurementId: "G-2JDG3WZRNB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);