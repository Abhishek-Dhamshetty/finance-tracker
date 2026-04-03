import React from 'react';
import { Card } from '../common';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { calculateMonthlyComparison } from '../../utils/calculations';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MonthlyComparison: React.FC = () => {
  const { state } = useApp();
  const comparison = calculateMonthlyComparison(state.transactions);

  const chartData = [
    {
      name: comparison.previousMonth.name.split(' ')[0],
      Income: comparison.previousMonth.income,
      Expenses: comparison.previousMonth.expenses,
      Net: comparison.previousMonth.net,
    },
    {
      name: comparison.currentMonth.name.split(' ')[0],
      Income: comparison.currentMonth.income,
      Expenses: comparison.currentMonth.expenses,
      Net: comparison.currentMonth.net,
    },
  ];

  return (
    <Card className="col-span-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Monthly Comparison
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Compare {comparison.currentMonth.name} vs {comparison.previousMonth.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Income Change</p>
          <div className="flex items-center justify-center gap-2">
            {comparison.change.income >= 0 ? (
              <TrendingUp className="text-success-600 dark:text-success-400" size={20} />
            ) : (
              <TrendingDown className="text-danger-600 dark:text-danger-400" size={20} />
            )}
            <span
              className={`text-2xl font-bold ${
                comparison.change.income >= 0
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-danger-600 dark:text-danger-400'
              }`}
            >
              {comparison.change.income >= 0 ? '+' : ''}
              {comparison.change.income.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="text-center p-4 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Expense Change</p>
          <div className="flex items-center justify-center gap-2">
            {comparison.change.expenses >= 0 ? (
              <TrendingUp className="text-danger-600 dark:text-danger-400" size={20} />
            ) : (
              <TrendingDown className="text-success-600 dark:text-success-400" size={20} />
            )}
            <span
              className={`text-2xl font-bold ${
                comparison.change.expenses >= 0
                  ? 'text-danger-600 dark:text-danger-400'
                  : 'text-success-600 dark:text-success-400'
              }`}
            >
              {comparison.change.expenses >= 0 ? '+' : ''}
              {comparison.change.expenses.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Change</p>
          <div className="flex items-center justify-center gap-2">
            {comparison.change.net >= 0 ? (
              <TrendingUp className="text-success-600 dark:text-success-400" size={20} />
            ) : (
              <TrendingDown className="text-danger-600 dark:text-danger-400" size={20} />
            )}
            <span
              className={`text-2xl font-bold ${
                comparison.change.net >= 0
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-danger-600 dark:text-danger-400'
              }`}
            >
              {comparison.change.net >= 0 ? '+' : ''}
              {comparison.change.net.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="name"
            className="text-sm"
            tick={{ fill: 'currentColor' }}
            stroke="currentColor"
          />
          <YAxis
            className="text-sm"
            tick={{ fill: 'currentColor' }}
            stroke="currentColor"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              borderRadius: '8px',
            }}
            formatter={(value: any) => `$${Number(value).toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="Income" fill="#22c55e" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Net" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
