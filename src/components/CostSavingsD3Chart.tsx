import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TrendingUp, ShieldCheck, Zap, ArrowUpRight, Clock, HelpCircle, Layers, BarChart3 } from 'lucide-react';

interface CostSavingsD3ChartProps {
  acres: number;
  spendPerAcre: number;
}

interface SeasonData {
  seasonIndex: number; // 1 to N
  seasonLabel: string; // e.g., "S1 (Yr 1 Kharif)"
  yearNumber: number;
  seasonType: 'Kharif' | 'Rabi' | 'Zaid';
  syntheticCost: number;
  diyCost: number;
  seasonalSavings: number;
  cumSyntheticCost: number;
  cumDiyCost: number;
  cumSavings: number;
}

export const CostSavingsD3Chart: React.FC<CostSavingsD3ChartProps> = ({
  acres,
  spendPerAcre,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // User adjustable simulation levers
  const [horizonYears, setHorizonYears] = useState<number>(5); // 3, 5, 7
  const [seasonsPerYear, setSeasonsPerYear] = useState<number>(2); // 2 = Kharif + Rabi; 3 = Kharif + Rabi + Zaid
  const [inflationRate, setInflationRate] = useState<number>(0.06); // 6% annual synthetic fertilizer inflation
  const [viewMode, setViewMode] = useState<'cumulative' | 'seasonal'>('cumulative');
  const [hoveredData, setHoveredData] = useState<SeasonData | null>(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 700, height: 340 });

  // Monitor container width dynamically via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const responsiveWidth = Math.max(300, width);
        const responsiveHeight = window.innerWidth < 640 ? 280 : 340;
        setChartDimensions({ width: responsiveWidth, height: responsiveHeight });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute time-series data
  const data: SeasonData[] = useMemo(() => {
    const totalSeasons = horizonYears * seasonsPerYear;
    const points: SeasonData[] = [];

    // One-time capital setup for 200L HDPE bio-digester barrel/drum
    const oneTimeDrumSetup = 850;
    // Ongoing raw material per acre per season: 0.5kg jaggery (@ ₹45/kg = ~₹22.5) + ₹2.5 microbial starter/rock salt
    const diyPerAcrePerSeason = 25;

    let runningSynthetic = 0;
    let runningDiy = 0;

    const seasonNames: ('Kharif' | 'Rabi' | 'Zaid')[] =
      seasonsPerYear === 3 ? ['Kharif', 'Rabi', 'Zaid'] : ['Kharif', 'Rabi'];

    for (let i = 1; i <= totalSeasons; i++) {
      const year = Math.ceil(i / seasonsPerYear);
      const seasonIndexInYear = (i - 1) % seasonsPerYear;
      const seasonType = seasonNames[seasonIndexInYear];
      const seasonLabel = `S${i} (Y${year} ${seasonType.slice(0, 3)})`;

      // Synthetic fertilizer cost with annual inflation & 1.5% annual soil degradation surcharge
      const yearElapsed = (i - 1) / seasonsPerYear;
      const compoundInflation = Math.pow(1 + inflationRate, yearElapsed);
      const soilDegradationFactor = 1 + 0.015 * yearElapsed;
      const seasonalSynthetic = Math.round(acres * spendPerAcre * compoundInflation * soilDegradationFactor);

      // DIY Kunapajala: One-time barrel setup in season 1 + variable jaggery/microbe feed
      const seasonalDiy = Math.round(
        (i === 1 ? oneTimeDrumSetup : 0) + (acres * diyPerAcrePerSeason)
      );

      const seasonalSavings = seasonalSynthetic - seasonalDiy;
      runningSynthetic += seasonalSynthetic;
      runningDiy += seasonalDiy;
      const cumSavings = runningSynthetic - runningDiy;

      points.push({
        seasonIndex: i,
        seasonLabel,
        yearNumber: year,
        seasonType,
        syntheticCost: seasonalSynthetic,
        diyCost: seasonalDiy,
        seasonalSavings,
        cumSyntheticCost: runningSynthetic,
        cumDiyCost: runningDiy,
        cumSavings,
      });
    }

    return points;
  }, [acres, spendPerAcre, horizonYears, seasonsPerYear, inflationRate]);

  // Key metrics for badges
  const finalPeriod = data[data.length - 1];
  const totalSavings = finalPeriod ? finalPeriod.cumSavings : 0;
  const totalSyntheticSpend = finalPeriod ? finalPeriod.cumSyntheticCost : 0;
  const totalDiySpend = finalPeriod ? finalPeriod.cumDiyCost : 1;
  const roiMultiple = (totalSavings / totalDiySpend).toFixed(1);

  // Currency formatter for Indian Rupee
  const formatINR = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    if (val >= 1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Render D3 Chart
  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const { width, height } = chartDimensions;
    const isMobile = width < 500;
    const margin = {
      top: 25,
      right: isMobile ? 15 : 35,
      bottom: isMobile ? 45 : 55,
      left: isMobile ? 55 : 75,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    if (innerWidth <= 0 || innerHeight <= 0) return;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add SVG defs for gradients and shadow filters
    const defs = svg.append('defs');

    // Gradient for Cumulative Savings Area
    const savingsGrad = defs
      .append('linearGradient')
      .attr('id', 'savings-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    savingsGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', 0.35);
    savingsGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#10b981')
      .attr('stop-opacity', 0.02);

    // Gradient for Synthetic Spend Area
    const syntheticGrad = defs
      .append('linearGradient')
      .attr('id', 'synthetic-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    syntheticGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#f59e0b')
      .attr('stop-opacity', 0.2);
    syntheticGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#f59e0b')
      .attr('stop-opacity', 0.01);

    // Scales
    const xScale = d3
      .scalePoint<string>()
      .domain(data.map((d) => d.seasonLabel))
      .range([0, innerWidth])
      .padding(0.2);

    if (viewMode === 'cumulative') {
      // Y Scale for Cumulative mode
      const yMax = (d3.max(data, (d) => Math.max(d.cumSyntheticCost, d.cumSavings)) || 1000) * 1.08;
      const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]).nice();

      // Horizontal Grid Lines
      g.append('g')
        .attr('class', 'grid')
        .call(
          d3
            .axisLeft(yScale)
            .ticks(5)
            .tickSize(-innerWidth)
            .tickFormat(() => '')
        )
        .selectAll('line')
        .attr('stroke', '#27272a')
        .attr('stroke-dasharray', '2,2');

      g.select('.grid .domain').remove();

      // D3 Area: Net Savings Area between Synthetic Curve and DIY Curve
      const areaGenerator = d3
        .area<SeasonData>()
        .x((d) => xScale(d.seasonLabel) || 0)
        .y0((d) => yScale(d.cumDiyCost))
        .y1((d) => yScale(d.cumSyntheticCost))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'url(#savings-gradient)')
        .attr('d', areaGenerator);

      // Line 1: Synthetic NPK Cumulative Cost
      const syntheticLine = d3
        .line<SeasonData>()
        .x((d) => xScale(d.seasonLabel) || 0)
        .y((d) => yScale(d.cumSyntheticCost))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2.5)
        .attr('d', syntheticLine);

      // Line 2: Cumulative Net Savings
      const savingsLine = d3
        .line<SeasonData>()
        .x((d) => xScale(d.seasonLabel) || 0)
        .y((d) => yScale(d.cumSavings))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '4,2')
        .attr('d', savingsLine);

      // Line 3: DIY Kunapajala Cumulative Cost
      const diyLine = d3
        .line<SeasonData>()
        .x((d) => xScale(d.seasonLabel) || 0)
        .y((d) => yScale(d.cumDiyCost))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#047857')
        .attr('stroke-width', 2)
        .attr('d', diyLine);

      // Data Points on Cumulative Net Savings
      g.selectAll('.savings-circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'savings-circle')
        .attr('cx', (d) => xScale(d.seasonLabel) || 0)
        .attr('cy', (d) => yScale(d.cumSavings))
        .attr('r', isMobile ? 3 : 4)
        .attr('fill', '#10b981')
        .attr('stroke', '#064e3b')
        .attr('stroke-width', 2);

      // Data Points on Synthetic Spend
      g.selectAll('.synthetic-circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'synthetic-circle')
        .attr('cx', (d) => xScale(d.seasonLabel) || 0)
        .attr('cy', (d) => yScale(d.cumSyntheticCost))
        .attr('r', isMobile ? 2.5 : 3.5)
        .attr('fill', '#f59e0b')
        .attr('stroke', '#78350f')
        .attr('stroke-width', 1.5);

      // Axes
      const xAxis = d3.axisBottom(xScale).tickValues(
        data
          .filter((_, idx) => (isMobile ? idx % 2 === 0 || idx === data.length - 1 : true))
          .map((d) => d.seasonLabel)
      );

      const yAxis = d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat((d) => formatINR(d as number));

      const xAxisGroup = g
        .append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis);

      xAxisGroup
        .selectAll('text')
        .attr('fill', '#a1a1aa')
        .attr('font-size', isMobile ? '10px' : '11px')
        .attr('font-family', 'monospace')
        .attr('transform', isMobile ? 'rotate(-30)' : 'none')
        .attr('text-anchor', isMobile ? 'end' : 'middle');

      xAxisGroup.select('.domain').attr('stroke', '#3f3f46');
      xAxisGroup.selectAll('line').attr('stroke', '#3f3f46');

      const yAxisGroup = g.append('g').call(yAxis);
      yAxisGroup
        .selectAll('text')
        .attr('fill', '#a1a1aa')
        .attr('font-size', isMobile ? '10px' : '11px')
        .attr('font-family', 'monospace');
      yAxisGroup.select('.domain').attr('stroke', '#3f3f46');
      yAxisGroup.selectAll('line').attr('stroke', '#3f3f46');

      // Milestone Flag at final point
      if (finalPeriod) {
        const lastX = xScale(finalPeriod.seasonLabel) || 0;
        const lastY = yScale(finalPeriod.cumSavings);

        const callout = g
          .append('g')
          .attr('transform', `translate(${Math.min(lastX - (isMobile ? 70 : 90), innerWidth - 95)},${Math.max(10, lastY - 24)})`);

        callout
          .append('rect')
          .attr('width', isMobile ? 80 : 95)
          .attr('height', 20)
          .attr('fill', '#064e3b')
          .attr('stroke', '#10b981')
          .attr('stroke-width', 1)
          .attr('rx', 2);

        callout
          .append('text')
          .attr('x', (isMobile ? 80 : 95) / 2)
          .attr('y', 13.5)
          .attr('text-anchor', 'middle')
          .attr('fill', '#6ee7b7')
          .attr('font-family', 'monospace')
          .attr('font-size', isMobile ? '9px' : '10px')
          .attr('font-weight', 'bold')
          .text(`+${formatINR(finalPeriod.cumSavings)}`);
      }

    } else {
      // SEASONAL COMPARISON BAR VIEW
      const yMax = (d3.max(data, (d) => Math.max(d.syntheticCost, d.seasonalSavings)) || 1000) * 1.15;
      const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]).nice();

      // Grid
      g.append('g')
        .attr('class', 'grid')
        .call(
          d3
            .axisLeft(yScale)
            .ticks(5)
            .tickSize(-innerWidth)
            .tickFormat(() => '')
        )
        .selectAll('line')
        .attr('stroke', '#27272a')
        .attr('stroke-dasharray', '2,2');

      g.select('.grid .domain').remove();

      const bandwidth = Math.min(36, Math.max(16, innerWidth / (data.length * 2.4)));

      // Synthetic Cost Bars
      g.selectAll('.bar-synthetic')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar-synthetic')
        .attr('x', (d) => (xScale(d.seasonLabel) || 0) - bandwidth - 1)
        .attr('y', (d) => yScale(d.syntheticCost))
        .attr('width', bandwidth)
        .attr('height', (d) => Math.max(0, innerHeight - yScale(d.syntheticCost)))
        .attr('fill', '#b45309')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 1);

      // DIY Kunapajala Bars
      g.selectAll('.bar-diy')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar-diy')
        .attr('x', (d) => (xScale(d.seasonLabel) || 0) + 1)
        .attr('y', (d) => yScale(d.diyCost))
        .attr('width', bandwidth)
        .attr('height', (d) => Math.max(2, innerHeight - yScale(d.diyCost)))
        .attr('fill', '#047857')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 1);

      // Axes
      const xAxis = d3.axisBottom(xScale).tickValues(
        data
          .filter((_, idx) => (isMobile ? idx % 2 === 0 || idx === data.length - 1 : true))
          .map((d) => d.seasonLabel)
      );

      const yAxis = d3
        .axisLeft(yScale)
        .ticks(5)
        .tickFormat((d) => formatINR(d as number));

      const xAxisGroup = g
        .append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(xAxis);

      xAxisGroup
        .selectAll('text')
        .attr('fill', '#a1a1aa')
        .attr('font-size', isMobile ? '10px' : '11px')
        .attr('font-family', 'monospace')
        .attr('transform', isMobile ? 'rotate(-30)' : 'none')
        .attr('text-anchor', isMobile ? 'end' : 'middle');

      xAxisGroup.select('.domain').attr('stroke', '#3f3f46');
      xAxisGroup.selectAll('line').attr('stroke', '#3f3f46');

      const yAxisGroup = g.append('g').call(yAxis);
      yAxisGroup
        .selectAll('text')
        .attr('fill', '#a1a1aa')
        .attr('font-size', isMobile ? '10px' : '11px')
        .attr('font-family', 'monospace');
      yAxisGroup.select('.domain').attr('stroke', '#3f3f46');
      yAxisGroup.selectAll('line').attr('stroke', '#3f3f46');
    }

    // Interactive Crosshair and Hover Detection
    const bisectSeason = (mouseX: number): SeasonData => {
      let closest = data[0];
      let minDiff = Infinity;
      data.forEach((d) => {
        const xPos = xScale(d.seasonLabel) || 0;
        const diff = Math.abs(xPos - mouseX);
        if (diff < minDiff) {
          minDiff = diff;
          closest = d;
        }
      });
      return closest;
    };

    const crosshairLine = g
      .append('line')
      .attr('class', 'crosshair')
      .attr('stroke', '#71717a')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .style('display', 'none');

    const overlay = g
      .append('rect')
      .attr('class', 'overlay')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    overlay
      .on('mousemove', (event: MouseEvent) => {
        const [mx] = d3.pointer(event);
        const hovered = bisectSeason(mx);
        setHoveredData(hovered);

        const xPos = xScale(hovered.seasonLabel) || 0;
        crosshairLine
          .attr('x1', xPos)
          .attr('x2', xPos)
          .style('display', 'block');
      })
      .on('mouseleave', () => {
        setHoveredData(null);
        crosshairLine.style('display', 'none');
      });

  }, [data, chartDimensions, viewMode]);

  return (
    <div className="mt-8 border border-zinc-700 bg-zinc-950 p-4 sm:p-6 font-mono text-zinc-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.85)]">
      {/* Header & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
              D3.JS AGRONOMIC COST TRAJECTORY ENGINE
            </span>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2">
              REAL-TIME
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-zinc-100 tracking-tight mt-1">
            Cumulative Cost Savings: DIY Kunapajala vs Synthetic NPK
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            D3-powered parametric simulation modeling long-term economic surplus for {acres.toFixed(1)} Acres.
          </p>
        </div>

        {/* View Mode & Time Horizon Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* View Mode Toggle */}
          <div className="flex border border-zinc-700 bg-zinc-900 p-0.5">
            <button
              onClick={() => setViewMode('cumulative')}
              className={`px-2.5 py-1 text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'cumulative'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="View cumulative multi-year savings trajectory"
            >
              <Layers className="w-3 h-3" />
              <span>Cumulative</span>
            </button>
            <button
              onClick={() => setViewMode('seasonal')}
              className={`px-2.5 py-1 text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'seasonal'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="View seasonal step-by-step expenditure bars"
            >
              <BarChart3 className="w-3 h-3" />
              <span>Per-Season</span>
            </button>
          </div>

          {/* Time Horizon */}
          <div className="flex border border-zinc-700 bg-zinc-900 p-0.5">
            {[3, 5, 7].map((years) => (
              <button
                key={years}
                onClick={() => setHorizonYears(years)}
                className={`px-2 py-1 text-[11px] font-mono cursor-pointer transition-all ${
                  horizonYears === years
                    ? 'bg-zinc-700 text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {years}Y
              </button>
            ))}
          </div>

          {/* Cropping Pattern */}
          <div className="flex border border-zinc-700 bg-zinc-900 p-0.5">
            <button
              onClick={() => setSeasonsPerYear(2)}
              className={`px-2 py-1 text-[11px] font-mono cursor-pointer transition-all ${
                seasonsPerYear === 2
                  ? 'bg-zinc-700 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="2 Seasons/Year (Kharif + Rabi)"
            >
              2 Crops/Yr
            </button>
            <button
              onClick={() => setSeasonsPerYear(3)}
              className={`px-2 py-1 text-[11px] font-mono cursor-pointer transition-all ${
                seasonsPerYear === 3
                  ? 'bg-zinc-700 text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="3 Seasons/Year (Kharif + Rabi + Zaid)"
            >
              3 Crops/Yr
            </button>
          </div>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
        <div className="bg-zinc-900/90 border border-zinc-800 p-2.5">
          <span className="text-[10px] uppercase text-zinc-400 block">Total {horizonYears}-Year Savings</span>
          <span className="text-emerald-400 text-lg sm:text-xl font-black block mt-0.5">
            {formatINR(totalSavings)}
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">100% Retained by Farmer</span>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-2.5">
          <span className="text-[10px] uppercase text-zinc-400 block">Synthetic NPK Outflow</span>
          <span className="text-amber-400 text-lg sm:text-xl font-black block mt-0.5">
            {formatINR(totalSyntheticSpend)}
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Chemical Fertilizer Spend</span>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 p-2.5">
          <span className="text-[10px] uppercase text-zinc-400 block">DIY Kunapajala Cost</span>
          <span className="text-zinc-200 text-lg sm:text-xl font-black block mt-0.5">
            {formatINR(totalDiySpend)}
          </span>
          <span className="text-[10px] text-zinc-500 block mt-0.5">Setup + Jaggery feed</span>
        </div>

        <div className="bg-zinc-900/90 border border-emerald-800/60 p-2.5 bg-emerald-950/20">
          <span className="text-[10px] uppercase text-emerald-400 font-bold block flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            ROI Multiplier
          </span>
          <span className="text-emerald-400 text-lg sm:text-xl font-black block mt-0.5">
            {roiMultiple}x
          </span>
          <span className="text-[10px] text-emerald-300/80 block mt-0.5">Payback in Season 1</span>
        </div>
      </div>

      {/* D3 Chart Container */}
      <div ref={containerRef} className="relative w-full overflow-hidden bg-zinc-900/40 border border-zinc-800/80 p-2">
        <svg
          ref={svgRef}
          width={chartDimensions.width}
          height={chartDimensions.height}
          className="w-full overflow-visible"
        />

        {/* Live Hover Tooltip Card */}
        {hoveredData && (
          <div className="pointer-events-none absolute top-4 right-4 bg-zinc-950/95 border border-emerald-500/70 p-3 text-xs shadow-2xl backdrop-blur-xs font-mono max-w-xs z-20">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2">
              <span className="font-bold text-zinc-100 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                {hoveredData.seasonLabel}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 border border-emerald-800">
                Yr {hoveredData.yearNumber}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between items-center text-amber-400">
                <span>Synthetic NPK Cost:</span>
                <span className="font-bold">
                  {viewMode === 'cumulative'
                    ? formatINR(hoveredData.cumSyntheticCost)
                    : formatINR(hoveredData.syntheticCost)}
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-400">
                <span>DIY Kunapajala Cost:</span>
                <span className="font-bold text-zinc-200">
                  {viewMode === 'cumulative'
                    ? formatINR(hoveredData.cumDiyCost)
                    : formatINR(hoveredData.diyCost)}
                </span>
              </div>

              <div className="pt-1.5 border-t border-zinc-800 flex justify-between items-center text-emerald-400 font-bold">
                <span>Net Cash Preserved:</span>
                <span className="text-sm">
                  +{viewMode === 'cumulative'
                    ? formatINR(hoveredData.cumSavings)
                    : formatINR(hoveredData.seasonalSavings)}
                </span>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-zinc-900 text-[10px] text-zinc-400 leading-snug">
              💡 Reinvestment: Equivalent to {(hoveredData.cumSavings / 4500).toFixed(1)} quintals of organic pulse seed.
            </div>
          </div>
        )}
      </div>

      {/* Chart Legend & Agronomic Assumption Notes */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-zinc-400 pt-3 border-t border-zinc-800/80">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500 inline-block"></span>
            <span>Synthetic NPK Expense (with 6% inflation)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block border-b border-dashed border-emerald-400"></span>
            <span className="text-emerald-300 font-semibold">Cumulative Net Savings (Envelope)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-700 inline-block"></span>
            <span>DIY Kunapajala (₹0 Weed + ₹25/Ac Jaggery)</span>
          </div>
        </div>

        {/* Inflation rate selector */}
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-zinc-500">Synthetic Inflation:</span>
          {[0, 0.06, 0.10].map((rate) => (
            <button
              key={rate}
              onClick={() => setInflationRate(rate)}
              className={`px-1.5 py-0.5 border cursor-pointer ${
                inflationRate === rate
                  ? 'border-amber-500 bg-amber-950/60 text-amber-300 font-bold'
                  : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {(rate * 100).toFixed(0)}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
