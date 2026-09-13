import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Activity, Sparkles, ChevronRight, Sliders, Dna, CheckCircle2 } from 'lucide-react';

interface DayKineticData {
  day: number;
  partheninMgPerG: number;
  detoxPercentage: number;
  germinationInhibition: number; // % radicle inhibition
  chemicalForm: string;
  molecularState: string;
  microbialAgents: string;
  riskStatus: 'critical' | 'moderate' | 'safe' | 'cleared';
  transformationSummary: string;
}

const KINETIC_TIMELINE: DayKineticData[] = [
  {
    day: 1,
    partheninMgPerG: 14.8,
    detoxPercentage: 0.0,
    germinationInhibition: 98.4,
    chemicalForm: 'Intact Sesquiterpene Lactone Ring',
    molecularState: 'C₁₇H₂₀O₄ (Intact α-methylene-γ-lactone with exocyclic double bond)',
    microbialAgents: 'Indigenous Cow Urine Enteric Bacteria & Epiphytic Microflora',
    riskStatus: 'critical',
    transformationSummary: 'High contact cytotoxicity; causes acute contact dermatitis and total seed radicle necrosis.',
  },
  {
    day: 3,
    partheninMgPerG: 11.2,
    detoxPercentage: 24.3,
    germinationInhibition: 82.0,
    chemicalForm: 'Early Lactone Ring Weakening',
    molecularState: 'Electrophilic attack by microbial carboxylases initiating ester bond cleavage',
    microbialAgents: 'Lactic Acid Bacteria (Lactobacillus plantarum, Enterococcus spp.)',
    riskStatus: 'critical',
    transformationSummary: 'Organic acid production lowers vessel pH to ~5.7, stressing the sesquiterpene lactone stability.',
  },
  {
    day: 7,
    partheninMgPerG: 3.1,
    detoxPercentage: 79.1,
    germinationInhibition: 34.5,
    chemicalForm: 'Peak Nadir Ring Hydrolysis',
    molecularState: 'Hydrolytic cleavage of the α-methylene-γ-lactone pharmacophore into carboxylic acids',
    microbialAgents: 'Acidogenic consortia operating at peak pH 4.5 nadir',
    riskStatus: 'moderate',
    transformationSummary: 'Critical biochemical turning point: 79% of allergenic lactone rings broken. Allergic contact risk drops significantly.',
  },
  {
    day: 10,
    partheninMgPerG: 1.6,
    detoxPercentage: 89.2,
    germinationInhibition: 14.0,
    chemicalForm: 'Proteolytic Breakdown & Peptide Conjugation',
    molecularState: 'Degraded sesquiterpene fragments conjugated to amino acids and microbial peptides',
    microbialAgents: 'Bacillus subtilis, Cellulomonas, Proteolytic consortia',
    riskStatus: 'moderate',
    transformationSummary: 'Transition to facultative anaerobic proteolysis. Free nitrogen converts to bio-available ammonium.',
  },
  {
    day: 14,
    partheninMgPerG: 0.42,
    detoxPercentage: 97.2,
    germinationInhibition: 3.2,
    chemicalForm: 'Near-Complete Allelochemical Inactivation',
    molecularState: 'Fully ring-opened sesquiterpenic dicarboxylic acids and humic precursors',
    microbialAgents: 'Anaerobic biofilm forming prior to vessel airtight hermetic seal',
    riskStatus: 'safe',
    transformationSummary: 'Final manual stirring step before closing airlocks for terminal anaerobic digestion.',
  },
  {
    day: 17,
    partheninMgPerG: 0.08,
    detoxPercentage: 99.4,
    germinationInhibition: 0.5,
    chemicalForm: 'Methanogenic Humification',
    molecularState: 'Residual hydrocarbons metabolized by strict anaerobes into methane & carbon dioxide',
    microbialAgents: 'Methanobacterium, Methanobrevibacter, Clostridium clusters',
    riskStatus: 'cleared',
    transformationSummary: 'Zero phytotoxicity. Odor transitions from acidic-pungent to earthy Vrikshayurveda bouquet.',
  },
  {
    day: 20,
    partheninMgPerG: 0.02,
    detoxPercentage: 99.86,
    germinationInhibition: 0.0,
    chemicalForm: 'Bio-Safe Phyto-Nutrient & Amino-Acid Chelate',
    molecularState: '100% neutralized; enriched with proline, glutamic acid, and fulvic complexed minerals',
    microbialAgents: 'Mature stabilized anaerobic bio-consortium with antagonistic biocontrol properties',
    riskStatus: 'cleared',
    transformationSummary: 'Complete bioconversion: noxious invasive weed rendered into a 100% safe, high-potency foliar bio-fertilizer.',
  },
];

export const PartheninDetoxVisualizer: React.FC = () => {
  const [currentDay, setCurrentDay] = useState<number>(7);

  // Find exact day data or interpolate closest
  const data =
    KINETIC_TIMELINE.find((d) => d.day === currentDay) ||
    KINETIC_TIMELINE.reduce((prev, curr) =>
      Math.abs(curr.day - currentDay) < Math.abs(prev.day - currentDay) ? curr : prev
    );

  return (
    <div className="bg-white border border-zinc-300 p-6 sm:p-8 mt-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 pb-5 mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 border border-amber-800/40 bg-amber-50 px-3 py-1 text-xs text-amber-800 mb-2 font-semibold shadow-[1px_1px_0px_0px_rgba(180,83,9,0.3)]">
            <span className="w-2 h-2 bg-amber-600 animate-pulse"></span>
            HPLC-MS MOLECULAR DETOXIFICATION KINETICS
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-2.5 font-sans">
            <Dna className="w-6 h-6 text-amber-600" />
            Parthenin Detoxification Progression Model
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed font-sans">
            Tracking the 20-day obligate anaerobic bioconversion of cytotoxic sesquiterpene lactone toxins (14.8 mg/g) into non-toxic, bio-available amino acids and organic chelates.
          </p>
        </div>

        {/* Detox Completion Badge */}
        <div className="bg-zinc-100 border border-zinc-300 px-4 py-2 text-xs">
          <span className="text-zinc-500 block text-[10px] uppercase">Lactone Cleavage Status</span>
          <span className="text-emerald-800 font-black text-base sm:text-lg">
            {data.detoxPercentage.toFixed(1)}% Neutralized
          </span>
        </div>
      </div>

      {/* Interactive Day Scrubber & Milestones */}
      <div className="bg-zinc-900 text-zinc-100 p-5 border border-zinc-800 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-zinc-800 gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase tracking-wider font-bold text-zinc-300">
              FERMENTATION CYCLE SCRUBBER: DAY {currentDay} OF 20
            </span>
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <span className="text-[11px] text-zinc-400 mr-1 hidden sm:inline">Milestones:</span>
            {[1, 3, 7, 10, 14, 17, 20].map((d) => (
              <button
                key={d}
                onClick={() => setCurrentDay(d)}
                className={`px-2 py-1 border text-[11px] cursor-pointer transition-all ${
                  currentDay === d
                    ? 'bg-amber-500 text-black border-amber-400 font-bold'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500'
                }`}
              >
                Day {d}
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={currentDay}
            onChange={(e) => setCurrentDay(parseInt(e.target.value))}
            className="w-full h-3 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-amber-500 focus:outline-none"
          />

          <div className="flex justify-between text-[11px] text-zinc-400 pt-1">
            <span>Day 1: Raw Toxic Inoculation (14.8 mg/g)</span>
            <span className="text-amber-400 font-bold">Day 7: Acid Nadir</span>
            <span className="text-sky-400">Day 14: Seal</span>
            <span className="text-emerald-400 font-bold">Day 20: 100% Cleaved</span>
          </div>
        </div>
      </div>

      {/* Kinetic Telemetry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-xs">
        {/* Metric 1: Residual Toxin Concentration */}
        <div className="p-4 bg-zinc-50 border border-zinc-300 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              Residual Parthenin Concentration
            </span>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1">
              {data.partheninMgPerG.toFixed(2)}{' '}
              <span className="text-xs font-normal text-zinc-500">mg / g dry wt</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-200 text-[11px]">
            <span className="text-zinc-600">Starting Baseline: </span>
            <strong className="text-rose-700">14.80 mg/g</strong>
          </div>
        </div>

        {/* Metric 2: Seed Radicle Inhibition Index */}
        <div className="p-4 bg-zinc-50 border border-zinc-300 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              Allelopathic Germination Inhibition
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              {data.germinationInhibition.toFixed(1)}%
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-200 text-[11px]">
            <span className="text-zinc-600">Tested on: </span>
            <strong className="text-zinc-800">Vigna radiata (Mung Bean)</strong>
          </div>
        </div>

        {/* Metric 3: Biological Safety Tier */}
        <div className="p-4 bg-zinc-50 border border-zinc-300 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block font-semibold">
              Agronomic Biosecurity Tier
            </span>
            <div className="mt-1">
              {data.riskStatus === 'critical' && (
                <span className="inline-flex items-center gap-1.5 text-rose-700 font-bold text-sm bg-rose-50 px-2.5 py-1 border border-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  HIGH CYTOTOXICITY
                </span>
              )}
              {data.riskStatus === 'moderate' && (
                <span className="inline-flex items-center gap-1.5 text-amber-700 font-bold text-sm bg-amber-50 px-2.5 py-1 border border-amber-300">
                  <Activity className="w-4 h-4 text-amber-600" />
                  PARTIAL DEGRADATION
                </span>
              )}
              {data.riskStatus === 'safe' && (
                <span className="inline-flex items-center gap-1.5 text-sky-700 font-bold text-sm bg-sky-50 px-2.5 py-1 border border-sky-300">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  MINIMAL RESIDUAL RISK
                </span>
              )}
              {data.riskStatus === 'cleared' && (
                <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold text-sm bg-emerald-50 px-2.5 py-1 border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  100% BIO-SAFE FERTILIZER
                </span>
              )}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-zinc-200 text-[11px] text-zinc-600">
            Foliar Spray Ready: <strong>{currentDay >= 18 ? 'YES (Dilute 10%)' : 'NO (Fermenting)'}</strong>
          </div>
        </div>
      </div>

      {/* Molecular Transformation Dossier Box */}
      <div className="border border-zinc-300 bg-zinc-50 p-4 sm:p-5 space-y-3 text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
          <span className="font-bold uppercase text-zinc-900 text-xs flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-zinc-900 inline-block"></span>
            Biochemical Transformation State (Day {currentDay})
          </span>
          <span className="text-[11px] text-zinc-500 font-normal">Peer-Reviewed: Hussain et al. (2017)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Molecular Configuration:</span>
              <span className="font-bold text-zinc-900 block">{data.chemicalForm}</span>
              <span className="text-[11px] text-zinc-600 block mt-0.5">{data.molecularState}</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-semibold">Active Inoculant Consortia:</span>
              <span className="text-zinc-800 font-semibold">{data.microbialAgents}</span>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 p-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-semibold mb-1">
                Agronomic Significance:
              </span>
              <p className="text-zinc-700 leading-relaxed text-xs">{data.transformationSummary}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Contact Allergenicity:</span>
              <strong className={currentDay >= 7 ? 'text-emerald-700' : 'text-rose-700'}>
                {currentDay >= 15 ? 'Destroyed (<0.1%)' : currentDay >= 7 ? 'Reduced by 79%' : 'Intense (Wear PPE)'}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
