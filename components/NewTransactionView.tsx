
import React, { useState, useEffect } from 'react';

interface NewTransactionViewProps {
  initialType: 'income' | 'expense';
  onBack: () => void;
  onSave: (amount: number, type: 'income' | 'expense', category: string) => void;
}

const CATEGORIES = {
  expense: [
    { id: 'food', name: 'Alimentos', icon: 'restaurant', color: 'bg-orange-500' },
    { id: 'transport', name: 'Transporte', icon: 'directions_car', color: 'bg-blue-500' },
    { id: 'housing', name: 'Vivienda', icon: 'home', color: 'bg-indigo-500' },
    { id: 'shopping', name: 'Compras', icon: 'shopping_bag', color: 'bg-pink-500' },
    { id: 'entertainment', name: 'Ocio', icon: 'confirmation_number', color: 'bg-purple-500' },
    { id: 'health', name: 'Salud', icon: 'medical_services', color: 'bg-red-500' },
    { id: 'services', name: 'Servicios', icon: 'bolt', color: 'bg-yellow-500' },
    { id: 'other_exp', name: 'Otros', icon: 'more_horiz', color: 'bg-slate-500' },
  ],
  income: [
    { id: 'salary', name: 'Sueldo', icon: 'payments', color: 'bg-emerald-500' },
    { id: 'invest', name: 'Inversión', icon: 'trending_up', color: 'bg-teal-500' },
    { id: 'gift', name: 'Regalo', icon: 'card_giftcard', color: 'bg-cyan-500' },
    { id: 'other_inc', name: 'Otros', icon: 'add_chart', color: 'bg-slate-500' },
  ]
};

const NewTransactionView: React.FC<NewTransactionViewProps> = ({ initialType, onBack, onSave }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>(initialType);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setType(initialType);
    setSelectedCategory(CATEGORIES[initialType][0].name);
  }, [initialType]);

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setSelectedCategory(CATEGORIES[newType][0].name);
  };

  const handleSave = () => {
    const numValue = parseFloat(amount);
    if (isNaN(numValue) || numValue <= 0) {
      alert("Por favor introduce una cantidad válida");
      return;
    }
    if (!selectedCategory) {
      alert("Por favor selecciona una categoría");
      return;
    }
    onSave(numValue, type, selectedCategory);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    if ((val.match(/\./g) || []).length <= 1) {
      setAmount(val);
    }
  };

  const currentCategories = CATEGORIES[type];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark overflow-y-auto">
      <header className="flex justify-between items-center p-5 pt-12 mb-4">
        <button onClick={onBack} className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 active:scale-90 transition-transform">
          <span className="material-icons-round">chevron_left</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight">
          {type === 'income' ? 'Nuevo Ingreso' : 'Nuevo Gasto'}
        </h1>
        <div className="w-10"></div> 
      </header>

      <main className="px-5 pb-32 max-w-md mx-auto">
        <div className="bg-slate-200/50 dark:bg-white/5 p-1 rounded-2xl flex mb-6">
          <button 
            onClick={() => handleTypeChange('expense')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === 'expense' ? 'bg-white dark:bg-white/10 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500'
            }`}
          >
            Gasto
          </button>
          <button 
            onClick={() => handleTypeChange('income')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === 'income' ? 'bg-white dark:bg-white/10 shadow-sm text-emerald-600 dark:text-accent-teal' : 'text-slate-500'
            }`}
          >
            Ingreso
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Cantidad</p>
          <div className="flex items-center justify-center gap-1">
            <span className={`text-3xl font-bold ${type === 'income' ? 'text-emerald-500' : 'text-primary'}`}>$</span>
            <input 
              autoFocus
              className={`bg-transparent border-none text-5xl font-extrabold focus:ring-0 w-full text-center p-0 ${type === 'income' ? 'text-emerald-500' : 'text-primary'}`}
              type="text" 
              inputMode="decimal"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 block">Selecciona una Categoría</label>
            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
              {currentCategories.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(cat.name)}
                  className="flex flex-col items-center gap-2 group outline-none"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    selectedCategory === cat.name 
                      ? `${cat.color} text-white shadow-lg ring-4 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark ring-${cat.color.split('-')[1]}-500/20` 
                      : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400'
                  }`}>
                    <span className="material-icons-round text-2xl">{cat.icon}</span>
                  </div>
                  <span className={`text-[10px] font-bold transition-opacity ${selectedCategory === cat.name ? 'opacity-100' : 'opacity-40'}`}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-slate-100 dark:border-white/10 flex items-center gap-4 focus-within:border-primary/50 transition-colors">
              <span className="material-icons-round opacity-40">notes</span>
              <input className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium w-full" placeholder="Añadir nota opcional..." type="text"/>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button 
            onClick={handleSave}
            className={`w-full py-5 rounded-2xl text-white font-extrabold text-lg shadow-xl transition-all active:scale-[0.98] ${
              type === 'income' 
                ? 'bg-emerald-500 shadow-emerald-500/30' 
                : 'bg-primary shadow-primary/30'
            }`}
          >
            {type === 'income' ? 'Guardar Ingreso' : 'Guardar Gasto'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default NewTransactionView;
