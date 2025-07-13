// Business module logic and data management
export interface FundingOpportunity {
  id: number;
  title: string;
  provider: string;
  amount: string;
  type: string;
  deadline: string;
  location: string;
  description: string;
  eligibility: string[];
  rating: number;
  applications: number;
  category: string;
  stage: 'early' | 'growth' | 'expansion';
  sector: string;
}

export interface Partnership {
  id: number;
  title: string;
  partner: string;
  type: string;
  benefits: string[];
  description: string;
  duration: string;
  status: 'Open' | 'Applications Closing Soon' | 'Closed';
  category: string;
}

export interface BusinessStats {
  label: string;
  value: string;
  icon: any;
  color: string;
  trend?: number;
}

export const getFundingOpportunities = (filters?: {
  category?: string;
  stage?: string;
  sector?: string;
  amount?: string;
}) => {
  const opportunities: FundingOpportunity[] = [
    {
      id: 1,
      title: 'SME Growth Fund 2024',
      provider: 'African Development Bank',
      amount: '$50,000 - $500,000',
      type: 'Grant & Loan',
      deadline: '2024-09-15',
      location: 'East Africa',
      description: 'Supporting small and medium enterprises in technology, agriculture, and manufacturing sectors.',
      eligibility: [
        'Revenue $100K - $2M annually',
        'Operating for 2+ years',
        'Job creation potential',
        'Clear growth strategy'
      ],
      rating: 4.8,
      applications: 250,
      category: 'sme',
      stage: 'growth',
      sector: 'technology'
    },
    {
      id: 2,
      title: 'Innovation Challenge Fund',
      provider: 'Tech Innovation Hub',
      amount: '$25,000 - $200,000',
      type: 'Competition Grant',
      deadline: '2024-08-30',
      location: 'Africa-wide',
      description: 'Funding innovative tech solutions addressing social and economic challenges in Africa.',
      eligibility: [
        'Tech-based solution',
        'Social impact focus',
        'Scalable business model',
        'Strong founding team'
      ],
      rating: 4.9,
      applications: 180,
      category: 'innovation',
      stage: 'early',
      sector: 'technology'
    },
    {
      id: 3,
      title: 'Women Entrepreneurs Fund',
      provider: 'Global Women Business Network',
      amount: '$10,000 - $100,000',
      type: 'Grant',
      deadline: '2024-08-10',
      location: 'Sub-Saharan Africa',
      description: 'Supporting women-led businesses across various sectors with focus on sustainability.',
      eligibility: [
        'Woman founder/co-founder',
        'Registered business',
        'Sustainability focus',
        'Community impact'
      ],
      rating: 4.7,
      applications: 320,
      category: 'diversity',
      stage: 'early',
      sector: 'mixed'
    },
    {
      id: 4,
      title: 'Agricultural Innovation Grant',
      provider: 'Food Security Foundation',
      amount: '$75,000 - $300,000',
      type: 'Research Grant',
      deadline: '2024-10-01',
      location: 'Rural Africa',
      description: 'Supporting innovative agricultural technologies and sustainable farming practices.',
      eligibility: [
        'Agricultural focus',
        'Technology innovation',
        'Farmer impact demonstration',
        'Sustainability measures'
      ],
      rating: 4.6,
      applications: 150,
      category: 'agriculture',
      stage: 'growth',
      sector: 'agriculture'
    }
  ];

  return opportunities.filter(opportunity => {
    if (filters?.category && filters.category !== 'all' && opportunity.category !== filters.category) return false;
    if (filters?.stage && filters.stage !== 'all' && opportunity.stage !== filters.stage) return false;
    if (filters?.sector && filters.sector !== 'all' && opportunity.sector !== filters.sector) return false;
    return true;
  });
};

export const getPartnerships = (category?: string) => {
  const partnerships: Partnership[] = [
    {
      id: 1,
      title: 'Corporate Partnership Program',
      partner: 'Global Tech Solutions',
      type: 'Technology Partnership',
      benefits: ['Tech infrastructure', 'Training programs', 'Market access', 'Mentorship'],
      description: 'Partner with leading tech companies to accelerate your digital transformation.',
      duration: '12-24 months',
      status: 'Open',
      category: 'technology'
    },
    {
      id: 2,
      title: 'Supply Chain Integration',
      partner: 'African Trade Network',
      type: 'Trade Partnership',
      benefits: ['Supply chain access', 'Logistics support', 'Export assistance', 'Quality certification'],
      description: 'Connect with established supply chains across Africa and international markets.',
      duration: '6-18 months',
      status: 'Open',
      category: 'trade'
    },
    {
      id: 3,
      title: 'Research & Development Collaboration',
      partner: 'Innovation Research Institute',
      type: 'R&D Partnership',
      benefits: ['Research facilities', 'Expert guidance', 'IP support', 'Prototype development'],
      description: 'Collaborate on cutting-edge research and product development initiatives.',
      duration: '12-36 months',
      status: 'Applications Closing Soon',
      category: 'research'
    }
  ];

  return partnerships.filter(partnership => {
    if (category && category !== 'all' && partnership.category !== category) return false;
    return true;
  });
};

export const getBusinessStats = (): BusinessStats[] => {
  return [
    { label: 'Active Opportunities', value: '85+', icon: 'Target', color: 'blue', trend: 12 },
    { label: 'Total Funding Available', value: '$12M', icon: 'DollarSign', color: 'green', trend: 8 },
    { label: 'Success Rate', value: '72%', icon: 'TrendingUp', color: 'purple', trend: 15 },
    { label: 'Partner Companies', value: '150+', icon: 'Building', color: 'orange', trend: 20 }
  ];
};

export const getBusinessCategories = () => {
  return [
    { id: 'funding', label: 'Funding Opportunities', icon: 'DollarSign', count: 45 },
    { id: 'partnerships', label: 'Strategic Partnerships', icon: 'Users', count: 28 },
    { id: 'incubators', label: 'Incubators & Accelerators', icon: 'Lightbulb', count: 15 },
    { id: 'markets', label: 'Market Access', icon: 'Globe', count: 22 }
  ];
};

export const getFundingCategories = () => {
  return [
    { id: 'all', label: 'All Funding', count: 45 },
    { id: 'sme', label: 'SME Growth', count: 12 },
    { id: 'innovation', label: 'Innovation', count: 8 },
    { id: 'diversity', label: 'Diversity & Inclusion', count: 6 },
    { id: 'agriculture', label: 'Agriculture', count: 7 },
    { id: 'technology', label: 'Technology', count: 12 }
  ];
};

export const getBusinessStages = () => {
  return [
    { id: 'all', label: 'All Stages', count: 45 },
    { id: 'early', label: 'Early Stage', count: 18 },
    { id: 'growth', label: 'Growth Stage', count: 20 },
    { id: 'expansion', label: 'Expansion', count: 7 }
  ];
};

export const getSectors = () => {
  return [
    { id: 'all', label: 'All Sectors', count: 45 },
    { id: 'technology', label: 'Technology', count: 15 },
    { id: 'agriculture', label: 'Agriculture', count: 10 },
    { id: 'health', label: 'Healthcare', count: 8 },
    { id: 'education', label: 'Education', count: 6 },
    { id: 'mixed', label: 'Mixed/Other', count: 6 }
  ];
};