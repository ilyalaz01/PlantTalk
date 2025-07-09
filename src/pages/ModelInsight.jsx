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
        Last Updated: {safeCurrentData.lastUpdated ? new Date(safeCurrentData.lastUpdated).toLocaleTimeString() : 'N/A'}
      </StatItem>
      </Section>

      <h2>Ecological Model Insights</h2>
      <Section>
        <SectionTitle>🌱 Rule-Based Status (Real-Time)</SectionTitle>
        <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '0.5rem' }}>
          Based on recent sensor values using logical thresholds. Can output: <strong>thirsty</strong>, <strong>overwatered</strong>, <strong>healthy</strong>, or <strong>stressed</strong>.
        </p>
        <StatItem>Current Status: <strong>{plantStatus}</strong></StatItem>
        <StatItem style={{ color: '#555', fontStyle: 'italic' }}>
          Reason: Based on{' '}
          {safeEnvironmentalHealth.moisture === 'low' ? 'low moisture' :
          safeEnvironmentalHealth.temperature === 'low' ? 'low temperature' :
          safeEnvironmentalHealth.temperature === 'high' ? 'high temperature' :
          safeEnvironmentalHealth.moisture === 'high' ? 'high moisture' :
          'balanced conditions'}.
        </StatItem>
        <StatItem>Estimated Days Until Water Needed: <strong>{daysUntilWaterNeeded}</strong></StatItem>
        <StatItem>Moisture Depletion Rate: <strong>{moistureDepletionRate.toFixed(2)} %/day</strong></StatItem>
        <small>Powered by: Mechanistic evapotranspiration + rule-based thresholds</small>
      </Section>

      <Section>
        <SectionTitle>🌿 ML Model Diagnosis (Last Snapshot)</SectionTitle>
        <p style={{ fontStyle: 'italic', color: '#666', marginBottom: '0.5rem' }}>
          Based on PCA-transformed data and a trained decision tree. Uses same labels: <strong>thirsty</strong>, <strong>overwatered</strong>, <strong>healthy</strong>, or <strong>stressed</strong>.
        </p>
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
        <small>Powered by: PCA dimensionality reduction + decision tree classifier</small>
      </Section>
      <Section>
        <SectionTitle>🔍 What Influenced the ML Diagnosis?</SectionTitle>
        <StatItem>
          The model compares your plant’s data with past healthy and stressed examples.
          These factors had the most impact today:
        </StatItem>

        <StatList style={{ marginTop: '0.5rem' }}>
          <StatItem>• <strong>Humidity</strong> — key contributor to PC1 (air moisture stress)</StatItem>
          <StatItem>• <strong>Temperature</strong> — strongly affects PC1 (heat or cold stress)</StatItem>
          <StatItem>• <strong>Moisture</strong> — major factor in PC2 and PC3 (soil water level)</StatItem>
          <StatItem>• <strong>Time of Day</strong> — influences plant behavior over time</StatItem>
        </StatList>

        <StatItem style={{ marginTop: '1rem' }}>
          Your plant's data is placed in this space to estimate its condition:
        </StatItem>

        <img
          src="3d_pca_biplot.png"
          alt="PCA cluster plot with your plant marked"
          style={{ width: '100%', borderRadius: '8px', marginTop: '12px' }}
        />
      </Section>
      <Section>
        <SectionTitle>📊 Deeper Look at Sensor Relationships</SectionTitle>
        <StatItem>
          The following charts help explain how your plant's data relates to typical patterns:
        </StatItem>

        <div style={{ marginTop: '1rem' }}>
          <strong>🔷 PCA Contributions:</strong>
          <StatItem>
            Shows how much each sensor influences the model's decision along the top 3 PCA directions.
          </StatItem>
          <img
            src="variable contribution to pca.png"
            alt="PCA variable contribution heatmap"
            style={{ width: '100%', borderRadius: '8px', marginTop: '12px' }}
          />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <strong>🔶 Sensor Correlations:</strong>
          <StatItem>
            Shows how different environmental conditions affect each other (e.g., humidity vs. temperature).
          </StatItem>
          <img
            src="correlation_matrix_sensor_data.png"
            alt="Sensor data correlation heatmap"
            style={{ width: '100%', borderRadius: '8px', marginTop: '12px' }}
          />
        </div>
      </Section>

    </InsightsContainer>
  );
};

export default ModelInsights;