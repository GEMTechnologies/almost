import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Briefcase,
  Building,
  MapPin,
  Clock,
  Search,
  Filter,
  Upload,
  FileText,
  Globe,
  Users,
  Calendar,
  CheckCircle,
  Star,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Download,
  Eye,
  ChevronRight,
  ChevronDown,
  User
} from 'lucide-react';

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCVLibrary, setShowCVLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');

  // Company partners
  const companies = [
    { name: 'Uganda Airlines', logo: '🛫' },
    { name: 'Airtel Uganda', logo: '📱' },
    { name: 'MTN Uganda', logo: '📞' },
    { name: 'Stanbic Bank', logo: '🏦' },
    { name: 'DFCU Bank', logo: '💳' },
    { name: 'Safaricom', logo: '📡' }
  ];

  // Job categories
  const categories = [
    'All Categories',
    'Information Technology',
    'Banking & Finance',
    'Healthcare & Medical',
    'Education & Training',
    'Engineering',
    'Sales & Marketing',
    'Human Resources',
    'Legal & Compliance',
    'Customer Service',
    'Operations & Logistics',
    'Administration'
  ];

  // Location options
  const locations = [
    'All Locations',
    'Kampala',
    'Entebbe',
    'Jinja',
    'Mbarara',
    'Gulu',
    'Arua',
    'Masaka',
    'Soroti',
    'Hoima',
    'Lira',
    'Remote'
  ];

  // Latest jobs
  const latestJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Solutions Uganda',
      location: 'Kampala',
      type: 'Full-time',
      salary: 'UGX 3,000,000 - 5,000,000',
      posted: '2 days ago',
      deadline: '15 Jan 2025',
      description: 'We are looking for an experienced software engineer to join our growing team...',
      requirements: ['Bachelor\'s degree in Computer Science', '3+ years experience', 'JavaScript, React, Node.js'],
      logo: '💻'
    },
    {
      id: 2,
      title: 'Marketing Manager',
      company: 'East Africa Marketing Ltd',
      location: 'Kampala',
      type: 'Full-time',
      salary: 'UGX 2,500,000 - 4,000,000',
      posted: '1 day ago',
      deadline: '20 Jan 2025',
      description: 'Join our dynamic marketing team and lead strategic campaigns across East Africa...',
      requirements: ['Bachelor\'s in Marketing', '5+ years experience', 'Digital marketing expertise'],
      logo: '📈'
    },
    {
      id: 3,
      title: 'Financial Analyst',
      company: 'Uganda Investment Bank',
      location: 'Kampala',
      type: 'Full-time',
      salary: 'UGX 2,000,000 - 3,500,000',
      posted: '3 days ago',
      deadline: '18 Jan 2025',
      description: 'Analyze financial data and provide insights to support business decisions...',
      requirements: ['CPA or ACCA qualification', '2+ years experience', 'Excel proficiency'],
      logo: '💰'
    },
    {
      id: 4,
      title: 'Project Manager',
      company: 'Development Partners International',
      location: 'Kampala',
      type: 'Contract',
      salary: 'UGX 4,000,000 - 6,000,000',
      posted: '1 week ago',
      deadline: '25 Jan 2025',
      description: 'Lead project implementation for development programs across Uganda...',
      requirements: ['PMP certification preferred', '4+ years experience', 'NGO experience'],
      logo: '📋'
    },
    {
      id: 5,
      title: 'Sales Executive',
      company: 'Uganda Telecom',
      location: 'Multiple Locations',
      type: 'Full-time',
      salary: 'UGX 1,500,000 - 2,500,000',
      posted: '4 days ago',
      deadline: '22 Jan 2025',
      description: 'Drive sales growth and build customer relationships in telecom sector...',
      requirements: ['Diploma in Sales/Marketing', '2+ years experience', 'Customer service skills'],
      logo: '📞'
    },
    {
      id: 6,
      title: 'Data Scientist',
      company: 'Uganda Bureau of Statistics',
      location: 'Kampala',
      type: 'Full-time',
      salary: 'UGX 3,500,000 - 5,500,000',
      posted: '5 days ago',
      deadline: '30 Jan 2025',
      description: 'Analyze large datasets to generate insights for national development...',
      requirements: ['Master\'s in Statistics/Data Science', 'Python/R proficiency', 'Machine learning'],
      logo: '📊'
    }
  ];

  // CV Library profiles
  const cvProfiles = [
    {
      id: 1,
      name: 'James Mugisha',
      title: 'Senior Software Developer',
      experience: '5 years',
      location: 'Kampala',
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      education: 'Bachelor\'s in Computer Science - Makerere University',
      summary: 'Experienced software developer with expertise in full-stack development...',
      avatar: '👨‍💻'
    },
    {
      id: 2,
      name: 'Sarah Nakato',
      title: 'Marketing Professional',
      experience: '4 years',
      location: 'Kampala',
      skills: ['Digital Marketing', 'SEO', 'Content Creation', 'Analytics'],
      education: 'Bachelor\'s in Marketing - Uganda Christian University',
      summary: 'Creative marketing professional with proven track record in digital campaigns...',
      avatar: '👩‍💼'
    },
    {
      id: 3,
      name: 'Peter Okello',
      title: 'Financial Analyst',
      experience: '3 years',
      location: 'Entebbe',
      skills: ['Financial Analysis', 'Excel', 'SAP', 'Risk Management'],
      education: 'Bachelor\'s in Finance - Mbarara University',
      summary: 'Detail-oriented financial analyst with strong analytical and problem-solving skills...',
      avatar: '👨‍💼'
    },
    {
      id: 4,
      name: 'Grace Namuli',
      title: 'Project Coordinator',
      experience: '6 years',
      location: 'Kampala',
      skills: ['Project Management', 'Team Leadership', 'Budget Management', 'Reporting'],
      education: 'Master\'s in Project Management - Kyambogo University',
      summary: 'Experienced project coordinator with extensive NGO and development sector experience...',
      avatar: '👩‍🏫'
    },
    {
      id: 5,
      name: 'Robert Ssemakula',
      title: 'Sales Manager',
      experience: '7 years',
      location: 'Jinja',
      skills: ['Sales Strategy', 'Team Management', 'Customer Relations', 'CRM'],
      education: 'Bachelor\'s in Business Administration - Nkumba University',
      summary: 'Results-driven sales manager with consistent track record of exceeding targets...',
      avatar: '👨‍💻'
    },
    {
      id: 6,
      name: 'Mary Atim',
      title: 'Data Analyst',
      experience: '2 years',
      location: 'Kampala',
      skills: ['Python', 'SQL', 'Tableau', 'Statistical Analysis'],
      education: 'Bachelor\'s in Statistics - Makerere University',
      summary: 'Passionate data analyst with strong statistical background and programming skills...',
      avatar: '👩‍💻'
    }
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, selectedLocation, selectedCategory);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome back, {user?.username || 'Job Seeker'}! 
            </h1>
            <p className="text-xl text-red-100">
              Find your dream job in Uganda and across Africa
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job title, keywords, or company name..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  />
                </div>
              </div>
              
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600"
              >
                <Filter className="w-4 h-4" />
                Advanced Search
              </button>
              
              <button
                onClick={handleSearch}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 font-semibold flex items-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search Jobs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Section */}
      <div className="py-8 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center text-lg font-semibold text-gray-600 mb-6">Companies Hiring</h2>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {companies.map((company, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-500 hover:text-red-600 cursor-pointer">
                <span className="text-2xl">{company.logo}</span>
                <span className="font-medium">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Listings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Latest Jobs</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">{latestJobs.length} jobs found</span>
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      View All
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab('latest')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === 'latest' 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Latest Jobs
                  </button>
                  <button
                    onClick={() => setActiveTab('featured')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      activeTab === 'featured' 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Featured
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {latestJobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                        {job.logo}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 cursor-pointer">
                              {job.title}
                            </h3>
                            <p className="text-red-600 font-medium">{job.company}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">{job.posted}</p>
                            <p className="text-sm font-medium text-gray-900">{job.salary}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Deadline: {job.deadline}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.requirements.slice(0, 3).map((req, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              {req}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button className="text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              Save
                            </button>
                          </div>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium">
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - CV Library & Actions */}
          <div className="space-y-6">
            {/* CV Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CV & Profile</h3>
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Your CV
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Create CV Online
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                  <User className="w-5 h-5" />
                  Update Profile
                </button>
              </div>
            </div>

            {/* CV Library */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Latest Profiles in CV Library</h3>
                  <button
                    onClick={() => setShowCVLibrary(!showCVLibrary)}
                    className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    {showCVLibrary ? 'Show Less' : 'View All'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showCVLibrary ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {cvProfiles.slice(0, showCVLibrary ? cvProfiles.length : 3).map((profile) => (
                  <div key={profile.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        {profile.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{profile.name}</h4>
                        <p className="text-sm text-red-600">{profile.title}</p>
                        <p className="text-xs text-gray-500 mb-2">{profile.experience} • {profile.location}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {profile.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs">
                          <button className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            View Profile
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            Download CV
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Alerts */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Alerts</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get notified when new jobs match your criteria
              </p>
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 font-medium">
                Create Job Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-red-600 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to find your next opportunity?</h2>
          <p className="text-red-100 mb-6">Join thousands of professionals finding their dream jobs in Uganda</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Browse All Jobs
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600">
              Post a Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;