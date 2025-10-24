import React from 'react';

interface AdCardProps {
  adKey: string;
  adType?: '300x250' | '160x300';
}

const AdCard: React.FC<AdCardProps> = ({ adKey, adType = '300x250' }) => {
  // Define ad configurations for different ad types
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

  const adHTML = `
    <div id="adsterra-${adKey}" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
      <script type="text/javascript">
        atOptions = {
          'key' : '${config.key}',
          'format' : 'iframe',
          'height' : ${config.height},
          'width' : ${config.width},
          'params' : {}
        };
      </script>
      <script type="text/javascript" src="//www.highperformanceformat.com/${config.key}/invoke.js"></script>
    </div>
  `;

  return (
    <div className="w-full">
      <div className="flex w-full h-64 sm:h-72 lg:h-80 flex-col justify-center items-center border overflow-hidden bg-black rounded-2xl sm:rounded-3xl border-solid border-[#3A3A3A]">
        <div dangerouslySetInnerHTML={{ __html: adHTML }} />
      </div>
    </div>
  );
};

export default AdCard;