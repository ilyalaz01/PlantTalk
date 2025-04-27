// src/pages/ModelInsights.jsx
import React from 'react';
import styled from 'styled-components';
import useEcologicalModel from '../hooks/useEcologicalModel';

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
  const {
    plantStatus,
    environmentalHealth,
    moistureDepletionRate,
    daysUntilWaterNeeded,
    careRecommendations
  } = useEcologicalModel();

  return (
    <InsightsContainer>
      <h2>Ecological Model Insights</h2>

      <Section>
        <SectionTitle>🌿 Plant Status</SectionTitle>
        <StatItem>Current Status: <strong>{plantStatus}</strong></StatItem>
        <StatItem>Estimated Days Until Water Needed: <strong>{daysUntilWaterNeeded}</strong></StatItem>
        <StatItem>Moisture Depletion Rate: <strong>{moistureDepletionRate.toFixed(2)} %/day</strong></StatItem>
      </Section>

      <Section>
        <SectionTitle>🌱 Environmental Health</SectionTitle>
        <StatList>
          <StatItem>Moisture: {environmentalHealth.moisture}</StatItem>
          <StatItem>Temperature: {environmentalHealth.temperature}</StatItem>
          <StatItem>Humidity: {environmentalHealth.humidity}</StatItem>
          <StatItem>Light: {environmentalHealth.light}</StatItem>
        </StatList>
      </Section>

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
    </InsightsContainer>
  );
};

export default ModelInsights;
