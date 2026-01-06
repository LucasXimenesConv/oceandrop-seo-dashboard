'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Importar dinamicamente para evitar SSR issues
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-900 rounded-lg flex items-center justify-center">
      <div className="text-white">Carregando visualização 3D...</div>
    </div>
  ),
});

// Tipos
interface GraphNode {
  id: string;
  name: string;
  url: string;
  type: 'root' | 'category' | 'subcategory' | 'page' | 'external';
  status: 'match' | 'different' | 'missing' | 'ok';
  depth: number;
  group: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'internal' | 'external';
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Dados do grafo baseado na arquitetura
const generateGraphData = (): GraphData => {
  const nodes: GraphNode[] = [
    // Root
    { id: 'root', name: 'oceandrop.com.br', url: '/', type: 'root', status: 'ok', depth: 0, group: 0 },

    // Categorias principais
    { id: 'suplementos', name: 'Suplementos', url: '/suplementos', type: 'category', status: 'different', depth: 1, group: 1 },
    { id: 'vitaminas', name: 'Vitaminas', url: '/vitaminas', type: 'category', status: 'different', depth: 1, group: 2 },
    { id: 'superfoods', name: 'Superfoods', url: '/superfoods', type: 'category', status: 'different', depth: 1, group: 3 },
    { id: 'blog', name: 'Blog', url: '/blog', type: 'category', status: 'match', depth: 1, group: 4 },
    { id: 'sobre', name: 'Sobre', url: '/sobre', type: 'category', status: 'different', depth: 1, group: 5 },

    // Suplementos - Subcategorias
    { id: 'spirulina', name: 'Spirulina', url: '/suplementos/spirulina', type: 'subcategory', status: 'different', depth: 2, group: 1 },
    { id: 'chlorella', name: 'Chlorella', url: '/suplementos/chlorella', type: 'subcategory', status: 'match', depth: 2, group: 1 },
    { id: 'omega3', name: 'Ômega 3', url: '/suplementos/omega-3', type: 'subcategory', status: 'different', depth: 2, group: 1 },
    { id: 'colageno', name: 'Colágeno', url: '/suplementos/colageno', type: 'subcategory', status: 'match', depth: 2, group: 1 },
    { id: 'proteinas', name: 'Proteínas', url: '/suplementos/proteinas', type: 'subcategory', status: 'different', depth: 2, group: 1 },

    // Vitaminas - Subcategorias
    { id: 'vitd', name: 'Vitamina D', url: '/vitaminas/vitamina-d', type: 'subcategory', status: 'different', depth: 2, group: 2 },
    { id: 'vitc', name: 'Vitamina C', url: '/vitaminas/vitamina-c', type: 'subcategory', status: 'match', depth: 2, group: 2 },
    { id: 'complexob', name: 'Complexo B', url: '/vitaminas/complexo-b', type: 'subcategory', status: 'missing', depth: 2, group: 2 },
    { id: 'vite', name: 'Vitamina E', url: '/vitaminas/vitamina-e', type: 'subcategory', status: 'match', depth: 2, group: 2 },

    // Superfoods - Subcategorias
    { id: 'acai', name: 'Açaí', url: '/superfoods/acai', type: 'subcategory', status: 'different', depth: 2, group: 3 },
    { id: 'maca', name: 'Maca Peruana', url: '/superfoods/maca-peruana', type: 'subcategory', status: 'match', depth: 2, group: 3 },
    { id: 'cacau', name: 'Cacau', url: '/superfoods/cacau', type: 'subcategory', status: 'match', depth: 2, group: 3 },
    { id: 'chia', name: 'Chia', url: '/superfoods/chia', type: 'subcategory', status: 'different', depth: 2, group: 3 },

    // Blog - Subcategorias
    { id: 'beneficios', name: 'Benefícios', url: '/blog/beneficios', type: 'subcategory', status: 'different', depth: 2, group: 4 },
    { id: 'receitas', name: 'Receitas', url: '/blog/receitas', type: 'subcategory', status: 'different', depth: 2, group: 4 },
    { id: 'dicas', name: 'Dicas de Saúde', url: '/blog/dicas-saude', type: 'subcategory', status: 'missing', depth: 2, group: 4 },

    // Sobre - Subcategorias
    { id: 'historia', name: 'Nossa História', url: '/sobre/historia', type: 'subcategory', status: 'different', depth: 2, group: 5 },
    { id: 'sustentabilidade', name: 'Sustentabilidade', url: '/sobre/sustentabilidade', type: 'subcategory', status: 'different', depth: 2, group: 5 },

    // Páginas de produto (exemplos)
    { id: 'spirulina-tabs', name: 'Spirulina Tabs', url: '/suplementos/spirulina/tabs-500mg', type: 'page', status: 'match', depth: 3, group: 1 },
    { id: 'spirulina-po', name: 'Spirulina Pó', url: '/suplementos/spirulina/po-organico', type: 'page', status: 'match', depth: 3, group: 1 },
    { id: 'chlorella-caps', name: 'Chlorella Cápsulas', url: '/suplementos/chlorella/capsulas', type: 'page', status: 'match', depth: 3, group: 1 },
    { id: 'omega3-dha', name: 'Ômega 3 DHA', url: '/suplementos/omega-3/dha-concentrado', type: 'page', status: 'different', depth: 3, group: 1 },

    // Links externos (exemplo)
    { id: 'instagram', name: 'Instagram', url: 'https://instagram.com/oceandrop', type: 'external', status: 'ok', depth: 2, group: 6 },
    { id: 'youtube', name: 'YouTube', url: 'https://youtube.com/oceandrop', type: 'external', status: 'ok', depth: 2, group: 6 },
  ];

  const links: GraphLink[] = [
    // Root -> Categorias
    { source: 'root', target: 'suplementos', type: 'internal' },
    { source: 'root', target: 'vitaminas', type: 'internal' },
    { source: 'root', target: 'superfoods', type: 'internal' },
    { source: 'root', target: 'blog', type: 'internal' },
    { source: 'root', target: 'sobre', type: 'internal' },

    // Suplementos -> Subcategorias
    { source: 'suplementos', target: 'spirulina', type: 'internal' },
    { source: 'suplementos', target: 'chlorella', type: 'internal' },
    { source: 'suplementos', target: 'omega3', type: 'internal' },
    { source: 'suplementos', target: 'colageno', type: 'internal' },
    { source: 'suplementos', target: 'proteinas', type: 'internal' },

    // Vitaminas -> Subcategorias
    { source: 'vitaminas', target: 'vitd', type: 'internal' },
    { source: 'vitaminas', target: 'vitc', type: 'internal' },
    { source: 'vitaminas', target: 'complexob', type: 'internal' },
    { source: 'vitaminas', target: 'vite', type: 'internal' },

    // Superfoods -> Subcategorias
    { source: 'superfoods', target: 'acai', type: 'internal' },
    { source: 'superfoods', target: 'maca', type: 'internal' },
    { source: 'superfoods', target: 'cacau', type: 'internal' },
    { source: 'superfoods', target: 'chia', type: 'internal' },

    // Blog -> Subcategorias
    { source: 'blog', target: 'beneficios', type: 'internal' },
    { source: 'blog', target: 'receitas', type: 'internal' },
    { source: 'blog', target: 'dicas', type: 'internal' },

    // Sobre -> Subcategorias
    { source: 'sobre', target: 'historia', type: 'internal' },
    { source: 'sobre', target: 'sustentabilidade', type: 'internal' },

    // Spirulina -> Produtos
    { source: 'spirulina', target: 'spirulina-tabs', type: 'internal' },
    { source: 'spirulina', target: 'spirulina-po', type: 'internal' },

    // Chlorella -> Produtos
    { source: 'chlorella', target: 'chlorella-caps', type: 'internal' },

    // Omega 3 -> Produtos
    { source: 'omega3', target: 'omega3-dha', type: 'internal' },

    // Links externos
    { source: 'root', target: 'instagram', type: 'external' },
    { source: 'root', target: 'youtube', type: 'external' },

    // Cross-links entre categorias (internal linking)
    { source: 'spirulina', target: 'chlorella', type: 'internal' },
    { source: 'vitd', target: 'omega3', type: 'internal' },
    { source: 'beneficios', target: 'spirulina', type: 'internal' },
    { source: 'beneficios', target: 'vitd', type: 'internal' },
    { source: 'receitas', target: 'acai', type: 'internal' },
    { source: 'receitas', target: 'cacau', type: 'internal' },
  ];

  return { nodes, links };
};

// Cores por tipo/status
const getNodeColor = (node: GraphNode): string => {
  // Por status
  if (node.status === 'missing') return '#ef4444'; // vermelho
  if (node.status === 'different') return '#f59e0b'; // âmbar
  if (node.status === 'match') return '#22c55e'; // verde

  // Por tipo
  if (node.type === 'root') return '#0A80B3';
  if (node.type === 'external') return '#8b5cf6'; // roxo

  return '#6b7280'; // cinza
};

const getNodeSize = (node: GraphNode): number => {
  switch (node.type) {
    case 'root': return 12;
    case 'category': return 8;
    case 'subcategory': return 5;
    case 'page': return 3;
    case 'external': return 4;
    default: return 4;
  }
};

export default function UrlGraph3D() {
  const fgRef = useRef<any>(null);
  const [graphData] = useState<GraphData>(generateGraphData);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);

    // Destacar nós conectados
    const connectedNodes = new Set<string>();
    const connectedLinks = new Set<string>();

    connectedNodes.add(node.id);

    graphData.links.forEach((link) => {
      const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
      const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;

      if (sourceId === node.id) {
        connectedNodes.add(targetId);
        connectedLinks.add(`${sourceId}-${targetId}`);
      }
      if (targetId === node.id) {
        connectedNodes.add(sourceId);
        connectedLinks.add(`${sourceId}-${targetId}`);
      }
    });

    setHighlightNodes(connectedNodes);
    setHighlightLinks(connectedLinks);

    // Zoom para o nó
    if (fgRef.current) {
      const distance = 150;
      const distRatio = 1 + distance / Math.hypot((node as any).x, (node as any).y, (node as any).z);
      fgRef.current.cameraPosition(
        { x: (node as any).x * distRatio, y: (node as any).y * distRatio, z: (node as any).z * distRatio },
        node,
        2000
      );
    }
  }, [graphData.links]);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  }, []);

  const resetCamera = useCallback(() => {
    if (fgRef.current) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 400 }, { x: 0, y: 0, z: 0 }, 1000);
    }
    setSelectedNode(null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());
  }, []);

  // Stats
  const stats = {
    total: graphData.nodes.length,
    match: graphData.nodes.filter(n => n.status === 'match').length,
    different: graphData.nodes.filter(n => n.status === 'different').length,
    missing: graphData.nodes.filter(n => n.status === 'missing').length,
    links: graphData.links.length,
    internal: graphData.links.filter(l => l.type === 'internal').length,
    external: graphData.links.filter(l => l.type === 'external').length,
  };

  if (!mounted) {
    return (
      <div className="w-full h-[600px] bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-white">Carregando visualização 3D...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-[#333]">Grafo 3D de URLs</h3>
            <button
              onClick={resetCamera}
              className="px-3 py-1.5 text-sm bg-[#0A80B3] text-white rounded-lg hover:bg-[#086a94] transition-colors"
            >
              Resetar Câmera
            </button>
          </div>

          {/* Mini stats */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-gray-500">
              <strong>{stats.total}</strong> nós
            </span>
            <span className="text-gray-500">
              <strong>{stats.links}</strong> links
            </span>
            <span className="text-green-600">
              <strong>{stats.match}</strong> conformes
            </span>
            <span className="text-amber-600">
              <strong>{stats.different}</strong> diferentes
            </span>
            <span className="text-red-600">
              <strong>{stats.missing}</strong> faltando
            </span>
          </div>
        </div>
      </div>

      {/* Graph Container */}
      <div className="relative">
        <div className="w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden">
          <ForceGraph3D
            ref={fgRef}
            graphData={graphData}
            nodeLabel={(node: any) => `${node.name}\n${node.url}`}
            nodeColor={(node: any) => {
              if (highlightNodes.size > 0) {
                return highlightNodes.has(node.id) ? getNodeColor(node) : '#333';
              }
              return getNodeColor(node);
            }}
            nodeVal={(node: any) => getNodeSize(node)}
            nodeOpacity={0.9}
            linkColor={(link: any) => {
              const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
              const targetId = typeof link.target === 'object' ? link.target.id : link.target;

              if (highlightLinks.size > 0) {
                return highlightLinks.has(`${sourceId}-${targetId}`) ? '#0A80B3' : '#222';
              }
              return link.type === 'external' ? '#8b5cf6' : '#4a5568';
            }}
            linkWidth={(link: any) => {
              const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
              const targetId = typeof link.target === 'object' ? link.target.id : link.target;

              return highlightLinks.has(`${sourceId}-${targetId}`) ? 2 : 0.5;
            }}
            linkOpacity={0.6}
            backgroundColor="#111827"
            onNodeClick={handleNodeClick}
            onBackgroundClick={handleBackgroundClick}
            enableNodeDrag={true}
            enableNavigationControls={true}
            showNavInfo={false}
          />
        </div>

        {/* Selected Node Info */}
        {selectedNode && (
          <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-[#333]">{selectedNode.name}</h4>
                <code className="text-xs text-[#0A80B3] bg-blue-50 px-1 rounded">
                  {selectedNode.url}
                </code>
              </div>
              <button
                onClick={() => {
                  setSelectedNode(null);
                  setHighlightNodes(new Set());
                  setHighlightLinks(new Set());
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Tipo:</span>
                <span className="capitalize font-medium">{selectedNode.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-0.5 rounded-full font-medium ${
                  selectedNode.status === 'match' ? 'bg-green-100 text-green-700' :
                  selectedNode.status === 'different' ? 'bg-amber-100 text-amber-700' :
                  selectedNode.status === 'missing' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {selectedNode.status === 'match' ? 'Conforme' :
                   selectedNode.status === 'different' ? 'Diferente' :
                   selectedNode.status === 'missing' ? 'Faltando' : 'OK'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Profundidade:</span>
                <span className="font-medium">{selectedNode.depth}</span>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-2">Legenda</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0A80B3]" />
              <span>Root</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
              <span>Conforme</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span>Diferente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span>Faltando</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
              <span>Externo</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-1">Controles</p>
          <ul className="text-xs text-gray-600 space-y-0.5">
            <li>Arrastar: Rotacionar</li>
            <li>Scroll: Zoom</li>
            <li>Click: Selecionar nó</li>
            <li>Shift+Arrastar: Pan</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
