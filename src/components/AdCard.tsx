import React, { useEffect, useRef } from "react";

interface AdCardProps {
  adKey: string;
  adType: "300x250" | "160x300";
}

const AdCard: React.FC<AdCardProps> = ({ adKey, adType }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adContainerRef.current) {
      // Clear previous ad content to ensure fresh script injection
      adContainerRef.current.innerHTML = "";

      // Configuration for banner ad only
      const config = {
        key: "c72f109b40a75d322698efe5dd2b7573",
        width: 300,
        height: 250,
      };

      // Create a unique atOptions variable for each adKey
      const atOptionsVar = `atOptions_${adKey.replace(/[^a-zA-Z0-9_]/g, "")}`;

      // Create the atOptions script
      const atOptionsScript = document.createElement("script");
      atOptionsScript.type = "text/javascript";
      atOptionsScript.innerHTML = `
        window.${atOptionsVar} = {
          'key' : '${config.key}',
          'format' : 'iframe',
          'height' : ${config.height},
          'width' : ${config.width},
          'params' : {}
        };
        atOptions = window.${atOptionsVar};
      `;

      // Create the invoke script
      const invokeScript = document.createElement("script");
      invokeScript.type = "text/javascript";
      invokeScript.src = `//www.highperformanceformat.com/${config.key}/invoke.js`;

      // Add load/error listeners for diagnostics
      invokeScript.onload = () => {
      };
      invokeScript.onerror = (e) => {
      };

      // Append both scripts
      adContainerRef.current.appendChild(atOptionsScript);
      adContainerRef.current.appendChild(invokeScript);

      // LOG: After script injection
      setTimeout(() => {
      }, 1000);
    }
  }, [adKey]);

  return (
    <div className="w-full">
      <div className="flex w-full h-80 sm:h-96 lg:h-[26rem] flex-col justify-between items-center border overflow-hidden relative transition-all duration-300 ease-in-out hover:border-[#FF479C]/40 hover:shadow-[0_0_15px_rgba(255,154,201,0.15)] rounded-2xl sm:rounded-3xl border-solid border-[#3A3A3A]"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        {/* Ad Container */}
        <div
          ref={adContainerRef}
          className="w-full flex-1 flex items-center justify-center"
          style={{
            transform: "scale(1.2)",
            transformOrigin: "center",
          }}
        >
          {/* Adsterra ad will be injected here */}
        </div>

        {/* Small AD Badge - Bottom Center */}
        <div className="w-full py-2 flex items-center justify-center border-t border-[#3A3A3A]/50">
          <div className="flex items-center gap-1 bg-[rgba(255,154,201,0.1)] px-2 py-0.5 rounded">
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"
                fill="currentColor"
                className="text-[#FF479C]"
              />
            </svg>
            <span className="text-[#FF479C] text-[9px] font-semibold tracking-wide">
              AD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
