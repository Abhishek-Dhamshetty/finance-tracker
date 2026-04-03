import React from 'react';
import { InsightsPanel, TopCategories, MonthlyComparison } from '../components/insights';

export const Insights: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Analyze your spending patterns and financial trends
        </p>
      </div>

      {/* Monthly Comparison Chart */}
      <MonthlyComparison />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Insights */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Key Insights
          </h2>
          <InsightsPanel />
        </div>

        {/* Top Categories */}
        <div>
          <TopCategories />
        </div>
      </div>
    </div>
  );
};
