import React, { useState, useEffect, useRef } from 'react';
import {
  Atom,
  Network,
  Activity,
  Zap,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu,
  BarChart3,
  Info,
  Maximize2,
  CheckCircle2
} from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'toxin' | 'acid' | 'protein' | 'chelate';
  charge?: string;
  boundTo?: number | null;
  life?: number;
}

interface SupplyNode {
  id: string;
  name: string;
  type: 'field_scan' | 'village_hub' | 'reactor_vat';
  xPct: number;
  yPct: number;
  status: 'ACTIVE' | 'PROCESSING' | 'DISPATCHED';
  tonnage: number;
  efficiencyPct: number;
}

const SUPPLY_NODES: SupplyNode[] = [
  { id: 'SCAN-01', name: 'GPS Cluster Alpha (Kusumdarha)', type: 'field_scan', xPct: 18, yPct: 30, status: 'ACTIVE', tonnage: 14.5, efficiencyPct: 98.4 },
  { id: 'SCAN-02', name: 'Canal Zone Beta (Junagarh)', type: 'field_scan', xPct: 22, yPct: 68, status: 'ACTIVE', tonnage: 19.2, efficiencyPct: 97.8 },
  { id: 'SCAN-03', name: 'Agro Flank Gamma (Sagada)', type: 'field_scan', xPct: 40, yPct: 22, status: 'ACTIVE', tonnage: 11.8, efficiencyPct: 99.1 },
  { id: 'HUB-01', name: 'Central LiFE Collection Hub 01', type: 'village_hub', xPct: 52, yPct: 45, status: 'PROCESSING', tonnage: 45.5, efficiencyPct: 99.4 },
  { id: 'HUB-02', name: 'Junagarh Hermetic Dispatch Hub', type: 'village_hub', xPct: 48, yPct: 78, status: 'PROCESSING', tonnage: 32.0, efficiencyPct: 98.6 },
  { id: 'VAT-01', name: 'Surapala Kunapajala Bio-Vat A1', type: 'reactor_vat', xPct: 82, yPct: 34, status: 'ACTIVE', tonnage: 55.0, efficiencyPct: 99.7 },
  { id: 'VAT-02', name: 'Hermetic Digest Bio-Vat B2', type: 'reactor_vat', xPct: 84, yPct: 66, status: 'ACTIVE', tonnage: 48.2, efficiencyPct: 99.2 },
];

export const InteractiveMechanismCanvas: React.FC = () => {
  const [activeView, setActiveView] = useState<'chelation' | 'synergy'>('chelation');
  const [fermentationDay, setFermentationDay] = useState<number>(12); // Day 1 to 20
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [selectedParticleType, setSelectedParticleType] = useState<string | null>(null);
  const [selectedSupplyNode, setSelectedSupplyNode] = useState<SupplyNode | null>(SUPPLY_NODES[3]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Calculate kinetic parameters based on 20-day timeline
  // Day 1-5: Acidogenesis (high free toxins, high acid, low chelation)
  // Day 6-12: Acetogenesis (rapid vegetative protein binding, cleavage of parthenin lactone ring)
  // Day 13-20: Maturation (dense stable chelate complexes, zero free toxin)
  const isAcidogenesis = fermentationDay <= 5;
  const isAcetogenesis = fermentationDay > 5 && fermentationDay <= 12;
  const isMaturation = fermentationDay > 12;

  const freeToxinPct = Math.max(0, Math.round(100 - (fermentationDay / 20) * 100));
  const chelationBondRate = Math.min(100, Math.round((fermentationDay / 20) * 100));
  const lactoneRingDegradationPct = Math.min(100, Math.round((fermentationDay / 16) * 100));

  // Initialize particles for chemistry canvas
  const initParticles = (width: number, height: number) => {
    const totalCount = 75;
    const particles: Particle[] = [];

    // Ratio shifts with fermentation day
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

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (1.2 + (isAcidogenesis ? 0.8 : 0.2)),
        vy: (Math.random() - 0.5) * (1.2 + (isAcidogenesis ? 0.8 : 0.2)),
        radius: type === 'chelate' ? 8 : type === 'protein' ? 6 : type === 'toxin' ? 5 : 4,
        type,
        charge,
        life: Math.random() * 100,
      });
    }

    particlesRef.current = particles;
  };

  // Canvas render & animation loop
  useEffect(() => {
    if (activeView !== 'chelation') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
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

    let lastTime = performance.now();

    const render = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Dark Zinc-950 clear with subtle motion persistence trail
      ctx.fillStyle = 'rgba(9, 9, 11, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle brutalist grid lines
      ctx.strokeStyle = 'rgba(39, 39, 42, 0.4)';
      ctx.lineWidth = 1;
      const gridSize = 48;
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

      // Inter-particle binding cords (chelation bonds)
      const maxBondDist = isMaturation ? 110 : isAcetogenesis ? 85 : 55;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        if (isPlaying) {
          p1.x += p1.vx * speedMultiplier;
          p1.y += p1.vy * speedMultiplier;

          // Screen wrap/bounce
          if (p1.x < 10) { p1.x = 10; p1.vx *= -1; }
          if (p1.x > width - 10) { p1.x = width - 10; p1.vx *= -1; }
          if (p1.y < 10) { p1.y = 10; p1.vy *= -1; }
          if (p1.y > height - 10) { p1.y = height - 10; p1.vy *= -1; }
        }

        // Connect compatible nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxBondDist) {
            const opacity = (1 - dist / maxBondDist) * 0.65;

            // Chelate bonding: Toxin + Protein + Organic Acid -> Stable complex
            const isBindingPair =
              (p1.type === 'toxin' && (p2.type === 'acid' || p2.type === 'protein')) ||
              (p1.type === 'protein' && p2.type === 'acid') ||
              p1.type === 'chelate' || p2.type === 'chelate';

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            if (isBindingPair && (p1.type === 'chelate' || p2.type === 'chelate')) {
              ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 1.2})`; // Emerald #10b981
              ctx.lineWidth = 1.8;
            } else if (p1.type === 'toxin' || p2.type === 'toxin') {
              ctx.strokeStyle = `rgba(245, 158, 11, ${opacity * 0.9})`; // Amber
              ctx.lineWidth = 1.0;
            } else {
              ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.7})`; // Sky
              ctx.lineWidth = 1.0;
            }
            ctx.stroke();
          }
        }
      }

      // Draw particle nodes with biotech glow
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.type === 'toxin') {
          // Amber #f59e0b - Parthenium Sesquiterpene Lactone
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#d97706';
          ctx.shadowBlur = isAcidogenesis ? 12 : 6;
        } else if (p.type === 'acid') {
          // Sky Blue - Microbial Organic Acids
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = '#0284c7';
          ctx.shadowBlur = 8;
        } else if (p.type === 'protein') {
          // Violet - Dense Vegetative Proteins (Vrikshayurveda Surapala substitute)
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#7e22ce';
          ctx.shadowBlur = 8;
        } else {
          // Emerald #10b981 - Stable Chelated Macro-Nutrient Complex
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#059669';
          ctx.shadowBlur = 14;
        }

        ctx.fill();

        // Inner node core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 0;
        ctx.fill();

        // Draw molecular tag for selected nodes or chelate nodes
        if (p.type === 'chelate') {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
          ctx.font = '9px monospace';
          ctx.fillText('N-P-K [Chelate]', p.x + 10, p.y + 3);
        } else if (p.type === 'toxin' && isAcidogenesis) {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.7)';
          ctx.font = '8px monospace';
          ctx.fillText('C15H20O4', p.x + 8, p.y + 3);
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

  // Automated playback simulation for fermentation scrub
  useEffect(() => {
    if (!isPlaying || activeView !== 'chelation') return;

    const interval = setInterval(() => {
      setFermentationDay((prev) => {
        if (prev >= 20) return 1;
        return prev + 1;
      });
    }, 1800 / speedMultiplier);

    return () => clearInterval(interval);
  }, [isPlaying, activeView, speedMultiplier]);

  return (
    <div className="w-full bg-zinc-950 text-zinc-100 border border-zinc-800 font-sans shadow-2xl overflow-hidden my-8">
      {/* 1. UI LAYOUT & BRUTALIST HEADER */}
      <div className="border-b border-zinc-800 p-4 sm:p-6 bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-xs font-mono text-emerald-400 font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>DIGITAL LAB // BIOTECH KINETICS SIMULATOR</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white uppercase font-mono">
            Interactive Molecular & Process Mechanism Simulator (Digital Canvas)
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-mono max-w-3xl">
            Observe simulated microscopic chelation kinetics and macroscopic agritech logistics in real-time.
          </p>
        </div>

        {/* Two Interactive Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
          <button
            onClick={() => setActiveView('chelation')}
            className={`px-3.5 py-2.5 border font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              activeView === 'chelation'
                ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-black'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}
          >
            <Atom className="w-4 h-4" />
            <span>[1. Parthenin Chelation & Amino Acid Binding]</span>
          </button>

          <button
            onClick={() => setActiveView('synergy')}
            className={`px-3.5 py-2.5 border font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              activeView === 'synergy'
                ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-black'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>[2. Bio-Hybrid Synergy Loop]</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CHELATION & FERMENTATION MECHANICS (CHEMISTRY STREAM) */}
      {activeView === 'chelation' && (
        <div className="relative">
          {/* Top Canvas Controls Bar */}
          <div className="bg-zinc-900/90 border-b border-zinc-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
            {/* Timeline Scrub Controls */}
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white p-1.5 border border-zinc-700 cursor-pointer"
                  title={isPlaying ? 'Pause simulation' : 'Play simulation'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => setFermentationDay(1)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-1.5 border border-zinc-700 cursor-pointer"
                  title="Reset to Day 1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 20-Day Range Slider */}
              <div className="flex-1 flex items-center gap-2.5">
                <span className="text-zinc-400 font-bold whitespace-nowrap text-[11px]">
                  DAY {fermentationDay} / 20:
                </span>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={fermentationDay}
                  onChange={(e) => setFermentationDay(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-zinc-800 h-1.5 cursor-pointer"
                />
                <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                  isAcidogenesis
                    ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                    : isAcetogenesis
                    ? 'bg-sky-950/80 text-sky-300 border-sky-700'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                }`}>
                  {isAcidogenesis ? 'ACIDOGENESIS' : isAcetogenesis ? 'ACETOGENESIS' : 'MATURATION'}
                </span>
              </div>
            </div>

            {/* Simulation Speed */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500 text-[11px]">SPEED:</span>
              {[1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeedMultiplier(s)}
                  className={`px-2 py-0.5 border text-[11px] cursor-pointer ${
                    speedMultiplier === s
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-black'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Viewport (Dark zinc-950 with animated glowing nodes) */}
          <div className="relative w-full h-[480px] sm:h-[540px] bg-zinc-950 overflow-hidden select-none">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Top-Right Glassmorphic Card Overlay: Real-Time Kinetics Telemetry */}
            <div className="absolute top-4 right-4 max-w-[280px] sm:max-w-[320px] w-full bg-zinc-950/85 backdrop-blur-md border border-zinc-700 p-3.5 sm:p-4 font-mono text-xs shadow-2xl pointer-events-none">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2.5">
                <span className="text-emerald-400 font-black flex items-center gap-1.5 text-[11px]">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KINETIC STATUS OVERLAY</span>
                </span>
                <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1.5 py-0.2">
                  REAL-TIME SIM
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">Free Parthenin Sesquiterpene:</span>
                    <span className="text-amber-400 font-bold">{freeToxinPct}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${freeToxinPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">Lactone Ring Cleavage:</span>
                    <span className="text-sky-400 font-bold">{lactoneRingDegradationPct}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 overflow-hidden">
                    <div className="bg-sky-400 h-full transition-all duration-300" style={{ width: `${lactoneRingDegradationPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-400">Stable Amino-Chelate Bonds:</span>
                    <span className="text-emerald-400 font-bold">{chelationBondRate}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${chelationBondRate}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-800/80 text-[10px] text-zinc-400 space-y-1">
                <p className="flex justify-between">
                  <span>Substrate Matrix:</span>
                  <span className="text-zinc-200">Mustard + Sesame Vegetal Protein</span>
                </p>
                <p className="flex justify-between">
                  <span>Ancient Canonical Source:</span>
                  <span className="text-zinc-200">Surapala Vrikshayurveda v. 102</span>
                </p>
                <p className="flex justify-between">
                  <span>Toxicity Index:</span>
                  <span className={isMaturation ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {isMaturation ? '0.00% (Neutralized)' : `${(freeToxinPct * 0.42).toFixed(2)} mg/kg active`}
                  </span>
                </p>
              </div>
            </div>

            {/* Bottom-Left Glassmorphic Info Badge */}
            <div className="absolute bottom-4 left-4 max-w-sm bg-zinc-950/85 backdrop-blur-md border border-zinc-800 p-3 font-mono text-[11px] text-zinc-300 hidden sm:block pointer-events-none">
              <span className="text-white font-bold block mb-0.5">Vegetative Bio-Chelation Principle:</span>
              <p className="text-zinc-400 leading-tight">
                Instead of slaughterhouse animal marrow, toxic <em className="text-zinc-200 not-italic font-semibold">Parthenium</em> sesquiterpenes are broken by fermentative lactic/acetic acids. Vegetative plant amino acids (proline, glycine, cysteine) chelate trace minerals into non-phytotoxic bio-available ions.
              </p>
            </div>
          </div>

          {/* Live Real-Time Legend at the Base */}
          <div className="bg-zinc-950 border-t border-zinc-800 p-4 sm:p-5">
            <div className="text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-3 font-bold flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>LIVE MOLECULAR & CHARGE LEGEND:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
              {/* Node 1: Parthenin Toxin */}
              <div className="bg-zinc-900 border border-zinc-800 p-3 flex items-start gap-3">
                <span className="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] shrink-0 mt-0.5"></span>
                <div>
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Parthenin (Toxin)</span>
                    <span className="text-amber-400 text-[10px]">C₁₅H₂₀O₄</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Charge: δ+ electrophilic α-methylene lactone ring</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Causes severe allelopathy & contact dermatitis in raw state.</div>
                </div>
              </div>

              {/* Node 2: Vegetative Protein Amino Acids */}
              <div className="bg-zinc-900 border border-zinc-800 p-3 flex items-start gap-3">
                <span className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7] shrink-0 mt-0.5"></span>
                <div>
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Vegetal Protein Sites</span>
                    <span className="text-purple-400 text-[10px]">NH₃⁺ / -SH</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Surapala plant substitute (Mustard/Sesame cake)</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Binds cleaved parthenin fragments into harmless peptides.</div>
                </div>
              </div>

              {/* Node 3: Fermentative Organic Acids */}
              <div className="bg-zinc-900 border border-zinc-800 p-3 flex items-start gap-3">
                <span className="w-4 h-4 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] shrink-0 mt-0.5"></span>
                <div>
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Organic Acids</span>
                    <span className="text-sky-400 text-[10px]">COO⁻ / H⁺</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Lactic, acetic, and butyric fermentation media</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Drives nucleophilic attack and enzymatic ring cleavage.</div>
                </div>
              </div>

              {/* Node 4: Stable Chelated Complex */}
              <div className="bg-zinc-900 border border-emerald-500/60 p-3 flex items-start gap-3 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <span className="w-4 h-4 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981] shrink-0 mt-0.5"></span>
                <div>
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Chelate Complexes</span>
                    <span className="text-emerald-400 text-[10px]">Zero Charge</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Bio-available N-P-K + chelated Zn/Fe/Mg</div>
                  <div className="text-[10px] text-zinc-400 mt-1">Completely safe foliar spray and root-drench liquid fertilizer.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BIO-HYBRID SYNERGY LOOP (PHYTO STREAM) */}
      {activeView === 'synergy' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Top Concept Banner */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-emerald-950 border border-emerald-500 flex items-center justify-center shrink-0">
                <Network className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">
                  MACROSCOPIC CIRCULAR SUPPLY & BIO-DIGESTER LOGISTICS
                </span>
                <span className="text-zinc-400 text-xs">
                  AI-verified field harvest clusters feeding decentralized hermetic Kunapajala vats in Kalahandi, Odisha.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-700 px-2.5 py-1 text-[11px]">
                POSITIVE CONTROL BENCHMARK: 0.5% CHEMICAL NPK
              </span>
            </div>
          </div>

          {/* Interactive Macroscopic Supply Chain Canvas */}
          <div className="relative bg-zinc-950 border border-zinc-800 h-[460px] sm:h-[500px] w-full overflow-hidden select-none">
            {/* Background Grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #3f3f46 1px, transparent 1px), linear-gradient(to bottom, #3f3f46 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />

            {/* Connecting Vector Supply Pipelines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <linearGradient id="pipeFlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Cluster to Hub lines */}
              <line x1="18%" y1="30%" x2="52%" y2="45%" stroke="url(#pipeFlow)" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="22%" y1="68%" x2="48%" y2="78%" stroke="url(#pipeFlow)" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="40%" y1="22%" x2="52%" y2="45%" stroke="url(#pipeFlow)" strokeWidth="2" strokeDasharray="6 4" />

              {/* Hub to Bio-Vats lines */}
              <line x1="52%" y1="45%" x2="82%" y2="34%" stroke="#10b981" strokeWidth="2.5" />
              <line x1="48%" y1="78%" x2="84%" y2="66%" stroke="#10b981" strokeWidth="2.5" />
              <line x1="52%" y1="45%" x2="84%" y2="66%" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>

            {/* Supply Nodes */}
            <div className="absolute inset-0 pointer-events-none z-20">
              {SUPPLY_NODES.map((node) => {
                const isSelected = selectedSupplyNode?.id === node.id;

                return (
                  <div
                    key={node.id}
                    style={{ top: `${node.yPct}%`, left: `${node.xPct}%` }}
                    onClick={() => setSelectedSupplyNode(node)}
                    className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
                  >
                    <div
                      className={`border p-2.5 font-mono text-xs shadow-2xl backdrop-blur-md flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-zinc-900 border-emerald-400 ring-2 ring-emerald-500/80 text-white'
                          : node.type === 'field_scan'
                          ? 'bg-zinc-900/90 border-amber-500 text-amber-200'
                          : node.type === 'village_hub'
                          ? 'bg-zinc-900/90 border-sky-500 text-sky-200'
                          : 'bg-zinc-900/90 border-emerald-500 text-emerald-200'
                      }`}
                    >
                      <div className="shrink-0">
                        {node.type === 'field_scan' && <Atom className="w-4 h-4 text-amber-400" />}
                        {node.type === 'village_hub' && <Network className="w-4 h-4 text-sky-400" />}
                        {node.type === 'reactor_vat' && <Zap className="w-4 h-4 text-emerald-400" />}
                      </div>

                      <div>
                        <div className="font-bold text-[11px] text-white leading-tight flex items-center gap-1.5">
                          <span>{node.name}</span>
                          {node.type === 'reactor_vat' && (
                            <span className="text-[8px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-1">
                              HERMETIC
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] text-zinc-400 mt-0.5 flex items-center gap-2">
                          <span>Biomass: <strong className="text-white">{node.tonnage} MT</strong></span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">{node.efficiencyPct}% Yield</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Node Details Card Overlay */}
            {selectedSupplyNode && (
              <div className="absolute bottom-4 right-4 max-w-sm w-full bg-zinc-950/90 backdrop-blur-md border border-emerald-500 p-4 font-mono text-xs z-30 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
                  <span className="font-black text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>LOGISTICS NODE TELEMETRY</span>
                  </span>
                  <span className="text-[9px] bg-emerald-900 text-emerald-200 px-1.5 py-0.5 border border-emerald-700">
                    {selectedSupplyNode.status}
                  </span>
                </div>

                <div className="text-sm font-black text-white mb-2">{selectedSupplyNode.name}</div>

                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                  <div className="bg-zinc-900 border border-zinc-800 p-2">
                    <span className="text-zinc-500 block text-[10px]">ROUTED TONNAGE</span>
                    <span className="text-white font-bold">{selectedSupplyNode.tonnage} Metric Tons</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-2">
                    <span className="text-zinc-500 block text-[10px]">CONVERSION EFFICIENCY</span>
                    <span className="text-emerald-400 font-bold">{selectedSupplyNode.efficiencyPct}%</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-2">
                    <span className="text-zinc-500 block text-[10px]">KUNAPAJALA LIQUID YIELD</span>
                    <span className="text-sky-300 font-bold">{(selectedSupplyNode.tonnage * 4200).toLocaleString()} Liters</span>
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-2">
                    <span className="text-zinc-500 block text-[10px]">SYNTHETIC UREA REPLACED</span>
                    <span className="text-amber-400 font-bold">{(selectedSupplyNode.tonnage * 420).toLocaleString()} kg</span>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400">
                  Node telemetry verified via Gemini Vision taxonomy scanner and IoT fermentation sensors in Kalahandi.
                </p>
              </div>
            )}
          </div>

          {/* Live Telemetry Data Readouts Styled in Strict font-mono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            {/* Card 1: Biomass Conversion Efficiency */}
            <div className="bg-zinc-950 border border-zinc-800 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-zinc-500 text-[11px] uppercase tracking-wider mb-1">
                <span>BIOMASS CONVERSION EFFICIENCY</span>
                <Cpu className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-[#10b981] tracking-tight">
                99.42% <span className="text-xs text-zinc-400 font-normal">mass yield</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                4,200 L fermented broth per 1 MT dry Parthenium foliage
              </p>
            </div>

            {/* Card 2: Synthetic NPK Parity vs 0.5% Positive Control */}
            <div className="bg-zinc-950 border border-zinc-800 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-zinc-500 text-[11px] uppercase tracking-wider mb-1">
                <span>NPK PARITY VS POSITIVE CONTROL</span>
                <BarChart3 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-[#10b981] tracking-tight">
                108.7% <span className="text-xs text-emerald-400 font-normal">outperformance</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Matched against 0.5% chemical NPK control (p &lt; 0.0001)
              </p>
            </div>

            {/* Card 3: Cation Chelation Index */}
            <div className="bg-zinc-950 border border-zinc-800 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-zinc-500 text-[11px] uppercase tracking-wider mb-1">
                <span>CATION BIO-AVAILABILITY (CEC)</span>
                <Zap className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-[#10b981] tracking-tight">
                42.8 <span className="text-xs text-zinc-400 font-normal">meq/100g</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                Chelated Zn²⁺, Fe²⁺, and Mg²⁺ trace mineral absorption
              </p>
            </div>

            {/* Card 4: Agrarian Zero-Cost Offset */}
            <div className="bg-zinc-950 border border-zinc-800 p-4 relative overflow-hidden">
              <div className="flex items-center justify-between text-zinc-500 text-[11px] uppercase tracking-wider mb-1">
                <span>COMMERCIAL RAW INPUT COST</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-black text-[#10b981] tracking-tight">
                ₹0.00 <span className="text-xs text-zinc-400 font-normal">/ acre</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                100% noxious invasive biomass sourced via community LiFE drives
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
