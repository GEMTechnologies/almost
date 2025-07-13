import React, { useState, useEffect } from 'react';
import { Search, Globe, DollarSign, Calendar, CheckCircle, XCircle, Eye, Edit } from 'lucide-react';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  donor: string;
  sector: string;
  country: string;
  fundingRange: string;
  deadline: string;
  status: 'verified' | 'pending' | 'rejected';
  createdAt: string;
  sourceUrl: string;
  eligibilityCriteria: string;
  applicationProcess: string;
}

const OpportunityManagement: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await fetch('/api/admin/opportunities');
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOpportunity = async (id: string) => {
    try {
      await fetch(`/api/admin/opportunities/${id}/verify`, { method: 'POST' });
      fetchOpportunities();
    } catch (error) {
      console.error('Error verifying opportunity:', error);
    }
  };

  const handleRejectOpportunity = async (id: string) => {
    try {
      await fetch(`/api/admin/opportunities/${id}/reject`, { method: 'POST' });
      fetchOpportunities();
    } catch (error) {
      console.error('Error rejecting opportunity:', error);
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.sector.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || opp.status === selectedStatus;
    const matchesSector = selectedSector === 'all' || opp.sector === selectedSector;
    
    return matchesSearch && matchesStatus && matchesSector;
  });

  const sectors = ['all', 'Education', 'Healthcare', 'Environment', 'Agriculture', 'Technology', 'Social Development'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Opportunity Management
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total: {opportunities.length} opportunities
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
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

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
            No opportunities found
          </div>
        ) : (
          filteredOpportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {opportunity.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {opportunity.donor}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      opportunity.status === 'verified' ? 'bg-green-100 text-green-800' :
                      opportunity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {opportunity.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Globe className="w-4 h-4 mr-2" />
                    {opportunity.country} • {opportunity.sector}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {opportunity.fundingRange}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    Deadline: {opportunity.deadline}
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                  {opportunity.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {opportunity.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleVerifyOpportunity(opportunity.id)}
                          className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Verify</span>
                        </button>
                        <button
                          onClick={() => handleRejectOpportunity(opportunity.id)}
                          className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OpportunityManagement;