import type {
  Transaction,
  FinancialSummary,
  TrendDataPoint,
  CategoryBreakdown,
  MonthlyComparison,
  Category,
} from '../types';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval, parseISO } from 'date-fns';

/**
 * Calculate financial summary from transactions
 */
export const calculateSummary = (transactions: Transaction[]): FinancialSummary => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  // Calculate monthly averages (last 3 months)
  const threeMonthsAgo = subMonths(new Date(), 3);
  const recentTransactions = transactions.filter(
    (t) => parseISO(t.date) >= threeMonthsAgo
  );

  const monthlyIncome = recentTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) / 3;

  const monthlyExpenses = recentTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0) / 3;

  return {
    totalBalance: balance,
    totalIncome: income,
    totalExpenses: expenses,
    savingsRate: Math.round(savingsRate * 100) / 100,
    monthlyIncome: Math.round(monthlyIncome),
    monthlyExpenses: Math.round(monthlyExpenses),
    netChange: balance,
  };
};

/**
 * Calculate balance trend over time
 */
export const calculateBalanceTrend = (transactions: Transaction[], months: number = 6): TrendDataPoint[] => {
  const dataPoints: TrendDataPoint[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = parseISO(t.date);
      return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
    });

    const income = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate cumulative balance
    const previousBalance = i === months - 1 ? 0 : dataPoints[dataPoints.length - 1]?.balance || 0;
    const balance = previousBalance + income - expenses;

    dataPoints.push({
      date: format(monthDate, 'MMM yyyy'),
      balance: Math.round(balance),
      income: Math.round(income),
      expenses: Math.round(expenses),
    });
  }

  return dataPoints;
};

/**
 * Calculate spending breakdown by category
 */
export const calculateCategoryBreakdown = (transactions: Transaction[]): CategoryBreakdown[] => {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const categoryMap = new Map<Category, { amount: number; count: number }>();

  expenseTransactions.forEach((t) => {
    const existing = categoryMap.get(t.category) || { amount: 0, count: 0 };
    categoryMap.set(t.category, {
      amount: existing.amount + t.amount,
      count: existing.count + 1,
    });
  });

  const breakdown: CategoryBreakdown[] = Array.from(categoryMap.entries()).map(
    ([category, data]) => ({
      category,
      amount: Math.round(data.amount),
      percentage: totalExpenses > 0 ? Math.round((data.amount / totalExpenses) * 100 * 100) / 100 : 0,
      count: data.count,
    })
  );

  // Sort by amount descending
  breakdown.sort((a, b) => b.amount - a.amount);

  return breakdown;
};

/**
 * Calculate monthly comparison (current vs previous month)
 */
export const calculateMonthlyComparison = (transactions: Transaction[]): MonthlyComparison => {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const previousMonthStart = startOfMonth(subMonths(now, 1));
  const previousMonthEnd = endOfMonth(subMonths(now, 1));

  const currentMonthTransactions = transactions.filter((t) => {
    const date = parseISO(t.date);
    return isWithinInterval(date, { start: currentMonthStart, end: currentMonthEnd });
  });

  const previousMonthTransactions = transactions.filter((t) => {
    const date = parseISO(t.date);
    return isWithinInterval(date, { start: previousMonthStart, end: previousMonthEnd });
  });

  const currentIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentExpenses = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const previousIncome = previousMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const previousExpenses = previousMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const incomeChange = previousIncome > 0
    ? ((currentIncome - previousIncome) / previousIncome) * 100
    : 0;

  const expensesChange = previousExpenses > 0
    ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
    : 0;

  const netChange = (currentIncome - currentExpenses) - (previousIncome - previousExpenses);
  const netChangePercent = previousIncome - previousExpenses > 0
    ? (netChange / (previousIncome - previousExpenses)) * 100
    : 0;

  return {
    currentMonth: {
      name: format(now, 'MMMM yyyy'),
      income: Math.round(currentIncome),
      expenses: Math.round(currentExpenses),
      net: Math.round(currentIncome - currentExpenses),
    },
    previousMonth: {
      name: format(subMonths(now, 1), 'MMMM yyyy'),
      income: Math.round(previousIncome),
      expenses: Math.round(previousExpenses),
      net: Math.round(previousIncome - previousExpenses),
    },
    change: {
      income: Math.round(incomeChange * 100) / 100,
      expenses: Math.round(expensesChange * 100) / 100,
      net: Math.round(netChangePercent * 100) / 100,
    },
  };
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string, formatString: string = 'MMM dd, yyyy'): string => {
  return format(parseISO(dateString), formatString);
};

/**
 * Get top spending categories
 */
export const getTopCategories = (transactions: Transaction[], limit: number = 5): CategoryBreakdown[] => {
  const breakdown = calculateCategoryBreakdown(transactions);
  return breakdown.slice(0, limit);
};

/**
 * Filter transactions by date range
 */
export const filterByDateRange = (
  transactions: Transaction[],
  startDate: string | null,
  endDate: string | null
): Transaction[] => {
  if (!startDate && !endDate) return transactions;

  return transactions.filter((t) => {
    const transactionDate = parseISO(t.date);
    
    if (startDate && endDate) {
      return isWithinInterval(transactionDate, {
        start: parseISO(startDate),
        end: parseISO(endDate),
      });
    }
    
    if (startDate) {
      return transactionDate >= parseISO(startDate);
    }
    
    if (endDate) {
      return transactionDate <= parseISO(endDate);
    }
    
    return true;
  });
};
