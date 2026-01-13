
import React, { useState } from 'react';
import { Transaction } from '../types';

interface HomeViewProps {
  balance: number;
  transactions: Transaction[];
  onSetBalance: (val: number) => void;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ balance, transactions, onSetBalance, onAddIncome, onAddExpense }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(balance.toString());

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setEditValue(value);
  };

  const handleSaveBalance = () => {
    const num = parseFloat(editValue) || 0;
    onSetBalance(num);
    setIsEditing(false);
  };

  const formatDisplayBalance = (val: number) => {
    const parts = val.toLocaleString('en-US', { minimumFractionDigits: 2 }).split('.');
    return { main: parts[0], decimal: parts[1] };
  };

  const display = formatDisplayBalance(balance);

  return (
    <main className="px-5 pt-12 pb-32">
      <header className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm font-medium opacity-60">Welcome back,</p>
          <h1 className="text-2xl font-extrabold tracking-tight">Alex Rivera</h1>
        </div>
        <button className="relative w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
          <span className="material-icons-round text-xl">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-background-dark"></span>
        </button>
      </header>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-primary to-blue-400 p-6 text-white mb-6 shadow-xl shadow-primary/30">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold opacity-80 uppercase tracking-wider">Total Balance</span>
            <button 
              onClick={() => isEditing ? handleSaveBalance() : setIsEditing(true)} 
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <span className="material-icons-round opacity-80">{isEditing ? 'check' : 'edit'}</span>
            </button>
          </div>
          
          <div className="min-h-[60px] flex items-center mb-6">
            {isEditing ? (
              <div className="flex items-center gap-1 w-full">
                <span className="text-3xl font-extrabold">$</span>
                <input
                  autoFocus
                  type="text"
                  value={editValue}
                  onChange={handleBalanceChange}
                  onBlur={handleSaveBalance}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveBalance()}
                  className="bg-white/20 border-none text-4xl font-extrabold focus:ring-2 focus:ring-white/50 w-full rounded-xl p-2 text-white placeholder-white/50"
                />
              </div>
            ) : (
              <div 
                className="flex items-baseline gap-1 cursor-pointer group"
                onClick={() => {
                  setEditValue(balance.toString());
                  setIsEditing(true);
                }}
              >
                <span className="text-4xl font-extrabold">${display.main}</span>
                <span className="text-xl font-medium opacity-80">.{display.decimal}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full">
            <span className="material-icons-round text-sm">trending_up</span>
            <span className="text-xs font-bold">+12.5% this month</span>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-300/10 rounded-full blur-xl"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button onClick={onAddIncome} className="flex items-center justify-center gap-2 bg-emerald-500 py-4 rounded-xl text-white font-bold shadow-lg shadow-emerald-500/25 active:scale-95 transition-transform">
          <span className="material-icons-round">add_circle</span>
          Add Income
        </button>
        <button onClick={onAddExpense} className="flex items-center justify-center gap-2 bg-white dark:bg-white/10 py-4 rounded-xl font-bold border border-slate-200 dark:border-white/5 active:scale-95 transition-transform">
          <span className="material-icons-round">remove_circle</span>
          Add Expense
        </button>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Recent Activity</h2>
          <button className="text-sm font-bold text-primary">See All</button>
        </div>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="py-10 text-center opacity-40 italic text-sm">No activity yet</div>
          ) : (
            transactions.map(tx => (
              <div key={tx.id} className="flex items-center justify-between p-1">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.iconBg}`}>
                    <span className="material-icons-round">{tx.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{tx.title}</p>
                    <p className="text-xs opacity-50 font-medium">{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-extrabold text-sm ${tx.type === 'income' ? 'text-emerald-500' : ''}`}>
                    {tx.type === 'income' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default HomeView;
