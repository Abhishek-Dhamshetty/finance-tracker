import React from 'react';
import { Card } from '../common';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { SummaryCardProps } from '../../types';

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  trend,
  className,
}) => {
  return (
    <Card className={className} padding="lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {value}
          </p>
          {trend && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend.isPositive
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-danger-600 dark:text-danger-400'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span>
                {Math.abs(trend.value)}% from last month
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <div className="text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};
