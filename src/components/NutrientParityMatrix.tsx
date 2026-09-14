import React, { useState } from 'react';
import { FlaskConical, Zap, TrendingUp, ShieldCheck, DollarSign, ArrowUpRight, Scale } from 'lucide-react';

interface NutrientMetric {
  id: string;
  name: string;
  chemicalSymbol: string;
  role: string;
  kunapajalaValue: number; // standardized index 0-100
  kunapajalaDisplay: string;
  commercialValue: number; // standardized index 0-100
  commercialDisplay: string;
  unit: string;
  bioavailabilityRatio: string;
  advantage: string;
}

export const NutrientParityMatrix: React.FC = () => {
  const [dosageMode, setDosageMode] = useState<'per_acre' | 'per_100l'>('per_acre');
  const [activeNutrient, setActiveNutrient] = useState<string>('N');

  const nutrients: NutrientMetric[] = [
    {
      id: 'N',
      name: 'Available Nitrogen',
      chemicalSymbol: 'N (NH₄⁺ / NO₃⁻)',
      role: 'Vegetative foliar expansion & chlorophyll synthesis',
      kunapajalaValue: 88,
      kunapajalaDisplay: dosageMode === 'per_acre' ? '14.2 kg/ac (Chelated NH₄⁺)' : '1,420 mg/L',
      commercialValue: 92,
      commercialDisplay: dosageMode === 'per_acre' ? '23.0 kg/ac (Synthetic Urea)' : '1,500 mg/L (Volatile)',
      unit: 'kg/ac bio-available',
      bioavailabilityRatio: '94% (Organic Complex)',
      advantage: 'Zero volatilization; zero groundwater leaching; slow humic release over 35 days.',
    },
    {
      id: 'P',
      name: 'Orthophosphates',
      chemicalSymbol: 'P₂O₅',
      role: 'Root elongation, ATP cellular energy, & early tillering',
      kunapajalaValue: 74,
      kunapajalaDisplay: dosageMode === 'per_acre' ? '6.8 kg/ac (Microbially Solubilized)' : '680 mg/L',
      commercialValue: 82,
      commercialDisplay: dosageMode === 'per_acre' ? '9.2 kg/ac (Inorganic DAP)' : '920 mg/L',
      unit: 'kg/ac available',
      bioavailabilityRatio: '89% (Prevents Soil Fixation)',
      advantage: 'Citrate-soluble forms that do not precipitate with soil calcium or iron ions.',
    },
    {
      id: 'K',
      name: 'Potassium / Potash',
      chemicalSymbol: 'K₂O',
      role: 'Stomatal regulation, drought resistance, & grain filling',
      kunapajalaValue: 95,
      kunapajalaDisplay: dosageMode === 'per_acre' ? '18.6 kg/ac (Plant Sap Potash)' : '1,860 mg/L',
      commercialValue: 70,
      commercialDisplay: dosageMode === 'per_acre' ? '12.0 kg/ac (Synthetic MOP)' : '1,200 mg/L',
      unit: 'kg/ac available',
      bioavailabilityRatio: '98% (Direct Ionic Form)',
      advantage: 'Extracted naturally from raw Parthenium cellular sap; out-yields standard MOP.',
    },
    {
      id: 'S',
      name: 'Organic Sulfur',
      chemicalSymbol: 'SO₄²⁻',
      role: 'Cysteine & methionine amino-acid synthesis, pest defense',
      kunapajalaValue: 82,
      kunapajalaDisplay: dosageMode === 'per_acre' ? '4.5 kg/ac (Biological Sulfate)' : '450 mg/L',
      commercialValue: 55,
      commercialDisplay: dosageMode === 'per_acre' ? '2.8 kg/ac (Single Superphosphate)' : '280 mg/L',
      unit: 'kg/ac available',
      bioavailabilityRatio: '91% (Non-leaching)',
      advantage: 'Natural cow-urine taurine & sulfate derivatives resist wet-season soil washout.',
    },
    {
      id: 'ZnFe',
      name: 'Chelated Micronutrients',
      chemicalSymbol: 'Zn + Fe + Mn',
      role: 'Auxin hormone activation & electron transport enzymes',
      kunapajalaValue: 90,
      kunapajalaDisplay: dosageMode === 'per_acre' ? 'Zinc 18.4 ppm • Iron 42.1 ppm' : 'Zn 18.4 • Fe 42.1 ppm',
      commercialValue: 20,
      commercialDisplay: dosageMode === 'per_acre' ? '< 2.0 ppm (Absent in Urea/DAP)' : '0 ppm (Synthetic)',
      unit: 'ppm organic chelate',
      bioavailabilityRatio: '96% (Natural Fulvic Chelate)',
      advantage: 'Commercial NPK lacks essential trace micronutrients; Kunapajala prevents chlorosis.',
    },
  ];

  const currentNutrient = nutrients.find((n) => n.id === activeNutrient) || nutrients[0];

  return (
    <div className="bg-white border border-zinc-300 p-6 sm:p-8 mt-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 pb-5 mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 border border-emerald-800/40 bg-emerald-50 px-3 py-1 text-xs font-mono text-emerald-800 mb-2 font-semibold shadow-[1px_1px_0px_0px_rgba(4,120,87,0.3)]">
            <span className="w-2 h-2 bg-emerald-700"></span>
            N-P-K-S STOICHIOMETRIC TELEMETRY
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-2.5">
            <Scale className="w-6 h-6 text-emerald-700" />
            Nutrient Parity & Cost Efficiency Matrix
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
            Analytical breakdown comparing biological fermented Kunapajala liquid bio-fertilizer against commercial synthetic Urea, DAP, and MOP.
          </p>
        </div>

        {/* Dosage Toggle */}
        <div className="flex items-center gap-1.5 font-mono text-xs self-start md:self-auto bg-zinc-100 p-1 border border-zinc-300">
          <button
            onClick={() => setDosageMode('per_acre')}
            className={`px-3 py-1.5 border transition-all cursor-pointer font-bold ${
              dosageMode === 'per_acre'
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                : 'bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            Per Acre Standard (200L Spray)
          </button>
          <button
            onClick={() => setDosageMode('per_100l')}
            className={`px-3 py-1.5 border transition-all cursor-pointer font-bold ${
              dosageMode === 'per_100l'
                ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                : 'bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            Concentration (per 100 Liters)
          </button>
        </div>
      </div>

      {/* Main Comparative Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono">
        {/* Left Side (7 Cols): Visual Comparative Breakdown Bars */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-500 pb-2 border-b border-zinc-200">
            <span>NUTRIENT PARAMETER</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-600 inline-block"></span>
                <span className="font-bold text-zinc-800">Kunapajala (₹0)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-zinc-400 inline-block"></span>
                <span className="text-zinc-600">Synthetic NPK</span>
              </span>
            </div>
          </div>

          {nutrients.map((item) => {
            const isSelected = activeNutrient === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveNutrient(item.id)}
                className={`p-3.5 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-50 shadow-sm ring-1 ring-zinc-900'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                      {item.id === 'ZnFe' ? 'μ' : item.id}
                    </span>
                    <span className="font-bold text-zinc-900 text-xs sm:text-sm">{item.name}</span>
                    <span className="text-[11px] text-zinc-500">({item.chemicalSymbol})</span>
                  </div>
                  <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 border border-emerald-300">
                    {item.bioavailabilityRatio}
                  </span>
                </div>

                {/* Double Comparative Progress Bars */}
                <div className="space-y-1.5 mt-2">
                  {/* Kunapajala Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-700 mb-0.5">
                      <span className="font-bold text-emerald-800">Kunapajala Bio-Fluid:</span>
                      <span className="font-bold text-emerald-800">{item.kunapajalaDisplay}</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-2.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-500"
                        style={{ width: `${item.kunapajalaValue}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Commercial Synthetic Bar */}
                  <div>
                    <div className="flex justify-between text-[11px] text-zinc-500 mb-0.5">
                      <span>Commercial Synthetic:</span>
                      <span>{item.commercialDisplay}</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-2 overflow-hidden">
                      <div
                        className="bg-zinc-400 h-full transition-all duration-500"
                        style={{ width: `${item.commercialValue}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side (5 Cols): Telemetry & Economic Parity Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Selected Nutrient Deep Dive */}
          <div className="bg-zinc-900 text-zinc-100 p-5 border border-zinc-800 shadow-sm flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <span className="text-xs uppercase text-amber-400 font-bold tracking-wider">
                [ AGRONOMIC BIO-CHEMISTRY ]
              </span>
              <span className="text-xs text-zinc-400">{currentNutrient.chemicalSymbol}</span>
            </div>

            <h4 className="text-lg font-bold text-white mb-1">{currentNutrient.name}</h4>
            <p className="text-xs text-zinc-400 mb-4">{currentNutrient.role}</p>

            <div className="space-y-3 text-xs bg-zinc-950 p-3 border border-zinc-800">
              <div className="flex justify-between">
                <span className="text-zinc-400">Bioavailability Complex:</span>
                <span className="text-emerald-400 font-bold">{currentNutrient.bioavailabilityRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Kunapajala Reading:</span>
                <span className="text-white font-bold">{currentNutrient.kunapajalaDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Commercial Equivalent:</span>
                <span className="text-zinc-400">{currentNutrient.commercialDisplay}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-zinc-800/60 border-l-2 border-emerald-500 text-xs text-zinc-300 leading-relaxed">
              <strong className="text-emerald-400 block mb-1">Ecological Advantage:</strong>
              {currentNutrient.advantage}
            </div>
          </div>

          {/* Economic Parity Highlight: ₹0 vs Commercial Prices */}
          <div className="bg-emerald-50 border border-emerald-300 p-5 text-xs text-emerald-950">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200 mb-3">
              <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-emerald-900">
                <DollarSign className="w-4 h-4 text-emerald-800" />
                Input Economics Comparison
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 border border-emerald-300">
                100% SUBSIDY-FREE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center my-3">
              <div className="bg-white p-2.5 border border-emerald-300 shadow-xs">
                <span className="text-[10px] text-zinc-500 block uppercase">Kunapajala Liquid</span>
                <span className="text-2xl font-black text-emerald-700 block mt-0.5">₹0.00</span>
                <span className="text-[10px] text-emerald-800 font-semibold">Free Weed & Urine Inputs</span>
              </div>

              <div className="bg-white p-2.5 border border-zinc-300 shadow-xs">
                <span className="text-[10px] text-zinc-500 block uppercase">Synthetic NPK Stack</span>
                <span className="text-2xl font-black text-rose-700 block mt-0.5">₹3,318</span>
                <span className="text-[10px] text-zinc-500">Urea + DAP + MOP / Acre</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-900 leading-snug">
              Eliminating commercial fertilizers prevents cash-flow distress for smallholder farmers in Kalahandi and Western Odisha while removing over 45 kg of toxic invasive weed biomass per acre.
            </p>
          </div>
        </div>
      </div>

      {/* High-Stakes Brutalist 3-Column Telemetry Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-200 font-mono">
        {/* Card 1: Organic Carbon Boost (+28% Soil Humus) */}
        <div className="p-4 bg-zinc-50 border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
              [ SOIL HUMUS DYNAMICS ]
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 font-bold">
              VERIFIED
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700">
            +28% <span className="text-xs font-normal text-zinc-600 font-sans">Soil Humus</span>
          </div>
          <p className="text-xs text-zinc-700 mt-2 leading-relaxed font-sans">
            Anaerobic microbial digestate enriches total Organic Carbon Pool (+28.4% humus), improving water-holding capacity in drought-prone Kalahandi soils.
          </p>
        </div>

        {/* Card 2: Sulfur Enrichment (Cow Urine & Mustard Cake) */}
        <div className="p-4 bg-zinc-50 border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
              [ SULFUR ENRICHMENT ]
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 font-bold">
              OILSEEDS KEY
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            +60.7% <span className="text-xs font-normal text-zinc-600 font-sans">Bio-Sulfate (SO₄²⁻)</span>
          </div>
          <p className="text-xs text-zinc-700 mt-2 leading-relaxed font-sans">
            Cow urine & mustard cake co-fermentation yields plant-absorbable organic sulfur, vital for oilseed protein, methionine, and oil-content synthesis.
          </p>
        </div>

        {/* Card 3: Cost Reduction (-84% Input Cost per Acre) */}
        <div className="p-4 bg-zinc-50 border-2 border-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
              [ AGRONOMIC ECONOMICS ]
            </span>
            <span className="text-[10px] bg-emerald-800 text-white px-1.5 py-0.2 font-bold">
              ₹0 WEED ASSET
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800">
            -84% <span className="text-xs font-normal text-zinc-600 font-sans">Cost / Acre</span>
          </div>
          <p className="text-xs text-zinc-700 mt-2 leading-relaxed font-sans">
            Slashes seasonal input expenditure from ₹3,318/acre (synthetic Urea + DAP + MOP stack) down to negligible zero-cost local weed biomass inputs.
          </p>
        </div>
      </div>
    </div>
  );
};
