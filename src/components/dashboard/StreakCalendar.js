// src/components/dashboard/StreakCalendar.js
import React from 'react';
import styled from 'styled-components';
import { format, subDays, isSameDay } from 'date-fns';

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
  background-color: ${({ isToday, hasActivity, theme }) => 
    isToday 
      ? 'rgba(76, 175, 80, 0.1)' 
      : hasActivity 
        ? 'rgba(76, 175, 80, 0.05)'
        : 'transparent'
  };
  border: 1px solid ${({ isToday, theme }) => 
    isToday ? theme.colors.primary : '#e0e0e0'};
  
  ${({ isPast, hasActivity, theme }) => 
    isPast && !hasActivity && `
      color: ${theme.colors.text.secondary};
    `
  }
`;

const DayNumber = styled.div`
  font-weight: ${({ isToday, theme }) => 
    isToday ? theme.typography.fontWeight.bold : theme.typography.fontWeight.regular};
`;

const ActivityIndicator = styled.div`
  display: ${({ hasActivity }) => hasActivity ? 'block' : 'none'};
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-top: 2px;
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
      case 'watered':
        return theme.colors.primary;
      case 'today':
        return 'rgba(76, 175, 80, 0.1)';
      default:
        return '#e0e0e0';
    }
  }};
  border: ${({ type, theme }) => type === 'today' ? `1px solid ${theme.colors.primary}` : 'none'};
`;

const StreakCalendar = ({ streak, careHistory }) => {
  const today = new Date();
  const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
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
  
  // Check if a date has any care activity
  const hasActivity = (date) => {
    return careHistory.some(item => isSameDay(new Date(item.date), date));
  };
  
  // Get care actions for a specific date
  const getActivities = (date) => {
    return careHistory
      .filter(item => isSameDay(new Date(item.date), date))
      .map(item => item.action);
  };
  
  return (
    <CalendarContainer>
      <CalendarHeader>
        <Title>Care Streak</Title>
        <StreakCount>
          <FireIcon>🔥</FireIcon>
          {streak} {streak === 1 ? 'day' : 'days'}
        </StreakCount>
      </CalendarHeader>
      
      <WeekdayLabels>
        {weekdays.map((day, index) => (
          <WeekdayLabel key={index}>{day}</WeekdayLabel>
        ))}
      </WeekdayLabels>
      
      <DaysGrid>
        {days.map((date, index) => {
          const isToday = isSameDay(date, today);
          const isPast = date < today;
          const dayHasActivity = hasActivity(date);
          
          return (
            <Day
              key={index}
              isToday={isToday}
              isPast={isPast}
              hasActivity={dayHasActivity}
            >
              <DayNumber isToday={isToday}>
                {format(date, 'd')}
              </DayNumber>
              <ActivityIndicator hasActivity={dayHasActivity} />
            </Day>
          );
        })}
      </DaysGrid>
      
      <Legend>
        <LegendItem>
          <LegendIndicator type="watered" circle />
          <span>Care activity</span>
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