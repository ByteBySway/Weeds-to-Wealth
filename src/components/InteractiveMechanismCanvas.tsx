import React, { useState, useEffect, useRef } from 'react';
import {
  Atom,
  Sprout,
  Activity,
  Zap,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Cpu,
  BarChart3,
  CheckCircle2,
  BookOpen,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Droplets,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'toxin' | 'acid' | 'protein' | 'chelate';
  charge?: string;
  clusterTargetX?: number;
  clusterTargetY?: number;
}

export type CropType = 'paddy' | 'maize' | 'cotton';

interface CropPhytoData {
  id: CropType;
  cropName: string;
  botanical: string;
  variety: string;
  family: string;
  rootSystemType: string;
  baseAuxinIAA: number; // µg IAA-equiv/L
  baseCytokinin: number; // µg Zeatin-equiv/L
  baseMbcPct: number; // % increase in Soil Microbial Biomass Carbon
  mbcAbsoluteMg: number; // mg/kg dry soil
  baseRootElongationPct: number; // % increase in elongation velocity & surface
  yieldEnhancementPct: number; // % grain/boll yield boost
  ureaDisplacementPct: number; // % basal N replaced
  rhizosphereActiveFloraPct: { kunapa: number; urea: number };
  chlorophyllSpad: { kunapa: number; urea: number };
  rootDepthExpansionPct: { kunapa: number; urea: number };
  nitrateLeachingLossPct: { kunapa: number; urea: number };
  biochemicalMechanism: {
    hormonePathway: string;
    rhizosphereColony: string;
    foliarResponse: string;
  };
}

const CROP_PHYTO_DATABASE: Record<CropType, CropPhytoData> = {
  paddy: {
    id: 'paddy',
    cropName: 'Paddy (Oryza sativa)',
    botanical: 'Oryza sativa L.',
    variety: 'Kalahandi Swarna & Desi Wetland Landrace',
    family: 'Poaceae',
    rootSystemType: 'Fibrous adventitious crown roots with high aerenchyma porosity',
    baseAuxinIAA: 148.6,
    baseCytokinin: 54.2,
    baseMbcPct: 68.4,
    mbcAbsoluteMg: 312,
    baseRootElongationPct: 44.2,
    yieldEnhancementPct: 26.8,
    ureaDisplacementPct: 35,
    rhizosphereActiveFloraPct: { kunapa: 93, urea: 26 },
    chlorophyllSpad: { kunapa: 44.8, urea: 38.2 },
    rootDepthExpansionPct: { kunapa: 42, urea: 5 },
    nitrateLeachingLossPct: { kunapa: 4.1, urea: 43.5 },
    biochemicalMechanism: {
      hormonePathway: 'Fermented Kunapajala tryptophan-derived IAA stimulates crown root primordia and suppresses tiller abortion under submergence stress.',
      rhizosphereColony: 'Rhizosphere colonization by Pseudomonas fluorescens & Bacillus subtilis solubilizes bound phosphorus (Olsen P +28 mg/kg).',
      foliarResponse: 'Amino-chelated zinc (Zn-cysteinate) prevents khaira disease and increases flag-leaf photosynthetic duration.'
    }
  },
  maize: {
    id: 'maize',
    cropName: 'Maize (Zea mays)',
    botanical: 'Zea mays L.',
    variety: 'Kalahandi Plateau Drought-Resistant Hybrid',
    family: 'Poaceae',
    rootSystemType: 'Multi-tiered nodal brace roots with deep axial hydraulic conductivity',
    baseAuxinIAA: 164.2,
    baseCytokinin: 61.8,
    baseMbcPct: 74.5,
    mbcAbsoluteMg: 338,
    baseRootElongationPct: 51.6,
    yieldEnhancementPct: 31.4,
    ureaDisplacementPct: 40,
    rhizosphereActiveFloraPct: { kunapa: 96, urea: 24 },
    chlorophyllSpad: { kunapa: 48.6, urea: 40.8 },
    rootDepthExpansionPct: { kunapa: 54, urea: 8 },
    nitrateLeachingLossPct: { kunapa: 3.5, urea: 46.2 },
    biochemicalMechanism: {
      hormonePathway: 'Endogenous zeatin analogues delay tassel and leaf sheath senescence, enhancing anthesis-silking synchronization during moisture stress.',
      rhizosphereColony: 'Arbuscular mycorrhizal fungal (AMF) hyphal length increases 2.4-fold, mobilizing locked micronutrients in Kalahandi red loam.',
      foliarResponse: 'Enhanced root hydraulic conductivity drives stem diameter expansion (+18%) and prevents lodging during late monsoon gales.'
    }
  },
  cotton: {
    id: 'cotton',
    cropName: 'Cotton (Gossypium hirsutum)',
    botanical: 'Gossypium hirsutum L.',
    variety: 'Western Odisha Semi-Arid Long Staple',
    family: 'Malvaceae',
    rootSystemType: 'Deep vertical taproot system with dense secondary lateral feeder hairs',
    baseAuxinIAA: 138.5,
    baseCytokinin: 49.0,
    baseMbcPct: 62.8,
    mbcAbsoluteMg: 298,
    baseRootElongationPct: 48.0,
    yieldEnhancementPct: 24.6,
    ureaDisplacementPct: 30,
    rhizosphereActiveFloraPct: { kunapa: 89, urea: 21 },
    chlorophyllSpad: { kunapa: 46.4, urea: 39.4 },
    rootDepthExpansionPct: { kunapa: 48, urea: 6 },
    nitrateLeachingLossPct: { kunapa: 4.8, urea: 41.8 },
    biochemicalMechanism: {
      hormonePathway: 'Auxin-to-ABA ratio balance stabilizes cell walls in the floral calyx abscission zone, preventing premature square and boll shedding.',
      rhizosphereColony: 'Phosphate-solubilizing bacteria (PSB) dissolve insoluble calcium phosphates in alkaline black cotton vertisols.',
      foliarResponse: 'Foliar spray of fermented sulfur and phenolic antioxidants suppresses sucking pest infestation (jassids, thrips).'
    }
  }
};

export const InteractiveMechanismCanvas: React.FC = () => {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<'chelation' | 'synergy'>('chelation');
  const [fermentationDay, setFermentationDay] = useState<number>(12); // Day 1 to 20
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedCrop, setSelectedCrop] = useState<CropType>('paddy');
  const [dilutionRate, setDilutionRate] = useState<number>(10); // 5%, 10%, 15%, 20%
  const [selectedHistologyZone, setSelectedHistologyZone] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Calculate kinetic parameters based on 20-day timeline
  const isAcidogenesis = fermentationDay <= 5;
  const isAcetogenesis = fermentationDay > 5 && fermentationDay <= 12;
  const isMaturation = fermentationDay > 12;

  const freeToxinPct = Math.max(0, Math.round(100 - (fermentationDay / 20) * 100));
  const chelationBondRate = Math.min(100, Math.round((fermentationDay / 20) * 100));
  const lactoneRingDegradationPct = Math.min(100, Math.round((fermentationDay / 16) * 100));

  // Initialize particles with slow gentle velocities (0.2 to 0.46) and cluster anchors
  const initParticles = (width: number, height: number) => {
    const totalCount = 68;
    const particles: Particle[] = [];

    const clusterCenters = [
      { x: width * 0.28, y: height * 0.42 },
      { x: width * 0.52, y: height * 0.35 },
      { x: width * 0.72, y: height * 0.55 },
      { x: width * 0.42, y: height * 0.68 },
    ];

    const chelateFraction = fermentationDay / 20;
    const toxinFraction = Math.max(0.05, 1 - chelateFraction);

    for (let i = 0; i < totalCount; i++) {
      const rand = Math.random();
      let type: Particle['type'] = 'toxin';
      let charge = '-';

      if (rand < chelateFraction * 0.55) {
        type = 'chelate';
        charge = '0 [Stable]';
      } else if (rand < chelateFraction * 0.55 + toxinFraction * 0.45) {
        type = 'toxin';
        charge = 'δ+ Lactone';
      } else if (rand < 0.75) {
        type = 'acid';
        charge = 'COO⁻ / H⁺';
      } else {
        type = 'protein';
        charge = 'NH₃⁺ / S-S';
      }

      // Gentle drift speed: strictly 0.20 to 0.46 px/frame
      const angle = Math.random() * Math.PI * 2;
      const baseSpeed = 0.22 + Math.random() * 0.24;
      const assignedCluster = clusterCenters[i % clusterCenters.length];

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        radius: type === 'chelate' ? 7 : type === 'protein' ? 6 : type === 'toxin' ? 5 : 4,
        type,
        charge,
        clusterTargetX: assignedCluster.x + (Math.random() - 0.5) * 80,
        clusterTargetY: assignedCluster.y + (Math.random() - 0.5) * 80,
      });
    }

    particlesRef.current = particles;
  };

  // Canvas render & animation loop with clean light physics & settling
  useEffect(() => {
    if (activeView !== 'chelation') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initParticles(rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clean off-white canvas with gentle trail
      ctx.fillStyle = 'rgba(250, 250, 250, 0.45)';
      ctx.fillRect(0, 0, width, height);

      // Clean 1px brutalist grid lines (#e4e4e7)
      ctx.strokeStyle = '#e4e4e7';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const particles = particlesRef.current;
      const maxBondDist = isMaturation ? 110 : isAcetogenesis ? 85 : 55;
      const clusterAttractionStrength = isMaturation ? 0.0035 : isAcetogenesis ? 0.0018 : 0.0004;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        if (isPlaying) {
          if (p1.clusterTargetX && p1.clusterTargetY && (p1.type === 'chelate' || p1.type === 'protein')) {
            const cdx = p1.clusterTargetX - p1.x;
            const cdy = p1.clusterTargetY - p1.y;
            p1.vx += cdx * clusterAttractionStrength;
            p1.vy += cdy * clusterAttractionStrength;
            p1.vx *= 0.985;
            p1.vy *= 0.985;
          }

          const currentSpeed = Math.sqrt(p1.vx * p1.vx + p1.vy * p1.vy);
          const maxVelocity = 0.48 * speedMultiplier;
          if (currentSpeed > maxVelocity) {
            p1.vx = (p1.vx / currentSpeed) * maxVelocity;
            p1.vy = (p1.vy / currentSpeed) * maxVelocity;
          }

          p1.x += p1.vx;
          p1.y += p1.vy;

          if (p1.x < 15) { p1.x = 15; p1.vx = Math.abs(p1.vx); }
          if (p1.x > width - 15) { p1.x = width - 15; p1.vx = -Math.abs(p1.vx); }
          if (p1.y < 15) { p1.y = 15; p1.vy = Math.abs(p1.vy); }
          if (p1.y > height - 15) { p1.y = height - 15; p1.vy = -Math.abs(p1.vy); }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxBondDist) {
            const opacity = (1 - dist / maxBondDist) * 0.70;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            if (p1.type === 'chelate' || p2.type === 'chelate') {
              ctx.strokeStyle = `rgba(5, 150, 105, ${opacity * 1.3})`;
              ctx.lineWidth = 1.8;
            } else if (p1.type === 'toxin' || p2.type === 'toxin') {
              ctx.strokeStyle = `rgba(217, 119, 6, ${opacity * 0.9})`;
              ctx.lineWidth = 1.1;
            } else {
              ctx.strokeStyle = `rgba(14, 165, 233, ${opacity * 0.8})`;
              ctx.lineWidth = 1.0;
            }
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.type === 'toxin') {
          ctx.fillStyle = '#d97706';
          ctx.strokeStyle = '#b45309';
        } else if (p.type === 'acid') {
          ctx.fillStyle = '#0284c7';
          ctx.strokeStyle = '#0369a1';
        } else if (p.type === 'protein') {
          ctx.fillStyle = '#9333ea';
          ctx.strokeStyle = '#7e22ce';
        } else {
          ctx.fillStyle = '#059669';
          ctx.strokeStyle = '#047857';
        }

        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        if (p.type === 'chelate') {
          ctx.fillStyle = '#065f46';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('N-P-K', p.x + 8, p.y + 3);
        } else if (p.type === 'toxin' && isAcidogenesis) {
          ctx.fillStyle = '#92400e';
          ctx.font = '8px monospace';
          ctx.fillText('C15', p.x + 7, p.y + 3);
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [activeView, fermentationDay, isPlaying, speedMultiplier]);

  // Automated playback simulation
  useEffect(() => {
    if (!isPlaying || activeView !== 'chelation') return;

    const interval = setInterval(() => {
      setFermentationDay((prev) => {
        if (prev >= 20) return 1;
        return prev + 1;
      });
    }, 2800 / speedMultiplier);

    return () => clearInterval(interval);
  }, [isPlaying, activeView, speedMultiplier]);

  return (
    <div className="w-full bg-white text-zinc-900 border border-zinc-300 font-sans shadow-xs my-8 overflow-hidden">
      {/* 1. LIGHT-MODE BRUTALIST HEADER */}
      <div className="border-b border-zinc-300 p-4 sm:p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-mono text-emerald-800 font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{t.simulatorBadge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-zinc-950 uppercase font-mono">
            {t.simulatorTitle}
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-mono max-w-3xl">
            {t.simulatorSubtitle}
          </p>
        </div>

        {/* Two Interactive Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
          <button
            onClick={() => setActiveView('chelation')}
            className={`px-3.5 py-2 border font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              activeView === 'chelation'
                ? 'bg-zinc-950 text-white border-zinc-950 font-black'
                : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
            }`}
          >
            <Atom className="w-4 h-4 text-emerald-400" />
            <span>[ {t.tabChelation} ]</span>
          </button>

          <button
            onClick={() => setActiveView('synergy')}
            className={`px-3.5 py-2 border font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              activeView === 'synergy'
                ? 'bg-zinc-950 text-white border-zinc-950 font-black'
                : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>[ {t.tabPhytoMech || t.tabSynergy} ]</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CHELATION & FERMENTATION MECHANICS (CHEMISTRY STREAM) */}
      {activeView === 'chelation' && (
        <div className="bg-white">
          {/* Top Canvas Controls Bar */}
          <div className="bg-zinc-50 border-b border-zinc-300 px-4 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            {/* Timeline Scrub Controls */}
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-white hover:bg-zinc-100 text-zinc-900 p-1.5 border border-zinc-300 cursor-pointer shadow-xs"
                  title={isPlaying ? 'Pause simulation' : 'Play simulation'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-700" />}
                </button>
                <button
                  onClick={() => setFermentationDay(1)}
                  className="bg-white hover:bg-zinc-100 text-zinc-700 p-1.5 border border-zinc-300 cursor-pointer shadow-xs"
                  title="Reset to Day 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 20-Day Range Slider */}
              <div className="flex-1 flex items-center gap-2.5">
                <span className="text-zinc-700 font-bold whitespace-nowrap text-[11px]">
                  DAY {fermentationDay} / 20:
                </span>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={fermentationDay}
                  onChange={(e) => setFermentationDay(Number(e.target.value))}
                  className="w-full accent-emerald-600 bg-zinc-200 h-1.5 cursor-pointer"
                />
                <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                  isAcidogenesis
                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                    : isAcetogenesis
                    ? 'bg-sky-50 text-sky-900 border-sky-300'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                }`}>
                  {isAcidogenesis ? 'ACIDOGENESIS' : isAcetogenesis ? 'ACETOGENESIS' : 'MATURATION'}
                </span>
              </div>
            </div>

            {/* Simulation Speed */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-[11px] font-bold">DRIFT SPEED:</span>
              {[1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-2 py-0.5 border text-[11px] font-mono cursor-pointer ${
                    speedMultiplier === s
                      ? 'bg-zinc-900 text-white border-zinc-900 font-black'
                      : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* STRUCTURED TWO-COLUMN RESPONSIVE LAYOUT (NO FLOATING ABSOLUTES OVER CANVAS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-zinc-300">
            {/* Dedicated HTML5 Canvas Column */}
            <div className="lg:col-span-8 bg-zinc-50 border-b lg:border-b-0 lg:border-r border-zinc-300 flex flex-col">
              <div className="px-4 py-2 bg-zinc-100/70 border-b border-zinc-200 flex items-center justify-between font-mono text-[11px] text-zinc-600">
                <span className="font-bold flex items-center gap-1.5 text-zinc-800">
                  <Atom className="w-3.5 h-3.5 text-emerald-600" />
                  <span>MICROSCOPIC MOLECULAR KINETICS CANVAS</span>
                </span>
                <span className="text-zinc-500">68 Active Nodes • Drift Rate: 0.35 px/f</span>
              </div>
              <div className="w-full h-[380px] sm:h-[440px] lg:h-[480px] relative">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>
            </div>

            {/* Clean Structured Telemetry & Canonical Treatise Sidebar */}
            <div className="lg:col-span-4 bg-white p-4 sm:p-5 flex flex-col justify-between space-y-4">
              {/* Card 1: Real-Time Kinetics Status Overlay */}
              <div className="bg-zinc-50 border border-zinc-300 p-4 font-mono text-xs shadow-xs">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-3">
                  <span className="text-emerald-800 font-black flex items-center gap-1.5 text-[11px]">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.kineticBreakdownTitle}</span>
                  </span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 font-bold">
                    {t.dayLabel} {fermentationDay}/20
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-600 font-medium">{t.freePartheninLabel}</span>
                      <span className="text-amber-700 font-bold">{freeToxinPct}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-2 overflow-hidden">
                      <div className="bg-amber-600 h-full transition-all duration-500" style={{ width: `${freeToxinPct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-600 font-medium">{t.lactoneCleavageLabel}</span>
                      <span className="text-sky-700 font-bold">{lactoneRingDegradationPct}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-2 overflow-hidden">
                      <div className="bg-sky-600 h-full transition-all duration-500" style={{ width: `${lactoneRingDegradationPct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-zinc-600 font-medium">{t.aminoChelateLabel}</span>
                      <span className="text-emerald-700 font-bold">{chelationBondRate}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-2 overflow-hidden">
                      <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${chelationBondRate}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-200 text-[11px] text-zinc-600 space-y-1.5">
                  <p className="flex justify-between">
                    <span>{t.substrateMatrixLabel}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Residual Toxicity Index:</span>
                    <span className={isMaturation ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {isMaturation ? '0.00% (Neutralized)' : `${(freeToxinPct * 0.42).toFixed(2)} mg/kg active`}
                    </span>
                  </p>
                </div>
              </div>

              {/* Card 2: Vegetative Bio-Chelation Treatise Info Box */}
              <div className="bg-emerald-50/50 border border-emerald-300 p-4 font-mono text-xs shadow-xs">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-1.5 text-[11px] uppercase">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.surapalaTreatiseTitle}</span>
                </div>
                <p className="text-zinc-700 text-[11px] leading-relaxed">
                  {t.surapalaTreatiseText}
                </p>
              </div>
            </div>
          </div>

          {/* Live Real-Time Legend at the Base (Full-width clean row) */}
          <div className="bg-white p-4 sm:p-5">
            <div className="text-zinc-500 font-mono text-[11px] uppercase tracking-wider mb-3 font-bold flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              <span>LIVE MOLECULAR & CHARGE LEGEND:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              {/* Node 1: Parthenin Toxin */}
              <div className="bg-zinc-50 border border-zinc-300 p-3 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-600 shrink-0 mt-0.5 border border-amber-700"></span>
                <div>
                  <div className="font-bold text-zinc-950 flex items-center justify-between">
                    <span>Parthenin (Toxin)</span>
                    <span className="text-amber-700 text-[10px] font-bold">C₁₅H₂₀O₄</span>
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">Charge: δ+ electrophilic α-methylene lactone ring</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Causes severe allelopathy & contact dermatitis in raw state.</div>
                </div>
              </div>

              {/* Node 2: Vegetative Protein Amino Acids */}
              <div className="bg-zinc-50 border border-zinc-300 p-3 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-600 shrink-0 mt-0.5 border border-purple-700"></span>
                <div>
                  <div className="font-bold text-zinc-950 flex items-center justify-between">
                    <span>Vegetal Protein Sites</span>
                    <span className="text-purple-700 text-[10px] font-bold">NH₃⁺ / -SH</span>
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">Surapala plant substitute (Mustard/Sesame cake)</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Binds cleaved parthenin fragments into harmless peptides.</div>
                </div>
              </div>

              {/* Node 3: Fermentative Organic Acids */}
              <div className="bg-zinc-50 border border-zinc-300 p-3 flex items-start gap-3">
                <span className="w-3.5 h-3.5 rounded-full bg-sky-600 shrink-0 mt-0.5 border border-sky-700"></span>
                <div>
                  <div className="font-bold text-zinc-950 flex items-center justify-between">
                    <span>Organic Acids</span>
                    <span className="text-sky-700 text-[10px] font-bold">COO⁻ / H⁺</span>
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">Lactic, acetic, and butyric fermentation media</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Drives nucleophilic attack and enzymatic ring cleavage.</div>
                </div>
              </div>

              {/* Node 4: Stable Chelated Complex */}
              <div className="bg-emerald-50/60 border border-emerald-300 p-3 flex items-start gap-3 shadow-xs">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 shrink-0 mt-0.5 border border-emerald-700"></span>
                <div>
                  <div className="font-bold text-emerald-950 flex items-center justify-between">
                    <span>Chelate Complexes</span>
                    <span className="text-emerald-800 text-[10px] font-bold">Zero Charge</span>
                  </div>
                  <div className="text-[10px] text-emerald-800 mt-0.5 font-medium">Bio-available N-P-K + chelated Zn/Fe/Mg</div>
                  <div className="text-[10px] text-zinc-600 mt-1">Safe foliar spray and root-drench liquid fertilizer.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHYTOHORMONAL & CROP GROWTH MECHANISM */}
      {activeView === 'synergy' && (
        <div className="p-4 sm:p-6 space-y-6 bg-white font-sans">
          {/* Top Concept Banner */}
          <div className="bg-zinc-50 border border-zinc-300 p-4 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xs bg-emerald-100 border border-emerald-400 flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <span className="font-bold text-zinc-950 text-sm block">
                  {t.phytoMechTitle}
                </span>
                <span className="text-zinc-600 text-xs">
                  {t.phytoMechSubtitle}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-emerald-900 font-bold bg-emerald-50 border border-emerald-300 px-2.5 py-1 text-[11px] shadow-xs">
                ICAR-IIOR / NCSC 2026-27 AGRONOMIC VALIDATION
              </span>
            </div>
          </div>

          {/* Interactive Crop Selector & Dilution Rate Bar */}
          <div className="bg-zinc-50 border border-zinc-300 p-4 font-mono text-xs space-y-3 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Crop Toggles */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.cropToggleLabel}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCrop('paddy')}
                    className={`px-3 py-2 border font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                      selectedCrop === 'paddy'
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>{t.cropPaddy}</span>
                  </button>

                  <button
                    onClick={() => setSelectedCrop('maize')}
                    className={`px-3 py-2 border font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                      selectedCrop === 'maize'
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{t.cropMaize}</span>
                  </button>

                  <button
                    onClick={() => setSelectedCrop('cotton')}
                    className={`px-3 py-2 border font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
                      selectedCrop === 'cotton'
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                        : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    <span>{t.cropCotton}</span>
                  </button>
                </div>
              </div>

              {/* Dilution Rate / Inoculation Mode */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.dilutionLevelLabel}</span>
                  <span className="text-emerald-700 font-black ml-1">{dilutionRate}% v/v</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { rate: 5, label: '5% Foliar', hint: 'Maintenance spray' },
                    { rate: 10, label: '10% Standard', hint: 'Optimal NCSC' },
                    { rate: 15, label: '15% Drench', hint: 'Root-zone boost' },
                    { rate: 20, label: '20% Furrow', hint: 'Basal seed dip' },
                  ].map((item) => (
                    <button
                      key={item.rate}
                      onClick={() => setDilutionRate(item.rate)}
                      className={`px-2.5 py-1.5 border text-xs font-bold cursor-pointer transition-all ${
                        dilutionRate === item.rate
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                          : 'bg-white hover:bg-zinc-100 text-zinc-700 border-zinc-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Crop Agronomic Metadata Strip */}
            <div className="pt-2 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-zinc-600">
              <div>
                <span className="text-zinc-400">BOTANICAL TAXON:</span>{' '}
                <span className="text-zinc-900 font-bold italic">{CROP_PHYTO_DATABASE[selectedCrop].botanical}</span>
              </div>
              <div>
                <span className="text-zinc-400">AGRO-ECOLOGICAL VARIETY:</span>{' '}
                <span className="text-zinc-900 font-bold">{CROP_PHYTO_DATABASE[selectedCrop].variety}</span>
              </div>
              <div>
                <span className="text-zinc-400">ROOT ARCHITECTURE:</span>{' '}
                <span className="text-zinc-900 font-bold">{CROP_PHYTO_DATABASE[selectedCrop].rootSystemType}</span>
              </div>
              <div>
                <span className="text-zinc-400">SYNTHETIC UREA DISPLACEMENT:</span>{' '}
                <span className="text-emerald-700 font-bold">{CROP_PHYTO_DATABASE[selectedCrop].ureaDisplacementPct}% Basal Offset</span>
              </div>
            </div>
          </div>

          {/* REAL-TIME BIOLOGICAL TELEMETRY CARDS (3 Key Metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
            {/* Telemetry Card 1: Auxin / Cytokinin Equivalent Activity */}
            {(() => {
              const crop = CROP_PHYTO_DATABASE[selectedCrop];
              const mult = dilutionRate === 5 ? 0.68 : dilutionRate === 10 ? 1.0 : dilutionRate === 15 ? 1.2 : 1.32;
              const liveAux = (crop.baseAuxinIAA * mult).toFixed(1);
              const liveCyto = (crop.baseCytokinin * mult).toFixed(1);

              return (
                <div className="bg-zinc-50 border border-zinc-300 p-4 relative overflow-hidden shadow-xs">
                  <div className="flex items-center justify-between text-zinc-600 text-[11px] uppercase tracking-wider mb-1 font-semibold">
                    <span>{t.telemetryAuxinTitle}</span>
                    <Atom className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-emerald-800 tracking-tight">
                    {liveAux} <span className="text-xs text-zinc-500 font-normal">µg IAA-Eq/L</span>
                  </div>
                  <div className="mt-2 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-zinc-700 font-medium">
                      <span>Cytokinin (Zeatin Equivalent):</span>
                      <span className="font-bold text-zinc-950">{liveCyto} µg/L</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-700 font-medium">
                      <span>Polar Auxin Velocity:</span>
                      <span className="font-bold text-emerald-700">12.6 mm/hr</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-zinc-200 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-800 font-bold bg-emerald-100/70 px-1.5 py-0.5 border border-emerald-300">
                      MITOSIS ACCELERATION ACTIVE
                    </span>
                    <span className="text-zinc-500">Apical Meristem</span>
                  </div>
                </div>
              );
            })()}

            {/* Telemetry Card 2: Soil Microbial Biomass Carbon (MBC) */}
            {(() => {
              const crop = CROP_PHYTO_DATABASE[selectedCrop];
              const mult = dilutionRate === 5 ? 0.68 : dilutionRate === 10 ? 1.0 : dilutionRate === 15 ? 1.2 : 1.32;
              const liveMbc = (crop.baseMbcPct * mult).toFixed(1);
              const liveMbcAbs = Math.round(185 + (crop.mbcAbsoluteMg - 185) * mult);

              return (
                <div className="bg-zinc-50 border border-zinc-300 p-4 relative overflow-hidden shadow-xs">
                  <div className="flex items-center justify-between text-zinc-600 text-[11px] uppercase tracking-wider mb-1 font-semibold">
                    <span>{t.telemetryMbcTitle}</span>
                    <Activity className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-emerald-800 tracking-tight">
                    +{liveMbc}% <span className="text-xs text-emerald-700 font-semibold">stimulation</span>
                  </div>
                  <div className="mt-2 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-zinc-700 font-medium">
                      <span>Rhizosphere MBC Absolute:</span>
                      <span className="font-bold text-zinc-950">{liveMbcAbs} mg C/kg</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-700 font-medium">
                      <span>Soil Dehydrogenase Enzyme:</span>
                      <span className="font-bold text-emerald-700">+82.4% vs Ctrl</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-zinc-200 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-800 font-bold bg-emerald-100/70 px-1.5 py-0.5 border border-emerald-300">
                      PSB & DIAZOTROPH MULTIPLICATION
                    </span>
                    <span className="text-zinc-500">Root Exudates</span>
                  </div>
                </div>
              );
            })()}

            {/* Telemetry Card 3: Root Elongation Index (%) */}
            {(() => {
              const crop = CROP_PHYTO_DATABASE[selectedCrop];
              const mult = dilutionRate === 5 ? 0.68 : dilutionRate === 10 ? 1.0 : dilutionRate === 15 ? 1.2 : 1.32;
              const liveRoot = (crop.baseRootElongationPct * mult).toFixed(1);
              const liveSurf = (crop.baseRootElongationPct * 1.24 * mult).toFixed(1);

              return (
                <div className="bg-zinc-50 border border-zinc-300 p-4 relative overflow-hidden shadow-xs sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between text-zinc-600 text-[11px] uppercase tracking-wider mb-1 font-semibold">
                    <span>{t.telemetryRootIndexTitle}</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-black text-emerald-800 tracking-tight">
                    +{liveRoot}% <span className="text-xs text-zinc-500 font-normal">elongation</span>
                  </div>
                  <div className="mt-2 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-zinc-700 font-medium">
                      <span>Root Surface Absorptive Area:</span>
                      <span className="font-bold text-zinc-950">+{liveSurf}%</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-700 font-medium">
                      <span>Drought Mining Resilience:</span>
                      <span className="font-bold text-emerald-700">High (Kalahandi)</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-zinc-200 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-800 font-bold bg-emerald-100/70 px-1.5 py-0.5 border border-emerald-300">
                      CELL DIVISION PRIMED
                    </span>
                    <span className="text-zinc-500">Hydraulic Stele</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* INTERACTIVE RHIZOSPHERE ROOT ARCHITECTURE & BIO-FLUX VISUALIZER */}
          <div className="border border-zinc-300 bg-zinc-50 p-4 sm:p-5 font-mono shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span className="font-black text-xs uppercase tracking-wider text-zinc-950">
                  {t.rootZoneFluxTitle}
                </span>
                <span className="text-[10px] bg-white text-zinc-600 border border-zinc-300 px-2 py-0.5 font-bold">
                  {selectedCrop === 'paddy' ? 'FIBROUS CROWN ROOTS' : selectedCrop === 'maize' ? 'NODAL BRACE & AXIAL ROOTS' : 'TAPROOT & LATERAL FEEDS'}
                </span>
              </div>
              <div className="text-[11px] text-zinc-500 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Phytohormone IAA
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Chelated Minerals
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span> MBC Microbes
                </span>
              </div>
            </div>

            {/* SVG Cross-Section Illustration Container */}
            <div className="relative w-full h-[280px] sm:h-[320px] bg-white border border-zinc-300 overflow-hidden select-none">
              {/* Background Depth Lines & Soil Texturing */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #f4f4f5 1px, transparent 1px), linear-gradient(to bottom, #f4f4f5 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Depth Markers Overlay */}
              <div className="absolute left-3 top-3 bottom-3 flex flex-col justify-between text-[10px] font-mono text-zinc-400 pointer-events-none z-20">
                <span className="bg-white/80 px-1 border border-zinc-200">0 cm (Surface)</span>
                <span className="bg-white/80 px-1 border border-zinc-200">-15 cm (Humus Layer)</span>
                <span className="bg-white/80 px-1 border border-zinc-200">-40 cm (Rhizosphere)</span>
                <span className="bg-white/80 px-1 border border-zinc-200">-70 cm (Deep Subsoil)</span>
              </div>

              {/* Dynamic SVG Root & Vascular Anatomy */}
              <svg className="w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* Soil Horizon Gradients */}
                  <linearGradient id="soilHorizon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4" />
                    <stop offset="35%" stopColor="#fed7aa" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.3" />
                  </linearGradient>

                  {/* Root Branch Gradients */}
                  <linearGradient id="rootKunapa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#047857" />
                    <stop offset="100%" stopColor="#065f46" />
                  </linearGradient>

                  {/* Hormone Flux Pulse */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Ground Soil Boundary */}
                <rect x="0" y="55" width="600" height="265" fill="url(#soilHorizon)" />
                <line x1="0" y1="55" x2="600" y2="55" stroke="#78716c" strokeWidth="1.5" strokeDasharray="4 2" />

                {/* Subsoil Horizon Lines */}
                <line x1="0" y1="120" x2="600" y2="120" stroke="#d6d3d1" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="210" x2="600" y2="210" stroke="#d6d3d1" strokeWidth="1" strokeDasharray="3 3" />

                {/* Plant Shoot & Foliage (Above Ground) */}
                <g id="plant-shoot">
                  {/* Main stem */}
                  <line x1="300" y1="55" x2="300" y2="12" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
                  <line x1="300" y1="20" x2="270" y2="10" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
                  <line x1="300" y1="28" x2="330" y2="14" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 270 10 Q 255 18 245 20 Q 260 25 270 10 Z" fill="#16a34a" />
                  <path d="M 330 14 Q 345 22 355 24 Q 340 30 330 14 Z" fill="#16a34a" />
                  <path d="M 300 12 Q 295 2 300 -2 Q 305 2 300 12 Z" fill="#22c55e" />
                </g>

                {/* Crop-Specific Root Architecture */}
                {selectedCrop === 'paddy' && (
                  <g id="paddy-roots" stroke="url(#rootKunapa)" strokeLinecap="round">
                    {/* Crown root cluster spreading outward */}
                    <path d="M 300 55 Q 290 90 260 130 T 230 180" strokeWidth="3.5" fill="none" />
                    <path d="M 300 55 Q 310 90 340 130 T 370 180" strokeWidth="3.5" fill="none" />
                    <path d="M 300 55 Q 280 85 240 115 T 190 145" strokeWidth="2.5" fill="none" />
                    <path d="M 300 55 Q 320 85 360 115 T 410 145" strokeWidth="2.5" fill="none" />
                    <path d="M 300 55 Q 298 120 295 190 T 290 240" strokeWidth="3" fill="none" />
                    <path d="M 300 55 Q 305 110 315 185 T 325 235" strokeWidth="2.8" fill="none" />

                    {/* Secondary lateral branchings */}
                    <path d="M 260 130 Q 240 145 220 155" strokeWidth="1.5" fill="none" />
                    <path d="M 260 130 Q 265 155 255 175" strokeWidth="1.5" fill="none" />
                    <path d="M 340 130 Q 360 145 380 155" strokeWidth="1.5" fill="none" />
                    <path d="M 340 130 Q 335 155 345 175" strokeWidth="1.5" fill="none" />
                    <path d="M 295 190 Q 280 215 270 230" strokeWidth="1.2" fill="none" />
                    <path d="M 315 185 Q 330 215 340 230" strokeWidth="1.2" fill="none" />

                    {/* Root hair zones (dense clusters) */}
                    <circle cx="230" cy="180" r="14" fill="#047857" fillOpacity="0.12" stroke="#047857" strokeWidth="0.8" strokeDasharray="2 2" />
                    <circle cx="370" cy="180" r="14" fill="#047857" fillOpacity="0.12" stroke="#047857" strokeWidth="0.8" strokeDasharray="2 2" />
                    <circle cx="290" cy="240" r="16" fill="#047857" fillOpacity="0.12" stroke="#047857" strokeWidth="0.8" strokeDasharray="2 2" />
                  </g>
                )}

                {selectedCrop === 'maize' && (
                  <g id="maize-roots" stroke="url(#rootKunapa)" strokeLinecap="round">
                    {/* Prop / Brace Roots from above ground */}
                    <line x1="297" y1="42" x2="265" y2="70" stroke="#047857" strokeWidth="3" />
                    <line x1="303" y1="42" x2="335" y2="70" stroke="#047857" strokeWidth="3" />
                    <line x1="296" y1="48" x2="250" y2="85" stroke="#047857" strokeWidth="2.5" />
                    <line x1="304" y1="48" x2="350" y2="85" stroke="#047857" strokeWidth="2.5" />

                    {/* Deep Axial Roots */}
                    <path d="M 300 55 L 298 130 L 296 210 L 295 285" strokeWidth="4.5" fill="none" />
                    <path d="M 265 70 Q 255 130 245 190 T 235 260" strokeWidth="3" fill="none" />
                    <path d="M 335 70 Q 345 130 355 190 T 365 260" strokeWidth="3" fill="none" />
                    <path d="M 250 85 Q 230 140 215 195 T 195 245" strokeWidth="2.2" fill="none" />
                    <path d="M 350 85 Q 370 140 385 195 T 405 245" strokeWidth="2.2" fill="none" />

                    {/* Lateral feeder branches */}
                    <path d="M 298 150 Q 275 165 260 175" strokeWidth="1.8" fill="none" />
                    <path d="M 298 150 Q 320 165 335 175" strokeWidth="1.8" fill="none" />
                    <path d="M 296 230 Q 270 245 255 255" strokeWidth="1.5" fill="none" />
                    <path d="M 296 230 Q 325 245 340 255" strokeWidth="1.5" fill="none" />

                    {/* Deep Soil Exploration Aura */}
                    <circle cx="295" cy="285" r="20" fill="#047857" fillOpacity="0.14" stroke="#047857" strokeWidth="1" strokeDasharray="3 2" />
                  </g>
                )}

                {selectedCrop === 'cotton' && (
                  <g id="cotton-roots" stroke="url(#rootKunapa)" strokeLinecap="round">
                    {/* Deep Central Taproot */}
                    <path d="M 300 55 L 300 125 L 299 215 L 298 290" strokeWidth="5.5" fill="none" />

                    {/* Primary Oblique Lateral Branches */}
                    <path d="M 300 95 Q 260 115 220 140 T 175 165" strokeWidth="2.8" fill="none" />
                    <path d="M 300 95 Q 340 115 380 140 T 425 165" strokeWidth="2.8" fill="none" />
                    <path d="M 300 155 Q 265 180 235 210 T 205 235" strokeWidth="2.4" fill="none" />
                    <path d="M 300 155 Q 335 180 365 210 T 395 235" strokeWidth="2.4" fill="none" />
                    <path d="M 299 215 Q 270 240 250 265" strokeWidth="1.8" fill="none" />
                    <path d="M 299 215 Q 330 240 350 265" strokeWidth="1.8" fill="none" />

                    {/* Fine Root Hairs */}
                    <line x1="220" y1="140" x2="210" y2="155" strokeWidth="1" />
                    <line x1="220" y1="140" x2="230" y2="155" strokeWidth="1" />
                    <line x1="380" y1="140" x2="370" y2="155" strokeWidth="1" />
                    <line x1="380" y1="140" x2="390" y2="155" strokeWidth="1" />
                    <circle cx="298" cy="290" r="16" fill="#047857" fillOpacity="0.15" stroke="#047857" strokeWidth="1" strokeDasharray="3 2" />
                  </g>
                )}

                {/* Animated Bio-Flux Particles Floating from Soil into Roots */}
                {/* 1. Green Auxin / Cytokinin Molecules */}
                <circle cx="280" cy="100" r="4" fill="#10b981" filter="url(#glow)">
                  <animate attributeName="cy" values="100;75;45" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;1;0.4" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="318" cy="115" r="4" fill="#10b981" filter="url(#glow)">
                  <animate attributeName="cy" values="115;85;50" dur="3.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;1;0.3" dur="3.4s" repeatCount="indefinite" />
                </circle>

                {/* 2. Gold Mineral Chelates (Fe, Zn, Mg) */}
                <circle cx="250" cy="150" r="3.5" fill="#f59e0b" filter="url(#glow)">
                  <animate attributeName="cx" values="240;265;295" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="160;140;110" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="355" cy="165" r="3.5" fill="#f59e0b" filter="url(#glow)">
                  <animate attributeName="cx" values="365;335;305" dur="3.8s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="170;145;115" dur="3.8s" repeatCount="indefinite" />
                </circle>

                {/* 3. Cyan Rhizosphere Microbes (Bacillus & Pseudomonas) */}
                <circle cx="235" cy="190" r="3" fill="#0284c7" />
                <circle cx="242" cy="195" r="2.5" fill="#0284c7" />
                <circle cx="365" cy="190" r="3" fill="#0284c7" />
                <circle cx="372" cy="196" r="2.5" fill="#0284c7" />
                <circle cx="295" cy="265" r="3" fill="#0284c7" />
                <circle cx="304" cy="270" r="2.5" fill="#0284c7" />

                {/* Histological Interactive Click Points */}
                <g
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setSelectedHistologyZone(0)}
                >
                  <circle cx="298" cy="285" r="8" fill="#15803d" stroke="#ffffff" strokeWidth="2" />
                  <text x="298" y="289" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">1</text>
                </g>

                <g
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setSelectedHistologyZone(1)}
                >
                  <circle cx="230" cy="175" r="8" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                  <text x="230" y="179" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">2</text>
                </g>

                <g
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setSelectedHistologyZone(2)}
                >
                  <circle cx="300" cy="115" r="8" fill="#b45309" stroke="#ffffff" strokeWidth="2" />
                  <text x="300" y="119" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">3</text>
                </g>

                <g
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setSelectedHistologyZone(3)}
                >
                  <circle cx="370" cy="175" r="8" fill="#4338ca" stroke="#ffffff" strokeWidth="2" />
                  <text x="370" y="179" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">4</text>
                </g>
              </svg>
            </div>

            {/* Histological Anatomical Callout Selector Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              {[
                {
                  idx: 0,
                  num: '1',
                  title: 'Apical Root Meristem',
                  badge: 'Auxin Polar Division',
                  desc: 'Cleaved lactones act as phyto-stimulants accelerating mitotic cell elongation at root caps.',
                },
                {
                  idx: 1,
                  num: '2',
                  title: 'Rhizosphere Microbe Zone',
                  badge: 'MBC Proliferation',
                  desc: 'Fermented amino acids feed PGPR colonies, solubilizing locked soil phosphates into bio-available forms.',
                },
                {
                  idx: 2,
                  num: '3',
                  title: 'Vascular Stele Transport',
                  badge: 'Xylem Micronutrients',
                  desc: 'Zero-charge Zn²⁺, Fe²⁺, and Mg²⁺ chelates flow smoothly upward into foliage without cation lock.',
                },
                {
                  idx: 3,
                  num: '4',
                  title: 'Root Exudates & SAR',
                  badge: 'Induced Systemic Immunity',
                  desc: 'Hydrolysed parthenin derivatives trigger plant systemic acquired resistance against foliar pathogens.',
                },
              ].map((zone) => {
                const isSelected = selectedHistologyZone === zone.idx;
                return (
                  <div
                    key={zone.idx}
                    onClick={() => setSelectedHistologyZone(zone.idx)}
                    className={`border p-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-zinc-950 border-zinc-950 text-white shadow-xs'
                        : 'bg-white hover:bg-zinc-100 text-zinc-900 border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px] mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isSelected ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-200 text-zinc-800'}`}>
                          {zone.num}
                        </span>
                        <span>{zone.title}</span>
                      </span>
                    </div>
                    <div className={`text-[10px] font-semibold mb-1 ${isSelected ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      {zone.badge}
                    </div>
                    <p className={`text-[10px] leading-tight ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {zone.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COMPARATIVE VISUAL BARS: KUNAPAJALA VS COMMERCIAL SYNTHETIC UREA */}
          <div className="bg-zinc-50 border border-zinc-300 p-4 sm:p-5 font-mono shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-zinc-950 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  <span>{t.comparativeTitle}</span>
                </span>
                <span className="text-[10px] bg-zinc-950 text-white px-2 py-0.5 font-bold">
                  CONTROL PROTOCOL: 46% N UREA
                </span>
              </div>
              <p className="text-zinc-600 text-xs mt-1">
                {t.comparativeSubtitle}
              </p>
            </div>

            {/* Visual Comparison Bars Container */}
            <div className="space-y-4">
              {/* Metric 1: Rhizosphere Microbial Active Flora */}
              {(() => {
                const kunapaVal = CROP_PHYTO_DATABASE[selectedCrop].rhizosphereActiveFloraPct.kunapa;
                const ureaVal = CROP_PHYTO_DATABASE[selectedCrop].rhizosphereActiveFloraPct.urea;
                return (
                  <div className="bg-white border border-zinc-200 p-3 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <span className="font-bold text-zinc-900">{t.rhizosphereMicrobialLabel}</span>
                      <span className="text-[11px] text-zinc-500">Living soil flora (Bacillus, Pseudomonas, Azotobacter)</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {/* Kunapajala Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="font-bold text-emerald-800">{t.kunapajalaDelivery}</span>
                          <span className="font-bold text-emerald-800">{kunapaVal}% active flora</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-3 border border-zinc-300 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full transition-all duration-500"
                            style={{ width: `${kunapaVal}%` }}
                          />
                        </div>
                      </div>

                      {/* Synthetic Urea Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5 text-zinc-500">
                          <span>{t.syntheticUreaDelivery}</span>
                          <span className="font-bold text-zinc-700">{ureaVal}% active flora (74% sterilized)</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-3 border border-zinc-300 overflow-hidden">
                          <div
                            className="bg-zinc-400 h-full transition-all duration-500"
                            style={{ width: `${ureaVal}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      * Synthetic urea triggers free ammonia toxicity and rhizosphere acidification, burning beneficial bacteria. Kunapajala provides organic carbon that feeds microbial proliferation.
                    </p>
                  </div>
                );
              })()}

              {/* Metric 2: Chlorophyll SPAD / Photosynthetic Efficiency */}
              {(() => {
                const kunapaSpad = CROP_PHYTO_DATABASE[selectedCrop].chlorophyllSpad.kunapa;
                const ureaSpad = CROP_PHYTO_DATABASE[selectedCrop].chlorophyllSpad.urea;
                // Max scale 60 SPAD
                const kunapaPct = Math.round((kunapaSpad / 60) * 100);
                const ureaPct = Math.round((ureaSpad / 60) * 100);

                return (
                  <div className="bg-white border border-zinc-200 p-3 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <span className="font-bold text-zinc-900">{t.chlorophyllSpadLabel}</span>
                      <span className="text-[11px] text-zinc-500">Flag-leaf stay-green index & photosynthetic duration</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {/* Kunapajala Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="font-bold text-emerald-800">{t.kunapajalaDelivery}</span>
                          <span className="font-bold text-emerald-800">{kunapaSpad} SPAD (Sustained Photosynthesis)</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-3 border border-zinc-300 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full transition-all duration-500"
                            style={{ width: `${kunapaPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Synthetic Urea Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5 text-zinc-500">
                          <span>{t.syntheticUreaDelivery}</span>
                          <span className="font-bold text-zinc-700">{ureaSpad} SPAD (Transient spike + early chlorosis)</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-3 border border-zinc-300 overflow-hidden">
                          <div
                            className="bg-zinc-400 h-full transition-all duration-500"
                            style={{ width: `${ureaPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      * Urea produces a rapid nitrate surge followed by premature leaf senescence. Kunapajala delivers amino-chelated Mg and trace minerals for continuous chloroplast synthesis.
                    </p>
                  </div>
                );
              })()}

              {/* Metric 3: Deep Rooting Surface & Anchoring Depth */}
              {(() => {
                const kunapaDepth = CROP_PHYTO_DATABASE[selectedCrop].rootDepthExpansionPct.kunapa;
                const ureaDepth = CROP_PHYTO_DATABASE[selectedCrop].rootDepthExpansionPct.urea;

                return (
                  <div className="bg-white border border-zinc-200 p-3 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <span className="font-bold text-zinc-900">{t.rootDepthLabel}</span>
                      <span className="text-[11px] text-zinc-500">Deep soil exploration and drought-spell resistance</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {/* Kunapajala Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="font-bold text-emerald-800">{t.kunapajalaDelivery}</span>
                          <span className="font-bold text-emerald-800">+{kunapaDepth}% Root Exploration Depth</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-3 border border-zinc-300 overflow-hidden">
                          <div
                            className="bg-sky-600 h-full transition-all duration-500"
                            style={{ width: `${kunapaDepth * 1.5}%` }}
                          />
                        </div>
                      </div>

                      {/* Synthetic Urea Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5 text-zinc-500">
                          <span>{t.syntheticUreaDelivery}</span>
                          <span className="font-bold text-zinc-700">+{ureaDepth}% (Shallow weak surface roots)</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-3 border border-zinc-300 overflow-hidden">
                          <div
                            className="bg-zinc-400 h-full transition-all duration-500"
                            style={{ width: `${ureaDepth * 1.5}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      * Surface salt fertilizers cause root shallowing and vulnerable lodging. Kunapajala phytohormones trigger downward tap and brace root penetration to deep moisture tables.
                    </p>
                  </div>
                );
              })()}

              {/* Metric 4: Nitrate Leaching / Runoff Waste */}
              {(() => {
                const kunapaLeach = CROP_PHYTO_DATABASE[selectedCrop].nitrateLeachingLossPct.kunapa;
                const ureaLeach = CROP_PHYTO_DATABASE[selectedCrop].nitrateLeachingLossPct.urea;

                return (
                  <div className="bg-white border border-zinc-200 p-3 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <span className="font-bold text-zinc-900">{t.nutrientLeachingLabel}</span>
                      <span className="text-[11px] text-zinc-500">Environmental waste & groundwater nitrate contamination</span>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {/* Kunapajala Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="font-bold text-emerald-800">{t.kunapajalaDelivery}</span>
                          <span className="font-bold text-emerald-800">{kunapaLeach}% Loss (Carbon Matrix Bound)</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-3 border border-zinc-300 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full transition-all duration-500"
                            style={{ width: `${kunapaLeach * 2}%` }}
                          />
                        </div>
                      </div>

                      {/* Synthetic Urea Bar */}
                      <div>
                        <div className="flex justify-between text-[11px] mb-0.5 text-zinc-500">
                          <span>{t.syntheticUreaDelivery}</span>
                          <span className="font-bold text-rose-700">{ureaLeach}% Leached into Aquifer</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-3 border border-zinc-300 overflow-hidden">
                          <div
                            className="bg-rose-500 h-full transition-all duration-500"
                            style={{ width: `${ureaLeach}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">
                      * Over 40% of chemical urea is lost to leaching and volatilization, contaminating groundwater. Kunapajala's chelated organic nitrogen stays bound to soil colloids until absorbed.
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* IKS VRIKSHAYURVEDA GROUNDING FOOTER */}
          <div className="bg-zinc-50 border border-zinc-300 p-4 font-mono text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-zinc-600">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong className="text-zinc-950">Surapala&apos;s Vrikshayurveda (v. 101–105):</strong> Vegetal Kunapajala replaces chemical salts with organic amino chelates, boosting crop vitality and building living soil carbon.
              </span>
            </div>
            <div className="shrink-0 text-emerald-800 font-bold bg-white px-2 py-1 border border-zinc-200 text-[10px]">
              NCSC 2026-27 SUB-THEME 5
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
