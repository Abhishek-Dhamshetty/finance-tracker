import React from 'react';
import { Card } from '../common';
import { useApp } from '../../context/AppContext';
import { calculateSummary, formatCurrency } from '../../utils/calculations';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import type { Insight } from '../../types';

export const InsightsPanel: React.FC = () => {
  const { state } = useApp();
  const summary = calculateSummary(state.transactions);

  // Generate insights
  const insights: Insight[] = [];

  // Savings rate insight
  if (summary.savingsRate >= 20) {
    insights.push({
      id: 'savings-excellent',
      type: 'success',
      title: 'Excellent Savings Rate',
      description: `You're saving ${summary.savingsRate.toFixed(1)}% of your income. Keep up the great work!`,
      icon: '🎉',
    });
  } else if (summary.savingsRate >= 10) {
    insights.push({
      id: 'savings-good',
      type: 'info',
      title: 'Good Savings Progress',
      description: `You're saving ${summary.savingsRate.toFixed(1)}% of your income. Try to reach 20% for optimal financial health.`,
      icon: '💪',
    });
  } else if (summary.savingsRate > 0) {
    insights.push({
      id: 'savings-low',
      type: 'warning',
      title: 'Low Savings Rate',
      description: `You're only saving ${summary.savingsRate.toFixed(1)}% of your income. Consider reducing discretionary expenses.`,
      icon: '⚠️',
    });
  } else {
    insights.push({
      id: 'savings-negative',
      type: 'warning',
      title: 'Spending More Than Earning',
      description: 'Your expenses exceed your income. Review your budget and cut unnecessary costs.',
      icon: '🚨',
    });
  }

  // Monthly trend insight
  if (summary.monthlyIncome > summary.monthlyExpenses) {
    const surplus = summary.monthlyIncome - summary.monthlyExpenses;
    insights.push({
      id: 'monthly-surplus',
      type: 'success',
      title: 'Positive Cash Flow',
      description: `You have an average monthly surplus of ${formatCurrency(surplus)}. Consider investing or saving this amount.`,
      icon: '💰',
    });
  } else if (summary.monthlyExpenses > summary.monthlyIncome) {
    const deficit = summary.monthlyExpenses - summary.monthlyIncome;
    insights.push({
      id: 'monthly-deficit',
      type: 'warning',
      title: 'Monthly Deficit Alert',
      description: `Your average monthly expenses exceed income by ${formatCurrency(deficit)}. Review and adjust your budget.`,
      icon: '📉',
    });
  }

  // Transaction count insight
  if (state.transactions.length > 100) {
    insights.push({
      id: 'active-tracker',
      type: 'info',
      title: 'Active Financial Tracker',
      description: `You have ${state.transactions.length} transactions recorded. Great job staying on top of your finances!`,
      icon: '📊',
    });
  }

  // Balance insight
  if (summary.totalBalance > 0) {
    insights.push({
      id: 'positive-balance',
      type: 'success',
      title: 'Positive Net Balance',
      description: `Your total net balance is ${formatCurrency(summary.totalBalance)}. You're in a healthy financial position.`,
      icon: '✨',
    });
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card key={insight.id} className="border-l-4 border-l-primary-500">
          <div className="flex items-start gap-4">
            <div className="text-3xl">{insight.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {insight.type === 'success' && (
                  <CheckCircle size={18} className="text-success-600 dark:text-success-400" />
                )}
                {insight.type === 'warning' && (
                  <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-400" />
                )}
                {insight.type === 'info' && (
                  <TrendingUp size={18} className="text-blue-600 dark:text-blue-400" />
                )}
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {insight.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {insight.description}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
