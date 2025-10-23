import React, { useRef } from 'react';

export interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onFileSelect: (files: FileList | null) => void;
  uploadedCount: number;
  maxCount: number;
  type: 'video' | 'image';
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept,
  multiple = false,
  onFileSelect,
  uploadedCount,
  maxCount,
  type,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(event.target.files);
  };

  return (
    <div className="flex flex-col items-start gap-4 relative box-border pb-3 max-md:w-full max-md:px-5 max-md:py-3 max-md:inset-x-5 max-sm:w-full max-sm:px-0 max-sm:py-3 max-sm:top-[200px] max-sm:inset-x-0">
      <div className="flex h-3.5 items-center gap-2 w-[534px] box-border max-md:w-full">
        <label className="text-white text-base font-semibold leading-[14px] box-border max-md:w-full">
          {label}
        </label>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="w-[170px] h-24 border relative box-border rounded-[10px] border-solid border-[rgba(255,154,201,0.60)] hover:border-[#FF9AC9] transition-colors max-md:w-full"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          aria-label={label}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            dangerouslySetInnerHTML={{
              __html:
                "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"upload-icon\" style=\"box-sizing: border-box; width: 24px; height: 24px; flex-shrink: 0\"> <path d=\"M12 3V15\" stroke=\"#99A1AF\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> <path d=\"M17 8L12 3L7 8\" stroke=\"#99A1AF\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> <path d=\"M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15\" stroke=\"#99A1AF\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> </svg>",
            }}
          />
          <span className="text-[#6A7282] text-base font-normal leading-6 mt-2">
            Add
          </span>
        </div>
      </button>
      <div className="flex h-6 items-center w-[534px] box-border pl-[0.333px] py-0 max-md:w-full">
        <div className="text-[#B5B5B5] text-base font-normal leading-6 box-border max-md:w-full">
          {uploadedCount}/{maxCount < 10 ? `0${maxCount}` : maxCount} {type === 'video' ? 'Video' : 'images'} {type === 'video' ? 'Uploaded' : 'uploaded'}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;