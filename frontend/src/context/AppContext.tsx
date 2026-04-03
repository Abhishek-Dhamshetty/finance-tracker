import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction, Transaction, FilterState, UserRole } from '../types';
import { mockTransactions } from '../utils/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Initial filter state
const initialFilters: FilterState = {
  searchQuery: '',
  categoryFilter: 'all',
  typeFilter: 'all',
  dateRange: { start: null, end: null },
  sortBy: 'date',
  sortOrder: 'desc',
};

// Initial app state
const initialState: AppState = {
  transactions: mockTransactions,
  filteredTransactions: mockTransactions,
  filters: initialFilters,
  userRole: 'admin',
  isDarkMode: false,
};

// App reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
        filteredTransactions: applyFilters(action.payload, state.filters),
      };

    case 'ADD_TRANSACTION':
      const newTransactions = [action.payload, ...state.transactions];
      return {
        ...state,
        transactions: newTransactions,
        filteredTransactions: applyFilters(newTransactions, state.filters),
      };

    case 'UPDATE_TRANSACTION':
      const updatedTransactions = state.transactions.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload.transaction } : t
      );
      return {
        ...state,
        transactions: updatedTransactions,
        filteredTransactions: applyFilters(updatedTransactions, state.filters),
      };

    case 'DELETE_TRANSACTION':
      const filteredTxns = state.transactions.filter((t) => t.id !== action.payload);
      return {
        ...state,
        transactions: filteredTxns,
        filteredTransactions: applyFilters(filteredTxns, state.filters),
      };

    case 'SET_FILTERS':
      const newFilters = { ...state.filters, ...action.payload };
      return {
        ...state,
        filters: newFilters,
        filteredTransactions: applyFilters(state.transactions, newFilters),
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialFilters,
        filteredTransactions: applyFilters(state.transactions, initialFilters),
      };

    case 'SET_USER_ROLE':
      return {
        ...state,
        userRole: action.payload,
      };

    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };

    case 'SET_DARK_MODE':
      return {
        ...state,
        isDarkMode: action.payload,
      };

    default:
      return state;
  }
};

// Helper function to apply filters
const applyFilters = (transactions: Transaction[], filters: FilterState): Transaction[] => {
  let filtered = [...transactions];

  // Search filter
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (filters.categoryFilter !== 'all') {
    filtered = filtered.filter((t) => t.category === filters.categoryFilter);
  }

  // Type filter
  if (filters.typeFilter !== 'all') {
    filtered = filtered.filter((t) => t.type === filters.typeFilter);
  }

  // Date range filter
  if (filters.dateRange.start) {
    filtered = filtered.filter((t) => t.date >= filters.dateRange.start!);
  }
  if (filters.dateRange.end) {
    filtered = filtered.filter((t) => t.date <= filters.dateRange.end!);
  }

  // Sort
  filtered.sort((a, b) => {
    let comparison = 0;
    
    switch (filters.sortBy) {
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'description':
        comparison = a.description.localeCompare(b.description);
        break;
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setUserRole: (role: UserRole) => void;
  toggleDarkMode: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [storedTransactions, setStoredTransactions] = useLocalStorage<Transaction[]>(
    'transactions',
    mockTransactions
  );
  const [storedRole, setStoredRole] = useLocalStorage<UserRole>('userRole', 'admin');
  const [storedDarkMode, setStoredDarkMode] = useLocalStorage<boolean>('darkMode', false);

  // Initialize dark mode immediately on mount
  useEffect(() => {
    const root = window.document.documentElement;
    if (storedDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Initialize state from localStorage
  useEffect(() => {
    dispatch({ type: 'SET_TRANSACTIONS', payload: storedTransactions });
    dispatch({ type: 'SET_USER_ROLE', payload: storedRole });
    dispatch({ type: 'SET_DARK_MODE', payload: storedDarkMode });
  }, []);

  // Sync transactions to localStorage
  useEffect(() => {
    if (state.transactions.length > 0 && state.transactions !== storedTransactions) {
      setStoredTransactions(state.transactions);
    }
  }, [state.transactions]);

  // Sync role to localStorage
  useEffect(() => {
    if (state.userRole !== storedRole) {
      setStoredRole(state.userRole);
    }
  }, [state.userRole]);

  // Sync dark mode to localStorage and DOM
  useEffect(() => {
    if (state.isDarkMode !== storedDarkMode) {
      setStoredDarkMode(state.isDarkMode);
    }
    
    const root = window.document.documentElement;
    if (state.isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.isDarkMode]);

  // Action helpers
  const addTransaction = (transaction: Transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: { id, transaction } });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const setFilters = (filters: Partial<FilterState>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const setUserRole = (role: UserRole) => {
    dispatch({ type: 'SET_USER_ROLE', payload: role });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const value = {
    state,
    dispatch,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
    resetFilters,
    setUserRole,
    toggleDarkMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
