// src/components/simulator/SimulationDisplay.js
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import PlantAvatar from '../dashboard/PlantAvatar';
import SpeechBubble from '../dashboard/SpeechBubble';
import { debounce } from 'lodash';

const DisplayContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DisplayTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

const FeedbackContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 100%;
`;

const FeedbackTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const FeedbackText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: ${({ theme }) => theme.typography.lineHeight.md};
  margin: 0;
`;

const FeedbackLoading = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.sm} 0;
  
  &:after {
    content: "...";
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    animation: ellipsis-dot 1.25s infinite;
    animation-fill-mode: forwards;
    width: 1.25em;
  }
  
  @keyframes ellipsis-dot {
    0% { content: ""; }
    25% { content: "."; }
    50% { content: ".."; }
    75% { content: "..."; }
    100% { content: ""; }
  }
`;

// --- Gemini API Call Logic ---
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Access env variable
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// The prompt for generating plant feedback
const PLANT_FEEDBACK_PROMPT = `
You are a helpful plant assistant providing clear, simple advice to plant owners based on sensor data.

Your task is to analyze these plant sensor readings and provide:
1. A brief holistic assessment considering ALL sensor readings together
2. Simple, clear instructions on what to do that address the combined effects of all conditions
3. Make it EXTREMELY simple - imagine explaining to an elderly person who might be worried about their plant

Rules:
- Keep your response to 2-3 short sentences maximum
- Use very simple, non-technical language
- Be direct and specific about any actions needed
- If all conditions are good, just say so briefly
- Consider how multiple issues might be RELATED (e.g., high temperature + low humidity create a more serious problem together)
- Provide ONE comprehensive solution that addresses the COMBINED effects when possible
- Never use jargon or complex explanations
- Include specific actions (e.g., "Move your plant to a cooler, shadier spot and mist the leaves" - addressing both temperature and humidity together)

Here are the readings:
- Soil Moisture: [MOISTURE]% (Optimal: 30-70%)
- Temperature: [TEMPERATURE]°C (Optimal: 17-27°C)
- Humidity: [HUMIDITY]% (Optimal: 40-70%)
- Light Level: [LIGHT]% (Optimal: 30-80%)

Give me a friendly, calm, and extremely simple response that considers how these factors interact with each other.
`;

async function getPlantFeedback(sensorData) {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key not found. Make sure VITE_GEMINI_API_KEY is set.");
    return "Oops! I couldn't analyze your plant data. Please check the API setup.";
  }

  // Replace placeholders with actual values
  const filledPrompt = PLANT_FEEDBACK_PROMPT
    .replace('[MOISTURE]', sensorData.soilMoisture)
    .replace('[TEMPERATURE]', sensorData.temperature)
    .replace('[HUMIDITY]', sensorData.humidity)
    .replace('[LIGHT]', sensorData.light);

  const requestBody = {
    contents: [
      {
        "role": "user",
        "parts": [{"text": filledPrompt}]
      }
    ],
    generationConfig: {
      temperature: 0.2, // Lower temperature for more consistent, factual responses
      maxOutputTokens: 150, // Keep it short
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE"},
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE"},
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE"},
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE"},
    ]
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Gemini API Error:", errorBody);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      console.error("Invalid response structure from Gemini:", data);
      throw new Error("Couldn't understand the API response");
    }

    return textResponse.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Your plant needs attention! But I couldn't analyze the specific issue right now. Please try again.";
  }
}
// --- End Gemini API Call Logic ---

// Fallback hardcoded feedback conditions (only used if API fails)
const feedbackConditions = [
  { 
    condition: (sensor) => sensor.soilMoisture < 30, 
    message: (sensor) => `Low soil moisture (${sensor.soilMoisture}%). Plants wilt when they can't maintain water pressure in their cells.` 
  },
  { 
    condition: (sensor) => sensor.soilMoisture > 70, 
    message: (sensor) => `Excessively wet soil (${sensor.soilMoisture}%) can cause root rot. Roots need oxygen to survive!`
  },
  { 
    condition: (sensor) => sensor.temperature < 17, 
    message: (sensor) => `Cold temperature detected (${sensor.temperature}°C). Growth slows down and leaves may drop.`
  },
  { 
    condition: (sensor) => sensor.temperature > 27, 
    message: (sensor) => `High temperature (${sensor.temperature}°C). Plants lose water faster and might wilt.`
  },
  { 
    condition: (sensor) => sensor.humidity < 40, 
    message: (sensor) => `Low humidity (${sensor.humidity}%). Leaves may brown at the tips and edges.`
  },
  { 
    condition: (sensor) => sensor.light < 30, 
    message: (sensor) => `Low light detected (${sensor.light}%). The plant may grow leggy and weak.`
  },
  { 
    condition: (sensor) => sensor.light > 80, 
    message: (sensor) => `Too much light (${sensor.light}%). Leaves might burn if exposed too long.`
  },
];

// Fallback function to generate holistic feedback if API fails
const generateFallbackFeedback = (sensorData) => {
  const issues = [];

  for (const feedback of feedbackConditions) {
    if (feedback.condition(sensorData)) {
      issues.push(feedback);
    }
  }

  if (issues.length === 0) {
    return "Your plant is in optimal conditions! All values are within healthy ranges.";
  }

  // Check for combined issues and provide holistic advice
  // Temperature + Humidity combination
  const hasTemperatureIssue = issues.some(issue => 
    issue.condition({...sensorData, temperature: sensorData.temperature}));
  const hasHumidityIssue = issues.some(issue => 
    issue.condition({...sensorData, humidity: sensorData.humidity}));
  
  if (hasTemperatureIssue && hasHumidityIssue) {
    if (sensorData.temperature > 27 && sensorData.humidity < 40) {
      return `Your plant is stressed from hot, dry conditions (${sensorData.temperature}°C with ${sensorData.humidity}% humidity). Move it to a cooler spot away from heat sources and mist the leaves or use a small humidifier nearby.`;
    } else if (sensorData.temperature < 17 && sensorData.humidity > 70) {
      return `Your plant is in cold, damp conditions (${sensorData.temperature}°C with ${sensorData.humidity}% humidity). Move it to a warmer location with better air circulation to prevent fungal issues.`;
    }
  }
  
  // Moisture + Light combination
  const hasMoistureIssue = issues.some(issue => 
    issue.condition({...sensorData, soilMoisture: sensorData.soilMoisture}));
  const hasLightIssue = issues.some(issue => 
    issue.condition({...sensorData, light: sensorData.light}));
  
  if (hasMoistureIssue && hasLightIssue) {
    if (sensorData.soilMoisture > 70 && sensorData.light < 30) {
      return `Your plant has wet soil (${sensorData.soilMoisture}%) and low light (${sensorData.light}%). This combination can lead to root rot. Move it to a brighter spot and hold off on watering until the soil dries out a bit.`;
    } else if (sensorData.soilMoisture < 30 && sensorData.light > 80) {
      return `Your plant has dry soil (${sensorData.soilMoisture}%) and intense light (${sensorData.light}%). Water it thoroughly and move to a spot with filtered light to reduce stress.`;
    }
  }
  
  // If there are multiple issues but no specific combinations caught above
  if (issues.length > 1) {
    return `Your plant has multiple needs: fix the ${issues.map(issue => 
      issue.condition.toString().includes('soilMoisture') ? 'watering' : 
      issue.condition.toString().includes('temperature') ? 'temperature' : 
      issue.condition.toString().includes('humidity') ? 'humidity' : 'light'
    ).join(' and ')} issues. The most urgent is ${issues[0].message(sensorData).split('.')[0].toLowerCase()}.`;
  }
  
  // If only one issue
  return `Your plant needs attention! ${issues[0].message(sensorData)}`;
};

const SimulationDisplay = ({ simulatedPlant, simulatedSensor }) => {
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSensor, setDebouncedSensor] = useState(simulatedSensor);
  
  // Create a debounced function to update the sensor values
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSensorUpdate = useCallback(
    debounce((newSensorData) => {
      setDebouncedSensor(newSensorData);
    }, 2000), // 2 second debounce time
    []
  );
  
  // Update the debounced sensor data when the slider values change
  useEffect(() => {
    debounceSensorUpdate({...simulatedSensor});
    
    // Show loading state immediately when sliders move
    setIsLoading(true);
    
    // Return cleanup function
    return () => {
      debounceSensorUpdate.cancel();
    };
  }, [
    simulatedSensor.soilMoisture, 
    simulatedSensor.temperature, 
    simulatedSensor.humidity, 
    simulatedSensor.light,
    debounceSensorUpdate
  ]);
  
  // Get AI-generated feedback only when debounced sensor values change
  useEffect(() => {
    // Skip the API call during development if desired
    const USE_GEMINI = true; // Set to false to use fallback logic instead
    
    const fetchFeedback = async () => {
      try {
        if (USE_GEMINI) {
          const aiResponse = await getPlantFeedback(debouncedSensor);
          setFeedback(aiResponse);
        } else {
          // Use fallback hardcoded logic
          setFeedback(generateFallbackFeedback(debouncedSensor));
        }
      } catch (error) {
        console.error("Error getting plant feedback:", error);
        // Use fallback if API fails
        setFeedback(generateFallbackFeedback(debouncedSensor));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeedback();
  }, [debouncedSensor]);
  
  return (
    <DisplayContainer>
      <DisplayTitle>Plant Response Simulation</DisplayTitle>
      
      {/* Pass the regular (non-debounced) sensor data to the PlantAvatar for immediate visual feedback */}
      <PlantAvatar plant={simulatedPlant} sensorData={simulatedSensor} />
      <SpeechBubble plant={simulatedPlant} sensorData={simulatedSensor} />
      
      <FeedbackContainer>
        <FeedbackTitle>What's Happening</FeedbackTitle>
        
        {isLoading ? (
          <FeedbackLoading>Analyzing plant conditions</FeedbackLoading>
        ) : (
          <FeedbackText>{feedback}</FeedbackText>
        )}
      </FeedbackContainer>
    </DisplayContainer>
  );
};

export default SimulationDisplay;