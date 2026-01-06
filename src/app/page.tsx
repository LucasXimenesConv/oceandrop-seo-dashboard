'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import BigNumbers from '@/components/BigNumbers';
import Filters from '@/components/Filters';
import BrazilMap from '@/components/BrazilMap';
import FeatureComparisonTable from '@/components/FeatureComparisonTable';
import SerpSimulation from '@/components/SerpSimulation';
import UrlArchitecture from '@/components/UrlArchitecture';
import GEOAnalysis from '@/components/GEOAnalysis';
import Footer from '@/components/Footer';

type TabType = 'visibility' | 'architecture' | 'geo';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('visibility');
  const [selectedFeature, setSelectedFeature] = useState('all');
  const [selectedKeyword, setSelectedKeyword] = useState('all');
  const [selectedPositionRange, setSelectedPositionRange] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {activeTab === 'visibility' ? (
          <div className="space-y-8">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#333] mb-2">
                Análise de Visibilidade SEO
              </h1>
              <p className="text-gray-500">
                Visualize a performance de busca por estado e analise os resultados da SERP
              </p>
            </div>

            {/* Big Numbers Section */}
            <BigNumbers
              selectedPositionRange={selectedPositionRange}
              onPositionRangeChange={setSelectedPositionRange}
            />

            {/* Filters Section */}
            <Filters
              selectedFeature={selectedFeature}
              selectedKeyword={selectedKeyword}
              onFeatureChange={setSelectedFeature}
              onKeywordChange={setSelectedKeyword}
            />

            {/* Active Filters Display */}
            {(selectedFeature !== 'all' || selectedKeyword !== 'all' || selectedPositionRange !== 'all') && (
              <div className="flex flex-wrap gap-2">
                {selectedPositionRange !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0A80B3]/10 text-[#0A80B3] rounded-full text-sm">
                    Posição: {selectedPositionRange === 'top1' ? 'Top 1' :
                              selectedPositionRange === 'top3' ? 'Top 2-3' :
                              selectedPositionRange === 'top5' ? 'Top 4-5' :
                              selectedPositionRange === 'top10' ? 'Top 6-10' : '10+'}
                    <button
                      onClick={() => setSelectedPositionRange('all')}
                      className="ml-1 hover:text-[#065a7d]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedFeature !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0A80B3]/10 text-[#0A80B3] rounded-full text-sm">
                    Feature: {selectedFeature.replaceAll('-', ' ')}
                    <button
                      onClick={() => setSelectedFeature('all')}
                      className="ml-1 hover:text-[#065a7d]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedKeyword !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#0A80B3]/10 text-[#0A80B3] rounded-full text-sm">
                    Keyword: {selectedKeyword.replaceAll('-', ' ')}
                    <button
                      onClick={() => setSelectedKeyword('all')}
                      className="ml-1 hover:text-[#065a7d]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Brazil Map Section - 3 maps side by side */}
            <BrazilMap
              selectedFeature={selectedFeature}
              selectedKeyword={selectedKeyword}
              selectedPositionRange={selectedPositionRange}
            />

            {/* Feature Comparison Table */}
            <FeatureComparisonTable />

            {/* SERP Simulation Section */}
            <SerpSimulation />
          </div>
        ) : activeTab === 'architecture' ? (
          <UrlArchitecture />
        ) : (
          <GEOAnalysis />
        )}
      </main>

      <Footer />
    </div>
  );
}
