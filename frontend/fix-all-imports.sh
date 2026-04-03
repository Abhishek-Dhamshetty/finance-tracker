#!/bin/bash

# Fix SummaryCard
cat > src/components/dashboard/SummaryCard.tsx << 'SUMMARYCARD'
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
SUMMARYCARD

# Fix calculations.ts
sed -i '' 's/import {/import type {/g' src/utils/calculations.ts

# Fix exportUtils.ts
sed -i '' 's/import { Transaction }/import type { Transaction }/g' src/utils/exportUtils.ts

# Fix layout Header
cat > src/components/layout/Header.tsx << 'HEADER'
import React from 'react';
import { Menu, Sun, Moon, User, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { UserRole } from '../../types';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { state, setUserRole, toggleDarkMode } = useApp();

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">$</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                FinanceTracker
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage your finances
              </p>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Role Switcher */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                state.userRole === 'admin'
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              title="Admin - Can add and edit transactions"
            >
              <Shield size={16} />
              <span className="hidden sm:inline">Admin</span>
            </button>
            <button
              onClick={() => handleRoleChange('viewer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                state.userRole === 'viewer'
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
              title="Viewer - Read-only access"
            >
              <User size={16} />
              <span className="hidden sm:inline">Viewer</span>
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {state.isDarkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
HEADER

# Fix Insights Panel - remove unused imports
sed -i '' 's/, Target//g' src/components/insights/InsightsPanel.tsx

# Fix Top Categories - remove unused import  
sed -i '' 's/, TrendingUp//g' src/components/insights/TopCategories.tsx

# Fix Sidebar - add TrendingUp import
sed -i '' '2i\
import { TrendingUp } from "lucide-react";
' src/components/layout/Sidebar.tsx

