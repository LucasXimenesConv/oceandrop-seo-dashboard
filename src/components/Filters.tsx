'use client';

import { features, keywords } from '@/data/mockData';

interface FiltersProps {
  selectedFeature: string;
  selectedKeyword: string;
  onFeatureChange: (feature: string) => void;
  onKeywordChange: (keyword: string) => void;
}

export default function Filters({
  selectedFeature,
  selectedKeyword,
  onFeatureChange,
  onKeywordChange,
}: FiltersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature Filter */}
        <div>
          <label
            htmlFor="feature-filter"
            className="block text-sm font-semibold text-[#333] mb-2"
          >
            Filtrar por Feature
          </label>
          <select
            id="feature-filter"
            value={selectedFeature}
            onChange={(e) => onFeatureChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A80B3] focus:border-transparent bg-white text-[#333] cursor-pointer transition-all hover:border-[#0A80B3]"
          >
            {features.map((feature) => (
              <option key={feature.id} value={feature.id}>
                {feature.name}
              </option>
            ))}
          </select>
        </div>

        {/* Keyword Filter */}
        <div>
          <label
            htmlFor="keyword-filter"
            className="block text-sm font-semibold text-[#333] mb-2"
          >
            Filtrar por Palavra-chave
          </label>
          <select
            id="keyword-filter"
            value={selectedKeyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A80B3] focus:border-transparent bg-white text-[#333] cursor-pointer transition-all hover:border-[#0A80B3]"
          >
            {keywords.map((keyword) => (
              <option key={keyword.id} value={keyword.id}>
                {keyword.type === 'cluster' ? `📁 ${keyword.name}` :
                 keyword.type === 'keyword' ? `🔑 ${keyword.name}` :
                 keyword.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
