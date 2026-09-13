import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckSquare,
  Square,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  Filter,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';

interface DayLogData {
  day: number;
  targetPh: number;
  phase: string;
  stirringTask: string;
  stirringCategory: 'daily' | 'bidaily' | 'seal';
  notes: string;
}

const PROTOCOL_DAYS_DATA: DayLogData[] = [
  { day: 1, targetPh: 6.8, phase: 'Phase 1: Acidogenesis', stirringCategory: 'daily', stirringTask: '5-min Clockwise Stir & Aerobic Inoculation', notes: 'Initial dispersion of Parthenium foliage and cow urine rumen microbes.' },
  { day: 2, targetPh: 6.1, phase: 'Phase 1: Acidogenesis', stirringCategory: 'daily', stirringTask: '5-min Clockwise Stir & Foam Inspection', notes: 'Enteric bacteria active. Surface bubbling indicates rapid carbon consumption.' },
  { day: 3, targetPh: 5.7, phase: 'Phase 1: Acidogenesis', stirringCategory: 'daily', stirringTask: '5-min Clockwise Stir & Acid Odor Verification', notes: 'Lactic acid formation starts lowering pH. Sweet-sour fermentation odor.' },
  { day: 4, targetPh: 5.3, phase: 'Phase 1: Acidogenesis', stirringCategory: 'daily', stirringTask: '5-min Clockwise Stir & Jaggery Carbohydrate Mixing', notes: 'Acidogenesis accelerating. Microbes cleave complex polysaccharides.' },
  { day: 5, targetPh: 4.9, phase: 'Phase 1: Acidogenesis', stirringCategory: 'daily', stirringTask: '5-min Clockwise Stir & Parthenin Breakdown Check', notes: 'Sesquiterpene lactone ring undergoing opening via enteric enzymatic attack.' },
  { day: 6, targetPh: 4.6, phase: 'Phase 1: Acidogenesis', stirringCategory: 'daily', stirringTask: '5-min Clockwise Stir & Degas', notes: 'Near peak acidity. Temperature elevation in digester core (36-40°C).' },
  { day: 7, targetPh: 4.5, phase: 'Phase 1: Acidogenesis', stirringCategory: 'daily', stirringTask: '5-min Final Daily Stir & pH Nadir Verification', notes: 'Peak acidity reached (pH 4.5). Complete 99.8% parthenin contact allergen cleavage.' },
  { day: 8, targetPh: 4.6, phase: 'Phase 2: Proteolysis', stirringCategory: 'bidaily', stirringTask: 'Bi-Daily Gentle Stir (Morning 3 min)', notes: 'Transition to facultative anaerobic proteolysis. Protein mineralization begins.' },
  { day: 9, targetPh: 4.8, phase: 'Phase 2: Proteolysis', stirringCategory: 'bidaily', stirringTask: 'Bi-Daily Inspection & Degas', notes: 'Ammonification begins slowly buffering the organic acids.' },
  { day: 10, targetPh: 5.0, phase: 'Phase 2: Proteolysis', stirringCategory: 'bidaily', stirringTask: 'Bi-Daily Gentle Stir (Morning 3 min)', notes: 'Release of chelated bio-available zinc, potassium, and magnesium ions.' },
  { day: 11, targetPh: 5.2, phase: 'Phase 2: Proteolysis', stirringCategory: 'bidaily', stirringTask: 'Bi-Daily Inspection & Surface Film Removal', notes: 'Cell wall cellulosic degradation continues under anaerobic consortium.' },
  { day: 12, targetPh: 5.4, phase: 'Phase 2: Proteolysis', stirringCategory: 'bidaily', stirringTask: 'Bi-Daily Gentle Stir (Morning 3 min)', notes: 'Organic nitrogen converting to plant-absorbable ammonium (NH4+) forms.' },
  { day: 13, targetPh: 5.6, phase: 'Phase 2: Proteolysis', stirringCategory: 'bidaily', stirringTask: 'Bi-Daily Inspection & Degas', notes: 'Digest digestate turns dark brown with rich humic precursors.' },
  { day: 14, targetPh: 5.8, phase: 'Phase 2: Proteolysis', stirringCategory: 'bidaily', stirringTask: 'Final Gentle Stir before Airtight Anaerobic Seal', notes: 'Final manual stirring before closing reactor for strict methanogenic phase.' },
  { day: 15, targetPh: 6.1, phase: 'Phase 3: Stabilization', stirringCategory: 'seal', stirringTask: 'Strict Anaerobic Seal - ZERO Aeration (Do Not Stir)', notes: 'Barrel tightly sealed with bung and water-trap. Strict anaerobes take over.' },
  { day: 16, targetPh: 6.4, phase: 'Phase 3: Stabilization', stirringCategory: 'seal', stirringTask: 'Inspect Air-Lock Bubbler - Zero Manual Agitation', notes: 'Methanogenic consortia consume residual volatile acids. pH rises toward neutral.' },
  { day: 17, targetPh: 6.7, phase: 'Phase 3: Stabilization', stirringCategory: 'seal', stirringTask: 'Inspect Air-Lock Bubbler - Zero Manual Agitation', notes: 'Pungent odor converts to earthy Vrikshayurveda fermented bouquet.' },
  { day: 18, targetPh: 6.9, phase: 'Phase 3: Stabilization', stirringCategory: 'seal', stirringTask: 'Inspect Air-Lock Bubbler - Zero Manual Agitation', notes: 'Complete neutralization of any residual plant allelochemicals.' },
  { day: 19, targetPh: 7.0, phase: 'Phase 3: Stabilization', stirringCategory: 'seal', stirringTask: 'Inspect Air-Lock Bubbler - Prepare Muslin Cloth Filter', notes: 'Digestate stabilized at neutral pH. Bioactive phyto-stimulants fully formed.' },
  { day: 20, targetPh: 7.1, phase: 'Phase 3: Stabilization', stirringCategory: 'seal', stirringTask: 'Batch Harvest: Filter via Muslin Cloth into Storage Drums', notes: 'Kunapajala finished. Ready for 10% foliar spray dilution and application.' },
];

export const BatchFermentationLog: React.FC = () => {
  const { t } = useLanguage();

  // Checklist state stored in localStorage
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('ncsc_fermentation_checklist');
      return saved ? JSON.parse(saved) : [1, 2, 3];
    } catch {
      return [1, 2, 3];
    }
  });

  // User-logged custom pH values
  const [loggedPhValues, setLoggedPhValues] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('ncsc_fermentation_logged_ph');
      return saved ? JSON.parse(saved) : { 1: 6.8, 2: 6.2, 3: 5.8 };
    } catch {
      return { 1: 6.8, 2: 6.2, 3: 5.8 };
    }
  });

  const [selectedDay, setSelectedDay] = useState<number>(3);
  const [inputPh, setInputPh] = useState<string>('5.8');
  const [filterPhase, setFilterPhase] = useState<'all' | 'phase1' | 'phase2' | 'phase3'>('all');
  const [showTheoreticalCurve, setShowTheoreticalCurve] = useState<boolean>(true);

  useEffect(() => {
    localStorage.setItem('ncsc_fermentation_checklist', JSON.stringify(completedDays));
  }, [completedDays]);

  useEffect(() => {
    localStorage.setItem('ncsc_fermentation_logged_ph', JSON.stringify(loggedPhValues));
  }, [loggedPhValues]);

  const toggleDayCheck = (day: number) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const handleSavePh = () => {
    const val = parseFloat(inputPh);
    if (!isNaN(val) && val >= 3.0 && val <= 10.0) {
      setLoggedPhValues((prev) => ({
        ...prev,
        [selectedDay]: parseFloat(val.toFixed(2)),
      }));
    }
  };

  const handleResetBatch = () => {
    if (window.confirm('Reset this batch checklist and start a fresh 20-day fermentation cycle?')) {
      setCompletedDays([]);
      setLoggedPhValues({});
      localStorage.removeItem('ncsc_fermentation_checklist');
      localStorage.removeItem('ncsc_fermentation_logged_ph');
    }
  };

  const selectedDayData = PROTOCOL_DAYS_DATA.find((d) => d.day === selectedDay) || PROTOCOL_DAYS_DATA[0];
  const completionPercentage = Math.round((completedDays.length / 20) * 100);

  // Filtered days for the checklist
  const displayedDays = PROTOCOL_DAYS_DATA.filter((item) => {
    if (filterPhase === 'phase1') return item.day <= 7;
    if (filterPhase === 'phase2') return item.day >= 8 && item.day <= 14;
    if (filterPhase === 'phase3') return item.day >= 15;
    return true;
  });

  // Dynamic Recharts dataset: updates dynamically based on recorded manual stirring checks and logged field pH
  const chartData = PROTOCOL_DAYS_DATA.map((d) => {
    const isStirred = completedDays.includes(d.day);
    const userLogged = loggedPhValues[d.day];

    // If manual stirring check has been recorded for this day, plot the monitored batch pH
    const recordedPh = isStirred
      ? userLogged !== undefined
        ? userLogged
        : d.targetPh
      : null;

    return {
      day: d.day,
      name: `D${d.day}`,
      targetPh: d.targetPh,
      recordedPh: recordedPh,
      isStirred,
      isNadir: d.targetPh === 4.5,
      hasCustomLog: userLogged !== undefined,
      phase: d.phase,
      stirringTask: d.stirringTask,
      notes: d.notes,
    };
  });

  // Highest recorded day with stirring completed
  const maxCompletedDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;
  const currentBatchPh =
    maxCompletedDay > 0
      ? (loggedPhValues[maxCompletedDay] ?? PROTOCOL_DAYS_DATA[maxCompletedDay - 1].targetPh)
      : 6.8;

  // Custom Tooltip for scientific brutalist aesthetic
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;

    return (
      <div className="bg-zinc-900 border-2 border-zinc-700 p-3 font-mono text-xs shadow-2xl text-zinc-100 max-w-xs z-50">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-1.5 gap-2">
          <span className="font-bold text-white text-[11px]">
            Day {data.day}: {data.name}
          </span>
          <span
            className={`text-[10px] px-1.5 py-0.2 border ${
              data.isStirred
                ? 'bg-emerald-950 text-emerald-400 border-emerald-700 font-bold'
                : 'bg-amber-950 text-amber-400 border-amber-800'
            }`}
          >
            {data.isStirred ? '✓ STIRRED' : 'PENDING STIR'}
          </span>
        </div>

        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Target Benchmark:</span>
            <span className="text-emerald-400 font-bold font-mono">{data.targetPh.toFixed(1)} pH</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-400">Recorded Batch pH:</span>
            {data.recordedPh !== null ? (
              <span className="text-sky-400 font-bold font-mono">
                {data.recordedPh.toFixed(2)} pH {data.hasCustomLog && '(Custom Log)'}
              </span>
            ) : (
              <span className="text-zinc-500 italic">Pending Manual Check</span>
            )}
          </div>

          <div className="pt-1.5 border-t border-zinc-800 text-[10px] text-zinc-300">
            <p className="font-semibold text-zinc-200">{data.phase}</p>
            <p className="text-zinc-400 truncate mt-0.5">{data.stirringTask}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-zinc-300 p-6 sm:p-8 mt-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Sub-Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-200 pb-5 mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 border border-emerald-800/40 bg-emerald-50 px-3 py-1 text-xs font-mono text-emerald-800 mb-2 font-semibold shadow-[1px_1px_0px_0px_rgba(4,120,87,0.3)]">
            <span className="w-2 h-2 bg-emerald-700"></span>
            {t.batchLogBadge}
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-emerald-700" />
            {t.batchLogTitle}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl leading-relaxed">
            {t.batchLogSubtitle}
          </p>
        </div>

        {/* Progress & Reset */}
        <div className="flex items-center gap-3 self-start md:self-auto font-mono text-xs">
          <div className="bg-zinc-100 border border-zinc-300 px-3.5 py-2">
            <span className="text-zinc-500 block text-[10px] uppercase">Batch Status</span>
            <span className="text-emerald-800 font-bold text-sm">
              {completedDays.length}/20 Days ({completionPercentage}%)
            </span>
          </div>

          <button
            onClick={handleResetBatch}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-300 transition-colors cursor-pointer text-xs"
            title="Reset batch checklist"
          >
            <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
            <span>Reset Batch</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: DYNAMIC RECHARTS pH CURVE TRACKING */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 bg-zinc-100 px-2 py-1 border border-zinc-300">
              RECHARTS BIO-KINETIC pH CURVE
            </span>
            <span className="text-xs font-mono text-amber-700 font-bold">
              [ 6.8 ➔ 4.5 Nadir ➔ 7.1 ]
            </span>
          </div>

          {/* Quick Metrics & Toggle */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-zinc-600 bg-zinc-100 border border-zinc-300 px-2 py-0.5">
              Live Monitored pH: <strong className="text-emerald-700 font-bold">{currentBatchPh.toFixed(2)}</strong>
            </span>
            <button
              onClick={() => setShowTheoreticalCurve(!showTheoreticalCurve)}
              className={`px-2 py-0.5 border text-[11px] cursor-pointer ${
                showTheoreticalCurve
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'bg-white text-zinc-600 border-zinc-300'
              }`}
            >
              {showTheoreticalCurve ? 'Hide Benchmark' : 'Show Benchmark'}
            </button>
          </div>
        </div>

        {/* Dynamic Recharts Chart Area */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 sm:p-5 shadow-inner">
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload.length) {
                    const day = e.activePayload[0].payload.day;
                    setSelectedDay(day);
                    const logged = loggedPhValues[day];
                    setInputPh(logged !== undefined ? logged.toString() : e.activePayload[0].payload.targetPh.toString());
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />

                <XAxis
                  dataKey="name"
                  stroke="#71717a"
                  tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                  interval={0}
                />

                <YAxis
                  domain={[3.8, 7.6]}
                  ticks={[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5]}
                  stroke="#71717a"
                  tick={{ fill: '#a1a1aa', fontSize: 11, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `${val.toFixed(1)}`}
                />

                <Tooltip content={<CustomChartTooltip />} />

                {/* Phase Demarcation Lines */}
                <ReferenceLine
                  x="D7"
                  stroke="#d97706"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{
                    value: 'Phase 1 ➔ 2 (Proteolysis)',
                    fill: '#fbbf24',
                    fontSize: 9,
                    fontFamily: 'monospace',
                    position: 'insideTopLeft',
                  }}
                />
                <ReferenceLine
                  x="D14"
                  stroke="#0284c7"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                  label={{
                    value: 'Phase 2 ➔ 3 (Anaerobic Seal)',
                    fill: '#38bdf8',
                    fontSize: 9,
                    fontFamily: 'monospace',
                    position: 'insideTopLeft',
                  }}
                />

                {/* Critical Peak Nadir Reference Line at pH 4.5 */}
                <ReferenceLine
                  y={4.5}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: '★ NADIR: 4.5 pH (Allelopathy Cleavage)',
                    fill: '#f59e0b',
                    fontSize: 10,
                    fontFamily: 'monospace',
                    position: 'insideBottomLeft',
                  }}
                />

                {/* Neutral Stabilization Line at pH 7.0 */}
                <ReferenceLine
                  y={7.0}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: 'Terminal Neutral pH 7.0',
                    fill: '#34d399',
                    fontSize: 10,
                    fontFamily: 'monospace',
                    position: 'insideTopRight',
                  }}
                />

                {/* Theoretical Benchmark Curve */}
                {showTheoreticalCurve && (
                  <Line
                    type="monotone"
                    dataKey="targetPh"
                    name="Target Benchmark"
                    stroke="#10b981"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{
                      r: 3,
                      fill: '#10b981',
                      stroke: '#064e3b',
                      strokeWidth: 1,
                    }}
                    activeDot={{ r: 6, fill: '#34d399' }}
                  />
                )}

                {/* Dynamic Recorded Batch pH Line (updates based on manual stirring checks) */}
                <Line
                  type="monotone"
                  dataKey="recordedPh"
                  name="Recorded Stirred Batch"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  connectNulls={false}
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    if (!payload || payload.recordedPh === null) return <React.Fragment key={`empty-${props.index}`} />;
                    const isSelected = selectedDay === payload.day;
                    const isNadir = payload.day === 7;
                    return (
                      <circle
                        key={`rec-dot-${payload.day}`}
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 6 : isNadir ? 5.5 : 4}
                        fill={isNadir ? '#f59e0b' : '#38bdf8'}
                        stroke="#09090b"
                        strokeWidth={2}
                        className="cursor-pointer"
                      />
                    );
                  }}
                  activeDot={{ r: 7, fill: '#0284c7', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recharts Legend & Sub-Theme Annotation */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400 mt-3 pt-3 border-t border-zinc-800 gap-2">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 inline-block border-dashed"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                <span>Theoretical Target Curve</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-sky-400 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
                <span>Active Monitored Batch (Stirred Days)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                <span>Peak Lactone Nadir (Day 7: 4.5 pH)</span>
              </span>
            </div>
            <span className="text-zinc-500 text-[10px]">
              Sub-Theme 5 (IKS) • Recharts Real-Time Synchronization
            </span>
          </div>
        </div>

        {/* Selected Day Telemetry Bar & Logger */}
        <div className="bg-zinc-100 border border-zinc-300 p-4 mt-3 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-start gap-3">
            <div className="bg-zinc-900 text-white px-3 py-2 text-center font-bold">
              <span className="block text-[10px] text-zinc-400 font-normal">DAY</span>
              <span className="text-lg leading-tight">{selectedDayData.day}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-900 text-sm">{selectedDayData.phase}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 border ${
                    completedDays.includes(selectedDayData.day)
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {completedDays.includes(selectedDayData.day) ? '✓ STIRRING RECORDED' : '⚠️ STIRRING PENDING'}
                </span>
              </div>
              <span className="text-zinc-600 block mt-0.5">{selectedDayData.notes}</span>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] flex-wrap">
                <span className="text-zinc-800">
                  Target Benchmark: <strong className="text-emerald-700">{selectedDayData.targetPh} pH</strong>
                </span>
                {loggedPhValues[selectedDay] !== undefined ? (
                  <span className="text-sky-800">
                    Logged Field Reading: <strong>{loggedPhValues[selectedDay]} pH</strong> (Δ{' '}
                    {(loggedPhValues[selectedDay] - selectedDayData.targetPh).toFixed(2)})
                  </span>
                ) : (
                  <span className="text-zinc-500 italic">No custom pH reading logged</span>
                )}
              </div>
            </div>
          </div>

          {/* Inline Log Field Measurement & Stirring Toggle */}
          <div className="flex flex-wrap items-center gap-2 bg-white border border-zinc-300 p-2 shrink-0">
            <button
              onClick={() => toggleDayCheck(selectedDay)}
              className={`px-3 py-1 text-xs font-mono font-bold cursor-pointer border flex items-center gap-1.5 ${
                completedDays.includes(selectedDay)
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800'
              }`}
            >
              {completedDays.includes(selectedDay) ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Marked Stirred</span>
                </>
              ) : (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span>Record Stirring</span>
                </>
              )}
            </button>

            <span className="text-[11px] text-zinc-500 ml-1">Log pH:</span>
            <input
              type="number"
              step="0.1"
              min="3.0"
              max="9.0"
              value={inputPh}
              onChange={(e) => setInputPh(e.target.value)}
              className="w-16 px-2 py-1 border border-zinc-300 text-xs font-mono font-bold text-zinc-900 text-center"
            />
            <button
              onClick={handleSavePh}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 text-xs font-mono font-bold cursor-pointer shadow-xs"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: DAILY MANUAL STIRRING CHECKLISTS (DAYS 1-20) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-zinc-200 gap-2">
          <div>
            <h4 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-700" />
              <span>Daily Manual Stirring & Agitation Checklists (Days 1–20)</span>
            </h4>
            <p className="text-xs text-zinc-500 mt-0.5">
              Click checkboxes to record daily stirring tasks. Checking a box updates the dynamic Recharts pH curve above in real time.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 font-mono text-xs flex-wrap">
            <button
              onClick={() => setFilterPhase('all')}
              className={`px-2.5 py-1 border text-[11px] cursor-pointer ${
                filterPhase === 'all'
                  ? 'bg-zinc-900 text-white border-zinc-900 font-bold'
                  : 'bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              All Days (1-20)
            </button>
            <button
              onClick={() => setFilterPhase('phase1')}
              className={`px-2.5 py-1 border text-[11px] cursor-pointer ${
                filterPhase === 'phase1'
                  ? 'bg-amber-600 text-white border-amber-600 font-bold'
                  : 'bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              Days 1-7 (Acid)
            </button>
            <button
              onClick={() => setFilterPhase('phase2')}
              className={`px-2.5 py-1 border text-[11px] cursor-pointer ${
                filterPhase === 'phase2'
                  ? 'bg-sky-600 text-white border-sky-600 font-bold'
                  : 'bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              Days 8-14 (Proteolysis)
            </button>
            <button
              onClick={() => setFilterPhase('phase3')}
              className={`px-2.5 py-1 border text-[11px] cursor-pointer ${
                filterPhase === 'phase3'
                  ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                  : 'bg-white text-zinc-600 border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              Days 15-20 (Seal)
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Grid of Checklists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
          {displayedDays.map((item) => {
            const isCompleted = completedDays.includes(item.day);
            const isSelected = selectedDay === item.day;

            return (
              <div
                key={item.day}
                onClick={() => {
                  setSelectedDay(item.day);
                  const logged = loggedPhValues[item.day];
                  setInputPh(logged !== undefined ? logged.toString() : item.targetPh.toString());
                }}
                className={`p-3 border transition-all cursor-pointer flex items-start gap-3 text-xs ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-50 shadow-sm'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                } ${isCompleted ? 'bg-emerald-50/40' : ''}`}
              >
                {/* Interactive Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDayCheck(item.day);
                  }}
                  className="mt-0.5 text-zinc-700 hover:text-emerald-700 transition-colors shrink-0 cursor-pointer"
                >
                  {isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-emerald-700 fill-emerald-100" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-400 hover:text-zinc-600" />
                  )}
                </button>

                {/* Day Details */}
                <div className="w-full">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-zinc-900">Day {item.day}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 border ${
                          item.stirringCategory === 'daily'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : item.stirringCategory === 'bidaily'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {item.stirringCategory === 'daily'
                          ? 'Daily Stir'
                          : item.stirringCategory === 'bidaily'
                          ? 'Bi-Daily'
                          : 'Airtight Seal'}
                      </span>
                    </div>

                    <span className="text-[11px] text-zinc-500 font-normal">
                      Target: <strong className="text-zinc-800">{item.targetPh} pH</strong>
                    </span>
                  </div>

                  <p
                    className={`mt-1 font-semibold leading-tight ${
                      isCompleted ? 'line-through text-zinc-400' : 'text-zinc-800'
                    }`}
                  >
                    {item.stirringTask}
                  </p>

                  <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{item.notes}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

