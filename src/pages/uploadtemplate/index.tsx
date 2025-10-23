import React, { useState, useRef } from 'react';
import ProgressIndicator, { ProgressStep } from './ProgressIndicator';
import UploadStep from './UploadStep';
import DetailsFormStep, { FormData } from './DetailsFormStep';
import ReviewStep from './ReviewStep';

const CombinedTemplateUpload: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    templateName: '',
    shortTagline: '',
    description: '',
    category: '',
    tags: [],
    liveDemoLink: '',
    teamCredits: '',
  });

  const [newTag, setNewTag] = useState('');
  const [videoFiles, setVideoFiles] = useState<FileList | null>(null);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    'Dashboard',
    'Landing Page',
    'E-commerce',
    'Portfolio',
    'Blog',
    'Admin Panel',
    'SaaS',
    'Mobile App',
  ];

  const progressSteps: ProgressStep[] = [
    { id: 1, label: 'Upload', completed: currentStep > 1, current: currentStep === 1 },
    { id: 2, label: 'Details', completed: currentStep > 2, current: currentStep === 2 },
    { id: 3, label: 'Media', completed: currentStep > 3, current: currentStep === 3 },
    { id: 4, label: 'Pricing', completed: currentStep > 4, current: currentStep === 4 },
  ];

  // Upload Step Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (isValidFileType(file)) {
        setSelectedFile(file);
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = ['.fig', '.xd', '.sketch', '.zip'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return validTypes.includes(fileExtension);
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFigmaImport = () => {
    console.log('Import from Figma clicked');
  };

  const handleAddDetails = () => {
    if (selectedFile) {
      setCurrentStep(2);
    }
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId === 1 || (stepId === 2 && selectedFile)) {
      setCurrentStep(stepId);
    }
  };

  // Form Step Handlers
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleVideoUpload = (files: FileList | null) => {
    setVideoFiles(files);
  };

  const handleImageUpload = (files: FileList | null) => {
    setImageFiles(files);
  };

  const handleNextToReview = () => {
    setCurrentStep(3);
  };

  const handleSubmit = () => {
    console.log('Final submission:', formData);
    // Handle final submission logic
  };

  const handleEditUpload = () => {
    setCurrentStep(1);
  };

  const handleEditDetails = () => {
    setCurrentStep(2);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-8 bg-black">
      {/* Progress Steps */}
      <ProgressIndicator steps={progressSteps} onStepClick={handleStepClick} />

      {/* Step 1: Upload */}
      {currentStep === 1 && (
        <UploadStep
          selectedFile={selectedFile}
          isDragOver={isDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFileSelect={handleFileSelect}
          onBrowseFiles={handleBrowseFiles}
          onFigmaImport={handleFigmaImport}
          onAddDetails={handleAddDetails}
          fileInputRef={fileInputRef}
        />
      )}

      {/* Step 2: Template Details Form */}
      {currentStep === 2 && (
        <DetailsFormStep
          formData={formData}
          newTag={newTag}
          videoFiles={videoFiles}
          imageFiles={imageFiles}
          isDropdownOpen={isDropdownOpen}
          categories={categories}
          onInputChange={handleInputChange}
          onNewTagChange={setNewTag}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onKeyPress={handleKeyPress}
          onVideoUpload={handleVideoUpload}
          onImageUpload={handleImageUpload}
          onDropdownToggle={() => setIsDropdownOpen(!isDropdownOpen)}
          onNext={handleNextToReview}
          onGoBack={handleGoBack}
        />
      )}

      {/* Step 3: Review/Preview */}
      {currentStep === 3 && (
        <ReviewStep
          formData={formData}
          selectedFile={selectedFile}
          imageFiles={imageFiles}
          onBack={handleGoBack}
          onSubmit={handleSubmit}
          onEditUpload={handleEditUpload}
          onEditDetails={handleEditDetails}
        />
      )}
    </div>
  );
};

export default CombinedTemplateUpload;