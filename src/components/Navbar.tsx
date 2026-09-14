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
      {/* Compact Header: Single-line or tight wrap of Brand, Nav, Lang & Tools */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Brand Left: Parthenium Leaf Logo + WEEDS TO WEALTH + NCSC 2026-27 */}
        <div className="flex items-center gap-2">
          {/* Parthenium Leaf Logo */}
          <div className="shrink-0 flex items-center justify-center">
            <PartheniumLogo className="w-5 h-5 sm:w-6 sm:h-6 hover:scale-105 transition-transform" />
          </div>

          {/* Title - Reduced size for compact brutalist hierarchy */}
          <span className="font-mono text-sm sm:text-base font-black tracking-tight text-zinc-950 uppercase">
            {t.appName}
          </span>

          {/* NCSC 2026-27 Badge */}
          <div className="border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 font-mono text-zinc-600 text-[10px] sm:text-xs font-medium">
            {t.ncscBadge}
          </div>
        </div>

        {/* Navigation Tabs: [ Dashboard ] [ Formulation Engine ] [ AI Scanner ] [ Supply Map ] */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2 py-0.5 text-[11px] sm:text-xs uppercase font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
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

        {/* Right Tools: Language Selector, IKS & Citations Matrix, and Export PDF */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Selector: [ 文A | EN | HI | OD ] */}
          <div className="flex items-center border border-zinc-300 bg-white p-0.5">
            <Languages className="w-3 h-3 text-zinc-500 mx-1" />
            {(['EN', 'HI', 'OD'] as LanguageCode[]).map((langCode) => (
              <button
                key={langCode}
                onClick={() => setLanguage(langCode)}
                className={`px-1.5 py-0.2 text-[10px] sm:text-xs font-mono font-bold transition-all cursor-pointer ${
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
              className="border border-amber-400 bg-[#fffdf0] hover:bg-amber-100 text-[#78350f] font-mono font-bold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 flex items-center gap-1 shadow-[1px_1px_0px_0px_#f59e0b] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
              title="Surapala Vrikshayurveda vs. Hussain et al. (2017) Peer-Reviewed Matrix"
            >
              <span className="text-xs">📜</span>
              <span>{t.citationsMatrixBtn}</span>
            </button>
          )}

          {/* Export PDF Report Button */}
          <button
            onClick={onOpenPdfReport}
            className="bg-[#0f1f18] hover:bg-[#183126] text-white border border-zinc-800 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
            title="Export NCSC Research & Formulation Evaluation Dossier"
          >
            <Printer className="w-3 h-3 text-emerald-400" />
            <span className="hidden md:inline">{t.exportPdfBtn}</span>
            <span className="md:hidden">PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
