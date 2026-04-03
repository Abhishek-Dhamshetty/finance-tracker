import React, { useState } from 'react';
import { Modal, Input, Select, Button } from '../common';
import { useApp } from '../../context/AppContext';
import type { Transaction, Category, PaymentMethod } from '../../types';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

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

const paymentMethods: PaymentMethod[] = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'Bank Transfer',
  'Digital Wallet',
  'Other',
];

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { addTransaction, updateTransaction } = useApp();
  const isEditing = !!transaction;

  const [formData, setFormData] = useState({
    description: transaction?.description || '',
    amount: transaction?.amount.toString() || '',
    type: transaction?.type || 'expense',
    category: transaction?.category || expenseCategories[0],
    date: transaction?.date || new Date().toISOString().split('T')[0],
    paymentMethod: transaction?.paymentMethod || 'Credit Card',
    notes: transaction?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const transactionData: Transaction = {
      id: transaction?.id || `txn_${Date.now()}`,
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type as 'income' | 'expense',
      category: formData.category,
      date: formData.date,
      paymentMethod: formData.paymentMethod as PaymentMethod,
      notes: formData.notes || undefined,
    };

    if (isEditing) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: expenseCategories[0],
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      notes: '',
    });
    setErrors({});
  };

  const handleTypeChange = (newType: string) => {
    const type = newType as 'income' | 'expense';
    const defaultCategory = type === 'income' ? incomeCategories[0] : expenseCategories[0];
    setFormData({ ...formData, type, category: defaultCategory });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          error={errors.description}
          placeholder="e.g., Coffee at Starbucks"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            error={errors.amount}
            placeholder="0.00"
            required
          />

          <Select
            label="Type"
            value={formData.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            options={[
              { value: 'expense', label: 'Expense' },
              { value: 'income', label: 'Income' },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
            options={categories.map((cat) => ({ value: cat, label: cat }))}
          />

          <Select
            label="Payment Method"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
            options={paymentMethods.map((pm) => ({ value: pm, label: pm }))}
          />
        </div>

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          error={errors.date}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="input-field resize-none"
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" className="flex-1">
            {isEditing ? 'Update' : 'Add'} Transaction
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
