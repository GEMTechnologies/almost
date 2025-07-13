import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { 
  Briefcase,
  Building,
  DollarSign,
  MapPin,
  Star,
  Clock,
  Heart,
  Search,
  Filter,
  ChevronRight,
  Target,
  TrendingUp,
  Zap,
  Trophy,
  Award,
  Rocket,
  Brain,
  Eye,
  Users,
  Globe,
  Sparkles,
  Crown,
  Gem,
  Flame,
  Lightning,
  CheckCircle,
  ArrowRight,
  Calendar,
  Timer,
  BookOpen,
  Code,
  Database,
  Camera,
  Palette,
  Music,
  Beaker,
  Microscope,
  Compass,
  Mountain,
  Shield,
  Diamond,
  Infinity,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
  Headphones,
  Gamepad2,
  Coffee,
  Laptop,
  Smartphone,
  Wifi,
  Signal,
  Battery,
  Bluetooth,
  Cpu,
  HardDrive,
  Monitor,
  Mouse,
  Keyboard,
  Printer,
  Scanner,
  Webcam,
  Microphone,
  Speaker,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Repeat,
  Shuffle,
  Radio,
  Tv,
  Film,
  Image,
  Video,
  FileText,
  File,
  Folder,
  Archive,
  Download,
  Upload,
  Share,
  Link,
  Copy,
  Cut,
  Paste,
  Save,
  Edit,
  Trash,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  X,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Settings,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Users2,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Inbox,
  Bell,
  BellRing,
  BellOff
} from 'lucide-react';

const JobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [careerLevel, setCareerLevel] = useState(2850);
  const [matchingJobs, setMatchingJobs] = useState(127);
  const [applicationSuccess, setApplicationSuccess] = useState(89);
  const [interviewStreak, setInterviewStreak] = useState(7);
  const [showFilters, setShowFilters] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const controls = useAnimation();

  useEffect(() => {
    // Animate career level on load
    controls.start({
      scale: [1, 1.15, 1],
      rotate: [0, 5, 0],
      transition: { duration: 0.8, delay: 1.2 }
    });
  }, [controls]);

  const heroMetrics = [
    { 
      label: 'Dream Jobs Available', 
      value: '2,847', 
      icon: Briefcase, 
      color: 'from-purple-500 to-pink-500',
      change: '+127 today',
      sparkle: true
    },
    { 
      label: 'AI Match Score', 
      value: '96%', 
      icon: Brain, 
      color: 'from-cyan-500 to-blue-500',
      change: '+12% this week',
      sparkle: true
    },
    { 
      label: 'Top Companies', 
      value: '1,200+', 
      icon: Building, 
      color: 'from-green-500 to-emerald-500',
      change: 'Global reach',
      sparkle: false
    },
    { 
      label: 'Avg Salary Boost', 
      value: '+45%', 
      icon: TrendingUp, 
      color: 'from-orange-500 to-red-500',
      change: 'vs current role',
      sparkle: true
    }
  ];

  const quickHunts = [
    {
      id: 'remote-tech',
      title: 'Remote Tech Giants',
      subtitle: 'Work from anywhere, earn anywhere',
      icon: Laptop,
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
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
      bgColor: 'bg-gradient-to-br from-pink-50 to-rose-50',
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
      bgColor: 'bg-gradient-to-br from-emerald-50 to-green-50',
      count: '456 missions',
      salary: '$45K - $90K',
      difficulty: '🌍 Global impact',
      trending: false,
      new: 12
    },
    {
      id: 'consulting-elite',
      title: 'Elite Consulting',
      subtitle: 'Strategy, analysis, leadership',
      icon: Crown,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50',
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
      description: 'Lead breakthrough AI research in computer vision and natural language processing. Shape the future of human-computer interaction.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Computer Vision'],
      logo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100&h=100&fit=crop&crop=center',
      featured: true,
      urgency: 'Hiring fast',
      matchScore: 98,
      applicants: 2847,
      responseRate: '24%',
      benefits: ['Stock options', 'Remote work', 'Learning budget', 'Health coverage'],
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
      description: 'Drive product strategy for Stripe\'s fastest-growing markets. Own the product roadmap for emerging payment solutions.',
      skills: ['Product Strategy', 'Data Analysis', 'A/B Testing', 'SQL', 'Figma'],
      logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop&crop=center',
      featured: true,
      urgency: 'Interview today',
      matchScore: 94,
      applicants: 1234,
      responseRate: '31%',
      benefits: ['Equity', 'Flexible hours', 'Gym membership', 'Travel stipend'],
      posted: '1 day ago',
      verified: true,
      trending: false
    },
    {
      id: 3,
      company: 'OpenAI',
      title: 'Machine Learning Engineer',
      location: 'Remote • Global',
      salary: '$160K - $280K',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Build and deploy large-scale ML systems that power next-generation AI applications. Work directly with GPT and beyond.',
      skills: ['Python', 'Kubernetes', 'AWS', 'Machine Learning', 'Distributed Systems'],
      logo: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&h=100&fit=crop&crop=center',
      featured: true,
      urgency: 'Limited spots',
      matchScore: 96,
      applicants: 3456,
      responseRate: '18%',
      benefits: ['Research time', 'Conference budget', 'Top-tier health', 'Sabbatical'],
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
      description: 'Design intuitive user experiences that millions of creators use daily. Shape the future of collaborative design tools.',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems', 'Interaction Design'],
      logo: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=100&h=100&fit=crop&crop=center',
      featured: true,
      urgency: 'Portfolio review',
      matchScore: 92,
      applicants: 1876,
      responseRate: '28%',
      benefits: ['Design budget', 'Remote setup', 'Wellness stipend', 'Stock options'],
      posted: '6 hours ago',
      verified: true,
      trending: false
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

  const FloatingParticle = ({ delay = 0, children }: { delay?: number; children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 0.6, 0],
        scale: [0, 1, 0],
        y: [-20, -60, -100],
        x: [0, Math.random() * 40 - 20, Math.random() * 80 - 40]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
        ease: "easeOut"
      }}
      className="absolute pointer-events-none"
    >
      {children}
    </motion.div>
  );

  const MatchScoreMeter = ({ score }: { score: number }) => (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-gray-300"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeDasharray={`${score * 0.628} 62.8`}
          className="text-green-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-green-500">{score}%</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 text-white overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2}>
            <div className="text-purple-300/10">
              {i % 4 === 0 && <Sparkles className="w-4 h-4" />}
              {i % 4 === 1 && <Zap className="w-3 h-3" />}
              {i % 4 === 2 && <Trophy className="w-5 h-5" />}
              {i % 4 === 3 && <Gem className="w-4 h-4" />}
            </div>
          </FloatingParticle>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-8 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Epic Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12"
          >
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-4 relative">
                  Career
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                  >
                    <Crown className="w-6 h-6 text-white" />
                  </motion.div>
                </h1>
                <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
                  Universe
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl md:text-3xl text-slate-300 font-light max-w-3xl leading-relaxed"
              >
                Where ambitious careers are born, nurtured, and legendary success stories begin
              </motion.p>
            </div>

            {/* Career Level System */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 lg:mt-0 bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-purple-500/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div 
                    animate={controls}
                    className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center relative"
                  >
                    <Trophy className="w-8 h-8 text-white" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-yellow-400/30 rounded-2xl"
                    />
                  </motion.div>
                  <div>
                    <p className="text-slate-300 text-lg">Career Level</p>
                    <motion.p 
                      animate={controls}
                      className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                    >
                      {careerLevel.toLocaleString()}
                    </motion.p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Flame className="w-5 h-5 text-orange-400" />
                    <span className="text-orange-400 font-semibold">{interviewStreak} interview streak!</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 font-semibold">{applicationSuccess}% success rate</span>
                  </div>
                </div>
              </div>
            </motion.div>
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
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                  z: 50,
                  transition: { duration: 0.2 }
                }}
                className={`relative group bg-gradient-to-r ${metric.color} p-[2px] rounded-3xl overflow-hidden`}
              >
                <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 h-full relative">
                  {metric.sparkle && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-2 right-2"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-2xl flex items-center justify-center relative overflow-hidden`}>
                      <metric.icon className="w-6 h-6 text-white relative z-10" />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-white/20 rounded-2xl"
                      />
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
                whileHover={{ scale: 1.05, rotateZ: 2 }}
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
                  initial={{ opacity: 0, y: 50, rotateX: -30 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 1.4 + index * 0.1, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    z: 50,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                  className={`${hunt.bgColor} border border-white/20 rounded-3xl p-6 cursor-pointer group relative overflow-hidden backdrop-blur-xl`}
                >
                  {/* Trending Badge */}
                  {hunt.trending && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      HOT
                    </div>
                  )}

                  {/* New Count */}
                  {hunt.new > 0 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      +{hunt.new} new
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-gradient-to-r ${hunt.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${hunt.color} rounded-2xl flex items-center justify-center shadow-2xl relative`}>
                        <hunt.icon className="w-8 h-8 text-white" />
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-2 border-white/30 rounded-2xl"
                        />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{hunt.title}</h3>
                    <p className="text-slate-600 text-sm mb-4">{hunt.subtitle}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-800">{hunt.count}</span>
                        <span className="text-lg font-bold text-green-600">{hunt.salary}</span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium">{hunt.difficulty}</div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:shadow-xl transition-shadow"
                    >
                      <Target className="w-4 h-4" />
                      Start Hunt
                    </motion.button>
                  </div>
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
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 backdrop-blur-xl rounded-2xl px-6 py-3 border border-green-500/30"
                >
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-green-400" />
                    <div>
                      <p className="text-green-400 font-bold">AI Matching</p>
                      <p className="text-xs text-green-300">Live updates</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 50, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 1.8 + index * 0.15, type: "spring" }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    rotateY: 2,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-slate-900/70 backdrop-blur-2xl rounded-3xl overflow-hidden border border-slate-700/50 group cursor-pointer relative"
                >
                  {/* Trending Indicator */}
                  {job.trending && (
                    <div className="absolute top-6 right-6 z-20">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-red-500 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping" />
                      </motion.div>
                    </div>
                  )}

                  {/* Featured Badge */}
                  {job.featured && (
                    <div className="absolute top-6 left-6 z-20 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      FEATURED
                    </div>
                  )}

                  <div className="p-8">
                    {/* Company Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-r from-slate-700 to-slate-800 flex items-center justify-center">
                        <img 
                          src={job.logo} 
                          alt={job.company}
                          className="w-full h-full object-cover"
                        />
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

                    {/* Job Details */}
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
                        {job.skills.slice(0, 4).map((skill) => (
                          <span key={skill} className="bg-slate-800/80 text-slate-300 px-3 py-1 rounded-lg text-xs font-medium border border-slate-700/50">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 4 && (
                          <span className="bg-slate-800/80 text-slate-400 px-3 py-1 rounded-lg text-xs">
                            +{job.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Match Score & Stats */}
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

                    {/* Quick Stats */}
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

                    {/* Urgency & Apply */}
                    <div className="flex items-center justify-between">
                      <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {job.urgency}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
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
            className="bg-gradient-to-r from-slate-900/80 to-purple-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-purple-500/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center relative">
                    <Trophy className="w-8 h-8 text-white" />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-yellow-400/30 rounded-2xl"
                    />
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
                      initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ delay: 2.2 + index * 0.1, type: "spring", stiffness: 100 }}
                      whileHover={{ 
                        scale: 1.1,
                        rotateY: 10,
                        z: 30,
                        transition: { duration: 0.2 }
                      }}
                      className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                        achievement.unlocked 
                          ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} border-transparent` 
                          : 'bg-slate-800/50 border-slate-700/50'
                      }`}
                    >
                      {achievement.unlocked && (
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
                        />
                      )}

                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative ${
                        achievement.unlocked 
                          ? 'bg-white/20 backdrop-blur' 
                          : 'bg-slate-700'
                      }`}>
                        <achievement.icon className={`w-8 h-8 ${
                          achievement.unlocked ? 'text-white' : 'text-slate-400'
                        }`} />
                        
                        {achievement.unlocked && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;