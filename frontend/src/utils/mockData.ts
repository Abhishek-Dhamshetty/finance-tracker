import type { Transaction, Category, PaymentMethod } from '../types';

// Category definitions with their types
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

// Realistic transaction descriptions by category
const transactionDescriptions: Record<Category, string[]> = {
  'Food & Dining': [
    'Dinner at Italian Restaurant',
    'Coffee at Starbucks',
    'Lunch with colleagues',
    'Pizza delivery',
    'Breakfast at cafe',
    'Sushi takeout',
    'Fast food meal',
    'Fine dining experience',
  ],
  'Transportation': [
    'Uber ride to airport',
    'Gas station fill-up',
    'Metro card recharge',
    'Taxi fare',
    'Parking fee downtown',
    'Car maintenance',
    'Lyft ride home',
    'Bus pass monthly',
  ],
  'Shopping': [
    'Clothes at H&M',
    'Electronics at Best Buy',
    'Amazon online order',
    'Shoes purchase',
    'Home decor items',
    'Furniture shopping',
    'Book purchase',
    'Gift shopping',
  ],
  'Entertainment': [
    'Movie tickets',
    'Concert tickets',
    'Streaming service',
    'Gaming purchase',
    'Amusement park',
    'Sports event tickets',
    'Theatre show',
    'Museum entry',
  ],
  'Bills & Utilities': [
    'Electricity bill',
    'Internet bill',
    'Water bill',
    'Phone bill',
    'Gas utility',
    'Trash collection',
    'HOA fees',
    'Cable TV',
  ],
  'Healthcare': [
    'Doctor consultation',
    'Pharmacy purchase',
    'Dental checkup',
    'Vision test',
    'Medical supplies',
    'Gym membership',
    'Therapy session',
    'Lab tests',
  ],
  'Education': [
    'Online course fee',
    'Textbooks purchase',
    'Tutorial subscription',
    'Workshop registration',
    'Certification exam',
    'Professional training',
    'Language classes',
    'Conference ticket',
  ],
  'Travel': [
    'Flight tickets',
    'Hotel booking',
    'Travel insurance',
    'Vacation package',
    'Resort stay',
    'Car rental',
    'Tourist attraction',
    'Travel agency fee',
  ],
  'Personal Care': [
    'Haircut and styling',
    'Spa treatment',
    'Skincare products',
    'Cosmetics purchase',
    'Salon visit',
    'Massage therapy',
    'Beauty products',
    'Personal grooming',
  ],
  'Groceries': [
    'Weekly grocery shopping',
    'Supermarket run',
    'Fresh produce',
    'Organic store',
    'Costco bulk buy',
    'Farmers market',
    'Specialty foods',
    'Household items',
  ],
  'Rent': [
    'Monthly rent payment',
    'Apartment rent',
    'Security deposit',
    'Rent advance',
  ],
  'Insurance': [
    'Car insurance premium',
    'Health insurance',
    'Life insurance',
    'Home insurance',
    'Travel insurance',
  ],
  'Subscriptions': [
    'Netflix subscription',
    'Spotify Premium',
    'Adobe Creative Cloud',
    'Amazon Prime',
    'YouTube Premium',
    'Apple iCloud',
    'Microsoft Office 365',
    'Gym membership fee',
  ],
  'Gifts & Donations': [
    'Birthday gift',
    'Charity donation',
    'Wedding gift',
    'Anniversary present',
    'Donation to cause',
    'Thank you gift',
  ],
  'Other Expense': [
    'Miscellaneous expense',
    'Pet supplies',
    'Garden supplies',
    'Repairs and maintenance',
  ],
  'Salary': [
    'Monthly salary',
    'Salary deposit',
    'Paycheck received',
    'Income from employment',
  ],
  'Freelance': [
    'Freelance project payment',
    'Consulting fee',
    'Contract work payment',
    'Side project income',
    'Design work payment',
    'Writing gig payment',
  ],
  'Investment': [
    'Stock dividend',
    'Investment returns',
    'Interest income',
    'Crypto gains',
    'Mutual fund returns',
  ],
  'Refund': [
    'Tax refund',
    'Product return refund',
    'Service refund',
    'Insurance claim',
    'Overpayment refund',
  ],
  'Gift': [
    'Birthday money',
    'Gift from family',
    'Holiday gift money',
    'Bonus gift',
  ],
  'Other Income': [
    'Miscellaneous income',
    'Cashback reward',
    'Prize money',
    'Unexpected income',
  ],
};

// Payment methods
const paymentMethods: PaymentMethod[] = [
  'Credit Card',
  'Debit Card',
  'Cash',
  'Bank Transfer',
  'Digital Wallet',
];

// Helper to get random item from array
const getRandomItem = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Helper to get random amount based on category
const getAmountForCategory = (category: Category): number => {
  const ranges: Record<string, [number, number]> = {
    'Food & Dining': [10, 150],
    'Transportation': [5, 100],
    'Shopping': [20, 500],
    'Entertainment': [15, 200],
    'Bills & Utilities': [50, 300],
    'Healthcare': [30, 500],
    'Education': [50, 1000],
    'Travel': [200, 3000],
    'Personal Care': [20, 200],
    'Groceries': [30, 250],
    'Rent': [1000, 2500],
    'Insurance': [100, 500],
    'Subscriptions': [5, 50],
    'Gifts & Donations': [20, 300],
    'Other Expense': [10, 200],
    'Salary': [3000, 8000],
    'Freelance': [500, 3000],
    'Investment': [100, 2000],
    'Refund': [20, 500],
    'Gift': [50, 1000],
    'Other Income': [50, 500],
  };

  const [min, max] = ranges[category] || [10, 100];
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper to generate date in the past N months
const getRandomDateInPastMonths = (months: number): string => {
  const now = new Date();
  const past = new Date(now);
  past.setMonth(now.getMonth() - months);
  
  const randomTime = past.getTime() + Math.random() * (now.getTime() - past.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
};

// Generate a single transaction
const generateTransaction = (id: number, monthsBack: number): Transaction => {
  // 70% expenses, 30% income (more realistic)
  const isExpense = Math.random() < 0.7;
  const type = isExpense ? 'expense' : 'income';
  
  const categories = isExpense ? expenseCategories : incomeCategories;
  const category = getRandomItem(categories);
  
  const descriptions = transactionDescriptions[category];
  const description = getRandomItem(descriptions);
  
  const amount = getAmountForCategory(category);
  const date = getRandomDateInPastMonths(monthsBack);
  const paymentMethod = getRandomItem(paymentMethods);

  return {
    id: `txn_${id.toString().padStart(5, '0')}`,
    date,
    description,
    amount,
    type,
    category,
    paymentMethod,
  };
};

// Generate mock transactions
export const generateMockTransactions = (count: number = 100, monthsBack: number = 12): Transaction[] => {
  const transactions: Transaction[] = [];
  
  for (let i = 1; i <= count; i++) {
    transactions.push(generateTransaction(i, monthsBack));
  }
  
  // Sort by date (most recent first)
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Add guaranteed monthly salary for realism
  for (let month = 0; month < monthsBack; month++) {
    const salaryDate = new Date();
    salaryDate.setMonth(salaryDate.getMonth() - month);
    salaryDate.setDate(1); // First of each month
    
    transactions.push({
      id: `txn_salary_${month}`,
      date: salaryDate.toISOString().split('T')[0],
      description: 'Monthly salary deposit',
      amount: 5000 + Math.floor(Math.random() * 1000),
      type: 'income',
      category: 'Salary',
      paymentMethod: 'Bank Transfer',
    });
  }
  
  // Re-sort after adding salaries
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return transactions;
};

// Export default mock data
export const mockTransactions = generateMockTransactions(100, 12);
