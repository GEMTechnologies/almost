import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  FileText,
  Send,
  Star,
  Users,
  Building,
  Award
} from 'lucide-react';
import type { Donor, Donation } from '../ngoLogic';
import DonorsSubMenu from './DonorsSubMenu';

const DonorsModule: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Sample data
  const donors: Donor[] = [
    {
      id: '1',
      name: 'Gates Foundation',
      type: 'foundation',
      email: 'grants@gatesfoundation.org',
      phone: '+1-206-709-3100',
      address: '440 5th Avenue North, Seattle, WA 98109',
      country: 'United States',
      totalDonations: 2500000,
      lastDonation: '2024-06-15',
      relationship: 'major',
      status: 'active',
      tags: ['health', 'education', 'major_donor'],
      donationHistory: [],
      preferences: {
        communicationFrequency: 'quarterly',
        preferredContact: 'email',
        interestAreas: ['health', 'education'],
        anonymousGiving: false
      },
      communicationLog: []
    },
    {
      id: '2',
      name: 'USAID East Africa',
      type: 'institution',
      email: 'eastafrica@usaid.gov',
      phone: '+256-414-259791',
      address: 'Plot 1577, Ggaba Road, Kampala',
      country: 'Uganda',
      totalDonations: 1800000,
      lastDonation: '2024-07-02',
      relationship: 'major',
      status: 'active',
      tags: ['development', 'government', 'institutional'],
      donationHistory: [],
      preferences: {
        communicationFrequency: 'monthly',
        preferredContact: 'email',
        interestAreas: ['development', 'governance'],
        anonymousGiving: false
      },
      communicationLog: []
    },
    {
      id: '3',
      name: 'Dr. Sarah Johnson',
      type: 'individual',
      email: 'sarah.johnson@email.com',
      phone: '+44-20-7946-0958',
      address: '123 Kensington Gardens, London, UK',
      country: 'United Kingdom',
      totalDonations: 125000,
      lastDonation: '2024-07-10',
      relationship: 'regular',
      status: 'active',
      tags: ['healthcare', 'women_empowerment', 'monthly_donor'],
      donationHistory: [],
      preferences: {
        communicationFrequency: 'monthly',
        preferredContact: 'email',
        interestAreas: ['healthcare', 'women'],
        anonymousGiving: false
      },
      communicationLog: []
    },
    {
      id: '4',
      name: 'Stanbic Bank Uganda',
      type: 'corporate',
      email: 'csr@stanbicbank.co.ug',
      phone: '+256-312-224-100',
      address: 'Crested Towers, Hannington Road, Kampala',
      country: 'Uganda',
      totalDonations: 85000,
      lastDonation: '2024-05-20',
      relationship: 'regular',
      status: 'active',
      tags: ['corporate', 'financial_literacy', 'youth'],
      donationHistory: [],
      preferences: {
        communicationFrequency: 'quarterly',
        preferredContact: 'email',
        interestAreas: ['youth', 'education'],
        anonymousGiving: false
      },
      communicationLog: []
    }
  ];

  const donorStats = {
    total: donors.length,
    totalDonations: donors.reduce((sum, d) => sum + d.totalDonations, 0),
    majorDonors: donors.filter(d => d.relationship === 'major').length,
    avgDonation: donors.reduce((sum, d) => sum + d.totalDonations, 0) / donors.length
  };

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         donor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || donor.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getDonorIcon = (type: string) => {
    switch (type) {
      case 'foundation': return Award;
      case 'institution': return Building;
      case 'corporate': return Building;
      default: return Users;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderViewContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{donorStats.total}</p>
                    <p className="text-sm font-medium text-gray-600">Total Donors</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(donorStats.totalDonations)}</p>
                    <p className="text-sm font-medium text-gray-600">Total Donations</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{donorStats.majorDonors}</p>
                    <p className="text-sm font-medium text-gray-600">Major Donors</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{formatCurrency(donorStats.avgDonation)}</p>
                    <p className="text-sm font-medium text-gray-600">Average Donation</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </motion.div>
            </div>
          </>
        );
      case 'all-donors':
      default:
        return (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search donors by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="individual">Individual</option>
                    <option value="corporate">Corporate</option>
                    <option value="foundation">Foundation</option>
                    <option value="institution">Institution</option>
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation Menu */}
      <DonorsSubMenu activeView={activeView} onViewChange={setActiveView} />

      {/* Dynamic Content */}
      {renderViewContent()}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{donorStats.total}</p>
              <p className="text-sm font-medium text-gray-600">Total Donors</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(donorStats.totalDonations)}</p>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{donorStats.majorDonors}</p>
              <p className="text-sm font-medium text-gray-600">Major Donors</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(donorStats.avgDonation)}</p>
              <p className="text-sm font-medium text-gray-600">Average Donation</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search donors by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="individual">Individual</option>
              <option value="corporate">Corporate</option>
              <option value="foundation">Foundation</option>
              <option value="institution">Institution</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonors.map((donor, index) => {
          const DonorIcon = getDonorIcon(donor.type);
          return (
            <motion.div
              key={donor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    donor.relationship === 'major' ? 'bg-red-100' : 
                    donor.relationship === 'regular' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <DonorIcon className={`w-6 h-6 ${
                      donor.relationship === 'major' ? 'text-red-600' :
                      donor.relationship === 'regular' ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{donor.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{donor.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  donor.relationship === 'major' ? 'bg-red-100 text-red-700' :
                  donor.relationship === 'regular' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {donor.relationship}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {donor.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {donor.country}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Last donation: {new Date(donor.lastDonation).toLocaleDateString()}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Total Donations</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(donor.totalDonations)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-1">
                {donor.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                  >
                    {tag.replace('_', ' ')}
                  </span>
                ))}
                {donor.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                    +{donor.tags.length - 3} more
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-900">Generate Reports</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Create donor reports, donation summaries, and analytics.</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create Report
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Send className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-gray-900">Send Communications</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Send thank you emails, appeals, and newsletters to donors.</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Send Message
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-gray-900">Record Donation</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Add new donations and generate receipts automatically.</p>
          <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Add Donation
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default DonorsModule;