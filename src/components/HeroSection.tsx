import React from 'react';
import { Coins, Sprout, CheckCircle2, FlaskConical, ArrowRight, BookOpen } from 'lucide-react';
import { LAB_TRIAL_COHORTS } from '../data/constants';
import { ActiveTab } from '../types';
import { NutrientParityMatrix } from './NutrientParityMatrix';
import { useLanguage } from '../context/LanguageContext';

interface HeroSectionProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenReport: (type: 'latex' | 'csv' | 'hussain') => void;
  onOpenIksMatrix?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenReport, onOpenIksMatrix }) => {
  const { t } = useLanguage();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Protocol Tag - Exact inline badge from Screenshot */}
      <div className="inline-flex items-center gap-2 border border-emerald-400/90 bg-emerald-50/70 px-3 py-1 text-xs font-mono text-emerald-900 mb-6 font-semibold shadow-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
        <span className="tracking-wider">{t.heroBadge}</span>
      </div>

      {/* Main Headline & Subtext matching screenshot */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 mb-4 max-w-5xl leading-[1.08] uppercase">
        {t.heroHeadline}
      </h1>
      <p className="text-base sm:text-lg text-zinc-700 mb-3 max-w-4xl font-normal leading-relaxed">
        {t.heroSubheadline}
      </p>
      <p className="text-sm sm:text-base text-zinc-600 mb-10 max-w-4xl leading-relaxed">
        {t.heroDescription}
      </p>

      {/* 3 Executive Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Metric 1: Input Economics */}
        <div className="bg-white border border-zinc-300 p-6 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(212,212,216,1)] hover:border-zinc-400 transition-all">
          <div>
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs uppercase font-mono tracking-widest font-semibold text-zinc-600">
                INPUT ECONOMICS
              </span>
              <Coins className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wide">
              {t.costTitle}
            </span>
            <div className="font-mono text-emerald-700 text-4xl sm:text-5xl font-extrabold mt-3 tracking-tight">
              ₹0.00 <span className="text-lg font-normal text-emerald-800">/ Acre</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-600">{t.zeroCommercialRawInputs}</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              {t.hundredPercentFree}
            </span>
          </div>
        </div>

        {/* Metric 2: Agronomic Potency */}
        <div className="bg-white border border-zinc-300 p-6 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(212,212,216,1)] hover:border-zinc-400 transition-all">
          <div>
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs uppercase font-mono tracking-widest font-semibold text-zinc-600">
                AGRONOMIC POTENCY
              </span>
              <Sprout className="w-4 h-4 text-zinc-700" />
            </div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wide">
              MEAN DRY BIOMASS
            </span>
            <div className="font-mono text-zinc-900 text-4xl sm:text-5xl font-extrabold mt-3 tracking-tight">
              2.84g
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-600">vs 2.71g Synthetic NPK Control</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              +4.8% Gain
            </span>
          </div>
        </div>

        {/* Metric 3: Statistical Rigor */}
        <div className="bg-white border border-zinc-300 p-6 flex flex-col justify-between shadow-[3px_3px_0px_0px_rgba(212,212,216,1)] hover:border-zinc-400 transition-all">
          <div>
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs uppercase font-mono tracking-widest font-semibold text-zinc-600">
                STATISTICAL RIGOR
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wide">
              STATISTICAL VALIDATION
            </span>
            <div className="font-mono text-emerald-700 text-4xl sm:text-5xl font-extrabold mt-3 tracking-tight">
              p &lt; 0.0001
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-zinc-200 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-600">Confidence Interval: 99.99%</span>
            <span className="text-zinc-800 font-bold bg-zinc-100 px-2 py-0.5 border border-zinc-300">
              n=120 Plants
            </span>
          </div>
        </div>
      </div>

      {/* Lab Trial Benchmarks (Vigna radiata) Table */}
      <div className="border border-zinc-300 bg-white p-5 sm:p-6 mb-12 shadow-[3px_3px_0px_0px_rgba(212,212,216,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-zinc-200 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm sm:text-base font-bold font-mono uppercase tracking-tight text-zinc-900">
                LAB TRIAL BENCHMARKS (VIGNA RADIATA)
              </h3>
            </div>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              Triplicate Randomized Block Design, 30-Day Vegetative Observation Cycle
            </p>
          </div>
          <span className="self-start sm:self-auto font-mono text-xs px-2.5 py-1 bg-zinc-100 border border-zinc-300 text-zinc-700 font-medium">
            Verified Protocol
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs sm:text-sm border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-zinc-200 text-xs text-zinc-500 uppercase">
                <th className="py-2.5 pr-4">Experimental Cohort</th>
                <th className="py-2.5 px-4 text-right sm:text-left">Shoot Length (cm)</th>
                <th className="py-2.5 px-4 text-right sm:text-left">Root Length (cm)</th>
                <th className="py-2.5 px-4 text-right sm:text-left">Chlorophyll Index (SPAD)</th>
                <th className="py-2.5 pl-4 text-right sm:text-left">Mean Dry Biomass (g)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-zinc-800">
              {LAB_TRIAL_COHORTS.map((cohort) => (
                <tr
                  key={cohort.name}
                  className={
                    cohort.isPrimary
                      ? 'bg-emerald-50/60 font-semibold text-emerald-950 border-l-4 border-l-emerald-700'
                      : 'hover:bg-zinc-50'
                  }
                >
                  <td className="py-3 pr-4 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 shrink-0 ${
                        cohort.isPrimary ? 'bg-emerald-700' : 'bg-zinc-400'
                      }`}
                    ></span>
                    <span>{cohort.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-right sm:text-left">{cohort.shootLength}</td>
                  <td className="py-3 px-4 font-mono text-right sm:text-left">{cohort.rootLength}</td>
                  <td className="py-3 px-4 font-mono text-right sm:text-left">{cohort.spadChlorophyll}</td>
                  <td
                    className={`py-3 pl-4 font-mono font-bold text-right sm:text-left ${
                      cohort.isPrimary ? 'text-emerald-800 text-base' : 'text-zinc-700'
                    }`}
                  >
                    {cohort.meanDryBiomass}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODULE 2: N-P-K-S NUTRIENT PARITY MATRIX */}
      <NutrientParityMatrix />

      {/* Dedicated IKS & Academic Citations Matrix Callout Banner */}
      {onOpenIksMatrix && (
        <div className="my-10 bg-amber-50 border-2 border-amber-500 p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(217,119,6,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div>
            <span className="text-xs uppercase tracking-wider font-bold text-amber-900 flex items-center gap-1.5 mb-1">
              <BookOpen className="w-4 h-4 text-amber-700" />
              ANCIENT CODEX TO MODERN CHROMATOGRAPHY
            </span>
            <h4 className="text-base sm:text-lg font-bold text-zinc-900 font-sans">
              Surapala Vrikshayurveda & HPLC Molecular Telemetry Dossier
            </h4>
            <p className="text-xs text-zinc-600 font-sans mt-0.5 max-w-xl">
              Cross-examine 1,000-year-old Sanskrit fermentation slokas against modern peer-reviewed HPLC datasets (Hussain et al., 2017).
            </p>
          </div>
          <button
            onClick={onOpenIksMatrix}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            📜 View IKS & Academic Citations Matrix
          </button>
        </div>
      )}

      {/* Action Quick Launchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => onNavigate('calculator')}
          className="p-4 bg-zinc-900 hover:bg-zinc-800 text-white border border-black text-left flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
        >
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold block mb-1">
              [ 01 / CALCULATOR ]
            </span>
            <span className="font-bold text-sm block">Launch Formulation Engine</span>
            <span className="text-xs text-zinc-400 font-mono">Calculate acres to biomass ratios</span>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 shrink-0" />
        </button>

        <button
          onClick={() => onNavigate('protocol')}
          className="p-4 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 text-left flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(212,212,216,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
        >
          <div>
            <span className="text-xs font-mono text-emerald-700 font-bold block mb-1">
              [ 02 / AI VISION ]
            </span>
            <span className="font-bold text-sm block">Run AI Biosecurity Scanner</span>
            <span className="text-xs text-zinc-500 font-mono">Verify Parthenium leaf samples</span>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-700 shrink-0" />
        </button>

        <button
          onClick={() => onNavigate('map')}
          className="p-4 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 text-left flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(212,212,216,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
        >
          <div>
            <span className="text-xs font-mono text-emerald-700 font-bold block mb-1">
              [ 03 / GEO INTELLIGENCE ]
            </span>
            <span className="font-bold text-sm block">Parthenium Eradication Grid</span>
            <span className="text-xs text-zinc-500 font-mono">Monsoon spread, village hubs & recovery rings</span>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-700 shrink-0" />
        </button>
      </div>
    </section>
  );
};
