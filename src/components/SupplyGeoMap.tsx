import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Plus,
  Radio,
  Layers,
  Check,
  X,
  Navigation,
  Compass,
  Search,
  Sparkles,
  CloudRain,
  Building2,
  ShieldCheck,
  CircleDot,
  Send,
  Camera,
  Activity,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Zap
} from 'lucide-react';
import { InfestationPin, CollectionHub, EcologicalRecoveryZone } from '../types';
import { INITIAL_SUPPLY_PINS, INITIAL_COLLECTION_HUBS, INITIAL_RECOVERY_ZONES } from '../data/constants';
import { useLanguage } from '../context/LanguageContext';

// Positions for regional agricultural pins in the Odisha Kalahandi corridor
const PIN_COORDINATES: Array<{ top: number; left: number }> = [
  { top: 24, left: 16 }, // Cluster A1
  { top: 48, left: 22 }, // Margin B4
  { top: 20, left: 78 }, // Tributary C2
  { top: 68, left: 74 }, // Boundary D7
  { top: 35, left: 45 }, // Extra 1
  { top: 62, left: 38 }, // Extra 2
  { top: 38, left: 82 }, // Extra 3
  { top: 78, left: 24 }, // Extra 4
];

// Position for Village Collection Hubs (Central Kunapajala Bio-Reactors)
const HUB_COORDINATES: Record<string, { top: number; left: number }> = {
  'HUB-BHAWANI-01': { top: 30, left: 32 },
  'HUB-JUNAGARH-02': { top: 52, left: 28 },
  'HUB-DHARAMGARH-03': { top: 72, left: 62 },
};

export const SupplyGeoMap: React.FC = () => {
  const { t } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Persistence for outbreak pins
  const [pins, setPins] = useState<InfestationPin[]>(() => {
    try {
      const saved = localStorage.getItem('ncsc_weeds_to_wealth_pins_v2');
      return saved ? JSON.parse(saved) : INITIAL_SUPPLY_PINS;
    } catch {
      return INITIAL_SUPPLY_PINS;
    }
  });

  const [collectionHubs, setCollectionHubs] = useState<CollectionHub[]>(INITIAL_COLLECTION_HUBS);
  const [recoveryZones] = useState<EcologicalRecoveryZone[]>(INITIAL_RECOVERY_ZONES);

  // Interactive Layer Toggles
  const [showPredictiveSpread, setShowPredictiveSpread] = useState<boolean>(true);
  const [showVillageHubs, setShowVillageHubs] = useState<boolean>(true);
  const [showRecoveryRadius, setShowRecoveryRadius] = useState<boolean>(true);

  // Filter & Selection
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical' | 'Severe' | 'Moderate' | 'Low'>('All');
  const [selectedPin, setSelectedPin] = useState<InfestationPin | null>(null);
  const [selectedHub, setSelectedHub] = useState<CollectionHub | null>(null);
  const [dispatchedHarvests, setDispatchedHarvests] = useState<number[]>([]);

  // Mobile-Optimized Geofenced Field Collector Drawer
  const [isCollectorOpen, setIsCollectorOpen] = useState<boolean>(false);
  const [collectorStep, setCollectorStep] = useState<'GPS_COORDS' | 'AI_VERIFICATION' | 'CONFIRMATION'>('GPS_COORDS');
  const [isGpsLocating, setIsGpsLocating] = useState<boolean>(false);
  const [isAiVerifying, setIsAiVerifying] = useState<boolean>(false);
  const [fieldCoordinates, setFieldCoordinates] = useState<{ lat: string; lng: string }>({
    lat: '19.9124° N',
    lng: '83.1840° E',
  });
  const [fieldSectorName, setFieldSectorName] = useState<string>('');
  const [fieldBiomass, setFieldBiomass] = useState<string>('14.0');
  const [fieldSeverity, setFieldSeverity] = useState<'Critical' | 'Severe' | 'Moderate' | 'Low'>('Critical');
  const [fieldCohort, setFieldCohort] = useState<string>('Kalahandi Agro Youth Brigade');
  const [aiTaxonomyConfidence, setAiTaxonomyConfidence] = useState<number | null>(null);

  // Map mouse coordinate telemetry
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lng: string; xPct: number; yPct: number }>({
    lat: '19.8920° N',
    lng: '83.1812° E',
    xPct: 50,
    yPct: 50,
  });

  // Pin click-drop mode
  const [pinDropModeActive, setPinDropModeActive] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('ncsc_weeds_to_wealth_pins_v2', JSON.stringify(pins));
  }, [pins]);

  // Aggregate Real-Time Telemetry
  const totalBiomassHarvestedKg = Math.round(pins.reduce((acc, p) => acc + p.biomassTons * 1000, 0));
  const estimatedFarmersImpacted = Math.round(pins.reduce((acc, p) => acc + p.biomassTons * 18.2, 0));
  const syntheticNpkDisplacedKg = Math.round(totalBiomassHarvestedKg * 0.42);
  const totalClearedSqM = pins.reduce((acc, p) => acc + (p.clearedAreaSqMeters || 3200), 0);

  const filteredPins = pins.filter((p) => {
    return severityFilter === 'All' || p.severity === severityFilter;
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const xNorm = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const yNorm = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const simulatedLat = (19.72 + (1 - yNorm) * 0.28).toFixed(4);
    const simulatedLng = (83.05 + xNorm * 0.25).toFixed(4);

    setCursorCoords({
      lat: `${simulatedLat}° N`,
      lng: `${simulatedLng}° E`,
      xPct: Math.round(xNorm * 100),
      yPct: Math.round(yNorm * 100),
    });
  };

  // Interactive Pin Drop on Map Canvas
  const handleMapCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!pinDropModeActive) return;
    if (!mapContainerRef.current) return;

    const rect = mapContainerRef.current.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const newLat = (19.72 + (1 - yPct / 100) * 0.28).toFixed(4);
    const newLng = (83.05 + (xPct / 100) * 0.25).toFixed(4);

    setFieldCoordinates({
      lat: `${newLat}° N`,
      lng: `${newLng}° E`,
    });
    setFieldSectorName(`Logged Corridor Pin [X:${xPct}%, Y:${yPct}%]`);
    setPinDropModeActive(false);
    setIsCollectorOpen(true);
    setCollectorStep('GPS_COORDS');
  };

  const triggerGeofenceAcquisition = () => {
    setIsGpsLocating(true);
    setTimeout(() => {
      const randomLat = (19.88 + Math.random() * 0.08).toFixed(4);
      const randomLng = (83.15 + Math.random() * 0.12).toFixed(4);
      setFieldCoordinates({
        lat: `${randomLat}° N`,
        lng: `${randomLng}° E`,
      });
      setIsGpsLocating(false);
    }, 600);
  };

  const handleSimulateAiVerification = () => {
    setIsAiVerifying(true);
    setTimeout(() => {
      setIsAiVerifying(false);
      setAiTaxonomyConfidence(98.7);
      setCollectorStep('CONFIRMATION');
    }, 900);
  };

  const handleFinalizeIncidentLog = (e: React.FormEvent) => {
    e.preventDefault();
    const tonnage = parseFloat(fieldBiomass) || 10.0;
    const newPin: InfestationPin = {
      id: Date.now(),
      lat: fieldCoordinates.lat,
      lng: fieldCoordinates.lng,
      label: fieldSectorName.trim() || 'Verified Outbreak Cluster',
      severity: fieldSeverity,
      biomassTons: tonnage,
      reportedDate: new Date().toISOString().split('T')[0],
      harvestVolunteerGroup: fieldCohort.trim() || 'Kalahandi Volunteer Brigade',
      clearedAreaSqMeters: Math.round(tonnage * 260),
      aiVerified: true,
      soilMoistureIndex: Math.round(65 + Math.random() * 25),
      monsoonVulnerability: tonnage > 15 ? 'Extreme' : 'High',
      nearestHubId: 'HUB-BHAWANI-01',
    };

    setPins([newPin, ...pins]);
    setSelectedPin(newPin);
    setIsCollectorOpen(false);
    setCollectorStep('GPS_COORDS');
    setFieldSectorName('');
    setAiTaxonomyConfidence(null);
  };

  const handleDispatchToBioReactor = (pinId: number, hubId?: string) => {
    if (dispatchedHarvests.includes(pinId)) return;
    setDispatchedHarvests([...dispatchedHarvests, pinId]);

    const targetPin = pins.find((p) => p.id === pinId);
    if (!targetPin) return;

    // Update village collection hub payload
    setCollectionHubs((prev) =>
      prev.map((hub) => {
        if (hub.id === (hubId || targetPin.nearestHubId || 'HUB-BHAWANI-01')) {
          const addedTons = targetPin.biomassTons;
          return {
            ...hub,
            currentHarvestTonnageMT: Math.min(hub.capacityMT, Number((hub.currentHarvestTonnageMT + addedTons).toFixed(1))),
            dailyProductionLiters: Math.round(hub.dailyProductionLiters + addedTons * 4200),
            status: hub.currentHarvestTonnageMT + addedTons >= hub.capacityMT * 0.9 ? 'NEAR_CAPACITY' : 'OPTIMAL',
          };
        }
        return hub;
      })
    );
  };

  const handleResetPins = () => {
    setPins(INITIAL_SUPPLY_PINS);
    setCollectionHubs(INITIAL_COLLECTION_HUBS);
    setDispatchedHarvests([]);
    setSelectedPin(null);
    setSelectedHub(null);
    localStorage.removeItem('ncsc_weeds_to_wealth_pins_v2');
  };

  return (
    <section className="w-full py-6 sm:py-8 bg-zinc-900 text-zinc-100 font-sans border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* TOP HEADER & SYSTEM STATUS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 border border-emerald-500/40 bg-emerald-950/50 px-2.5 py-1 text-xs font-mono text-emerald-400 font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>GEO_INTELLIGENCE // NCSC REGIONAL ERADICATION GRID</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white uppercase font-mono">
              PARTHENIUM GEO MAP & BIO-CONVERSION LOGISTICS
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-mono max-w-3xl">
              Spatial tracking of invasive <em className="text-emerald-300 not-italic font-bold">P. hysterophorus</em> colonies across agricultural corridors. Real-time routing to decentralized hermetic Kunapajala bio-reactors.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-xs">
            <button
              onClick={() => {
                setPinDropModeActive(!pinDropModeActive);
                if (!pinDropModeActive) setSelectedPin(null);
              }}
              className={`px-3.5 py-2 border font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                pinDropModeActive
                  ? 'bg-amber-400 text-zinc-950 border-amber-500 animate-bounce'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{pinDropModeActive ? 'CLICK MAP TO DROP PIN' : 'PIN-DROP MODE'}</span>
            </button>

            <button
              onClick={() => {
                setIsCollectorOpen(true);
                setCollectorStep('GPS_COORDS');
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 px-4 py-2 border border-emerald-400 font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-zinc-950" />
              <span>LOG OUTBREAK (GPS + AI)</span>
            </button>
          </div>
        </div>

        {/* BRUTALIST LAYER CONTROL BAR */}
        <div className="bg-zinc-950 border border-zinc-800 p-2.5 sm:p-3 mb-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="text-zinc-500 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>SPATIAL LAYERS:</span>
            </span>

            {/* 1. Predictive Monsoon Spread Toggle */}
            <button
              onClick={() => setShowPredictiveSpread(!showPredictiveSpread)}
              className={`px-2.5 py-1 border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showPredictiveSpread
                  ? 'bg-blue-950/80 text-blue-300 border-blue-500 shadow-[1px_1px_0px_0px_#3b82f6]'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              <span>LAYER: PREDICTIVE_SPREAD ({showPredictiveSpread ? 'ON' : 'OFF'})</span>
            </button>

            {/* 2. Village Node Logistics Toggle */}
            <button
              onClick={() => setShowVillageHubs(!showVillageHubs)}
              className={`px-2.5 py-1 border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showVillageHubs
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 shadow-[1px_1px_0px_0px_#10b981]'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>VILLAGE BIO-REACTORS ({collectionHubs.length})</span>
            </button>

            {/* 4. Ecological Recovery Radius Toggle */}
            <button
              onClick={() => setShowRecoveryRadius(!showRecoveryRadius)}
              className={`px-2.5 py-1 border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                showRecoveryRadius
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-[1px_1px_0px_0px_#f59e0b]'
                  : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5 text-amber-400" />
              <span>RECOVERY RADIUS RINGS</span>
            </button>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-zinc-500 font-bold hidden sm:inline">SEVERITY:</span>
            {(['All', 'Critical', 'Severe', 'Moderate'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSeverityFilter(lvl)}
                className={`px-2 py-0.5 border cursor-pointer ${
                  severityFilter === lvl
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-bold'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN INTERACTIVE MAP CANVAS (zinc-950 canvas with razor-sharp borders) */}
        <div
          ref={mapContainerRef}
          onMouseMove={handleMouseMove}
          onClick={handleMapCanvasClick}
          className={`relative bg-zinc-950 h-[580px] sm:h-[640px] w-full border border-zinc-800 overflow-hidden select-none flex flex-col justify-between ${
            pinDropModeActive ? 'cursor-crosshair ring-2 ring-amber-400' : 'cursor-default'
          }`}
        >
          {/* Spatial Vector Grid (1px sharp borders) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 z-0"
            style={{
              backgroundImage:
                'linear-gradient(to right, #3f3f46 1px, transparent 1px), linear-gradient(to bottom, #3f3f46 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* PREDICTIVE MONSOON SPREAD OVERLAY (Corridor Simulation) */}
          {showPredictiveSpread && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
              <defs>
                <linearGradient id="monsoonFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.1" />
                </linearGradient>
                <pattern id="diagonalMoistureHatch" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="20" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.2" />
                </pattern>
              </defs>

              {/* High-Risk Agro-Moisture Runoff Belts */}
              <path
                d="M 60,130 Q 240,160 380,240 T 780,280 T 1180,480 L 1180,560 Q 750,420 320,380 Z"
                fill="url(#monsoonFlow)"
              />
              <path
                d="M 60,130 Q 240,160 380,240 T 780,280 T 1180,480 L 1180,560 Q 750,420 320,380 Z"
                fill="url(#diagonalMoistureHatch)"
              />

              {/* Secondary Western Irrigation Basin Drain */}
              <path
                d="M 100,320 Q 280,380 420,490 T 760,590 L 640,620 Q 300,520 80,420 Z"
                fill="#0ea5e9"
                fillOpacity="0.12"
              />

              {/* Dynamic Connecting Vector Lines */}
              <line x1="16%" y1="24%" x2="32%" y2="30%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <line x1="22%" y1="48%" x2="28%" y2="52%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <line x1="74%" y1="68%" x2="62%" y2="72%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            </svg>
          )}

          {/* ECOLOGICAL RECOVERY RADIUS RINGS (Dynamic SVG Rings Around Cleared Zones) */}
          {showRecoveryRadius && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {filteredPins.map((pin, i) => {
                const coord = PIN_COORDINATES[i % PIN_COORDINATES.length];
                const radius = Math.max(30, Math.min(75, Math.round((pin.clearedAreaSqMeters || 3200) / 75)));
                const isClearedOrDispatched = dispatchedHarvests.includes(pin.id);

                return (
                  <g key={`ring-${pin.id}`}>
                    {/* Pulsing Outer Halo */}
                    <circle
                      cx={`${coord.left}%`}
                      cy={`${coord.top}%`}
                      r={radius}
                      fill={isClearedOrDispatched ? '#10b981' : '#f59e0b'}
                      fillOpacity={isClearedOrDispatched ? '0.12' : '0.06'}
                      stroke={isClearedOrDispatched ? '#10b981' : '#d97706'}
                      strokeWidth="1.5"
                      strokeDasharray={isClearedOrDispatched ? 'none' : '4 3'}
                    />
                    {/* Concentric Soil Remediation boundary */}
                    <circle
                      cx={`${coord.left}%`}
                      cy={`${coord.top}%`}
                      r={radius * 0.55}
                      fill="none"
                      stroke={isClearedOrDispatched ? '#34d399' : '#fbbf24'}
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      opacity="0.7"
                    />
                  </g>
                );
              })}
            </svg>
          )}

          {/* TOP OVERLAY BAR: Live Telemetry Feeds & Coordinates */}
          <div className="relative z-30 p-3 sm:p-4 flex flex-wrap items-start justify-between gap-3 pointer-events-none">
            {/* Top-Left Live Grid Badge */}
            <div className="pointer-events-auto bg-zinc-900/95 border border-zinc-700 p-2.5 sm:p-3 font-mono text-xs w-full max-w-[280px] shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px]">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>KALAHANDI BIO-RADAR</span>
                </span>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-700 px-1 py-0.5">
                  LIVE CORRIDOR
                </span>
              </div>
              <div className="space-y-1 text-zinc-300 text-[11px]">
                <p className="flex justify-between">
                  <span className="text-zinc-500">Agro-Zone:</span>
                  <span className="text-white font-medium">Odisha Western Basin</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-zinc-500">Soil Moisture:</span>
                  <span className="text-sky-400 font-bold">78% (Monsoon Wet Runoff)</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-zinc-500">Allelopathic Risk:</span>
                  <span className="text-amber-400 font-bold">Sesquiterpene High Active</span>
                </p>
              </div>
            </div>

            {/* Top-Right Spatial Mode Banner */}
            <div className="pointer-events-auto bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 font-mono text-xs text-zinc-300 flex items-center gap-2 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>
                GIS COORDINATE: <strong className="text-white">{cursorCoords.lat}, {cursorCoords.lng}</strong>
              </span>
            </div>
          </div>

          {/* VILLAGE COLLECTION HUBS (Bio-Reactor Nodes) */}
          {showVillageHubs && (
            <div className="absolute inset-0 pointer-events-none z-25">
              {collectionHubs.map((hub) => {
                const pos = HUB_COORDINATES[hub.id] || { top: 40, left: 40 };
                const isSelected = selectedHub?.id === hub.id;
                const isNearCapacity = hub.status === 'NEAR_CAPACITY';

                return (
                  <div
                    key={hub.id}
                    style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHub(hub);
                      setSelectedPin(null);
                    }}
                    className={`absolute pointer-events-auto cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105 ${
                      isSelected ? 'z-40' : 'z-25'
                    }`}
                  >
                    <div
                      className={`border px-2 sm:px-2.5 py-1.5 font-mono text-xs shadow-2xl flex items-center gap-2 backdrop-blur-md ${
                        isSelected
                          ? 'bg-emerald-950 text-white border-emerald-400 ring-2 ring-emerald-500/60'
                          : isNearCapacity
                          ? 'bg-zinc-900 text-amber-300 border-amber-500'
                          : 'bg-zinc-900 text-emerald-300 border-emerald-600/70 hover:border-emerald-400'
                      }`}
                    >
                      <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-black text-[11px] uppercase tracking-wide leading-none flex items-center gap-1.5">
                          <span>{hub.name.split(' ')[0]} Hub</span>
                          <span className="text-[9px] bg-emerald-900/80 text-emerald-200 px-1 py-0.2 border border-emerald-700">
                            {hub.activeBioReactors} PITS
                          </span>
                        </div>
                        <div className="text-[9px] text-zinc-400 mt-1 flex items-center gap-1.5">
                          <span>Payload: <strong className="text-white">{hub.currentHarvestTonnageMT} MT</strong> / {hub.capacityMT} MT</span>
                          <span>•</span>
                          <span className="text-emerald-400">{hub.dailyProductionLiters.toLocaleString()} L</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* OUTBREAK INFESTATION MARKERS (Pulsing Emerald and Amber Indicators) */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {filteredPins.map((pin, i) => {
              const coord = PIN_COORDINATES[i % PIN_COORDINATES.length];
              const isSelected = selectedPin?.id === pin.id;
              const isDispatched = dispatchedHarvests.includes(pin.id);

              return (
                <div
                  key={pin.id}
                  style={{ top: `${coord.top}%`, left: `${coord.left}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin(pin);
                    setSelectedHub(null);
                  }}
                  className={`absolute pointer-events-auto cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 ${
                    isSelected ? 'z-40' : 'z-20'
                  }`}
                >
                  <div
                    className={`border px-2 sm:px-2.5 py-1.5 font-mono text-xs shadow-2xl flex items-center gap-2 backdrop-blur-md transition-all ${
                      isSelected
                        ? 'bg-zinc-900 text-white border-emerald-400 ring-2 ring-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : isDispatched
                        ? 'bg-zinc-900/90 text-zinc-200 border-sky-500'
                        : pin.severity === 'Critical'
                        ? 'bg-zinc-900/95 text-white border-amber-500/80 hover:border-amber-400'
                        : 'bg-zinc-900/90 text-white border-zinc-700 hover:border-zinc-500'
                    }`}
                  >
                    {/* Pulsing Emerald/Amber Indicator Dot */}
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          isDispatched
                            ? 'bg-sky-400'
                            : pin.severity === 'Critical'
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${
                          isDispatched
                            ? 'bg-sky-500'
                            : pin.severity === 'Critical'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                      ></span>
                    </span>

                    <div>
                      <div className="font-bold text-[11px] text-zinc-100 max-w-[140px] truncate leading-tight">
                        {pin.label}
                      </div>
                      <div className="text-[9px] text-zinc-400 flex items-center gap-1.5 mt-0.5 font-mono">
                        <span className="text-emerald-400 font-bold">{pin.biomassTons} MT</span>
                        <span>•</span>
                        <span className={pin.severity === 'Critical' ? 'text-amber-400' : 'text-zinc-400'}>
                          {pin.severity}
                        </span>
                        {isDispatched && (
                          <span className="text-[8px] bg-sky-950 text-sky-300 px-1 border border-sky-800">
                            ROUTED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CENTER PIN-DROP HELPER OVERLAY IF ACTIVE */}
          {pinDropModeActive && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-35 bg-amber-950/90 border border-amber-400 p-3 sm:p-4 text-center font-mono shadow-2xl backdrop-blur-md max-w-sm">
              <Compass className="w-8 h-8 text-amber-400 mx-auto animate-spin mb-2" style={{ animationDuration: '6s' }} />
              <div className="font-bold text-amber-200 text-sm">PIN-DROP MODE ACTIVE</div>
              <div className="text-xs text-zinc-300 mt-1">
                Click anywhere on the vector grid to place an outbreak marker and compute local bio-conversion yield.
              </div>
            </div>
          )}

          {/* SELECTED PIN INSPECTION DRAWER / CARD */}
          {selectedPin && (
            <div className="absolute bottom-16 right-3 sm:right-6 left-3 sm:left-auto max-w-md w-auto bg-zinc-950 border border-emerald-500/80 p-4 shadow-2xl z-40 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
                <span className="font-bold text-emerald-400 uppercase flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>OUTBREAK COLONY TELEMETRY</span>
                </span>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="text-zinc-500 hover:text-white text-sm font-bold cursor-pointer px-1"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm font-black text-white mb-2">{selectedPin.label}</div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300 mb-3">
                <div className="bg-zinc-900 border border-zinc-800 p-2">
                  <span className="text-zinc-500 block text-[10px]">WGS84 COORDINATES</span>
                  <span className="text-white font-bold">{selectedPin.lat}, {selectedPin.lng}</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-2">
                  <span className="text-zinc-500 block text-[10px]">ESTIMATED BIOMASS</span>
                  <span className="text-emerald-400 font-bold">{selectedPin.biomassTons} MT</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-2">
                  <span className="text-zinc-500 block text-[10px]">KUNAPAJALA YIELD</span>
                  <span className="text-sky-300 font-bold">{(selectedPin.biomassTons * 4200).toLocaleString()} L</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-2">
                  <span className="text-zinc-500 block text-[10px]">SOIL RESCUE RADIUS</span>
                  <span className="text-amber-400 font-bold">{selectedPin.clearedAreaSqMeters || 3200} m²</span>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 mb-3 space-y-1 border-t border-zinc-800/80 pt-2">
                <p>
                  Assigned Village Reactor: <strong className="text-white">{selectedPin.nearestHubId || 'HUB-BHAWANI-01'}</strong>
                </p>
                <p>
                  Volunteer Harvesters: <span className="text-zinc-200">{selectedPin.harvestVolunteerGroup}</span>
                </p>
                <p className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Gemini Vision Taxonomy Verified (Parthenin Cleavage Target)</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDispatchToBioReactor(selectedPin.id)}
                  disabled={dispatchedHarvests.includes(selectedPin.id)}
                  className={`flex-1 py-2 text-center font-bold text-xs border cursor-pointer uppercase transition-all ${
                    dispatchedHarvests.includes(selectedPin.id)
                      ? 'bg-sky-950 text-sky-400 border-sky-700 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-zinc-950 border-emerald-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  {dispatchedHarvests.includes(selectedPin.id)
                    ? '✓ Harvest Routed to Bio-Reactor'
                    : 'Dispatch Harvest to Kunapajala Reactor'}
                </button>
              </div>
            </div>
          )}

          {/* SELECTED HUB INSPECTION CARD */}
          {selectedHub && (
            <div className="absolute bottom-16 left-3 sm:left-6 max-w-md w-auto bg-zinc-950 border border-emerald-500 p-4 shadow-2xl z-40 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
                <span className="font-bold text-emerald-400 uppercase flex items-center gap-1.5 text-[11px]">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>VILLAGE COLLECTION HUB TELEMETRY</span>
                </span>
                <button
                  onClick={() => setSelectedHub(null)}
                  className="text-zinc-500 hover:text-white text-sm font-bold cursor-pointer px-1"
                >
                  ✕
                </button>
              </div>

              <div className="text-sm font-black text-white mb-2">{selectedHub.name}</div>

              <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                <div className="bg-zinc-900 border border-zinc-800 p-2">
                  <span className="text-zinc-500 block text-[10px]">CURRENT HARVEST LOAD</span>
                  <span className="text-emerald-400 font-bold">{selectedHub.currentHarvestTonnageMT} MT / {selectedHub.capacityMT} MT</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-2">
                  <span className="text-zinc-500 block text-[10px]">ACTIVE BIO-REACTORS</span>
                  <span className="text-white font-bold">{selectedHub.activeBioReactors} Hermetic Pits</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-2">
                  <span className="text-zinc-500 block text-[10px]">DAILY PRODUCTION</span>
                  <span className="text-sky-400 font-bold">{selectedHub.dailyProductionLiters.toLocaleString()} L / Day</span>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-2">
                  <span className="text-zinc-500 block text-[10px]">REACTOR STATUS</span>
                  <span className={`font-bold ${selectedHub.status === 'NEAR_CAPACITY' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {selectedHub.status}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 mb-2">
                <span className="text-zinc-500 block mb-1">ROUTED FEED VILLAGES:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedHub.assignedVillages.map((v) => (
                    <span key={v} className="bg-zinc-900 text-zinc-300 border border-zinc-800 px-1.5 py-0.5">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM STATUS BAR (Cursor Telemetry & Quick Action) */}
          <div className="relative z-30 p-3 bg-zinc-950/90 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>COORDINATES: <strong className="text-white">{cursorCoords.lat}, {cursorCoords.lng}</strong></span>
              </span>
              <span className="hidden md:inline text-zinc-700">|</span>
              <span className="hidden md:inline">
                GRID MATRIX: <strong className="text-zinc-300">{cursorCoords.xPct}% X, {cursorCoords.yPct}% Y</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetPins}
                className="text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-zinc-900 px-2.5 py-1 text-[11px] cursor-pointer flex items-center gap-1"
                title="Reset simulation markers"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RESET GRID</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. LOCALIZED METRICS BAR (Vibrant #10b981 font-mono readouts) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
          {/* Card 1: Total Biomass Harvested */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase tracking-wider mb-1">
              <span>TOTAL BIOMASS HARVESTED</span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-[#10b981] tracking-tight">
              {totalBiomassHarvestedKg.toLocaleString()} <span className="text-base sm:text-lg text-emerald-600 font-bold">kg</span>
            </div>
            <p className="font-mono text-[11px] text-zinc-500 mt-1">
              From {pins.length} identified outbreak colonies
            </p>
          </div>

          {/* Card 2: Farmers Impacted */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase tracking-wider mb-1">
              <span>FARMERS IMPACTED</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-[#10b981] tracking-tight">
              {estimatedFarmersImpacted.toLocaleString()} <span className="text-base sm:text-lg text-emerald-600 font-bold">growers</span>
            </div>
            <p className="font-mono text-[11px] text-zinc-500 mt-1">
              Across 3 agrarian block clusters in Kalahandi
            </p>
          </div>

          {/* Card 3: Synthetic NPK Displaced */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase tracking-wider mb-1">
              <span>SYNTHETIC NPK DISPLACED</span>
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-[#10b981] tracking-tight">
              {syntheticNpkDisplacedKg.toLocaleString()} <span className="text-base sm:text-lg text-emerald-600 font-bold">kg</span>
            </div>
            <p className="font-mono text-[11px] text-zinc-500 mt-1">
              Zero chemical urea runoff into regional aquifers
            </p>
          </div>

          {/* Card 4: Ecological Land Area Rescued */}
          <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-zinc-500 font-mono text-[11px] uppercase tracking-wider mb-1">
              <span>LAND RESCUED FROM TOXIN</span>
              <CircleDot className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-[#10b981] tracking-tight">
              {totalClearedSqM.toLocaleString()} <span className="text-base sm:text-lg text-emerald-600 font-bold">m²</span>
            </div>
            <p className="font-mono text-[11px] text-zinc-500 mt-1">
              Freed from sesquiterpene lactone seed dormancy
            </p>
          </div>
        </div>

      </div>

      {/* 3. GEOFENCED FIELD COLLECTOR DRAWER (Mobile-Optimized Incident Logger) */}
      {isCollectorOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-end backdrop-blur-xs">
          <div className="bg-zinc-950 border-l border-zinc-800 w-full max-w-lg h-full overflow-y-auto p-5 sm:p-7 flex flex-col justify-between font-mono shadow-2xl animate-fadeIn">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 mb-1">
                    <Navigation className="w-3 h-3" />
                    <span>GEOFENCED FIELD COLLECTOR v2.4</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase">
                    LOG PARTHENIUM INCIDENT
                  </h3>
                </div>
                <button
                  onClick={() => setIsCollectorOpen(false)}
                  className="text-zinc-500 hover:text-white text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-3 gap-1 mb-5 text-[11px]">
                <div
                  className={`p-2 border text-center font-bold ${
                    collectorStep === 'GPS_COORDS'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}
                >
                  1. GPS FIX
                </div>
                <div
                  className={`p-2 border text-center font-bold ${
                    collectorStep === 'AI_VERIFICATION'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}
                >
                  2. AI CONFIRM
                </div>
                <div
                  className={`p-2 border text-center font-bold ${
                    collectorStep === 'CONFIRMATION'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}
                >
                  3. DISPATCH
                </div>
              </div>

              {/* Step 1: GPS Field Data */}
              {collectorStep === 'GPS_COORDS' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-zinc-900 border border-zinc-800 p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-zinc-400 font-bold uppercase text-[11px]">GPS Geofence Lock</span>
                      <button
                        type="button"
                        onClick={triggerGeofenceAcquisition}
                        disabled={isGpsLocating}
                        className="text-emerald-400 hover:text-emerald-300 text-[11px] underline flex items-center gap-1 cursor-pointer"
                      >
                        <Compass className={`w-3 h-3 ${isGpsLocating ? 'animate-spin' : ''}`} />
                        <span>{isGpsLocating ? 'Acquiring Fix...' : 'Re-sample GPS'}</span>
                      </button>
                    </div>
                    <div className="text-white text-sm font-bold bg-zinc-950 border border-zinc-800 p-2 text-center">
                      {fieldCoordinates.lat}, {fieldCoordinates.lng}
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1 uppercase text-[11px]">
                      Sector / Field Location Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kusumdarha Canal Boundary #F3"
                      value={fieldSectorName}
                      onChange={(e) => setFieldSectorName(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-bold mb-1 uppercase text-[11px]">
                        Biomass (MT)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="200"
                        value={fieldBiomass}
                        onChange={(e) => setFieldBiomass(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 font-bold mb-1 uppercase text-[11px]">
                        Infestation Severity
                      </label>
                      <select
                        value={fieldSeverity}
                        onChange={(e) => setFieldSeverity(e.target.value as any)}
                        className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Critical">Critical (&gt; 80%)</option>
                        <option value="Severe">Severe (50-80%)</option>
                        <option value="Moderate">Moderate (30-50%)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-bold mb-1 uppercase text-[11px]">
                      Reporting Student Cohort / Farmer Shg
                    </label>
                    <input
                      type="text"
                      value={fieldCohort}
                      onChange={(e) => setFieldCohort(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 p-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setCollectorStep('AI_VERIFICATION')}
                    disabled={!fieldSectorName.trim()}
                    className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-zinc-950 font-bold py-2.5 text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <span>Proceed to AI Taxon Verification</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2: AI Verification Simulation */}
              {collectorStep === 'AI_VERIFICATION' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-white font-bold text-sm mb-1">
                      Field Foliage Verification
                    </h4>
                    <p className="text-zinc-400 text-xs max-w-xs mx-auto mb-4">
                      Gemini Vision API cross-references bipinnatifid leaf dissection and trichome morphology to prevent non-target harvesting.
                    </p>

                    <button
                      type="button"
                      onClick={handleSimulateAiVerification}
                      disabled={isAiVerifying}
                      className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold px-4 py-2 text-xs flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-md"
                    >
                      {isAiVerifying ? (
                        <>
                          <Sparkles className="w-4 h-4 animate-spin" />
                          <span>Scanning Specimen...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Verify with Gemini Vision AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation and Instant Yield Calc */}
              {collectorStep === 'CONFIRMATION' && (
                <form onSubmit={handleFinalizeIncidentLog} className="space-y-4 text-xs">
                  <div className="bg-emerald-950/60 border border-emerald-500 p-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>TAXONOMY VERIFIED: PARTHENIUM HYSTEROPHORUS</span>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      AI Confidence: <strong className="text-white">{aiTaxonomyConfidence}%</strong>. Target confirmed for thermophilic microbial cleavage of parthenin sesquiterpene lactone.
                    </p>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-3.5 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Target Biomass:</span>
                      <span className="text-white font-bold">{fieldBiomass} MT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Kunapajala Liquid:</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {(parseFloat(fieldBiomass || '0') * 4200).toLocaleString()} L
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Allelopathic Land Rescued:</span>
                      <span className="text-amber-400 font-bold font-mono">
                        {(parseFloat(fieldBiomass || '0') * 260).toLocaleString()} m²
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Destination Hub:</span>
                      <span className="text-sky-300 font-bold">Bhawanipatna Central LiFE Reactor</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-black py-3 text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm & Pin on Regional Grid</span>
                  </button>
                </form>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 text-center">
              NCSC 2026-27 Sub-Theme 5: Indigenous Knowledge Systems
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
