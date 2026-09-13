import React from 'react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'calculator', label: 'Formulation Engine' },
    { id: 'protocol', label: 'AI Scanner' },
    { id: 'map', label: 'Supply Map' },
  ];

  return (
    <header className="bg-white border-b border-zinc-300 px-4 sm:px-6 py-3.5 flex flex-wrap justify-between items-center sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3 py-1">
        <span className="inline-block w-3 h-3 bg-emerald-700"></span>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-lg sm:text-xl font-bold tracking-tight text-zinc-900">
            WEEDS TO WEALTH v1.0
          </span>
          <span className="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 border border-zinc-300 font-mono hidden md:inline-block">
            NCSC 2026-27
          </span>
        </div>
      </div>

      <nav className="flex items-center gap-1.5 sm:gap-2 py-1 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 text-xs sm:text-sm uppercase tracking-wider font-mono transition-all rounded-none border whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-emerald-800 font-bold border-emerald-700 bg-emerald-50 shadow-[2px_2px_0px_0px_rgba(4,120,87,1)]'
                  : 'text-zinc-600 border-transparent hover:border-zinc-300 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              [ {item.label} ]
            </button>
          );
        })}
      </nav>
    </header>
  );
};
