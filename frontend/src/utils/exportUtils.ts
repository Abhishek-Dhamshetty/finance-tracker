import type { Transaction } from '../types';
import { formatDate } from './calculations';

/**
 * Export transactions to CSV format
 */
export const exportToCSV = (transactions: Transaction[], filename: string = 'transactions.csv'): void => {
  if (transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  // Define CSV headers
  const headers = ['Date', 'Description', 'Type', 'Category', 'Amount', 'Payment Method', 'Notes'];

  // Convert transactions to CSV rows
  const rows = transactions.map((t) => [
    formatDate(t.date),
    `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
    t.type,
    t.category,
    t.amount.toFixed(2),
    t.paymentMethod,
    t.notes ? `"${t.notes.replace(/"/g, '""')}"` : '',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Export transactions to JSON format
 */
export const exportToJSON = (transactions: Transaction[], filename: string = 'transactions.json'): void => {
  if (transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  const jsonContent = JSON.stringify(transactions, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
