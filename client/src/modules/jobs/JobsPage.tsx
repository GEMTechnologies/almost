import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Building,
  Users,
  Star,
  Filter,
  Search,
  Heart,
  ExternalLink
} from 'lucide-react';

const JobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Program Manager - Health Systems',
      company: 'Global Health Partners',
      location: 'Kampala, Uganda',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$45,000 - $60,000',
      description: 'Lead health system strengthening programs across East Africa. Manage implementation of community health initiatives and coordinate with local partners.',
      requirements: [
        'Masters in Public Health or related field',
        'Experience in program management',
        'Knowledge of health systems in East Africa',
        'Strong communication skills'
      ],
      benefits: ['Health insurance', 'Professional development', 'Flexible working', 'Travel opportunities'],
      posted: '2 days ago',
      deadline: '2024-08-15',
      rating: 4.8,
      saved: false
    },
    {
      id: 2,
      title: 'Research Coordinator',
      company: 'African Development Research Institute',
      location: 'Nairobi, Kenya',
      type: 'Contract',
      experience: '2-4 years',
      salary: '$35,000 - $45,000',
      description: 'Coordinate multi-country research projects focusing on economic development and poverty reduction in Sub-Saharan Africa.',
      requirements: [
        'PhD in Economics, Development Studies, or related field',
        'Research experience in development economics',
        'Statistical analysis skills (R, Stata, Python)',
        'Experience with field research'
      ],
      benefits: ['Research funding', 'Conference attendance', 'Publication support', 'Networking opportunities'],
      posted: '1 week ago',
      deadline: '2024-07-30',
      rating: 4.6,
      saved: true
    },
    {
      id: 3,
      title: 'Grant Writer & Fundraising Specialist',
      company: 'Community Development Network',
      location: 'Remote (Africa)',
      type: 'Full-time',
      experience: '3-6 years',
      salary: '$40,000 - $55,000',
      description: 'Develop funding strategies and write compelling grant proposals for community development projects across Africa.',
      requirements: [
        'Proven track record in grant writing',
        'Experience with international donors',
        'Strong writing and communication skills',
        'Knowledge of development sector'
      ],
      benefits: ['Remote work', 'Performance bonuses', 'Training programs', 'Career advancement'],
      posted: '3 days ago',
      deadline: '2024-08-01',
      rating: 4.7,
      saved: false
    },
    {
      id: 4,
      title: 'Technology Project Manager',
      company: 'Digital Innovation Hub',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      experience: '4-7 years',
      salary: '$50,000 - $70,000',
      description: 'Manage technology projects that create digital solutions for social impact across Africa.',
      requirements: [
        'Computer Science or Engineering degree',
        'Project management certification (PMP)',
        'Experience with software development lifecycle',
        'Understanding of African tech ecosystem'
      ],
      benefits: ['Equity options', 'Innovation time', 'Tech conferences', 'Startup environment'],
      posted: '5 days ago',
      deadline: '2024-08-10',
      rating: 4.9,
      saved: false
    }
  ];

  const categories = [
    { id: 'all', label: 'All Jobs', count: jobs.length },
    { id: 'health', label: 'Health & Medicine', count: 15 },
    { id: 'research', label: 'Research & Academia', count: 12 },
    { id: 'development', label: 'Development & NGO', count: 18 },
    { id: 'technology', label: 'Technology', count: 8 },
    { id: 'finance', label: 'Finance & Grants', count: 10 }
  ];

  const jobStats = [
    { label: 'Total Jobs', value: '150+', icon: Briefcase, color: 'blue' },
    { label: 'Active Employers', value: '85', icon: Building, color: 'green' },
    { label: 'Average Salary', value: '$48K', icon: DollarSign, color: 'purple' },
    { label: 'Success Rate', value: '78%', icon: Star, color: 'orange' }
  ];

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Jobs & Career Opportunities</h1>
          <p className="text-gray-600">Find meaningful employment opportunities in development, health, research, and technology sectors.</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {jobStats.map((stat, index) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Search Jobs</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{category.label}</span>
                    <span className="text-sm bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
                      <label key={type} className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option>Any Experience</option>
                    <option>Entry Level (0-2 years)</option>
                    <option>Mid Level (3-5 years)</option>
                    <option>Senior Level (5+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option>Any Salary</option>
                    <option>$30,000 - $40,000</option>
                    <option>$40,000 - $60,000</option>
                    <option>$60,000+</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Job Listings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="space-y-6">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <Heart className={`w-5 h-5 ${job.saved ? 'fill-current text-red-500' : ''}`} />
                        </button>
                      </div>
                      <p className="text-blue-600 font-medium mb-1">{job.company}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.type}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {job.experience}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{job.salary}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{job.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{job.description}</p>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Key Requirements:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {job.requirements.slice(0, 4).map((req, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.map((benefit, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Posted {job.posted}</span>
                      <span>•</span>
                      <span>Deadline: {job.deadline}</span>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Learn More
                      </button>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        Apply Now
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                Load More Jobs
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;