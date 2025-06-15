// src/components/profile/PhotoGallery.jsx - Fixed Complete Version
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
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
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GalleryTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const GrowthStats = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}15, ${({ theme }) => theme.colors.accent}15);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
`;

const StatBox = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const PhotosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const PhotoCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.medium};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const PhotoImage = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background-color: #f0f0f0;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.6));
  }
`;

const PhotoInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  position: relative;
  z-index: 2;
`;

const PhotoDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PhotoTimeAgo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PhotoNote = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-style: italic;
  line-height: ${({ theme }) => theme.typography.lineHeight.md};
  max-height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UploadSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.primary}08;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px dashed ${({ theme }) => theme.colors.primary}30;
  text-align: center;
`;

const UploadTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 400px;
  margin: 0 auto;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }
`;

const NoteTextarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  border: 2px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const PreviewImage = styled.div`
  width: 100%;
  max-width: 300px;
  aspect-ratio: 4/3;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 3px solid ${({ theme }) => theme.colors.primary};
  margin: ${({ theme }) => theme.spacing.md} auto;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
`;

const StatusMessage = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  
  &.success {
    background-color: rgba(76, 175, 80, 0.1);
    color: ${({ theme }) => theme.colors.status.success};
    border: 1px solid rgba(76, 175, 80, 0.3);
  }
  
  &.error {
    background-color: rgba(244, 67, 54, 0.1);
    color: ${({ theme }) => theme.colors.status.danger};
    border: 1px solid rgba(244, 67, 54, 0.3);
  }
  
  &.loading {
    background-color: ${({ theme }) => theme.colors.primary}10;
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary}30;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

// Modal for viewing large photos
const PhotoModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
`;

const ModalImage = styled.div`
  width: 100%;
  max-width: 800px;
  max-height: 70vh;
  min-height: 400px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f5f5f5;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ModalInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.primary}20;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ModalDetails = styled.div`
  flex: 1;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-left: ${({ theme }) => theme.spacing.lg};
`;

const DeleteButton = styled.button`
  background: #ff4444;
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background: #cc0000;
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const PhotoGallery = () => {
  const { plant, addPlantPhoto, removePlantPhoto } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [stats, setStats] = useState({ totalPhotos: 0, trackingDays: 0, weeksCovered: 0 });
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // Load photos when component mounts
  useEffect(() => {
    if (plant?.photos) {
      const plantPhotos = plant.photos.map(photo => ({
        ...photo,
        url: photo.base64 || photo.url
      }));
      setPhotos(plantPhotos);
      
      // Calculate simple stats
      const totalPhotos = plantPhotos.length;
      let trackingDays = 0;
      
      if (totalPhotos > 1) {
        const firstPhoto = plantPhotos[plantPhotos.length - 1];
        const latestPhoto = plantPhotos[0];
        const firstDate = firstPhoto.timestamp?.toDate ? firstPhoto.timestamp.toDate() : new Date(firstPhoto.timestamp);
        const latestDate = latestPhoto.timestamp?.toDate ? latestPhoto.timestamp.toDate() : new Date(latestPhoto.timestamp);
        trackingDays = Math.floor((latestDate - firstDate) / (1000 * 60 * 60 * 24));
      }
      
      setStats({
        totalPhotos,
        trackingDays: Math.max(0, trackingDays),
        weeksCovered: Math.floor(trackingDays / 7)
      });
    }
  }, [plant]);
  
  // Calculate time ago from photo date
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const photoDate = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    const diffTime = Math.abs(now - photoDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };
  
  // Format date for display
  const formatDate = (timestamp) => {
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handlePhotoClick = (photo, index) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
  };
  
  const closeModal = () => {
    setSelectedPhoto(null);
    setSelectedPhotoIndex(null);
  };

  const handleDeletePhoto = async () => {
    if (selectedPhotoIndex === null || !removePlantPhoto) return;
    
    setDeleting(true);
    
    try {
      const result = await removePlantPhoto(selectedPhotoIndex);
      
      if (result.success) {
        setStatus({ type: 'success', message: 'Photo deleted successfully! 🗑️' });
        closeModal();
        
        // Clear status after 3 seconds
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to delete photo' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong while deleting' });
    } finally {
      setDeleting(false);
    }
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setStatus({ type: 'error', message: 'File size must be less than 4MB' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setStatus({ type: 'error', message: 'Please select an image file' });
        return;
      }
      
      setSelectedFile(file);
      setStatus({ type: '', message: '' });
    }
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setStatus({ type: 'error', message: 'Please select a photo' });
      return;
    }
    
    setStatus({ type: 'loading', message: 'Uploading your growth photo...' });
    
    try {
      const result = await addPlantPhoto(selectedFile, note);
      
      if (result.success) {
        setStatus({ type: 'success', message: 'Photo uploaded successfully! 🌱' });
        setSelectedFile(null);
        setNote('');
        setShowUpload(false);
        
        // Clear file input
        const fileInput = document.getElementById('photo-upload');
        if (fileInput) fileInput.value = '';
        
        // Clear status after 3 seconds
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      } else {
        setStatus({ type: 'error', message: result.error });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
    }
  };
  
  const cancelUpload = () => {
    setShowUpload(false);
    setSelectedFile(null);
    setNote('');
    setStatus({ type: '', message: '' });
    
    const fileInput = document.getElementById('photo-upload');
    if (fileInput) fileInput.value = '';
  };
  
  return (
    <GalleryContainer>
      <GalleryHeader>
        <GalleryTitle>
          📸 Growth Gallery
        </GalleryTitle>
        <Button 
          variant="primary" 
          onClick={() => setShowUpload(!showUpload)}
        >
          {showUpload ? '✕ Cancel' : '📷 Add Photo'}
        </Button>
      </GalleryHeader>
      
      {photos.length > 0 && (
        <GrowthStats>
          <StatBox>
            <StatNumber>{stats.totalPhotos}</StatNumber>
            <StatLabel>Photos</StatLabel>
          </StatBox>
          <StatBox>
            <StatNumber>{stats.trackingDays}</StatNumber>
            <StatLabel>Days Tracked</StatLabel>
          </StatBox>
          <StatBox>
            <StatNumber>{stats.weeksCovered}</StatNumber>
            <StatLabel>Weeks</StatLabel>
          </StatBox>
        </GrowthStats>
      )}
      
      {showUpload && (
        <UploadSection>
          <UploadTitle>📷 Capture Growth Moment</UploadTitle>
          <UploadForm onSubmit={handleUpload}>
            <FileInputLabel htmlFor="photo-upload">
              📷 Choose Photo
            </FileInputLabel>
            <FileInput 
              id="photo-upload"
              type="file" 
              accept="image/*" 
              onChange={handleFileSelect}
            />
            
            {selectedFile && (
              <PreviewImage src={URL.createObjectURL(selectedFile)} />
            )}
            
            <NoteTextarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's happening with your plant? (new leaves, growth changes, etc.)"
              rows={3}
            />
            
            <ButtonRow>
              <Button variant="text" onClick={cancelUpload}>
                Cancel
              </Button>
              <Button type="submit" disabled={!selectedFile}>
                🌱 Save Photo
              </Button>
            </ButtonRow>
          </UploadForm>
          
          {status.message && (
            <StatusMessage className={status.type}>
              {status.message}
            </StatusMessage>
          )}
        </UploadSection>
      )}
      
      {/* Status Messages */}
      {status.message && !showUpload && (
        <StatusMessage className={status.type}>
          {status.message}
        </StatusMessage>
      )}
      
      {photos.length > 0 ? (
        <PhotosGrid>
          {photos.map((photo, index) => (
            <PhotoCard key={index} onClick={() => handlePhotoClick(photo, index)}>
              <PhotoImage src={photo.url} />
              <PhotoInfo>
                <PhotoDate>{formatDate(photo.timestamp)}</PhotoDate>
                <PhotoTimeAgo>{getTimeAgo(photo.timestamp)}</PhotoTimeAgo>
                {photo.note && (
                  <PhotoNote>"{photo.note}"</PhotoNote>
                )}
              </PhotoInfo>
            </PhotoCard>
          ))}
        </PhotosGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>🌱</EmptyIcon>
          <EmptyText>Start documenting your plant's growth journey!</EmptyText>
          <Button onClick={() => setShowUpload(true)}>
            📷 Take First Photo
          </Button>
        </EmptyState>
      )}
      
      {/* Photo Modal */}
      {selectedPhoto && (
        <PhotoModal onClick={closeModal}>
          <ModalClose onClick={closeModal}>×</ModalClose>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalImage src={selectedPhoto.url} />
            <ModalInfo>
              <ModalDetails>
                <PhotoDate>{formatDate(selectedPhoto.timestamp)}</PhotoDate>
                <PhotoTimeAgo>{getTimeAgo(selectedPhoto.timestamp)}</PhotoTimeAgo>
                {selectedPhoto.note && (
                  <PhotoNote style={{ maxHeight: 'none', marginTop: '12px' }}>
                    "{selectedPhoto.note}"
                  </PhotoNote>
                )}
              </ModalDetails>
              <ModalActions>
                <DeleteButton 
                  onClick={handleDeletePhoto}
                  disabled={deleting}
                >
                  {deleting ? '🗑️ Deleting...' : '🗑️ Delete'}
                </DeleteButton>
              </ModalActions>
            </ModalInfo>
          </ModalContent>
        </PhotoModal>
      )}
    </GalleryContainer>
  );
};

export default PhotoGallery;