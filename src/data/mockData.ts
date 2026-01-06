export const features = [
  { id: 'all', name: 'Todas as features' },
  { id: 'sponsored-products', name: 'Produtos patrocinados' },
  { id: 'sponsored-result', name: 'Resultado Patrocinado' },
  { id: 'ai-overview', name: 'AI Overview' },
  { id: 'featured-products', name: 'Produtos em Destaque' },
  { id: 'people-also-ask', name: 'People Also Ask' },
  { id: 'organic-results', name: 'Resultados Orgânicos (Links Azuis)' },
  { id: 'product-knowledge-panel', name: 'Product Knowledge Panel' },
];

export const keywords = [
  { id: 'all', name: 'Todas as palavras', type: 'all' },
  { id: 'cluster-a', name: 'Cluster A', type: 'cluster' },
  { id: 'cluster-b', name: 'Cluster B', type: 'cluster' },
  { id: 'cluster-c', name: 'Cluster C', type: 'cluster' },
  { id: 'keyword-a', name: 'Keyword A', type: 'keyword' },
  { id: 'keyword-b', name: 'Keyword B', type: 'keyword' },
  { id: 'keyword-c', name: 'Keyword C', type: 'keyword' },
  { id: 'keyword-d', name: 'Keyword D', type: 'keyword' },
  { id: 'keyword-e', name: 'Keyword E', type: 'keyword' },
  { id: 'keyword-f', name: 'Keyword F', type: 'keyword' },
];

export const brazilStates = [
  { id: 'AC', name: 'Acre' },
  { id: 'AL', name: 'Alagoas' },
  { id: 'AP', name: 'Amapá' },
  { id: 'AM', name: 'Amazonas' },
  { id: 'BA', name: 'Bahia' },
  { id: 'CE', name: 'Ceará' },
  { id: 'DF', name: 'Distrito Federal' },
  { id: 'ES', name: 'Espírito Santo' },
  { id: 'GO', name: 'Goiás' },
  { id: 'MA', name: 'Maranhão' },
  { id: 'MT', name: 'Mato Grosso' },
  { id: 'MS', name: 'Mato Grosso do Sul' },
  { id: 'MG', name: 'Minas Gerais' },
  { id: 'PA', name: 'Pará' },
  { id: 'PB', name: 'Paraíba' },
  { id: 'PR', name: 'Paraná' },
  { id: 'PE', name: 'Pernambuco' },
  { id: 'PI', name: 'Piauí' },
  { id: 'RJ', name: 'Rio de Janeiro' },
  { id: 'RN', name: 'Rio Grande do Norte' },
  { id: 'RS', name: 'Rio Grande do Sul' },
  { id: 'RO', name: 'Rondônia' },
  { id: 'RR', name: 'Roraima' },
  { id: 'SC', name: 'Santa Catarina' },
  { id: 'SP', name: 'São Paulo' },
  { id: 'SE', name: 'Sergipe' },
  { id: 'TO', name: 'Tocantins' },
];

// Static position data for each competitor by state (deterministic to avoid hydration errors)
export const competitors = [
  {
    id: 'client',
    name: 'Ocean Drop',
    color: '#0A80B3',
    positions: {
      AC: 3, AL: 1, AP: 5, AM: 2, BA: 1, CE: 4, DF: 1, ES: 2, GO: 3,
      MA: 6, MT: 4, MS: 2, MG: 1, PA: 5, PB: 3, PR: 1, PE: 2, PI: 7,
      RJ: 1, RN: 4, RS: 2, RO: 6, RR: 8, SC: 1, SP: 1, SE: 3, TO: 5
    }
  },
  {
    id: 'competitor-1',
    name: 'Concorrente A',
    color: '#E74C3C',
    positions: {
      AC: 1, AL: 3, AP: 2, AM: 4, BA: 2, CE: 1, DF: 3, ES: 5, GO: 1,
      MA: 2, MT: 1, MS: 4, MG: 3, PA: 1, PB: 2, PR: 4, PE: 1, PI: 3,
      RJ: 2, RN: 1, RS: 3, RO: 2, RR: 4, SC: 3, SP: 2, SE: 1, TO: 2
    }
  },
  {
    id: 'competitor-2',
    name: 'Concorrente B',
    color: '#F39C12',
    positions: {
      AC: 2, AL: 4, AP: 1, AM: 3, BA: 5, CE: 2, DF: 4, ES: 1, GO: 2,
      MA: 1, MT: 3, MS: 1, MG: 2, PA: 3, PB: 1, PR: 2, PE: 4, PI: 1,
      RJ: 3, RN: 2, RS: 1, RO: 1, RR: 2, SC: 2, SP: 3, SE: 2, TO: 1
    }
  },
];

export const serpResults = {
  // Produtos Populares (Shopping) - baseado no print do Google
  popularProducts: [
    {
      title: 'Garmin vivoactive 3',
      rating: 4.5,
      reviews: 6827,
      priceRange: { min: 'R$ 187,47', max: 'R$ 194,99' },
      stores: ['Garmin', 'Best Buy', 'Walmart', 'Amazon'],
    },
  ],
  // Product Knowledge Panel (lado direito desktop / mobile)
  productKnowledgePanel: {
    name: 'Garmin vivoactive 3',
    rating: 4.5,
    reviews: 6827,
    description: 'GPS smartwatch in direct sunlight, the ultra-thin profile 5 mm - is comfortable to wear all day. A built-in accelerometer and wrist-based optical heart rate',
    tabs: ['OVERVIEW', 'REVIEWS', 'STORES', 'DETAILS'],
    stores: [
      { name: 'Garmin', label: 'Limited', price: null },
      { name: 'Best Buy', label: 'Retailer', price: '$127.99' },
      { name: 'Walmart', label: null, price: '$194.99' },
    ],
    details: {
      brand: 'Garmin',
      manufacturer: 'Garmin',
      activitiesTracked: 'Activity Speed, Calories Burned, Distance, Floors Climbed, Heart Rate, Sleep, Steps, Time',
      color: 'Black, Black / Silver, Black / Stainless Steel, Grey / Black, Glass, White',
      connectivity: 'Bluetooth',
    },
    userReviews: {
      overall: 4.3,
      aspects: [
        { label: 'Usability', score: 4.6 },
        { label: 'Appearance', score: 4.6 },
        { label: 'Features', score: 4.5 },
      ],
    },
    criticReviews: [
      {
        source: 'Tom\'s Guide',
        snippet: 'Excellent choice for the fitness-focused who also want a subtle smartwatch built for the ath...',
      },
      {
        source: 'TechRadar',
        snippet: 'Garmin takes aim at the fitness-focused with its new smartwatch. can track outdoor workouts...',
      },
    ],
    relatedSearches: [
      'Garmin vivoactive 3 Music',
      'GPS Smart Sport Watch',
      '10 reasons to buy Garmin Vivoactiv...',
    ],
  },
  // Resultados Orgânicos
  organicResults: [
    {
      position: 1,
      title: 'Garmin vivoactive 3',
      url: 'garmin.com',
      breadcrumb: 'https://www.garmin.com › vivoactive-3',
      rating: 4.5,
      reviews: 6827,
      description: 'Shop readable in direct sunlight. The ultra-thin profile 5 mm - is comfortable to wear all day. A built-in accelerometer and wrist-based...',
      isClient: true,
    },
    {
      position: 2,
      title: 'Garmin vivoactive® 3 Music',
      url: 'buy.garmin.com',
      breadcrumb: 'https://buy.garmin.com › vivoactive-3-music',
      description: 'Store readable in direct sunlight. The ultra-thin profile 5 mm - is comfortable to wear all day. Features: Activity, Activity Speed, Calories...',
      isClient: false,
    },
  ],
  aiOverview: {
    title: 'Spirulina é uma cianobactéria...',
    content: 'A spirulina é uma microalga azul-esverdeada rica em proteínas, vitaminas e minerais. É considerada um superalimento devido ao seu alto valor nutricional. Estudos mostram benefícios para energia, imunidade e detoxificação.',
    sources: ['oceandrop.com.br', 'healthline.com', 'pubmed.gov']
  },
  peopleAlsoAsk: [
    'Quais os benefícios da spirulina?',
    'Como tomar spirulina corretamente?',
    'Spirulina emagrece?',
    'Qual a melhor marca de spirulina?',
  ],
};
