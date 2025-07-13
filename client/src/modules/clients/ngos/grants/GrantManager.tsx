import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Users, Target, Plus, Search, Filter } from 'lucide-react';

interface Grant {
  id: string;
  title: string;
  donor: string;
  amount: number;
  status: 'active' | 'pending' | 'completed' | 'rejected';
  startDate: string;
  endDate: string;
  description: string;
  beneficiaries: number;
  sector: string;
  requirements: string[];
}

const GrantManager: React.FC = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSector, setFilterSector] = useState('all');

  useEffect(() => {
    fetchGrants();
  }, []);

  const fetchGrants = async () => {
    try {
      const response = await fetch('/api/ngos/grants');
      if (response.ok) {
        const data = await response.json();
        setGrants(data);
      }
    } catch (error) {
      console.error('Error fetching grants:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGrants = grants.filter(grant => {
    const matchesSearch = grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grant.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grant.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || grant.status === filterStatus;
    const matchesSector = filterSector === 'all' || grant.sector === filterSector;
    return matchesSearch && matchesStatus && matchesSector;
  });

  const sectors = ['all', 'Education', 'Healthcare', 'Environment', 'Agriculture', 'Technology', 'Social Development'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Grant Manager
        </h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Apply for Grant</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search grants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector === 'all' ? 'All Sectors' : sector}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGrants.map((grant) => (
          <div key={grant.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {grant.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {grant.donor}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(grant.status)}`}>
                {grant.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${grant.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {grant.startDate} - {grant.endDate}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {grant.beneficiaries.toLocaleString()} beneficiaries
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {grant.sector}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
              {grant.description}
            </p>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Requirements
              </p>
              <div className="flex flex-wrap gap-2">
                {grant.requirements.slice(0, 3).map((req, index) => (
                  <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                    {req}
                  </span>
                ))}
                {grant.requirements.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    +{grant.requirements.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm">
                View Details
              </button>
              <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 text-sm">
                Generate Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGrants.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No grants found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default GrantManager;