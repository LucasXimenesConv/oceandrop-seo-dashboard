'use client';

import { features } from '@/data/mockData';

// Dados mockados de posição por feature para cada competidor
const featurePositions = {
  'sponsored-products': { client: 2, competitorA: 4, competitorB: 3 },
  'sponsored-result': { client: 1, competitorA: 3, competitorB: 5 },
  'ai-overview': { client: 3, competitorA: 2, competitorB: 4 },
  'featured-products': { client: 1, competitorA: 2, competitorB: 6 },
  'people-also-ask': { client: 4, competitorA: 4, competitorB: 2 },
  'organic-results': { client: 1, competitorA: 5, competitorB: 3 },
  'product-knowledge-panel': { client: 2, competitorA: 1, competitorB: 4 },
};

type FeatureId = keyof typeof featurePositions;

function getComparisonColor(clientPos: number, competitorPos: number): { bg: string; text: string; label: string } {
  if (clientPos < competitorPos) {
    // Cliente está melhor (posição menor = melhor)
    return { bg: 'bg-green-100', text: 'text-green-700', label: 'Acima' };
  } else if (clientPos === competitorPos) {
    // Empate
    return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Igual' };
  } else {
    // Cliente está pior
    return { bg: 'bg-red-100', text: 'text-red-700', label: 'Abaixo' };
  }
}

function PositionCell({ position, clientPosition }: { position: number; clientPosition?: number }) {
  const isClient = clientPosition === undefined;
  const comparison = !isClient ? getComparisonColor(clientPosition!, position) : null;

  return (
    <td className={`px-4 py-3 text-center ${comparison ? comparison.bg : ''}`}>
      <div className="flex flex-col items-center">
        <span className={`font-bold text-lg ${comparison ? comparison.text : 'text-[#0A80B3]'}`}>
          {position}º
        </span>
        {comparison && (
          <span className={`text-xs ${comparison.text} mt-0.5`}>
            {comparison.label}
          </span>
        )}
      </div>
    </td>
  );
}

export default function FeatureComparisonTable() {
  const featureList = features.filter(f => f.id !== 'all');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-[#333] mb-2">
        Comparativo de Posição por Feature
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Compare a posição do cliente com os concorrentes em cada feature da SERP
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
          <span className="text-xs text-gray-600">Cliente acima do concorrente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200" />
          <span className="text-xs text-gray-600">Mesma posição</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 border border-red-200" />
          <span className="text-xs text-gray-600">Cliente abaixo do concorrente</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-[#333]">
                Feature
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-white bg-[#0A80B3] rounded-t-lg">
                Ocean Drop
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-[#333]">
                Concorrente A
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-[#333]">
                Concorrente B
              </th>
            </tr>
          </thead>
          <tbody>
            {featureList.map((feature, index) => {
              const positions = featurePositions[feature.id as FeatureId];
              if (!positions) return null;

              return (
                <tr
                  key={feature.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#333]">
                        {feature.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center bg-[#0A80B3]/5">
                    <span className="font-bold text-lg text-[#0A80B3]">
                      {positions.client}º
                    </span>
                  </td>
                  <PositionCell
                    position={positions.competitorA}
                    clientPosition={positions.client}
                  />
                  <PositionCell
                    position={positions.competitorB}
                    clientPosition={positions.client}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">
              {featureList.filter(f => {
                const pos = featurePositions[f.id as FeatureId];
                return pos && pos.client < pos.competitorA && pos.client < pos.competitorB;
              }).length}
            </p>
            <p className="text-sm text-green-700">Features em 1º lugar geral</p>
          </div>
          <div className="bg-[#0A80B3]/10 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-[#0A80B3]">
              {(featureList.reduce((acc, f) => {
                const pos = featurePositions[f.id as FeatureId];
                return acc + (pos ? pos.client : 0);
              }, 0) / featureList.length).toFixed(1)}º
            </p>
            <p className="text-sm text-[#0A80B3]">Posição média do cliente</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-700">
              {featureList.filter(f => {
                const pos = featurePositions[f.id as FeatureId];
                return pos && (pos.client <= pos.competitorA || pos.client <= pos.competitorB);
              }).length}/{featureList.length}
            </p>
            <p className="text-sm text-gray-600">Features competitivas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
