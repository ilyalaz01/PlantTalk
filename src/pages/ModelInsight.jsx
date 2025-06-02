// src/pages/ModelInsights.jsx
import styled from 'styled-components';
import useEcologicalModel from '../hooks/useEcologicalModel';
import useSensorData from '../hooks/useSensorData';
import useModelPrediction from '../hooks/useModelPrediction';
import {
  LineChart,
  Line,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import React, { useEffect } from 'react';

const InsightsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StatItem = styled.li`
  padding: ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RecommendationCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const ModelInsights = () => {
const sensorDataHook = useSensorData();
const { currentData, fetchHistory, historicalData } = sensorDataHook;

useEffect(() => {
  fetchHistory(7);
}, []);
  const ecologicalModel = useEcologicalModel(sensorDataHook);
  const {plantStatus,
    environmentalHealth,
    moistureDepletionRate,
    daysUntilWaterNeeded,
    careRecommendations } = ecologicalModel;
  const { prediction, pcaInfo } = useModelPrediction(currentData);

  return (
    <InsightsContainer>
      <Section>
        <SectionTitle>🧪 Care Recommendations</SectionTitle>
        {careRecommendations.map((rec, index) => (
          <RecommendationCard key={index}>
            <p><strong>{rec.type.toUpperCase()}</strong>: {rec.text}</p>
            {rec.timing && <p><em>Timing:</em> {rec.timing}</p>}
            {rec.priority && <p><em>Priority:</em> {rec.priority}</p>}
          </RecommendationCard>
        ))}
      </Section>
      <Section>
        <SectionTitle>🌡️ Environmental Summary & Care</SectionTitle>
        <StatList>
          <StatItem>Soil Moisture: {currentData?.soilMoisture}% ({environmentalHealth.moisture})</StatItem>
          <StatItem>Temperature: {currentData?.temperature}°C ({environmentalHealth.temperature})</StatItem>
          <StatItem>Humidity: {currentData?.humidity}% ({environmentalHealth.humidity})</StatItem>
          <StatItem>Light: {currentData?.light ?? 'N/A'} ({environmentalHealth.light})</StatItem>
        </StatList>
        <StatItem>
        Last Updated: {currentData?.lastUpdated?.toLocaleTimeString() ?? 'N/A'}
      </StatItem>
      </Section>
      <h2>Ecological Model Insights</h2>
      <Section>
        <SectionTitle>🌱 Plant Status</SectionTitle>
        <StatItem>Current Status: <strong>{plantStatus}</strong></StatItem>
        <StatItem>Estimated Days Until Water Needed: <strong>{daysUntilWaterNeeded}</strong></StatItem>
        <StatItem>Moisture Depletion Rate: <strong>{moistureDepletionRate.toFixed(2)} %/day</strong></StatItem>
        <small>Powered by: Combined Mechanistic & Rule-Based Models</small>
      </Section>
      <Section>
        <SectionTitle>🌿 Model Diagnosis</SectionTitle>
        <StatItem>
          Diagnosis: <strong>{prediction || 'Loading...'}</strong>
          
        </StatItem>
        {pcaInfo && (
          <>
           <StatItem>
              PCA Components: {pcaInfo.components.map((val, i) => (
                <span key={i}><strong>PC{i+1}:</strong> {val.toFixed(2)} </span>
                
              ))}
              
            </StatItem>
            <StatItem>
              Explained Variance: {pcaInfo.explainedVariance.map((v, i) => (
                <span key={i}><strong>PC{i+1}:</strong> {(v * 100).toFixed(1)}% </span>
              ))}
            </StatItem>
          </>
        )}
        <small>Powered by: PCA + Decision Tree Model</small>
      </Section>
      <Section>
      <SectionTitle>📉 Soil Moisture Trend </SectionTitle>
      {sensorDataHook.historicalData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={sensorDataHook.historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(str) => new Date(str).toLocaleDateString()}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="soilMoisture" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No historical data available.</p>
      )}
    </Section>
    </InsightsContainer>
  );
};

export default ModelInsights;
