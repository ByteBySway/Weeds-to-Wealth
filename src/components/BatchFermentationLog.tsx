import React, { useState, useEffect } from 'react';
import { Activity, CheckSquare, Square, RotateCcw, AlertTriangle, CheckCircle2, ChevronRight, Info, Filter } from 'lucide-react';
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

  const [selectedDay, setSelectedDay] = useState<number>(7);
  const [inputPh, setInputPh] = useState<string>('4.5');
  const [filterPhase, setFilterPhase] = useState<'all' | 'phase1' | 'phase2' | 'phase3'>('all');

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

  const selectedDayData = PROTOCOL_DAYS_DATA.find((d) => d.day === selectedDay) || PROTOCOL_DAYS_DATA[6];
  const completionPercentage = Math.round((completedDays.length / 20) * 100);

  // Filtered days for the checklist
  const displayedDays = PROTOCOL_DAYS_DATA.filter((item) => {
    if (filterPhase === 'phase1') return item.day <= 7;
    if (filterPhase === 'phase2') return item.day >= 8 && item.day <= 14;
    if (filterPhase === 'phase3') return item.day >= 15;
    return true;
  });

  // SVG dimensions for pH curve
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Scale functions: X (Day 1-20), Y (pH 4.0 to 7.5)
  const minPh = 4.0;
  const maxPh = 7.5;
  const getX = (day: number) => paddingX + ((day - 1) / 19) * (svgWidth - 2 * paddingX);
  const getY = (ph: number) =>
    paddingY + ((maxPh - ph) / (maxPh - minPh)) * (svgHeight - 2 * paddingY);

  // Generate target curve path
  const curvePoints = PROTOCOL_DAYS_DATA.map((d) => `${getX(d.day)},${getY(d.targetPh)}`);
  const curveD = `M ${curvePoints.join(' L ')}`;

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

      {/* SECTION 1: LIVE pH CURVE VISUALIZATION (6.8 -> 4.5 -> 7.1) */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 bg-zinc-100 px-2 py-1 border border-zinc-300">
              KINETIC TRAJECTORY: ACIDOGENESIS TO BIO-STABILIZATION
            </span>
            <span className="text-xs font-mono text-amber-700 font-bold">
              [ 6.8 ➔ 4.5 Nadir ➔ 7.1 ]
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            Click any day marker to inspect or log custom field pH
          </span>
        </div>

        {/* Chart Canvas */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 overflow-x-auto">
          <div className="min-w-[620px]">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto select-none">
              {/* Grid Lines */}
              {[4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0].map((gridPh) => {
                const y = getY(gridPh);
                return (
                  <g key={gridPh}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke={gridPh === 4.5 ? '#b45309' : '#27272a'}
                      strokeDasharray={gridPh === 4.5 ? '4,3' : undefined}
                      strokeWidth={gridPh === 4.5 ? '1.5' : '1'}
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      fill={gridPh === 4.5 ? '#f59e0b' : '#71717a'}
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {gridPh.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Critical 4.5 Cleavage Nadir Band */}
              <rect
                x={getX(6.5)}
                y={getY(4.7)}
                width={getX(7.5) - getX(6.5)}
                height={getY(4.3) - getY(4.7)}
                fill="#d97706"
                fillOpacity="0.15"
              />
              <text
                x={getX(7)}
                y={getY(4.5) + 16}
                fill="#fbbf24"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                ★ NADIR: 4.5 pH (Lactone Cleavage)
              </text>

              {/* Phases Shading at top */}
              <text x={getX(4)} y={paddingY - 12} fill="#fb923c" fontSize="9" fontFamily="monospace" textAnchor="middle">
                Days 1-7: Acidogenesis (6.8 ➔ 4.5)
              </text>
              <text x={getX(11)} y={paddingY - 12} fill="#60a5fa" fontSize="9" fontFamily="monospace" textAnchor="middle">
                Days 8-14: Proteolysis (4.5 ➔ 5.8)
              </text>
              <text x={getX(17.5)} y={paddingY - 12} fill="#34d399" fontSize="9" fontFamily="monospace" textAnchor="middle">
                Days 15-20: Stabilization (5.8 ➔ 7.1)
              </text>

              {/* Target Curve Line */}
              <path
                d={curveD}
                fill="none"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points */}
              {PROTOCOL_DAYS_DATA.map((d) => {
                const cx = getX(d.day);
                const cy = getY(d.targetPh);
                const isSelected = selectedDay === d.day;
                const isNadir = d.targetPh === 4.5;
                const userLogged = loggedPhValues[d.day];

                return (
                  <g
                    key={d.day}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedDay(d.day);
                      setInputPh(userLogged !== undefined ? userLogged.toString() : d.targetPh.toString());
                    }}
                  >
                    {/* Pulsing ring for selected */}
                    {isSelected && (
                      <circle cx={cx} cy={cy} r="9" fill="none" stroke="#34d399" strokeWidth="2" opacity="0.8" />
                    )}

                    {/* Point circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isNadir ? 5.5 : 4}
                      fill={isSelected ? '#34d399' : isNadir ? '#f59e0b' : '#059669'}
                      stroke="#09090b"
                      strokeWidth="1.5"
                    />

                    {/* User Logged Mark if exists */}
                    {userLogged !== undefined && (
                      <circle
                        cx={cx}
                        cy={getY(userLogged)}
                        r="3"
                        fill="#38bdf8"
                        stroke="#09090b"
                        strokeWidth="1"
                      />
                    )}

                    {/* Day number on X-axis */}
                    <text
                      x={cx}
                      y={svgHeight - 8}
                      fill={isSelected ? '#34d399' : '#a1a1aa'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                    >
                      D{d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-zinc-400 mt-2 pt-2 border-t border-zinc-800 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span>
                <span>Target Scientific Curve</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
                <span>Peak Acidity Nadir (4.5 pH)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-sky-400 rounded-full inline-block"></span>
                <span>Your Logged Field Measurements</span>
              </span>
            </div>
            <span className="text-zinc-500">Sub-Theme 5: Indigenous Knowledge Systems</span>
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
              <span className="font-bold text-zinc-900 block text-sm">{selectedDayData.phase}</span>
              <span className="text-zinc-600 block mt-0.5">{selectedDayData.notes}</span>
              <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                <span className="text-zinc-800">
                  Target pH: <strong className="text-emerald-700">{selectedDayData.targetPh}</strong>
                </span>
                {loggedPhValues[selectedDay] !== undefined && (
                  <span className="text-sky-800">
                    Logged Field pH: <strong>{loggedPhValues[selectedDay]}</strong> (Δ{' '}
                    {(loggedPhValues[selectedDay] - selectedDayData.targetPh).toFixed(2)})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Inline Log Field Measurement */}
          <div className="flex items-center gap-2 bg-white border border-zinc-300 p-2 shrink-0">
            <span className="text-[11px] text-zinc-500">Record pH:</span>
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
              className="bg-zinc-900 hover:bg-zinc-800 text-white px-3 py-1 text-xs font-mono font-bold cursor-pointer"
            >
              Save Log
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
              Click checkboxes to log daily stirring tasks. Strict anaerobic sealing takes place on Days 15–20.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
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
                onClick={() => setSelectedDay(item.day)}
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
                      pH: <strong className="text-zinc-800">{item.targetPh}</strong>
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
