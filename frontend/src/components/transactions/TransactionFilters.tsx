import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input, Select } from '../common';
import { useApp } from '../../context/AppContext';
import type { Category } from '../../types';

const expenseCategories: Category[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Groceries',
  'Rent',
  'Insurance',
  'Subscriptions',
  'Gifts & Donations',
  'Other Expense',
];

const incomeCategories: Category[] = [
  'Salary',
  'Freelance',
  'Investment',
  'Refund',
  'Gift',
  'Other Income',
];

export const TransactionFilters: React.FC = () => {
  const { state, setFilters, resetFilters } = useApp();
  const { filters } = state;

  const allCategories = [...expenseCategories, ...incomeCategories];

  const hasActiveFilters =
    filters.searchQuery ||
    filters.categoryFilter !== 'all' ||
    filters.typeFilter !== 'all' ||
    filters.dateRange.start ||
    filters.dateRange.end;

  return (
    <div className="card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <X size={16} />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <Input
          type="text"
          placeholder="Search transactions..."
          value={filters.searchQuery}
          onChange={(e) => setFilters({ searchQuery: e.target.value })}
          icon={<Search size={18} />}
        />

        {/* Type Filter */}
        <Select
          value={filters.typeFilter}
          onChange={(e) =>
            setFilters({ typeFilter: e.target.value as 'all' | 'income' | 'expense' })
          }
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' },
          ]}
        />

        {/* Category Filter */}
        <Select
          value={filters.categoryFilter}
          onChange={(e) => setFilters({ categoryFilter: e.target.value as Category | 'all' })}
          options={[
            { value: 'all', label: 'All Categories' },
            ...allCategories.map((cat) => ({ value: cat, label: cat })),
          ]}
        />

        {/* Sort */}
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            setFilters({
              sortBy: sortBy as any,
              sortOrder: sortOrder as 'asc' | 'desc',
            });
          }}
          options={[
            { value: 'date-desc', label: 'Date (Newest)' },
            { value: 'date-asc', label: 'Date (Oldest)' },
            { value: 'amount-desc', label: 'Amount (High to Low)' },
            { value: 'amount-asc', label: 'Amount (Low to High)' },
            { value: 'category-asc', label: 'Category (A-Z)' },
            { value: 'category-desc', label: 'Category (Z-A)' },
          ]}
        />
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="date"
          label="From Date"
          value={filters.dateRange.start || ''}
          onChange={(e) =>
            setFilters({
              dateRange: { ...filters.dateRange, start: e.target.value || null },
            })
          }
        />
        <Input
          type="date"
          label="To Date"
          value={filters.dateRange.end || ''}
          onChange={(e) =>
            setFilters({
              dateRange: { ...filters.dateRange, end: e.target.value || null },
            })
          }
        />
      </div>
    </div>
  );
};
