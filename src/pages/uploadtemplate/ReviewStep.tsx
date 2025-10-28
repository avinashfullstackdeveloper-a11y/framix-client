import React, { useState, useEffect } from 'react';
import { FormData } from './DetailsFormStep';

// FileInformation Component
interface FileInformationProps {
  selectedFile: File | null;
  previewImagesCount: number;
  tagsCount: number;
}

const FileInformation: React.FC<FileInformationProps> = ({
  selectedFile,
  previewImagesCount,
  tagsCount,
}) => {
  const fileInfo = [
    { label: 'File Name:', value: selectedFile?.name || 'No file selected' },
    { label: 'Preview Images:', value: previewImagesCount.toString() },
    { label: 'Tags:', value: tagsCount.toString() }
  ];

  return (
    <section className="bg-black border flex flex-col text-base mt-6 p-6 rounded-2xl border-[rgba(255,154,201,0.6)] border-solid w-full">
      <header className="flex flex-col text-white justify-center pb-4">
        <h2 className="text-xl font-semibold">File Information</h2>
      </header>
      
      <div className="space-y-4">
        {fileInfo.map((info) => (
          <div
            key={info.label}
            className="flex justify-between items-center py-2"
          >
            <div className="text-[rgba(198,198,198,1)] flex-1">
              {info.label}
            </div>
            <div className="text-white flex-1 text-right font-medium">
              {info.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// QuickEditPanel Component
interface QuickEditPanelProps {
  onEditUpload?: () => void;
  onEditDetails?: () => void;
  onEditPricing?: () => void;
}

const QuickEditPanel: React.FC<QuickEditPanelProps> = ({
  onEditUpload,
  onEditDetails,
  onEditPricing,
}) => {
  const editOptions = [
    { id: 'upload', label: 'Upload File', onClick: onEditUpload },
    { id: 'details', label: 'Edit Details', onClick: onEditDetails },
    { id: 'pricing', label: 'Edit Pricing', onClick: onEditPricing }
  ];

  return (
    <section className="bg-black border flex flex-col text-base text-white p-6 rounded-2xl border-[rgba(255,154,201,0.6)] border-solid w-full mt-6">
      <header className="flex flex-col justify-center pb-4">
        <h2 className="text-xl font-semibold">Quick Edit</h2>
      </header>
      
      <div className="space-y-3">
        {editOptions.map((option) => (
          <button
            key={option.id}
            onClick={option.onClick}
            className="flex w-full items-center justify-between p-4 rounded-[18px] hover:bg-gray-800 transition-colors group border border-transparent hover:border-[rgba(255,154,201,0.3)]"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">{option.label}</span>
            </div>
            <img
              src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/234371d7b27e753356cdb80230f393600bd6f28d?placeholderIfAbsent=true"
              alt=""
              className="aspect-[1] object-contain w-4 group-hover:opacity-80 transition-opacity"
            />
          </button>
        ))}
      </div>
    </section>
  );
};

// SubmissionForm Component
interface SubmissionFormProps {
  onSubmit: () => void;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit }) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfirmed) {
      onSubmit();
    }
  };

  return (
    <section className="bg-[rgba(255,154,201,0.24)] border flex flex-col w-full p-6 rounded-2xl border-[rgba(255,154,201,1)] border-solid mt-6">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-start gap-3 text-xl text-white pb-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="sr-only"
            />
            <div 
              className={`bg-black shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border flex w-5 h-5 mt-1 rounded border-[rgba(255,154,201,0.6)] border-solid flex-shrink-0 ${
                isConfirmed ? 'bg-[rgba(255,154,201,1)]' : ''
              }`}
            >
              {isConfirmed && (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <span className="flex-1 leading-relaxed">
              I confirm this is my original work and I have the rights to sell this template
            </span>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={!isConfirmed}
          className={`flex w-full items-center justify-center gap-2 text-sm text-black font-medium leading-none py-3 rounded-[18px] transition-all ${
            isConfirmed 
              ? 'bg-[rgba(255,154,201,1)] hover:bg-[rgba(255,154,201,0.9)]' 
              : 'bg-gray-400 cursor-not-allowed opacity-50'
          }`}
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/a91dbb81d89fa77116dc78deeabbb87dcc308f9f?placeholderIfAbsent=true"
            alt=""
            className="w-4 h-4"
          />
          Submit for Review
        </button>
        
        <p className="text-base text-[rgba(198,198,198,1)] text-center mt-4">
          Your template will be reviewed within 24-48 hours
        </p>
      </form>
    </section>
  );
};

// TemplatePreview Component
interface TemplatePreviewProps {
  formData: FormData;
  imageFiles: FileList | null;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ formData, imageFiles }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Create object URLs from File objects and cleanup on unmount
  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const urls: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        urls.push(URL.createObjectURL(imageFiles[i]));
      }
      setImageUrls(urls);

      // Cleanup function to revoke object URLs
      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setImageUrls([]);
    }
  }, [imageFiles]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/714734d78a1cd840a5ad666e66625408ed8271bf?placeholderIfAbsent=true' },
    { id: 'media', label: 'Media', icon: 'https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/1e7edf52d2fc69984e7df2dca2743cbac8812f38?placeholderIfAbsent=true' },
    { id: 'pricing', label: 'Pricing', icon: 'https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/09160dbd025f8889e69888f3b1d5b4c0cd6ff6f0?placeholderIfAbsent=true' }
  ];

  return (
    <article className="bg-black border overflow-hidden font-medium w-full rounded-2xl border-[rgba(255,154,201,0.6)] border-solid">
      <img
        src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/715bc3418cd3b5f0bb4b111fabd075839e8d7caa?placeholderIfAbsent=true"
        alt="Template Preview"
        className="w-full h-auto object-cover"
      />
      
      <div className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl text-white font-semibold mb-2">
            {formData.templateName || 'Template Name'}
          </h1>
          <p className="text-xl text-[rgba(198,198,198,1)]">
            {formData.shortTagline || 'Template tagline'}
          </p>
        </header>
        
        <div>
          <div className="bg-black flex text-sm text-white leading-none rounded-[18px] p-1 mb-6" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 flex-1 justify-center py-2 rounded-[14px] transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[rgba(255,154,201,1)] text-black'
                    : 'hover:bg-gray-800'
                }`}
              >
                <img
                  src={tab.icon}
                  alt=""
                  className="w-4 h-4"
                />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          <div className="text-base" role="tabpanel">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <section>
                  <h3 className="text-white text-lg font-semibold mb-2">Description</h3>
                  <p className="text-[rgba(198,198,198,1)] leading-relaxed">
                    {formData.description || 'No description provided'}
                  </p>
                </section>
                
                {formData.liveDemoLink && (
                  <section>
                    <h3 className="text-white text-lg font-semibold mb-2">Live Demo</h3>
                    <a
                      href={formData.liveDemoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[rgba(255,154,201,1)] underline hover:opacity-80 transition-opacity break-all"
                    >
                      {formData.liveDemoLink}
                    </a>
                  </section>
                )}
                
                {formData.teamCredits && (
                  <section>
                    <h3 className="text-white text-lg font-semibold mb-2">Credits</h3>
                    <p className="text-[rgba(198,198,198,1)]">
                      {formData.teamCredits}
                    </p>
                  </section>
                )}
              </div>
            )}
            
            {activeTab === 'media' && (
              <div className="text-white">
                {imageUrls.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {imageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="aspect-[2.43] object-contain w-full max-w-[622px] rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-[rgba(198,198,198,1)]">No preview images uploaded</p>
                )}
              </div>
            )}
            
            {activeTab === 'pricing' && (
              <div className="flex w-full flex-col items-start gap-4 bg-[rgba(255,154,201,0.20)] pt-[24.667px] pb-[0.667px] px-[24.667px] rounded-[18px] border-[0.667px] border-solid border-[#FF479C] max-sm:p-4">
                <div className="flex h-6 justify-between items-center w-full">
                  <div className="flex justify-center items-center">
                    <span className="text-[#C6C6C6] text-base font-normal leading-6">Price</span>
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="text-white text-base font-normal leading-6">$100</span>
                  </div>
                </div>
                <div className="flex h-[73px] flex-col items-start gap-2 w-full pt-[17px] border-t-[0.667px] border-t-[rgba(255,154,201,0.30)] border-solid">
                  <div className="flex items-center w-full">
                    <span className="text-[#C6C6C6] text-base font-normal leading-6">License Type</span>
                  </div>
                  <div className="flex items-center w-full">
                    <span className="text-white text-base font-normal leading-6">Personal</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

// Main ReviewStep Component
interface ReviewStepProps {
  formData: FormData;
  selectedFile: File | null;
  imageFiles: FileList | null;
  onBack: () => void;
  onSubmit: () => void;
  onEditUpload?: () => void;
  onEditDetails?: () => void;
  onEditPricing?: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  selectedFile,
  imageFiles,
  onBack,
  onSubmit,
  onEditUpload,
  onEditDetails,
  onEditPricing,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-8 bg-black">
      <div className="flex w-full max-w-7xl gap-8 max-md:flex-col max-md:gap-6">
        {/* Left Side - Template Preview */}
        <div className="flex-1 min-w-0">
          <TemplatePreview formData={formData} imageFiles={imageFiles} />
        </div>

        {/* Right Sidebar - Information Panels */}
        <div className="flex flex-col w-[400px] max-md:w-full max-md:max-w-full">
          {/* File Information */}
          <FileInformation
            selectedFile={selectedFile}
            previewImagesCount={imageFiles?.length || 0}
            tagsCount={formData.tags.length}
          />
          
          {/* Quick Edit Panel */}
          <QuickEditPanel
            onEditUpload={onEditUpload || onBack}
            onEditDetails={onEditDetails || onBack}
            onEditPricing={onEditPricing}
          />
          
          {/* Submission Form */}
          <SubmissionForm onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;