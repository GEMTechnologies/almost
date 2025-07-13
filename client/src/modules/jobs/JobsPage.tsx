import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Briefcase,
  Building,
  DollarSign,
  MapPin,
  Star,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Trophy,
  Crown,
  CheckCircle,
  ArrowRight,
  Timer,
  Brain,
  Users,
  Sparkles,
  Flame,
  Laptop,
  Rocket,
  Heart,
  Diamond,
  Search,
  Filter,
  Upload,
  FileText,
  Globe,
  Wand2,
  ChevronDown
} from 'lucide-react';

const JobsPage: React.FC = () => {
  const { user } = useAuth();
  const [careerLevel, setCareerLevel] = useState(2850);
  const [interviewStreak, setInterviewStreak] = useState(7);
  const [applicationSuccess, setApplicationSuccess] = useState(89);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // CV upload state
  const [showCVUpload, setShowCVUpload] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [showCVGenerator, setShowCVGenerator] = useState(false);

  const heroMetrics = [
    { 
      label: 'Dream Jobs Available', 
      value: '2,847', 
      icon: Briefcase, 
      color: 'from-purple-500 to-pink-500',
      change: '+127 today'
    },
    { 
      label: 'AI Match Score', 
      value: '96%', 
      icon: Brain, 
      color: 'from-cyan-500 to-blue-500',
      change: '+12% this week'
    },
    { 
      label: 'Top Companies', 
      value: '1,200+', 
      icon: Building, 
      color: 'from-green-500 to-emerald-500',
      change: 'Global reach'
    },
    { 
      label: 'Avg Salary Boost', 
      value: '+45%', 
      icon: TrendingUp, 
      color: 'from-orange-500 to-red-500',
      change: 'vs current role'
    }
  ];

  const quickHunts = [
    {
      id: 'remote-tech',
      title: 'Remote Tech Giants',
      subtitle: 'Work from anywhere, earn anywhere',
      icon: Laptop,
      color: 'from-indigo-400 to-purple-500',
      count: '847 positions',
      salary: '$80K - $200K',
      difficulty: '🔥 Competitive',
      trending: true,
      new: 23
    },
    {
      id: 'startup-unicorns',
      title: 'Unicorn Startups',
      subtitle: 'Join the next big thing',
      icon: Rocket,
      color: 'from-pink-400 to-rose-500',
      count: '234 opportunities',
      salary: '$60K - $150K + Equity',
      difficulty: '⚡ Fast-paced',
      trending: true,
      new: 45
    },
    {
      id: 'ngo-impact',
      title: 'Impact Organizations',
      subtitle: 'Change the world while earning',
      icon: Heart,
      color: 'from-emerald-400 to-green-500',
      count: '456 missions',
      salary: '$45K - $90K',
      difficulty: '🌍 Global impact',
      new: 12
    },
    {
      id: 'consulting-elite',
      title: 'Elite Consulting',
      subtitle: 'Strategy, analysis, leadership',
      icon: Crown,
      color: 'from-yellow-400 to-orange-500',
      count: '189 elite roles',
      salary: '$100K - $300K',
      difficulty: '👑 Prestigious',
      trending: true,
      new: 8
    }
  ];

  const featuredJobs = [
    {
      id: 1,
      company: 'Meta',
      title: 'Senior AI Research Scientist',
      location: 'Remote • San Francisco',
      salary: '$180K - $350K',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead breakthrough AI research in computer vision and natural language processing.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
      urgency: 'Hiring fast',
      matchScore: 98,
      applicants: 2847,
      responseRate: '24%',
      posted: '2 hours ago',
      verified: true,
      trending: true
    },
    {
      id: 2,
      company: 'Stripe',
      title: 'Product Manager - Growth',
      location: 'Hybrid • New York',
      salary: '$140K - $220K',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Drive product strategy for Stripe\'s fastest-growing markets.',
      skills: ['Product Strategy', 'Data Analysis', 'A/B Testing', 'SQL'],
      urgency: 'Interview today',
      matchScore: 94,
      applicants: 1234,
      responseRate: '31%',
      posted: '1 day ago',
      verified: true
    },
    {
      id: 3,
      company: 'OpenAI',
      title: 'Machine Learning Engineer',
      location: 'Remote • Global',
      salary: '$160K - $280K',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Build and deploy large-scale ML systems that power next-generation AI applications.',
      skills: ['Python', 'Kubernetes', 'AWS', 'Machine Learning'],
      urgency: 'Limited spots',
      matchScore: 96,
      applicants: 3456,
      responseRate: '18%',
      posted: '3 hours ago',
      verified: true,
      trending: true
    },
    {
      id: 4,
      company: 'Figma',
      title: 'Senior UX Designer',
      location: 'Remote • San Francisco',
      salary: '$130K - $200K',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Design intuitive user experiences that millions of creators use daily.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      urgency: 'Portfolio review',
      matchScore: 92,
      applicants: 1876,
      responseRate: '28%',
      posted: '6 hours ago',
      verified: true
    }
  ];

  const achievements = [
    { name: 'First Application', icon: Target, unlocked: true, points: 100, rarity: 'common' },
    { name: 'Interview Master', icon: Users, unlocked: true, points: 250, rarity: 'uncommon' },
    { name: 'Salary Negotiator', icon: DollarSign, unlocked: true, points: 500, rarity: 'rare' },
    { name: 'Tech Pioneer', icon: Rocket, unlocked: false, points: 750, rarity: 'epic' },
    { name: 'Industry Leader', icon: Crown, unlocked: false, points: 1000, rarity: 'legendary' },
    { name: 'Career Architect', icon: Diamond, unlocked: false, points: 2500, rarity: 'mythic' }
  ];

  // Location and filter options
  const popularLocations = [
    'Remote • Global', 'New York, NY', 'San Francisco, CA', 'London, UK', 
    'Berlin, Germany', 'Toronto, Canada', 'Sydney, Australia', 'Tokyo, Japan',
    'Singapore', 'Amsterdam, Netherlands', 'Tel Aviv, Israel', 'Stockholm, Sweden'
  ];

  const salaryRanges = [
    '$40K - $60K', '$60K - $80K', '$80K - $120K', '$120K - $180K', 
    '$180K - $250K', '$250K+', 'Startup Equity', 'Negotiable'
  ];

  const jobTypes = [
    'Full-time', 'Part-time', 'Contract', 'Freelance', 
    'Internship', 'Remote', 'Hybrid', 'On-site'
  ];

  // Search function
  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedLocation && !selectedSalaryRange && !selectedJobType) return;
    
    setIsSearching(true);
    // Simulate API call - in real app would connect to job database
    setTimeout(() => {
      const filteredJobs = featuredJobs.filter(job => {
        const matchesQuery = !searchQuery || 
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesLocation = !selectedLocation || 
          job.location.toLowerCase().includes(selectedLocation.toLowerCase());
        
        return matchesQuery && matchesLocation;
      });
      
      setSearchResults(filteredJobs);
      setIsSearching(false);
    }, 1500);
  };

  // CV upload handler
  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCvFile(file);
      // In real app would upload to server and parse CV
      console.log('CV uploaded:', file.name);
    }
  };

  // Generate CV handler
  const handleGenerateCV = () => {
    setShowCVGenerator(true);
    // In real app would open CV builder with AI assistance
    console.log('Opening CV generator...');
  };

  const MatchScoreMeter = ({ score }: { score: number }) => (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-gray-600"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray={`${score * 0.628} 62.8`}
          className="text-green-400"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-green-400">{score}%</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-purple-300/10">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute top-40 right-32 text-blue-300/10">
          <Trophy className="w-12 h-12" />
        </div>
        <div className="absolute bottom-32 left-40 text-green-300/10">
          <Rocket className="w-10 h-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-8 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome & Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Welcome back, {user?.username || 'Job Hunter'}! 👋
                </h1>
                <p className="text-xl text-slate-400 mt-2">Ready to find your dream job today?</p>
              </div>
              
              {/* CV Actions */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowCVUpload(true)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-2xl"
                >
                  <Upload className="w-5 h-5" />
                  Upload CV
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={handleGenerateCV}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-2xl"
                >
                  <Wand2 className="w-5 h-5" />
                  AI CV Builder
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Advanced Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-2xl rounded-3xl p-8 border border-purple-500/30 mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Find Your Perfect Job</h2>
                <p className="text-slate-400">Search thousands of opportunities worldwide</p>
              </div>
            </div>

            {/* Main Search Input */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, companies, skills... (e.g., 'React Developer', 'Google', 'Python')"
                className="block w-full pl-16 pr-6 py-6 text-lg bg-slate-800/80 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Search
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Location Filter */}
              <div className="relative">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="">🌍 Any Location</option>
                  {popularLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>

              {/* Salary Filter */}
              <div className="relative">
                <select
                  value={selectedSalaryRange}
                  onChange={(e) => setSelectedSalaryRange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="">💰 Any Salary</option>
                  {salaryRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>

              {/* Job Type Filter */}
              <div className="relative">
                <select
                  value={selectedJobType}
                  onChange={(e) => setSelectedJobType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                >
                  <option value="">⚡ Any Type</option>
                  {jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  {showFilters ? 'Hide' : 'Show'} Advanced Filters
                </motion.button>
                
                {(searchQuery || selectedLocation || selectedSalaryRange || selectedJobType) && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLocation('');
                      setSelectedSalaryRange('');
                      setSelectedJobType('');
                      setSearchResults([]);
                    }}
                    className="text-red-400 hover:text-red-300 font-semibold text-sm"
                  >
                    Clear All
                  </motion.button>
                )}
              </div>
              
              <div className="text-slate-400 text-sm">
                {searchResults.length > 0 && `${searchResults.length} jobs found`}
                {isSearching && 'Searching...'}
              </div>
            </div>
          </motion.div>

          {/* Career Stats */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-2xl rounded-3xl p-6 border border-purple-500/30 mb-12"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-slate-300 text-lg">Career Level</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    {careerLevel.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <Flame className="w-6 h-6 text-orange-400" />
                  <div>
                    <p className="text-orange-400 font-bold text-xl">{interviewStreak}</p>
                    <p className="text-slate-400 text-sm">Interview Streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-green-400 font-bold text-xl">{applicationSuccess}%</p>
                    <p className="text-slate-400 text-sm">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hero Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {heroMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`relative group bg-gradient-to-r ${metric.color} p-[2px] rounded-3xl overflow-hidden`}
              >
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-2xl flex items-center justify-center`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl lg:text-4xl font-black text-white mb-2">{metric.value}</p>
                  <p className="text-slate-400 text-sm font-medium mb-2">{metric.label}</p>
                  <p className="text-xs text-emerald-400 font-semibold">{metric.change}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Hunt Categories */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                  🎯 Quick Hunts
                </h2>
                <p className="text-xl text-slate-400">Curated job collections for focused career moves</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-2xl"
              >
                Explore All <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {quickHunts.map((hunt, index) => (
                <motion.div
                  key={hunt.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 cursor-pointer group relative overflow-hidden"
                >
                  {hunt.trending && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      HOT
                    </div>
                  )}

                  {hunt.new > 0 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      +{hunt.new} new
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${hunt.color} rounded-2xl flex items-center justify-center shadow-2xl`}>
                      <hunt.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{hunt.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{hunt.subtitle}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-300">{hunt.count}</span>
                      <span className="text-lg font-bold text-green-400">{hunt.salary}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">{hunt.difficulty}</div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    Start Hunt
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured Dream Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                  ⭐ Dream Jobs
                </h2>
                <p className="text-xl text-slate-400">AI-curated opportunities perfect for your career trajectory</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + index * 0.15 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl overflow-hidden border border-slate-700/50 group cursor-pointer"
                >
                  {job.trending && (
                    <div className="absolute top-6 right-6 z-20">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                    </div>
                  )}

                  <div className="absolute top-6 left-6 z-20 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    FEATURED
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center">
                        <Building className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-purple-400 font-semibold text-lg">{job.company}</p>
                      </div>
                      {job.verified && (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center gap-6 mb-4 text-slate-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{job.posted}</span>
                        </div>
                      </div>
                      
                      <p className="text-slate-300 text-sm mb-4 leading-relaxed">{job.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill) => (
                          <span key={skill} className="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <MatchScoreMeter score={job.matchScore} />
                        <div>
                          <p className="text-green-400 font-bold text-lg">Match Score</p>
                          <p className="text-slate-400 text-sm">AI Recommendation</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-white">{job.salary}</p>
                        <p className="text-slate-400 text-sm">{job.experience} • {job.type}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-800/50 rounded-xl p-3">
                        <p className="text-slate-400 text-xs">Applicants</p>
                        <p className="text-white font-bold">{job.applicants.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-3">
                        <p className="text-slate-400 text-xs">Response Rate</p>
                        <p className="text-green-400 font-bold">{job.responseRate}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {job.urgency}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Quick Apply
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievement Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="bg-gradient-to-r from-slate-900/80 to-purple-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-purple-500/30"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white">Career Achievements</h3>
                  <p className="text-slate-400 text-lg">Unlock legendary status with every milestone</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-4xl font-bold text-yellow-400">{careerLevel.toLocaleString()}</p>
                <p className="text-slate-400">Total XP</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {achievements.map((achievement, index) => {
                const getRarityColor = (rarity: string) => {
                  switch (rarity) {
                    case 'common': return 'from-gray-400 to-gray-500';
                    case 'uncommon': return 'from-green-400 to-green-500';
                    case 'rare': return 'from-blue-400 to-blue-500';
                    case 'epic': return 'from-purple-400 to-purple-500';
                    case 'legendary': return 'from-orange-400 to-yellow-500';
                    case 'mythic': return 'from-pink-400 to-purple-500';
                    default: return 'from-gray-400 to-gray-500';
                  }
                };

                return (
                  <motion.div
                    key={achievement.name}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2 + index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                      achievement.unlocked 
                        ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} border-transparent` 
                        : 'bg-slate-800/50 border-slate-700/50'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                      achievement.unlocked 
                        ? 'bg-white/20 backdrop-blur' 
                        : 'bg-slate-700'
                    }`}>
                      <achievement.icon className={`w-8 h-8 ${
                        achievement.unlocked ? 'text-white' : 'text-slate-400'
                      }`} />
                      
                      {achievement.unlocked && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <h4 className={`text-sm font-bold mb-2 ${
                      achievement.unlocked ? 'text-white' : 'text-slate-400'
                    }`}>
                      {achievement.name}
                    </h4>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-xs ${
                        achievement.unlocked ? 'text-white/80' : 'text-slate-500'
                      }`}>
                        {achievement.points} XP
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        achievement.unlocked 
                          ? 'bg-white/20 text-white' 
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* CV Upload Modal */}
      {showCVUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCVUpload(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-8 max-w-2xl w-full border border-purple-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Upload Your CV</h3>
                  <p className="text-slate-400">Get matched with perfect opportunities</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowCVUpload(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </motion.button>
            </div>

            <div className="border-2 border-dashed border-slate-600 rounded-2xl p-8 text-center mb-6">
              <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Drag & drop your CV here</h4>
              <p className="text-slate-400 mb-4">or click to browse files</p>
              <input
                type="file"
                onChange={handleCVUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="cv-upload"
              />
              <label
                htmlFor="cv-upload"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold cursor-pointer inline-block"
              >
                Choose File
              </label>
              <p className="text-xs text-slate-500 mt-2">PDF, DOC, DOCX up to 10MB</p>
            </div>

            {cvFile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 rounded-xl p-4 mb-6"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-green-400" />
                  <div className="flex-1">
                    <p className="text-white font-semibold">{cvFile.name}</p>
                    <p className="text-slate-400 text-sm">{(cvFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              </motion.div>
            )}

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowCVUpload(false)}
                className="flex-1 bg-slate-700 text-white py-3 rounded-xl font-bold"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                disabled={!cvFile}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold disabled:opacity-50"
              >
                Upload & Analyze
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* CV Generator Modal */}
      {showCVGenerator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowCVGenerator(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-3xl p-8 max-w-3xl w-full border border-purple-500/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">AI CV Builder</h3>
                  <p className="text-slate-400">Create a professional CV with AI assistance</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowCVGenerator(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 rounded-xl p-6 cursor-pointer border border-slate-600"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Quick CV</h4>
                <p className="text-slate-400 text-sm mb-4">Generate a CV in 5 minutes using AI</p>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  AI-powered content generation
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-slate-800/50 rounded-xl p-6 cursor-pointer border border-slate-600"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Professional CV</h4>
                <p className="text-slate-400 text-sm mb-4">Detailed CV with expert guidance</p>
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Industry-specific templates
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowCVGenerator(false)}
                className="flex-1 bg-slate-700 text-white py-3 rounded-xl font-bold"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold"
              >
                Start Building
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default JobsPage;