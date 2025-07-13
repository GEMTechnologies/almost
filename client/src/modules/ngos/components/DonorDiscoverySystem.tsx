import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users, 
  Target, 
  Heart, 
  ExternalLink,
  Bookmark,
  TrendingUp,
  Globe,
  Building,
  Award,
  CheckCircle
} from 'lucide-react';

interface DonorOpportunity {
  id: string;
  title: string;
  organization: string;
  type: 'foundation' | 'government' | 'corporate' | 'individual' | 'multilateral';
  amount: {
    min: number;
    max: number;
    currency: string;
  };
  deadline: string;
  location: string[];
  sectors: string[];
  description: string;
  matchScore: number;
  requirements: string[];
  website: string;
  contact: {
    email: string;
    phone?: string;
  };
  tags: string[];
  applicationProcess: string;
  isBookmarked: boolean;
  isNewOpportunity: boolean;
}

interface DonorDiscoverySystemProps {
  onApply?: (opportunityId: string) => void;
}

const DonorDiscoverySystem: React.FC<DonorDiscoverySystemProps> = ({ onApply }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    type: '',
    sector: '',
    amount: '',
    location: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sample donor opportunities with realistic data
  const donorOpportunities: DonorOpportunity[] = [
    {
      id: '1',
      title: 'Global Health Systems Strengthening Initiative',
      organization: 'Bill & Melinda Gates Foundation',
      type: 'foundation',
      amount: { min: 2500000, max: 5000000, currency: 'USD' },
      deadline: '2025-03-15',
      location: ['Sub-Saharan Africa', 'South Asia'],
      sectors: ['Health', 'Public Health Systems', 'Digital Health'],
      description: 'Support innovative approaches to strengthen health systems in low-resource settings through technology integration and capacity building.',
      matchScore: 98,
      requirements: [
        'Proven track record in health systems work',
        'Partnership with local organizations required',
        'Digital health component mandatory',
        'Minimum 5 years organizational experience'
      ],
      website: 'https://www.gatesfoundation.org',
      contact: { email: 'globalhealth@gatesfoundation.org' },
      tags: ['High Priority', 'Technology', 'Capacity Building'],
      applicationProcess: 'Two-stage application: Letter of Intent followed by full proposal',
      isBookmarked: true,
      isNewOpportunity: true
    },
    {
      id: '2',
      title: 'USAID Development Innovation Ventures',
      organization: 'United States Agency for International Development',
      type: 'government',
      amount: { min: 500000, max: 1200000, currency: 'USD' },
      deadline: '2025-02-28',
      location: ['Global', 'Developing Countries'],
      sectors: ['Education', 'Technology', 'Economic Development'],
      description: 'Fund breakthrough solutions that can be scaled to improve the lives of millions of people in developing countries.',
      matchScore: 94,
      requirements: [
        'Evidence-based intervention required',
        'Clear path to scale demonstrated',
        'Cost-effectiveness analysis needed',
        'Local partnership preferred'
      ],
      website: 'https://www.usaid.gov/div',
      contact: { email: 'div@usaid.gov', phone: '+1-202-712-0000' },
      tags: ['Innovation', 'Scalable', 'Evidence-Based'],
      applicationProcess: 'Rolling applications with quarterly reviews',
      isBookmarked: false,
      isNewOpportunity: true
    },
    {
      id: '3',
      title: 'Social Justice and Human Rights Program',
      organization: 'Ford Foundation',
      type: 'foundation',
      amount: { min: 100000, max: 300000, currency: 'USD' },
      deadline: '2025-04-10',
      location: ['Americas', 'Africa', 'Asia'],
      sectors: ['Human Rights', 'Social Justice', 'Civil Society'],
      description: 'Support organizations working to advance social justice and protect human rights through advocacy, research, and community organizing.',
      matchScore: 91,
      requirements: [
        'Demonstrated commitment to social justice',
        'Community-based approach required',
        'Advocacy or policy work component',
        'Grassroots engagement essential'
      ],
      website: 'https://www.fordfoundation.org',
      contact: { email: 'socialjustice@fordfoundation.org' },
      tags: ['Social Justice', 'Advocacy', 'Grassroots'],
      applicationProcess: 'Invitation-only applications through regional offices',
      isBookmarked: true,
      isNewOpportunity: false
    },
    {
      id: '4',
      title: 'Climate Resilience and Adaptation Fund',
      organization: 'Green Climate Fund',
      type: 'multilateral',
      amount: { min: 1000000, max: 10000000, currency: 'USD' },
      deadline: '2025-05-20',
      location: ['Developing Countries', 'Small Island States'],
      sectors: ['Climate Change', 'Environmental Protection', 'Adaptation'],
      description: 'Support developing countries in their efforts to combat climate change through adaptation and resilience-building projects.',
      matchScore: 89,
      requirements: [
        'Climate adaptation focus required',
        'Country government endorsement needed',
        'Environmental and social safeguards compliance',
        'Minimum 7-year implementation period'
      ],
      website: 'https://www.greenclimate.fund',
      contact: { email: 'applications@gcfund.org' },
      tags: ['Climate', 'Large Scale', 'Government Partnership'],
      applicationProcess: 'Concept note followed by funding proposal',
      isBookmarked: false,
      isNewOpportunity: true
    },
    {
      id: '5',
      title: 'Education Innovation Challenge',
      organization: 'Mastercard Foundation',
      type: 'foundation',
      amount: { min: 750000, max: 1500000, currency: 'USD' },
      deadline: '2025-03-30',
      location: ['Africa'],
      sectors: ['Education', 'Youth Development', 'Skills Training'],
      description: 'Innovative programs that improve access to quality education and develop skills for economic participation among African youth.',
      matchScore: 87,
      requirements: [
        'Focus on African youth aged 15-35',
        'Skills development component required',
        'Private sector partnerships encouraged',
        'Impact measurement framework needed'
      ],
      website: 'https://mastercardfdn.org',
      contact: { email: 'education@mastercardfdn.org' },
      tags: ['Youth Focus', 'Skills Development', 'Private Sector'],
      applicationProcess: 'Expression of Interest followed by full application',
      isBookmarked: true,
      isNewOpportunity: false
    },
    {
      id: '6',
      title: 'Corporate Social Responsibility Partnership',
      organization: 'Microsoft Corporation',
      type: 'corporate',
      amount: { min: 250000, max: 800000, currency: 'USD' },
      deadline: '2025-06-15',
      location: ['Global'],
      sectors: ['Technology', 'Digital Inclusion', 'Education'],
      description: 'Partner with Microsoft to bridge the digital divide through technology access, digital literacy programs, and AI for good initiatives.',
      matchScore: 85,
      requirements: [
        'Technology-focused programming required',
        'Digital inclusion component mandatory',
        'Measurable impact on digital skills',
        'Collaboration with Microsoft teams'
      ],
      website: 'https://www.microsoft.com/philanthropy',
      contact: { email: 'partnerships@microsoft.com' },
      tags: ['Technology', 'Digital Inclusion', 'Corporate Partnership'],
      applicationProcess: 'Direct application through partnership portal',
      isBookmarked: false,
      isNewOpportunity: true
    }
  ];

  const formatAmount = (amount: { min: number; max: number; currency: string }) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
      return num.toString();
    };
    
    return `${amount.currency} ${formatNumber(amount.min)} - ${formatNumber(amount.max)}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'foundation': return <Heart className="w-5 h-5" />;
      case 'government': return <Building className="w-5 h-5" />;
      case 'corporate': return <Target className="w-5 h-5" />;
      case 'multilateral': return <Globe className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 95) return 'text-emerald-600 bg-emerald-100';
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 85) return 'text-blue-600 bg-blue-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const filteredOpportunities = donorOpportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.sectors.some(sector => sector.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = !selectedFilters.type || opportunity.type === selectedFilters.type;
    const matchesSector = !selectedFilters.sector || opportunity.sectors.includes(selectedFilters.sector);
    
    return matchesSearch && matchesType && matchesSector;
  });

  return (
    <div className="bg-slate-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">System Donor Discovery</h1>
              <p className="text-slate-400">Intelligent matching system for funding opportunities</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Live System Active</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search opportunities, organizations, sectors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedFilters.type}
              onChange={(e) => setSelectedFilters({...selectedFilters, type: e.target.value})}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="foundation">Foundation</option>
              <option value="government">Government</option>
              <option value="corporate">Corporate</option>
              <option value="multilateral">Multilateral</option>
            </select>
            <select
              value={selectedFilters.sector}
              onChange={(e) => setSelectedFilters({...selectedFilters, sector: e.target.value})}
              className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Sectors</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="Climate Change">Climate Change</option>
              <option value="Human Rights">Human Rights</option>
            </select>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Target className="w-6 h-6 text-blue-200" />
                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">+{Math.floor(Math.random() * 20)} New</span>
              </div>
              <p className="text-2xl font-bold text-white">{filteredOpportunities.length}</p>
              <p className="text-blue-200 text-sm">Available Now</p>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-6 h-6 text-green-200" />
                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">96%</span>
              </div>
              <p className="text-2xl font-bold text-white">{filteredOpportunities.filter(o => o.matchScore >= 90).length}</p>
              <p className="text-green-200 text-sm">High Matches</p>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-6 h-6 text-purple-200" />
                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">High</span>
              </div>
              <p className="text-2xl font-bold text-white">$847M</p>
              <p className="text-purple-200 text-sm">Total Funding</p>
            </div>
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-6 h-6 text-orange-200" />
                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">Urgent</span>
              </div>
              <p className="text-2xl font-bold text-white">{filteredOpportunities.filter(o => new Date(o.deadline) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}</p>
              <p className="text-orange-200 text-sm">Deadline Soon</p>
            </div>
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Bookmark className="w-6 h-6 text-teal-200" />
                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">Saved</span>
              </div>
              <p className="text-2xl font-bold text-white">{filteredOpportunities.filter(o => o.isBookmarked).length}</p>
              <p className="text-teal-200 text-sm">Bookmarked</p>
            </div>
          </div>
        </motion.div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-all border border-slate-700 hover:border-slate-600"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${opportunity.type === 'foundation' ? 'bg-red-100 text-red-600' : 
                    opportunity.type === 'government' ? 'bg-blue-100 text-blue-600' :
                    opportunity.type === 'corporate' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'}`}>
                    {getTypeIcon(opportunity.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg leading-tight">{opportunity.title}</h3>
                    <p className="text-slate-400 text-sm">{opportunity.organization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {opportunity.isNewOpportunity && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                  )}
                  <button className={`p-2 rounded-lg ${opportunity.isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-700 text-slate-400'} hover:bg-slate-600 transition-colors`}>
                    <Bookmark className="w-4 h-4" fill={opportunity.isBookmarked ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>

              {/* Match Score */}
              <div className="flex items-center justify-between mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchScoreColor(opportunity.matchScore)}`}>
                  {opportunity.matchScore}% System Match
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400 text-lg">{formatAmount(opportunity.amount)}</p>
                  <p className="text-slate-400 text-sm flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: {new Date(opportunity.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">{opportunity.description}</p>

              {/* Sectors and Location */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-2">
                  {opportunity.sectors.slice(0, 3).map((sector) => (
                    <span key={sector} className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded-full">
                      {sector}
                    </span>
                  ))}
                  {opportunity.sectors.length > 3 && (
                    <span className="text-slate-400 text-xs">+{opportunity.sectors.length - 3} more</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  {opportunity.location.slice(0, 2).join(', ')}
                  {opportunity.location.length > 2 && ` +${opportunity.location.length - 2} more`}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {opportunity.tags.map((tag) => (
                  <span key={tag} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onApply?.(opportunity.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Apply Now
                </button>
                <button className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        {filteredOpportunities.length > 0 && (
          <div className="text-center mt-8">
            <button className="bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-slate-600">
              Load More Opportunities
            </button>
          </div>
        )}

        {/* No Results */}
        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No opportunities found</h3>
            <p className="text-slate-400">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDiscoverySystem;