// src/components/profile/PhotoGallery.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { usePlant } from '../../contexts/PlantContext';
import Button from '../common/Button';

const GalleryContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GalleryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const GalleryTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const PhotoCard = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.short};
  
  &:hover {
    transform: scale(1.02);
  }
`;

const PhotoImage = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background-color: #E0E0E0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.5));
    opacity: 0.7;
    transition: opacity ${({ theme }) => theme.transitions.short};
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const PhotoDate = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xs};
  left: ${({ theme }) => theme.spacing.xs};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  z-index: 1;
`;

const ModalOverlay = styled.div`
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
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
`;

const LargePhoto = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background-color: #E0E0E0;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PhotoInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const PhotoNote = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: ${({ theme }) => theme.spacing.md} 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const UploadForm = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  border: 1px solid #e0e0e0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  border: 1px solid #e0e0e0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FileUploadButton = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.short};
  width: fit-content;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
  
  input {
    display: none;
  }
`;

const FileUploadIcon = styled.span`
  font-size: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const PhotoGallery = () => {
  const { plant, addPlantPhoto } = usePlant();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    photoUrl: '',
    note: ''
  });
  
  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // For demo purposes, use a placeholder image
  const getPlaceholderImage = (index) => {
    const colors = ['#4CAF50', '#81C784', '#C8E6C9'];
    return colors[index % colors.length];
  };
  
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };
  
  const closeModal = () => {
    setSelectedPhoto(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, this would upload the file to a server and get back a URL
      // For this demo, we'll use a dummy URL
      setFormData(prev => ({
        ...prev,
        photoUrl: URL.createObjectURL(file)
      }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add the new photo
    addPlantPhoto(formData.photoUrl || '/assets/images/plant-placeholder.jpg', formData.note);
    
    // Reset form
    setFormData({
      photoUrl: '',
      note: ''
    });
    
    setShowUploadForm(false);
  };
  
  return (
    <GalleryContainer>
      <GalleryHeader>
        <GalleryTitle>Photo Gallery</GalleryTitle>
        <Button 
          variant="outline" 
          size="small" 
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          {showUploadForm ? 'Cancel' : 'Add Photo'}
        </Button>
      </GalleryHeader>
      
      {showUploadForm && (
        <UploadForm>
          <FormTitle>Upload New Photo</FormTitle>
          <form onSubmit={handleSubmit}>
            <FormField>
              <FileUploadButton>
                <FileUploadIcon>📷</FileUploadIcon>
                Choose Photo
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload}
                />
              </FileUploadButton>
              {formData.photoUrl && (
                <div style={{ marginTop: '10px' }}>
                  <img 
                    src={formData.photoUrl} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} 
                  />
                </div>
              )}
            </FormField>
            
            <FormField>
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea 
                id="note"
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Add a note about your plant's progress..."
              />
            </FormField>
            
            <ButtonContainer>
              <Button variant="text" onClick={() => setShowUploadForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Upload Photo
              </Button>
            </ButtonContainer>
          </form>
        </UploadForm>
      )}
      
      {plant.photos.length > 0 ? (
        <PhotosGrid>
          {plant.photos.map((photo, index) => (
            <PhotoCard key={photo.id} onClick={() => handlePhotoClick(photo)}>
              <PhotoImage 
                style={{ 
                  backgroundImage: photo.url.startsWith('/') 
                    ? `linear-gradient(to bottom, ${getPlaceholderImage(index)}, ${getPlaceholderImage(index + 1)})` 
                    : `url(${photo.url})` 
                }}
              />
              <PhotoDate>{formatDate(photo.date)}</PhotoDate>
            </PhotoCard>
          ))}
        </PhotosGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>📷</EmptyIcon>
          <EmptyText>No photos yet. Add some to track your plant's growth!</EmptyText>
          <Button onClick={() => setShowUploadForm(true)}>
            Add First Photo
          </Button>
        </EmptyState>
      )}
      
      {selectedPhoto && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{formatDate(selectedPhoto.date)}</ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <LargePhoto 
                style={{ 
                  backgroundImage: selectedPhoto.url.startsWith('/') 
                    ? `linear-gradient(to bottom, ${getPlaceholderImage(plant.photos.indexOf(selectedPhoto))}, ${getPlaceholderImage(plant.photos.indexOf(selectedPhoto) + 1)})` 
                    : `url(${selectedPhoto.url})` 
                }}
              />
              <PhotoInfo>
                {selectedPhoto.note && (
                  <PhotoNote>{selectedPhoto.note}</PhotoNote>
                )}
              </PhotoInfo>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </GalleryContainer>
  );
};

export default PhotoGallery;