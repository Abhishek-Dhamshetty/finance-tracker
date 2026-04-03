import React from 'react';
import { Card } from '../common';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../../context/AppContext';
import { calculateCategoryBreakdown } from '../../utils/calculations';

const COLORS = [
  '#0ea5e9', // primary
  '#22c55e', // success
  '#f59e0b', // warning
  '#ef4444', // danger
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export const SpendingBreakdown: React.FC = () => {
  const { state } = useApp();
  const breakdown = calculateCategoryBreakdown(state.transactions).slice(0, 8);

  const chartData = breakdown.map((item) => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage,
  }));

  return (
    <Card className="col-span-full lg:col-span-1">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Spending Breakdown
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Top categories by expense amount
        </p>
      </div>

      {chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.percentage.toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => `$${Number(value).toLocaleString()}`}
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  border: '1px solid var(--tooltip-border)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {breakdown.slice(0, 5).map((item, index) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-700 dark:text-gray-300">{item.category}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${item.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No expense data available
        </div>
      )}
    </Card>
  );
};
