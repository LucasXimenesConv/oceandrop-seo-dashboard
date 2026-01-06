'use client';

import Image from 'next/image';

interface HeaderProps {
  activeTab: 'visibility' | 'architecture' | 'geo';
  onTabChange: (tab: 'visibility' | 'architecture' | 'geo') => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Image
              src="/logo-ocean-drop.png"
              alt="Ocean Drop Logo"
              width={150}
              height={50}
              className="object-contain"
              priority
            />
            <div className="hidden md:block h-8 w-px bg-gray-200" />
            <h1 className="hidden md:block text-lg font-semibold text-[#333]">
              SEO Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Protótipo</span>
            <span className="px-3 py-1 bg-[#0A80B3] text-white text-xs font-medium rounded-full">
              Beta
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-1">
          <button
            onClick={() => onTabChange('visibility')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'visibility'
                ? 'border-[#0A80B3] text-[#0A80B3]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Visibilidade SEO
            </span>
          </button>
          <button
            onClick={() => onTabChange('architecture')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'architecture'
                ? 'border-[#0A80B3] text-[#0A80B3]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Arquitetura de URLs
            </span>
          </button>
          <button
            onClick={() => onTabChange('geo')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'geo'
                ? 'border-[#0A80B3] text-[#0A80B3]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              GEO Analysis
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
