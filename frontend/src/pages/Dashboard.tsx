import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SummaryCard, BalanceTrend, SpendingBreakdown } from '../components/dashboard';
import { calculateSummary, formatCurrency } from '../utils/calculations';

export const Dashboard: React.FC = () => {
  const { state } = useApp();
  const summary = calculateSummary(state.transactions);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's your financial overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(summary.totalBalance)}
          icon={<DollarSign size={24} />}
          trend={{
            value: summary.savingsRate,
            isPositive: summary.totalBalance >= 0,
          }}
        />
        <SummaryCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={<TrendingUp size={24} />}
          className="border-t-4 border-t-success-500"
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          icon={<TrendingDown size={24} />}
          className="border-t-4 border-t-danger-500"
        />
        <SummaryCard
          title="Savings Rate"
          value={`${summary.savingsRate.toFixed(1)}%`}
          icon={<PiggyBank size={24} />}
          trend={{
            value: summary.savingsRate,
            isPositive: summary.savingsRate > 20,
          }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Monthly Averages
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Income</span>
              <span className="font-semibold text-success-600 dark:text-success-400">
                {formatCurrency(summary.monthlyIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Expenses</span>
              <span className="font-semibold text-danger-600 dark:text-danger-400">
                {formatCurrency(summary.monthlyExpenses)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-gray-100 font-medium">Net Monthly</span>
              <span className={`font-bold ${
                summary.monthlyIncome - summary.monthlyExpenses >= 0
                  ? 'text-success-600 dark:text-success-400'
                  : 'text-danger-600 dark:text-danger-400'
              }`}>
                {formatCurrency(summary.monthlyIncome - summary.monthlyExpenses)}
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Financial Health
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {summary.savingsRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    summary.savingsRate >= 20
                      ? 'bg-success-500'
                      : summary.savingsRate >= 10
                      ? 'bg-yellow-500'
                      : 'bg-danger-500'
                  }`}
                  style={{ width: `${Math.min(summary.savingsRate, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {summary.savingsRate >= 20
                  ? 'Excellent! Keep it up!'
                  : summary.savingsRate >= 10
                  ? 'Good, but room for improvement'
                  : 'Consider reducing expenses'}
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {state.transactions.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
