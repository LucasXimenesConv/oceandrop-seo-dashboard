'use client';

import { useState } from 'react';

// Mock data for prompts and AI responses
const mockPrompts = [
  {
    id: '1',
    prompt: 'Qual o melhor suplemento de spirulina do Brasil?',
    date: '2024-01-15',
    responses: [
      {
        model: 'ChatGPT',
        response: 'A Ocean Drop é considerada uma das melhores marcas de spirulina no Brasil, conhecida pela qualidade e pureza dos seus produtos. Outras marcas populares incluem a Puravida e a Essential Nutrition.',
        clientMentioned: true,
        competitorsMentioned: ['Puravida', 'Essential Nutrition'],
        linksFound: [
          { url: 'https://oceandrop.com.br/spirulina', type: 'client' },
          { url: 'https://exame.com/saude/melhores-spirulinas', type: 'press' },
        ]
      },
      {
        model: 'Perplexity',
        response: 'Entre as melhores spirulinas brasileiras, destacam-se Ocean Drop, Puravida e Now Foods. A Ocean Drop se destaca pela certificação orgânica e processo de cultivo sustentável.',
        clientMentioned: true,
        competitorsMentioned: ['Puravida', 'Now Foods'],
        linksFound: [
          { url: 'https://oceandrop.com.br/spirulina', type: 'client' },
          { url: 'https://forbes.com.br/suplementos-naturais', type: 'press' },
          { url: 'https://puravida.com.br/spirulina', type: 'competitor' },
        ]
      },
      {
        model: 'Google AI',
        response: 'As melhores marcas de spirulina no Brasil incluem Now Foods, Vitafor e Essential Nutrition, conhecidas pela qualidade e certificações.',
        clientMentioned: false,
        competitorsMentioned: ['Now Foods', 'Vitafor', 'Essential Nutrition'],
        linksFound: [
          { url: 'https://vitafor.com.br', type: 'competitor' },
        ]
      }
    ]
  },
  {
    id: '2',
    prompt: 'Onde comprar chlorella de qualidade?',
    date: '2024-01-14',
    responses: [
      {
        model: 'ChatGPT',
        response: 'Para chlorella de qualidade, recomendo verificar a Ocean Drop, que oferece chlorella orgânica certificada. Também vale conferir lojas especializadas como a Mundo Verde.',
        clientMentioned: true,
        competitorsMentioned: ['Mundo Verde'],
        linksFound: [
          { url: 'https://oceandrop.com.br/chlorella', type: 'client' },
        ]
      },
      {
        model: 'Perplexity',
        response: 'Chlorella de qualidade pode ser encontrada em marcas como Puravida, Ocean Drop e Essential Nutrition. Verifique sempre a certificação de pureza.',
        clientMentioned: true,
        competitorsMentioned: ['Puravida', 'Essential Nutrition'],
        linksFound: [
          { url: 'https://oceandrop.com.br/chlorella', type: 'client' },
          { url: 'https://veja.abril.com.br/saude/chlorella-beneficios', type: 'press' },
        ]
      },
      {
        model: 'Google AI',
        response: 'A chlorella pode ser adquirida em farmácias de manipulação, lojas de produtos naturais e e-commerces especializados como iHerb e Amazon.',
        clientMentioned: false,
        competitorsMentioned: ['iHerb', 'Amazon'],
        linksFound: []
      }
    ]
  },
  {
    id: '3',
    prompt: 'Benefícios da spirulina para saúde',
    date: '2024-01-13',
    responses: [
      {
        model: 'ChatGPT',
        response: 'A spirulina oferece diversos benefícios: rica em proteínas, vitaminas B, ferro e antioxidantes. Ajuda na imunidade, energia e desintoxicação do organismo.',
        clientMentioned: false,
        competitorsMentioned: [],
        linksFound: [
          { url: 'https://healthline.com/spirulina-benefits', type: 'external' },
        ]
      },
      {
        model: 'Perplexity',
        response: 'Segundo estudos, a spirulina é um superalimento com alto teor proteico. A Ocean Drop destaca que sua spirulina possui 60% de proteína biodisponível.',
        clientMentioned: true,
        competitorsMentioned: [],
        linksFound: [
          { url: 'https://oceandrop.com.br/blog/beneficios-spirulina', type: 'client' },
          { url: 'https://ncbi.nlm.nih.gov/spirulina-study', type: 'external' },
        ]
      },
      {
        model: 'Google AI',
        response: 'A spirulina é conhecida por seus benefícios nutricionais, incluindo proteínas, vitaminas e minerais essenciais para a saúde.',
        clientMentioned: false,
        competitorsMentioned: [],
        linksFound: []
      }
    ]
  }
];

// Mock data for tracked URLs
const trackedUrls = [
  // Client URLs
  { id: '1', url: 'https://oceandrop.com.br/spirulina', type: 'client', category: 'Produto', appearances: 8, lastSeen: '2024-01-15' },
  { id: '2', url: 'https://oceandrop.com.br/chlorella', type: 'client', category: 'Produto', appearances: 5, lastSeen: '2024-01-14' },
  { id: '3', url: 'https://oceandrop.com.br/blog/beneficios-spirulina', type: 'client', category: 'Blog', appearances: 3, lastSeen: '2024-01-13' },
  { id: '4', url: 'https://oceandrop.com.br/sobre', type: 'client', category: 'Institucional', appearances: 2, lastSeen: '2024-01-12' },
  // Press URLs (assessoria)
  { id: '5', url: 'https://exame.com/saude/melhores-spirulinas', type: 'press', category: 'Assessoria', appearances: 4, lastSeen: '2024-01-15' },
  { id: '6', url: 'https://forbes.com.br/suplementos-naturais', type: 'press', category: 'Assessoria', appearances: 3, lastSeen: '2024-01-14' },
  { id: '7', url: 'https://veja.abril.com.br/saude/chlorella-beneficios', type: 'press', category: 'Assessoria', appearances: 2, lastSeen: '2024-01-13' },
  { id: '8', url: 'https://g1.globo.com/bem-estar/superalimentos', type: 'press', category: 'Assessoria', appearances: 1, lastSeen: '2024-01-10' },
  // Competitor URLs
  { id: '9', url: 'https://puravida.com.br/spirulina', type: 'competitor', category: 'Concorrente', appearances: 6, lastSeen: '2024-01-15' },
  { id: '10', url: 'https://vitafor.com.br', type: 'competitor', category: 'Concorrente', appearances: 4, lastSeen: '2024-01-14' },
  { id: '11', url: 'https://essentialnutrition.com.br', type: 'competitor', category: 'Concorrente', appearances: 3, lastSeen: '2024-01-13' },
];

type ViewMode = 'prompts' | 'urls' | 'analytics';

export default function GEOAnalysis() {
  const [viewMode, setViewMode] = useState<ViewMode>('prompts');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState('');
  const [urlFilter, setUrlFilter] = useState<'all' | 'client' | 'press' | 'competitor'>('all');

  // Calculate analytics
  const totalResponses = mockPrompts.reduce((acc, p) => acc + p.responses.length, 0);
  const clientMentions = mockPrompts.reduce((acc, p) =>
    acc + p.responses.filter(r => r.clientMentioned).length, 0);
  const mentionRate = Math.round((clientMentions / totalResponses) * 100);

  const linkAppearances = trackedUrls.reduce((acc, u) => acc + u.appearances, 0);
  const clientLinkAppearances = trackedUrls
    .filter(u => u.type === 'client')
    .reduce((acc, u) => acc + u.appearances, 0);

  const filteredUrls = urlFilter === 'all'
    ? trackedUrls
    : trackedUrls.filter(u => u.type === urlFilter);

  const handleAddPrompt = () => {
    if (newPrompt.trim()) {
      alert(`Prompt adicionado: "${newPrompt}"\n\nEm produção, isso dispararia análises nos modelos de IA.`);
      setNewPrompt('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#333] mb-2">
          GEO Analysis - Generative Engine Optimization
        </h1>
        <p className="text-gray-500">
          Monitore menções da marca e links em respostas de IA generativa
        </p>
      </div>

      {/* Big Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-[#0A80B3]">{mentionRate}%</div>
          <div className="text-sm text-gray-500">Taxa de Menção</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">{clientMentions}/{totalResponses}</div>
          <div className="text-sm text-gray-500">Menções Cliente</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-amber-600">{clientLinkAppearances}</div>
          <div className="text-sm text-gray-500">Links Cliente Citados</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">{mockPrompts.length}</div>
          <div className="text-sm text-gray-500">Prompts Monitorados</div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
        <button
          onClick={() => setViewMode('prompts')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'prompts'
              ? 'bg-[#0A80B3] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Prompts & Respostas
          </span>
        </button>
        <button
          onClick={() => setViewMode('urls')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'urls'
              ? 'bg-[#0A80B3] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            URLs Monitoradas
          </span>
        </button>
        <button
          onClick={() => setViewMode('analytics')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            viewMode === 'analytics'
              ? 'bg-[#0A80B3] text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </span>
        </button>
      </div>

      {/* Prompts View */}
      {viewMode === 'prompts' && (
        <div className="space-y-4">
          {/* Add New Prompt */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-3">Adicionar Novo Prompt</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Digite um prompt para monitorar nas IAs..."
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A80B3]/20 focus:border-[#0A80B3]"
              />
              <button
                onClick={handleAddPrompt}
                className="px-4 py-2 bg-[#0A80B3] text-white rounded-lg hover:bg-[#086a94] transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Prompts List */}
          <div className="space-y-4">
            {mockPrompts.map((prompt) => (
              <div key={prompt.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                {/* Prompt Header */}
                <button
                  onClick={() => setSelectedPrompt(selectedPrompt === prompt.id ? null : prompt.id)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{prompt.prompt}</div>
                      <div className="text-xs text-gray-500">{prompt.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Quick Stats */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prompt.responses.filter(r => r.clientMentioned).length === prompt.responses.length
                          ? 'bg-green-100 text-green-700'
                          : prompt.responses.filter(r => r.clientMentioned).length > 0
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {prompt.responses.filter(r => r.clientMentioned).length}/{prompt.responses.length} menções
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${selectedPrompt === prompt.id ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Responses */}
                {selectedPrompt === prompt.id && (
                  <div className="border-t border-gray-100">
                    {prompt.responses.map((response, idx) => (
                      <div key={idx} className={`p-4 ${idx > 0 ? 'border-t border-gray-100' : ''}`}>
                        {/* Model Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              response.model === 'ChatGPT' ? 'bg-emerald-100 text-emerald-700' :
                              response.model === 'Perplexity' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {response.model}
                            </span>
                            {response.clientMentioned ? (
                              <span className="flex items-center gap-1 text-xs text-green-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Cliente mencionado
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-xs text-red-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Não mencionado
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Response Text */}
                        <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">
                          {response.response}
                        </p>

                        {/* Competitors & Links */}
                        <div className="flex flex-wrap gap-4 text-xs">
                          {response.competitorsMentioned.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">Concorrentes:</span>
                              {response.competitorsMentioned.map((comp, i) => (
                                <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 rounded">
                                  {comp}
                                </span>
                              ))}
                            </div>
                          )}
                          {response.linksFound.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-gray-500">Links:</span>
                              {response.linksFound.map((link, i) => (
                                <span
                                  key={i}
                                  className={`px-2 py-0.5 rounded truncate max-w-[200px] ${
                                    link.type === 'client' ? 'bg-green-50 text-green-600' :
                                    link.type === 'press' ? 'bg-blue-50 text-blue-600' :
                                    link.type === 'competitor' ? 'bg-red-50 text-red-600' :
                                    'bg-gray-50 text-gray-600'
                                  }`}
                                  title={link.url}
                                >
                                  {link.url.replace('https://', '').split('/')[0]}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* URLs View */}
      {viewMode === 'urls' && (
        <div className="space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {(['all', 'client', 'press', 'competitor'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setUrlFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  urlFilter === filter
                    ? filter === 'client' ? 'bg-green-100 text-green-700' :
                      filter === 'press' ? 'bg-blue-100 text-blue-700' :
                      filter === 'competitor' ? 'bg-red-100 text-red-700' :
                      'bg-[#0A80B3] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filter === 'all' ? 'Todas' :
                 filter === 'client' ? 'Cliente' :
                 filter === 'press' ? 'Assessoria' : 'Concorrentes'}
                <span className="ml-2 text-xs opacity-70">
                  ({filter === 'all' ? trackedUrls.length : trackedUrls.filter(u => u.type === filter).length})
                </span>
              </button>
            ))}
          </div>

          {/* URLs Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aparições</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última vez</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUrls.map((url) => (
                  <tr key={url.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          url.type === 'client' ? 'bg-green-500' :
                          url.type === 'press' ? 'bg-blue-500' : 'bg-red-500'
                        }`} />
                        <span className="text-sm text-gray-900 truncate max-w-[300px]" title={url.url}>
                          {url.url}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        url.type === 'client' ? 'bg-green-100 text-green-700' :
                        url.type === 'press' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {url.type === 'client' ? 'Cliente' :
                         url.type === 'press' ? 'Assessoria' : 'Concorrente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{url.category}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                        {url.appearances}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{url.lastSeen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add URL Button */}
          <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#0A80B3] hover:text-[#0A80B3] transition-colors">
            + Adicionar URL para monitorar
          </button>
        </div>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          {/* Mention Rate by Model */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">Taxa de Menção por Modelo de IA</h3>
            <div className="space-y-4">
              {['ChatGPT', 'Perplexity', 'Google AI'].map((model) => {
                const modelResponses = mockPrompts.flatMap(p => p.responses.filter(r => r.model === model));
                const modelMentions = modelResponses.filter(r => r.clientMentioned).length;
                const rate = modelResponses.length > 0 ? Math.round((modelMentions / modelResponses.length) * 100) : 0;

                return (
                  <div key={model} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-700">{model}</div>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          model === 'ChatGPT' ? 'bg-emerald-500' :
                          model === 'Perplexity' ? 'bg-blue-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm font-medium text-gray-700 text-right">{rate}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Link Type Distribution */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4">Distribuição de Links por Tipo</h3>
              <div className="space-y-3">
                {[
                  { type: 'Cliente', color: 'bg-green-500', count: trackedUrls.filter(u => u.type === 'client').reduce((a, u) => a + u.appearances, 0) },
                  { type: 'Assessoria', color: 'bg-blue-500', count: trackedUrls.filter(u => u.type === 'press').reduce((a, u) => a + u.appearances, 0) },
                  { type: 'Concorrente', color: 'bg-red-500', count: trackedUrls.filter(u => u.type === 'competitor').reduce((a, u) => a + u.appearances, 0) },
                ].map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm text-gray-700">{item.type}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.count} aparições</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-4">Top Concorrentes Mencionados</h3>
              <div className="space-y-3">
                {['Puravida', 'Essential Nutrition', 'Now Foods', 'Vitafor'].map((comp, i) => {
                  const mentions = mockPrompts.flatMap(p => p.responses).filter(r => r.competitorsMentioned.includes(comp)).length;
                  return (
                    <div key={comp} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center font-medium">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-700">{comp}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{mentions} menções</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-[#0A80B3]/10 to-[#0A80B3]/5 p-6 rounded-lg border border-[#0A80B3]/20">
            <h3 className="font-medium text-[#0A80B3] mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Recomendações GEO
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Google AI tem menor taxa de menção - investir em conteúdo estruturado (Schema.org)
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Puravida aparece mais que o cliente - criar conteúdo comparativo direto
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Links de assessoria com boa performance - expandir parcerias editoriais
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
