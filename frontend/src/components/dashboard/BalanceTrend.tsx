import React from 'react';
import { Card } from '../common';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { calculateBalanceTrend } from '../../utils/calculations';

export const BalanceTrend: React.FC = () => {
  const { state } = useApp();
  const trendData = calculateBalanceTrend(state.transactions, 6);

  return (
    <Card className="col-span-full lg:col-span-2">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Balance Trend
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your financial overview over the last 6 months
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="date"
            className="text-xs"
            tick={{ fill: 'currentColor' }}
            stroke="currentColor"
          />
          <YAxis
            className="text-xs"
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
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={2}
            dot={{ fill: '#22c55e', r: 4 }}
            activeDot={{ r: 6 }}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', r: 4 }}
            activeDot={{ r: 6 }}
            name="Expenses"
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#0ea5e9"
            strokeWidth={3}
            dot={{ fill: '#0ea5e9', r: 5 }}
            activeDot={{ r: 7 }}
            name="Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};
