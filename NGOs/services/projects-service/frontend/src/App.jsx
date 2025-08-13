import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProjectsApp = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadProjectsData();
  }, []);

  const loadProjectsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects?organization_id=demo-org');
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error('Error loading projects data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      await axios.post('/api/projects', projectData);
      loadProjectsData();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const updateProjectStatus = async (projectId, status) => {
    try {
      await axios.patch(`/api/projects/${projectId}/status?status=${status}`);
      loadProjectsData();
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  const updateMilestoneStatus = async (projectId, milestoneId, status) => {
    try {
      await axios.patch(`/api/projects/${projectId}/milestones/${milestoneId}?status=${status}`);
      loadProjectsData();
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading projects data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Project
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            createProject({
              name: formData.get('name'),
              description: formData.get('description'),
              start_date: formData.get('start_date'),
              end_date: formData.get('end_date'),
              budget: parseFloat(formData.get('budget')),
              team_members: formData.get('team_members').split(',').map(s => s.trim())
            });
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input name="name" type="text" placeholder="Project Name" className="border rounded px-3 py-2" required />
              <input name="budget" type="number" step="0.01" placeholder="Budget" className="border rounded px-3 py-2" required />
              <input name="start_date" type="date" className="border rounded px-3 py-2" required />
              <input name="end_date" type="date" className="border rounded px-3 py-2" />
            </div>
            <textarea name="description" placeholder="Project Description" className="w-full border rounded px-3 py-2 mb-4" rows="3" required></textarea>
            <input name="team_members" type="text" placeholder="Team Members (comma separated)" className="w-full border rounded px-3 py-2 mb-4" />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Projects Overview</h2>
          {projects.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">No projects found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg" onClick={() => setSelectedProject(project)}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <span className={`px-2 py-1 rounded text-sm ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Budget:</span>
                      <span className="font-medium ml-2">${project.budget?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Spent:</span>
                      <span className="font-medium ml-2">${project.spent?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Start:</span>
                      <span className="ml-2">{new Date(project.start_date).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Team:</span>
                      <span className="ml-2">{project.team_members?.length || 0} members</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(project.spent / project.budget) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {((project.spent / project.budget) * 100).toFixed(1)}% of budget used
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Project Details</h2>
          {selectedProject ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{selectedProject.name}</h3>
              <p className="text-gray-600 mb-4">{selectedProject.description}</p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Status:</label>
                <select 
                  value={selectedProject.status} 
                  onChange={(e) => updateProjectStatus(selectedProject.id, e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2">Team Members:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.team_members?.map((member, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Milestones:</h4>
                <div className="space-y-2">
                  {selectedProject.milestones?.map((milestone) => (
                    <div key={milestone.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium">{milestone.title}</div>
                        <div className="text-sm text-gray-500">Due: {milestone.due_date}</div>
                      </div>
                      <select 
                        value={milestone.status} 
                        onChange={(e) => updateMilestoneStatus(selectedProject.id, milestone.id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">Select a project to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsApp;