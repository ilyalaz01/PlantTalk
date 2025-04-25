// src/components/profile/CareSchedule.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { usePlant } from '../../contexts/PlantContext';
import { useSensor } from '../../contexts/SensorContext';
import Card from '../common/Card';
import Button from '../common/Button';

const ScheduleContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ScheduleTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ScheduleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const WeekdayHeader = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
`;

const DayCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ hasTask, theme }) => 
    hasTask ? 'rgba(76, 175, 80, 0.1)' : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: ${({ hasTask }) => hasTask ? 'pointer' : 'default'};
  transition: background-color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: ${({ hasTask, theme }) => 
      hasTask ? 'rgba(76, 175, 80, 0.2)' : 'transparent'};
  }
`;

const DayNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ isToday, theme }) => 
    isToday ? theme.colors.primary : theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TaskIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TaskIcon = styled.div`
  font-size: 16px;
`;

const TaskType = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const DetailCard = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DetailDate = styled.h4`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TaskList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: rgba(76, 175, 80, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const TaskItemIcon = styled.div`
  font-size: 20px;
  margin-right: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary};
`;

const TaskItemText = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TaskItemActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const NoTasksMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
`;

const ScheduleOptions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CareSchedule = () => {
  const { plant } = usePlant();
  const { daysUntilWaterNeeded } = useSensor();
  
  const [selectedDay, setSelectedDay] = useState(null);
  
  // Generate the next 14 days for our calendar
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      
      days.push({
        date,
        dayOfMonth: date.getDate(),
        isToday: i === 0,
        tasks: generateTasksForDay(date, i)
      });
    }
    
    return days;
  };
  
  // Generate tasks for a specific day
  const generateTasksForDay = (date, dayOffset) => {
    const tasks = [];
    
    // Add watering task based on the days until water needed
    if (dayOffset === Math.round(daysUntilWaterNeeded)) {
      tasks.push({
        type: 'water',
        label: 'Water plant',
        icon: '💧',
        time: '9:00 AM',
        priority: 'high'
      });
    }
    
    // Add other recurring tasks
    if (dayOffset % 7 === 0) {
      tasks.push({
        type: 'check',
        label: 'Check soil',
        icon: '🔍',
        time: '10:00 AM',
        priority: 'medium'
      });
    }
    
    if (dayOffset === 7) {
      tasks.push({
        type: 'fertilize',
        label: 'Fertilize plant',
        icon: '🌱',
        time: '11:00 AM',
        priority: 'medium'
      });
    }
    
    // Add plant rotation every 3 days
    if (dayOffset % 3 === 0 && dayOffset > 0) {
      tasks.push({
        type: 'rotate',
        label: 'Rotate plant',
        icon: '🔄',
        time: '2:00 PM',
        priority: 'low'
      });
    }
    
    return tasks;
  };
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const calendarDays = generateCalendarDays();
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const handleDayClick = (day) => {
    if (day.tasks.length > 0) {
      setSelectedDay(day);
    }
  };
  
  return (
    <ScheduleContainer>
      <ScheduleTitle>Care Schedule</ScheduleTitle>
      
      <ScheduleOptions>
        <Button variant="outline" size="small">
          Export Calendar
        </Button>
        <Button variant="outline" size="small">
          Set Reminders
        </Button>
      </ScheduleOptions>
      
      <Card>
        <ScheduleGrid>
          {weekdays.map((day, index) => (
            <WeekdayHeader key={index}>{day}</WeekdayHeader>
          ))}
          
          {calendarDays.map((day, index) => (
            <DayCell 
              key={index} 
              hasTask={day.tasks.length > 0}
              onClick={() => handleDayClick(day)}
            >
              <DayNumber isToday={day.isToday}>
                {day.dayOfMonth}
              </DayNumber>
              
              {day.tasks.length > 0 && (
                <TaskIndicator>
                  <TaskIcon>{day.tasks[0].icon}</TaskIcon>
                  {day.tasks.length > 1 && (
                    <TaskType>+{day.tasks.length - 1} more</TaskType>
                  )}
                </TaskIndicator>
              )}
            </DayCell>
          ))}
        </ScheduleGrid>
        
        <div>
          <strong>Next watering:</strong> {daysUntilWaterNeeded < 1 
            ? 'Today' 
            : daysUntilWaterNeeded === 1 
              ? 'Tomorrow' 
              : `In ${Math.round(daysUntilWaterNeeded)} days`
          }
        </div>
      </Card>
      
      {selectedDay && (
        <DetailCard>
          <DetailHeader>
            <DetailDate>{formatDate(selectedDay.date)}</DetailDate>
          </DetailHeader>
          
          <TaskList>
            {selectedDay.tasks.map((task, index) => (
              <TaskItem key={index}>
                <TaskItemIcon>{task.icon}</TaskItemIcon>
                <TaskItemText>
                  {task.label} - {task.time}
                </TaskItemText>
                <TaskItemActions>
                  <Button variant="text" size="small">
                    Reschedule
                  </Button>
                  <Button variant="text" size="small">
                    Complete
                  </Button>
                </TaskItemActions>
              </TaskItem>
            ))}
          </TaskList>
          
          <Button 
            variant="text" 
            onClick={() => setSelectedDay(null)}
            style={{ marginTop: '16px' }}
          >
            Close
          </Button>
        </DetailCard>
      )}
    </ScheduleContainer>
  );
};

export default CareSchedule;