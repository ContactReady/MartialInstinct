import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
  bgColor?: string;
  height?: string;
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-red-600',
  bgColor = 'bg-gray-700',
  height = 'h-2',
  showLabel = false,
  animated = false,
}) => {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      <div className={`w-full ${bgColor} rounded-full ${height} overflow-hidden`}>
        <div
          className={`${color} ${height} rounded-full transition-all duration-500 ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${safeProgress}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-gray-400 mt-1 block">{Math.round(safeProgress)}%</span>
      )}
    </div>
  );
};
