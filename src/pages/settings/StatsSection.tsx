import React, { useState, useEffect } from 'react';
import { getUserStats, getUserStatsChart } from '../../lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [stats, setStats] = useState([
    { title: 'Total Posts', value: '0' },
    { title: 'Total Favorites', value: '0' },
    { title: 'Total Views', value: '0' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserStats();
        
        // DEBUG: Log the received data
        console.log('[DEBUG StatsSection] Received stats data:', data);
        console.log('[DEBUG StatsSection] totalViews value:', data.totalViews, 'Type:', typeof data.totalViews);
        
        // Format numbers with commas for thousands
        const formatNumber = (num: number): string => {
          return num.toLocaleString('en-US');
        };

        setStats([
          { title: 'Total Posts', value: formatNumber(data.totalPosts) },
          { title: 'Total Favorites', value: formatNumber(data.totalFavorites) },
          { title: 'Total Views', value: formatNumber(data.totalViews) }
        ]);
      } catch (err) {
        console.error('Failed to fetch user stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
        // Keep showing '0' values on error
      } finally {
        setLoading(false);
      }
    };

    // Fetch on mount
    fetchStats();

    // Add visibility change listener to refetch when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <section className={`flex w-full items-stretch gap-4 justify-center flex-wrap mt-6 max-md:max-w-full ${className}`}>
      {error && (
        <div className="w-full text-center text-sm text-red-400 mb-2">
          {error}
        </div>
      )}
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={loading ? '0' : stat.value}
        />
      ))}
    </section>
  );
};

interface ChartProps {
  className?: string;
}

interface ChartDataPoint {
  date: string;
  count: number;
}

// Custom tooltip component for better styling
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const date = new Date(data.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    return (
      <div className="bg-[rgba(33,33,33,0.95)] border border-[rgba(153,153,153,0.3)] rounded-lg p-3 shadow-lg">
        <p className="text-gray-300 text-sm mb-1">{formattedDate}</p>
        <p className="text-blue-400 font-semibold">
          {data.count} {data.count === 1 ? 'favorite' : 'favorites'}
        </p>
      </div>
    );
  }
  return null;
};

export const Chart: React.FC<ChartProps> = ({ className = '' }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserStatsChart();
        setChartData(data);
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    // Fetch on mount
    fetchChartData();

    // Add visibility change listener to refetch when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchChartData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Format date for x-axis (show fewer labels for readability)
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${month} ${day}`;
  };

  return (
    <section className={`bg-[rgba(255,255,255,0.002)] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] w-full mt-6 p-[26px] rounded-lg border-[rgba(33,33,33,0.8)] border-solid border-2 max-md:max-w-full max-md:px-5 ${className}`}>
      <header>
        <h3 className="w-full text-xl text-gray-100 font-normal leading-[1.4] max-md:max-w-full">
          <div className="max-md:max-w-full">
            Favorites Over Time
          </div>
        </h3>
        <div className="w-full text-sm text-[rgba(153,153,153,1)] font-normal leading-none max-md:max-w-full">
          <div className="max-md:max-w-full">Total favorites received on your components over the last 30 days</div>
        </div>
      </header>
      
      <div className="flex min-h-[366px] w-full items-stretch justify-center pt-8 max-md:max-w-full">
        {loading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="text-gray-400">Loading chart data...</div>
          </div>
        ) : error ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="text-red-400">Failed to load chart: {error}</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="text-gray-400">No data available</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(153,153,153,0.1)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                stroke="rgba(153,153,153,0.6)"
                tick={{ fill: 'rgba(153,153,153,1)', fontSize: 12 }}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                stroke="rgba(153,153,153,0.6)"
                tick={{ fill: 'rgba(153,153,153,1)', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="rgba(59, 130, 246, 1)"
                strokeWidth={2}
                dot={{ fill: 'rgba(59, 130, 246, 1)', r: 4 }}
                activeDot={{ r: 6, fill: 'rgba(96, 165, 250, 1)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
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