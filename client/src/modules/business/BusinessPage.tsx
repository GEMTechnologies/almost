import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  TrendingUp, 
  DollarSign, 
  Users,
  Lightbulb,
  Target,
  Award,
  Globe,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  Briefcase
} from 'lucide-react';

const BusinessPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('funding');

  const fundingOpportunities = [
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
      applications: 250
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
      applications: 180
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
      applications: 320
    }
  ];

  const partnerships = [
    {
      id: 1,
      title: 'Corporate Partnership Program',
      partner: 'Global Tech Solutions',
      type: 'Technology Partnership',
      benefits: ['Tech infrastructure', 'Training programs', 'Market access', 'Mentorship'],
      description: 'Partner with leading tech companies to accelerate your digital transformation.',
      duration: '12-24 months',
      status: 'Open'
    },
    {
      id: 2,
      title: 'Supply Chain Integration',
      partner: 'African Trade Network',
      type: 'Trade Partnership',
      benefits: ['Supply chain access', 'Logistics support', 'Export assistance', 'Quality certification'],
      description: 'Connect with established supply chains across Africa and international markets.',
      duration: '6-18 months',
      status: 'Open'
    },
    {
      id: 3,
      title: 'Research & Development Collaboration',
      partner: 'Innovation Research Institute',
      type: 'R&D Partnership',
      benefits: ['Research facilities', 'Expert guidance', 'IP support', 'Prototype development'],
      description: 'Collaborate on cutting-edge research and product development initiatives.',
      duration: '12-36 months',
      status: 'Applications Closing Soon'
    }
  ];

  const businessStats = [
    { label: 'Active Opportunities', value: '85+', icon: Target, color: 'blue' },
    { label: 'Total Funding Available', value: '$12M', icon: DollarSign, color: 'green' },
    { label: 'Success Rate', value: '72%', icon: TrendingUp, color: 'purple' },
    { label: 'Partner Companies', value: '150+', icon: Building, color: 'orange' }
  ];

  const categories = [
    { id: 'funding', label: 'Funding', icon: DollarSign },
    { id: 'partnerships', label: 'Partnerships', icon: Users },
    { id: 'incubators', label: 'Incubators', icon: Lightbulb },
    { id: 'markets', label: 'Markets', icon: Globe }
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'funding':
        return (
          <div className="space-y-6">
            {fundingOpportunities.map((opportunity) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                    <p className="text-blue-600 font-medium">{opportunity.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{opportunity.amount}</p>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {opportunity.type}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{opportunity.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Deadline: {opportunity.deadline}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {opportunity.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {opportunity.applications} applications
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Eligibility:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {opportunity.eligibility.map((criteria, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                        {criteria}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{opportunity.rating} rating</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'partnerships':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerships.map((partnership) => (
              <motion.div
                key={partnership.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{partnership.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      partnership.status === 'Open' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {partnership.status}
                    </span>
                  </div>
                  <p className="text-blue-600 font-medium">{partnership.partner}</p>
                  <p className="text-sm text-gray-600">{partnership.type}</p>
                </div>

                <p className="text-gray-600 text-sm mb-4">{partnership.description}</p>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                  <div className="flex flex-wrap gap-2">
                    {partnership.benefits.map((benefit, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">Duration: {partnership.duration}</span>
                </div>

                <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Apply for Partnership
                </button>
              </motion.div>
            ))}
          </div>
        );

      case 'incubators':
        return (
          <div className="text-center py-12">
            <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Business Incubators & Accelerators</h3>
            <p className="text-gray-600 mb-6">Join leading incubator programs to accelerate your business growth.</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Explore Programs
            </button>
          </div>
        );

      case 'markets':
        return (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Access & Expansion</h3>
            <p className="text-gray-600 mb-6">Connect with new markets and expand your business reach across Africa and globally.</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Explore Markets
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Opportunities</h1>
          <p className="text-gray-600">Discover funding, partnerships, and growth opportunities for your business.</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {businessStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-gray-200">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {renderContent()}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center"
        >
          <Building className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ready to Grow Your Business?</h2>
          <p className="mb-6 opacity-90">Join thousands of successful businesses that have found funding and partnerships through our platform.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              Create Business Profile
            </button>
            <button className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium">
              Schedule Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessPage;