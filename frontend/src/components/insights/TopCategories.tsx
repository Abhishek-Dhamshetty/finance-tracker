import React from 'react';
import { Card } from '../common';
import { useApp } from '../../context/AppContext';
import { getTopCategories, formatCurrency } from '../../utils/calculations';
import { Trophy } from 'lucide-react';

export const TopCategories: React.FC = () => {
  const { state } = useApp();
  const topCategories = getTopCategories(state.transactions, 8);

  const highestCategory = topCategories[0];

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Trophy size={20} className="text-yellow-500" />
          Top Spending Categories
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your biggest expense areas
        </p>
      </div>

      {highestCategory && (
        <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-lg border-l-4 border-primary-500">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={18} className="text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Highest Spending
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {highestCategory.category}
          </h3>
          <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
            {formatCurrency(highestCategory.amount)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {highestCategory.count} transactions · {highestCategory.percentage}% of total expenses
          </p>
        </div>
      )}

      <div className="space-y-3">
        {topCategories.map((category, index) => (
          <div key={category.category} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                  #{index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {category.category}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {category.count} transactions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(category.amount)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {category.percentage}%
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
