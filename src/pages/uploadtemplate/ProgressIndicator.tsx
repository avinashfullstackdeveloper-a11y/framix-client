import React from 'react';

export interface ProgressStep {
  id: number;
  label: string;
  completed: boolean;
  current: boolean;
}

export interface ProgressIndicatorProps {
  steps: ProgressStep[];
  onStepClick?: (stepId: number) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps, onStepClick }) => {
  return (
    <div className="flex justify-center items-center w-full mb-12">
      <div className="inline-flex h-20 items-center gap-[68px] shrink-0 box-border pr-2.5 max-md:gap-10 max-sm:flex-col max-sm:h-auto max-sm:gap-5 max-sm:p-0">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex flex-col items-center relative"
          >
            <button
              onClick={() => onStepClick?.(step.id)}
              className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div
                className={`flex w-12 h-12 justify-center items-center box-border rounded-full ${
                  step.completed || step.current
                    ? step.current
                      ? 'bg-white'
                      : 'bg-[#FF9AC9]'
                    : 'bg-gray-600'
                }`}
              >
                <div className="flex w-[9px] h-6 flex-col justify-center items-center shrink-0 box-border">
                  {step.completed ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"check-icon\" style=\"box-sizing: border-box; width: 24px; height: 24px; flex-shrink: 0\"> <path d=\"M20 6L9 17L4 12\" stroke=\"black\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> </svg>",
                      }}
                    />
                  ) : (
                    <div className="text-black text-base font-bold leading-6 w-2.5 h-6 box-border">
                      {step.id}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-center items-center box-border">
                <div className="text-white text-base font-normal leading-6 box-border">
                  {step.label}
                </div>
              </div>
            </button>
            {index < steps.length - 1 && (
              <div className="hidden sm:block w-20 h-0.5 bg-gray-400 absolute right-[-89px] top-6" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;