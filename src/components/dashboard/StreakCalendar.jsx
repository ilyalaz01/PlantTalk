// src/components/dashboard/StreakCalendar.js - Smart Health-Based Streak
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { format, subDays, isSameDay, startOfDay, endOfDay } from 'date-fns';

const CalendarContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const StreakCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const FireIcon = styled.span`
  font-size: 24px;
`;

const StreakInfo = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const StreakText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
`;

const WeekdayLabels = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const WeekdayLabel = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
`;

const Day = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  position: relative;
  background-color: ${({ isToday, healthStatus, theme }) => {
    if (isToday) return 'rgba(76, 175, 80, 0.1)';
    switch (healthStatus) {
      case 'excellent': return 'rgba(76, 175, 80, 0.2)';
      case 'good': return 'rgba(76, 175, 80, 0.1)';
      case 'warning': return 'rgba(255, 152, 0, 0.1)';
      case 'danger': return 'rgba(244, 67, 54, 0.1)';
      default: return 'transparent';
    }
  }};
  border: 1px solid ${({ isToday, healthStatus, theme }) => {
    if (isToday) return theme.colors.primary;
    switch (healthStatus) {
      case 'excellent': return 'rgba(76, 175, 80, 0.5)';
      case 'good': return 'rgba(76, 175, 80, 0.3)';
      case 'warning': return 'rgba(255, 152, 0, 0.3)';
      case 'danger': return 'rgba(244, 67, 54, 0.3)';
      default: return '#e0e0e0';
    }
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  
  ${({ isPast, healthStatus, theme }) => 
    isPast && healthStatus === 'no-data' && `
      color: ${theme.colors.text.secondary};
      opacity: 0.5;
    `
  }
`;

const DayNumber = styled.div`
  font-weight: ${({ isToday, theme }) => 
    isToday ? theme.typography.fontWeight.bold : theme.typography.fontWeight.regular};
`;

const HealthIndicator = styled.div`
  display: ${({ healthStatus }) => healthStatus !== 'no-data' ? 'block' : 'none'};
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ healthStatus }) => {
    switch (healthStatus) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'warning': return '#FF9800';
      case 'danger': return '#F44336';
      default: return '#E0E0E0';
    }
  }};
  margin-top: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LegendIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: ${({ circle, theme }) => circle ? '50%' : theme.borderRadius.sm};
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'excellent': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'warning': return '#FF9800';
      case 'danger': return '#F44336';
      case 'today': return 'rgba(76, 175, 80, 0.1)';
      default: return '#e0e0e0';
    }
  }};
  border: ${({ type, theme }) => type === 'today' ? `1px solid ${theme.colors.primary}` : 'none'};
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

// ==== BASIL HEALTH CALCULATION FUNCTIONS ====

/**
 * Check if sensor reading is in optimal range for basil
 * Based on: Temp 20-30°C, Moisture ~60%, Humidity 50-70%, Light 6-8hrs
 */
const calculateHealthStatus = (reading) => {
  if (!reading || typeof reading.temperature !== 'number') {
    return 'no-data';
  }
  
  const { temperature, soilMoisture, humidity } = reading;
  
  // Basil optimal ranges
  const tempOptimal = temperature >= 20 && temperature <= 30;
  const tempGood = temperature >= 15 && temperature <= 35;
  const tempDanger = temperature < 10 || temperature > 35;
  
  const moistureOptimal = soilMoisture >= 50 && soilMoisture <= 70;
  const moistureGood = soilMoisture >= 30 && soilMoisture <= 75;
  const moistureDanger = soilMoisture < 25 || soilMoisture > 75;
  
  const humidityOptimal = humidity >= 50 && humidity <= 70;
  const humidityGood = humidity >= 40 && humidity <= 80;
  const humidityDanger = humidity < 30 || humidity > 85;
  
  // Count optimal conditions
  const optimalCount = [tempOptimal, moistureOptimal, humidityOptimal].filter(Boolean).length;
  const goodCount = [tempGood, moistureGood, humidityGood].filter(Boolean).length;
  const dangerCount = [tempDanger, moistureDanger, humidityDanger].filter(Boolean).length;
  
  // Determine overall health status
  if (dangerCount > 0) return 'danger';
  if (optimalCount >= 2) return 'excellent';
  if (goodCount >= 2) return 'good';
  return 'warning';
};

/**
 * Calculate daily health status from multiple sensor readings
 */
const calculateDayHealthStatus = (dayReadings) => {
  if (!dayReadings || dayReadings.length === 0) {
    return 'no-data';
  }
  
  // Calculate health status for each reading
  const healthStatuses = dayReadings.map(calculateHealthStatus);
  
  // Count each status type
  const statusCounts = {
    excellent: healthStatuses.filter(s => s === 'excellent').length,
    good: healthStatuses.filter(s => s === 'good').length,
    warning: healthStatuses.filter(s => s === 'warning').length,
    danger: healthStatuses.filter(s => s === 'danger').length,
  };
  
  const totalReadings = healthStatuses.length;
  
  // Day is considered "excellent" if 80%+ readings are excellent/good
  // Day is "good" if 60%+ readings are good or better
  // Day is "warning" if less than 60% good but no major dangers
  // Day is "danger" if any significant danger readings
  
  const excellentPercentage = statusCounts.excellent / totalReadings;
  const goodOrBetterPercentage = (statusCounts.excellent + statusCounts.good) / totalReadings;
  const dangerPercentage = statusCounts.danger / totalReadings;
  
  if (dangerPercentage > 0.2) return 'danger'; // More than 20% danger readings
  if (excellentPercentage >= 0.6) return 'excellent'; // 60%+ excellent
  if (goodOrBetterPercentage >= 0.6) return 'good'; // 60%+ good or better
  return 'warning';
};

/**
 * Calculate streak from daily health data
 */
const calculateHealthStreak = (dailyHealthData) => {
  const today = new Date();
  let streak = 0;
  
  // Start from yesterday and count backwards
  for (let i = 1; i <= 14; i++) {
    const checkDate = subDays(today, i);
    const dateKey = format(checkDate, 'yyyy-MM-dd');
    const dayHealth = dailyHealthData[dateKey];
    
    if (dayHealth === 'excellent' || dayHealth === 'good') {
      streak++;
    } else {
      break; // Streak is broken
    }
  }
  
  return streak;
};

const StreakCalendar = ({ sensorData = [], careHistory = [] }) => {
  const today = new Date();
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Process sensor data into daily health statuses
  const dailyHealthData = useMemo(() => {
    const dailyData = {};
    
    if (!sensorData || sensorData.length === 0) {
      return dailyData;
    }
    
    // Group sensor readings by date
    sensorData.forEach(reading => {
      try {
        const readingDate = new Date(reading.timestamp);
        const dateKey = format(readingDate, 'yyyy-MM-dd');
        
        if (!dailyData[dateKey]) {
          dailyData[dateKey] = [];
        }
        
        dailyData[dateKey].push(reading);
      } catch (error) {
        console.warn('Error processing sensor reading:', error);
      }
    });
    
    // Calculate health status for each day
    const healthData = {};
    Object.keys(dailyData).forEach(dateKey => {
      healthData[dateKey] = calculateDayHealthStatus(dailyData[dateKey]);
    });
    
    return healthData;
  }, [sensorData]);
  
  // Calculate current streak
  const currentStreak = useMemo(() => {
    return calculateHealthStreak(dailyHealthData);
  }, [dailyHealthData]);
  
  // Generate the last 14 days for our calendar
  const generateDays = () => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(today, i);
      days.push(date);
    }
    return days;
  };
  
  const days = generateDays();
  
  // Get health status for a specific date
  const getHealthStatus = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return dailyHealthData[dateKey] || 'no-data';
  };
  
  // Get tooltip text for a day
  const getTooltipText = (date, healthStatus) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayReadings = sensorData.filter(reading => {
      const readingDate = new Date(reading.timestamp);
      return format(readingDate, 'yyyy-MM-dd') === dateKey;
    });
    
    if (dayReadings.length === 0) {
      return 'No sensor data';
    }
    
    const avgTemp = dayReadings.reduce((sum, r) => sum + r.temperature, 0) / dayReadings.length;
    const avgMoisture = dayReadings.reduce((sum, r) => sum + r.soilMoisture, 0) / dayReadings.length;
    const avgHumidity = dayReadings.reduce((sum, r) => sum + r.humidity, 0) / dayReadings.length;
    
    return `${format(date, 'MMM d')}\nTemp: ${avgTemp.toFixed(1)}°C\nMoisture: ${avgMoisture.toFixed(1)}%\nHumidity: ${avgHumidity.toFixed(1)}%\nHealth: ${healthStatus}`;
  };
  
  const hasAnyData = sensorData && sensorData.length > 0;
  
  return (
    <CalendarContainer>
      <CalendarHeader>
        <Title>🌿 Basil Health Streak</Title>
        <StreakCount>
          <FireIcon>🔥</FireIcon>
          {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
        </StreakCount>
      </CalendarHeader>
      
      <StreakInfo>
        <div style={{ fontWeight: 'bold', color: currentStreak > 0 ? '#4CAF50' : '#666' }}>
          {currentStreak > 0 
            ? `Great! Your basil has been healthy for ${currentStreak} consecutive days!`
            : 'Keep your basil in optimal conditions to start a health streak!'
          }
        </div>
        <StreakText>
          Streak counts days with good temperature (20-30°C), moisture (30-70%), and humidity (50-70%)
        </StreakText>
      </StreakInfo>
      
      {!hasAnyData && (
        <NoDataMessage>
          📊 No sensor data available yet. Once your sensors start collecting data, 
          this calendar will show your basil's daily health status and streak!
        </NoDataMessage>
      )}
      
      <WeekdayLabels>
        {weekdays.map((day, index) => (
          <WeekdayLabel key={index}>{day}</WeekdayLabel>
        ))}
      </WeekdayLabels>
      
      <DaysGrid>
        {days.map((date, index) => {
          const isToday = isSameDay(date, today);
          const isPast = date < today;
          const healthStatus = getHealthStatus(date);
          
          return (
            <Day
              key={index}
              isToday={isToday}
              isPast={isPast}
              healthStatus={healthStatus}
              title={getTooltipText(date, healthStatus)}
            >
              <DayNumber isToday={isToday}>
                {format(date, 'd')}
              </DayNumber>
              <HealthIndicator healthStatus={healthStatus} />
            </Day>
          );
        })}
      </DaysGrid>
      
      <Legend>
        <LegendItem>
          <LegendIndicator type="excellent" circle />
          <span>Excellent</span>
        </LegendItem>
        <LegendItem>
          <LegendIndicator type="good" circle />
          <span>Good</span>
        </LegendItem>
        <LegendItem>
          <LegendIndicator type="warning" circle />
          <span>Warning</span>
        </LegendItem>
        <LegendItem>
          <LegendIndicator type="danger" circle />
          <span>Danger</span>
        </LegendItem>
        <LegendItem>
          <LegendIndicator type="today" />
          <span>Today</span>
        </LegendItem>
      </Legend>
    </CalendarContainer>
  );
};

export default StreakCalendar;