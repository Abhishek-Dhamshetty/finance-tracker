import React, { useState } from 'react';
import { TransactionItem } from './TransactionItem';
import { TransactionForm } from './TransactionForm';
import { EmptyState } from '../common';
import { useApp } from '../../context/AppContext';
import type { Transaction } from '../../types';
import { Receipt } from 'lucide-react';

export const TransactionList: React.FC = () => {
  const { state } = useApp();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  if (state.filteredTransactions.length === 0) {
    return (
      <>
        <EmptyState
          icon={<Receipt size={48} />}
          title="No transactions found"
          description="No transactions match your current filters. Try adjusting your search criteria or add a new transaction."
        />
        <TransactionForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          transaction={editingTransaction}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {state.filteredTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        transaction={editingTransaction}
      />
    </>
  );
};
