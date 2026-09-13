import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Plus, Radio, Layers, Filter, Check, X, Navigation, Compass, Search, Sparkles } from 'lucide-react';
import { InfestationPin } from '../types';
import { INITIAL_SUPPLY_PINS } from '../data/constants';
import { useLanguage } from '../context/LanguageContext';

// Safe peripheral coordinate slots designed to surround the center text box without any overlap.
// Center text box occupies [top: 34%-66%] x [left: 24%-76%].
// These slots stay strictly in the outer perimeter corridors.
const SAFE_PERIPHERAL_SLOTS: Array<{ top: number; left: number }> = [
  // West Flank (left side)
  { top: 22, left: 13 },
  { top: 40, left: 11 },
  { top: 58, left: 14 },
  { top: 76, left: 12 },
  // East Flank (right side)
  { top: 22, left: 86 },
  { top: 40, left: 88 },
  { top: 58, left: 85 },
  { top: 76, left: 87 },
  // North Corridor (above center text)
  { top: 16, left: 34 },
  { top: 18, left: 50 },
  { top: 16, left: 66 },
  // South Corridor (below center text, above bottom controls)
  { top: 74, left: 34 },
  { top: 76, left: 50 },
  { top: 74, left: 66 },
];

function getSafePinPosition(index: number) {
  const slot = SAFE_PERIPHERAL_SLOTS[index % SAFE_PERIPHERAL_SLOTS.length];
  const cycle = Math.floor(index / SAFE_PERIPHERAL_SLOTS.length);
  const deltaTop = cycle === 0 ? 0 : ((index * 3) % 5) - 2;
  const deltaLeft = cycle === 0 ? 0 : ((index * 5) % 5) - 2;
  return {
    top: Math.max(12, Math.min(84, slot.top + deltaTop)),
    left: Math.max(8, Math.min(90, slot.left + deltaLeft)),
  };
}

export const SupplyGeoMap: React.FC = () => {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);

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
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical' | 'Severe' | 'Moderate' | 'Low'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lng: string }>({
    lat: '19.8241° N',
    lng: '83.1892° E',
  });
  const [dispatchedHarvests, setDispatchedHarvests] = useState<number[]>([]);

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

  // Filtered pins
  const filteredPins = pins.filter((p) => {
    const matchesSeverity = severityFilter === 'All' || p.severity === severityFilter;
    const matchesSearch = searchQuery.trim() === '' || p.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const xNorm = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const yNorm = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const simulatedLat = (19.65 + (1 - yNorm) * 0.35).toFixed(4);
    const simulatedLng = (82.95 + xNorm * 0.45).toFixed(4);

    setCursorCoords({
      lat: `${simulatedLat}° N`,
      lng: `${simulatedLng}° E`,
    });
  };

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
    setDispatchedHarvests([]);
  };

  const handleDispatchHarvest = (pinId: number) => {
    if (!dispatchedHarvests.includes(pinId)) {
      setDispatchedHarvests([...dispatchedHarvests, pinId]);
    }
  };

  return (
    <section className="w-full py-8">
      {/* Header Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 border border-zinc-400 bg-zinc-100 px-3 py-1 text-xs font-mono text-zinc-800 font-semibold mb-2">
              <span className="w-2 h-2 bg-emerald-700"></span>
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

      {/* Map Canvas Container: Exact CSS class structure requested */}
      <div
        ref={mapContainerRef}
        onMouseMove={handleMouseMove}
        className="relative bg-zinc-200 h-[600px] overflow-hidden w-full border-y border-zinc-300 flex flex-col items-center justify-center select-none"
      >
        {/* Subtle grid pattern background (z-0) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 z-0"
          style={{
            backgroundImage:
              'linear-gradient(to right, #a1a1aa 1px, transparent 1px), linear-gradient(to bottom, #a1a1aa 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Dynamic connecting survey lines (z-5) */}
        <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none z-5">
          <line x1="13%" y1="22%" x2="34%" y2="16%" stroke="#18181b" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="34%" y1="16%" x2="50%" y2="18%" stroke="#18181b" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="50%" y1="18%" x2="66%" y2="16%" stroke="#18181b" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="66%" y1="16%" x2="86%" y2="22%" stroke="#18181b" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="11%" y1="40%" x2="14%" y2="58%" stroke="#18181b" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="88%" y1="40%" x2="85%" y2="58%" stroke="#18181b" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="12%" y1="76%" x2="34%" y2="74%" stroke="#18181b" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="34%" y1="74%" x2="50%" y2="76%" stroke="#18181b" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="50%" y1="76%" x2="66%" y2="74%" stroke="#18181b" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="66%" y1="74%" x2="87%" y2="76%" stroke="#18181b" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>

        {/* Center Mandated Text (z-10): Guaranteed non-collision with peripheral pins */}
        <div className="text-center z-10 pointer-events-none px-4 max-w-xl mx-auto">
          <div className="font-mono text-zinc-700 text-sm sm:text-xl font-bold tracking-wider bg-zinc-100/95 px-5 sm:px-8 py-2.5 sm:py-3.5 border border-zinc-400 shadow-sm backdrop-blur-sm inline-block">
            [ Mapbox Offline-Ready Geospatial Render ]
          </div>
          <p className="font-mono text-[11px] sm:text-xs text-zinc-600 mt-1.5 bg-zinc-50/90 px-3 py-1 border border-zinc-300 inline-block">
            Vector Grid Synchronized • Central India Sub-Theme 5 Agro-Corridor
          </p>
        </div>

        {/* TOP OVERLAYS (z-30): Spaced and flex-wrapped telemetry cards */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-wrap items-start justify-between gap-3 pointer-events-none z-30">
          {/* Top-Left Telemetry Feed Box */}
          <div className="pointer-events-auto bg-zinc-900/95 text-zinc-100 border border-zinc-700 p-2.5 sm:p-3 font-mono text-xs w-full max-w-[270px] sm:max-w-xs shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-zinc-700 pb-1.5 mb-1.5 gap-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px]">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" />
                <span>TELEMETRY FEED</span>
              </span>
              <span className="text-[9px] text-red-400 bg-red-950/70 px-1 py-0.5 border border-red-800 shrink-0">
                LIVE NCSC GRID
              </span>
            </div>
            <div className="space-y-0.5 text-zinc-300 text-[10px] sm:text-[11px] leading-tight">
              <p className="truncate">
                Sector: <span className="text-white font-medium">Odisha Agro-Zone (Kalahandi)</span>
              </p>
              <p className="truncate">
                Target: <span className="text-amber-400 italic font-medium">P. hysterophorus</span>
              </p>
              <p>
                Infestation Clusters: <span className="text-emerald-400 font-bold">{filteredPins.length} Displayed</span>
              </p>
              <p>
                Bio-Digester Units: <span className="text-zinc-200">14 Active Hermetic Units</span>
              </p>
            </div>
          </div>

          {/* Top-Right Control Box: Filter chips and layer badge */}
          <div className="pointer-events-auto flex flex-col items-end gap-2 self-start">
            {/* Layer badge */}
            <div className="bg-white/95 border border-zinc-300 px-2.5 py-1 font-mono text-[10px] sm:text-xs text-zinc-700 flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
              <Layers className="w-3 h-3 text-zinc-500 shrink-0" />
              <span className="truncate">Layer: Bhuvan / OSM Agro-Moisture Grid</span>
            </div>

            {/* Severity Filter Chips */}
            <div className="bg-white/95 border border-zinc-300 p-1 flex items-center gap-1 font-mono text-[10px] shadow-sm backdrop-blur-sm flex-wrap justify-end">
              <span className="text-zinc-500 px-1 font-bold">SEVERITY:</span>
              {(['All', 'Critical', 'Severe', 'Moderate', 'Low'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSeverityFilter(lvl)}
                  className={`px-1.5 py-0.5 border cursor-pointer transition-colors ${
                    severityFilter === lvl
                      ? 'bg-zinc-900 text-white border-zinc-900 font-bold'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:bg-zinc-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* INTERACTIVE PIN BADGES ON GEO-GRID (z-20 default, z-35 on select/hover) */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredPins.map((pin, idx) => {
            const { top, left } = getSafePinPosition(idx);
            const isSelected = selectedPin?.id === pin.id;
            const isDispatched = dispatchedHarvests.includes(pin.id);

            return (
              <div
                key={pin.id}
                style={{ top: `${top}%`, left: `${left}%` }}
                onClick={() => setSelectedPin(pin)}
                className={`absolute pointer-events-auto cursor-pointer group -translate-x-1/2 -translate-y-1/2 ${
                  isSelected ? 'z-35' : 'z-20 hover:z-35'
                }`}
              >
                <div
                  className={`bg-zinc-900/95 text-white border px-2 sm:px-2.5 py-1 sm:py-1.5 shadow-lg flex items-center gap-2 text-xs font-mono transition-all backdrop-blur-xs select-none max-w-[170px] sm:max-w-[210px] ${
                    isSelected
                      ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-emerald-950/40'
                      : isDispatched
                      ? 'border-sky-500 ring-1 ring-sky-400/40'
                      : 'border-zinc-600 group-hover:border-zinc-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0 ${
                      pin.severity === 'Critical'
                        ? 'bg-red-500 animate-pulse'
                        : pin.severity === 'Severe'
                        ? 'bg-amber-500'
                        : pin.severity === 'Low'
                        ? 'bg-sky-400'
                        : 'bg-emerald-500'
                    }`}
                  ></span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-zinc-100 text-[10px] sm:text-[11px] truncate" title={pin.label}>
                      {pin.label}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-zinc-400 font-mono flex items-center gap-1.5 flex-wrap leading-none mt-0.5">
                      <span>{pin.biomassTons} MT</span>
                      <span>•</span>
                      <span
                        className={
                          pin.severity === 'Critical'
                            ? 'text-red-400 font-bold'
                            : pin.severity === 'Severe'
                            ? 'text-amber-400'
                            : 'text-zinc-400'
                        }
                      >
                        {pin.severity}
                      </span>
                      {isDispatched && <span className="text-[8px] bg-sky-900 text-sky-200 px-1">DISPATCHED</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SELECTED PIN DETAILS OVERLAY (z-40) */}
        {selectedPin && (
          <div className="absolute bottom-20 right-3 sm:right-6 left-3 sm:left-auto max-w-sm w-auto bg-white border-2 border-zinc-900 p-3 sm:p-4 shadow-2xl z-40 font-mono text-xs animate-fadeIn">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2">
              <span className="font-bold text-zinc-900 uppercase flex items-center gap-1.5 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>CLUSTER TELEMETRY</span>
              </span>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-zinc-500 hover:text-zinc-900 text-sm font-bold cursor-pointer px-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="font-bold text-sm text-zinc-900 mb-1 leading-snug">{selectedPin.label}</p>
            <div className="space-y-1 text-zinc-600 text-[11px]">
              <p>
                GPS:{' '}
                <span className="text-zinc-900 font-bold">
                  {selectedPin.lat}, {selectedPin.lng}
                </span>
              </p>
              <p>
                Severity:{' '}
                <span className={`font-bold ${selectedPin.severity === 'Critical' ? 'text-red-600' : 'text-amber-600'}`}>
                  {selectedPin.severity}
                </span>
              </p>
              <p>
                Estimated Biomass:{' '}
                <span className="font-bold text-emerald-700">{selectedPin.biomassTons} Metric Tons</span>
              </p>
              <p>
                Potential Kunapajala:{' '}
                <span className="font-bold text-zinc-800 font-mono">
                  {(selectedPin.biomassTons * 4200).toLocaleString()} Liters
                </span>
              </p>
              <p>
                Equivalent Urea Offset:{' '}
                <span className="font-bold text-amber-700 font-mono">
                  {Math.round(selectedPin.biomassTons * 18.5)} bags
                </span>
              </p>
              <p>
                Reporting Cohort: <span className="text-zinc-800">{selectedPin.harvestVolunteerGroup}</span>
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-zinc-200 flex items-center justify-between gap-2">
              <button
                onClick={() => handleDispatchHarvest(selectedPin.id)}
                disabled={dispatchedHarvests.includes(selectedPin.id)}
                className={`flex-1 py-1.5 text-center font-bold text-[10px] border cursor-pointer uppercase ${
                  dispatchedHarvests.includes(selectedPin.id)
                    ? 'bg-sky-50 text-sky-700 border-sky-300 cursor-not-allowed'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white border-black'
                }`}
              >
                {dispatchedHarvests.includes(selectedPin.id) ? '✓ Harvest Dispatched' : 'Dispatch Bio-Harvest Unit'}
              </button>
            </div>
          </div>
        )}

        {/* BOTTOM ACTION & TELEMETRY CONTROLS (z-30) */}
        <div className="absolute bottom-4 left-3 right-3 sm:left-auto sm:right-auto flex flex-wrap items-center justify-center gap-2 sm:gap-3 z-30 pointer-events-auto">
          {/* Live Coordinate Telemetry readout */}
          <div className="bg-white/95 border border-zinc-400 px-3 py-2 font-mono text-[10px] text-zinc-700 shadow-sm flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-emerald-700 animate-spin" style={{ animationDuration: '8s' }} />
            <span>
              CURSOR GPS: <strong className="text-zinc-900">{cursorCoords.lat}, {cursorCoords.lng}</strong> | WGS84
            </span>
          </div>

          {/* Floating Action Button (FAB): Interactive Pin-Drop trigger */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 sm:px-5 py-2.5 flex items-center gap-2 border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] font-mono text-xs font-bold tracking-wide cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.dropPinBtn}</span>
          </button>

          {pins.length !== INITIAL_SUPPLY_PINS.length && (
            <button
              onClick={handleResetDefaultPins}
              className="bg-white hover:bg-zinc-100 text-zinc-700 px-3 py-2.5 border border-zinc-400 font-mono text-xs cursor-pointer shadow-sm"
              title="Reset to default pins"
            >
              Reset Pins
            </button>
          )}
        </div>
      </div>

      {/* INTERACTIVE PIN-DROP BRUTALIST MODAL FORM (z-50) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <div className="bg-white border-2 border-zinc-900 p-5 sm:p-6 max-w-md w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-mono">
            <div className="flex justify-between items-center mb-3 border-b border-zinc-200 pb-2">
              <h3 className="font-bold text-sm sm:text-base text-zinc-900 uppercase flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>REPORT INFESTATION CLUSTER</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-zinc-900 text-sm font-bold cursor-pointer p-1"
              >
                [✕]
              </button>
            </div>

            <p className="text-xs text-zinc-600 mb-4 leading-relaxed">
              Log field coordinates for cooperative bio-digestion harvesting. Prevents weed seed dispersal and fuels local Kunapajala pits.
            </p>

            <form onSubmit={handleAddPin} className="space-y-3.5 text-xs">
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
                  className="w-full border border-zinc-400 p-2 text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 bg-white"
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
                  className="w-full border border-zinc-400 p-2 text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 bg-white"
                />
              </div>

              {/* Field 3: Infestation Severity */}
              <div>
                <label className="block text-zinc-800 font-bold mb-1 uppercase">
                  Infestation Severity
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full border border-zinc-400 p-2 text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 bg-white cursor-pointer"
                >
                  <option value="Critical">Critical (&gt; 80% coverage, immediate bio-harvest required)</option>
                  <option value="Severe">Severe (50% - 80% coverage)</option>
                  <option value="Moderate">Moderate (30% - 50% coverage)</option>
                  <option value="Low">Low (&lt; 30% coverage, localized hand-weeding)</option>
                </select>
              </div>

              {/* Volunteer Group */}
              <div>
                <label className="block text-zinc-800 font-bold mb-1 uppercase">
                  Volunteer Group / Student Unit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kendriya Vidyalaya Kalahandi Science Club"
                  value={volunteerGroup}
                  onChange={(e) => setVolunteerGroup(e.target.value)}
                  className="w-full border border-zinc-400 p-2 text-zinc-900 text-xs focus:outline-none focus:border-zinc-900 bg-white"
                />
              </div>

              {/* Preview calculation */}
              <div className="bg-emerald-50 border border-emerald-300 p-2 text-[11px] text-emerald-900">
                <span className="font-bold">Calculated Yield:</span> ~
                {(parseFloat(estimatedBiomass || '0') * 4200).toLocaleString()} L Kunapajala liquid, replacing ~
                {Math.round(parseFloat(estimatedBiomass || '0') * 18.5)} bags synthetic urea.
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px]"
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

