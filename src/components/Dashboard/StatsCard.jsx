import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

const StatsCard = ({ icon, title, value, previousValue }) => {
  const currentValue = typeof value === 'number' ? value : 0;
  const prevValue = typeof previousValue === 'number' ? previousValue : 0;

  let change = 0;
  let trend = 'neutral'; 

  if (prevValue !== 0) {
    change = ((currentValue - prevValue) / prevValue) * 100;
    if (change > 0) trend = 'up';
    else if (change < 0) trend = 'down';
  } else if (currentValue > 0) {
    trend = 'up';
    change = 100;
  }

  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  const TrendIcon = trend === 'up' ? FiArrowUp : FiArrowDown;

  return (
    // Updated for dark mode
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        {/* Updated for dark mode */}
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className="text-2xl text-gray-400 dark:text-gray-500">{icon}</div>
      </div>
      <div>
        {/* Updated for dark mode */}
        <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{currentValue}</h3>
        <div className="flex items-center text-sm mt-1">
          {trend !== 'neutral' && (
            <span className={`flex items-center font-semibold ${trendColor}`}>
              <TrendIcon className="mr-1" />
              {change.toFixed(1)}%
            </span>
          )}
          {/* Updated for dark mode */}
          <span className="text-gray-500 dark:text-gray-400 ml-1">Today</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;