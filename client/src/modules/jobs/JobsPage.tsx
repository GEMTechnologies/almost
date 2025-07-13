import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  User,
  RefreshCw,
  Database,
  Sparkles,
  Heart,
  Share2,
  ExternalLink,
  DollarSign,
  Zap,
  HelpCircle
} from 'lucide-react';
import FinancialTipsTooltip from '../../components/FinancialTipsTooltip';

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCVLibrary, setShowCVLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Real-time database synchronization function
  const refreshAllData = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate all job-related queries to force refetch
      await queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      await queryClient.refetchQueries({ queryKey: ['/api/jobs'] });
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds for real-time sync
  useEffect(() => {
    const interval = setInterval(refreshAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Credit system functions
  const deductCredits = async (amount: number, action: string) => {
    try {
      const response = await fetch('/api/auth/deduct-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, action })
      });
      const result = await response.json();
      if (result.success) {
        // Refresh user data to update credit balance
        queryClient.invalidateQueries({ queryKey: ['/api/auth/profile'] });
        return true;
      } else {
        alert(`Insufficient credits! You need ${amount} credits for ${action}. Please purchase more credits.`);
        return false;
      }
    } catch (error) {
      console.error('Failed to deduct credits:', error);
      return false;
    }
  };

  const checkCreditsAndExecute = async (requiredCredits: number, action: string, callback: () => void) => {
    if (!user?.creditBalance || user.creditBalance < requiredCredits) {
      alert(`This action requires ${requiredCredits} credits. You have ${user?.creditBalance || 0} credits. Please purchase more credits.`);
      return;
    }
    
    const success = await deductCredits(requiredCredits, action);
    if (success) {
      callback();
    }
  };

  // Enhanced search with credit deduction
  const handlePremiumSearch = async () => {
    await checkCreditsAndExecute(5, 'Premium Job Search', () => {
      // Premium search functionality
      console.log('Executing premium search...');
    });
  };

  // Enhanced CV generation with credits
  const handleCVGeneration = async () => {
    await checkCreditsAndExecute(25, 'AI CV Generation', () => {
      // AI CV generation functionality
      console.log('Generating AI-powered CV...');
    });
  };

  // Human help with credits
  const handleHumanHelp = async () => {
    await checkCreditsAndExecute(50, 'Human Career Consultation', () => {
      // Human help functionality
      console.log('Connecting to human career advisor...');
    });
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
      {/* Header Section with Credit Balance */}
      <div id="header" className="bg-gradient-to-r from-red-600 via-red-700 to-orange-600 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="text-center flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
                <Briefcase className="w-12 h-12" />
                Welcome back, {user?.username || 'Job Seeker'}! 
              </h1>
              <p className="text-xl text-red-100">
                Find your dream job in Uganda and across Africa
              </p>
            </div>
            
            {/* Credit Balance Card */}
            <div id="credit-balance" className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[180px]">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium">Your Credits</span>
              </div>
              <div className="text-3xl font-bold text-yellow-300">
                {user?.creditBalance || 0}
              </div>
              <FinancialTipsTooltip 
                category="savings" 
                position="bottom"
                trigger={
                  <button 
                    onClick={() => window.location.href = '/credits'}
                    className="mt-2 bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    Buy More
                  </button>
                }
              />
            </div>
          </div>

          {/* Real-time Sync Indicator */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Database className={`w-4 h-4 ${isRefreshing ? 'animate-pulse text-yellow-300' : 'text-green-300'}`} />
              <span className="text-sm text-white bg-black bg-opacity-20 px-3 py-1 rounded-full">
                {isRefreshing ? 'Syncing with database...' : 'Live database sync active'}
              </span>
              <button 
                onClick={refreshAllData}
                className="ml-2 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {hasCompletedTour && (
              <button
                onClick={startTour}
                className="flex items-center gap-2 text-white bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full text-sm font-medium transition-colors"
                title="Restart onboarding tour"
              >
                <HelpCircle className="w-4 h-4" />
                Take Tour Again
              </button>
            )}
          </div>

          {/* Search Section */}
          <div id="search-section" className="bg-white rounded-lg p-6 shadow-lg">
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
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600"
                >
                  <Filter className="w-4 h-4" />
                  Advanced Search
                </button>
                
                <FinancialTipsTooltip 
                  category="credits" 
                  position="top"
                  trigger={
                    <button
                      onClick={handlePremiumSearch}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200"
                    >
                      <Zap className="w-4 h-4" />
                      Premium Search
                      <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">5 Credits</span>
                    </button>
                  }
                />
              </div>
              
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

      {/* Companies Section with Beautiful Logos */}
      <div className="py-12 bg-gradient-to-br from-gray-50 to-gray-100 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Top Companies Hiring</h2>
            <p className="text-gray-600">Join leading organizations across Uganda and Africa</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {/* Uganda Airlines */}
            <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors">Uganda Airlines</h3>
                <p className="text-xs text-gray-500 mt-1">5 jobs available</p>
              </div>
            </div>

            {/* Airtel Uganda */}
            <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors">Airtel Uganda</h3>
                <p className="text-xs text-gray-500 mt-1">8 jobs available</p>
              </div>
            </div>

            {/* MTN Uganda */}
            <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors">MTN Uganda</h3>
                <p className="text-xs text-gray-500 mt-1">12 jobs available</p>
              </div>
            </div>

            {/* Stanbic Bank */}
            <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">Stanbic Bank</h3>
                <p className="text-xs text-gray-500 mt-1">6 jobs available</p>
              </div>
            </div>

            {/* NSSF Uganda */}
            <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6L11 13.64 7.36 10l1.27-1.27L11 11.1l4.37-4.37L16.64 8z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition-colors">NSSF Uganda</h3>
                <p className="text-xs text-gray-500 mt-1">4 jobs available</p>
              </div>
            </div>

            {/* Uganda Revenue Authority */}
            <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-current">
                    <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9L12 2 4.5 2 2 4.5v15L4.5 22h15l2.5-2.5v-15L19.5 2zM19 19.5H5V4.5h14v15z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">URA</h3>
                <p className="text-xs text-gray-500 mt-1">3 jobs available</p>
              </div>
            </div>
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
                              <button 
                                onClick={() => checkCreditsAndExecute(2, 'View Job Details', () => console.log('Viewing job details...'))}
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                                <span className="bg-blue-600 text-white text-xs px-1 py-0.5 rounded">2 Credits</span>
                              </button>
                              <button className="text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                Save
                              </button>
                              <button 
                                onClick={() => checkCreditsAndExecute(3, 'Direct Contact', () => console.log('Contacting employer...'))}
                                className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Contact
                                <span className="bg-green-600 text-white text-xs px-1 py-0.5 rounded">3 Credits</span>
                              </button>
                            </div>
                            <button 
                              id="premium-section"
                              onClick={() => checkCreditsAndExecute(10, 'Job Application', () => console.log('Applying to job...'))}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
                            >
                              Apply Now
                              <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">10 Credits</span>
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
            {/* CV Actions with Credit System */}
            <div id="cv-tools" className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                CV & Career Tools
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Your CV
                  <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">Free</span>
                </button>
                
                <FinancialTipsTooltip 
                  category="career" 
                  position="left"
                  trigger={
                    <button 
                      onClick={handleCVGeneration}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 font-medium flex items-center justify-center gap-2 relative overflow-hidden group"
                    >
                      <Sparkles className="w-5 h-5" />
                      AI CV Generator
                      <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">25 Credits</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  }
                />
                
                <FinancialTipsTooltip 
                  category="strategy" 
                  position="left"
                  trigger={
                    <button 
                      onClick={handleHumanHelp}
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-3 rounded-lg hover:from-emerald-700 hover:to-emerald-800 font-medium flex items-center justify-center gap-2 relative overflow-hidden group"
                    >
                      <User className="w-5 h-5" />
                      Human Career Help
                      <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">50 Credits</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  }
                />
                
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Create CV Online
                  <span className="bg-gray-500 text-white text-xs px-2 py-0.5 rounded-full">Free</span>
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