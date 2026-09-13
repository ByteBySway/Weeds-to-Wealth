import React from 'react';
import { motion, type Variants } from 'motion/react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.1,
    },
  },
};

const stepVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -24,
    y: 16,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // smooth cubic-bezier
    },
  },
};

export const FermentationProtocol: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 border border-zinc-400 bg-zinc-100 px-3 py-1 text-xs font-mono text-zinc-800 mb-3 font-semibold">
          <span>BIOCHEMICAL DIGESTION PROTOCOL</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
          20-Day Controlled Fermentation Stepper
        </h2>
        <p className="text-zinc-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
          Standardized biological stages for transforming raw <em>Parthenium</em> allelopathic foliage into neutral, chelated liquid organic NPK fertilizer.
        </p>
      </div>

      {/* Protocol Execution Schedule: Vertical timeline with solid left border */}
      <div className="max-w-3xl mx-auto mt-6">
        <div className="flex items-center gap-2 mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 font-bold">
            PROTOCOL EXECUTION SCHEDULE
          </span>
          <div className="flex-1 h-[1px] bg-zinc-300"></div>
        </div>

        {/* The Vertical Timeline with solid left border */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="border-l-2 border-zinc-300 ml-4 pl-6 sm:pl-8 py-2 space-y-10"
        >
          
          {/* Phase 1: Days 1 - 7 */}
          <motion.div variants={stepVariants} className="relative">
            <div className="absolute -left-[37px] sm:-left-[45px] top-0.5 w-7 h-7 bg-amber-600 text-white font-mono text-xs flex items-center justify-center font-bold border-2 border-white shadow-sm">
              1
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono text-amber-800 bg-amber-100 px-2.5 py-0.5 border border-amber-300 font-bold">
                DAYS 1 - 7
              </span>
              <h4 className="font-bold text-zinc-900 text-base sm:text-lg">
                Acidogenesis & Initial Methane Degassing
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 font-mono mb-3 leading-relaxed">
              Facultative enteric consortia hydrolyze labile carbohydrates and proteins. Rapid synthesis of low-molecular-weight organic acids reduces initial pH.
            </p>

            {/* Amber warning alert box mandated: "⚠️ Active Methane Venting: Daily manual stirring strictly required" */}
            <div className="bg-amber-50 border border-amber-300 text-amber-900 p-4 sm:p-5 shadow-sm">
              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0">⚠️</span>
                <div>
                  <h5 className="font-mono font-bold text-sm sm:text-base text-amber-950">
                    Active Methane Venting: Daily manual stirring strictly required
                  </h5>
                  <p className="text-xs sm:text-sm font-mono text-amber-900 mt-1 leading-relaxed">
                    Stir clockwise for 5 minutes daily using a sterile wooden paddle. Releases entrapped biogas (CH₄, CO₂) and maintains uniform aerobic-anaerobic bacterial interface.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical monitoring metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 font-mono text-xs text-zinc-600">
              <div className="bg-white border border-zinc-200 p-2">
                <span className="text-[10px] text-zinc-400 block uppercase">Target pH</span>
                <span className="font-bold text-zinc-800">4.2 - 5.1</span>
              </div>
              <div className="bg-white border border-zinc-200 p-2">
                <span className="text-[10px] text-zinc-400 block uppercase">Temperature</span>
                <span className="font-bold text-zinc-800">36°C - 42°C</span>
              </div>
              <div className="bg-white border border-zinc-200 p-2 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-zinc-400 block uppercase">Primary Agent</span>
                <span className="font-bold text-zinc-800 truncate block">Lactobacillus spp.</span>
              </div>
            </div>
          </motion.div>

          {/* Phase 2: Days 8 - 14 */}
          <motion.div variants={stepVariants} className="relative">
            <div className="absolute -left-[37px] sm:-left-[45px] top-0.5 w-7 h-7 bg-zinc-800 text-white font-mono text-xs flex items-center justify-center font-bold border-2 border-white shadow-sm">
              2
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono text-zinc-700 bg-zinc-200 px-2.5 py-0.5 border border-zinc-300 font-bold">
                DAYS 8 - 14
              </span>
              <h4 className="font-bold text-zinc-900 text-base sm:text-lg">
                Acetogenesis & Plant Cell Wall Hydrolysis
              </h4>
            </div>

            {/* Mandated Subtext: "Fibrous structure collapse and Volatile Fatty Acid formation" */}
            <div className="bg-white border border-zinc-300 p-4 sm:p-5 shadow-sm">
              <div className="font-mono text-xs sm:text-sm text-zinc-800 font-medium leading-relaxed">
                Fibrous structure collapse and Volatile Fatty Acid formation. Microbial consortia cleave recalcitrant phenolic bonds and digest plant cellulose matrices into bio-available potassium (K) and nitrogen (N) chelates.
              </div>
              <p className="text-xs text-zinc-500 font-mono mt-2 pt-2 border-t border-zinc-200">
                Lignocellulosic cell walls dissolve into humic and fulvic acid substrates, enabling complete mineral solubilization.
              </p>
            </div>

            {/* Technical monitoring metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 font-mono text-xs text-zinc-600">
              <div className="bg-white border border-zinc-200 p-2">
                <span className="text-[10px] text-zinc-400 block uppercase">Target pH</span>
                <span className="font-bold text-zinc-800">5.5 - 6.4</span>
              </div>
              <div className="bg-white border border-zinc-200 p-2">
                <span className="text-[10px] text-zinc-400 block uppercase">Temperature</span>
                <span className="font-bold text-zinc-800">32°C - 38°C</span>
              </div>
              <div className="bg-white border border-zinc-200 p-2 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-zinc-400 block uppercase">Primary Agent</span>
                <span className="font-bold text-zinc-800 truncate block">Syntrophomonas spp.</span>
              </div>
            </div>
          </motion.div>

          {/* Phase 3: Days 15 - 20 */}
          <motion.div variants={stepVariants} className="relative">
            <div className="absolute -left-[37px] sm:-left-[45px] top-0.5 w-7 h-7 bg-emerald-700 text-white font-mono text-xs flex items-center justify-center font-bold border-2 border-white shadow-sm">
              3
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 border border-emerald-300 font-bold">
                DAYS 15 - 20
              </span>
              <h4 className="font-bold text-zinc-900 text-base sm:text-lg">
                Terminal Maturation & Parthenin Cleavage
              </h4>
            </div>

            {/* Mandated Secure Box: "🔒 Strict Anaerobic Seal: Biofilm formation and alkaloid neutralization active" */}
            <div className="bg-zinc-100 border border-zinc-300 p-4 sm:p-5 shadow-sm">
              <div className="flex items-start gap-2.5">
                <span className="text-xl shrink-0">🔒</span>
                <div>
                  <h5 className="font-mono font-bold text-sm sm:text-base text-zinc-900">
                    Strict Anaerobic Seal: Biofilm formation and alkaloid neutralization active
                  </h5>
                  <p className="text-xs sm:text-sm font-mono text-zinc-700 mt-1 leading-relaxed">
                    Vessel hermetically sealed. Do not aerate. Methanogenic and protective microbial biofilms degrade sesquiterpene lactone (parthenin) rings into non-toxic carboxylic acids as verified in Hussain et al. (2017).
                  </p>
                </div>
              </div>
            </div>

            {/* Technical monitoring metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 font-mono text-xs text-zinc-600">
              <div className="bg-white border border-zinc-200 p-2">
                <span className="text-[10px] text-zinc-400 block uppercase">Terminal pH</span>
                <span className="font-bold text-emerald-700">6.8 - 7.4 (Neutral)</span>
              </div>
              <div className="bg-white border border-zinc-200 p-2">
                <span className="text-[10px] text-zinc-400 block uppercase">Temperature</span>
                <span className="font-bold text-zinc-800">28°C - 32°C</span>
              </div>
              <div className="bg-white border border-zinc-200 p-2 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-zinc-400 block uppercase">Allelopathy</span>
                <span className="font-bold text-emerald-700">0.00% (Neutralized)</span>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};
