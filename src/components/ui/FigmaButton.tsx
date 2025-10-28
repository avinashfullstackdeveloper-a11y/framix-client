import React from "react";
import { FigmaIcon } from "./FigmaIcon";

interface FigmaButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const FigmaButton: React.FC<FigmaButtonProps> = ({
  onClick,
  disabled = false,
  className = "",
  children = "Copy to Figma",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-start gap-[11px] rounded relative bg-[#FF479C] px-2 py-1.5 max-md:gap-[9px] max-md:px-[7px] max-md:py-[5px] max-sm:gap-2 max-sm:px-1.5 max-sm:py-1 max-sm:rounded-[3px] transition-all duration-200 hover:bg-[#E63D8A] active:bg-[#CC3577] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#FF479C] focus:ring-offset-2 ${className}`}
      type="button"
      aria-label="Copy design to Figma"
    >
      <div className="flex-shrink-0">
        <FigmaIcon width={24} height={24} className="text-black" />
      </div>
      <div className="text-black text-base font-bold relative">
        <span className="font-bold text-base text-black">{children}</span>
      </div>
    </button>
  );
};
