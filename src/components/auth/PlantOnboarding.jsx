// src/components/auth/PlantOnboarding.jsx - Enhanced with Age Input
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const OnboardingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.background} 0%, 
    ${({ theme }) => theme.colors.surface} 100%);
  padding: ${({ theme }) => theme.spacing.lg};
`;

const OnboardingCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  padding: ${({ theme }) => theme.spacing.xxl};
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const WelcomeIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  text-align: left;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, error }) => 
    error ? theme.colors.status.danger : 'rgba(0,0,0,0.1)'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: border-color ${({ theme }) => theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid rgba(0,0,0,0.1);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AgeContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: end;
`;

const BasilInfo = styled.div`
  background: ${({ theme }) => theme.colors.primary}10;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const BasilInfoTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

const BasilInfoText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.status.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Button = styled.button`
  background: ${({ theme, variant }) => 
    variant === 'secondary' ? 'transparent' : theme.colors.primary};
  color: ${({ theme, variant }) => 
    variant === 'secondary' ? theme.colors.text.secondary : theme.colors.text.inverse};
  border: ${({ theme, variant }) => 
    variant === 'secondary' ? `1px solid ${theme.colors.text.secondary}` : 'none'};
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  margin-top: ${({ theme }) => theme.spacing.md};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    background: ${({ theme, variant }) => 
      variant === 'secondary' ? theme.colors.text.secondary : theme.colors.accent};
    color: ${({ theme }) => theme.colors.text.inverse};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: ${({ theme }) => theme.spacing.sm};
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const HelpText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-style: italic;
`;

// Basil varieties for selection
const BasilVarieties = [
  { value: 'sweet', label: '🌿 Sweet Basil (Genovese)' },
  { value: 'thai', label: '🌶️  Thai Basil' },
  { value: 'purple', label: '💜 Purple Basil' },
  { value: 'lemon', label: '🍋 Lemon Basil' },
  { value: 'holy', label: '🙏 Holy Basil (Tulsi)' },
  { value: 'african', label: '🌍 African Blue Basil' },
  { value: 'other', label: '🌱 Other Basil Variety' }
];

// Age units for selection
const AgeUnits = [
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' }
];

const PlantOnboarding = ({ isEditing = false, existingPlant = null }) => {
  const [formData, setFormData] = useState({
    name: existingPlant?.name || '',
    variety: existingPlant?.variety || '',
    customVariety: existingPlant?.customVariety || '',
    location: existingPlant?.location || '',
    notes: existingPlant?.notes || '',
    ageNumber: existingPlant?.ageNumber || '',
    ageUnit: existingPlant?.ageUnit || 'days'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { createPlant, user, signOut } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Please give your basil plant a name';
    }
    
    if (!formData.variety) {
      newErrors.variety = 'Please select your basil variety';
    }
    
    if (formData.variety === 'other' && !formData.customVariety.trim()) {
      newErrors.customVariety = 'Please specify your basil variety';
    }
    
    if (!formData.ageNumber || formData.ageNumber < 1) {
      newErrors.ageNumber = 'Please enter a valid age';
    }
    
    if (formData.ageNumber > 1000) {
      newErrors.ageNumber = 'Age seems too high. Please check.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePlantedDate = () => {
    const now = new Date();
    const ageInDays = calculateAgeInDays();
    const plantedDate = new Date(now.getTime() - (ageInDays * 24 * 60 * 60 * 1000));
    return plantedDate;
  };

  const calculateAgeInDays = () => {
    const ageNumber = parseInt(formData.ageNumber);
    switch (formData.ageUnit) {
      case 'days':
        return ageNumber;
      case 'weeks':
        return ageNumber * 7;
      case 'months':
        return ageNumber * 30; // Approximate
      default:
        return ageNumber;
    }
  };

  const handleCreatePlant = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Determine the species name
      let speciesName = 'Sweet Basil'; // default
      if (formData.variety === 'other') {
        speciesName = formData.customVariety.trim();
      } else {
        const selectedVariety = BasilVarieties.find(v => v.value === formData.variety);
        speciesName = selectedVariety ? selectedVariety.label : 'Basil';
      }
      
      const plantData = {
        name: formData.name.trim(),
        species: speciesName,
        plantType: 'basil', // Always basil
        variety: formData.variety,
        location: formData.location.trim(),
        notes: formData.notes.trim(),
        ageNumber: parseInt(formData.ageNumber),
        ageUnit: formData.ageUnit,
        plantedDate: calculatePlantedDate(), // Calculate when it was planted
        createdDate: new Date().toISOString(),
        status: 'healthy'
      };
      
      const result = await createPlant(plantData);
      
      if (result.success) {
        console.log('Basil plant created successfully!');
        // The AuthContext will handle the state update and redirect
      } else {
        setErrors({ general: result.error || 'Failed to create plant profile' });
      }
    } catch (error) {
      console.error('Error creating basil plant:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <OnboardingContainer>
      <OnboardingCard>
        <WelcomeIcon>🌿</WelcomeIcon>
        <Title>
          {isEditing ? 'Edit Your Basil Profile' : `Welcome to PlantTalk, ${user?.displayName || 'Basil Parent'}!`}
        </Title>
        <Subtitle>
          {isEditing 
            ? 'Update your basil plant information below.'
            : 'Let\'s set up your basil plant profile to start monitoring its health and growth.'
          }
        </Subtitle>

        {!isEditing && (
          <BasilInfo>
            <BasilInfoTitle>🌿 About Your Basil Monitoring</BasilInfoTitle>
            <BasilInfoText>
              PlantTalk is specifically designed for basil plants! We'll track your basil's 
              soil moisture, temperature, humidity, and light to help you grow the perfect herb.
            </BasilInfoText>
          </BasilInfo>
        )}

        <FormContainer>
          <InputGroup>
            <Label>What's your basil plant's name?</Label>
            <Input
              name="name"
              type="text"
              placeholder="e.g., Basilio, Green Goddess, Herb Hero..."
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label>What variety of basil is it?</Label>
            <Select
              name="variety"
              value={formData.variety}
              onChange={handleInputChange}
            >
              <option value="">Select your basil variety...</option>
              {BasilVarieties.map(variety => (
                <option key={variety.value} value={variety.value}>
                  {variety.label}
                </option>
              ))}
            </Select>
            {errors.variety && <ErrorMessage>{errors.variety}</ErrorMessage>}
          </InputGroup>

          {formData.variety === 'other' && (
            <InputGroup>
              <Label>Please specify your basil variety</Label>
              <Input
                name="customVariety"
                type="text"
                placeholder="e.g., Cinnamon Basil, Spicy Globe Basil..."
                value={formData.customVariety}
                onChange={handleInputChange}
                error={errors.customVariety}
              />
              {errors.customVariety && <ErrorMessage>{errors.customVariety}</ErrorMessage>}
            </InputGroup>
          )}

          <InputGroup>
            <Label>How old is your basil plant?</Label>
            <AgeContainer>
              <Input
                name="ageNumber"
                type="number"
                min="1"
                max="1000"
                placeholder="Enter age..."
                value={formData.ageNumber}
                onChange={handleInputChange}
                error={errors.ageNumber}
              />
              <Select
                name="ageUnit"
                value={formData.ageUnit}
                onChange={handleInputChange}
              >
                {AgeUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </Select>
            </AgeContainer>
            {errors.ageNumber && <ErrorMessage>{errors.ageNumber}</ErrorMessage>}
            <HelpText>
              This helps us understand your basil's growth stage and provide better care recommendations.
            </HelpText>
          </InputGroup>

          <InputGroup>
            <Label>Where is your basil located? (Optional)</Label>
            <Input
              name="location"
              type="text"
              placeholder="e.g., Kitchen windowsill, Garden bed, Balcony pot..."
              value={formData.location}
              onChange={handleInputChange}
            />
          </InputGroup>

          <InputGroup>
            <Label>Any notes about your basil? (Optional)</Label>
            <Input
              name="notes"
              type="text"
              placeholder="e.g., Started from seed, loves morning sun, great for pesto..."
              value={formData.notes}
              onChange={handleInputChange}
            />
          </InputGroup>

          {errors.general && (
            <ErrorMessage style={{ textAlign: 'center' }}>
              {errors.general}
            </ErrorMessage>
          )}

          <ButtonGroup>
            <Button onClick={handleCreatePlant} disabled={loading}>
              {loading && <LoadingSpinner />}
              {isEditing ? 'Update My Basil Profile' : 'Create My Basil Profile'}
            </Button>
          </ButtonGroup>

          {!isEditing && (
            <Button 
              variant="secondary" 
              onClick={handleSignOut}
              disabled={loading}
            >
              Sign Out
            </Button>
          )}
        </FormContainer>
      </OnboardingCard>
    </OnboardingContainer>
  );
};

export default PlantOnboarding;