import React from 'react';
import FileUpload from './FileUpload';

export interface FormData {
  templateName: string;
  shortTagline: string;
  description: string;
  category: string;
  tags: string[];
  liveDemoLink: string;
  teamCredits: string;
}

export interface DetailsFormStepProps {
  formData: FormData;
  newTag: string;
  videoFiles: FileList | null;
  imageFiles: FileList | null;
  isDropdownOpen: boolean;
  categories: string[];
  onInputChange: (field: keyof FormData, value: string) => void;
  onNewTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onVideoUpload: (files: FileList | null) => void;
  onImageUpload: (files: FileList | null) => void;
  onDropdownToggle: () => void;
  onNext: () => void;
  onGoBack: () => void;
}

const DetailsFormStep: React.FC<DetailsFormStepProps> = ({
  formData,
  newTag,
  videoFiles,
  imageFiles,
  isDropdownOpen,
  categories,
  onInputChange,
  onNewTagChange,
  onAddTag,
  onRemoveTag,
  onKeyPress,
  onVideoUpload,
  onImageUpload,
  onDropdownToggle,
  onNext,
  onGoBack,
}) => {
  return (
    <div className="flex w-full max-w-6xl flex-col items-center gap-12 shrink-0 box-border px-0 py-3 max-md:w-full max-md:px-5 max-md:py-3 max-md:inset-x-5 max-sm:w-full max-sm:px-0 max-sm:py-3 max-sm:inset-x-0">
      <header className="flex h-[114px] flex-col justify-center items-center gap-8 shrink-0 self-stretch box-border max-md:w-full">
        <div className="flex justify-center items-center self-stretch box-border pb-[3px] max-md:w-full">
          <h1 className="text-white text-center text-[40px] font-semibold leading-[30px] h-[30px] box-border max-md:w-full">
            Template Details
          </h1>
        </div>
        <div className="flex justify-center items-center self-stretch box-border max-md:w-full">
          <p className="text-white text-xl font-normal leading-6 h-6 box-border max-md:w-full">
            Provide information about your template
          </p>
        </div>
      </header>

      <div className="flex flex-col items-start gap-12 shrink-0 self-stretch box-border bg-black px-8 py-[73px] rounded-2xl border-[0.667px] border-solid border-[rgba(255,154,201,0.60)] max-md:w-full max-md:px-5 max-md:py-10 max-sm:gap-8 max-sm:px-4 max-sm:py-[30px]">
        {/* Template Name */}
        <div className="flex w-full h-[58px] flex-col items-start gap-4 shrink-0 box-border max-md:w-full">
          <label className="flex h-3.5 items-center gap-2 shrink-0 self-stretch box-border max-md:w-full">
            <span className="text-white text-base font-medium leading-[14px] box-border max-md:w-full">
              Template Name *
            </span>
          </label>
          <input
            type="text"
            value={formData.templateName}
            onChange={(e) => onInputChange('templateName', e.target.value)}
            placeholder="e.g., Modern SaaS Dashboard"
            className="flex h-9 items-center shrink-0 self-stretch box-border bg-black px-3 py-1 rounded-[14px] border-[0.667px] border-solid border-[#FF479C] text-white text-sm font-normal placeholder:text-[#717182] focus:outline-none focus:border-[#FF479C] max-md:w-full"
            required
          />
        </div>

        {/* Short Tagline */}
        <div className="flex w-full h-[88px] flex-col items-start gap-4 shrink-0 box-border max-md:w-full">
          <label className="flex h-3.5 items-center gap-2 shrink-0 self-stretch box-border max-md:w-full">
            <span className="text-white text-base font-medium leading-[14px] box-border max-md:w-full">
              Short Tagline *
            </span>
          </label>
          <div className="h-9 shrink-0 self-stretch relative box-border max-md:w-full">
            <input
              type="text"
              value={formData.shortTagline}
              onChange={(e) => onInputChange('shortTagline', e.target.value)}
              placeholder="Brief description in one line"
              maxLength={100}
              className="flex w-full h-9 items-center shrink-0 absolute box-border bg-black pl-3 pr-16 py-1 rounded-[14px] border-[0.667px] border-solid border-[#FF479C] text-white text-sm font-normal placeholder:text-[#717182] focus:outline-none focus:border-[#FF479C] left-0 top-0 max-md:w-full"
              required
            />
            <div className="flex w-[41px] justify-center items-center absolute h-6 box-border right-3 top-1.5 max-md:w-full">
              <span className="w-[41px] shrink-0 text-[#99A1AF] text-base font-normal leading-6 h-6 box-border max-md:w-full">
                {formData.shortTagline.length}/100
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex w-full h-[182px] flex-col items-start gap-4 shrink-0 box-border max-md:w-full">
          <label className="flex h-3.5 items-center gap-2 shrink-0 self-stretch box-border max-md:w-full">
            <span className="text-white text-base font-medium leading-[14px] box-border max-md:w-full">
              Overview / Description *
            </span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Describe your template, its features, and use cases..."
            maxLength={500}
            className="flex h-32 items-start shrink-0 self-stretch box-border bg-black px-3 py-2 rounded-[14px] border-[0.667px] border-solid border-[#FF479C] text-white text-sm font-normal leading-5 placeholder:text-[#717182] focus:outline-none focus:border-[#FF479C] resize-none max-md:w-full"
            required
          />
          <div className="flex h-6 justify-between items-start shrink-0 self-stretch box-border max-md:w-full">
            <div className="flex justify-end items-center box-border max-md:w-full">
              <span className="text-[#B5B5B5] text-base font-medium leading-6 w-[204px] h-6 box-border max-md:w-full">
                Provide a detailed overview
              </span>
            </div>
            <div className="flex w-[41px] justify-center items-center box-border max-md:w-full">
              <span className="w-[41px] shrink-0 text-gray-500 text-base font-normal leading-6 h-6 box-border max-md:w-full">
                {formData.description.length}/500
              </span>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="flex w-full h-[58px] flex-col items-start gap-4 shrink-0 box-border max-md:w-full">
          <label className="flex h-3.5 items-center gap-2 shrink-0 self-stretch box-border max-md:w-full">
            <span className="text-white text-base font-medium leading-[14px] box-border max-md:w-full">
              Category *
            </span>
          </label>
          <div className="relative w-full">
            <button
              type="button"
              onClick={onDropdownToggle}
              className="flex h-9 justify-between items-center shrink-0 self-stretch w-full box-border bg-black px-3 py-0 rounded-[14px] border-[0.667px] border-solid border-[#FF479C] focus:outline-none focus:border-[#FF479C] max-md:w-full"
            >
              <span className="flex w-[105px] h-5 items-center gap-2 box-border max-md:w-full">
                <span className="text-sm font-normal leading-5 box-border max-md:w-full text-left">
                  {formData.category || (
                    <span className="text-[#717182]">Select a category</span>
                  )}
                </span>
              </span>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"dropdown-icon\" style=\"box-sizing: border-box; width: 20px; height: 20px; aspect-ratio: 1/1\"> <path d=\"M5 7.5L10 12.5L15 7.5\" stroke=\"white\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> </svg>",
                }}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-[#FF479C] rounded-[14px] z-10 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      onInputChange('category', category);
                      onDropdownToggle();
                    }}
                    className="w-full text-left px-3 py-2 text-white hover:bg-[#FF479C] hover:text-black transition-colors text-sm"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex w-full h-[88px] flex-col items-start gap-4 shrink-0 box-border max-md:w-full">
          <div className="flex h-8 justify-between items-center shrink-0 self-stretch box-border max-md:w-full">
            <label className="flex w-7 h-3.5 items-center gap-2 box-border max-md:w-full">
              <span className="text-white text-base font-medium leading-[14px] box-border max-md:w-full">
                Tags
              </span>
            </label>
            <button
              type="button"
              className="flex justify-center items-end gap-2.5 box-border pl-2.5 pr-[9.531px] pt-[4.667px] pb-[7.333px] rounded-lg hover:bg-[rgba(255,154,201,0.1)] transition-colors max-md:w-full"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"ai-suggest-icon\" style=\"box-sizing: border-box; width: 16px; height: 16px\"> <g clip-path=\"url(#clip0_518_4924)\"> <path d=\"M6.6243 10.3334C6.56478 10.1027 6.44453 9.89215 6.27605 9.72367C6.10757 9.55519 5.89702 9.43494 5.6663 9.37542L1.5763 8.32075C1.50652 8.30095 1.44511 8.25892 1.40138 8.20105C1.35765 8.14318 1.33398 8.07262 1.33398 8.00008C1.33398 7.92755 1.35765 7.85699 1.40138 7.79912C1.44511 7.74125 1.50652 7.69922 1.5763 7.67942L5.6663 6.62408C5.89693 6.56462 6.10743 6.44447 6.2759 6.27611C6.44438 6.10775 6.56468 5.89734 6.6243 5.66675L7.67897 1.57675C7.69857 1.5067 7.74056 1.44498 7.79851 1.40101C7.85647 1.35705 7.92722 1.33325 7.99997 1.33325C8.07271 1.33325 8.14346 1.35705 8.20142 1.40101C8.25938 1.44498 8.30136 1.5067 8.32097 1.57675L9.37497 5.66675C9.43449 5.89747 9.55474 6.10802 9.72322 6.2765C9.8917 6.44498 10.1023 6.56523 10.333 6.62475L14.423 7.67875C14.4933 7.69815 14.5553 7.74009 14.5995 7.79814C14.6437 7.85618 14.6677 8.02713 14.6677 8.00008C14.6677 8.07304 14.6437 8.14399 14.5995 8.20203C14.5553 8.26008 14.4933 8.30202 14.423 8.32142L10.333 9.37542C10.1023 9.43494 9.8917 9.55519 9.72322 9.72367C9.55474 9.89215 9.43449 10.1027 9.37497 10.3334L8.3203 14.4234C8.3007 14.4935 8.25871 14.5552 8.20075 14.5992C8.1428 14.6431 8.07205 14.6669 7.9993 14.6669C7.92656 14.6669 7.85581 14.6431 7.79785 14.5992C7.73989 14.5552 7.69791 14.4935 7.6783 14.4234L6.6243 10.3334Z\" stroke=\"#FF479C\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> <path d=\"M13.334 2V4.66667\" stroke=\"#FF479C\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> <path d=\"M14.6667 3.33325H12\" stroke=\"#FF479C\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> <path d=\"M2.66602 11.3333V12.6666\" stroke=\"#FF479C\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> <path d=\"M3.33333 12H2\" stroke=\"#FF479C\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> </g> <defs> <clipPath id=\"clip0_518_4924\"> <rect width=\"16\" height=\"16\" fill=\"white\"></rect> </clipPath> </defs> </svg>",
                }}
              />
              <span className="text-[#FF479C] text-sm font-normal leading-5 w-[69px] h-5 box-border max-md:w-full">
                AI Suggest
              </span>
            </button>
          </div>
          <div className="flex h-9 items-start gap-2 shrink-0 self-stretch box-border max-md:w-full">
            <input
              type="text"
              value={newTag}
              onChange={(e) => onNewTagChange(e.target.value)}
              onKeyPress={onKeyPress}
              placeholder="Add tags..."
              className="flex w-full h-9 items-center box-border bg-black px-3 py-1 rounded-[14px] border-[0.667px] border-solid border-[#FF479C] text-white text-sm font-normal placeholder:text-[#717182] focus:outline-none focus:border-[#FF479C] max-md:w-full"
            />
            <button
              type="button"
              onClick={onAddTag}
              className="flex w-10 h-9 justify-center items-center box-border bg-[#FF479C] rounded-[14px] hover:bg-[#FF7AB8] transition-colors max-md:w-full"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"add-icon\" style=\"box-sizing: border-box; width: 16px; height: 16px; flex-shrink: 0\"> <path d=\"M3.33398 8H12.6673\" stroke=\"black\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> <path d=\"M8 3.33325V12.6666\" stroke=\"black\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> </svg>",
                }}
              />
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF479C] text-black text-sm rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => onRemoveTag(tag)}
                    className="ml-1 text-black hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* File Uploads */}
        <div className="flex w-full items-start gap-6 box-border max-md:w-full max-md:flex-col">
          <FileUpload
            label="Add video"
            accept="video/*"
            onFileSelect={onVideoUpload}
            uploadedCount={videoFiles?.length || 0}
            maxCount={1}
            type="video"
          />
          <FileUpload
            label="Preview Images * (Min 3, Max 10)"
            accept="image/*"
            multiple
            onFileSelect={onImageUpload}
            uploadedCount={imageFiles?.length || 0}
            maxCount={10}
            type="image"
          />
        </div>

        {/* Additional Fields */}
        <div className="flex w-full h-[193px] flex-col items-start gap-6 shrink-0 box-border pt-[17px] max-md:w-full">
          <div className="flex h-[74px] flex-col items-start gap-4 shrink-0 self-stretch box-border max-md:w-full">
            <label className="flex h-3.5 items-center gap-2 shrink-0 self-stretch box-border max-md:w-full">
              <span className="text-white text-base font-medium leading-[14px] box-border max-md:w-full">
                Live Demo Link (Optional)
              </span>
            </label>
            <input
              type="url"
              value={formData.liveDemoLink}
              onChange={(e) => onInputChange('liveDemoLink', e.target.value)}
              placeholder="https://demo.yourtemplate.com"
              className="flex h-9 items-center shrink-0 self-stretch box-border bg-black px-3 py-1 rounded-[14px] border-[0.667px] border-solid border-[#FF479C] text-white text-sm font-normal placeholder:text-[#717182] focus:outline-none focus:border-[#FF479C] max-md:w-full"
            />
          </div>
          <div className="flex h-[87px] flex-col items-start gap-4 shrink-0 self-stretch box-border max-md:w-full">
            <label className="flex h-3.5 items-center gap-2 shrink-0 self-stretch box-border max-md:w-full">
              <span className="text-white text-base font-medium leading-[14px] box-border max-md:w-full">
                Team / Credits (Optional)
              </span>
            </label>
            <input
              type="text"
              value={formData.teamCredits}
              onChange={(e) => onInputChange('teamCredits', e.target.value)}
              placeholder="Design by John Doe, Development by Jane Smith"
              className="flex h-9 items-center shrink-0 self-stretch box-border bg-black px-3 py-1 rounded-[14px] border-[0.667px] border-solid border-[#FF479C] text-white text-sm font-normal placeholder:text-[#717182] focus:outline-none focus:border-[#FF479C] max-md:w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex h-9 justify-between items-start shrink-0 self-stretch box-border max-md:w-full max-md:flex-col max-md:gap-4">
          <button
            type="button"
            onClick={onGoBack}
            className="flex w-[120px] h-9 justify-center items-center gap-2 border box-border bg-black px-6 py-2 rounded-[14px] border-solid border-[rgba(255,154,201,0.60)] text-white text-sm font-normal leading-5 hover:border-[#FF479C] transition-colors max-md:w-full"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="flex w-[260px] h-9 justify-center items-center gap-2 box-border bg-[#FF479C] px-8 py-2 rounded-[14px] text-black text-sm font-bold leading-5 hover:bg-[#FF7AB8] transition-colors max-md:w-full"
          >
            Set Price &amp; License
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsFormStep;