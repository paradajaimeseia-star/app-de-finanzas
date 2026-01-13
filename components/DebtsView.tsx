
import React, { useState } from 'react';
import { Debt } from '../types';

interface DebtsViewProps {
  debts: Debt[];
  onAddDebt: (debt: Omit<Debt, 'id'>) => void;
  onPayDebt: (id: string, amount: number) => void;
}

const DebtsView: React.FC<DebtsViewProps> = ({ debts, onAddDebt, onPayDebt }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: string]: string }>({});
  const [newDebt, setNewDebt] = useState({
    entity: '',
    description: '',
    amount: '',
    dueDate: '',
  });

  const totalRemaining = debts.reduce((acc, d) => acc + (d.amount - d.paidAmount), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDebt.entity || !newDebt.amount) return;
    onAddDebt({
      entity: newDebt.entity,
      description: newDebt.description || 'Deuda registrada',
      amount: parseFloat(newDebt.amount),
      paidAmount: 0,
      dueDate: newDebt.dueDate || 'Hoy',
      icon: 'account_balance_wallet',
      isUrgent: false
    });
    setNewDebt({ entity: '', description: '', amount: '', dueDate: '' });
    setShowAddForm(false);
  };

  const handlePaymentChange = (id: string, value: string) => {
    const val = value.replace(/[^0-9.]/g, '');
    setPaymentAmounts(prev => ({ ...prev, [id]: val }));
  };

  const executePayment = (id: string, remaining: number) => {
    const amountStr = paymentAmounts[id];
    const amount = parseFloat(amountStr);
    
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingresa un monto válido.");
      return;
    }

    if (amount > remaining) {
      alert("El monto ingresado supera el total restante de la deuda.");
      return;
    }

    onPayDebt(id, amount);
    setPaymentAmounts(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-40 overflow-y-auto hide-scrollbar">
      <header className="p-6 pt-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">Deudas</h1>
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-transform"
          >
            <span className="material-icons-round text-2xl">add</span>
          </button>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-sm mb-8">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-1">Total Pendiente</p>
          <h2 className="text-3xl font-black text-primary">
            ${totalRemaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full uppercase tracking-tighter">
              {debts.length} cuentas activas
            </span>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-8 p-6 bg-slate-100 dark:bg-white/5 rounded-3xl border-2 border-dashed border-primary/30 animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Registrar nueva deuda</h3>
              <button onClick={() => setShowAddForm(false)} className="opacity-40"><span className="material-icons-round">close</span></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input className="w-full bg-white dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary" placeholder="Entidad (Ej: Visa)" value={newDebt.entity} onChange={e => setNewDebt({...newDebt, entity: e.target.value})} required />
              <input className="w-full bg-white dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary" type="number" placeholder="Monto Total" value={newDebt.amount} onChange={e => setNewDebt({...newDebt, amount: e.target.value})} required />
              <input className="w-full bg-white dark:bg-white/5 border-none rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-primary" placeholder="Vencimiento (Ej: 15 Oct)" value={newDebt.dueDate} onChange={e => setNewDebt({...newDebt, dueDate: e.target.value})} />
              <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-md">Confirmar Registro</button>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {debts.length === 0 ? (
            <div className="text-center py-20 opacity-30 italic">No tienes deudas registradas</div>
          ) : (
            debts.map(debt => {
              const progress = (debt.paidAmount / debt.amount) * 100;
              const remaining = debt.amount - debt.paidAmount;
              
              return (
                <div key={debt.id} className="bg-white dark:bg-white/5 rounded-3xl p-5 border border-slate-200 dark:border-white/10 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-icons-round text-xl">account_balance</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-tight">{debt.entity}</h4>
                        <p className="text-[10px] font-medium opacity-50">Vence: {debt.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] font-bold text-primary">restante</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-[10px] font-bold opacity-60">
                      <span>Progreso del pago</span>
                      <span>{Math.round(progress)}% pagado</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary via-blue-400 to-accent-teal transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold opacity-40">$</span>
                        <input 
                          type="text" 
                          inputMode="decimal"
                          className="w-full bg-slate-50 dark:bg-white/5 border-none rounded-xl py-2.5 pl-6 pr-3 text-xs font-bold focus:ring-1 focus:ring-primary transition-all"
                          placeholder="Monto a pagar..."
                          value={paymentAmounts[debt.id] || ''}
                          onChange={(e) => handlePaymentChange(debt.id, e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => executePayment(debt.id, remaining)}
                        className="px-4 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                      >
                        Pagar
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => onPayDebt(debt.id, remaining)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60 text-[10px] font-bold hover:bg-slate-200 dark:hover:bg-white/20 transition-colors uppercase tracking-wider"
                    >
                      Liquidar Deuda Total
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </header>
    </div>
  );
};

export default DebtsView;
