import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
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

  // Fetch countries for global location support
  const { data: countries = [] } = useQuery({
    queryKey: ['/api/jobs/countries'],
    queryFn: async () => {
      const response = await fetch('/api/jobs/countries');
      const data = await response.json();
      return data.success ? data.countries : [];
    }
  });

  // Fetch cities based on selected country
  const { data: cities = [] } = useQuery({
    queryKey: ['/api/jobs/cities', selectedLocation],
    queryFn: async () => {
      if (!selectedLocation) return [];
      const response = await fetch(`/api/jobs/cities/${selectedLocation}`);
      const data = await response.json();
      return data.success ? data.cities : [];
    },
    enabled: !!selectedLocation
  });

  // Fetch job categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/jobs/categories'],
    queryFn: async () => {
      const response = await fetch('/api/jobs/categories');
      const data = await response.json();
      return data.success ? data.categories : [];
    }
  });

  // Fetch companies
  const { data: companies = [] } = useQuery({
    queryKey: ['/api/jobs/companies'],
    queryFn: async () => {
      const response = await fetch('/api/jobs/companies');
      const data = await response.json();
      return data.success ? data.companies : [];
    }
  });

  // Fetch jobs with filters
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/jobs/jobs', searchQuery, selectedLocation, selectedCategory, activeTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedLocation) params.append('countryId', selectedLocation);
      if (selectedCategory) params.append('categoryId', selectedCategory);
      if (activeTab === 'featured') params.append('featured', 'true');
      
      const response = await fetch(`/api/jobs/jobs?${params}`);
      const data = await response.json();
      return data.success ? data : { jobs: [], pagination: {} };
    }
  });

  // Fetch CV profiles
  const { data: cvProfilesData } = useQuery({
    queryKey: ['/api/jobs/cv-profiles'],
    queryFn: async () => {
      const response = await fetch('/api/jobs/cv-profiles');
      const data = await response.json();
      return data.success ? data : { cvProfiles: [] };
    }
  });

  const jobs = jobsData?.jobs || [];
  const cvLibraryProfiles = cvProfilesData?.cvProfiles || [];

  // Initialize database if no data exists
  const initializeDatabase = async () => {
    try {
      const response = await fetch('/api/jobs/init', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        // Refetch data after initialization
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  };

  // Check if we need to initialize data
  useEffect(() => {
    if (countries.length === 0 && categories.length === 0) {
      initializeDatabase();
    }
  }, [countries.length, categories.length]);

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
                  <option value="">All Locations</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>{country.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
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
                    <span className="text-sm text-gray-600">{jobs.length} jobs found</span>
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
                {jobsLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading jobs...</p>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No jobs found. Try adjusting your search criteria.</p>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-2xl">
                          💼
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600 cursor-pointer">
                                {job.title}
                              </h3>
                              <p className="text-red-600 font-medium">{job.companyName}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 mb-1">{new Date(job.postedDate).toLocaleDateString()}</p>
                              <p className="text-sm font-medium text-gray-900">{job.salaryRange}</p>
                            </div>
                          </div>
                        
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.jobType}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Deadline: {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Open'}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {job.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.requirements && job.requirements.slice(0, 3).map((req, index) => (
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
                  ))
                )}
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
                {cvLibraryProfiles.slice(0, showCVLibrary ? cvLibraryProfiles.length : 3).map((profile) => (
                  <div key={profile.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                        👤
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{profile.fullName}</h4>
                        <p className="text-sm text-red-600">{profile.professionalTitle}</p>
                        <p className="text-xs text-gray-500 mb-2">{profile.yearsOfExperience} years • {profile.location}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {profile.skills && profile.skills.slice(0, 3).map((skill, index) => (
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