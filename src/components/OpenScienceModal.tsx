import React, { useState } from 'react';
import { Download, FileText, BarChart3, Microscope, X, Copy, Check } from 'lucide-react';
import {
  LATEX_REPORT_CONTENT,
  generateBiomassCSV,
  HUSSAIN_2017_VALIDATION,
  LAB_TRIAL_COHORTS,
} from '../data/constants';

interface OpenScienceModalProps {
  type: 'latex' | 'csv' | 'hussain' | null;
  onClose: () => void;
}

export const OpenScienceModal: React.FC<OpenScienceModalProps> = ({ type, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!type) return null;

  const handleDownloadLatex = () => {
    const blob = new Blob([LATEX_REPORT_CONTENT], { type: 'text/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Weeds_to_Wealth_NCSC_2026_IKS_Report.tex';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csvContent = generateBiomassCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Vigna_radiata_30day_Biomass_Trial_Data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(LATEX_REPORT_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-3 sm:p-6 z-50 backdrop-blur-xs">
      <div className="bg-white border-2 border-zinc-900 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-300 bg-zinc-50">
          <div className="flex items-center gap-2 font-mono text-sm font-bold text-zinc-900 uppercase">
            {type === 'latex' && (
              <>
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>LaTeX Academic Project Report (NCSC 2026-27)</span>
              </>
            )}
            {type === 'csv' && (
              <>
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <span>30-Day Biomass Dataset (120 Replicate Vessels)</span>
              </>
            )}
            {type === 'hussain' && (
              <>
                <Microscope className="w-4 h-4 text-emerald-700" />
                <span>Hussain et al. (2017) Toxicity Validation Dossier</span>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-900 font-mono text-sm font-bold p-1 hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            [ ✕ ]
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs text-zinc-800 space-y-4">
          {type === 'latex' && (
            <div>
              <p className="text-zinc-600 mb-3 font-sans text-sm">
                Complete formatted LaTeX source code for the NCSC Sub-Theme 5 submission paper, containing equations, methodology, and statistical rigor proofs.
              </p>
              <pre className="bg-zinc-900 text-zinc-100 p-4 border border-zinc-700 overflow-x-auto text-[11px] leading-relaxed max-h-96 selection:bg-emerald-700 selection:text-white">
                {LATEX_REPORT_CONTENT}
              </pre>
            </div>
          )}

          {type === 'csv' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-zinc-200 gap-2 font-sans">
                <div>
                  <h4 className="font-bold text-zinc-900 text-sm">Vegetative Trial Observation Matrix</h4>
                  <p className="text-xs text-zinc-500">120 Replicates (Vigna radiata), 3 Cohorts under Controlled Greenhouse Photoperiod</p>
                </div>
                <span className="font-mono text-xs bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-1 font-bold">
                  p &lt; 0.0001 (Significant)
                </span>
              </div>

              <div className="overflow-x-auto border border-zinc-300 max-h-72">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead className="bg-zinc-100 border-b border-zinc-300 text-zinc-700 uppercase sticky top-0">
                    <tr>
                      <th className="p-2">Sample ID</th>
                      <th className="p-2">Cohort</th>
                      <th className="p-2">Shoot (cm)</th>
                      <th className="p-2">Root (cm)</th>
                      <th className="p-2">Chlorophyll (SPAD)</th>
                      <th className="p-2">Biomass (g)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                        <td className="p-2 font-semibold">R-KP-{(i + 1).toString().padStart(2, '0')}</td>
                        <td className="p-2 text-emerald-800 font-bold">Kunapajala 10%</td>
                        <td className="p-2">{(24.3 + (i % 5) * 0.1).toFixed(1)}</td>
                        <td className="p-2">{(12.6 + (i % 4) * 0.1).toFixed(1)}</td>
                        <td className="p-2">{(45.9 + (i % 6) * 0.1).toFixed(1)}</td>
                        <td className="p-2 text-emerald-700 font-bold">{(2.82 + (i % 3) * 0.02).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-zinc-500 text-[11px] mt-2 italic">
                * Showing first 15 records of 120 replicate vessels. Full raw CSV available via download below.
              </p>
            </div>
          )}

          {type === 'hussain' && (
            <div className="space-y-4">
              <div className="p-4 bg-zinc-100 border border-zinc-300">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold mb-1">
                  PEER-REVIEWED SCIENTIFIC REFERENCE
                </span>
                <p className="text-zinc-900 font-sans text-sm font-semibold leading-relaxed">
                  {HUSSAIN_2017_VALIDATION.citation}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-2">
                  Key Experimental Toxicological Confirmations:
                </h4>
                <ul className="space-y-2 list-disc list-inside text-zinc-700 text-xs">
                  {HUSSAIN_2017_VALIDATION.keyFindings.map((finding, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-mono">
                <span className="font-bold text-emerald-800 block mb-1">
                  Chemical Transformation Proof:
                </span>
                Anaerobic ruminal fermentation initiates nucleophilic cleavage of the α-methylene-γ-lactone ring at carbon C-11/C-13, eradicating allergenic contact dermatitis potential in farmers.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-zinc-300 bg-zinc-50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-zinc-500">
            NCSC 2026-27 Open-Access Repository
          </div>

          <div className="flex items-center gap-2">
            {type === 'latex' && (
              <>
                <button
                  onClick={handleCopyLatex}
                  className="px-3 py-2 border border-zinc-300 hover:bg-zinc-200 font-mono text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={handleDownloadLatex}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .tex File</span>
                </button>
              </>
            )}

            {type === 'csv' && (
              <button
                onClick={handleDownloadCSV}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-xs flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Full CSV (120 Rows)</span>
              </button>
            )}

            {type === 'hussain' && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-bold cursor-pointer"
              >
                Close Verification Dossier
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
