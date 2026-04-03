import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '../components/common';
import { TransactionFilters, TransactionForm, TransactionList } from '../components/transactions';
import { useApp } from '../context/AppContext';
import { exportToCSV } from '../utils/exportUtils';

export const Transactions: React.FC = () => {
  const { state } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const isAdmin = state.userRole === 'admin';

  const handleExport = () => {
    exportToCSV(state.filteredTransactions, 'transactions.csv');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {state.filteredTransactions.length} of {state.transactions.length} transactions
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            icon={<Download size={18} />}
            onClick={handleExport}
            disabled={state.filteredTransactions.length === 0}
          >
            Export CSV
          </Button>
          {isAdmin && (
            <Button
              variant="primary"
              icon={<Plus size={18} />}
              onClick={() => setIsFormOpen(true)}
            >
              Add Transaction
            </Button>
          )}
        </div>
      </div>

      {/* Role Info Banner */}
      {!isAdmin && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Viewer Mode:</strong> You are viewing transactions in read-only mode. 
            Switch to Admin mode to add, edit, or delete transactions.
          </p>
        </div>
      )}

      {/* Filters */}
      <TransactionFilters />

      {/* Transaction List */}
      <TransactionList />

      {/* Add Transaction Form */}
      <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};
