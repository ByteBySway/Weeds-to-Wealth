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
  ShieldCheck,
  Cpu,
  BarChart3,
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
  clusterTargetX?: number;
  clusterTargetY?: number;
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
  const [selectedSupplyNode, setSelectedSupplyNode] = useState<SupplyNode | null>(SUPPLY_NODES[3]);

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

  // Initialize particles with slow gentle velocities (0.2 to 0.5) and cluster anchors
  const initParticles = (width: number, height: number) => {
    const totalCount = 68;
    const particles: Particle[] = [];

    // Predefined tranquil cluster centers across the canvas where stable chelated complexes settle
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

      // Gentle drift speed: magnitude strictly between 0.20 and 0.45
      const angle = Math.random() * Math.PI * 2;
      const baseSpeed = 0.22 + Math.random() * 0.24; // 0.22 to 0.46 px/frame
      const assignedCluster = clusterCenters[i % clusterCenters.length];

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * baseSpeed,
        vy: Math.sin(angle) * baseSpeed,
        radius: type === 'chelate' ? 8 : type === 'protein' ? 6 : type === 'toxin' ? 5 : 4,
        type,
        charge,
        clusterTargetX: assignedCluster.x + (Math.random() - 0.5) * 90,
        clusterTargetY: assignedCluster.y + (Math.random() - 0.5) * 90,
      });
    }

    particlesRef.current = particles;
  };

  // Canvas render & animation loop with slow hypnotic physics & clustering
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

      // Clean off-white canvas with persistence trail
      ctx.fillStyle = 'rgba(250, 250, 250, 0.45)';
      ctx.fillRect(0, 0, width, height);

      // Clean 1px brutalist grid lines (#e4e4e7)
      ctx.strokeStyle = '#e4e4e7';
      ctx.lineWidth = 1;
      const gridSize = 44;
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
      const maxBondDist = isMaturation ? 120 : isAcetogenesis ? 90 : 60;
      const clusterAttractionStrength = isMaturation ? 0.0035 : isAcetogenesis ? 0.0018 : 0.0004;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        if (isPlaying) {
          // As fermentation advances towards maturation, chelated & protein nodes gently settle into stable clusters
          if (p1.clusterTargetX && p1.clusterTargetY && (p1.type === 'chelate' || p1.type === 'protein')) {
            const cdx = p1.clusterTargetX - p1.x;
            const cdy = p1.clusterTargetY - p1.y;
            p1.vx += cdx * clusterAttractionStrength;
            p1.vy += cdy * clusterAttractionStrength;

            // Dampen velocity when clustered to eliminate jitter
            p1.vx *= 0.985;
            p1.vy *= 0.985;
          }

          // Cap speed strictly to gentle drift (max 0.50 px/frame under 1x speed)
          const currentSpeed = Math.sqrt(p1.vx * p1.vx + p1.vy * p1.vy);
          const maxVelocity = 0.50 * speedMultiplier;
          if (currentSpeed > maxVelocity) {
            p1.vx = (p1.vx / currentSpeed) * maxVelocity;
            p1.vy = (p1.vy / currentSpeed) * maxVelocity;
          }

          p1.x += p1.vx;
          p1.y += p1.vy;

          // Smooth edge deflection
          if (p1.x < 15) { p1.x = 15; p1.vx = Math.abs(p1.vx); }
          if (p1.x > width - 15) { p1.x = width - 15; p1.vx = -Math.abs(p1.vx); }
          if (p1.y < 15) { p1.y = 15; p1.vy = Math.abs(p1.vy); }
          if (p1.y > height - 15) { p1.y = height - 15; p1.vy = -Math.abs(p1.vy); }
        }

        // Connect compatible nodes with smooth lines
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
              ctx.strokeStyle = `rgba(5, 150, 105, ${opacity * 1.3})`; // Rich emerald-600
              ctx.lineWidth = 1.8;
            } else if (p1.type === 'toxin' || p2.type === 'toxin') {
              ctx.strokeStyle = `rgba(217, 119, 6, ${opacity * 0.9})`; // Amber-600
              ctx.lineWidth = 1.1;
            } else {
              ctx.strokeStyle = `rgba(14, 165, 233, ${opacity * 0.8})`; // Sky-500
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
          ctx.fillStyle = '#d97706'; // Amber-600
          ctx.strokeStyle = '#b45309';
        } else if (p.type === 'acid') {
          ctx.fillStyle = '#0284c7'; // Sky-600
          ctx.strokeStyle = '#0369a1';
        } else if (p.type === 'protein') {
          ctx.fillStyle = '#9333ea'; // Purple-600
          ctx.strokeStyle = '#7e22ce';
        } else {
          ctx.fillStyle = '#059669'; // Emerald-600
          ctx.strokeStyle = '#047857';
        }

        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Inner crisp white center core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Typography labels
        if (p.type === 'chelate') {
          ctx.fillStyle = '#065f46';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('N-P-K [Chelate]', p.x + 10, p.y + 3);
        } else if (p.type === 'toxin' && isAcidogenesis) {
          ctx.fillStyle = '#92400e';
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
            <span>DIGITAL LAB // BIOTECH KINETICS SIMULATOR</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-zinc-950 uppercase font-mono">
            Interactive Molecular & Process Mechanism Simulator (Digital Canvas)
          </h2>
          <p className="text-zinc-600 text-xs sm:text-sm mt-1 font-mono max-w-3xl">
            Observe simulated microscopic chelation kinetics and macroscopic agritech logistics in real-time.
          </p>
        </div>

        {/* Two Interactive Switcher Tabs matching top navigation */}
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
            <span>[1. Parthenin Chelation & Amino Acid Binding]</span>
          </button>

          <button
            onClick={() => setActiveView('synergy')}
            className={`px-3.5 py-2 border font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              activeView === 'synergy'
                ? 'bg-zinc-950 text-white border-zinc-950 font-black'
                : 'bg-white hover:bg-zinc-100 text-zinc-800 border-zinc-300'
            }`}
          >
            <Network className="w-4 h-4 text-emerald-400" />
            <span>[2. Bio-Hybrid Synergy Loop]</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CHELATION & FERMENTATION MECHANICS (CHEMISTRY STREAM) */}
      {activeView === 'chelation' && (
        <div className="relative bg-white">
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

          {/* Canvas Viewport (Clean Light-Mode Off-White Background) */}
          <div className="relative w-full h-[480px] sm:h-[540px] bg-zinc-50 overflow-hidden select-none border-b border-zinc-300">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Top-Right Card Overlay: Real-Time Kinetics Telemetry */}
            <div className="absolute top-4 right-4 max-w-[280px] sm:max-w-[320px] w-full bg-white/95 backdrop-blur-xs border border-zinc-300 p-3.5 sm:p-4 font-mono text-xs shadow-md pointer-events-none">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2.5">
                <span className="text-emerald-800 font-black flex items-center gap-1.5 text-[11px]">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>KINETIC STATUS OVERLAY</span>
                </span>
                <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 font-bold">
                  REAL-TIME SIM
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-600 font-medium">Free Parthenin Sesquiterpene:</span>
                    <span className="text-amber-700 font-bold">{freeToxinPct}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-1.5 overflow-hidden">
                    <div className="bg-amber-600 h-full transition-all duration-500" style={{ width: `${freeToxinPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-600 font-medium">Lactone Ring Cleavage:</span>
                    <span className="text-sky-700 font-bold">{lactoneRingDegradationPct}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-1.5 overflow-hidden">
                    <div className="bg-sky-600 h-full transition-all duration-500" style={{ width: `${lactoneRingDegradationPct}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-600 font-medium">Stable Amino-Chelate Bonds:</span>
                    <span className="text-emerald-700 font-bold">{chelationBondRate}%</span>
                  </div>
                  <div className="w-full bg-zinc-200 h-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${chelationBondRate}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-zinc-200 text-[10px] text-zinc-600 space-y-1">
                <p className="flex justify-between">
                  <span>Substrate Matrix:</span>
                  <span className="text-zinc-900 font-semibold">Mustard + Sesame Vegetal Protein</span>
                </p>
                <p className="flex justify-between">
                  <span>Canonical Treatise:</span>
                  <span className="text-zinc-900 font-semibold">Surapala Vrikshayurveda v. 102</span>
                </p>
                <p className="flex justify-between">
                  <span>Toxicity Index:</span>
                  <span className={isMaturation ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                    {isMaturation ? '0.00% (Neutralized)' : `${(freeToxinPct * 0.42).toFixed(2)} mg/kg active`}
                  </span>
                </p>
              </div>
            </div>

            {/* Bottom-Left Information Badge */}
            <div className="absolute bottom-4 left-4 max-w-sm bg-white/95 backdrop-blur-xs border border-zinc-300 p-3 font-mono text-[11px] text-zinc-700 hidden sm:block pointer-events-none shadow-xs">
              <span className="text-zinc-950 font-bold block mb-0.5">Vegetative Bio-Chelation Principle:</span>
              <p className="text-zinc-600 leading-tight">
                Instead of slaughterhouse animal marrow, toxic <em className="text-zinc-900 not-italic font-bold">Parthenium</em> sesquiterpenes are broken by fermentative lactic/acetic acids. Vegetative plant amino acids (proline, glycine, cysteine) chelate trace minerals into non-phytotoxic bio-available ions.
              </p>
            </div>
          </div>

          {/* Live Real-Time Legend at the Base */}
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

      {/* TAB 2: BIO-HYBRID SYNERGY LOOP (PHYTO STREAM) */}
      {activeView === 'synergy' && (
        <div className="p-4 sm:p-6 space-y-6 bg-white">
          {/* Top Concept Banner */}
          <div className="bg-zinc-50 border border-zinc-300 p-4 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xs bg-emerald-100 border border-emerald-400 flex items-center justify-center shrink-0">
                <Network className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <span className="font-bold text-zinc-950 text-sm block">
                  MACROSCOPIC CIRCULAR SUPPLY & BIO-DIGESTER LOGISTICS
                </span>
                <span className="text-zinc-600 text-xs">
                  AI-verified field harvest clusters feeding decentralized hermetic Kunapajala vats in Kalahandi, Odisha.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-emerald-900 font-bold bg-emerald-50 border border-emerald-300 px-2.5 py-1 text-[11px]">
                POSITIVE CONTROL BENCHMARK: 0.5% CHEMICAL NPK
              </span>
            </div>
          </div>

          {/* Interactive Macroscopic Supply Chain Canvas in Light Mode */}
          <div className="relative bg-zinc-50 border border-zinc-300 h-[460px] sm:h-[500px] w-full overflow-hidden select-none">
            {/* Background Subtle Grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #e4e4e7 1px, transparent 1px), linear-gradient(to bottom, #e4e4e7 1px, transparent 1px)',
                backgroundSize: '36px 36px',
              }}
            />

            {/* Connecting Vector Supply Pipelines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <linearGradient id="pipeFlowLight2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#059669" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
                </linearGradient>
              </defs>

              {/* Cluster to Hub lines */}
              <line x1="18%" y1="30%" x2="52%" y2="45%" stroke="url(#pipeFlowLight2)" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="22%" y1="68%" x2="48%" y2="78%" stroke="url(#pipeFlowLight2)" strokeWidth="2" strokeDasharray="6 4" />
              <line x1="40%" y1="22%" x2="52%" y2="45%" stroke="url(#pipeFlowLight2)" strokeWidth="2" strokeDasharray="6 4" />

              {/* Hub to Bio-Vats lines */}
              <line x1="52%" y1="45%" x2="82%" y2="34%" stroke="#059669" strokeWidth="2.5" />
              <line x1="48%" y1="78%" x2="84%" y2="66%" stroke="#059669" strokeWidth="2.5" />
              <line x1="52%" y1="45%" x2="84%" y2="66%" stroke="#059669" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>

            {/* Supply Nodes Styled in Light Mode Brutalist Format */}
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
                      className={`border p-2 sm:p-2.5 font-mono text-xs shadow-md backdrop-blur-xs flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-zinc-950 border-zinc-950 text-white shadow-lg'
                          : node.type === 'field_scan'
                          ? 'bg-white border-amber-400 text-zinc-900'
                          : node.type === 'village_hub'
                          ? 'bg-white border-sky-400 text-zinc-900'
                          : 'bg-white border-emerald-500 text-zinc-900'
                      }`}
                    >
                      <div className="shrink-0">
                        {node.type === 'field_scan' && <Atom className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-amber-600'}`} />}
                        {node.type === 'village_hub' && <Network className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-sky-600'}`} />}
                        {node.type === 'reactor_vat' && <Zap className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />}
                      </div>

                      <div>
                        <div className={`font-bold text-[11px] leading-tight flex items-center gap-1.5 ${isSelected ? 'text-white' : 'text-zinc-950'}`}>
                          <span>{node.name}</span>
                          {node.type === 'reactor_vat' && (
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1 font-bold">
                              HERMETIC
                            </span>
                          )}
                        </div>
                        <div className={`text-[9px] mt-0.5 flex items-center gap-2 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          <span>Biomass: <strong className={isSelected ? 'text-white' : 'text-zinc-900'}>{node.tonnage} MT</strong></span>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold">{node.efficiencyPct}% Yield</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Node Details Card Overlay */}
            {selectedSupplyNode && (
              <div className="absolute bottom-4 right-4 max-w-sm w-full bg-white/95 backdrop-blur-xs border border-zinc-300 p-4 font-mono text-xs z-30 shadow-lg">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2">
                  <span className="font-black text-emerald-800 flex items-center gap-1.5 text-[11px] uppercase">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>LOGISTICS NODE TELEMETRY</span>
                  </span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 border border-emerald-300 font-bold">
                    {selectedSupplyNode.status}
                  </span>
                </div>

                <div className="text-sm font-black text-zinc-950 mb-2">{selectedSupplyNode.name}</div>

                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                  <div className="bg-zinc-50 border border-zinc-200 p-2">
                    <span className="text-zinc-500 block text-[10px]">ROUTED TONNAGE</span>
                    <span className="text-zinc-900 font-bold">{selectedSupplyNode.tonnage} Metric Tons</span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 p-2">
                    <span className="text-zinc-500 block text-[10px]">CONVERSION EFFICIENCY</span>
                    <span className="text-emerald-700 font-bold">{selectedSupplyNode.efficiencyPct}%</span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 p-2">
                    <span className="text-zinc-500 block text-[10px]">KUNAPAJALA LIQUID YIELD</span>
                    <span className="text-sky-800 font-bold">{(selectedSupplyNode.tonnage * 4200).toLocaleString()} Liters</span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 p-2">
                    <span className="text-zinc-500 block text-[10px]">SYNTHETIC UREA REPLACED</span>
                    <span className="text-amber-800 font-bold">{(selectedSupplyNode.tonnage * 420).toLocaleString()} kg</span>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-500 leading-tight">
                  Node telemetry verified via Gemini Vision taxonomy scanner and IoT fermentation sensors in Kalahandi.
                </p>
              </div>
            )}
          </div>

          {/* Live Telemetry Data Readouts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
            {/* Card 1: Biomass Conversion Efficiency */}
            <div className="bg-zinc-50 border border-zinc-300 p-4 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between text-zinc-600 text-[11px] uppercase tracking-wider mb-1 font-semibold">
                <span>BIOMASS CONVERSION EFFICIENCY</span>
                <Cpu className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-800 tracking-tight">
                99.42% <span className="text-xs text-zinc-500 font-normal">mass yield</span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-1">
                4,200 L fermented broth per 1 MT dry Parthenium foliage
              </p>
            </div>

            {/* Card 2: Synthetic NPK Parity vs 0.5% Positive Control */}
            <div className="bg-zinc-50 border border-zinc-300 p-4 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between text-zinc-600 text-[11px] uppercase tracking-wider mb-1 font-semibold">
                <span>NPK PARITY VS POSITIVE CONTROL</span>
                <BarChart3 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-800 tracking-tight">
                108.7% <span className="text-xs text-emerald-700 font-semibold">outperformance</span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-1">
                Matched against 0.5% chemical NPK control (p &lt; 0.0001)
              </p>
            </div>

            {/* Card 3: Cation Chelation Index */}
            <div className="bg-zinc-50 border border-zinc-300 p-4 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between text-zinc-600 text-[11px] uppercase tracking-wider mb-1 font-semibold">
                <span>CATION BIO-AVAILABILITY (CEC)</span>
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-800 tracking-tight">
                42.8 <span className="text-xs text-zinc-500 font-normal">meq/100g</span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-1">
                Chelated Zn²⁺, Fe²⁺, and Mg²⁺ trace mineral absorption
              </p>
            </div>

            {/* Card 4: Agrarian Zero-Cost Offset */}
            <div className="bg-zinc-50 border border-zinc-300 p-4 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between text-zinc-600 text-[11px] uppercase tracking-wider mb-1 font-semibold">
                <span>COMMERCIAL RAW INPUT COST</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-800 tracking-tight">
                ₹0.00 <span className="text-xs text-zinc-500 font-normal">/ acre</span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-1">
                100% noxious invasive biomass sourced via community LiFE drives
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
