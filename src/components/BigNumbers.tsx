'use client';

import { useState } from 'react';
import { features } from '@/data/mockData';

// Dados mockados de % de 1ª posição por feature
const featureTop1Data = {
  'sponsored-products': { current: 35, total: 100 },
  'sponsored-result': { current: 42, total: 100 },
  'ai-overview': { current: 28, total: 100 },
  'featured-products': { current: 55, total: 100 },
  'people-also-ask': { current: 38, total: 100 },
  'organic-results': { current: 48, total: 100 },
  'product-knowledge-panel': { current: 62, total: 100 },
};

type FeatureId = keyof typeof featureTop1Data;

const META_PERCENTAGE = 50; // Meta: 50% dos termos em 1ª posição

const positionRanges = [
  { id: 'all', label: 'Todas', min: 1, max: 100 },
  { id: 'top1', label: 'Top 1', min: 1, max: 1 },
  { id: 'top3', label: 'Top 2-3', min: 2, max: 3 },
  { id: 'top5', label: 'Top 4-5', min: 4, max: 5 },
  { id: 'top10', label: 'Top 6-10', min: 6, max: 10 },
  { id: 'below10', label: '10+', min: 11, max: 100 },
];

interface BigNumbersProps {
  selectedPositionRange: string;
  onPositionRangeChange: (range: string) => void;
}

export default function BigNumbers({ selectedPositionRange, onPositionRangeChange }: BigNumbersProps) {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const featureList = features.filter(f => f.id !== 'all');

  // Calcular totais
  const totalTerms = featureList.reduce((acc, f) => {
    const data = featureTop1Data[f.id as FeatureId];
    return acc + (data?.total || 0);
  }, 0);

  const totalTop1 = featureList.reduce((acc, f) => {
    const data = featureTop1Data[f.id as FeatureId];
    return acc + (data?.current || 0);
  }, 0);

  const overallPercentage = Math.round((totalTop1 / totalTerms) * 100);
  const metaProgress = Math.round((overallPercentage / META_PERCENTAGE) * 100);

  // Features que atingiram a meta
  const featuresAtMeta = featureList.filter(f => {
    const data = featureTop1Data[f.id as FeatureId];
    return data && (data.current / data.total) * 100 >= META_PERCENTAGE;
  }).length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {/* Header with Position Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#333]">
            Performance Geral
          </h2>
          <p className="text-sm text-gray-500">
            Meta: Atingir 1ª posição em 50% dos termos por feature
          </p>
        </div>

        {/* Position Range Filter */}
        <div className="flex flex-wrap gap-2">
          {positionRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => onPositionRangeChange(range.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                selectedPositionRange === range.id
                  ? 'bg-[#0A80B3] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Big Numbers Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Overall Top 1 % */}
        <div className="bg-gradient-to-br from-[#0A80B3] to-[#086a94] p-4 rounded-xl text-white">
          <p className="text-sm opacity-80 mb-1">Top 1 Geral</p>
          <p className="text-3xl font-bold">{overallPercentage}%</p>
          <p className="text-xs opacity-70 mt-1">{totalTop1} de {totalTerms} termos</p>
        </div>

        {/* Meta Progress */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <p className="text-sm text-gray-500 mb-1">Progresso da Meta</p>
          <p className="text-3xl font-bold text-[#333]">{metaProgress}%</p>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(metaProgress, 100)}%`,
                backgroundColor: metaProgress >= 100 ? '#22c55e' : '#0A80B3',
              }}
            />
          </div>
        </div>

        {/* Features at Meta */}
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <p className="text-sm text-green-600 mb-1">Features na Meta</p>
          <p className="text-3xl font-bold text-green-700">{featuresAtMeta}/{featureList.length}</p>
          <p className="text-xs text-green-500 mt-1">
            {Math.round((featuresAtMeta / featureList.length) * 100)}% concluído
          </p>
        </div>

        {/* Gap to Meta */}
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
          <p className="text-sm text-orange-600 mb-1">Gap para Meta</p>
          <p className="text-3xl font-bold text-orange-700">
            {META_PERCENTAGE - overallPercentage > 0 ? `${META_PERCENTAGE - overallPercentage}%` : 'Atingida!'}
          </p>
          <p className="text-xs text-orange-500 mt-1">
            {META_PERCENTAGE - overallPercentage > 0
              ? `Faltam ${Math.round((META_PERCENTAGE - overallPercentage) / 100 * totalTerms)} termos`
              : 'Parabéns!'
            }
          </p>
        </div>
      </div>

      {/* Feature Cards with Top 1 % */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {featureList.map((feature) => {
          const data = featureTop1Data[feature.id as FeatureId];
          if (!data) return null;

          const percentage = Math.round((data.current / data.total) * 100);
          const isAtMeta = percentage >= META_PERCENTAGE;
          const isHovered = hoveredFeature === feature.id;

          return (
            <div
              key={feature.id}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                isAtMeta
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              } ${isHovered ? 'shadow-md scale-[1.02]' : ''}`}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <p className="text-xs text-gray-500 mb-1 line-clamp-2 h-8">
                {feature.name}
              </p>
              <p className={`text-2xl font-bold ${isAtMeta ? 'text-green-600' : 'text-[#333]'}`}>
                {percentage}%
              </p>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: isAtMeta ? '#22c55e' : percentage >= 40 ? '#facc15' : '#f97316',
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-gray-400">{data.current}/{data.total}</span>
                {isAtMeta && (
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Meta Line Indicator */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-green-500" />
          <span>Meta atingida (≥50%)</span>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <div className="w-3 h-0.5 bg-yellow-500" />
          <span>Próximo da meta (40-49%)</span>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <div className="w-3 h-0.5 bg-orange-500" />
          <span>Abaixo da meta (&lt;40%)</span>
        </div>
      </div>
    </div>
  );
}
