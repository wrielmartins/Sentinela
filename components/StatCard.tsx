import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  iconColor?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  subtitle?: string;
  progress?: number;
  progressColor?: string;
  accentRight?: boolean;
  gradient?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor = 'text-slate-400 dark:text-slate-500',
  trend,
  subtitle,
  progress,
  progressColor = 'bg-green-500',
  accentRight = false,
  gradient = false,
}) => {
  const getTrendColor = () => {
    if (!trend) return '';
    switch (trend.direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-slate-500 dark:text-text-secondary';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return 'trending_up';
      case 'down':
        return 'trending_down';
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col gap-1 rounded-xl p-5 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden ${gradient ? 'group' : ''}`}>
      {accentRight && (
        <div className="absolute right-0 top-0 h-full w-1 bg-primary"></div>
      )}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
      )}
      {icon && (
        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className={`material-symbols-outlined text-[64px] ${iconColor}`}>{icon}</span>
        </div>
      )}
      <div className={`flex items-center gap-2 mb-2 ${gradient ? 'relative z-10' : ''}`}>
        {icon && !gradient && (
          <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        )}
        <p className={`text-sm font-bold uppercase tracking-wide ${gradient ? 'text-primary' : 'text-slate-500 dark:text-slate-400'}`}>
          {title}
        </p>
        {icon && gradient && (
          <span className={`material-symbols-outlined ${iconColor} ml-auto`}>{icon}</span>
        )}
      </div>
      <p className={`text-2xl font-bold ${gradient ? 'relative z-10' : ''} text-slate-900 dark:text-white`}>
        {value}
      </p>
      {progress !== undefined && (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
          <div
            className={`${progressColor} h-1.5 rounded-full`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {subtitle && (
        <p className={`text-sm mt-1 ${gradient ? 'relative z-10' : ''} text-slate-400 dark:text-slate-500`}>
          {subtitle}
        </p>
      )}
      {trend && (
        <p className={`text-xs font-medium flex items-center gap-1 mt-1 ${getTrendColor()}`}>
          {getTrendIcon() && (
            <span className="material-symbols-outlined text-[12px]">{getTrendIcon()}</span>
          )}
          {trend.value}
        </p>
      )}
    </div>
  );
};

export default StatCard;
