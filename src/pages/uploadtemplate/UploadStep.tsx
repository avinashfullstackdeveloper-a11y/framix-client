import React, { useRef } from 'react';

export interface UploadStepProps {
  selectedFile: File | null;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBrowseFiles: () => void;
  onFigmaImport: () => void;
  onAddDetails: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const UploadStep: React.FC<UploadStepProps> = ({
  selectedFile,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
  onBrowseFiles,
  onFigmaImport,
  onAddDetails,
  fileInputRef,
}) => {
  return (
    <section className="flex w-full flex-col items-center max-w-[672px]">
      <div className="h-[66px] w-full text-white text-center">
        <div className="flex w-full flex-col items-center text-4xl font-semibold leading-none justify-center px-[67px] py-0.5 max-md:max-w-full max-md:px-5">
          <h1 className="z-10">Upload Your Template</h1>
        </div>
        <div className="flex w-full flex-col items-center text-base font-normal justify-center mt-6 px-[67px] py-px max-md:max-w-full max-md:px-5">
          <p className="z-10 max-md:max-w-full">
            Drag & drop your design file or import from Figma/XD/Sketch
          </p>
        </div>
      </div>

      <div
        className={`bg-black shadow-[0px_1px_3px_rgba(0,0,0,0.1)] border flex min-h-[328px] w-full flex-col items-stretch justify-center mt-12 p-[50px] rounded-2xl border-solid max-md:mt-10 max-md:px-5 transition-colors ${
          isDragOver 
            ? 'border-[rgba(255,154,201,1)] bg-gray-900' 
            : 'border-[rgba(255,154,201,0.6)]'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex w-full flex-col items-center max-md:max-w-full">
          <div className="bg-[rgba(255,154,201,1)] flex min-h-20 w-20 items-center justify-center h-20 rounded-2xl">
            <img
              src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/011f4a4f49157da94e0ec76b1e9a487c240f94f7?placeholderIfAbsent=true"
              alt="Upload icon"
              className="aspect-[1] object-contain w-10 self-stretch my-auto"
            />
          </div>
          
          <div className="text-white text-base font-normal text-center mt-[22px]">
            {selectedFile ? `Selected: ${selectedFile.name}` : 'Drop your file here'}
          </div>
          
          <div className="text-[rgba(187,187,187,1)] text-base font-normal text-center mt-2">
            Supported formats: .fig / .xd / .sketch / .zip
          </div>
          
          <div className="self-stretch flex min-h-9 items-center gap-4 text-sm font-medium leading-none justify-center flex-wrap mt-[34px]">
            <button
              onClick={onBrowseFiles}
              className="bg-[rgba(255,154,201,1)] self-stretch flex items-stretch gap-3 text-black w-[134px] my-auto px-3 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/4e556790b0e6fb8e9113ab76cbaf79dab9020b5e?placeholderIfAbsent=true"
                alt="Browse files icon"
                className="aspect-[1] object-contain w-4 shrink-0 my-auto"
              />
              <span>Browse Files</span>
            </button>
            
            <button
              onClick={onFigmaImport}
              className="bg-white border self-stretch flex items-stretch gap-4 text-neutral-950 w-[181px] my-auto px-3.5 py-2 rounded-lg border-[rgba(255,154,201,0.6)] border-solid hover:bg-gray-50 transition-colors"
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/153d14bde024c573c4d5b8409186dbd69ba354ab?placeholderIfAbsent=true"
                alt="Figma icon"
                className="aspect-[1] object-contain w-4 shrink-0 my-auto"
              />
              <span className="basis-auto">Import from Figma</span>
            </button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".fig,.xd,.sketch,.zip"
        onChange={onFileSelect}
        className="hidden"
        aria-label="File upload input"
      />

      <button
        onClick={onAddDetails}
        disabled={!selectedFile}
        className={`flex min-h-9 items-center gap-2 text-sm font-semibold leading-none justify-center mt-8 px-8 py-2 rounded-[10px] max-md:px-5 transition-opacity ${
          selectedFile 
            ? 'bg-[rgba(255,154,201,1)] text-black hover:opacity-90' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        <div className="self-stretch my-auto">Add Details</div>
      </button>
    </section>
  );
};

export default UploadStep;