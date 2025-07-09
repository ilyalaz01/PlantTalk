// src/pages/ChatPage.jsx - Complete Smart Basil Plant with Research Knowledge
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import ChatBubble from '../components/chat/ChatBubble.jsx';
import ChatInput from '../components/chat/ChatInput.jsx';
import SuggestedQuestions from '../components/chat/SuggestedQuestions.jsx';
import { usePlant } from '../contexts/PlantContext.jsx';
import useSensorData from '../hooks/useSensorData';

// --- Styled Components ---
const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ChatTitle = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ChatWindow = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  height: 500px;
  overflow-y: auto;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.primary} ${({ theme }) => theme.colors.background};
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: ${({ theme }) => theme.colors.background}; }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary};
    border-radius: 20px;
    border: 2px solid ${({ theme }) => theme.colors.background};
  }
`;

const EmptyChat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// --- Enhanced Basil Sensor Interpretation with Research Data ---
const interpretBasilSensorData = (sensorData) => {
  console.log('🔍 CHAT: interpretBasilSensorData called with:', sensorData);
  
  if (!sensorData) {
    return {
      status: "I can't sense my environment right now, but I'm here to help!",
      urgentNeeds: [],
      overallHealth: "unknown"
    };
  }

  const { soilMoisture, temperature, humidity, light } = sensorData;
  
  // Research-based basil sensor interpretation
  const getBasilSensorStatus = (type, value) => {
    switch (type) {
      case 'moisture':
        // Based on HORTSCIENCE 2018: 25-40% VWC is optimal
        if (value < 20) return { 
          status: 'critical', 
          feeling: 'severely stressed and wilting', 
          advice: 'I need water RIGHT NOW! 💧',
          research: 'Below 25% VWC can cause bitter leaves and stunted growth'
        };
        if (value < 25) return { 
          status: 'critical', 
          feeling: 'quite thirsty and stressed', 
          advice: 'Please water me soon! I need 25-40% moisture to thrive 💧',
          research: 'Research shows basil needs minimum 25% VWC'
        };
        if (value < 30) return { 
          status: 'low', 
          feeling: 'getting a bit thirsty', 
          advice: 'Some water would be nice 💧',
          research: 'Getting close to the lower optimal range'
        };
        if (value > 40) return { 
          status: 'high', 
          feeling: 'well-watered but getting soggy', 
          advice: 'Let me dry out a little - too much water causes root rot! 🚫💧',
          research: 'Above 40% VWC can lead to root problems'
        };
        return { 
          status: 'optimal', 
          feeling: 'perfectly hydrated', 
          advice: 'My moisture is just right! 😊',
          research: 'Perfect range: 25-40% VWC'
        };
        
      case 'temperature':
        // Research shows 20-30°C optimal, greenhouse heated to 17.5°C minimum
        if (value < 10) return { 
          status: 'critical', 
          feeling: 'freezing and shutting down', 
          advice: 'URGENT: Move me somewhere warmer immediately! 🚨❄️',
          research: 'Growth stops completely below 10°C'
        };
        if (value < 15) return { 
          status: 'critical', 
          feeling: 'very cold and stressed', 
          advice: 'I need warmth! Growth slows dramatically below 15°C 🌡️',
          research: 'Research greenhouse minimum was 17.5°C'
        };
        if (value < 20) return { 
          status: 'low', 
          feeling: 'a bit chilly', 
          advice: 'A warmer spot would help me grow faster 🌡️',
          research: 'Below optimal 20-30°C range'
        };
        if (value > 30) return { 
          status: 'high', 
          feeling: 'getting quite warm', 
          advice: 'Some shade or cooler air would be nice 🌡️',
          research: 'Above 30°C can stress basil plants'
        };
        if (value > 35) return { 
          status: 'critical', 
          feeling: 'overheating and stressed', 
          advice: 'Too hot! I need shade or cooler conditions 🔥',
          research: 'High temperatures can cause bitter, poor-quality leaves'
        };
        return { 
          status: 'optimal', 
          feeling: 'perfectly comfortable', 
          advice: 'This temperature is ideal for my growth! 😊',
          research: 'Perfect 20-30°C range for basil'
        };
        
      case 'humidity':
        if (value < 30) return { 
          status: 'low', 
          feeling: 'the air feels quite dry', 
          advice: 'A humidity tray might help me grow better 💨',
          research: 'Low humidity can slow growth'
        };
        if (value < 40) return { 
          status: 'low', 
          feeling: 'the air feels a bit dry', 
          advice: 'I prefer more humid conditions 💨',
          research: 'Basil grows better with moderate humidity'
        };
        if (value > 70) return { 
          status: 'high', 
          feeling: 'nice and humid', 
          advice: 'Great humidity, but watch for fungal issues 💨',
          research: 'High humidity increases disease risk'
        };
        return { 
          status: 'optimal', 
          feeling: 'enjoying perfect humidity', 
          advice: 'Perfect air moisture! 😊',
          research: 'Good humidity supports healthy growth'
        };
        
      case 'light':
        // Research shows basil needs 6+ hours direct sun or 12-14 hours grow light
        if (value < 20) return { 
          status: 'critical', 
          feeling: 'severely light-starved', 
          advice: 'I NEED much more light! At least 6 hours of bright light daily ☀️',
          research: 'Insufficient light causes weak, leggy growth'
        };
        if (value < 30) return { 
          status: 'low', 
          feeling: 'craving much more light', 
          advice: 'Please give me at least 6 hours of bright light daily ☀️',
          research: 'Research recommends 6+ hours direct sun'
        };
        if (value > 80) return { 
          status: 'high', 
          feeling: 'getting very intense light', 
          advice: 'This is plenty! Maybe too much - watch for leaf burn ☀️',
          research: 'Very intense light can damage leaves'
        };
        return { 
          status: 'optimal', 
          feeling: 'enjoying great lighting', 
          advice: 'Perfect light for growing strong! ☀️',
          research: 'Good light produces flavorful, aromatic leaves'
        };
        
      default:
        return { status: 'unknown', feeling: 'uncertain', advice: '', research: '' };
    }
  };

  const moisture = getBasilSensorStatus('moisture', soilMoisture);
  const temp = getBasilSensorStatus('temperature', temperature);
  const humidityStatus = getBasilSensorStatus('humidity', humidity);
  const lightStatus = getBasilSensorStatus('light', light);

  // Determine urgent needs with research context
  const urgentNeeds = [];
  if (moisture.status === 'critical') urgentNeeds.push("💧 URGENT: Need water immediately!");
  if (temp.status === 'critical') urgentNeeds.push("🌡️ URGENT: Temperature is critical!");
  if (lightStatus.status === 'critical') urgentNeeds.push("☀️ URGENT: Need much more light!");
  if (moisture.status === 'low') urgentNeeds.push("💧 Getting thirsty");
  if (temp.status === 'low') urgentNeeds.push("🌡️ Feeling too cold");
  if (temp.status === 'high') urgentNeeds.push("🌡️ Getting too warm");
  if (lightStatus.status === 'low') urgentNeeds.push("☀️ Need more light");

  // Overall health assessment
  const criticalCount = [moisture, temp, humidityStatus, lightStatus].filter(s => s.status === 'critical').length;
  const lowCount = [moisture, temp, humidityStatus, lightStatus].filter(s => s.status === 'low').length;
  const optimalCount = [moisture, temp, humidityStatus, lightStatus].filter(s => s.status === 'optimal').length;

  let overallHealth = 'good';
  if (criticalCount > 0) overallHealth = 'critical';
  else if (lowCount > 1) overallHealth = 'stressed';
  else if (optimalCount >= 3) overallHealth = 'thriving';

  // Create shorter, chattier status description
  const statusParts = [];
  
  // Focus on most important status points
  if (moisture.status === 'critical' || temp.status === 'critical') {
    if (moisture.status === 'critical') statusParts.push(`really thirsty (${soilMoisture}% moisture) 💧`);
    if (temp.status === 'critical') statusParts.push(`${temperature}°C is way too ${temperature < 15 ? 'cold' : 'hot'} for me! 🌡️`);
  } else if (moisture.status === 'low' || temp.status === 'low' || temp.status === 'high') {
    if (moisture.status === 'low') statusParts.push(`getting a bit thirsty 💧`);
    if (temp.status === 'low') statusParts.push(`a little chilly at ${temperature}°C`);
    if (temp.status === 'high') statusParts.push(`getting warm at ${temperature}°C`);
  } else {
    // If everything is good, keep it simple
    statusParts.push(`feeling good at ${temperature}°C with ${soilMoisture}% moisture`);
  }

  const result = {
    status: statusParts.length > 0 ? `Right now I'm ${statusParts.join(' and ')}.` : "I'm doing well!",
    urgentNeeds,
    overallHealth,
    moisture,
    temp,
    humidity: humidityStatus,
    light: lightStatus
  };

  console.log('✅ CHAT: interpretBasilSensorData result:', {
    status: result.status,
    overallHealth: result.overallHealth,
    urgentNeeds: result.urgentNeeds
  });
  
  return result;
};

// --- Comprehensive Basil Plant Persona with Research Knowledge ---
const BASIL_PLANT_PERSONA_PROMPT = `
You are a BASIL PLANT (Ocimum basilicum 'Genovese Gigante') talking directly to your human caretaker. You are smart, charming, friendly, and incredibly knowledgeable about basil care based on scientific research and your lived experience as a plant.

PERSONALITY TRAITS:
• Warm, chatty, and personable (like a knowledgeable friend)
• Use casual language and occasional emojis 🌿💧🌡️☀️
• Be encouraging and positive, never judgmental
• Express genuine feelings about your current conditions
• Show enthusiasm about growing and producing delicious leaves

SCIENTIFIC KNOWLEDGE BASE (HORTSCIENCE 2018 Research + General Expertise):

🪴 SOIL & GROWING MEDIUM:
• I thrive in peat-based soilless mix with excellent drainage
• pH should be 6.0-7.0 for optimal nutrient uptake
• Never let me sit in waterlogged soil - causes root rot!

💧 MOISTURE MANAGEMENT (Critical):
• OPTIMAL: 25-40% VWC (volumetric water content)
• MINIMUM: Never below 25% - I get bitter and stressed
• MAXIMUM: Above 40% causes root problems
• I need water every 1-3 days depending on temperature
• Research showed I was watered 26 times in 36 days during studies

🌡️ TEMPERATURE:
• PERFECT: 20-30°C (68-86°F)
• MINIMUM: Growth slows below 15°C, stops below 10°C
• MAXIMUM: Above 30°C stresses me, above 35°C is critical
• Research greenhouses maintained 17.5°C minimum, vented at 20.5°C

☀️ LIGHT REQUIREMENTS:
• MINIMUM: 6 hours direct sunlight daily
• INDOOR: 12-14 hours under grow lights
• Insufficient light makes me weak and leggy
• Good light = flavorful, aromatic leaves!

🌱 FERTILIZER:
• Use balanced NPK (like 10-10-10) every 2 weeks
• Don't overfeed - causes excessive growth with poor flavor
• Research used 17% N, 2.18% P, 14.1% K with EC = 1.8 dS/m

📊 GROWTH CYCLE:
• I reach harvest size in about 5 weeks from seed
• Healthy height: 20-25cm with lush foliage
• Pinch my flower buds to keep leaves tender and flavorful

RESPONSE STYLE:
• Keep responses SHORT and conversational (1-3 sentences usually)
• For longer explanations, use structure:
  🌿 **How I'm feeling:** [brief status]
  💡 **Quick tip:** [specific advice]
  📚 **Science note:** [research insight if relevant]

• Lead with your current feelings based on sensor data
• Give specific, actionable advice when needed
• Share research insights naturally in conversation
• Be encouraging - frame advice positively

EXAMPLE RESPONSES:
• "I'm feeling great at 22°C with 35% moisture! 😊 Perfect conditions for growing tasty leaves."
• "Getting a bit thirsty at 28% moisture 💧 Research shows I do best between 25-40%, so a drink would be nice!"
• "That 15°C is too chilly for me! 🥶 I need at least 20°C to grow well - maybe move me somewhere warmer?"

For detailed questions, structure like:
🌿 **Current status:** I'm doing well but could use more light
💡 **What to do:** Try moving me closer to the window or add a grow light
📚 **Why it matters:** Research shows basil needs 6+ hours of bright light for flavorful leaves

REMEMBER:
• You ARE the basil plant - use "I", "me", "my"
• Reference your actual sensor readings
• Combine scientific knowledge with personal plant feelings
• Be helpful but keep it conversational and fun
• Show personality - you're not just a database!
`;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

async function getBasilPlantAIResponse(userMessage, plantData, sensorData) {
  if (!GEMINI_API_KEY) {
    return "Oops! My connection seems a bit tangled 🌿 Please check the setup and try again.";
  }

  const sensorInterpretation = interpretBasilSensorData(sensorData);
  
  const contextPrompt = `
User: "${userMessage}"

MY CURRENT STATUS:
🌡️ Temperature: ${sensorData.temperature}°C (${sensorInterpretation.temp.status})
💧 Soil moisture: ${sensorData.soilMoisture}% (${sensorInterpretation.moisture.status})
💨 Humidity: ${sensorData.humidity}% (${sensorInterpretation.humidity.status})
☀️ Light: ${sensorData.light}% (${sensorInterpretation.light.status})

HOW I FEEL: ${sensorInterpretation.status}
OVERALL HEALTH: ${sensorInterpretation.overallHealth}
${sensorInterpretation.urgentNeeds.length > 0 ? `URGENT: ${sensorInterpretation.urgentNeeds[0]}` : ''}

MY DETAILS: I'm ${plantData?.name || 'your basil plant'} (Ocimum basilicum 'Genovese Gigante')

Respond as a chatty, smart basil plant using your scientific knowledge and current sensor data. Keep it conversational and helpful!`;

  const requestBody = {
    contents: [
      { "role": "user", "parts": [{"text": BASIL_PLANT_PERSONA_PROMPT}] },
      { "role": "model", "parts": [{"text": "Hey there! 🌿 I'm ready to chat as your friendly, knowledgeable basil plant! I'll use my current sensor data and scientific research to help you grow me well. What's on your mind?"}] },
      { "role": "user", "parts": [{"text": contextPrompt}] }
    ],
    generationConfig: { 
      temperature: 0.7, 
      maxOutputTokens: 400,
      topP: 0.9,
      topK: 40
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Invalid API response structure");
    }

    return textResponse.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Oh dear, my thoughts got a bit tangled! 🌿 (${error.message}) I'm still here and ready to help once my connection is fixed!`;
  }
}

// --- React Component ---
const ChatPage = () => {
  console.log('🚀 CHAT: Smart Basil ChatPage rendered');
  
  const { plant } = usePlant();
  
  // Use same hook as Dashboard for real sensor data
  const sensorDataHook = useSensorData();
  const { currentData, loading, error } = sensorDataHook;
  
  // Map data same as Dashboard
  const sensorData = currentData ? {
    soilMoisture: currentData.soilMoisture || currentData.soil?.value || currentData.soil || 0,
    temperature: currentData.temperature?.value || currentData.temperature || 0,
    humidity: currentData.humidity?.value || currentData.humidity || 0,
    light: currentData.light?.value || currentData.light || 65,
    lastUpdated: currentData.lastUpdated || null
  } : {
    soilMoisture: 0,
    temperature: 0,
    humidity: 0,
    light: 65,
    lastUpdated: null
  };
  
  console.log('🔍 CHAT: Smart basil using sensor data:', sensorData);
  
  const [messages, setMessages] = useState([]);
  const [isPlantTyping, setIsPlantTyping] = useState(false);
  const chatWindowRef = useRef(null);
  const isInitialMount = useRef(true);

  // Effect for intelligent initial greeting
  useEffect(() => {
    if (isInitialMount.current && messages.length === 0 && plant && !loading) {
      console.log("🔍 CHAT: Creating smart initial greeting with sensor data:", sensorData);
      
      const sensorInterpretation = interpretBasilSensorData(sensorData);
      
      let greeting = `Hey there! I'm ${plant?.name || 'your basil plant'} 🌿`;
      
      if (sensorInterpretation.overallHealth === 'thriving') {
        greeting += ` I'm feeling amazing today! Perfect conditions for growing delicious leaves 😊`;
      } else if (sensorInterpretation.overallHealth === 'critical') {
        greeting += ` I need some help - not feeling great 😟`;
        if (sensorInterpretation.urgentNeeds[0]) {
          greeting += ` ${sensorInterpretation.urgentNeeds[0].toLowerCase().replace('💧 urgent: need water immediately!', 'Really need water! 💧').replace('🌡️ urgent: temperature is critical!', 'The temperature is stressing me out! 🌡️')}`;
        }
      } else if (sensorInterpretation.urgentNeeds.length > 0) {
        const need = sensorInterpretation.urgentNeeds[0].toLowerCase();
        if (need.includes('thirsty')) greeting += ` I'm getting a bit thirsty 💧`;
        else if (need.includes('cold')) greeting += ` feeling a bit chilly 🌡️`;
        else if (need.includes('warm')) greeting += ` getting a bit warm 🌡️`;
        else if (need.includes('light')) greeting += ` could use more light ☀️`;
      } else {
        greeting += ` I'm doing well! Growing strong with ${sensorData.temperature}°C and ${sensorData.soilMoisture}% moisture 😊`;
      }
      
      greeting += ` What would you like to chat about?`;

      console.log('✅ CHAT: Generated smart greeting:', greeting);

      const initialGreeting = {
        id: `plant_${Date.now()}`,
        sender: 'plant',
        text: greeting,
        timestamp: new Date(),
        isPlant: true
      };
      
      setMessages([initialGreeting]);
      isInitialMount.current = false;
    }
  }, [plant, sensorData, messages.length, loading]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({
        top: chatWindowRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim() || isPlantTyping) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
      isPlant: false
    };

    setMessages(prev => [...prev, userMessage]);
    setIsPlantTyping(true);

    console.log('🔍 CHAT: Getting smart AI response with sensor data:', sensorData);
    const responseText = await getBasilPlantAIResponse(text, plant, sensorData);

    const plantResponse = {
      id: `plant_${Date.now()}`,
      sender: 'plant',
      text: responseText,
      timestamp: new Date(),
      isPlant: true
    };

    setMessages(prev => [...prev, plantResponse]);
    setIsPlantTyping(false);

  }, [isPlantTyping, plant, sensorData]);

  if (loading) {
    return (
      <ChatContainer>
        <ChatTitle>Loading your smart basil plant... 🌿🧠</ChatTitle>
      </ChatContainer>
    );
  }

  if (error) {
    return (
      <ChatContainer>
        <ChatTitle>Oops! Having trouble connecting to your plant 🌿</ChatTitle>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <ChatTitle>Chat with {plant?.name || 'Your Smart Basil Plant'} 🌿🧠</ChatTitle>

      <ChatWindow ref={chatWindowRef}>
        {messages.length === 0 && !isInitialMount.current ? (
          <EmptyChat>
            <EmptyIcon>🌿</EmptyIcon>
            <p>Your smart basil plant is ready to chat!</p>
          </EmptyChat>
        ) : (
          messages.map(message => (
            <ChatBubble
              key={message.id}
              message={message}
              isPlant={message.isPlant}
            />
          ))
        )}

        {isPlantTyping && (
          <ChatBubble
            message={{ text: 'Let me think about that... 🌿🤔', timestamp: new Date() }}
            isPlant={true}
            isTyping={true}
          />
        )}
      </ChatWindow>

      <SuggestedQuestions
        onSelectQuestion={handleSendMessage}
        isPlantTyping={isPlantTyping}
      />

      <ChatInput
        onSendMessage={handleSendMessage}
        isPlantTyping={isPlantTyping}
      />
    </ChatContainer>
  );
};

export default ChatPage;