
export enum View {
  HOME = 'home',
  REPORTS = 'reports',
  DEBTS = 'debts',
  PROFILE = 'profile',
  NEW_TRANSACTION = 'new_transaction'
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  icon: string;
  iconBg: string;
}

export interface Debt {
  id: string;
  entity: string;
  description: string;
  amount: number; // Monto total original
  paidAmount: number; // Monto ya pagado
  dueDate: string;
  icon: string;
  isUrgent?: boolean;
}
