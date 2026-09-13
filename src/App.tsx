import React, { useState } from 'react';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FormulationEngine } from './components/FormulationEngine';
import { BiosecurityScanner } from './components/BiosecurityScanner';
import { FermentationProtocol } from './components/FermentationProtocol';
import { SupplyGeoMap } from './components/SupplyGeoMap';
import { Footer } from './components/Footer';
import { OpenScienceModal } from './components/OpenScienceModal';
import { ReportPdfModal } from './components/ReportPdfModal';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [modalType, setModalType] = useState<'latex' | 'csv' | 'hussain' | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col justify-between selection:bg-emerald-200">
        {/* 1. Sticky Navigation Bar with Language Switcher and Export PDF */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenPdfReport={() => setIsPdfModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full">
          {/* Tab 1: Dashboard (Executive Hero, Metrics, Lab Trials, Quick Launchers) */}
          {activeTab === 'dashboard' && (
            <div>
              <HeroSection
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenReport={(type) => setModalType(type)}
              />
            </div>
          )}

          {/* Tab 2: Formulation Engine (ROI Calculator & Stoichiometry Matrix) */}
          {activeTab === 'calculator' && (
            <div className="animate-fadeIn">
              <FormulationEngine initialAcres={2.5} initialSpend={4000} />
            </div>
          )}

          {/* Tab 3: AI Scanner & 20-Day Protocol with Batch Fermentation Log */}
          {activeTab === 'protocol' && (
            <div className="animate-fadeIn space-y-8 pb-12">
              <BiosecurityScanner />
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="h-[1px] bg-zinc-300 w-full"></div>
              </div>
              <FermentationProtocol />
            </div>
          )}

          {/* Tab 4: Parthenium Supply Chain Geo-Map with Interactive Pin-Drop */}
          {activeTab === 'map' && (
            <div className="animate-fadeIn">
              <SupplyGeoMap />
            </div>
          )}
        </main>

        {/* 7. Open-Science Footer */}
        <Footer onOpenReport={(type) => setModalType(type)} />

        {/* Open-Science Data & Reports Modal */}
        <OpenScienceModal type={modalType} onClose={() => setModalType(null)} />

        {/* Export PDF Report Dossier Modal */}
        <ReportPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          acres={2.5}
          spend={4000}
        />
      </div>
    </LanguageProvider>
  );
}
