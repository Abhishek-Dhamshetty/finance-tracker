// Core data types
export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: Category;
  paymentMethod: PaymentMethod;
  tags?: string[];
  notes?: string;
}

export type Category =
  // Expense categories
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Personal Care'
  | 'Groceries'
  | 'Rent'
  | 'Insurance'
  | 'Subscriptions'
  | 'Gifts & Donations'
  | 'Other Expense'
  // Income categories
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Refund'
  | 'Gift'
  | 'Other Income';

export type PaymentMethod = 
  | 'Credit Card'
  | 'Debit Card'
  | 'Cash'
  | 'Bank Transfer'
  | 'Digital Wallet'
  | 'Other';

// User roles
export type UserRole = 'admin' | 'viewer';

// Filter state
export interface FilterState {
  searchQuery: string;
  categoryFilter: Category | 'all';
  typeFilter: 'all' | 'income' | 'expense';
  dateRange: DateRange;
  sortBy: SortField;
  sortOrder: 'asc' | 'desc';
}

export type SortField = 'date' | 'amount' | 'category' | 'description';

export interface DateRange {
  start: string | null; // ISO date string
  end: string | null; // ISO date string
}

// Summary statistics
export interface FinancialSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netChange: number;
}

// Chart data types
export interface TrendDataPoint {
  date: string;
  balance: number;
  income: number;
  expenses: number;
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyComparison {
  currentMonth: {
    name: string;
    income: number;
    expenses: number;
    net: number;
  };
  previousMonth: {
    name: string;
    income: number;
    expenses: number;
    net: number;
  };
  change: {
    income: number;
    expenses: number;
    net: number;
  };
}

// Insights
export interface Insight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'trend';
  title: string;
  description: string;
  value?: string | number;
  icon?: string;
}

// App context state
export interface AppState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  filters: FilterState;
  userRole: UserRole;
  isDarkMode: boolean;
}

// Actions for context
export type AppAction =
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: { id: string; transaction: Partial<Transaction> } }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_USER_ROLE'; payload: UserRole }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_DARK_MODE'; payload: boolean };

// Form types
export interface TransactionFormData {
  description: string;
  amount: string;
  type: 'income' | 'expense';
  category: Category;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// Export functionality
export interface ExportOptions {
  format: 'csv' | 'json';
  dateRange?: DateRange;
  includeFilters: boolean;
}

// Pagination
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

// Component props types
export interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface LoadingStateProps {
  message?: string;
}
