import React from 'react';
import { Edit, Trash2, Calendar, CreditCard } from 'lucide-react';
import { Badge } from '../common';
import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/calculations';
import { useApp } from '../../context/AppContext';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onEdit }) => {
  const { state, deleteTransaction } = useApp();
  const isAdmin = state.userRole === 'admin';

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transaction.id);
    }
  };

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                transaction.type === 'income'
                  ? 'bg-success-100 dark:bg-success-900/30'
                  : 'bg-danger-100 dark:bg-danger-900/30'
              }`}
            >
              <span className="text-lg">
                {transaction.type === 'income' ? '📈' : '💰'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {transaction.description}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge
                  variant={transaction.type === 'income' ? 'success' : 'danger'}
                  size="sm"
                >
                  {transaction.type}
                </Badge>
                <Badge variant="default" size="sm">
                  {transaction.category}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-3">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(transaction.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard size={14} />
              <span>{transaction.paymentMethod}</span>
            </div>
          </div>

          {transaction.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
              "{transaction.notes}"
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className={`text-xl font-bold ${
              transaction.type === 'income'
                ? 'text-success-600 dark:text-success-400'
                : 'text-danger-600 dark:text-danger-400'
            }`}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </span>

          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(transaction)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Edit transaction"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Delete transaction"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
