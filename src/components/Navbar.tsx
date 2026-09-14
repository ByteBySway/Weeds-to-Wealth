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
    <header className="bg-white border-b border-zinc-300 px-4 sm:px-6 py-3 sticky top-0 z-50 shadow-xs print:hidden">
      {/* Row 1: Brand Title, Parthenium Logo, NCSC Badge (Left) & Nav Tabs (Right) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Brand Left: Parthenium Leaf Logo + WEEDS TO WEALTH + NCSC 2026-27 */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Winning Parthenium Leaf enclosing Lab Flask Logo (No outer border) */}
          <div className="shrink-0 flex items-center justify-center">
            <PartheniumLogo className="w-7 h-7 sm:w-8 sm:h-8 hover:scale-105 transition-transform" />
          </div>

          {/* Title */}
          <span className="font-mono text-lg sm:text-2xl font-black tracking-tight text-zinc-950 uppercase">
            WEEDS TO WEALTH
          </span>

          {/* NCSC 2026-27 Badge matching screenshot */}
          <div className="border border-zinc-300 bg-transparent px-2 sm:px-2.5 py-0.5 font-mono text-zinc-600 text-xs sm:text-sm font-normal">
            NCSC 2026-27
          </div>
        </div>

        {/* Right Nav Tabs matching screenshot: [ DASHBOARD ] [ FORMULATION ENGINE ] [ AI SCANNER ] [ SUPPLY MAP ] */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1 text-xs sm:text-sm uppercase font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-emerald-800 font-bold border border-emerald-600 bg-white shadow-xs'
                    : 'text-zinc-600 border border-transparent hover:border-zinc-300 hover:text-zinc-900'
                }`}
              >
                [ {item.label} ]
              </button>
            );
          })}
        </nav>
      </div>

      {/* Row 2: Left-Aligned Language Selector, IKS & Citations Matrix, and Export PDF Report */}
      <div className="flex flex-wrap items-center gap-3 pt-2 mt-1">
        {/* Language Selector: [ 文A | EN | HI | OD ] */}
        <div className="flex items-center border border-zinc-300 bg-white p-0.5 shadow-xs">
          <Languages className="w-4 h-4 text-zinc-500 mx-1.5" />
          {(['EN', 'HI', 'OD'] as LanguageCode[]).map((langCode) => (
            <button
              key={langCode}
              onClick={() => setLanguage(langCode)}
              className={`px-2.5 py-0.5 text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
                language === langCode
                  ? 'bg-zinc-950 text-white shadow-xs'
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
            className="border-2 border-amber-400 bg-[#fffdf0] hover:bg-amber-100/90 text-[#78350f] font-mono font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-1 flex items-center gap-2 shadow-[0px_3px_0px_0px_#f59e0b] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
            title="Surapala Vrikshayurveda vs. Hussain et al. (2017) Peer-Reviewed Matrix"
          >
            <span className="text-base">📜</span>
            <span>IKS & Citations Matrix</span>
          </button>
        )}

        {/* Export PDF Report Button matching screenshot */}
        <button
          onClick={onOpenPdfReport}
          className="bg-[#0f1f18] hover:bg-[#183126] text-white border border-zinc-800 px-3.5 sm:px-4 py-1 text-xs sm:text-sm font-mono font-bold flex items-center gap-2 shadow-xs active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
          title="Export NCSC Research & Formulation Evaluation Dossier"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Export PDF Report</span>
        </button>
      </div>
    </header>
  );
};
