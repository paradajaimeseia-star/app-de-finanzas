
import React from 'react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const NavItem = ({ view, icon, label }: { view: View; icon: string; label: string }) => {
    const isActive = currentView === view;
    return (
      <button 
        onClick={() => onNavigate(view)}
        className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary' : 'text-slate-400 opacity-60'}`}
      >
        <span className="material-icons-round">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </button>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-background-dark/80 ios-blur border-t border-slate-200 dark:border-white/5 px-6 pb-8 pt-4 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <NavItem view={View.HOME} icon="dashboard" label="Home" />
        <NavItem view={View.REPORTS} icon="pie_chart" label="Reports" />
        
        <div className="relative -top-10">
          <button 
            onClick={() => onNavigate(View.NEW_TRANSACTION)}
            className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-background-light dark:border-background-dark active:scale-90 transition-transform"
          >
            <span className="material-icons-round text-3xl">add</span>
          </button>
        </div>

        <NavItem view={View.DEBTS} icon="receipt_long" label="Debts" />
        <NavItem view={View.PROFILE} icon="settings" label="Profile" />
      </div>
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/10 dark:bg-white/10 rounded-full"></div>
    </nav>
  );
};

export default BottomNav;
