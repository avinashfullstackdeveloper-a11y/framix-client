import React, { useEffect, useRef } from 'react';

interface AdCardProps {
  adKey: string;
  adType?: '300x250' | '160x300';
}

const AdCard: React.FC<AdCardProps> = ({ adKey, adType = '300x250' }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adContainerRef.current && !adContainerRef.current.querySelector('script')) {
      // Configuration for different ad types
      const adConfigs = {
        '300x250': {
          key: 'c72f109b40a75d322698efe5dd2b7573',
          width: 300,
          height: 250,
        },
        '160x300': {
          key: 'b1019f4a7b126df1547ac70a40bdb85c',
          width: 160,
          height: 300,
        },
      };

      const config = adConfigs[adType];

      // Create the atOptions script
      const atOptionsScript = document.createElement('script');
      atOptionsScript.type = 'text/javascript';
      atOptionsScript.innerHTML = `
        atOptions = {
          'key' : '${config.key}',
          'format' : 'iframe',
          'height' : ${config.height},
          'width' : ${config.width},
          'params' : {}
        };
      `;
      
      // Create the invoke script
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${config.key}/invoke.js`;
      
      // Append both scripts
      adContainerRef.current.appendChild(atOptionsScript);
      adContainerRef.current.appendChild(invokeScript);
    }
  }, [adType]);

  return (
    <div className="w-full">
      <div className="flex w-full h-64 sm:h-72 lg:h-80 flex-col justify-center items-center border overflow-hidden bg-black rounded-2xl sm:rounded-3xl border-solid border-[#3A3A3A]">
        <div ref={adContainerRef} className="w-full h-full flex items-center justify-center">
          {/* Adsterra ad will be injected here */}
        </div>
      </div>
    </div>
  );
};

export default AdCard;