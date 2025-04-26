// src/pages/SimulatorPage.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import InteractiveControls from '../components/simulator/InteractiveControls';
import SimulationDisplay from '../components/simulator/SimulationDisplay';
import { usePlant } from '../contexts/PlantContext';
import { useSensor } from '../contexts/SensorContext';
import Button from '../components/common/Button';

const SimulatorContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SimulatorTitle = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SimulatorDescription = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SimulatorPage = () => {
  const { plant } = usePlant();
  const { sensorData } = useSensor();
  
  // Initialize simulator with current sensor values
  const [simulatedValues, setSimulatedValues] = useState({
    moisture: sensorData.soilMoisture,
    temperature: sensorData.temperature,
    humidity: sensorData.humidity,
    light: sensorData.light
  });
  
  // Create simulated plant and sensor objects for the display
  const [simulatedPlant, setSimulatedPlant] = useState({
    ...plant,
    status: 'healthy' // Default status
  });
  
  const [simulatedSensor, setSimulatedSensor] = useState({
    ...sensorData
  });
  
  // Reset simulator to current actual values
  const handleReset = () => {
    setSimulatedValues({
      moisture: sensorData.soilMoisture,
      temperature: sensorData.temperature,
      humidity: sensorData.humidity,
      light: sensorData.light
    });
  };
  
  // Apply preset scenarios
  const applyScenario = (scenario) => {
    switch (scenario) {
      case 'drought':
        setSimulatedValues({
          moisture: 15,
          temperature: 75,
          humidity: 30,
          light: 70
        });
        break;
      case 'overwatered':
        setSimulatedValues({
          moisture: 90,
          temperature: 72,
          humidity: 60,
          light: 60
        });
        break;
      case 'cold':
        setSimulatedValues({
          moisture: 55,
          temperature: 50,
          humidity: 40,
          light: 40
        });
        break;
      case 'hot':
        setSimulatedValues({
          moisture: 30,
          temperature: 90,
          humidity: 30,
          light: 85
        });
        break;
      case 'ideal':
        setSimulatedValues({
          moisture: 50,
          temperature: 70,
          humidity: 55,
          light: 60
        });
        break;
      default:
        handleReset();
    }
  };
  
  // Handle changes to simulated values
  const handleValueChange = (type, value) => {
    setSimulatedValues(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  // Update simulated plant status and sensor data when values change
  useEffect(() => {
    // Determine plant status based on simulated values
    let newStatus = 'healthy';
    
    if (simulatedValues.moisture < 30) {
      newStatus = 'thirsty';
    } else if (simulatedValues.temperature < 60) {
      newStatus = 'cold';
    } else if (simulatedValues.temperature > 80) {
      newStatus = 'hot';
    }
    
    // Update simulated objects
    setSimulatedPlant(prev => ({
      ...prev,
      status: newStatus
    }));
    
    setSimulatedSensor({
      soilMoisture: simulatedValues.moisture,
      temperature: simulatedValues.temperature,
      humidity: simulatedValues.humidity,
      light: simulatedValues.light,
      lastUpdated: new Date()
    });
    
  }, [simulatedValues]);
  
  return (
    <SimulatorContainer>
      <SimulatorTitle>Plant Simulator</SimulatorTitle>
      <SimulatorDescription>
        Experiment with different environmental conditions to see how they affect your plant's health and behavior. Use the sliders to adjust parameters and watch how your plant responds.
      </SimulatorDescription>
      
      <ButtonContainer>
        <Button 
          variant="outline" 
          size="small" 
          onClick={() => applyScenario('drought')}
        >
          Drought
        </Button>
        <Button 
          variant="outline" 
          size="small" 
          onClick={() => applyScenario('overwatered')}
        >
          Overwatered
        </Button>
        <Button 
          variant="outline" 
          size="small" 
          onClick={() => applyScenario('cold')}
        >
          Cold Stress
        </Button>
        <Button 
          variant="outline" 
          size="small" 
          onClick={() => applyScenario('hot')}
        >
          Heat Stress
        </Button>
        <Button 
          variant="outline" 
          size="small" 
          onClick={() => applyScenario('ideal')}
        >
          Ideal
        </Button>
      </ButtonContainer>
      
      <GridLayout>
        <InteractiveControls 
          values={simulatedValues} 
          onChange={handleValueChange} 
        />
        <SimulationDisplay 
          simulatedPlant={simulatedPlant}
          simulatedSensor={simulatedSensor}
        />
      </GridLayout>
      
      <ButtonContainer>
        <Button onClick={handleReset}>
          Reset to Current Values
        </Button>
      </ButtonContainer>
    </SimulatorContainer>
  );
};

export default SimulatorPage;