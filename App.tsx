
import React, { useState } from 'react';
import { View, Transaction, Debt } from './types';
import HomeView from './components/HomeView';
import ReportsView from './components/ReportsView';
import DebtsView from './components/DebtsView';
import ProfileView from './components/ProfileView';
import NewTransactionView from './components/NewTransactionView';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [balance, setBalance] = useState<number>(12450.80);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [initialTransactionType, setInitialTransactionType] = useState<'income' | 'expense'>('expense');

  const handleUpdateBalance = (amount: number, type: 'income' | 'expense', category: string) => {
    setBalance(prev => Number((type === 'income' ? prev + amount : prev - amount).toFixed(2)));

    const iconMap: {[key: string]: string} = {
      'Alimentos': 'restaurant', 'Transporte': 'directions_car', 'Vivienda': 'home',
      'Compras': 'shopping_bag', 'Ocio': 'confirmation_number', 'Salud': 'medical_services',
      'Servicios': 'bolt', 'Sueldo': 'payments', 'Inversión': 'trending_up',
      'Regalo': 'card_giftcard', 'Otros': 'category', 'Deudas': 'receipt_long'
    };

    const newTx: Transaction = {
      id: Date.now().toString(),
      title: category,
      category: category,
      date: 'Hoy',
      amount: type === 'income' ? amount : -amount,
      type: type,
      icon: iconMap[category] || 'category',
      iconBg: type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-primary'
    };
    
    setTransactions(prev => [newTx, ...prev]);
    setCurrentView(View.HOME);
  };

  const handleAddDebt = (debt: Omit<Debt, 'id'>) => {
    const newDebt: Debt = { ...debt, id: Date.now().toString() };
    setDebts(prev => [newDebt, ...prev]);
  };

  const handlePayDebt = (debtId: string, amountToPay: number) => {
    if (balance < amountToPay) {
      alert("No tienes suficiente balance para este pago.");
      return;
    }

    setDebts(prev => {
      return prev.map(d => {
        if (d.id === debtId) {
          const newPaid = d.paidAmount + amountToPay;
          return { ...d, paidAmount: Number(newPaid.toFixed(2)) };
        }
        return d;
      }).filter(d => d.paidAmount < d.amount); // Eliminar si ya se pagó todo
    });

    const debtRef = debts.find(d => d.id === debtId);
    if (debtRef) {
      handleUpdateBalance(amountToPay, 'expense', 'Deudas');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return <HomeView balance={balance} transactions={transactions} onSetBalance={setBalance} onAddIncome={() => {setInitialTransactionType('income'); setCurrentView(View.NEW_TRANSACTION);}} onAddExpense={() => {setInitialTransactionType('expense'); setCurrentView(View.NEW_TRANSACTION);}} />;
      case View.REPORTS:
        return <ReportsView transactions={transactions} />;
      case View.DEBTS:
        return <DebtsView debts={debts} onAddDebt={handleAddDebt} onPayDebt={handlePayDebt} />;
      case View.PROFILE:
        return <ProfileView />;
      case View.NEW_TRANSACTION:
        return <NewTransactionView initialType={initialTransactionType} onBack={() => setCurrentView(View.HOME)} onSave={handleUpdateBalance} />;
      default:
        return <HomeView balance={balance} transactions={transactions} onSetBalance={setBalance} onAddIncome={() => {}} onAddExpense={() => {}} />;
    }
  };

  return (
    <div className="relative min-h-screen max-w-md mx-auto overflow-hidden">
      {renderView()}
      {currentView !== View.NEW_TRANSACTION && (
        <BottomNav currentView={currentView} onNavigate={setCurrentView} />
      )}
    </div>
  );
};

export default App;
