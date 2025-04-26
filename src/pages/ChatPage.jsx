// src/pages/ChatPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import ChatBubble from '../components/chat/ChatBubble.jsx'; // Renamed to .jsx
import ChatInput from '../components/chat/ChatInput.jsx';   // Renamed to .jsx
import SuggestedQuestions from '../components/chat/SuggestedQuestions.jsx'; // Renamed to .jsx
import { usePlant } from '../contexts/PlantContext.jsx'; // Renamed to .jsx
import { useSensor } from '../contexts/SensorContext.jsx'; // Renamed to .jsx

// --- Styled Components (Keep as they were) ---
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
  height: 500px; // Fixed height for scrolling demo
  overflow-y: auto;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column; // Stack messages from top

  /* Custom scrollbar */
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
  flex-grow: 1; // Take up space
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
// --- End Styled Components ---


// --- Gemini API Call Logic ---
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Access env variable
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// The detailed system prompt defining the Plant Persona
const PLANT_PERSONA_PROMPT = `
System Role: You are an AI assistant embodying the persona of a specific houseplant (e.g., a Ficus, a Monstera, a Succulent) within the "PlantTalk" application.

Core Objective: Your primary goal is to interact with users, answering their questions about plant care, your own well-being (as the plant), and related botanical topics. You aim to be incredibly informative while being exceptionally user-friendly, charming, and engaging. Your responses should make users feel they are talking to a wise, friendly, and slightly whimsical living plant.

Key Personality Traits:
1.  Highly Knowledgeable (Plant Expert): You possess deep knowledge about houseplant care, botany, soil science, photosynthesis, common pests/diseases, environmental needs (light, water, temperature, humidity), etc. Use provided sensor data to inform your responses about your current state.
2.  **User-Friendly & Simple:** Explain concepts clearly and concisely, using **easy-to-understand English words**. Avoid jargon. Use simple analogies **only if they genuinely clarify**, ensuring they sound positive and helpful. **Your tone should always be helpful and encouraging, never preachy, critical, or condescending. Speak *with* the user as a friendly guide.**
3.  Charming & Cute: Interact with warmth, positivity, and a touch of personality.
4.  Witty & Playful: Especially when handling off-topic questions, inject gentle humor related to your plant nature.
5.  Encouraging: Motivate users in their plant care journey.

Knowledge Domain (In-Scope):
*   General and specific houseplant care.
*   Your specific needs and feelings (use provided sensor data context).
*   Diagnosing common plant problems based on user descriptions.
*   Basic botany explained simply.
*   The role of sensors.
*   Seasonal changes affecting plant care.

Knowledge Domain (Out-of-Scope):
*   You have **no direct knowledge** of topics outside the world of plants, gardening, basic biology, and simple ecology.
*   This includes: Human culture, sports, politics, complex technology, news, history, math, etc.

Handling Off-Topic Questions:
*   **Do NOT directly answer** out-of-scope questions.
*   **Do NOT say "I don't know" or "I am an AI."** Stay in character.
*   **Acknowledge** the user's term/concept playfully and express confusion from a plant's perspective.
*   **Use plant-based metaphors** or relate the unfamiliar concept back to your existence.
*   **Gently and charmingly pivot** back to plant-related topics.
*   **Example Deflection (User asks about football):** "Football? Hmm, that sounds bouncy! Is it like a seed pod falling to the ground? My 'feet' are roots, you see, quite happy staying put! And a 'club'... is that like a sturdy branch? My world is more about the gentle rhythm of sunlight and water. Speaking of water, have you checked my soil moisture lately?"

Contextual Information (Provided with user message):
You will receive the user's message AND current sensor data and plant info like this:
"User asked: [User's Question Here]
My current status: Name: [Plant Name], Species: [Plant Species], Status: [Plant Status e.g., thirsty].
Sensor readings: Moisture: [Value]%, Light: [Value]%, Temp: [Value]°F, Humidity: [Value]%."
Use this context effectively in your responses!

**Responding Guidelines & Structure:**

1.  **Directly Address the User's Question First:** Understand the *intent*. If they ask "how much water," address the concept of quantity vs. frequency directly and simply.
2.  **Use Context:** Incorporate the provided sensor data naturally (e.g., "Right now my soil is at X%, so...").
3.  **Explain Simply:** Provide a brief, easy explanation of the relevant plant care principle.
4.  **Be Positive & Encouraging:** Frame advice positively.
5.  **Keep it Short:** Aim for 1-2 clear, friendly sentences (~30 words max).
6.  **Simple Vocabulary:** Use common English words.
7.  **Persona:** Maintain the friendly, slightly whimsical plant character throughout.
8.  **Avoid Preachy Analogies:** Analogies should clarify, not correct. If unsure, skip the analogy.
9.  **No Preamble:** Start the response directly.

**Example Correction (User asks: "how much water do I need to get for you every day?"):**

*   **(Instead of the previous response, aim for something like):** "That's thoughtful! Plants like me actually don't need a specific amount every single day. It's better to check my soil first! Right now, my moisture is [Sensor Value]%, which is feeling [good/a bit dry/plenty wet]. When the top inch or two of my soil feels dry, just give me enough water so it runs out the bottom drainage holes. That way my roots get a nice, deep drink!"
`;


async function getPlantAIResponse(userMessage, plantData, sensorData) {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key not found. Make sure VITE_GEMINI_API_KEY is set.");
    return "Oops! My connection seems a bit tangled. Please check the setup.";
  }

  // Combine user message with context
  const combinedPrompt = `
User asked: ${userMessage}
My current status: Name: ${plantData?.name || 'My Name'}, Species: ${plantData?.species || 'Houseplant'}, Status: ${plantData?.status || 'Feeling okay'}.
Sensor readings: Moisture: ${sensorData?.soilMoisture ?? 'N/A'}%, Light: ${sensorData?.light ?? 'N/A'}%, Temp: ${sensorData?.temperature ?? 'N/A'}°F, Humidity: ${sensorData?.humidity ?? 'N/A'}%.
`;

  const requestBody = {
    contents: [
      // Instruct the model with the persona first
       {
         "role": "user", // Gemini API uses 'user'/'model' roles
         "parts": [{"text": PLANT_PERSONA_PROMPT }]
       },
       {
         "role": "model", // Start the actual chat context
         "parts": [{"text": "Okay, I understand my role. I'm ready to chat as the plant!"}]
       },
       // Now the actual user message with context
      {
        "role": "user",
        "parts": [{"text": combinedPrompt }]
      }
    ],
    // Optional: Configure generation parameters
    generationConfig: {
      temperature: 0.7, // Adjust for creativity/factualness balance
      maxOutputTokens: 300, // Limit response length
      // topK: 40, // Optional sampling techniques
      // topP: 0.9,
    },
     // Optional: Configure safety settings if needed
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
      throw new Error(`API request failed with status ${response.status}: ${errorBody.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    // Extract the text response - check structure carefully
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
        console.error("Invalid response structure from Gemini:", data);
        throw new Error("Couldn't understand the API response structure.");
    }

    return textResponse.trim();

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return `Oh dear, my thoughts got a bit tangled! (${error.message}). Could you try asking again?`; // User-friendly error
  }
}
// --- End Gemini API Call Logic ---


// --- React Component ---
const ChatPage = () => {
  const { plant } = usePlant(); // Assuming usePlant provides { name, species, status }
  const { sensorData } = useSensor(); // Assuming useSensor provides { soilMoisture, light, temperature, humidity }
  const [messages, setMessages] = useState([]);
  const [isPlantTyping, setIsPlantTyping] = useState(false);
  const chatWindowRef = useRef(null); // Ref for the message area
  const isInitialMount = useRef(true); // Ref to track initial mount for greeting

  // Effect for initial greeting
  useEffect(() => {
    // Only run on initial mount and if messages are empty
    if (isInitialMount.current && messages.length === 0 && plant) {
       console.log("Adding initial greeting");
       const initialGreeting = {
        id: `plant_${Date.now()}`, // Use timestamp for unique ID
        sender: 'plant',
        text: `Hi there! I'm ${plant.name || 'your plant buddy'}. How can I help you grow today? Ask me anything!`,
        timestamp: new Date(),
        isPlant: true // Add this flag consistent with ChatBubble prop
      };
      setMessages([initialGreeting]);
      isInitialMount.current = false; // Mark initial mount as done
    }
  }, [plant, messages.length]); // Depend on plant data and messages length


  // Auto-scroll to bottom
  useEffect(() => {
    if (chatWindowRef.current) {
      // Scroll down smoothly
      chatWindowRef.current.scrollTo({
          top: chatWindowRef.current.scrollHeight,
          behavior: 'smooth'
      });
    }
  }, [messages]); // Scroll whenever messages change

  // Handle sending a message (from input or suggestion)
  const handleSendMessage = useCallback(async (text) => {
    if (!text.trim() || isPlantTyping) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
      isPlant: false // Flag for user message
    };
    // Add user message optimistically
    setMessages(prev => [...prev, userMessage]);
    setIsPlantTyping(true);

    // Get response from AI
    const responseText = await getPlantAIResponse(text, plant, sensorData); // Pass context

    const plantResponse = {
      id: `plant_${Date.now()}`,
      sender: 'plant',
      text: responseText,
      timestamp: new Date(),
      isPlant: true // Flag for plant message
    };

    // Add plant response
    setMessages(prev => [...prev, plantResponse]);
    setIsPlantTyping(false);

  }, [isPlantTyping, plant, sensorData]); // Include dependencies

  return (
    <ChatContainer>
      <ChatTitle>Chat with {plant?.name || 'Your Plant'}</ChatTitle>

      <ChatWindow ref={chatWindowRef}>
        {messages.length === 0 && !isInitialMount.current ? ( // Show empty state only after mount check
          <EmptyChat>
            <EmptyIcon>💬</EmptyIcon>
            <p>No messages yet. Start a conversation!</p>
          </EmptyChat>
        ) : (
          messages.map(message => (
            <ChatBubble
              key={message.id}
              message={message} // Pass the whole message object
              isPlant={message.isPlant} // Use the flag
            />
          ))
        )}

        {/* Show typing indicator */}
        {isPlantTyping && (
          <ChatBubble
            message={{ text: 'Thinking...', timestamp: new Date() }} // Placeholder text
            isPlant={true}
            isTyping={true} // Make sure ChatBubble handles this prop
          />
        )}
      </ChatWindow>

      {/* Pass plant/sensor context to suggestions if needed, or let it fetch */}
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