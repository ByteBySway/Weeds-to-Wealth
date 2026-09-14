import React from 'react';
import { ActiveTab, LanguageCode } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Printer, Languages, Activity } from 'lucide-react';
import { PartheniumLogo } from './PartheniumLogo';

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
    <header className="bg-white border-b border-zinc-300 px-3 sm:px-5 py-2 sticky top-0 z-50 shadow-2xs print:hidden">
      <div className="flex items-center justify-between gap-3 sm:gap-6 w-full">
        {/* Left Section: Brand Logo + Title + NCSC 2026-27 Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Parthenium Leaf Logo */}
          <div className="shrink-0 flex items-center justify-center">
            <PartheniumLogo className="w-6 h-6 sm:w-7 sm:h-7 hover:scale-105 transition-transform" />
          </div>

          {/* Title & Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
            <span className="font-mono text-sm sm:text-base font-black tracking-tight text-zinc-950 uppercase whitespace-nowrap">
              {t.appName}
            </span>

            <div className="border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 font-mono text-zinc-600 text-[9px] sm:text-xs font-medium whitespace-nowrap w-fit">
              {t.ncscBadge}
            </div>
          </div>
        </div>

        {/* Right Section: Navigation Tabs on top, with sub-row starting from under the dashboard on the left */}
        <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0 ml-auto">
          {/* Upper: Primary Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs uppercase font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-emerald-800 font-bold border border-emerald-600 bg-white shadow-2xs'
                      : 'text-zinc-600 border border-transparent hover:border-zinc-300 hover:text-zinc-900'
                  }`}
                >
                  [ {item.label} ]
                </button>
              );
            })}
          </nav>

          {/* Lower Sub-row: Shifted to the left starting directly under the tabs / dashboard */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-start">
            {/* Language Selector: [ 文A | EN | HI | OD ] */}
            <div className="flex items-center border border-zinc-300 bg-white p-0.5 shadow-2xs">
              <Languages className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-500 mx-1 shrink-0" />
              {(['EN', 'HI', 'OD'] as LanguageCode[]).map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => setLanguage(langCode)}
                  className={`px-1 sm:px-1.5 py-0.2 text-[9px] sm:text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    language === langCode
                      ? 'bg-zinc-950 text-white'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  {langCode}
                </button>
              ))}
            </div>

            {/* IKS & Citations Matrix Button */}
            {onOpenIksMatrix && (
              <button
                onClick={onOpenIksMatrix}
                className="border border-amber-400 bg-[#fffdf0] hover:bg-amber-100 text-[#78350f] font-mono font-bold text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 flex items-center gap-1 shadow-[1px_1px_0px_0px_#f59e0b] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                title="Surapala Vrikshayurveda vs. Hussain et al. (2017) Peer-Reviewed Matrix"
              >
                <span className="text-[10px]">📜</span>
                <span>{t.citationsMatrixBtn}</span>
              </button>
            )}

            {/* Export PDF Report Button */}
            <button
              onClick={onOpenPdfReport}
              className="bg-[#0f1f18] hover:bg-[#183126] text-white border border-zinc-800 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold flex items-center gap-1 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
              title="Export NCSC Research & Formulation Evaluation Dossier"
            >
              <Printer className="w-2.5 h-2.5 text-emerald-400" />
              <span>{t.exportPdfBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
