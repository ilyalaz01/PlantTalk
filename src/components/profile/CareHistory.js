// src/components/profile/CareHistory.js
import React from 'react';
import styled from 'styled-components';
import { usePlant } from '../../contexts/PlantContext';
import { useSensor } from '../../contexts/SensorContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HistoryContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const HistoryTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ active, theme }) => 
    active ? theme.typography.fontWeight.semiBold : theme.typography.fontWeight.regular};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.text.secondary};
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primary : 'transparent'};
    transition: background-color ${({ theme }) => theme.transitions.short};
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActivityLogContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const ActivityLogTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ActivityList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ActivityItem = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-right: ${({ theme }) => theme.spacing.md};
`;

const ActivityDetails = styled.div`
  flex: 1;
`;

const ActivityType = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ActivityDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const CareHistory = () => {
  const [activeTab, setActiveTab] = React.useState('moisture');
  const { plant } = usePlant();
  const { sensorHistory } = useSensor();
  
  // Format date for chart display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Format full date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format chart data
  const getChartData = () => {
    return sensorHistory.map(record => ({
      date: formatDate(record.timestamp),
      moisture: record.soilMoisture,
      temperature: record.temperature,
      humidity: record.humidity,
      light: record.light,
      // Add watering events as markers
      watered: getWateredValue(record.timestamp)
    }));
  };
  
  // Check if plant was watered on a specific date
  const getWateredValue = (date) => {
    const wasWatered = plant.careHistory.some(event => 
      event.action === 'watered' && 
      new Date(event.date).toDateString() === new Date(date).toDateString()
    );
    
    return wasWatered ? 100 : null; // Return 100 (top of chart) if watered
  };
  
  // Get appropriate icon for action type
  const getActionIcon = (action) => {
    switch (action) {
      case 'watered':
        return '💧';
      case 'misted':
        return '💦';
      case 'fertilized':
        return '🌱';
      case 'moved':
        return '🔄';
      case 'pruned':
        return '✂️';
      case 'checked':
        return '👀';
      default:
        return '🌿';
    }
  };
  
  // Capitalize first letter of action
  const formatAction = (action) => {
    return action.charAt(0).toUpperCase() + action.slice(1);
  };
  
  const chartData = getChartData();
  
  return (
    <HistoryContainer>
      <HistoryTitle>Care History</HistoryTitle>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'moisture'} 
          onClick={() => setActiveTab('moisture')}
        >
          Soil Moisture
        </Tab>
        <Tab 
          active={activeTab === 'temperature'} 
          onClick={() => setActiveTab('temperature')}
        >
          Temperature
        </Tab>
        <Tab 
          active={activeTab === 'humidity'} 
          onClick={() => setActiveTab('humidity')}
        >
          Humidity
        </Tab>
        <Tab 
          active={activeTab === 'light'} 
          onClick={() => setActiveTab('light')}
        >
          Light
        </Tab>
      </TabsContainer>
      
      <ChartContainer>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              
              {activeTab === 'moisture' && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="moisture" 
                    name="Soil Moisture (%)" 
                    stroke="#4CAF50" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="watered" 
                    name="Watered" 
                    stroke="#2196F3" 
                    strokeWidth={0} 
                    dot={{ r: 6, strokeWidth: 2, stroke: '#2196F3', fill: 'white' }}
                  />
                </>
              )}
              
              {activeTab === 'temperature' && (
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  name="Temperature (°F)" 
                  stroke="#F44336" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              )}
              
              {activeTab === 'humidity' && (
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  name="Humidity (%)" 
                  stroke="#2196F3" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              )}
              
              {activeTab === 'light' && (
                <Line 
                  type="monotone" 
                  dataKey="light" 
                  name="Light Level (%)" 
                  stroke="#FFC107" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <NoDataMessage>No historical data available yet.</NoDataMessage>
        )}
      </ChartContainer>
      
      <ActivityLogContainer>
        <ActivityLogTitle>Recent Care Activities</ActivityLogTitle>
        
        <ActivityList>
          {plant.careHistory.length > 0 ? (
            plant.careHistory.slice(0, 5).map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityIcon>
                  {getActionIcon(activity.action)}
                </ActivityIcon>
                <ActivityDetails>
                  <ActivityType>{formatAction(activity.action)}</ActivityType>
                  <ActivityDate>{formatDateTime(activity.date)}</ActivityDate>
                </ActivityDetails>
              </ActivityItem>
            ))
          ) : (
            <NoDataMessage>No care activities recorded yet.</NoDataMessage>
          )}
        </ActivityList>
      </ActivityLogContainer>
    </HistoryContainer>
  );
};

export default CareHistory;