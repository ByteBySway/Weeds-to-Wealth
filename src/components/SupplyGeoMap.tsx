import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Radio, Layers, Filter, Check, X, Navigation } from 'lucide-react';
import { InfestationPin } from '../types';
import { INITIAL_SUPPLY_PINS } from '../data/constants';
import { useLanguage } from '../context/LanguageContext';

export const SupplyGeoMap: React.FC = () => {
  const { t } = useLanguage();

  // State persistence via localStorage
  const [pins, setPins] = useState<InfestationPin[]>(() => {
    try {
      const saved = localStorage.getItem('ncsc_weeds_to_wealth_pins');
      return saved ? JSON.parse(saved) : INITIAL_SUPPLY_PINS;
    } catch {
      return INITIAL_SUPPLY_PINS;
    }
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPin, setSelectedPin] = useState<InfestationPin | null>(null);

  // Form states for new cluster reporting
  const [locationName, setLocationName] = useState<string>('');
  const [estimatedBiomass, setEstimatedBiomass] = useState<string>('12.5');
  const [severity, setSeverity] = useState<'Critical' | 'Low' | 'Severe' | 'Moderate'>('Critical');
  const [volunteerGroup, setVolunteerGroup] = useState<string>('Odisha Agrarian Student Brigade');

  // Save pins whenever changed
  useEffect(() => {
    localStorage.setItem('ncsc_weeds_to_wealth_pins', JSON.stringify(pins));
  }, [pins]);

  const totalBiomassTons = pins.reduce((acc, p) => acc + p.biomassTons, 0);

  const handleAddPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim()) return;

    // Generate balanced coordinates for Odisha Western Agro-Zone
    const latOffset = (Math.random() * 0.25).toFixed(4);
    const lngOffset = (Math.random() * 0.25).toFixed(4);

    const newPin: InfestationPin = {
      id: Date.now(),
      lat: `${(19.75 + parseFloat(latOffset)).toFixed(4)}° N`,
      lng: `${(83.05 + parseFloat(lngOffset)).toFixed(4)}° E`,
      label: locationName.trim(),
      severity: severity,
      biomassTons: parseFloat(estimatedBiomass) || 8.0,
      reportedDate: new Date().toISOString().split('T')[0],
      harvestVolunteerGroup: volunteerGroup.trim() || 'Kalahandi Volunteer Brigade',
    };

    const updatedPins = [newPin, ...pins];
    setPins(updatedPins);
    setLocationName('');
    setEstimatedBiomass('12.5');
    setSeverity('Critical');
    setShowModal(false);
    setSelectedPin(newPin);
  };

  const handleResetDefaultPins = () => {
    setPins(INITIAL_SUPPLY_PINS);
    localStorage.removeItem('ncsc_weeds_to_wealth_pins');
    setSelectedPin(null);
  };

  return (
    <section className="w-full py-8">
      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 border border-zinc-400 bg-zinc-100 px-3 py-1 text-xs font-mono text-zinc-800 font-semibold mb-2">
              <span>{t.mapBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              {t.mapTitle}
            </h2>
            <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-mono">
              {t.mapSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs">
            <div className="bg-white border border-zinc-300 px-3 py-2 flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 bg-red-600 animate-pulse"></span>
              <span>
                {t.clustersActive}: <strong className="text-zinc-900 font-bold">{pins.length} active</strong>
              </span>
            </div>
            <div className="bg-white border border-zinc-300 px-3 py-2 flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 bg-emerald-700"></span>
              <span>
                {t.totalBiomass}: <strong className="text-emerald-800 font-bold">{totalBiomassTons.toFixed(1)} MT</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Canvas Container: Exact CSS class structure */}
      <div className="relative bg-zinc-200 h-[600px] w-full border-y border-zinc-300 flex flex-col items-center justify-center overflow-hidden select-none">
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 z-0"
          style={{
            backgroundImage: 'linear-gradient(to right, #a1a1aa 1px, transparent 1px), linear-gradient(to bottom, #a1a1aa 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* TOP OVERLAYS: Clean Flexbox/Grid layout with z-20 to never clip or overlap text */}
        <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none z-20">
          
          {/* Top-Left Telemetry Feed Box */}
          <div className="pointer-events-auto bg-zinc-900/95 text-zinc-100 border border-zinc-700 p-3 sm:p-4 font-mono text-xs max-w-xs sm:max-w-sm shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-zinc-700 pb-2 mb-2 gap-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                <span>TELEMETRY FEED</span>
              </span>
              <span className="text-[10px] text-red-400 bg-red-950/70 px-1.5 py-0.5 border border-red-800 shrink-0">
                LIVE NCSC GRID
              </span>
            </div>
            <div className="space-y-1 text-zinc-300 text-[11px] leading-snug">
              <p>
                Geo-Sector: <span className="text-white font-medium">Odisha Western Agro-Zone (Kalahandi)</span>
              </p>
              <p>
                Target Weed: <span className="text-amber-400 italic font-medium">Parthenium hysterophorus</span>
              </p>
              <p>
                Infestation Clusters:{' '}
                <span className="text-emerald-400 font-bold">{pins.length} Monitored</span>
              </p>
              <p>
                Bio-Digester Pits: <span className="text-zinc-200">14 Active Hermetic Units</span>
              </p>
            </div>
          </div>

          {/* Floating Top-Right Layer Indicator Badge */}
          <div className="pointer-events-auto bg-white/95 border border-zinc-300 px-3 py-1.5 font-mono text-xs text-zinc-700 flex items-center gap-2 shadow-sm backdrop-blur-sm self-start sm:self-auto">
            <Layers className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <span className="truncate">Layer: Bhuvan / OSM Agro-Moisture Grid</span>
          </div>
        </div>

        {/* Center Mandated Text: "[ Mapbox Offline-Ready Geospatial Render ]" */}
        <div className="text-center z-0 pointer-events-none px-4">
          <div className="font-mono text-zinc-600 text-base sm:text-2xl font-bold tracking-wider bg-zinc-100/90 px-6 sm:px-8 py-3 sm:py-4 border border-zinc-400/80 shadow-sm backdrop-blur-sm inline-block">
            [ Mapbox Offline-Ready Geospatial Render ]
          </div>
          <p className="font-mono text-xs text-zinc-500 mt-2 bg-zinc-50/90 px-3 py-1 block border border-zinc-300 max-w-md mx-auto">
            Vector Grid Synchronized • Central India Sub-Theme 5 Agro-Corridor
          </p>
        </div>

        {/* Interactive Simulated Pins on Geo-Grid */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Simulated connecting survey lines */}
          <svg className="w-full h-full opacity-20 pointer-events-none">
            <line x1="22%" y1="38%" x2="48%" y2="52%" stroke="#18181b" strokeWidth="2" strokeDasharray="5 5" />
            <line x1="48%" y1="52%" x2="72%" y2="42%" stroke="#18181b" strokeWidth="2" strokeDasharray="5 5" />
            <line x1="48%" y1="52%" x2="58%" y2="68%" stroke="#18181b" strokeWidth="2" strokeDasharray="5 5" />
          </svg>

          {pins.map((pin, idx) => {
            // Position pins evenly across visual stage
            const topPercent = 22 + ((idx * 16 + 7) % 52);
            const leftPercent = 18 + ((idx * 23 + 11) % 64);

            return (
              <div
                key={pin.id}
                style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                onClick={() => setSelectedPin(pin)}
                className="absolute pointer-events-auto cursor-pointer group -translate-x-1/2 -translate-y-1/2"
              >
                <div
                  className={`bg-zinc-900 text-white border px-2.5 py-1.5 shadow-lg flex items-center gap-2 text-xs font-mono transition-all ${
                    selectedPin?.id === pin.id
                      ? 'border-emerald-400 ring-2 ring-emerald-500/50'
                      : 'border-zinc-600 group-hover:border-zinc-300'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      pin.severity === 'Critical'
                        ? 'bg-red-500 animate-pulse'
                        : pin.severity === 'Severe'
                        ? 'bg-amber-500'
                        : pin.severity === 'Low'
                        ? 'bg-sky-400'
                        : 'bg-emerald-500'
                    }`}
                  ></span>
                  <div>
                    <div className="font-bold text-zinc-100 text-[11px] truncate max-w-[130px] sm:max-w-[180px]">
                      {pin.label}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {pin.biomassTons} MT • {pin.severity}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Pin Details Modal / Card Overlay */}
        {selectedPin && (
          <div className="absolute bottom-24 sm:bottom-24 left-4 right-4 sm:left-auto sm:right-6 max-w-sm bg-white border-2 border-zinc-900 p-4 shadow-2xl z-30 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2">
              <span className="font-bold text-zinc-900 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>CLUSTER TELEMETRY</span>
              </span>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-zinc-500 hover:text-zinc-900 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="font-bold text-sm text-zinc-900 mb-1">{selectedPin.label}</p>
            <div className="space-y-1 text-zinc-600">
              <p>GPS: <span className="text-zinc-900 font-bold">{selectedPin.lat}, {selectedPin.lng}</span></p>
              <p>Severity: <span className={`font-bold ${selectedPin.severity === 'Critical' ? 'text-red-600' : 'text-amber-600'}`}>{selectedPin.severity}</span></p>
              <p>Estimated Biomass: <span className="font-bold text-emerald-700">{selectedPin.biomassTons} Metric Tons</span></p>
              <p>Reporting Cohort: <span className="text-zinc-800">{selectedPin.harvestVolunteerGroup}</span></p>
              <p>Logged Date: <span className="text-zinc-500">{selectedPin.reportedDate}</span></p>
            </div>
          </div>
        )}

        {/* Floating Action Button (FAB): Interactive Pin-Drop trigger */}
        <div className="absolute bottom-6 flex items-center gap-3 z-20">
          <button
            onClick={() => setShowModal(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 sm:px-6 py-3.5 flex items-center gap-2 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] font-mono text-xs sm:text-sm font-bold tracking-wide cursor-pointer"
          >
            <span>{t.dropPinBtn}</span>
          </button>

          {pins.length !== INITIAL_SUPPLY_PINS.length && (
            <button
              onClick={handleResetDefaultPins}
              className="bg-white hover:bg-zinc-100 text-zinc-700 px-3 py-3.5 border border-zinc-400 font-mono text-xs cursor-pointer shadow-sm"
              title="Reset to default pins"
            >
              Reset Pins
            </button>
          )}
        </div>

      </div>

      {/* INTERACTIVE PIN-DROP BRUTALIST MODAL FORM (bg-white border border-zinc-300 p-6) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 p-6 max-w-md w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center mb-4 border-b border-zinc-200 pb-3">
              <h3 className="font-mono font-bold text-base text-zinc-900 uppercase flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>REPORT INFESTATION CLUSTER</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-zinc-900 font-mono text-sm font-bold cursor-pointer"
              >
                [✕]
              </button>
            </div>

            <p className="text-xs text-zinc-600 mb-4 font-mono leading-relaxed">
              Log verified field coordinates for cooperative bio-digestion harvesting. Prevents weed seed dispersal and fuels local Kunapajala pits.
            </p>

            <form onSubmit={handleAddPin} className="space-y-4 font-mono text-xs">
              {/* Field 1: Location Name / Sector */}
              <div>
                <label className="block text-zinc-800 font-bold mb-1 uppercase">
                  Location Name / Sector
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector-4 Canal Bank, Junagarh Block"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full border border-zinc-400 p-2.5 text-zinc-900 font-mono text-xs focus:outline-none focus:border-zinc-900 bg-white"
                />
              </div>

              {/* Field 2: Estimated Biomass (MT) */}
              <div>
                <label className="block text-zinc-800 font-bold mb-1 uppercase">
                  Estimated Biomass (MT)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="500"
                  required
                  placeholder="e.g. 15.0"
                  value={estimatedBiomass}
                  onChange={(e) => setEstimatedBiomass(e.target.value)}
                  className="w-full border border-zinc-400 p-2.5 text-zinc-900 font-mono text-xs focus:outline-none focus:border-zinc-900 bg-white"
                />
              </div>

              {/* Field 3: Infestation Severity (Low / Critical) */}
              <div>
                <label className="block text-zinc-800 font-bold mb-1 uppercase">
                  Infestation Severity (Low / Critical)
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full border border-zinc-400 p-2.5 text-zinc-900 font-mono text-xs focus:outline-none focus:border-zinc-900 bg-white cursor-pointer"
                >
                  <option value="Critical">Critical (High density &gt; 80% coverage, immediate bio-harvest required)</option>
                  <option value="Low">Low (Sparse early shoots &lt; 30% coverage, localized hand-weeding)</option>
                  <option value="Severe">Severe (50% - 80% coverage)</option>
                  <option value="Moderate">Moderate (30% - 50% coverage)</option>
                </select>
              </div>

              {/* Optional Field: Volunteer Brigade / School */}
              <div>
                <label className="block text-zinc-800 font-bold mb-1 uppercase">
                  Volunteer Group / Student Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kendra Vidyalaya Kalahandi Science Club"
                  value={volunteerGroup}
                  onChange={(e) => setVolunteerGroup(e.target.value)}
                  className="w-full border border-zinc-400 p-2.5 text-zinc-900 font-mono text-xs focus:outline-none focus:border-zinc-900 bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
                >
                  Add Pin & Update Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
