// src/hooks/useModelPrediction.js
import { useEffect, useState } from 'react';

const MODEL_API_URL = "https://basil-pca-api-1.onrender.com/predict"; // replace with your real URL

const useModelPrediction = (sensorData) => {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (!sensorData) return;

    const { soilMoisture, temperature, humidity, lastUpdated } = sensorData;

    const hour = new Date(lastUpdated).getHours();
    const timeOfDay = hour >= 6 && hour < 12 ? 0 : hour >= 12 && hour < 18 ? 1 : 2;

    const payload = {
      soilMoisture,
      temperature,
      humidity,
      timeOfDay
    };

    const fetchPrediction = async () => {
      try {
        const response = await fetch(MODEL_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        setPrediction(data.status);
      } catch (error) {
        console.error("Prediction error:", error);
      }
    };

    fetchPrediction();
  }, [sensorData]);

  return prediction;
};

export default useModelPrediction;
