'use client';

import { useState } from 'react';
import { serpResults } from '@/data/mockData';

// Helper function for consistent number formatting (avoids hydration mismatch)
function formatNumber(num: number): string {
  return num.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Star Rating Component - Estilo Google
function StarRating({ rating, showNumber = true, size = 'sm' }: { rating: number; showNumber?: boolean; size?: 'sm' | 'xs' }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const sizeClass = size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${
            star <= fullStars
              ? 'text-yellow-500'
              : star === fullStars + 1 && hasHalf
                ? 'text-yellow-500'
                : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {showNumber && <span className="text-xs text-gray-600 ml-1">{rating}</span>}
    </div>
  );
}

// Google Logo
function GoogleLogo({ size = 'normal' }: { size?: 'normal' | 'small' }) {
  const fontSize = size === 'small' ? 'text-xl' : 'text-2xl';
  return (
    <div className={`${fontSize} font-medium tracking-tight`}>
      <span className="text-[#4285f4]">G</span>
      <span className="text-[#ea4335]">o</span>
      <span className="text-[#fbbc05]">o</span>
      <span className="text-[#4285f4]">g</span>
      <span className="text-[#34a853]">l</span>
      <span className="text-[#ea4335]">e</span>
    </div>
  );
}

// Search Bar
function SearchBar({ query, isMobile = false }: { query: string; isMobile?: boolean }) {
  return (
    <div className={`flex items-center ${isMobile ? 'px-3 py-2' : 'px-4 py-2.5'} bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow`}>
      <svg className="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="text-gray-800 text-sm flex-1">{query}</span>
      <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v7c0 1.66 1.34 3 3 3z"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
      </svg>
      <svg className="w-5 h-5 text-[#4285f4]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    </div>
  );
}

// Product Knowledge Panel (Desktop - lado direito)
function ProductKnowledgePanel() {
  const panel = serpResults.productKnowledgePanel;
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Header com imagem e título */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex gap-3">
          <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
            <div className="w-16 h-16 bg-gray-800 rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-base">{panel.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <StarRating rating={panel.rating} size="xs" />
              <span className="text-xs text-gray-500">{formatNumber(panel.reviews)} reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 text-xs overflow-x-auto">
        {panel.tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 font-medium whitespace-nowrap ${
              activeTab === tab
                ? 'text-[#1a73e8] border-b-2 border-[#1a73e8]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content based on tab */}
      <div className="p-4 text-sm">
        {activeTab === 'OVERVIEW' && (
          <>
            {/* Stores */}
            <div className="mb-4">
              <h4 className="text-xs text-gray-500 mb-2">Stores</h4>
              <div className="space-y-2">
                {panel.stores.map((store, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-medium text-gray-600">{store.name[0]}</span>
                      </div>
                      <span className="text-gray-900">{store.name}</span>
                      {store.label && (
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{store.label}</span>
                      )}
                    </div>
                    <span className="text-gray-900 font-medium">{store.price || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="mb-4">
              <h4 className="text-xs text-gray-500 mb-2">Details</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex">
                  <span className="text-gray-500 w-32 flex-shrink-0">Brand</span>
                  <span className="text-[#1a73e8]">{panel.details.brand}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32 flex-shrink-0">Activities Tracked</span>
                  <span className="text-gray-700 line-clamp-2">{panel.details.activitiesTracked}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32 flex-shrink-0">Color</span>
                  <span className="text-gray-700 line-clamp-1">{panel.details.color}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-32 flex-shrink-0">Connectivity</span>
                  <span className="text-[#1a73e8]">{panel.details.connectivity}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'REVIEWS' && (
          <>
            {/* User Reviews */}
            <div className="mb-4">
              <h4 className="text-xs text-gray-500 mb-2">User reviews</h4>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-4xl font-light text-gray-900">{panel.userReviews.overall}</span>
                <div className="flex-1">
                  {panel.userReviews.aspects.map((aspect, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs mb-1">
                      <span className="text-gray-600 w-20">{aspect.label}</span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1a73e8] rounded-full"
                          style={{ width: `${(aspect.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-600 w-6">{aspect.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Critic Reviews */}
            <div>
              <h4 className="text-xs text-gray-500 mb-2">Critic reviews</h4>
              <div className="space-y-3">
                {panel.criticReviews.map((review, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-[8px] font-bold text-gray-500">T</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">{review.source}</p>
                      <p className="text-xs text-gray-900 line-clamp-2">{review.snippet}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'STORES' && (
          <div className="space-y-3">
            {panel.stores.map((store, i) => (
              <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{store.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{store.name}</p>
                    {store.label && <p className="text-xs text-gray-500">{store.label}</p>}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">{store.price || '—'}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'DETAILS' && (
          <div className="space-y-2 text-xs">
            {Object.entries(panel.details).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="text-gray-500 w-32 flex-shrink-0 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span className="text-gray-700">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Searches */}
      <div className="p-4 border-t border-gray-100">
        <div className="space-y-2">
          {panel.relatedSearches.map((search, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[#1a73e8] hover:underline cursor-pointer">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {search}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Organic Result Item (Desktop)
function OrganicResult({ result, isMobile = false }: { result: typeof serpResults.organicResults[0]; isMobile?: boolean }) {
  return (
    <div className="mb-6">
      {/* Favicon + URL */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">{result.url[0].toUpperCase()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-700">{result.url}</span>
          <span className="text-xs text-gray-500">{result.breadcrumb}</span>
        </div>
      </div>

      {/* Title */}
      <a href="#" className={`block ${isMobile ? 'text-lg' : 'text-xl'} text-[#1a0dab] hover:underline leading-tight mb-1`}>
        {result.title}
        {result.isClient && (
          <span className="ml-2 text-xs bg-[#0A80B3] text-white px-2 py-0.5 rounded-full align-middle">
            Cliente
          </span>
        )}
      </a>

      {/* Rating if exists */}
      {result.rating && (
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-gray-600">{result.rating}</span>
          <StarRating rating={result.rating} showNumber={false} />
          <span className="text-sm text-gray-500">({result.reviews ? formatNumber(result.reviews) : '0'})</span>
        </div>
      )}

      {/* Description */}
      <p className={`text-sm text-gray-600 ${isMobile ? 'line-clamp-3' : 'line-clamp-2'}`}>
        {result.description}
      </p>
    </div>
  );
}

// Shopping Box / Popular Products
function PopularProducts({ isMobile = false }: { isMobile?: boolean }) {
  const product = serpResults.popularProducts[0];

  return (
    <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">{product.title}</h3>
        <div className="flex items-center gap-1">
          <StarRating rating={product.rating} size="xs" />
          <span className="text-xs text-gray-500">{formatNumber(product.reviews)} reviews</span>
        </div>
      </div>

      {/* Product Images Row */}
      <div className="flex gap-1 p-2 bg-gray-50 overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`flex-shrink-0 ${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-white rounded border border-gray-200 flex items-center justify-center`}>
            <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-gray-800 rounded-full`} />
          </div>
        ))}
      </div>

      {/* Shop now section */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-900 font-medium">Shop now</span>
          <span className="text-xs text-gray-500">color ▼</span>
        </div>

        {/* Store list */}
        <div className="space-y-2">
          {[
            { store: 'Garmin', label: 'Limited', price: '—', original: null },
            { store: 'Best Buy', label: 'Retailer', price: '$127.99', original: null },
            { store: 'Walmart', label: null, price: '$194.99', original: null },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-medium text-gray-600">{item.store[0]}</span>
                </div>
                <span className="text-[#1a73e8]">{item.store}</span>
                {item.label && (
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{item.label}</span>
                )}
              </div>
              <span className="text-gray-900">{item.price}</span>
            </div>
          ))}
        </div>

        <button className="mt-3 text-xs text-[#1a73e8] hover:underline">
          + Compare prices
        </button>
      </div>
    </div>
  );
}

// People Also Ask
function PeopleAlsoAsk({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div className="mb-6">
      <h3 className="text-lg text-gray-900 mb-3">People also ask</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {serpResults.peopleAlsoAsk.slice(0, isMobile ? 3 : 4).map((question, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer ${
              i !== 0 ? 'border-t border-gray-100' : ''
            }`}
          >
            <span className="text-sm text-gray-700">{question}</span>
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

// Desktop SERP
function DesktopSERP() {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <GoogleLogo />
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hover:underline cursor-pointer">Gmail</span>
            <span className="text-sm text-gray-600 hover:underline cursor-pointer">Imagens</span>
            <div className="w-8 h-8 bg-[#0A80B3] rounded-full flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
          </div>
        </div>
        <div className="max-w-2xl">
          <SearchBar query="Garmin vivoactive 3" />
        </div>
        <div className="flex gap-6 mt-4 text-sm border-b border-gray-200 -mb-[1px]">
          <span className="text-[#1a73e8] border-b-2 border-[#1a73e8] pb-3 cursor-pointer">Tudo</span>
          <span className="text-gray-600 hover:text-[#1a73e8] pb-3 cursor-pointer">Shopping</span>
          <span className="text-gray-600 hover:text-[#1a73e8] pb-3 cursor-pointer">Imagens</span>
          <span className="text-gray-600 hover:text-[#1a73e8] pb-3 cursor-pointer">Vídeos</span>
          <span className="text-gray-600 hover:text-[#1a73e8] pb-3 cursor-pointer">Notícias</span>
          <span className="text-gray-600 hover:text-[#1a73e8] pb-3 cursor-pointer">Mais</span>
        </div>
      </div>

      {/* Results */}
      <div className="flex">
        {/* Main Column */}
        <div className="flex-1 p-6 max-w-[652px]">
          <p className="text-xs text-gray-500 mb-4">Cerca de 15.200.000 resultados (0,38 segundos)</p>

          {/* Popular Products */}
          <PopularProducts />

          {/* Organic Results */}
          {serpResults.organicResults.map((result, i) => (
            <OrganicResult key={i} result={result} />
          ))}

          {/* People Also Ask */}
          <PeopleAlsoAsk />
        </div>

        {/* Knowledge Panel (Right Side) */}
        <div className="w-[360px] p-4 border-l border-gray-100 bg-white">
          <ProductKnowledgePanel />
        </div>
      </div>
    </div>
  );
}

// Mobile SERP
function MobileSERP() {
  const panel = serpResults.productKnowledgePanel;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 max-w-[375px] mx-auto">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <GoogleLogo size="small" />
          <div className="w-8 h-8 bg-[#0A80B3] rounded-full flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
        </div>
        <SearchBar query="Garmin vivoactive 3" isMobile />
        <div className="flex gap-4 mt-3 text-xs overflow-x-auto border-b border-gray-200 -mb-[1px]">
          <span className="text-[#1a73e8] border-b-2 border-[#1a73e8] pb-2 whitespace-nowrap">Tudo</span>
          <span className="text-gray-600 pb-2 whitespace-nowrap">Shopping</span>
          <span className="text-gray-600 pb-2 whitespace-nowrap">Imagens</span>
          <span className="text-gray-600 pb-2 whitespace-nowrap">Vídeos</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[550px] overflow-y-auto">
        {/* Product Card */}
        <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-3 flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              <div className="w-12 h-12 bg-gray-800 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm">{panel.name}</h3>
              <div className="flex items-center gap-1 mt-0.5">
                <StarRating rating={panel.rating} size="xs" />
                <span className="text-[10px] text-gray-500">{formatNumber(panel.reviews)}</span>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="flex gap-1 px-3 pb-3 overflow-x-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-14 h-14 bg-gray-100 rounded border border-gray-200 flex items-center justify-center flex-shrink-0">
                <div className="w-10 h-10 bg-gray-800 rounded-full" />
              </div>
            ))}
          </div>

          {/* Stores preview */}
          <div className="px-3 pb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Stores</span>
              <span className="text-[#1a73e8]">See more</span>
            </div>
            <div className="flex gap-2 mt-2">
              {panel.stores.slice(0, 2).map((store, i) => (
                <div key={i} className="text-xs">
                  <span className="text-gray-900">{store.name}</span>
                  <span className="text-gray-600 ml-1">{store.price || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Organic Results */}
        {serpResults.organicResults.slice(0, 2).map((result, i) => (
          <OrganicResult key={i} result={result} isMobile />
        ))}

        {/* People Also Ask */}
        <PeopleAlsoAsk isMobile />
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
        <div className="flex flex-col items-center text-[#1a73e8]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          <span className="text-[10px]">Home</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <span className="text-[10px]">Search</span>
        </div>
        <div className="flex flex-col items-center text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <span className="text-[10px]">Tabs</span>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function SerpSimulation() {
  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#333]">
            Simulação da SERP - Google
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Visualize como os resultados aparecem na busca
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView('desktop')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeView === 'desktop'
                ? 'bg-white text-[#0A80B3] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Desktop
          </button>
          <button
            onClick={() => setActiveView('mobile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeView === 'mobile'
                ? 'bg-white text-[#0A80B3] shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            Mobile
          </button>
        </div>
      </div>

      {/* SERP View */}
      <div className="overflow-x-auto">
        {activeView === 'desktop' ? <DesktopSERP /> : <MobileSERP />}
      </div>
    </div>
  );
}
