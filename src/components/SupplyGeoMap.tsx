import React, { useState } from 'react';
import { MapPin, Plus, Radio, Layers, Filter, Check, X, Navigation } from 'lucide-react';
import { InfestationPin } from '../types';
import { INITIAL_SUPPLY_PINS } from '../data/constants';

export const SupplyGeoMap: React.FC = () => {
  const [pins, setPins] = useState<InfestationPin[]>(INITIAL_SUPPLY_PINS);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPin, setSelectedPin] = useState<InfestationPin | null>(null);

  // Form states for new cluster reporting
  const [clusterName, setClusterName] = useState<string>('');
  const [severity, setSeverity] = useState<'Critical' | 'Severe' | 'Moderate'>('Severe');
  const [biomassEstimate, setBiomassEstimate] = useState<string>('15.0');
  const [volunteerGroup, setVolunteerGroup] = useState<string>('KV Bhawanipatna Student Brigade');

  const totalBiomassTons = pins.reduce((acc, p) => acc + p.biomassTons, 0);

  const handleAddPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clusterName.trim()) return;

    const latRandom = (19.8 + Math.random() * 0.2).toFixed(4);
    const lngRandom = (83.1 + Math.random() * 0.2).toFixed(4);

    const newPin: InfestationPin = {
      id: Date.now(),
      lat: `${latRandom}° N`,
      lng: `${lngRandom}° E`,
      label: clusterName,
      severity: severity,
      biomassTons: parseFloat(biomassEstimate) || 10.0,
      reportedDate: new Date().toISOString().split('T')[0],
      harvestVolunteerGroup: volunteerGroup || 'Local Agrarian Volunteer',
    };

    setPins([newPin, ...pins]);
    setClusterName('');
    setShowModal(false);
    setSelectedPin(newPin);
  };

  return (
    <section className="w-full py-8">
      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 border border-zinc-400 bg-zinc-100 px-3 py-1 text-xs font-mono text-zinc-800 font-semibold mb-2">
              <span>GEOSPATIAL HARVEST LOGISTICS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
              Parthenium Supply Chain Geo-Map
            </h2>
            <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-mono">
              Decentralized sourcing telemetry: connecting farmer cooperatives with active bio-digester pits across the district.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs">
            <div className="bg-white border border-zinc-300 px-3 py-2 flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 bg-red-600"></span>
              <span>Infestation Clusters: <strong className="text-zinc-900">{pins.length} active</strong></span>
            </div>
            <div className="bg-white border border-zinc-300 px-3 py-2 flex items-center gap-2 shadow-sm">
              <span className="w-2.5 h-2.5 bg-emerald-700"></span>
              <span>Total Biomass: <strong className="text-emerald-800">{totalBiomassTons.toFixed(1)} MT</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container: Full-width container */}
      <div className="w-full bg-zinc-200 h-[600px] border-y border-zinc-300 flex flex-col items-center justify-center relative overflow-hidden select-none">
        
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: 'linear-gradient(to right, #a1a1aa 1px, transparent 1px), linear-gradient(to bottom, #a1a1aa 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Top-Left Telemetry Box */}
        <div className="absolute top-4 left-4 sm:left-6 bg-zinc-900/95 text-zinc-100 border border-zinc-700 p-4 font-mono text-xs max-w-xs shadow-xl backdrop-blur-sm z-10">
          <div className="flex items-center justify-between border-b border-zinc-700 pb-2 mb-2">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              TELEMETRY FEED
            </span>
            <span className="text-[10px] text-red-400 bg-red-950/60 px-1.5 py-0.5 border border-red-800">
              LIVE NCSC GRID
            </span>
          </div>
          <div className="space-y-1.5 text-zinc-300 text-[11px]">
            <p>Geo-Sector: <span className="text-white">Odisha Western Agro-Zone (Kalahandi)</span></p>
            <p>Target Weed: <span className="text-amber-400 italic">P. hysterophorus</span></p>
            <p>Reported Infestation Nodes: <span className="text-emerald-400 font-bold">{pins.length} Verified</span></p>
            <p>Bio-Digestion Pits Active: <span className="text-zinc-200">14 Hermetic Units</span></p>
          </div>
        </div>

        {/* Floating Top-Right Layer Indicator */}
        <div className="hidden sm:flex absolute top-4 right-6 bg-white/90 border border-zinc-300 px-3 py-1.5 font-mono text-xs text-zinc-700 items-center gap-2 shadow-sm backdrop-blur-sm z-10">
          <Layers className="w-3.5 h-3.5 text-zinc-500" />
          <span>Layer: Bhuvan / OSM Soil Moisture Overlay</span>
        </div>

        {/* Interactive Simulated Pins on Geo-Grid */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Simulated connecting survey lines */}
          <svg className="w-full h-full opacity-25">
            <line x1="20%" y1="35%" x2="45%" y2="50%" stroke="#18181b" strokeWidth="2" strokeDasharray="5 5" />
            <line x1="45%" y1="50%" x2="70%" y2="40%" stroke="#18181b" strokeWidth="2" strokeDasharray="5 5" />
            <line x1="45%" y1="50%" x2="55%" y2="65%" stroke="#18181b" strokeWidth="2" strokeDasharray="5 5" />
          </svg>

          {pins.map((pin, idx) => {
            // Position pins evenly across visual stage
            const topPercent = 20 + ((idx * 17) % 55);
            const leftPercent = 22 + ((idx * 21) % 58);

            return (
              <div
                key={pin.id}
                style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
                onClick={() => setSelectedPin(pin)}
                className="absolute pointer-events-auto cursor-pointer group -translate-x-1/2 -translate-y-1/2"
              >
                <div className="bg-zinc-900 text-white border border-zinc-600 px-2.5 py-1.5 shadow-lg flex items-center gap-2 text-xs font-mono group-hover:border-emerald-400 transition-all">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      pin.severity === 'Critical'
                        ? 'bg-red-500 animate-pulse'
                        : pin.severity === 'Severe'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  ></span>
                  <div>
                    <div className="font-bold text-zinc-100 text-[11px] truncate max-w-[140px] sm:max-w-none">
                      {pin.label}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {pin.lat} | {pin.biomassTons} MT
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Mandated Text: "[ Mapbox Offline-Ready Geospatial Render ]" */}
        <div className="text-center z-0">
          <div className="font-mono text-zinc-600 text-lg sm:text-2xl font-bold tracking-wider bg-zinc-100/95 px-6 sm:px-8 py-3 sm:py-4 border border-zinc-400/80 shadow-sm backdrop-blur-sm">
            [ Mapbox Offline-Ready Geospatial Render ]
          </div>
          <p className="font-mono text-xs text-zinc-500 mt-2 bg-zinc-50/80 px-3 py-1 inline-block border border-zinc-300">
            Vector Grid Synchronized • Central India Sub-Theme 5 Agro-Corridor
          </p>
        </div>

        {/* Selected Pin Details Modal / Card Overlay */}
        {selectedPin && (
          <div className="absolute bottom-24 sm:bottom-20 left-4 right-4 sm:left-auto sm:right-6 max-w-sm bg-white border-2 border-zinc-900 p-4 shadow-xl z-20 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2">
              <span className="font-bold text-zinc-900 uppercase">CLUSTER TELEMETRY</span>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-zinc-500 hover:text-zinc-900 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="font-bold text-sm text-zinc-900 mb-1">{selectedPin.label}</p>
            <div className="space-y-1 text-zinc-600">
              <p>GPS: <span className="text-zinc-900">{selectedPin.lat}, {selectedPin.lng}</span></p>
              <p>Severity: <span className="font-bold text-red-600">{selectedPin.severity}</span></p>
              <p>Harvestable Biomass: <span className="font-bold text-emerald-700">{selectedPin.biomassTons} Metric Tons</span></p>
              <p>Sourcing Cohort: <span className="text-zinc-800">{selectedPin.harvestVolunteerGroup}</span></p>
              <p>Logged: <span className="text-zinc-500">{selectedPin.reportedDate}</span></p>
            </div>
          </div>
        )}

        {/* Floating Action Button (FAB): Mandated label "📍 Drop Pin: Report Parthenium Infestation Cluster" */}
        <button
          onClick={() => setShowModal(true)}
          className="absolute bottom-8 bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3.5 flex items-center gap-2 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] z-10 font-mono text-xs sm:text-sm font-bold tracking-wide cursor-pointer"
        >
          <span>📍 Drop Pin: Report Parthenium Infestation Cluster</span>
        </button>

      </div>

      {/* Report Pin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white border-2 border-zinc-900 p-6 max-w-md w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
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
              <div>
                <label className="block text-zinc-700 font-bold mb-1">
                  CLUSTER LOCATION / LANDMARK
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taluka Highway km-14 Canal Bank"
                  value={clusterName}
                  onChange={(e) => setClusterName(e.target.value)}
                  className="w-full border border-zinc-400 p-2.5 text-zinc-900 font-mono text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-700 font-bold mb-1">
                    SEVERITY INDEX
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full border border-zinc-400 p-2.5 text-zinc-900 font-mono text-xs focus:outline-none focus:border-zinc-900 bg-white"
                  >
                    <option value="Critical">Critical (Dense Coverage &gt; 80%)</option>
                    <option value="Severe">Severe (50 - 80%)</option>
                    <option value="Moderate">Moderate (&lt; 50%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-700 font-bold mb-1">
                    EST. BIOMASS (TONS)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={biomassEstimate}
                    onChange={(e) => setBiomassEstimate(e.target.value)}
                    className="w-full border border-zinc-400 p-2.5 text-zinc-900 font-mono text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-bold mb-1">
                  REPORTING VOLUNTEER / SCHOOL GROUP
                </label>
                <input
                  type="text"
                  value={volunteerGroup}
                  onChange={(e) => setVolunteerGroup(e.target.value)}
                  className="w-full border border-zinc-400 p-2.5 text-zinc-900 font-mono text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer"
                >
                  Log Geolocation Coordinates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
