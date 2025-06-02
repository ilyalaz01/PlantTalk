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

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.error || '#e74c3c'};
  background: ${({ theme }) => theme.colors.errorBackground || '#fdf2f2'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const ModelInsights = () => {
  const sensorDataHook = useSensorData();
  const { currentData, fetchHistory, historicalData, loading, error } = sensorDataHook;

  useEffect(() => {
    fetchHistory(7);
  }, []);

  // Safe data access with fallbacks
  const safeCurrentData = currentData || {};
  const safeHistoricalData = historicalData || [];

  const ecologicalModel = useEcologicalModel(sensorDataHook);
  const {
    plantStatus = 'Unknown',
    environmentalHealth = {},
    moistureDepletionRate = 0,
    daysUntilWaterNeeded = 'Unknown',
    careRecommendations = []
  } = ecologicalModel || {};

  const { prediction, pcaInfo } = useModelPrediction(currentData);

  // Safe environmental health access
  const safeEnvironmentalHealth = {
    moisture: environmentalHealth?.moisture || 'N/A',
    temperature: environmentalHealth?.temperature || 'N/A',
    humidity: environmentalHealth?.humidity || 'N/A',
    light: environmentalHealth?.light || 'N/A'
  };

  return (
    <InsightsContainer>
      {/* Show loading state */}
      {loading && (
        <LoadingMessage>
          Loading sensor data...
        </LoadingMessage>
      )}

      {/* Show error state */}
      {error && (
        <ErrorMessage>
          Error loading data: {error.message || 'Unknown error occurred'}
        </ErrorMessage>
      )}

      <Section>
        <SectionTitle>🧪 Care Recommendations</SectionTitle>
        {careRecommendations.length > 0 ? (
          careRecommendations.map((rec, index) => (
            <RecommendationCard key={index}>
              <p><strong>{(rec.type || 'General').toUpperCase()}</strong>: {rec.text || 'No recommendation available'}</p>
              {rec.timing && <p><em>Timing:</em> {rec.timing}</p>}
              {rec.priority && <p><em>Priority:</em> {rec.priority}</p>}
            </RecommendationCard>
          ))
        ) : (
          <LoadingMessage>No care recommendations available</LoadingMessage>
        )}
      </Section>

      <Section>
        <SectionTitle>🌡️ Environmental Summary & Care</SectionTitle>
        <StatList>
          <StatItem>
            Soil Moisture: {safeCurrentData.soilMoisture ?? 'N/A'}% ({safeEnvironmentalHealth.moisture})
          </StatItem>
          <StatItem>
            Temperature: {safeCurrentData.temperature ?? 'N/A'}°C ({safeEnvironmentalHealth.temperature})
          </StatItem>
          <StatItem>
            Humidity: {safeCurrentData.humidity ?? 'N/A'}% ({safeEnvironmentalHealth.humidity})
          </StatItem>
          <StatItem>
            Light: {safeCurrentData.light ?? 'N/A'} ({safeEnvironmentalHealth.light})
          </StatItem>
        </StatList>
        <StatItem>
          Last Updated: {safeCurrentData.lastUpdated?.toLocaleTimeString() ?? 'N/A'}
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
              PCA Components: {pcaInfo.components?.map((val, i) => (
                <span key={i}><strong>PC{i+1}:</strong> {val.toFixed(2)} </span>
              )) || 'N/A'}
            </StatItem>
            <StatItem>
              Explained Variance: {pcaInfo.explainedVariance?.map((v, i) => (
                <span key={i}><strong>PC{i+1}:</strong> {(v * 100).toFixed(1)}% </span>
              )) || 'N/A'}
            </StatItem>
          </>
        )}
        <small>Powered by: PCA + Decision Tree Model</small>
      </Section>

      <Section>
        <SectionTitle>📉 Soil Moisture Trend</SectionTitle>
        {safeHistoricalData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={safeHistoricalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(str) => {
                  try {
                    return new Date(str).toLocaleDateString();
                  } catch {
                    return str;
                  }
                }}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="soilMoisture" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <LoadingMessage>
            {loading ? 'Loading historical data...' : 'No historical data available.'}
          </LoadingMessage>
        )}
      </Section>
    </InsightsContainer>
  );
};

export default ModelInsights;