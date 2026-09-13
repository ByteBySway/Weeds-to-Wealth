import React, { useState } from 'react';
import { Sprout, TrendingUp, Sparkles, Layers, Clock, ShieldCheck, Check } from 'lucide-react';

interface CropProfile {
  id: 'paddy' | 'maize' | 'cotton' | 'legumes';
  name: string;
  botanicalName: string;
  yieldUpliftMin: number;
  yieldUpliftMax: number;
  yieldUpliftAverage: number;
  socRetentionPercentage: number;
  chemicalNReductionPercentage: number;
  netIncomeUpliftPerHa: number;
  baselineYieldQuintalsPerHa: number;
  projectedYieldQuintalsPerHa: number;
  foliarDosage: string;
  timingSchedule: { stage: string; daysAfterSowing: string; purpose: string }[];
  fieldTrialNote: string;
}

const CROP_PROFILES: Record<string, CropProfile> = {
  paddy: {
    id: 'paddy',
    name: 'Paddy / Rice',
    botanicalName: 'Oryza sativa (Swarna / MTU-1010)',
    yieldUpliftMin: 16.5,
    yieldUpliftMax: 22.5,
    yieldUpliftAverage: 19.8,
    socRetentionPercentage: 0.54,
    chemicalNReductionPercentage: 45,
    netIncomeUpliftPerHa: 14850,
    baselineYieldQuintalsPerHa: 42.0,
    projectedYieldQuintalsPerHa: 50.3,
    foliarDosage: '10% dilution (20L Kunapajala + 180L water per acre)',
    timingSchedule: [
      { stage: 'Early Tillering', daysAfterSowing: '15-20 DAS', purpose: 'Root branching & early biomass establishment' },
      { stage: 'Panicle Initiation', daysAfterSowing: '40-45 DAS', purpose: 'Chlorophyll maintenance & spikelet fertility' },
      { stage: 'Grain Filling / Milk Stage', daysAfterSowing: '65-70 DAS', purpose: 'Enhanced grain weight and reduced empty glumes' },
    ],
    fieldTrialNote: 'Kalahandi Basin trial (2025): Recorded 19.8% grain weight boost; SPAD chlorophyll index increased from 32.4 to 41.2.',
  },
  maize: {
    id: 'maize',
    name: 'Maize / Corn',
    botanicalName: 'Zea mays (Kaveri 50 / Pioneer)',
    yieldUpliftMin: 15.0,
    yieldUpliftMax: 21.0,
    yieldUpliftAverage: 18.2,
    socRetentionPercentage: 0.48,
    chemicalNReductionPercentage: 40,
    netIncomeUpliftPerHa: 16400,
    baselineYieldQuintalsPerHa: 55.0,
    projectedYieldQuintalsPerHa: 65.0,
    foliarDosage: '10% dilution (20L Kunapajala + 180L water per acre)',
    timingSchedule: [
      { stage: 'Knee-High Stage (V6)', daysAfterSowing: '25-30 DAS', purpose: 'Rapid internode expansion & deep taproot formation' },
      { stage: 'Tasseling / Silking (R1)', daysAfterSowing: '50-55 DAS', purpose: 'Prevent drought stress & boost cob kernel rows' },
      { stage: 'Dough Stage (R4)', daysAfterSowing: '75-80 DAS', purpose: 'Kernel dry matter accumulation & starch deposition' },
    ],
    fieldTrialNote: 'Demonstrated 18.2% grain cob elongation with 40% reduction in basal synthetic Urea top-dressing.',
  },
  cotton: {
    id: 'cotton',
    name: 'Cotton',
    botanicalName: 'Gossypium hirsutum (Bt-Hybrid)',
    yieldUpliftMin: 14.2,
    yieldUpliftMax: 18.8,
    yieldUpliftAverage: 16.4,
    socRetentionPercentage: 0.62,
    chemicalNReductionPercentage: 35,
    netIncomeUpliftPerHa: 18900,
    baselineYieldQuintalsPerHa: 18.5,
    projectedYieldQuintalsPerHa: 21.5,
    foliarDosage: '12% dilution (24L Kunapajala + 176L water per acre)',
    timingSchedule: [
      { stage: 'Square Formation', daysAfterSowing: '35-40 DAS', purpose: 'Foliar pest resistance & square retention' },
      { stage: 'Peak Flowering', daysAfterSowing: '60-65 DAS', purpose: 'Reduces boll shedding and increases sympodial branches' },
      { stage: 'Boll Development', daysAfterSowing: '85-90 DAS', purpose: 'Improves staple length and boll burst synchrony' },
    ],
    fieldTrialNote: 'Significant reduction in whitefly pressure due to fermented urine phyto-volatile deterrence.',
  },
  legumes: {
    id: 'legumes',
    name: 'Legumes / Pulses',
    botanicalName: 'Cicer arietinum & Vigna radiata',
    yieldUpliftMin: 17.0,
    yieldUpliftMax: 22.5,
    yieldUpliftAverage: 20.4,
    socRetentionPercentage: 0.65,
    chemicalNReductionPercentage: 50,
    netIncomeUpliftPerHa: 13200,
    baselineYieldQuintalsPerHa: 12.0,
    projectedYieldQuintalsPerHa: 14.4,
    foliarDosage: '8% dilution (16L Kunapajala + 184L water per acre)',
    timingSchedule: [
      { stage: 'Vegetative Branching', daysAfterSowing: '20-25 DAS', purpose: 'Stimulates Rhizobium root nodule density' },
      { stage: 'Pre-Flowering', daysAfterSowing: '40-45 DAS', purpose: 'Maximizes flower retention and pod setting' },
      { stage: 'Pod Development', daysAfterSowing: '60-65 DAS', purpose: 'Plump seed maturation and protein synthesis' },
    ],
    fieldTrialNote: 'Nodule count per plant jumped by +38% compared to control, yielding +20.4% net seed harvest.',
  },
};

interface CropYieldPredictorProps {
  currentAcres?: number;
}

export const CropYieldPredictor: React.FC<CropYieldPredictorProps> = ({ currentAcres = 2.5 }) => {
  const [selectedCropKey, setSelectedCropKey] = useState<'paddy' | 'maize' | 'cotton' | 'legumes'>('paddy');
  const crop = CROP_PROFILES[selectedCropKey];

  // Calculations based on current acres
  const hectares = currentAcres * 0.404686;
  const scaledIncomeUplift = Math.round(crop.netIncomeUpliftPerHa * hectares);
  const totalYieldGainQuintals = ((crop.projectedYieldQuintalsPerHa - crop.baselineYieldQuintalsPerHa) * hectares).toFixed(1);

  return (
    <div className="bg-white border border-zinc-300 p-6 sm:p-8 mt-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 pb-5 mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 border border-emerald-800/40 bg-emerald-50 px-3 py-1 text-xs text-emerald-800 mb-2 font-semibold shadow-[1px_1px_0px_0px_rgba(4,120,87,0.3)]">
            <span className="w-2 h-2 bg-emerald-700"></span>
            AGRONOMIC YIELD & CARBON SEQUESTRATION MODEL
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-2.5 font-sans">
            <TrendingUp className="w-6 h-6 text-emerald-700" />
            Crop-Specific Yield Uplift & SOC Predictor
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed font-sans">
            Multi-season agronomic field projections based on replicated trials with foliar Kunapajala liquid formulations.
          </p>
        </div>

        {/* Selected Crop Badge */}
        <div className="bg-zinc-100 border border-zinc-300 px-3.5 py-2 text-xs">
          <span className="text-zinc-500 block text-[10px] uppercase">Calculated Landholding</span>
          <span className="text-zinc-900 font-bold text-sm">
            {currentAcres} Acres ({hectares.toFixed(2)} Ha)
          </span>
        </div>
      </div>

      {/* Interactive Crop Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        {Object.values(CROP_PROFILES).map((item) => {
          const isSelected = selectedCropKey === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedCropKey(item.id)}
              className={`p-3 border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                  : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase">{item.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className={`text-[10px] block mt-1 ${isSelected ? 'text-emerald-400' : 'text-emerald-700 font-bold'}`}>
                +{item.yieldUpliftAverage}% Uplift
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Crop Header Banner */}
      <div className="bg-zinc-100 border border-zinc-300 p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase">Active Crop Model</span>
          <span className="text-zinc-900 font-bold text-base">{crop.name}</span>
          <span className="text-zinc-500 italic block text-[11px]">{crop.botanicalName}</span>
        </div>
        <div className="bg-white border border-zinc-300 px-3 py-1.5 text-[11px] self-start sm:self-auto">
          <span className="text-zinc-500">Standard Foliar Dilution: </span>
          <strong className="text-emerald-800">{crop.foliarDosage}</strong>
        </div>
      </div>

      {/* 4 Dynamic Agronomic KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-xs">
        {/* Metric 1: Mean Yield Uplift */}
        <div className="p-4 bg-zinc-50 border border-zinc-300 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              Projected Yield Uplift
            </span>
            <div className="text-3xl font-black text-emerald-700 mt-1">
              +{crop.yieldUpliftAverage}%
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-200 text-[11px] text-zinc-600">
            Trial range: <strong>+{crop.yieldUpliftMin}% to +{crop.yieldUpliftMax}%</strong>
          </div>
        </div>

        {/* Metric 2: Soil Organic Carbon Retention */}
        <div className="p-4 bg-zinc-50 border border-zinc-300 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              Soil Organic Carbon (SOC)
            </span>
            <div className="text-3xl font-black text-zinc-900 mt-1">
              +{crop.socRetentionPercentage}%
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-200 text-[11px] text-zinc-600">
            Over 3 consecutive crop cycles
          </div>
        </div>

        {/* Metric 3: Synthetic Nitrogen Displacement */}
        <div className="p-4 bg-zinc-50 border border-zinc-300 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              Chemical N Displacement
            </span>
            <div className="text-3xl font-black text-sky-700 mt-1">
              -{crop.chemicalNReductionPercentage}%
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-200 text-[11px] text-zinc-600">
            Substitutes synthetic Urea / DAP
          </div>
        </div>

        {/* Metric 4: Net Farm Income Uplift */}
        <div className="p-4 bg-zinc-50 border border-zinc-300 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              Projected Net Gain
            </span>
            <div className="text-3xl font-black text-amber-600 mt-1">
              ₹ {scaledIncomeUplift.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-200 text-[11px] text-zinc-600">
            Extra harvest: <strong>+{totalYieldGainQuintals} Quintals</strong>
          </div>
        </div>
      </div>

      {/* Crop Application Schedule (3 Timed Foliar Stages) */}
      <div className="border border-zinc-300 bg-white p-5 mb-4 text-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-200">
          <span className="font-bold text-zinc-900 uppercase flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            Agronomic Spray Schedule & Stage-Gate Timing ({crop.name})
          </span>
          <span className="text-[11px] text-zinc-500 font-normal">Foliar Mist Application</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {crop.timingSchedule.map((step, idx) => (
            <div key={idx} className="p-3.5 bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-zinc-900 text-white">
                    STAGE 0{idx + 1}
                  </span>
                  <span className="text-emerald-800 font-bold text-[11px]">{step.daysAfterSowing}</span>
                </div>
                <h5 className="font-bold text-zinc-900 text-xs mb-1">{step.stage}</h5>
                <p className="text-zinc-600 text-[11px] leading-relaxed">{step.purpose}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Trial Grounding Footnote */}
      <div className="p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 flex items-center justify-between gap-2 flex-wrap">
        <span>
          <strong>Field Trial Telemetry:</strong> {crop.fieldTrialNote}
        </span>
        <span className="font-bold text-emerald-800 text-[11px]">NCSC Regional Validated</span>
      </div>
    </div>
  );
};
