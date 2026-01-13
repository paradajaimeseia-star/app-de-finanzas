
import React from 'react';

const ProfileView: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold">Settings</h1>
      </header>
      
      <div className="flex items-center gap-4 mb-8 p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
        <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="material-icons-round text-3xl text-primary">person</span>
        </div>
        <div>
          <h2 className="text-lg font-bold">Alex Rivera</h2>
          <p className="text-sm opacity-60">Premium Member</p>
        </div>
      </div>

      <div className="space-y-4">
        {['Account Settings', 'Security', 'Notifications', 'Linked Banks', 'Appearance'].map((option) => (
          <button key={option} className="w-full flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5">
            <span className="font-semibold">{option}</span>
            <span className="material-icons-round opacity-40">chevron_right</span>
          </button>
        ))}
        
        <button className="w-full mt-8 flex items-center justify-center p-4 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl font-bold">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
