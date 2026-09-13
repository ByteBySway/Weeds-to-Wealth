import React from 'react';
import { ActiveTab, LanguageCode } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Printer, Languages, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPdfReport: () => void;
  onOpenIksMatrix?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPdfReport,
  onOpenIksMatrix,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'dashboard', label: t.tabDashboard },
    { id: 'calculator', label: t.tabCalculator },
    { id: 'protocol', label: t.tabProtocol },
    { id: 'map', label: t.tabMap },
  ];

  return (
    <header className="bg-white border-b border-zinc-300 px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center sticky top-0 z-50 shadow-xs print:hidden">
      {/* Brand Title */}
      <div className="flex items-center gap-3 py-1">
        <span className="inline-block w-3 h-3 bg-emerald-700"></span>
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-base sm:text-xl font-bold tracking-tight text-zinc-900">
            {t.appName}
          </span>
          <span className="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 border border-zinc-300 font-mono hidden md:inline-block">
            {t.ncscBadge}
          </span>
        </div>
      </div>

      {/* Center Nav Items */}
      <nav className="flex items-center gap-1 sm:gap-2 py-1 overflow-x-auto order-3 lg:order-2 w-full lg:w-auto mt-2 lg:mt-0 justify-center">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm uppercase tracking-wider font-mono transition-all rounded-none border whitespace-nowrap cursor-pointer ${
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

      {/* Top-Right Tools: Language Selector [ EN | HI | OD ] + Export PDF Report */}
      <div className="flex items-center gap-2 sm:gap-3 py-1 order-2 lg:order-3">
        {/* Language Selector Dropdown [ EN | HI | OD ] */}
        <div className="flex items-center border border-zinc-300 bg-zinc-50 p-0.5 font-mono text-xs">
          <Languages className="w-3.5 h-3.5 text-zinc-500 ml-1.5 mr-1 hidden sm:inline" />
          {(['EN', 'HI', 'OD'] as LanguageCode[]).map((langCode) => (
            <button
              key={langCode}
              onClick={() => setLanguage(langCode)}
              className={`px-2 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                language === langCode
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
              }`}
            >
              {langCode}
            </button>
          ))}
        </div>

        {/* View IKS & Academic Citations Matrix Button */}
        {onOpenIksMatrix && (
          <button
            onClick={onOpenIksMatrix}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-mono font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-400 flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(217,119,6,0.5)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
            title="View Surapala Vrikshayurveda & HPLC Peer-Reviewed Academic Citations"
          >
            <span>📜</span>
            <span className="hidden xl:inline">IKS & Citations Matrix</span>
            <span className="xl:hidden">IKS Matrix</span>
          </button>
        )}

        {/* Export PDF Report Button */}
        <button
          onClick={onOpenPdfReport}
          className="px-2.5 sm:px-3.5 py-1.5 text-xs font-mono font-bold bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-950 flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          title="Open printable research and formulation dossier"
        >
          <Printer className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">{t.exportPdfBtn}</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>
    </header>
  );
};
