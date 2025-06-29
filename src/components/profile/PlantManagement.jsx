// src/components/profile/PlantManagement.jsx - Working Delete Functionality
import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const ManagementContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border: 2px solid rgba(255, 193, 7, 0.2);
`;

const ManagementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ManagementTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ManagementIcon = styled.span`
  font-size: 1.2rem;
`;

const ManagementActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled.button`
  background: ${({ theme, variant }) => {
    switch (variant) {
      case 'danger':
        return theme.colors.status.danger;
      case 'warning':
        return theme.colors.status.warning;
      default:
        return theme.colors.primary;
    }
  }};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ActionIcon = styled.span`
  font-size: 1rem;
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const ModalIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ModalTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const ModalText = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
`;

const ModalButton = styled.button`
  background: ${({ theme, variant }) => 
    variant === 'danger' ? theme.colors.status.danger : 'transparent'};
  color: ${({ theme, variant }) => 
    variant === 'danger' ? 'white' : theme.colors.text.secondary};
  border: ${({ theme, variant }) => 
    variant === 'danger' ? 'none' : `1px solid ${theme.colors.text.secondary}`};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    background: ${({ theme, variant }) => 
      variant === 'danger' ? theme.colors.status.danger : theme.colors.text.secondary};
    color: white;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InfoSection = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PlantManagement = ({ onEditPlant }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNewPlantConfirm, setShowNewPlantConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { plant, deletePlant, user } = useAuth();

  // Calculate actual age based on planted date or created date
  const calculateAge = () => {
    if (!plant) return 'Unknown';
    
    let startDate;
    if (plant.plantedDate) {
      startDate = plant.plantedDate.toDate ? plant.plantedDate.toDate() : new Date(plant.plantedDate);
    } else if (plant.createdAt) {
      startDate = plant.createdAt.toDate ? plant.createdAt.toDate() : new Date(plant.createdAt);
    } else {
      return 'Unknown';
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month' : `${months} months`;
    }
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year' : `${years} years`;
  };

  const handleDeletePlant = async () => {
    setLoading(true);
    try {
      console.log('Deleting plant:', plant?.name);
      
      const result = await deletePlant();
      
      if (result.success) {
        console.log('✅ Plant deleted successfully!');
        setShowDeleteConfirm(false);
        // The AuthContext will handle state updates and re-render
      } else {
        console.error('❌ Failed to delete plant:', result.error);
        alert('Failed to delete plant: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error deleting plant:', error);
      alert('Error deleting plant: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPlant = () => {
    setShowNewPlantConfirm(true);
  };

  const confirmNewPlant = async () => {
    setLoading(true);
    try {
      console.log('Starting new plant (deleting current)');
      const result = await deletePlant();
      
      if (result.success) {
        console.log('✅ Current plant deleted, ready for new plant');
        setShowNewPlantConfirm(false);
        // The AuthContext will handle showing the onboarding screen
      } else {
        console.error('❌ Failed to delete current plant:', result.error);
        alert('Failed to start new plant: ' + result.error);
      }
    } catch (error) {
      console.error('❌ Error starting new plant:', error);
      alert('Error starting new plant: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ManagementContainer>
        <ManagementHeader>
          <ManagementTitle>
            <ManagementIcon>⚙️</ManagementIcon>
            Plant Management
          </ManagementTitle>
        </ManagementHeader>
        
        <InfoSection>
          <InfoText>
            <strong>Current Plant:</strong> {plant?.name || 'Unknown'} ({plant?.species || 'Unknown variety'})
            <br />
            <strong>Created:</strong> {plant?.createdAt ? new Date(plant.createdAt.toDate ? plant.createdAt.toDate() : plant.createdAt).toLocaleDateString() : 'Unknown'}
            <br />
            <strong>Age:</strong> {calculateAge()} old
          </InfoText>
        </InfoSection>

        <ManagementActions>
          <ActionButton onClick={onEditPlant} disabled={loading}>
            <ActionIcon>✏️</ActionIcon>
            Edit Plant Info
          </ActionButton>
          
          <ActionButton variant="warning" onClick={handleNewPlant} disabled={loading}>
            <ActionIcon>🔄</ActionIcon>
            Start New Plant
          </ActionButton>
          
          <ActionButton variant="danger" onClick={() => setShowDeleteConfirm(true)} disabled={loading}>
            <ActionIcon>🗑️</ActionIcon>
            Delete Plant
          </ActionButton>
        </ManagementActions>
      </ManagementContainer>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <ConfirmationModal onClick={() => !loading && setShowDeleteConfirm(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalIcon>⚠️</ModalIcon>
            <ModalTitle>Delete Plant Profile?</ModalTitle>
            <ModalText>
              Are you sure you want to delete <strong>{plant?.name}</strong>? 
              This will permanently remove all plant data, photos, and care history. 
              This action cannot be undone.
            </ModalText>
            <ModalActions>
              <ModalButton 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Cancel
              </ModalButton>
              <ModalButton 
                variant="danger" 
                onClick={handleDeletePlant}
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 'Delete Forever'}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ConfirmationModal>
      )}

      {/* New Plant Confirmation Modal */}
      {showNewPlantConfirm && (
        <ConfirmationModal onClick={() => !loading && setShowNewPlantConfirm(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalIcon>🌱</ModalIcon>
            <ModalTitle>Start New Plant Profile?</ModalTitle>
            <ModalText>
              This will delete your current plant <strong>{plant?.name}</strong> and 
              all its data, then let you create a new plant profile from scratch. 
              Are you sure you want to continue?
            </ModalText>
            <ModalActions>
              <ModalButton 
                onClick={() => setShowNewPlantConfirm(false)}
                disabled={loading}
              >
                Cancel
              </ModalButton>
              <ModalButton 
                variant="danger" 
                onClick={confirmNewPlant}
                disabled={loading}
              >
                {loading ? <LoadingSpinner /> : 'Start New Plant'}
              </ModalButton>
            </ModalActions>
          </ModalContent>
        </ConfirmationModal>
      )}
    </>
  );
};

export default PlantManagement;