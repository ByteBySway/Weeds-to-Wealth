import React from 'react';
import { FileText, BarChart3, Microscope } from 'lucide-react';

interface FooterProps {
  onOpenReport: (type: 'latex' | 'csv' | 'hussain') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReport }) => {
  return (
    <footer className="w-full border-t border-zinc-300 bg-white">
      {/* 3 Sharp Outline Buttons Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <h3 className="text-xs uppercase font-mono tracking-widest text-zinc-500 font-bold mb-4">
          OPEN-SCIENCE VERIFICATION REPOSITORY
        </h3>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            onClick={() => onOpenReport('latex')}
            className="border border-zinc-400 bg-white px-4 py-2.5 hover:bg-zinc-100 flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-800 shadow-[2px_2px_0px_0px_rgba(161,161,170,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-zinc-700" />
            <span>📄 Download LaTeX Project Report</span>
          </button>

          <button
            onClick={() => onOpenReport('csv')}
            className="border border-zinc-400 bg-white px-4 py-2.5 hover:bg-zinc-100 flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-800 shadow-[2px_2px_0px_0px_rgba(161,161,170,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-zinc-700" />
            <span>📊 View 30-Day Biomass Dataset (CSV)</span>
          </button>

          <button
            onClick={() => onOpenReport('hussain')}
            className="border border-zinc-400 bg-white px-4 py-2.5 hover:bg-zinc-100 flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-800 shadow-[2px_2px_0px_0px_rgba(161,161,170,1)] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <Microscope className="w-4 h-4 text-zinc-700" />
            <span>🔬 View Hussain et al. (2017) Toxicity Validation</span>
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-zinc-200 text-xs font-mono text-zinc-600">
          Developed for NCSC 2026-27 | Sub-Theme 5: IKS | KV Bhawanipatna
        </div>
      </div>

      {/* Persistent Brutalist Telemetry Bar */}
      <div className="border-t border-zinc-300 bg-zinc-50 px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-zinc-600 gap-2">
        <div className="flex items-center gap-3">
          <span className="text-zinc-900 font-bold">WEEDS TO WEALTH v1.0</span>
          <span>|</span>
          <span>National Children's Science Congress (NCSC)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Bio-reactor System Active
          </span>
          <span className="text-zinc-400 hidden sm:inline">Zero Synthetic Runoff Initiative</span>
        </div>
      </div>
    </footer>
  );
};
