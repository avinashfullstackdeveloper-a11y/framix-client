import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, className = '' }) => {
  return (
    <article className={`bg-[rgba(255,255,255,0.002)] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex min-w-60 flex-col items-stretch justify-center grow shrink w-[258px] p-[18px] rounded-lg border-[rgba(33,33,33,0.8)] border-solid border-2 ${className}`}>
      <div className="w-full">
        <div className="w-full text-sm text-[rgba(153,153,153,1)] font-normal leading-none">
          <div>{title}</div>
        </div>
        <div className="w-full text-2xl text-[rgba(230,230,230,1)] font-bold whitespace-nowrap leading-none mt-2">
          <div>{value}</div>
        </div>
      </div>
    </article>
  );
};

interface StatsCardsProps {
  className?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ className = '' }) => {
  const stats = [
    { title: 'Total Posts', value: '0' },
    { title: 'Total Favorites', value: '0' },
    { title: 'Total Views', value: '0' }
  ];

  return (
    <section className={`flex w-full items-stretch gap-4 justify-center flex-wrap mt-6 max-md:max-w-full ${className}`}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
        />
      ))}
    </section>
  );
};

interface ChartProps {
  className?: string;
}

export const Chart: React.FC<ChartProps> = ({ className = '' }) => {
  const yAxisLabels = ['4', '3', '2', '1'];
  const xAxisLabels = [
    '15/9/2025', '18/9/2025', '21/9/2025', '24/9/2025', '27/9/2025',
    '30/9/2025', '3/10/2025', '6/10/2025', '9/10/2025', '12/10/2025', '16/10/2025'
  ];

  return (
    <section className={`bg-[rgba(255,255,255,0.002)] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] w-full mt-6 p-[26px] rounded-lg border-[rgba(33,33,33,0.8)] border-solid border-2 max-md:max-w-full max-md:px-5 ${className}`}>
      <header>
        <h3 className="w-full text-xl text-gray-100 font-normal leading-[1.4] max-md:max-w-full">
          <div className="max-md:max-w-full">Favorites Over Time</div>
        </h3>
        <p className="w-full text-sm text-[rgba(153,153,153,1)] font-normal leading-none max-md:max-w-full">
          <div className="max-md:max-w-full">Total favorites over the last 30 days</div>
        </p>
      </header>
      
      <div className="flex min-h-[366px] w-full items-stretch justify-center pt-4 max-md:max-w-full">
        <div className="min-w-60 w-full flex-1 shrink basis-[0%] pl-[31px] pt-px pb-3.5 max-md:max-w-full">
          <div className="flex items-stretch flex-wrap ml-[17px] max-md:max-w-full max-md:mr-[5px]">
            <div className="flex flex-col items-stretch text-sm text-[rgba(153,153,153,1)] font-normal whitespace-nowrap text-right max-md:hidden">
              {yAxisLabels.map((label, index) => (
                <div key={index} className={`flex items-stretch gap-0.5 ${index > 0 ? 'mt-[55px] max-md:mt-10' : ''} ${index === 2 ? 'mt-[61px] max-md:mt-10' : ''} ${index === 3 ? 'mt-[60px] max-md:mt-10' : ''}`}>
                  <div>{label}</div>
                  <img
                    src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/d306d8105468b8b5b17db908667a97577b1b9467?placeholderIfAbsent=true"
                    alt=""
                    className={`aspect-[5.99] object-contain w-1.5 shrink-0 ${index === 0 ? 'mt-1' : 'my-auto'}`}
                  />
                </div>
              ))}
            </div>
            <div className="grow shrink-0 basis-0 w-fit mt-1 max-md:max-w-full">
              <img
                src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/62aed703bebbafce16762b5f15d283fe3bda1ca9?placeholderIfAbsent=true"
                alt=""
                className="aspect-[0] object-contain w-px"
              />
              <img
                src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/1e101b67f4d69068798289026d97caaa0e2c692a?placeholderIfAbsent=true"
                alt="Chart visualization"
                className="object-contain w-full max-md:max-w-full"
              />
            </div>
          </div>
          <div className="flex items-stretch flex-wrap ml-7 max-md:max-w-full max-md:mr-[5px]">
            <img
              src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/d306d8105468b8b5b17db908667a97577b1b9467?placeholderIfAbsent=true"
              alt=""
              className="aspect-[5.99] object-contain w-1.5 shrink-0"
            />
            <img
              src="https://api.builder.io/api/v1/image/assets/35de5dc00516421d9aa405b4c562fade/180a59e9ae73e2dc7c56fa89edb47569019f40ff?placeholderIfAbsent=true"
              alt=""
              className="aspect-[1000] object-contain w-fit grow shrink-0 basis-0 max-md:max-w-full"
            />
          </div>
          <div className="flex items-stretch gap-3.5 text-sm text-[rgba(153,153,153,1)] font-normal whitespace-nowrap text-center flex-wrap">
            {xAxisLabels.map((label, index) => (
              <div key={index} className={index === 0 ? 'grow' : ''}>{label}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsSection: React.FC = () => (
  <div>
    <StatsCards />
    <Chart />
  </div>
);

export default StatsSection;