// src/hooks/useModelPrediction.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const MODEL_API_URL = `${import.meta.env.VITE_API_URL}/predict`; // use relative URL if using Vercel + FastAPI proxying

const useModelPrediction = (sensorData) => {
  const [prediction, setPrediction] = useState(null);
  const [pcaInfo, setPcaInfo] = useState(null); // optional if you want PCA outputs

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
        const response = await axios.post(MODEL_API_URL, payload);

        if (!response?.data || !response.data.status) {
          throw new Error("Prediction response malformed");
        }

        setPrediction(response.data.status);
        setPcaInfo({
          components: response.data.pca_components,
          explainedVariance: response.data.explained_variance
        });
      } catch (error) {
        console.error("Prediction error:", error);
        setPrediction('Unavailable');
        setPcaInfo(null);
      }
    };

    fetchPrediction();
  }, [sensorData]);

  return { prediction, pcaInfo }; // now returns both status and PCA details
};

export default useModelPrediction;