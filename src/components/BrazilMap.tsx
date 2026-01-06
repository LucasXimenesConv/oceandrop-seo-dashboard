'use client';

import { useState, useMemo } from 'react';
import { competitors as baseCompetitors, brazilStates } from '@/data/mockData';

// SVG paths reais do mapa do Brasil com centros para labels
const brazilSVGPaths: Record<string, { path: string; cx: number; cy: number }> = {
  AC: { path: "M 115.7,363.9 L 116.2,372.1 L 127.8,371.6 L 136.8,377.3 L 142.3,371.3 L 145.8,372.8 L 155.8,365.6 L 155.3,361.9 L 148.3,360.4 L 145.3,354.4 L 139.3,353.9 L 134.3,357.4 L 127.8,353.9 L 121.8,357.4 L 115.7,363.9 Z", cx: 136, cy: 365 },
  AL: { path: "M 548.8,340.4 L 555.3,335.4 L 560.3,337.4 L 563.3,333.9 L 558.8,329.4 L 552.3,329.9 L 545.3,334.9 L 548.8,340.4 Z", cx: 554, cy: 335 },
  AP: { path: "M 390.3,183.9 L 397.8,174.4 L 408.3,175.9 L 416.3,169.4 L 420.8,175.4 L 418.3,186.4 L 407.8,196.9 L 395.3,194.9 L 390.3,183.9 Z", cx: 405, cy: 183 },
  AM: { path: "M 152.3,209.4 L 171.8,203.4 L 195.3,206.9 L 219.3,194.4 L 250.8,193.9 L 268.3,206.4 L 289.8,202.9 L 307.3,214.4 L 319.8,214.4 L 336.3,226.9 L 338.8,250.4 L 323.3,268.9 L 303.8,269.4 L 286.3,284.4 L 273.3,284.9 L 260.8,296.4 L 237.8,295.4 L 222.3,310.4 L 196.3,308.4 L 176.8,318.9 L 159.8,315.4 L 146.8,326.9 L 124.3,324.9 L 115.8,333.4 L 104.3,329.4 L 109.3,314.9 L 117.3,308.4 L 115.3,293.4 L 124.8,281.9 L 130.3,256.9 L 148.8,244.9 L 152.3,209.4 Z", cx: 220, cy: 260 },
  BA: { path: "M 479.3,321.4 L 498.3,316.9 L 516.8,321.9 L 533.3,313.4 L 547.8,318.4 L 555.8,328.9 L 549.3,342.4 L 553.3,357.9 L 539.8,379.9 L 538.3,399.4 L 518.3,424.4 L 493.8,434.4 L 481.8,428.9 L 468.3,437.9 L 453.8,432.4 L 450.8,408.9 L 438.3,393.4 L 439.8,377.9 L 450.3,363.4 L 447.8,343.9 L 458.8,330.4 L 479.3,321.4 Z", cx: 495, cy: 375 },
  CE: { path: "M 517.3,271.9 L 532.8,263.4 L 550.3,266.4 L 560.8,275.9 L 556.3,290.4 L 545.3,299.9 L 536.8,298.4 L 524.3,308.9 L 513.3,306.4 L 510.8,290.9 L 517.3,271.9 Z", cx: 535, cy: 285 },
  DF: { path: "M 414.3,402.4 L 423.8,398.9 L 428.3,404.9 L 422.8,412.4 L 413.3,410.9 L 414.3,402.4 Z", cx: 420, cy: 405 },
  ES: { path: "M 506.3,432.9 L 517.3,428.4 L 523.3,437.9 L 518.8,451.9 L 507.3,455.9 L 502.8,447.4 L 506.3,432.9 Z", cx: 513, cy: 443 },
  GO: { path: "M 384.8,368.9 L 407.3,360.4 L 429.8,365.4 L 447.8,355.4 L 455.3,361.4 L 450.8,377.9 L 453.8,393.4 L 444.3,406.9 L 428.3,404.4 L 414.3,413.9 L 398.8,410.4 L 383.3,420.9 L 369.8,413.4 L 373.8,392.4 L 384.8,368.9 Z", cx: 415, cy: 385 },
  MA: { path: "M 427.3,242.4 L 450.3,237.9 L 468.8,247.4 L 486.3,244.9 L 502.8,261.4 L 496.3,278.9 L 477.3,285.4 L 461.3,281.4 L 449.8,293.4 L 432.3,291.9 L 421.8,277.4 L 427.3,242.4 Z", cx: 460, cy: 265 },
  MT: { path: "M 264.3,326.4 L 295.8,318.9 L 323.3,323.9 L 348.3,310.9 L 375.8,317.9 L 385.3,335.4 L 383.8,361.9 L 370.3,380.4 L 351.8,381.9 L 340.3,402.4 L 308.8,412.9 L 285.8,407.4 L 274.3,390.4 L 257.8,387.9 L 247.8,370.4 L 252.3,346.4 L 264.3,326.4 Z", cx: 320, cy: 360 },
  MS: { path: "M 318.3,420.4 L 344.3,413.9 L 361.8,421.9 L 374.3,446.4 L 366.3,467.9 L 350.8,478.4 L 335.3,473.4 L 317.8,483.4 L 304.8,476.9 L 299.3,456.4 L 306.3,435.9 L 318.3,420.4 Z", cx: 335, cy: 450 },
  MG: { path: "M 418.3,398.4 L 444.3,391.9 L 465.8,400.9 L 487.3,395.4 L 503.8,408.4 L 506.3,430.4 L 495.3,445.9 L 479.3,447.4 L 461.8,467.4 L 437.8,468.9 L 419.3,460.4 L 401.8,467.9 L 388.3,455.4 L 391.8,431.9 L 405.3,417.4 L 418.3,398.4 Z", cx: 450, cy: 430 },
  PA: { path: "M 312.3,188.4 L 345.3,182.9 L 372.8,191.4 L 398.3,184.4 L 417.8,195.9 L 420.8,219.9 L 407.8,235.4 L 391.3,237.4 L 380.3,254.9 L 358.3,258.4 L 340.3,250.4 L 327.8,260.9 L 312.3,257.4 L 302.8,274.4 L 283.3,276.9 L 273.3,265.4 L 279.8,245.9 L 298.3,233.9 L 298.3,207.9 L 312.3,188.4 Z", cx: 350, cy: 225 },
  PB: { path: "M 533.3,306.9 L 550.8,301.4 L 565.3,307.9 L 567.8,316.9 L 556.3,319.9 L 539.8,316.4 L 533.3,306.9 Z", cx: 550, cy: 312 },
  PE: { path: "M 515.3,313.4 L 538.3,308.4 L 558.3,314.9 L 565.8,323.4 L 559.8,333.9 L 545.3,338.4 L 527.3,332.9 L 513.8,336.9 L 509.3,328.4 L 515.3,313.4 Z", cx: 537, cy: 325 },
  PI: { path: "M 469.3,261.4 L 488.3,256.9 L 502.8,266.4 L 510.3,284.9 L 505.8,304.4 L 491.3,312.4 L 477.3,307.9 L 463.3,317.4 L 451.8,307.9 L 456.3,284.9 L 469.3,261.4 Z", cx: 480, cy: 285 },
  PR: { path: "M 352.8,478.9 L 378.3,471.9 L 400.3,479.4 L 416.3,471.4 L 424.3,481.9 L 412.8,500.4 L 389.8,505.4 L 366.3,499.4 L 347.8,506.4 L 341.8,495.4 L 352.8,478.9 Z", cx: 383, cy: 490 },
  RJ: { path: "M 477.8,459.4 L 497.3,455.4 L 512.3,463.9 L 509.3,477.4 L 492.3,485.4 L 473.3,479.9 L 468.8,467.9 L 477.8,459.4 Z", cx: 490, cy: 470 },
  RN: { path: "M 545.8,280.4 L 562.3,275.9 L 571.8,284.4 L 567.3,296.9 L 553.8,299.9 L 545.3,291.9 L 545.8,280.4 Z", cx: 558, cy: 288 },
  RO: { path: "M 196.3,318.9 L 222.3,311.4 L 243.8,319.4 L 258.3,340.9 L 250.8,361.9 L 233.3,371.9 L 213.8,365.9 L 195.3,372.4 L 183.8,361.4 L 176.8,339.9 L 183.8,321.4 L 196.3,318.9 Z", cx: 218, cy: 345 },
  RR: { path: "M 227.3,138.4 L 252.3,131.9 L 273.8,143.4 L 283.3,167.9 L 273.3,189.9 L 253.8,195.4 L 234.3,183.9 L 221.8,160.4 L 227.3,138.4 Z", cx: 252, cy: 165 },
  RS: { path: "M 340.8,510.4 L 367.3,503.9 L 391.3,512.9 L 405.3,532.4 L 396.3,555.4 L 370.3,571.4 L 343.3,566.9 L 321.8,548.9 L 320.3,524.4 L 340.8,510.4 Z", cx: 362, cy: 538 },
  SC: { path: "M 389.8,505.9 L 413.3,499.4 L 428.3,509.4 L 424.8,524.4 L 408.3,532.9 L 388.3,526.9 L 381.3,514.9 L 389.8,505.9 Z", cx: 405, cy: 515 },
  SE: { path: "M 545.3,348.4 L 558.8,343.9 L 563.3,353.9 L 554.8,362.4 L 543.8,358.9 L 545.3,348.4 Z", cx: 553, cy: 353 },
  SP: { path: "M 381.3,456.9 L 410.3,449.4 L 437.8,458.9 L 460.3,450.4 L 472.8,461.4 L 465.3,479.9 L 443.3,490.4 L 418.3,485.4 L 395.3,493.9 L 378.8,483.4 L 381.3,456.9 Z", cx: 425, cy: 470 },
  TO: { path: "M 397.3,280.9 L 418.3,274.9 L 436.8,286.9 L 447.8,310.4 L 441.3,332.4 L 424.3,344.9 L 405.3,339.9 L 390.3,352.4 L 378.3,342.9 L 383.3,318.4 L 397.3,280.9 Z", cx: 413, cy: 315 },
};

function getColorForPosition(position: number): string {
  if (position === 1) return '#22c55e'; // Top 1 - verde
  if (position <= 3) return '#0A80B3'; // Top 2-3 - azul da marca
  if (position <= 5) return '#84cc16';
  if (position <= 7) return '#facc15';
  if (position <= 10) return '#f97316';
  return '#ef4444';
}

// Seed-based pseudo-random para gerar variações determinísticas por filtro
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generatePositionsForFilter(basePositions: Record<string, number>, filterSeed: number): Record<string, number> {
  const newPositions: Record<string, number> = {};
  Object.keys(basePositions).forEach((stateId, index) => {
    const seed = filterSeed + index * 7;
    const variation = Math.floor(seededRandom(seed) * 5) - 2; // -2 a +2
    let newPos = basePositions[stateId] + variation;
    // Manter dentro do range 1-10
    newPos = Math.max(1, Math.min(10, newPos));
    newPositions[stateId] = newPos;
  });
  return newPositions;
}

interface CompetitorData {
  id: string;
  name: string;
  color: string;
  positions: Record<string, number>;
}

interface SingleMapProps {
  competitor: CompetitorData;
  hoveredState: string | null;
  setHoveredState: (state: string | null) => void;
}

function SingleMap({ competitor, hoveredState, setHoveredState }: SingleMapProps) {
  return (
    <div className="relative">
      <div className="text-center mb-3">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: competitor.color }}
        >
          {competitor.name}
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox="90 120 500 470"
          className="w-full h-auto"
          style={{ maxHeight: '400px' }}
        >
          {Object.entries(brazilSVGPaths).map(([stateId, { path, cx, cy }]) => {
            const position = competitor.positions[stateId] || 10;
            const color = getColorForPosition(position);
            const isHovered = hoveredState === `${competitor.id}-${stateId}`;

            return (
              <g key={stateId}>
                <path
                  d={path}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={isHovered ? 2 : 1}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: isHovered ? 'brightness(1.15)' : 'none',
                  }}
                  onMouseEnter={() => setHoveredState(`${competitor.id}-${stateId}`)}
                  onMouseLeave={() => setHoveredState(null)}
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none select-none"
                  style={{
                    fontSize: '10px',
                    fontWeight: 'bold',
                    fill: '#fff',
                    textShadow: '0px 0px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  {stateId}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredState?.startsWith(competitor.id) && (
          <div className="absolute top-2 left-2 bg-white p-2 rounded-lg shadow-lg border border-gray-200 text-xs z-10">
            <p className="font-semibold text-[#333]">
              {brazilStates.find(s => s.id === hoveredState.split('-')[1])?.name}
            </p>
            <p className="text-gray-600">
              Posição: <span className="font-bold text-[#0A80B3]">
                {competitor.positions[hoveredState.split('-')[1]]}º
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-gray-200 p-2 rounded">
          <p className="text-gray-600">Melhor</p>
          <p className="font-bold text-green-600">
            {Math.min(...Object.values(competitor.positions))}º
          </p>
        </div>
        <div className="bg-gray-200 p-2 rounded">
          <p className="text-gray-600">Média</p>
          <p className="font-bold text-[#0A80B3]">
            {(Object.values(competitor.positions).reduce((a, b) => a + b, 0) / Object.values(competitor.positions).length).toFixed(1)}º
          </p>
        </div>
        <div className="bg-gray-200 p-2 rounded">
          <p className="text-gray-600">Pior</p>
          <p className="font-bold text-red-500">
            {Math.max(...Object.values(competitor.positions))}º
          </p>
        </div>
      </div>
    </div>
  );
}

interface BrazilMapProps {
  selectedFeature?: string;
  selectedKeyword?: string;
  selectedPositionRange?: string;
}

export default function BrazilMap({ selectedFeature = 'all', selectedKeyword = 'all', selectedPositionRange = 'all' }: BrazilMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Gerar seed baseado nos filtros selecionados
  const filterSeed = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < selectedFeature.length; i++) {
      seed += selectedFeature.charCodeAt(i) * (i + 1);
    }
    for (let i = 0; i < selectedKeyword.length; i++) {
      seed += selectedKeyword.charCodeAt(i) * (i + 1) * 2;
    }
    for (let i = 0; i < selectedPositionRange.length; i++) {
      seed += selectedPositionRange.charCodeAt(i) * (i + 1) * 3;
    }
    return seed;
  }, [selectedFeature, selectedKeyword, selectedPositionRange]);

  // Gerar dados atualizados baseado nos filtros
  const competitors = useMemo(() => {
    return baseCompetitors.map((comp, compIndex) => ({
      ...comp,
      positions: generatePositionsForFilter(comp.positions, filterSeed + compIndex * 100)
    }));
  }, [filterSeed]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-[#333] mb-2">
        Posição Média por Estado
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Compare a performance de busca em cada estado do Brasil
      </p>

      {/* Three Maps Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {competitors.map((competitor) => (
          <SingleMap
            key={competitor.id}
            competitor={competitor}
            hoveredState={hoveredState}
            setHoveredState={setHoveredState}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
          <span className="text-xs text-gray-600">Top 1</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0A80B3' }} />
          <span className="text-xs text-gray-600">2-3º</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }} />
          <span className="text-xs text-gray-600">4-5º</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#facc15' }} />
          <span className="text-xs text-gray-600">6-7º</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }} />
          <span className="text-xs text-gray-600">8-10º</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
          <span className="text-xs text-gray-600">10+º</span>
        </div>
      </div>
    </div>
  );
}
