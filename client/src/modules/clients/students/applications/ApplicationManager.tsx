import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Plus, Search } from 'lucide-react';

interface Application {
  id: string;
  title: string;
  institution: string;
  program: string;
  deadline: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected';
  submittedAt?: string;
  documents: string[];
}

const ApplicationManager: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/students/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="w-5 h-5 text-gray-500" />;
      case 'submitted': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'under_review': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Application Manager
        </h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(application.status)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {application.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {application.institution}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                {application.status.replace('_', ' ')}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Program:</strong> {application.program}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Deadline:</strong> {application.deadline}
              </p>
              {application.submittedAt && (
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Submitted:</strong> {application.submittedAt}
                </p>
              )}
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Documents ({application.documents.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {application.documents.map((doc, index) => (
                  <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                    {doc}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm">
                View Details
              </button>
              <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 text-sm">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No applications found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default ApplicationManager;