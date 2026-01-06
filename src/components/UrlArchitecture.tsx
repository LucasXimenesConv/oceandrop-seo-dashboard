'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Importar o componente 3D dinamicamente para evitar SSR
const UrlGraph3D = dynamic(() => import('./UrlGraph3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-white">Carregando visualização 3D...</div>
    </div>
  ),
});

type StatusType = 'match' | 'different' | 'missing' | 'extra';
type PriorityType = 'high' | 'medium' | 'low';

interface UrlItem {
  id: string;
  category: string;
  planned: string;
  current: string | null;
  status: StatusType;
  priority: PriorityType;
  children?: UrlItem[];
}

// Dados mockados de arquitetura de URLs
const urlArchitectureData: UrlItem[] = [
  {
    id: '1',
    category: 'Categoria Principal',
    planned: '/suplementos',
    current: '/produtos/suplementos',
    status: 'different',
    priority: 'high',
    children: [
      {
        id: '1.1',
        category: 'Spirulina',
        planned: '/suplementos/spirulina',
        current: '/produtos/suplementos/spirulina-organica',
        status: 'different',
        priority: 'high',
      },
      {
        id: '1.2',
        category: 'Chlorella',
        planned: '/suplementos/chlorella',
        current: '/produtos/suplementos/chlorella',
        status: 'match',
        priority: 'medium',
      },
      {
        id: '1.3',
        category: 'Ômega 3',
        planned: '/suplementos/omega-3',
        current: '/produtos/suplementos/omega-3-dha-epa',
        status: 'different',
        priority: 'high',
      },
    ],
  },
  {
    id: '2',
    category: 'Vitaminas',
    planned: '/vitaminas',
    current: '/produtos/vitaminas',
    status: 'different',
    priority: 'medium',
    children: [
      {
        id: '2.1',
        category: 'Vitamina D',
        planned: '/vitaminas/vitamina-d',
        current: '/produtos/vitaminas/vitamina-d3',
        status: 'different',
        priority: 'medium',
      },
      {
        id: '2.2',
        category: 'Vitamina C',
        planned: '/vitaminas/vitamina-c',
        current: '/produtos/vitaminas/vitamina-c',
        status: 'match',
        priority: 'low',
      },
      {
        id: '2.3',
        category: 'Complexo B',
        planned: '/vitaminas/complexo-b',
        current: null,
        status: 'missing',
        priority: 'high',
      },
    ],
  },
  {
    id: '3',
    category: 'Superfoods',
    planned: '/superfoods',
    current: '/produtos/super-alimentos',
    status: 'different',
    priority: 'high',
    children: [
      {
        id: '3.1',
        category: 'Açaí',
        planned: '/superfoods/acai',
        current: '/produtos/super-alimentos/acai-organico',
        status: 'different',
        priority: 'medium',
      },
      {
        id: '3.2',
        category: 'Maca Peruana',
        planned: '/superfoods/maca-peruana',
        current: '/produtos/super-alimentos/maca-peruana',
        status: 'match',
        priority: 'low',
      },
    ],
  },
  {
    id: '4',
    category: 'Blog',
    planned: '/blog',
    current: '/blog',
    status: 'match',
    priority: 'low',
    children: [
      {
        id: '4.1',
        category: 'Benefícios',
        planned: '/blog/beneficios',
        current: '/blog/categoria/beneficios',
        status: 'different',
        priority: 'medium',
      },
      {
        id: '4.2',
        category: 'Receitas',
        planned: '/blog/receitas',
        current: '/blog/categoria/receitas-saudaveis',
        status: 'different',
        priority: 'low',
      },
      {
        id: '4.3',
        category: 'Dicas de Saúde',
        planned: '/blog/dicas-saude',
        current: null,
        status: 'missing',
        priority: 'medium',
      },
    ],
  },
  {
    id: '5',
    category: 'Institucional',
    planned: '/sobre',
    current: '/quem-somos',
    status: 'different',
    priority: 'low',
    children: [
      {
        id: '5.1',
        category: 'Nossa História',
        planned: '/sobre/historia',
        current: '/quem-somos/nossa-historia',
        status: 'different',
        priority: 'low',
      },
      {
        id: '5.2',
        category: 'Sustentabilidade',
        planned: '/sobre/sustentabilidade',
        current: '/sustentabilidade',
        status: 'different',
        priority: 'medium',
      },
    ],
  },
];

type ViewMode = 'tree' | 'table' | 'comparison' | 'graph3d';

const statusConfig: Record<StatusType, { label: string; color: string; bg: string; icon: string }> = {
  match: { label: 'Conforme', color: 'text-green-700', bg: 'bg-green-100', icon: '✓' },
  different: { label: 'Diferente', color: 'text-amber-700', bg: 'bg-amber-100', icon: '≠' },
  missing: { label: 'Não existe', color: 'text-red-700', bg: 'bg-red-100', icon: '✗' },
  extra: { label: 'Extra', color: 'text-blue-700', bg: 'bg-blue-100', icon: '+' },
};

const priorityConfig: Record<PriorityType, { label: string; color: string; bg: string }> = {
  high: { label: 'Alta', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  medium: { label: 'Média', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  low: { label: 'Baixa', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
};

function TreeNode({ item, level = 0, expanded, onToggle }: {
  item: UrlItem;
  level?: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
}) {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expanded.has(item.id);
  const status = statusConfig[item.status as StatusType];
  const priority = priorityConfig[item.priority as PriorityType];

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${priority.bg} ${
          level === 0 ? 'mb-2' : 'mb-1'
        }`}
        style={{ marginLeft: `${level * 24}px` }}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={() => onToggle(item.id)}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/50 transition-colors"
          >
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
          </div>
        )}

        {/* Category Name */}
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-[#333] ${level === 0 ? 'text-base' : 'text-sm'}`}>
            {item.category}
          </p>
        </div>

        {/* URLs Comparison */}
        <div className="flex items-center gap-4 text-xs">
          {/* Planned URL */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-medium">Planejado:</span>
            <code className="px-2 py-1 bg-white rounded border border-gray-200 text-[#0A80B3] font-mono">
              {item.planned}
            </code>
          </div>

          {/* Arrow */}
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>

          {/* Current URL */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-medium">Atual:</span>
            {item.current ? (
              <code className={`px-2 py-1 rounded border font-mono ${
                item.status === 'match'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}>
                {item.current}
              </code>
            ) : (
              <span className="px-2 py-1 bg-red-50 border border-red-200 rounded text-red-600 italic">
                Não encontrado
              </span>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
          {status.icon} {status.label}
        </span>

        {/* Priority Badge */}
        <span className={`px-2 py-1 rounded text-xs font-medium border ${priority.bg} ${priority.color}`}>
          {priority.label}
        </span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ComparisonView({ data }: { data: UrlItem[] }) {
  const allItems = data.flatMap(item => [item, ...(item.children || [])]);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Planned Architecture */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#0A80B3]" />
          Arquitetura Planejada
        </h3>
        <div className="space-y-1">
          {allItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-2 p-2 rounded text-sm font-mono ${
                item.id.includes('.') ? 'ml-6' : 'font-medium'
              }`}
            >
              <span className="text-[#0A80B3]">{item.planned}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Architecture */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-[#333] mb-4 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          Arquitetura Atual (Scrapy)
        </h3>
        <div className="space-y-1">
          {allItems.map((item) => {
            const status = statusConfig[item.status as StatusType];
            return (
              <div
                key={item.id}
                className={`flex items-center gap-2 p-2 rounded text-sm font-mono ${
                  item.id.includes('.') ? 'ml-6' : 'font-medium'
                } ${status.bg}`}
              >
                {item.current ? (
                  <span className={status.color}>{item.current}</span>
                ) : (
                  <span className="text-red-500 italic">— não existe —</span>
                )}
                <span className={`ml-auto text-xs ${status.color}`}>{status.icon}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TableView({ data }: { data: UrlItem[] }) {
  const allItems = data.flatMap(item => [
    { ...item, isParent: true },
    ...(item.children || []).map(child => ({ ...child, isParent: false }))
  ]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Página</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">URL Planejada</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">URL Atual</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Status</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Prioridade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {allItems.map((item) => {
            const status = statusConfig[item.status as StatusType];
            const priority = priorityConfig[item.priority as PriorityType];
            return (
              <tr key={item.id} className={`hover:bg-gray-50 ${item.isParent ? 'bg-gray-50/50' : ''}`}>
                <td className="px-4 py-3">
                  <span className={`text-sm text-[#333] ${item.isParent ? 'font-semibold' : 'pl-4'}`}>
                    {!item.isParent && '└ '}{item.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs text-[#0A80B3] font-mono bg-blue-50 px-2 py-1 rounded">
                    {item.planned}
                  </code>
                </td>
                <td className="px-4 py-3">
                  {item.current ? (
                    <code className={`text-xs font-mono px-2 py-1 rounded ${
                      item.status === 'match' ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'
                    }`}>
                      {item.current}
                    </code>
                  ) : (
                    <span className="text-xs text-red-500 italic">Não encontrado</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${priority.bg} ${priority.color}`}>
                    {priority.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function UrlArchitecture() {
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['1', '2', '3', '4', '5']));
  const [filterStatus, setFilterStatus] = useState<StatusType | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<PriorityType | 'all'>('all');

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const expandAll = () => {
    const allIds = urlArchitectureData.flatMap(item => [item.id, ...(item.children || []).map(c => c.id)]);
    setExpanded(new Set(allIds));
  };

  const collapseAll = () => {
    setExpanded(new Set());
  };

  // Filter data
  const filteredData = urlArchitectureData.map(item => ({
    ...item,
    children: item.children?.filter(child => {
      const statusMatch = filterStatus === 'all' || child.status === filterStatus;
      const priorityMatch = filterPriority === 'all' || child.priority === filterPriority;
      return statusMatch && priorityMatch;
    })
  })).filter(item => {
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || item.priority === filterPriority;
    const hasMatchingChildren = item.children && item.children.length > 0;
    return (statusMatch && priorityMatch) || hasMatchingChildren;
  });

  // Stats
  const allItems = urlArchitectureData.flatMap(item => [item, ...(item.children || [])]);
  const stats = {
    total: allItems.length,
    match: allItems.filter(i => i.status === 'match').length,
    different: allItems.filter(i => i.status === 'different').length,
    missing: allItems.filter(i => i.status === 'missing').length,
    highPriority: allItems.filter(i => i.priority === 'high').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#333] mb-2">
          Arquitetura de URLs
        </h1>
        <p className="text-gray-500">
          Compare a estrutura planejada com a arquitetura atual encontrada via Scrapy
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500 mb-1">Total de URLs</p>
          <p className="text-2xl font-bold text-[#333]">{stats.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 mb-1">Conformes</p>
          <p className="text-2xl font-bold text-green-700">{stats.match}</p>
          <p className="text-xs text-green-500">{Math.round(stats.match / stats.total * 100)}%</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-600 mb-1">Diferentes</p>
          <p className="text-2xl font-bold text-amber-700">{stats.different}</p>
          <p className="text-xs text-amber-500">{Math.round(stats.different / stats.total * 100)}%</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 mb-1">Não existem</p>
          <p className="text-2xl font-bold text-red-700">{stats.missing}</p>
          <p className="text-xs text-red-500">{Math.round(stats.missing / stats.total * 100)}%</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-600 mb-1">Alta Prioridade</p>
          <p className="text-2xl font-bold text-orange-700">{stats.highPriority}</p>
          <p className="text-xs text-orange-500">pendentes</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* View Mode */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Visualização:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'tree' ? 'bg-white shadow text-[#0A80B3]' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Árvore
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'table' ? 'bg-white shadow text-[#0A80B3]' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Tabela
              </button>
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'comparison' ? 'bg-white shadow text-[#0A80B3]' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Comparação
              </button>
              <button
                onClick={() => setViewMode('graph3d')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  viewMode === 'graph3d' ? 'bg-white shadow text-[#0A80B3]' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Grafo 3D
              </button>
            </div>
          </div>

          {/* Filters - hide in 3D mode */}
          {viewMode !== 'graph3d' && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as StatusType | 'all')}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A80B3]/20"
                >
                  <option value="all">Todos</option>
                  <option value="match">Conformes</option>
                  <option value="different">Diferentes</option>
                  <option value="missing">Não existem</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Prioridade:</span>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as PriorityType | 'all')}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A80B3]/20"
                >
                  <option value="all">Todas</option>
                  <option value="high">Alta</option>
                  <option value="medium">Média</option>
                  <option value="low">Baixa</option>
                </select>
              </div>
            </div>
          )}

          {/* Expand/Collapse */}
          {viewMode === 'tree' && (
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="text-sm text-[#0A80B3] hover:underline"
              >
                Expandir tudo
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={collapseAll}
                className="text-sm text-[#0A80B3] hover:underline"
              >
                Recolher tudo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        {viewMode === 'tree' && (
          <div className="space-y-2">
            {filteredData.map((item) => (
              <TreeNode
                key={item.id}
                item={item}
                expanded={expanded}
                onToggle={toggleExpand}
              />
            ))}
          </div>
        )}

        {viewMode === 'table' && <TableView data={filteredData} />}

        {viewMode === 'comparison' && <ComparisonView data={filteredData} />}

        {viewMode === 'graph3d' && <UrlGraph3D />}
      </div>

      {/* Legend - hide in 3D mode (has its own legend) */}
      {viewMode !== 'graph3d' && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Legenda</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 font-medium">Status:</span>
              {Object.entries(statusConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${config.bg} ${config.color}`}>
                    {config.icon}
                  </span>
                  <span className="text-xs text-gray-600">{config.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 font-medium">Prioridade:</span>
              {Object.entries(priorityConfig).map(([key, config]) => (
                <div key={key} className="flex items-center gap-1">
                  <span className={`px-2 py-0.5 rounded text-xs border ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
