
import React from 'react';
import { Transaction } from '../types';

interface ReportsViewProps {
  transactions: Transaction[];
}

const CATEGORY_ICONS: {[key: string]: string} = {
  'Alimentos': 'restaurant',
  'Transporte': 'directions_car',
  'Vivienda': 'home',
  'Compras': 'shopping_bag',
  'Ocio': 'confirmation_number',
  'Salud': 'medical_services',
  'Servicios': 'bolt',
  'Otros': 'category'
};

const ReportsView: React.FC<ReportsViewProps> = ({ transactions }) => {
  const expenseTransactions = transactions.filter(tx => tx.type === 'expense');
  
  // Fix: Ensured initial value is 0 and tx.amount is cast to Number to avoid arithmetic errors
  const totalExpense = Math.abs(expenseTransactions.reduce((acc: number, tx: Transaction) => acc + Number(tx.amount), 0));

  // Agrupar gastos por categoría real
  const categoryMap = expenseTransactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + Math.abs(Number(tx.amount));
    return acc;
  }, {} as {[key: string]: number});

  const categoriesToShow = Object.entries(categoryMap).map(([name, amount]) => ({
    name,
    amount,
    icon: CATEGORY_ICONS[name] || 'category',
    percentage: totalExpense > 0 ? Math.round((Number(amount) / totalExpense) * 100) : 0
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center bg-background-light/80 dark:bg-background-dark/95 backdrop-blur-md p-4 justify-between">
        <div className="size-10 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-slate-900 dark:text-white">arrow_back_ios_new</span>
        </div>
        <h2 className="text-lg font-bold">Distribución de Gastos</h2>
        <div className="size-10 flex items-center justify-end">
          <span className="material-symbols-outlined">share</span>
        </div>
      </header>

      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div className="relative w-64 h-64">
          <svg className="donut-chart w-full h-full" viewBox="0 0 36 36">
            <circle className="text-slate-200 dark:text-slate-800" cx="18" cy="18" fill="transparent" r="15.9155" stroke="currentColor" strokeWidth="3"></circle>
            {totalExpense > 0 && (
              /* Fixed: strokeDasharray expects a string. Used simple static circle for full progress or calculated value if needed */
              <circle cx="18" cy="18" fill="transparent" r="15.9155" stroke="#3b82f6" strokeDasharray="100 0" strokeDashoffset="0" strokeLinecap="round" strokeWidth="3.5"></circle>
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Gasto Total</span>
            <span className="text-3xl font-extrabold tracking-tight">
              ${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-4 flex justify-between items-center border-t border-slate-100 dark:border-white/5 mt-4">
        <h3 className="text-lg font-bold">Desglose real</h3>
        <span className="text-xs font-bold opacity-40 uppercase tracking-widest">Este periodo</span>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-32 overflow-y-auto">
        {categoriesToShow.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <span className="material-symbols-outlined text-6xl mb-2">analytics</span>
            <p className="text-sm font-bold">Sin datos para mostrar</p>
          </div>
        ) : (
          categoriesToShow.map((cat) => (
            <div key={cat.name} className="flex items-center gap-4 bg-white dark:bg-slate-800/40 px-4 min-h-[80px] py-3 justify-between rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 shrink-0 size-12 text-primary">
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-bold">{cat.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{cat.percentage}% del total</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-base font-bold text-primary">${Number(cat.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportsView;
