import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GrantsApp = () => {
  const [grants, setGrants] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGrantsData();
  }, []);

  const loadGrantsData = async () => {
    try {
      setLoading(true);
      const [grantsRes, appsRes] = await Promise.all([
        axios.get('/api/grants/search'),
        axios.get('/api/grants/applications/demo-org')
      ]);
      
      setGrants(grantsRes.data.grants || []);
      setApplications(appsRes.data.applications || []);
    } catch (error) {
      console.error('Error loading grants data:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchGrants = async () => {
    try {
      const response = await axios.get(`/api/grants/search?query=${searchQuery}`);
      setGrants(response.data.grants || []);
    } catch (error) {
      console.error('Error searching grants:', error);
    }
  };

  const submitApplication = async (grantId) => {
    try {
      await axios.post('/api/grants/applications', {
        grant_id: grantId,
        organization_id: 'demo-org',
        documents: []
      });
      loadGrantsData(); // Refresh data
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading grants data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Grants Management</h1>
      
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search grants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={searchGrants}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Grants</h2>
          {grants.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">No grants found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {grants.map((grant) => (
                <div key={grant.id} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">{grant.title}</h3>
                  <p className="text-gray-600 mb-2">{grant.organization}</p>
                  <p className="text-sm text-gray-500 mb-4">{grant.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-green-600">
                      ${grant.amount?.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Due: {new Date(grant.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Requirements:</h4>
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {grant.requirements?.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => submitApplication(grant.id)}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">My Applications</h2>
          {applications.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">No applications submitted</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2">Application #{app.id}</h3>
                  <p className="text-gray-600 mb-2">Grant: {app.grant_id}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded text-sm ${
                      app.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status}
                    </span>
                    <button className="text-blue-600 hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrantsApp;