// src/components/dashboard/PlantAvatar.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { usePlant } from '../../contexts/PlantContext';
import { useSensor } from '../../contexts/SensorContext';

// Container for the entire avatar
const AvatarContainer = styled.div`
  position: relative;
  width: 320px;
  height: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
`;

const PlantContainer = styled(motion.div)`
  width: 250px;
  height: 300px;
  position: relative;
  z-index: 10;
  margin-bottom: -30px; // Overlap with pot to hide stem base
`;

const PotContainer = styled.div`
  width: 160px;
  height: 150px;
  position: relative;
  z-index: 5;
`;

// Function to determine plant properties based on plant status and sensor data
const getPlantAppearance = (status, temperature, moisture, humidity) => {
  // Default plant (healthy)
  let appearance = {
    primaryColor: '#4CAF50',     // Medium green
    secondaryColor: '#388E3C',   // Darker green
    highlightColor: '#81C784',   // Light green
    stemColor: '#2E7D32',        // Dark green stem
    soilColor: '#795548',        // Medium brown
    soilHighlight: '#8D6E63',    // Lighter brown
    soilShadow: '#5D4037',       // Darker brown
    faceExpression: 'happy',     
    animation: 'gentle'
  };
  
  // Override based on moisture level
  if (moisture > 70) {
    // High moisture - confused plant with dark soil
    appearance = {
      ...appearance,
      primaryColor: '#2E7D32',   // Darker green (oversaturated)
      secondaryColor: '#1B5E20', // Very dark green
      highlightColor: '#43A047', // Slightly lighter green
      soilColor: '#3E2723',      // Very dark brown soil
      soilHighlight: '#4E342E',  // Dark brown highlight
      soilShadow: '#2A1B18',     // Almost black shadow
      faceExpression: 'confused',
      animation: 'wobble'
    };
  } else if (moisture < 30) {
    // Low moisture - sad grey-green plant with grey soil
    appearance = {
      ...appearance,
      primaryColor: '#90A4AE',   // Grey-green
      secondaryColor: '#607D8B', // Darker grey-green
      highlightColor: '#B0BEC5', // Light grey-green
      stemColor: '#546E7A',      // Dark grey-green stem
      soilColor: '#9E9E9E',      // Medium grey soil
      soilHighlight: '#BDBDBD',  // Light grey
      soilShadow: '#757575',     // Dark grey
      faceExpression: 'sad',
      animation: 'wilt',
      tears: true
    };
  }
  
  // Override based on temperature
  if (temperature > 27) {
    // High temperature - yellow/red scared plant
    appearance = {
      ...appearance,
      primaryColor: '#FFC107',   // Amber/yellow
      secondaryColor: '#FF9800', // Orange
      highlightColor: '#FFEB3B', // Yellow
      stemColor: '#F57F17',      // Dark amber stem
      faceExpression: 'scared',
      animation: 'hot',
      hotSpots: true
    };
  } else if (temperature < 17) {
    // Low temperature - blue shivering plant
    appearance = {
      ...appearance,
      primaryColor: '#90CAF9',   // Light blue
      secondaryColor: '#64B5F6',  // Medium blue
      highlightColor: '#BBDEFB',  // Very light blue
      stemColor: '#1976D2',       // Dark blue stem
      faceExpression: 'cold',
      animation: 'shiver',
      frostEffect: true
    };
  }
  
  // Override based on humidity
  if (humidity > 70) {
    // High humidity - drippy green plant with mist/fog effect
    appearance = {
      ...appearance,
      primaryColor: '#26A69A',    // Teal-green
      secondaryColor: '#00897B',  // Darker teal
      highlightColor: '#4DB6AC',  // Light teal
      stemColor: '#00796B',       // Dark teal stem
      faceExpression: 'humid',
      animation: 'drip',
      mistEffect: true
    };
  } else if (humidity < 30) {
    // Low humidity - dry/crispy plant with crunchy effect
    appearance = {
      ...appearance,
      primaryColor: '#8D6E63',    // Brown-green
      secondaryColor: '#6D4C41',  // Darker brown
      highlightColor: '#A1887F',  // Light brown
      stemColor: '#5D4037',       // Dark brown stem
      faceExpression: 'parched',
      animation: 'crackle',
      dryEffect: true
    };
  }
  
  return appearance;
};

// Animation variants for different plant states
const plantAnimations = {
  gentle: {
    rotate: [0, 0.5, 0, -0.5, 0],
    transition: { 
      repeat: Infinity, 
      duration: 4,
      ease: "easeInOut" 
    }
  },
  wilt: {
    rotate: [0, -1, 0],
    y: [0, 5, 0],
    transition: { 
      repeat: Infinity, 
      duration: 3,
      ease: "easeInOut" 
    }
  },
  wobble: {
    rotate: [0, 1, -1, 0.5, 0],
    transition: { 
      repeat: Infinity, 
      duration: 2.5,
      ease: "easeInOut" 
    }
  },
  hot: {
    scale: [1, 1.01, 1],
    transition: { 
      repeat: Infinity, 
      duration: 1.5,
      ease: "easeInOut" 
    }
  },
  shiver: {
    x: [0, -1, 0, 1, 0],
    rotate: [0, -0.3, 0, 0.3, 0],
    transition: { 
      repeat: Infinity, 
      duration: 0.3,
      ease: "linear"
    }
  },
  drip: {
    y: [0, 1, 0],
    transition: { 
      repeat: Infinity, 
      duration: 2,
      ease: "easeInOut" 
    }
  },
  crackle: {
    rotate: [0, 0.2, 0, -0.2, 0],
    scale: [1, 0.995, 1],
    transition: { 
      repeat: Infinity, 
      duration: 1,
      ease: "easeInOut" 
    }
  }
};

const PlantAvatar = () => {
  const { plant } = usePlant();
  const { sensorData } = useSensor();
  const [droplets, setDroplets] = useState([]);
  const [mistParticles, setMistParticles] = useState([]);
  const [crackParticles, setCrackParticles] = useState([]);
  
  // Get appearance based on plant state and sensor data
  const appearance = getPlantAppearance(
    plant.status, 
    sensorData.temperature, 
    sensorData.soilMoisture,
    sensorData.humidity
  );
  
  // Effect for creating tear droplets when plant is sad from low moisture
  useEffect(() => {
    if (appearance.tears) {
      const interval = setInterval(() => {
        const newDroplet = {
          id: Date.now(),
          side: Math.random() > 0.5 ? 'left' : 'right',
          size: 3 + Math.random() * 3
        };
        
        setDroplets(prev => [...prev, newDroplet]);
        
        setTimeout(() => {
          setDroplets(prev => prev.filter(d => d.id !== newDroplet.id));
        }, 2000);
      }, 1500);
      
      return () => clearInterval(interval);
    } else {
      setDroplets([]);
    }
  }, [appearance.tears]);
  
  // Effect for creating mist particles when humidity is high
  useEffect(() => {
    if (appearance.mistEffect) {
      const interval = setInterval(() => {
        // Create 3-5 mist particles at random positions
        const newParticles = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => ({
          id: Date.now() + Math.random(),
          x: 50 + Math.random() * 150,
          y: 40 + Math.random() * 200,
          size: 10 + Math.random() * 20,
          duration: 3 + Math.random() * 2
        }));
        
        setMistParticles(prev => [...prev, ...newParticles]);
        
        // Remove particles after they fade
        setTimeout(() => {
          const idsToRemove = newParticles.map(p => p.id);
          setMistParticles(prev => prev.filter(p => !idsToRemove.includes(p.id)));
        }, 5000);
      }, 1000);
      
      return () => clearInterval(interval);
    } else {
      setMistParticles([]);
    }
  }, [appearance.mistEffect]);
  
  // Effect for creating crack particles when humidity is low
  useEffect(() => {
    if (appearance.dryEffect) {
      const interval = setInterval(() => {
        // Create 1-2 crack particles at leaf edges
        const newParticles = Array.from({ length: 1 + Math.floor(Math.random() * 2) }, () => {
          // Random positions near leaf edges
          const positions = [
            { x: 60 + Math.random() * 20, y: 160 + Math.random() * 30 },
            { x: 170 + Math.random() * 20, y: 160 + Math.random() * 30 },
            { x: 70 + Math.random() * 20, y: 90 + Math.random() * 30 },
            { x: 160 + Math.random() * 20, y: 90 + Math.random() * 30 },
            { x: 110 + Math.random() * 30, y: 60 + Math.random() * 20 }
          ];
          
          const randomPos = positions[Math.floor(Math.random() * positions.length)];
          
          return {
            id: Date.now() + Math.random(),
            ...randomPos,
            size: 2 + Math.random() * 3,
            rotation: Math.random() * 360
          };
        });
        
        setCrackParticles(prev => [...prev, ...newParticles]);
        
        // Remove particles after animation
        setTimeout(() => {
          const idsToRemove = newParticles.map(p => p.id);
          setCrackParticles(prev => prev.filter(p => !idsToRemove.includes(p.id)));
        }, 3000);
      }, 2000);
      
      return () => clearInterval(interval);
    } else {
      setCrackParticles([]);
    }
  }, [appearance.dryEffect]);
  
  // Render facial expressions based on state
  const renderFace = () => {
    switch(appearance.faceExpression) {
      case 'confused':
        return (
          <g>
            {/* Confused eyebrows */}
            <path 
              d="M85 95 L95 90" 
              stroke="#2A1B18" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <path 
              d="M115 90 L125 95" 
              stroke="#2A1B18" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            
            {/* Confused eyes */}
            <circle cx="90" cy="105" r="5" fill="#2A1B18" />
            <circle cx="120" cy="105" r="5" fill="#2A1B18" />
            
            {/* Confused mouth */}
            <path 
              d="M95 120 Q105 125, 115 120" 
              stroke="#2A1B18" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
            <line 
              x1="95" y1="120" x2="115" y2="120" 
              stroke="#2A1B18" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
          </g>
        );
        
      case 'sad':
        return (
          <g>
            {/* Sad eyebrows */}
            <path 
              d="M85 90 Q90 95, 95 93" 
              stroke="#546E7A" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <path 
              d="M115 93 Q120 95, 125 90" 
              stroke="#546E7A" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            
            {/* Sad eyes - droopy */}
            <path 
              d="M88 105 Q90 102, 92 105" 
              stroke="#546E7A" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
            <path 
              d="M118 105 Q120 102, 122 105" 
              stroke="#546E7A" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
            
            {/* Sad mouth - frown */}
            <path 
              d="M95 125 Q105 120, 115 125" 
              stroke="#546E7A" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
            
            {/* Tear anchors for animation */}
            <circle cx="85" cy="105" r="1" fill="transparent" id="leftTearAnchor" />
            <circle cx="125" cy="105" r="1" fill="transparent" id="rightTearAnchor" />
          </g>
        );
        
      case 'scared':
        return (
          <g>
            {/* Scared eyebrows - high */}
            <path 
              d="M85 85 Q90 80, 95 83" 
              stroke="#F57F17" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <path 
              d="M115 83 Q120 80, 125 85" 
              stroke="#F57F17" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            
            {/* Scared eyes - wide */}
            <circle cx="90" cy="100" r="7" fill="#F57F17" />
            <circle cx="120" cy="100" r="7" fill="#F57F17" />
            <circle cx="88" cy="98" r="2" fill="white" />
            <circle cx="118" cy="98" r="2" fill="white" />
            
            {/* Scared mouth - small 'o' */}
            <circle cx="105" cy="120" r="5" fill="#F57F17" />
          </g>
        );
        
      case 'cold':
        return (
          <g>
            {/* Cold eyebrows - tense */}
            <path 
              d="M85 90 L95 87" 
              stroke="#1976D2" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <path 
              d="M115 87 L125 90" 
              stroke="#1976D2" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            
            {/* Cold eyes - squinting */}
            <path 
              d="M88 100 Q90 97, 92 100" 
              stroke="#1976D2" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round" 
            />
            <path 
              d="M118 100 Q120 97, 122 100" 
              stroke="#1976D2" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round" 
            />
            
            {/* Cold mouth - chattering */}
            <motion.path 
              d="M95 120 L105 117 L115 120" 
              stroke="#1976D2" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round"
              animate={{ y: [0, -1, 0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.3 }}
            />
          </g>
        );
        
      case 'humid':
        return (
          <g>
            {/* Humid eyebrows - relaxed but wet */}
            <path 
              d="M85 92 Q95 90, 95 92" 
              stroke="#00796B" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <path 
              d="M115 92 Q115 90, 125 92" 
              stroke="#00796B" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            
            {/* Humid eyes - slightly squinting from moisture */}
            <path 
              d="M87 105 Q90 102, 93 105" 
              stroke="#00796B" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round" 
            />
            <path 
              d="M117 105 Q120 102, 123 105" 
              stroke="#00796B" 
              strokeWidth="3" 
              fill="none" 
              strokeLinecap="round" 
            />
            
            {/* Humid mouth - slightly open panting */}
            <path 
              d="M95 120 Q105 125, 115 120" 
              stroke="#00796B" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
            <motion.path 
              d="M100 122 L110 122" 
              stroke="#00796B" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
              animate={{ y: [0, -1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </g>
        );
        
      case 'parched':
        return (
          <g>
            {/* Parched eyebrows - cracked, dry */}
            <path 
              d="M85 90 L90 93 L95 90" 
              stroke="#5D4037" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            <path 
              d="M115 90 L120 93 L125 90" 
              stroke="#5D4037" 
              strokeWidth="2" 
              strokeLinecap="round" 
            />
            
            {/* Parched eyes - dry, cracked */}
            <path 
              d="M88 105 L92 105" 
              stroke="#5D4037" 
              strokeWidth="3" 
              strokeLinecap="round" 
            />
            <path 
              d="M118 105 L122 105" 
              stroke="#5D4037" 
              strokeWidth="3" 
              strokeLinecap="round" 
            />
            
            {/* Parched mouth - cracked, dry lips */}
            <path 
              d="M95 120 Q105 118, 115 120" 
              stroke="#5D4037" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
            />
            <path 
              d="M98 120 L102 120 M108 120 L112 120" 
              stroke="#5D4037" 
              strokeWidth="1" 
              strokeDasharray="2,2"
              fill="none" 
            />
          </g>
        );
        
      default: // happy
        return (
          <g>
            {/* Happy eyebrows - relaxed */}
            <path 
              d="M85 95 L95 95" 
              stroke="#2E7D32" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <path 
              d="M115 95 L125 95" 
              stroke="#2E7D32" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            
            {/* Happy eyes */}
            <circle cx="90" cy="105" r="5" fill="#2E7D32" />
            <circle cx="120" cy="105" r="5" fill="#2E7D32" />
            <circle cx="88" cy="103" r="1.5" fill="white" />
            <circle cx="118" cy="103" r="1.5" fill="white" />
            
            {/* Happy mouth - smile */}
            <path 
              d="M95 120 Q105 130, 115 120" 
              stroke="#2E7D32" 
              strokeWidth="2.5" 
              fill="none" 
              strokeLinecap="round" 
            />
          </g>
        );
    }
  };

  return (
    <AvatarContainer>
      <PlantContainer
        animate={appearance.animation}
        variants={plantAnimations}
        initial="gentle"
      >
        <svg
          width="250"
          height="300"
          viewBox="0 0 250 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Definitions for gradients and filters */}
          <defs>
            {/* Leaf gradient */}
            <radialGradient id="leafGradient" cx="0.5" cy="0.5" r="0.6" fx="0.4" fy="0.3">
              <stop offset="0%" stopColor={appearance.highlightColor} />
              <stop offset="60%" stopColor={appearance.primaryColor} />
              <stop offset="100%" stopColor={appearance.secondaryColor} />
            </radialGradient>
            
            {/* Stem gradient */}
            <linearGradient id="stemGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={appearance.stemColor} />
              <stop offset="50%" stopColor={appearance.primaryColor} />
              <stop offset="100%" stopColor={appearance.stemColor} />
            </linearGradient>
            
            {/* Leaf vein pattern */}
            <pattern id="leafVeins" patternUnits="userSpaceOnUse" width="100" height="100">
              <path d="M50 0 L50 100 M25 25 L75 75 M75 25 L25 75" 
                    stroke={appearance.secondaryColor} strokeWidth="0.5" opacity="0.3" />
            </pattern>
            
            {/* Drop shadow filter */}
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.2" />
            </filter>
            
            {/* Highlight filter */}
            <filter id="highlight" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
              <feOffset in="blur" dx="-2" dy="-2" result="offsetBlur" />
              <feSpecularLighting in="offsetBlur" surfaceScale="5" specularConstant="0.75" 
                           specularExponent="20" lightingColor="white" result="specOut">
                <fePointLight x="60" y="60" z="160" />
              </feSpecularLighting>
              <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
              <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" 
                          k1="0" k2="1" k3="1" k4="0" result="litPaint" />
            </filter>
            
            {/* Mist filter for high humidity */}
            <filter id="mistFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" />
              <feColorMatrix type="matrix" values="1 0 0 0 1  0 1 0 0 1  0 0 1 0 1  0 0 0 0.3 0" />
            </filter>
            
            {/* Crackle filter for low humidity */}
            <filter id="crackleFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="5" />
              <feDisplacementMap in="SourceGraphic" scale="5" />
            </filter>
          </defs>
          
          {/* Main stem - continuous natural-looking stem from pot to top */}
          <path 
            d="M125 300 C125 280, 123 250, 125 230 C127 210, 128 200, 125 180 C122 160, 120 140, 125 120" 
            stroke="url(#stemGradient)" 
            strokeWidth="8" 
            strokeLinecap="round" 
            filter="url(#dropShadow)" 
          />
          
          {/* Main plant body - a realistic-looking plant */}
          
          {/* Central group of leaves */}
          <g filter="url(#highlight)">
            {/* Leaf 1 - left bottom */}
            <path 
              d="M95 180 C60 170, 40 190, 50 220 C60 250, 90 240, 100 210 C110 180, 95 180, 95 180 Z" 
              fill="url(#leafGradient)" 
              stroke={appearance.secondaryColor} 
              strokeWidth="1" 
              filter="url(#dropShadow)" 
            />
            
            {/* Leaf 2 - right bottom */}
            <path 
              d="M155 180 C190 170, 210 190, 200 220 C190 250, 160 240, 150 210 C140 180, 155 180, 155 180 Z" 
              fill="url(#leafGradient)" 
              stroke={appearance.secondaryColor} 
              strokeWidth="1" 
              filter="url(#dropShadow)" 
            />
            
            {/* Leaf 3 - left middle */}
            <path 
              d="M95 160 C45 140, 30 100, 50 80 C70 60, 100 80, 110 115 C120 150, 95 160, 95 160 Z" 
              fill="url(#leafGradient)" 
              stroke={appearance.secondaryColor} 
              strokeWidth="1" 
              filter="url(#dropShadow)" 
            />
            
            {/* Leaf 4 - right middle */}
            <path 
              d="M155 160 C205 140, 220 100, 200 80 C180 60, 150 80, 140 115 C130 150, 155 160, 155 160 Z" 
              fill="url(#leafGradient)" 
              stroke={appearance.secondaryColor} 
              strokeWidth="1" 
              filter="url(#dropShadow)" 
            />
            
            {/* Leaf 5 - center top */}
            <path 
              d="M105 120 C60 90, 70 60, 90 40 C110 20, 140 20, 160 40 C180 60, 190 90, 145 120 C125 135, 105 120, 105 120 Z" 
              fill="url(#leafGradient)" 
              stroke={appearance.secondaryColor} 
              strokeWidth="1" 
              filter="url(#dropShadow)" 
            />
            
            {/* Add leaf detail pattern/veins */}
            <path 
              d="M95 180 C60 170, 40 190, 50 220 C60 250, 90 240, 100 210 C110 180, 95 180, 95 180 Z" 
              fill="url(#leafVeins)" 
              fillOpacity="0.3" 
            />
            <path 
              d="M155 180 C190 170, 210 190, 200 220 C190 250, 160 240, 150 210 C140 180, 155 180, 155 180 Z" 
              fill="url(#leafVeins)" 
              fillOpacity="0.3" 
            />
            <path 
              d="M95 160 C45 140, 30 100, 50 80 C70 60, 100 80, 110 115 C120 150, 95 160, 95 160 Z" 
              fill="url(#leafVeins)" 
              fillOpacity="0.3" 
            />
            <path 
              d="M155 160 C205 140, 220 100, 200 80 C180 60, 150 80, 140 115 C130 150, 155 160, 155 160 Z" 
              fill="url(#leafVeins)" 
              fillOpacity="0.3" 
            />
            <path 
              d="M105 120 C60 90, 70 60, 90 40 C110 20, 140 20, 160 40 C180 60, 190 90, 145 120 C125 135, 105 120, 105 120 Z" 
              fill="url(#leafVeins)" 
              fillOpacity="0.3" 
            />
          </g>
          
          {/* Apply crackle effect for low humidity */}
          {appearance.dryEffect && (
            <g opacity="0.4" filter="url(#crackleFilter)">
              <path 
                d="M95 180 C60 170, 40 190, 50 220 C60 250, 90 240, 100 210 C110 180, 95 180, 95 180 Z" 
                stroke="#5D4037" 
                strokeWidth="0.5" 
                fill="none" 
                strokeDasharray="3,3"
              />
              <path 
                d="M155 180 C190 170, 210 190, 200 220 C190 250, 160 240, 150 210 C140 180, 155 180, 155 180 Z" 
                stroke="#5D4037" 
                strokeWidth="0.5" 
                fill="none" 
                strokeDasharray="3,3"
              />
              <path 
                d="M105 120 C60 90, 70 60, 90 40 C110 20, 140 20, 160 40 C180 60, 190 90, 145 120 C125 135, 105 120, 105 120 Z" 
                stroke="#5D4037" 
                strokeWidth="0.5" 
                fill="none" 
                strokeDasharray="3,3"
              />
            </g>
          )}
          
          {/* Face container in the center top leaf */}
          <g transform="translate(15, -16)">
            {renderFace()}
          </g>
          
          {/* Special effects based on plant state */}
          
          {/* Frost effect for cold plants */}
          {appearance.frostEffect && (
            <g opacity="0.4">
              <circle cx="70" cy="100" r="2" fill="white" />
              <circle cx="50" cy="150" r="3" fill="white" />
              <circle cx="180" cy="100" r="2.5" fill="white" />
              <circle cx="200" cy="150" r="2" fill="white" />
              <circle cx="125" cy="60" r="2.5" fill="white" />
              <circle cx="90" cy="80" r="1.5" fill="white" />
              <circle cx="160" cy="80" r="1.5" fill="white" />
              <circle cx="110" cy="180" r="2" fill="white" />
              <circle cx="140" cy="180" r="2" fill="white" />
            </g>
          )}
          
          {/* Hot spots for hot plants */}
          {appearance.hotSpots && (
            <g>
              <circle cx="80" cy="150" r="8" fill="#FF5722" opacity="0.3" />
              <circle cx="160" cy="130" r="10" fill="#FF5722" opacity="0.3" />
              <circle cx="125" cy="80" r="7" fill="#FF5722" opacity="0.3" />
              <circle cx="60" cy="100" r="6" fill="#FF5722" opacity="0.3" />
              <circle cx="190" cy="100" r="6" fill="#FF5722" opacity="0.3" />
            </g>
          )}
          
          {/* Mist effect for high humidity */}
          {appearance.mistEffect && (
            <>
              <g opacity="0.5">
                <rect x="0" y="0" width="250" height="300" fill="transparent" />
              </g>
              {mistParticles.map(particle => (
                <motion.circle 
                  key={particle.id}
                  cx={particle.x}
                  cy={particle.y}
                  r={particle.size}
                  fill="white"
                  opacity="0.2"
                  filter="url(#mistFilter)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: particle.duration, ease: "easeInOut" }}
                />
              ))}
              <g opacity="0.2" filter="url(#mistFilter)">
                <ellipse cx="125" cy="150" rx="100" ry="100" fill="#B2DFDB" />
              </g>
            </>
          )}
          
          {/* Crack particles for low humidity */}
          {crackParticles.map(particle => (
            <motion.path
              key={particle.id}
              d={`M${particle.x} ${particle.y} l${2 + Math.random() * 5} ${2 + Math.random() * 5}`}
              stroke="#5D4037"
              strokeWidth="0.8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.8] }}
              transition={{ duration: 3, ease: "easeOut" }}
              style={{ rotate: particle.rotation }}
            />
          ))}
          
          {/* Teardrop animations for sad plants */}
          {droplets.map(droplet => {
            const startX = droplet.side === 'left' ? 85 : 125;
            
            return (
              <motion.path
                key={droplet.id}
                d={`M${startX} 107 
                   Q${startX - 2} ${107 + 5}, ${startX} ${107 + 10} 
                   Q${startX + 2} ${107 + 5}, ${startX} 107 Z`}
                fill="#64B5F6" // Blue teardrop
                opacity="0.7"
                initial={{ y: 0, opacity: 0.7 }}
                animate={{ y: 30, opacity: 0 }}
                transition={{ duration: 2, ease: "easeIn" }}
              />
            );
          })}
        </svg>
      </PlantContainer>
      
      <PotContainer>
        <svg
          width="160"
          height="150"
          viewBox="0 0 160 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Pot gradient */}
            <linearGradient id="potGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8D6E63" />
              <stop offset="50%" stopColor="#A1887F" />
              <stop offset="100%" stopColor="#8D6E63" />
            </linearGradient>
            
            {/* Soil gradient */}
            <radialGradient id="soilGradient" cx="0.5" cy="0.3" r="0.5" fx="0.5" fy="0.3">
              <stop offset="0%" stopColor={appearance.soilHighlight} />
              <stop offset="70%" stopColor={appearance.soilColor} />
              <stop offset="100%" stopColor={appearance.soilShadow} />
            </radialGradient>
            
            {/* Pot shadow */}
            <filter id="potShadow" x="-10%" y="0%" width="120%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="3" floodOpacity="0.2" />
            </filter>
          </defs>
          
          {/* Pot body */}
          <path 
            d="M20 40 L140 40 L130 140 L30 140 Z" 
            fill="url(#potGradient)" 
            stroke="#795548" 
            strokeWidth="1" 
            filter="url(#potShadow)" 
          />
          
          {/* Pot rim */}
          <path 
            d="M15 40 L145 40 L140 30 L20 30 Z" 
            fill="#A1887F" 
            stroke="#8D6E63" 
            strokeWidth="1" 
          />
          
          {/* Pot highlights for 3D effect */}
          <path 
            d="M30 40 L30 140" 
            stroke="#8D6E63" 
            strokeWidth="1" 
            strokeOpacity="0.5" 
          />
          <path 
            d="M130 40 L130 140" 
            stroke="#8D6E63" 
            strokeWidth="1" 
            strokeOpacity="0.5" 
          />
          
          {/* Soil */}
          <ellipse 
            cx="80" 
            cy="40" 
            rx="60" 
            ry="15" 
            fill="url(#soilGradient)" 
          />
          
          {/* Soil texture details */}
          <g opacity="0.4">
            <circle cx="60" cy="40" r="2" fill={appearance.soilShadow} />
            <circle cx="75" cy="37" r="1.5" fill={appearance.soilShadow} />
            <circle cx="90" cy="42" r="2" fill={appearance.soilShadow} />
            <circle cx="105" cy="39" r="1.5" fill={appearance.soilShadow} />
            <circle cx="50" cy="43" r="1" fill={appearance.soilShadow} />
            <circle cx="120" cy="41" r="1" fill={appearance.soilShadow} />
          </g>
        </svg>
      </PotContainer>
    </AvatarContainer>
  );
};

export default PlantAvatar;