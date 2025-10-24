import React from "react";
import { useNavigate } from "react-router-dom";

// Types
export type ComponentType =
  | "button"
  | "toggle"
  | "checkbox"
  | "card"
  | "loader"
  | "input"
  | "form"
  | "pattern"
  | "radio"
  | "tooltip";
export type TechnologyType = "css" | "tailwind";

export interface ComponentSelectorPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  onContinue?: (
    selectedComponent: ComponentType,
    selectedTechnology: TechnologyType
  ) => void;
  initialComponent?: ComponentType;
  initialTechnology?: TechnologyType;
}

// Icon Components
const ButtonIcon: React.FC = () => (
  <div className="bg-[rgba(255,71,156,1)] flex min-h-8 w-16 items-center pl-2 rounded-[26843500px]">
    <div className="bg-white self-stretch flex min-h-4 w-4 h-4 my-auto rounded-[26843500px]" />
  </div>
);

const ToggleIcon: React.FC = () => (
  <div className="bg-[rgba(74,74,74,1)] flex min-h-8 w-16 items-center pl-2 rounded-[26843500px]">
    <div className="bg-[rgba(106,106,106,1)] self-stretch flex min-h-6 w-6 h-6 my-auto rounded-[26843500px]" />
  </div>
);

const CheckboxIcon: React.FC = () => (
  <div className="bg-[rgba(74,74,74,1)] flex min-h-12 w-12 items-center justify-center h-12 rounded-[10px]">
    <div className="aspect-[1] object-contain w-6 self-stretch my-auto bg-[rgba(106,106,106,1)] rounded-sm" />
  </div>
);

const CardIcon: React.FC = () => (
  <div className="bg-[rgba(74,74,74,1)] min-h-16 w-14 pl-2 py-2 rounded-[10px]">
    <div className="flex min-h-1 w-full gap-1">
      <div className="rounded bg-[rgba(106,106,106,1)] flex w-3 shrink-0 h-1" />
      <div className="rounded bg-[rgba(106,106,106,1)] flex w-3 shrink-0 h-1" />
    </div>
    <div className="rounded bg-[rgba(106,106,106,1)] flex min-h-10 w-full flex-1 h-10 mt-1" />
  </div>
);

const InputIcon: React.FC = () => (
  <div className="flex min-h-10 w-16 items-center pl-2 rounded-[10px] border-[rgba(74,74,74,1)] border-solid border-2">
    <div className="self-stretch flex min-h-1 w-4 gap-0.5 my-auto">
      <div className="bg-[rgba(106,106,106,1)] flex w-1 shrink-0 h-1 rounded-[26843500px]" />
      <div className="bg-[rgba(106,106,106,1)] flex w-1 shrink-0 h-1 rounded-[26843500px]" />
      <div className="bg-[rgba(106,106,106,1)] flex w-full shrink h-1 flex-1 basis-[0%] rounded-[26843500px]" />
    </div>
  </div>
);

const FormIcon: React.FC = () => (
  <div className="min-h-[34px] w-12">
    <div className="rounded bg-[rgba(106,106,106,1)] flex min-h-1.5 w-full" />
    <div className="rounded bg-[rgba(106,106,106,1)] flex min-h-1.5 w-full mt-2" />
    <div className="rounded bg-[rgba(106,106,106,1)] flex min-h-1.5 w-full flex-1 mt-2" />
  </div>
);

const RadioIcon: React.FC = () => (
  <div className="flex min-h-6 w-[88px] gap-2">
    <div className="bg-white flex min-h-6 items-center justify-center w-6 h-6 rounded-[26843500px]">
      <div className="bg-[rgba(42,42,42,1)] self-stretch flex min-h-3 w-3 h-3 my-auto rounded-[26843500px]" />
    </div>
    <div className="flex w-6 shrink-0 h-6 rounded-[26843500px] border-[rgba(106,106,106,1)] border-solid border-2" />
    <div className="flex w-6 shrink h-6 flex-1 basis-[0%] rounded-[26843500px] border-[rgba(106,106,106,1)] border-solid border-2" />
  </div>
);

const TooltipIcon: React.FC = () => (
  <div className="flex flex-col items-center">
    <div className="bg-[rgba(74,74,74,1)] z-10 flex w-3 shrink-0 h-3" />
    <div className="bg-[rgba(74,74,74,1)] flex min-h-8 w-16 items-center justify-center rounded-[10px]">
      <div className="rounded bg-[rgba(106,106,106,1)] self-stretch flex min-h-1 w-8 my-auto" />
    </div>
  </div>
);

const LoaderIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={`bg-[rgba(74,74,74,1)] flex items-center justify-center w-14 h-14 rounded-full ${className}`}
  >
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgba(255,71,156,1)]" />
  </div>
);

const PatternIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={`bg-[rgba(74,74,74,1)] flex items-center justify-center w-14 h-14 rounded-[10px] ${className}`}
  >
    <div className="grid grid-cols-2 gap-1 w-10 h-10">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-[rgba(106,106,106,1)] rounded-sm" />
      ))}
    </div>
  </div>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CSSIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" />
  </svg>
);

const TailwindIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6-2.2-4.2-1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
  </svg>
);

// Component Card
interface ComponentCardProps {
  title: string;
  icon: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  icon,
  isSelected = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center mx-auto rounded-[14px] border-solid border-2 transition-all duration-200 hover:scale-105
        w-full h-auto max-w-[120px] max-h-[120px] min-h-[96px] min-w-[96px]
        sm:min-h-[120px] sm:min-w-[120px] sm:max-w-[120px] sm:max-h-[120px]
        ${
          isSelected
            ? "bg-[rgba(57,20,37,1)] border-[rgba(255,71,156,1)]"
            : "bg-[rgba(26,26,26,1)] border-[rgba(42,42,42,1)] hover:border-[rgba(255,71,156,0.5)]"
        }
      `}
      style={{ aspectRatio: "1 / 1" }}
    >
      <div className="mb-3">{icon}</div>
      <div className="flex flex-col items-stretch text-base text-[rgba(209,213,220,1)] font-semibold justify-center py-px">
        <div className="text-center">{title}</div>
      </div>
    </button>
  );
};

// Technology Selector
interface TechnologySelectorProps {
  selectedTechnology: TechnologyType;
  onTechnologyChange: (technology: TechnologyType) => void;
}

const TechnologySelector: React.FC<TechnologySelectorProps> = ({
  selectedTechnology,
  onTechnologyChange,
}) => {
  return (
    <section className="flex min-h-[47px] w-full items-center gap-4 sm:gap-8 text-base font-semibold justify-center flex-wrap mt-12 max-md:max-w-full max-md:mt-10">
      <div className="self-stretch flex flex-col items-stretch text-white whitespace-nowrap justify-center w-20 my-auto py-0.5">
        <h3 className="z-10 max-md:-mr-2">Technology</h3>
      </div>

      <div className="self-stretch flex min-h-[47px] items-stretch gap-2 sm:gap-3 w-full sm:w-[285px] my-auto">
        <div className="flex items-stretch gap-2 sm:gap-3 justify-center h-full w-full">
          <button
            onClick={() => onTechnologyChange("css")}
            className={`
              flex items-center gap-2 whitespace-nowrap justify-center h-full px-4 sm:px-5 py-[9px] rounded-[10px] border-solid border-2 transition-all duration-200 w-full sm:w-auto
              ${
                selectedTechnology === "css"
                  ? "bg-[rgba(57,20,37,1)] text-white border-[rgba(255,71,156,1)]"
                  : "bg-[rgba(26,26,26,1)] text-[rgba(209,213,220,1)] border-[rgba(42,42,42,1)] hover:border-[rgba(255,71,156,0.5)]"
              }
            `}
          >
            <CSSIcon className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto" />
            <span className="self-stretch my-auto">CSS</span>
          </button>

          <button
            onClick={() => onTechnologyChange("tailwind")}
            className={`
              flex items-center gap-2 justify-center h-full px-4 sm:px-3.5 py-[9px] rounded-[10px] border-solid border-2 transition-all duration-200 w-full sm:w-auto
              ${
                selectedTechnology === "tailwind"
                  ? "bg-[rgba(57,20,37,1)] text-white border-[rgba(255,71,156,1)]"
                  : "bg-[rgba(26,26,26,1)] text-[rgba(209,213,220,1)] border-[rgba(42,42,42,1)] hover:border-[rgba(255,71,156,0.5)]"
              }
            `}
          >
            <TailwindIcon className="aspect-[1] object-contain w-5 self-stretch shrink-0 my-auto" />
            <span className="self-stretch my-auto">Tailwind CSS</span>
          </button>
        </div>
      </div>
    </section>
  );
};

// Main Component Selector Popup
export const ComponentSelectorPopup: React.FC<ComponentSelectorPopupProps> = ({
  isOpen = true,
  onClose,
  onContinue,
  initialComponent = "button",
  initialTechnology = "css",
}) => {
  const navigate = useNavigate();
  const [selectedComponent, setSelectedComponent] =
    React.useState<ComponentType>(initialComponent);
  const [selectedTechnology, setSelectedTechnology] =
    React.useState<TechnologyType>(initialTechnology);

  const components = [
    { id: "button" as ComponentType, title: "Button", icon: <ButtonIcon /> },
    {
      id: "toggle" as ComponentType,
      title: "Toggle switch",
      icon: <ToggleIcon />,
    },
    {
      id: "checkbox" as ComponentType,
      title: "Checkbox",
      icon: <CheckboxIcon />,
    },
    { id: "card" as ComponentType, title: "Card", icon: <CardIcon /> },
    {
      id: "loader" as ComponentType,
      title: "Loader",
      icon: <LoaderIcon className="aspect-[1.05] object-contain w-[59px]" />,
    },
    { id: "input" as ComponentType, title: "Input", icon: <InputIcon /> },
    { id: "form" as ComponentType, title: "Form", icon: <FormIcon /> },
    {
      id: "pattern" as ComponentType,
      title: "Pattern",
      icon: <PatternIcon className="aspect-[1] object-contain w-14" />,
    },
    {
      id: "radio" as ComponentType,
      title: "Radio buttons",
      icon: <RadioIcon />,
    },
    {
      id: "tooltip" as ComponentType,
      title: "Tooltips",
      icon: <TooltipIcon />,
    },
  ];

  const handleComponentSelect = (componentId: ComponentType) => {
    setSelectedComponent(componentId);
  };

  const handleTechnologyChange = (technology: TechnologyType) => {
    setSelectedTechnology(technology);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the onContinue callback if provided
    if (onContinue) {
      onContinue(selectedComponent, selectedTechnology);
    }

    // Navigate to the component editor with selected options
    navigate(`/component-editor?component=${selectedComponent}&technology=${selectedTechnology}`);

    // Close the popup
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-[rgba(15,15,15,1)] max-w-[600px] w-full mx-auto rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-[rgba(26,26,26,1)] flex w-full flex-col items-stretch pt-6 pb-12 rounded-2xl max-h-[90vh] overflow-y-auto sm:pt-6 sm:pb-12 hide-scrollbar"
        >
          <header className="flex w-full items-center justify-between px-4 sm:px-6">
            <h1 className="text-white text-lg font-semibold">
              What are you making?
            </h1>
            <button
              type="button"
              onClick={onClose}
              className="min-h-6 p-1 hover:bg-[rgba(42,42,42,1)] rounded transition-colors duration-200"
              aria-label="Close dialog"
            >
              <CloseIcon className="aspect-[1] object-contain w-6 text-white" />
            </button>
          </header>

          <main className="flex w-full flex-col items-stretch mt-8 sm:mt-10 px-3 sm:px-8 max-md:max-w-full">
            {/* Component grid */}
            <section className="max-md:max-w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {components.slice(0, 4).map((component) => (
                  <div
                    key={component.id}
                    className="w-full"
                  >
                    <ComponentCard
                      title={component.title}
                      icon={component.icon}
                      isSelected={selectedComponent === component.id}
                      onClick={() => handleComponentSelect(component.id)}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-4 max-md:max-w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {components.slice(4, 8).map((component) => (
                  <div
                    key={component.id}
                    className="w-full"
                  >
                    <ComponentCard
                      title={component.title}
                      icon={component.icon}
                      isSelected={selectedComponent === component.id}
                      onClick={() => handleComponentSelect(component.id)}
                    />
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-4 flex flex-col sm:flex-row items-stretch gap-4 justify-center">
              {components.slice(8).map((component) => (
                <div key={component.id} className="w-full sm:w-auto">
                  <ComponentCard
                    title={component.title}
                    icon={component.icon}
                    isSelected={selectedComponent === component.id}
                    onClick={() => handleComponentSelect(component.id)}
                  />
                </div>
              ))}
            </section>

            <TechnologySelector
              selectedTechnology={selectedTechnology}
              onTechnologyChange={handleTechnologyChange}
            />
            <button
              type="submit"
              className="bg-[rgba(255,71,156,1)] self-stretch flex items-center gap-2.5 text-white whitespace-nowrap justify-center h-full px-4 sm:px-6 py-2 rounded-[10px] max-md:px-5 hover:bg-[rgba(255,71,156,0.9)] transition-colors duration-200 mt-8"
            >
              <span className="self-stretch my-auto">Continue</span>
            </button>
          </main>
        </form>
      </div>
    </div>
  );
};

export default ComponentSelectorPopup;

