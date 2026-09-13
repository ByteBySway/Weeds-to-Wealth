import React, { useState } from 'react';
import { Terminal, Cpu, Info, Calculator, Sparkles, AlertCircle, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { CropYieldPredictor } from './CropYieldPredictor';

interface FormulationEngineProps {
  initialAcres?: number;
  initialSpend?: number;
  acres?: number;
  onAcresChange?: (acres: number) => void;
  spend?: number;
  onSpendChange?: (spend: number) => void;
}

export const FormulationEngine: React.FC<FormulationEngineProps> = ({
  initialAcres = 2.5,
  initialSpend = 4000,
  acres: controlledAcres,
  onAcresChange,
  spend: controlledSpend,
  onSpendChange,
}) => {
  const { t } = useLanguage();
  const [internalAcres, setInternalAcres] = useState<number>(initialAcres);
  const [internalSpend, setInternalSpend] = useState<number>(initialSpend);

  const acres = controlledAcres !== undefined ? controlledAcres : internalAcres;
  const spend = controlledSpend !== undefined ? controlledSpend : internalSpend;

  const updateAcres = (val: number) => {
    setInternalAcres(val);
    onAcresChange?.(val);
  };

  const updateSpend = (val: number) => {
    setInternalSpend(val);
    onSpendChange?.(val);
  };

  const [dilutionRatio, setDilutionRatio] = useState<number>(10); // 10% foliar spray standard

  // Mathematical outputs per Vrikshayurveda Kunapajala stoichiometry
  const partheniumBiomassKg = (acres * 4.5);
  const cowUrineLiters = (acres * 4.5);
  const jaggeryKg = (acres * 0.5);
  const seasonalSavings = (acres * spend);

  // Agronomic and environmental equivalents
  const ureaBagsEliminated = Math.round(seasonalSavings / 350);
  const finishedFertilizerLiters = (cowUrineLiters * (100 / dilutionRatio));
  const nitrogenRunoffPreventedKg = (acres * 14.2).toFixed(1);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 border border-amber-600/40 bg-amber-50 px-3 py-1 text-xs font-mono text-amber-800 mb-3 font-semibold shadow-[1px_1px_0px_0px_rgba(217,119,6,0.3)]">
          <span className="w-2 h-2 bg-amber-600"></span>
          {t.roiBadge}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
          {t.roiTitle}
        </h2>
        <p className="text-zinc-600 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
          {t.roiSubtitle}
        </p>
      </div>

      {/* Dark-Mode Scientific Terminal Block */}
      <div className="bg-zinc-900 text-zinc-100 border border-zinc-700 p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.85)] flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-5xl mx-auto">
        
        {/* Left Column: Interactive Inputs */}
        <div className="flex-1 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800 pb-8 lg:pb-0 lg:pr-8">
          <div>
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-zinc-800 font-mono text-xs uppercase tracking-wider text-zinc-400">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>TERMINAL BUFFER [INPUT PARAMETERS]</span>
              </span>
              <span className="text-emerald-400 text-[11px] font-bold">STATE: ONLINE</span>
            </div>

            {/* Quick Land Size Presets */}
            <div className="mb-6">
              <span className="text-xs font-mono text-zinc-400 block mb-2 uppercase tracking-wide">
                Quick Landholding Presets:
              </span>
              <div className="grid grid-cols-4 gap-2 font-mono text-xs">
                {[1, 2.5, 5, 10].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => updateAcres(preset)}
                    className={`py-1.5 px-2 border text-center transition-all cursor-pointer ${
                      acres === preset
                        ? 'bg-emerald-700 text-white border-emerald-500 font-bold'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {preset} Ac
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: Land Size (Acres 1-50, default 2.5) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-mono text-zinc-200 font-semibold">
                  Cultivation Land Size (Acres)
                </label>
                <span className="font-mono text-emerald-400 text-lg sm:text-xl font-bold bg-zinc-950 px-3 py-1 border border-zinc-700">
                  {acres.toFixed(1)} <span className="text-xs text-zinc-400 font-normal">Acres</span>
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="0.5"
                value={acres}
                onChange={(e) => updateAcres(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-1.5">
                <span>1.0 Acre (Smallholder)</span>
                <span>25.0 Acres</span>
                <span>50.0 Acres (Commercial)</span>
              </div>
            </div>

            {/* Slider 2: Current NPK Spend (₹/Acre 1000-5000, default 4000) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-mono text-zinc-200 font-semibold">
                  Current Synthetic NPK Spend (₹/Acre)
                </label>
                <span className="font-mono text-amber-400 text-lg sm:text-xl font-bold bg-zinc-950 px-3 py-1 border border-zinc-700">
                  ₹{spend.toLocaleString('en-IN')} <span className="text-xs text-zinc-400 font-normal">/ Acre</span>
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="5000"
                step="100"
                value={spend}
                onChange={(e) => updateSpend(parseInt(e.target.value, 10))}
                className="w-full h-2.5 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-1.5">
                <span>₹1,000 (Highly Subsidized)</span>
                <span>₹5,000 (Commercial High-Yield)</span>
              </div>
            </div>
          </div>

          {/* Kunapajala Formula Basis Box */}
          <div className="p-4 bg-zinc-950/80 border border-zinc-800 text-xs font-mono text-zinc-400">
            <p className="flex items-center gap-1.5 text-zinc-200 font-bold mb-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-400 inline shrink-0" />
              <span>Kunapajala Stoichiometry Formula:</span>
            </p>
            <p className="leading-relaxed">
              Standard 1-Acre treatment = 4.5 kg fresh-harvested Parthenium foliage + 4.5 L fresh <em>Bos indicus</em> urine + 0.5 kg unrefined jaggery (carbon-nitrogen substrate).
            </p>
          </div>
        </div>

        {/* Right Column: Computed Outputs */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-zinc-800 font-mono text-xs uppercase tracking-wider text-zinc-400">
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>COMPUTED FORMULATION MATRIX</span>
              </span>
              <span className="text-zinc-500 text-[11px]">20-DAY CYCLE</span>
            </div>

            {/* Live Outputs 1, 2, 3 */}
            <div className="space-y-3.5 font-mono">
              <div className="p-3.5 bg-zinc-950 border border-zinc-800 flex justify-between items-center shadow-inner">
                <div>
                  <span className="text-xs text-zinc-400 uppercase tracking-wide block">
                    Required Parthenium Biomass:
                  </span>
                  <span className="text-[11px] text-zinc-500">Harvest before flowering</span>
                </div>
                <span className="font-mono text-emerald-400 text-xl sm:text-2xl font-bold">
                  {partheniumBiomassKg.toFixed(1)} kg
                </span>
              </div>

              <div className="p-3.5 bg-zinc-950 border border-zinc-800 flex justify-between items-center shadow-inner">
                <div>
                  <span className="text-xs text-zinc-400 uppercase tracking-wide block">
                    Required Cow Urine:
                  </span>
                  <span className="text-[11px] text-zinc-500">Indigenous Bos indicus</span>
                </div>
                <span className="font-mono text-emerald-400 text-xl sm:text-2xl font-bold">
                  {cowUrineLiters.toFixed(1)} Liters
                </span>
              </div>

              <div className="p-3.5 bg-zinc-950 border border-zinc-800 flex justify-between items-center shadow-inner">
                <div>
                  <span className="text-xs text-zinc-400 uppercase tracking-wide block">
                    Required Jaggery:
                  </span>
                  <span className="text-[11px] text-zinc-500">Microbial carbohydrate inoculum</span>
                </div>
                <span className="font-mono text-emerald-400 text-xl sm:text-2xl font-bold">
                  {jaggeryKg.toFixed(1)} kg
                </span>
              </div>
            </div>

            {/* Agronomic Spray Yield */}
            <div className="mt-5 p-3 bg-zinc-800/40 border border-zinc-700/60 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Finished 10% Foliar Spray:</span>
              <span className="text-zinc-200 font-bold">{finishedFertilizerLiters.toFixed(0)} Liters (3 Applications)</span>
            </div>
          </div>

          {/* Bottom Highlight: Projected Seasonal Savings */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest block font-semibold">
              PROJECTED SEASONAL SAVINGS:
            </span>
            <div className="font-mono text-amber-500 text-4xl sm:text-5xl font-black mt-2 tracking-tight">
              ₹ {seasonalSavings.toLocaleString('en-IN')}
            </div>

            {/* Environmental Impact Badges including Dynamic Carbon Offset Counter */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-zinc-800/80 font-mono text-xs">
              {/* Dynamic Carbon Offset Counter: mandated exact label */}
              <div className="p-2.5 bg-zinc-950/90 border border-emerald-800/50 text-zinc-300">
                <span className="text-emerald-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  CARBON OFFSET COUNTER
                </span>
                <span className="text-emerald-400 font-bold text-sm block mt-1">
                  CO2 Prevented: {(acres * 12.4).toFixed(1)} kg
                </span>
                <span className="text-zinc-500 block text-[10px] mt-0.5">Displaced Haber-Bosch emissions</span>
              </div>

              <div className="p-2.5 bg-zinc-950/90 border border-zinc-800 text-zinc-400">
                <span className="text-zinc-500 block text-[10px] uppercase">Synthetic Offset</span>
                <span className="text-zinc-200 font-bold text-sm block mt-1">
                  {ureaBagsEliminated} Bags
                </span>
                <span className="text-zinc-500 block text-[10px] mt-0.5">Urea/DAP eradicated</span>
              </div>

              <div className="p-2.5 bg-zinc-950/90 border border-zinc-800 text-zinc-400">
                <span className="text-zinc-500 block text-[10px] uppercase">Runoff Protection</span>
                <span className="text-amber-400 font-bold text-sm block mt-1">
                  {nitrogenRunoffPreventedKg} kg N
                </span>
                <span className="text-zinc-500 block text-[10px] mt-0.5">Watershed pollution spared</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* MODULE 4: CROP-SPECIFIC YIELD UPLIFT & SOC PREDICTOR */}
      <CropYieldPredictor currentAcres={acres} />
    </section>
  );
};

