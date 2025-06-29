// src/components/profile/CareHistory.jsx - Complete with Smart Activity Detection
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import useSensorData from '../../hooks/useSensorData';
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

const StreakInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const StreakTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StreakStats = styled.div`
  display: flex;
  justify-content: space-around;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StreakStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StreakNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const StreakLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.colors.primary}20;
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NoDataContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px dashed ${({ theme }) => theme.colors.text.secondary}40;
`;

const NoDataIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NoDataTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const NoDataText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const HelpButton = styled.button`
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary}40;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
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

const ActivityNotes = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-style: italic;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: rgba(244, 67, 54, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid rgba(244, 67, 54, 0.2);
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.status.danger};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const ErrorText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const RetryButton = styled.button`
  background: ${({ theme }) => theme.colors.status.danger};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    opacity: 0.9;
  }
`;

const CareHistory = () => {
  const [activeTab, setActiveTab] = useState('moisture');
  const [detectedActivities, setDetectedActivities] = useState([]);
  const { plant, user } = useAuth();
  
  // Use real sensor data hook
  const sensorDataHook = useSensorData();
  const { currentData, fetchHistory, historicalData, loading, error } = sensorDataHook;

  useEffect(() => {
    fetchHistory(7); // Fetch 7 days of historical data
  }, []);

  // Safe data access with fallbacks
  const safeHistoricalData = historicalData || [];
  const safeCareHistory = plant?.careHistory || [];
  
  // Smart activity detection
  const detectSmartActivities = () => {
    console.log('🤖 Running smart activity detection...');
    
    if (!safeHistoricalData || safeHistoricalData.length < 2) return;
    
    const sortedData = [...safeHistoricalData].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    const activities = [];
    
    // 1. WATERING DETECTION (5%+ moisture increase in 1 hour)
    for (let i = 1; i < sortedData.length; i++) {
      const current = sortedData[i];
      const previous = sortedData[i - 1];
      
      const timeDiff = new Date(current.timestamp) - new Date(previous.timestamp);
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      // Check measurements within 2 hours
      if (hoursDiff <= 2) {
        const moistureIncrease = current.soilMoisture - previous.soilMoisture;
        
        // Detect watering: 5%+ increase
        if (moistureIncrease >= 5) {
          activities.push({
            type: 'watering_detected',
            timestamp: current.timestamp,
            details: {
              increase: moistureIncrease.toFixed(1),
              before: previous.soilMoisture,
              after: current.soilMoisture
            },
            severity: 'positive'
          });
        }
      }
    }
    
    // 2. TEMPERATURE STRESS DETECTION (Basil optimal: 20-30°C)
    sortedData.forEach(record => {
      const temp = record.temperature;
      
      if (temp < 10) {
        activities.push({
          type: 'cold_stress',
          timestamp: record.timestamp,
          details: { temperature: temp },
          severity: 'danger'
        });
      } else if (temp > 35) {
        activities.push({
          type: 'heat_stress',
          timestamp: record.timestamp,
          details: { temperature: temp },
          severity: 'danger'
        });
      } else if (temp < 20 || temp > 30) {
        activities.push({
          type: 'temp_suboptimal',
          timestamp: record.timestamp,
          details: { temperature: temp },
          severity: 'warning'
        });
      }
    });
    
    // 3. DRY SOIL ALERTS (Basil drought stress <25%, dry <30%)
    sortedData.forEach(record => {
      const moisture = record.soilMoisture;
      
      if (moisture < 25) {
        activities.push({
          type: 'drought_stress',
          timestamp: record.timestamp,
          details: { moisture },
          severity: 'danger'
        });
      } else if (moisture < 30) {
        activities.push({
          type: 'soil_dry',
          timestamp: record.timestamp,
          details: { moisture },
          severity: 'warning'
        });
      }
    });
    
    // 4. OVERWATERING WARNING (Root rot risk >75%)
    sortedData.forEach(record => {
      const moisture = record.soilMoisture;
      
      if (moisture > 75) {
        activities.push({
          type: 'overwatered',
          timestamp: record.timestamp,
          details: { moisture },
          severity: 'warning'
        });
      }
    });
    
    // Add manual care activities from plant history
    const manualActivities = safeCareHistory.map(activity => ({
      type: activity.action,
      timestamp: activity.timestamp?.toDate ? activity.timestamp.toDate() : new Date(activity.date),
      details: { notes: activity.notes },
      severity: 'manual'
    }));
    
    // Combine, sort, and limit to last 10 activities
    const allActivities = [...activities, ...manualActivities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
    
    // Remove duplicate stress alerts within 3 hours
    const uniqueActivities = [];
    allActivities.forEach(activity => {
      const isDuplicate = uniqueActivities.some(existing => 
        existing.type === activity.type &&
        Math.abs(new Date(existing.timestamp) - new Date(activity.timestamp)) < 3 * 60 * 60 * 1000
      );
      
      if (!isDuplicate) {
        uniqueActivities.push(activity);
      }
    });
    
    setDetectedActivities(uniqueActivities.slice(0, 8));
    console.log('🤖 Detected activities:', uniqueActivities.length);
  };

  // Run smart detection when data changes
  useEffect(() => {
    if (safeHistoricalData && safeHistoricalData.length > 0) {
      detectSmartActivities();
    }
  }, [safeHistoricalData, safeCareHistory]);
  
  // Determine the state of sensor data
  const hasHistoricalData = safeHistoricalData.length > 0;
  const isNewUser = !plant?.createdAt || (Date.now() - new Date(plant.createdAt.toDate ? plant.createdAt.toDate() : plant.createdAt).getTime()) < 24 * 60 * 60 * 1000; // Less than 1 day old
  
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
  
  // Format chart data using real historical data
  const getChartData = () => {
    return safeHistoricalData.map(record => ({
      date: formatDate(record.timestamp),
      moisture: record.soilMoisture,
      temperature: record.temperature,
      humidity: record.humidity,
      light: record.light || 65,
      watered: getWateredValue(record.timestamp)
    }));
  };
  
  // Check if plant was watered on a specific date
  const getWateredValue = (date) => {
    const wasWatered = safeCareHistory.some(event => 
      event.action === 'watered' && 
      new Date(event.timestamp ? event.timestamp.toDate() : event.date).toDateString() === new Date(date).toDateString()
    );
    
    return wasWatered ? 100 : null;
  };
  
  // Get smart activity display info
  const getSmartActivityDisplay = (activity) => {
    switch (activity.type) {
      case 'watering_detected':
        return {
          icon: '💧',
          title: 'Watering Detected',
          description: `Soil moisture increased by ${activity.details.increase}% (${activity.details.before}% → ${activity.details.after}%)`,
          color: '#2196F3'
        };
      
      case 'cold_stress':
        return {
          icon: '🥶',
          title: 'Cold Stress Alert',
          description: `Too cold: ${activity.details.temperature}°C (Basil needs >10°C)`,
          color: '#9C27B0'
        };
      
      case 'heat_stress':
        return {
          icon: '🔥',
          title: 'Heat Stress Alert',
          description: `Too hot: ${activity.details.temperature}°C (Basil needs <35°C)`,
          color: '#F44336'
        };
      
      case 'temp_suboptimal':
        return {
          icon: '🌡️',
          title: 'Temperature Warning',
          description: `Suboptimal: ${activity.details.temperature}°C (Basil prefers 20-30°C)`,
          color: '#FF9800'
        };
      
      case 'drought_stress':
        return {
          icon: '🏜️',
          title: 'Drought Stress',
          description: `Soil very dry: ${activity.details.moisture}% (Water immediately!)`,
          color: '#F44336'
        };
      
      case 'soil_dry':
        return {
          icon: '💦',
          title: 'Dry Soil Alert',
          description: `Soil moisture low: ${activity.details.moisture}% (Consider watering)`,
          color: '#FF9800'
        };
      
      case 'overwatered':
        return {
          icon: '🌊',
          title: 'Overwatering Warning',
          description: `Soil very wet: ${activity.details.moisture}% (Root rot risk)`,
          color: '#FF9800'
        };
      
      case 'watered':
        return {
          icon: '💧',
          title: 'Manual Watering',
          description: activity.details.notes || 'Plant was watered manually',
          color: '#2196F3'
        };
      
      case 'fertilized':
        return {
          icon: '🌱',
          title: 'Fertilized',
          description: activity.details.notes || 'Plant was fertilized',
          color: '#4CAF50'
        };
      
      case 'pruned':
        return {
          icon: '✂️',
          title: 'Pruned',
          description: activity.details.notes || 'Plant was pruned',
          color: '#4CAF50'
        };
      
      default:
        return {
          icon: '🌿',
          title: activity.type.charAt(0).toUpperCase() + activity.type.slice(1),
          description: activity.details.notes || 'Plant care activity',
          color: '#4CAF50'
        };
    }
  };

  const handleRetry = () => {
    console.log('🔄 Retrying sensor data fetch...');
    fetchHistory(7);
  };

  const handleSensorHelp = () => {
    alert(`🌿 Basil Sensor Setup Help:

1. **Check Sensor Connection**
   - Ensure sensors are properly connected to your system
   - Verify power supply is working

2. **Network Connectivity**
   - Check your internet connection
   - Verify sensor hub is connected to WiFi

3. **Sensor Placement**
   - Place soil moisture sensor in the basil pot
   - Position temperature/humidity sensor near the plant
   - Ensure light sensor has clear view of growing area

4. **Troubleshooting**
   - Restart your sensor system
   - Check sensor logs at: https://gardenpi.duckdns.org/
   - Wait 1-2 hours for first data to appear

5. **Contact Support**
   - If issues persist, contact technical support
   - Include your plant name: ${plant?.name || 'Unknown'}`);
  };
  
  const chartData = getChartData();
  
  return (
    <HistoryContainer>
      <HistoryTitle>Care History & Sensor Data</HistoryTitle>
      
      {/* Show streak information */}
      <StreakInfo>
        <StreakTitle>🔥 Your Basil Care Streak</StreakTitle>
        <StreakStats>
          <StreakStat>
            <StreakNumber>{user?.streakCount || 0}</StreakNumber>
            <StreakLabel>Current Streak</StreakLabel>
          </StreakStat>
          <StreakStat>
            <StreakNumber>{user?.bestStreak || 0}</StreakNumber>
            <StreakLabel>Best Streak</StreakLabel>
          </StreakStat>
        </StreakStats>
      </StreakInfo>
      
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
        {loading && (
          <LoadingMessage>
            <LoadingSpinner />
            Loading your basil's sensor data...
          </LoadingMessage>
        )}
        
        {error && !loading && (
          <ErrorContainer>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorTitle>Sensor Data Error</ErrorTitle>
            <ErrorText>
              We encountered an issue loading your sensor data. This might be due to 
              connectivity issues or sensor problems.
            </ErrorText>
            <RetryButton onClick={handleRetry}>
              Try Again
            </RetryButton>
          </ErrorContainer>
        )}
        
        {!loading && !error && !hasHistoricalData && (
          <NoDataContainer>
            <NoDataIcon>🌱</NoDataIcon>
            <NoDataTitle>
              {isNewUser ? 'Welcome to PlantTalk!' : 'No Sensor Data Yet'}
            </NoDataTitle>
            <NoDataText>
              {isNewUser ? (
                <>
                  Your basil monitoring system is all set up! Sensor data will start appearing here 
                  once your devices begin collecting environmental information about your basil plant.
                  <br /><br />
                  <strong>Expected data includes:</strong><br />
                  • Soil moisture levels<br />
                  • Temperature readings<br />
                  • Humidity measurements<br />
                  • Light exposure data
                </>
              ) : (
                <>
                  We haven't received any sensor data for your basil plant yet. This could mean:
                  <br /><br />
                  • Sensors are still being set up<br />
                  • Network connectivity issues<br />
                  • Sensors need to be repositioned<br />
                  • Technical difficulties with the monitoring system
                </>
              )}
            </NoDataText>
            <HelpButton onClick={handleSensorHelp}>
              📋 Sensor Setup Help
            </HelpButton>
          </NoDataContainer>
        )}
        
        {!loading && !error && hasHistoricalData && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
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
                    dot={false}
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
                  name="Temperature (°C)" 
                  stroke="#F44336" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  dot={false}
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
                  dot={false}
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
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>
      
      {/* SMART ACTIVITY SECTION - This replaces the old manual activity log */}
      <ActivityLogContainer>
        <ActivityLogTitle>🤖 Smart Care Activities</ActivityLogTitle>
        
        <ActivityList>
          {detectedActivities.length > 0 ? (
            detectedActivities.map((activity, index) => {
              const display = getSmartActivityDisplay(activity);
              return (
                <ActivityItem key={index}>
                  <ActivityIcon style={{ backgroundColor: `${display.color}20` }}>
                    {display.icon}
                  </ActivityIcon>
                  <ActivityDetails>
                    <ActivityType style={{ color: display.color }}>{display.title}</ActivityType>
                    <ActivityDate>{formatDateTime(activity.timestamp)}</ActivityDate>
                    <ActivityNotes>{display.description}</ActivityNotes>
                  </ActivityDetails>
                </ActivityItem>
              );
            })
          ) : (
            <NoDataContainer>
              <NoDataIcon>🤖</NoDataIcon>
              <NoDataTitle>AI Monitoring Active</NoDataTitle>
              <NoDataText>
                Your basil's AI monitoring system is running! It will automatically detect:
                <br />• 💧 Watering events (moisture spikes)
                <br />• 🌡️ Temperature stress (too hot/cold for basil)
                <br />• 🏜️ Dry soil alerts (needs water)
                <br />• 🌊 Overwatering warnings (root rot risk)
                <br /><br />
                Care activities will appear here as they're detected from sensor data.
              </NoDataText>
            </NoDataContainer>
          )}
        </ActivityList>
      </ActivityLogContainer>
    </HistoryContainer>
  );
};

export default CareHistory;