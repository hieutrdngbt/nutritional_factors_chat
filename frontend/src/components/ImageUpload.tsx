import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNutritionChatStore } from '../store/nutrition-chat-store';
import './ImageUpload.css';

function ImageUpload() {
  const { t } = useTranslation();
  const { uploadAndAnalyzeImage, isAnalyzing } = useNutritionChatStore();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert(t('nutrition_chat.upload.error.invalid_type'));
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert(t('nutrition_chat.upload.error.file_too_large'));
      return false;
    }

    return true;
  };

  const handleFile = async (file: File) => {
    if (!validateFile(file)) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload and analyze
    try {
      await uploadAndAnalyzeImage(file);
    } catch (error) {
      setPreview(null);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      <h2>{t('nutrition_chat.upload.title')}</h2>
      <p className="upload-description">{t('nutrition_chat.upload.description')}</p>

      <div
        className={`dropzone ${isDragging ? 'dragging' : ''} ${isAnalyzing ? 'analyzing' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            {isAnalyzing && (
              <div className="analyzing-overlay">
                <div className="spinner"></div>
                <p>{t('nutrition_chat.upload.analyzing')}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="upload-prompt">
            <svg
              className="upload-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="drag-text">{t('nutrition_chat.upload.drag_drop')}</p>
            <p className="or-text">{t('nutrition_chat.upload.or')}</p>
            <button type="button" className="browse-button">
              {t('nutrition_chat.upload.browse')}
            </button>
            <p className="file-info">{t('nutrition_chat.upload.file_info')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
