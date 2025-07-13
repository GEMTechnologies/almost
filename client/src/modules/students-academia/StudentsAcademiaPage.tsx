import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { 
  Award, 
  BookOpen, 
  Search, 
  Users, 
  GraduationCap,
  Calendar,
  DollarSign,
  MapPin,
  Filter,
  Star,
  Target,
  TrendingUp,
  Zap,
  Globe,
  Brain,
  Lightbulb,
  Trophy,
  Rocket,
  Sparkles,
  Heart,
  Eye,
  ArrowRight,
  Play,
  CheckCircle,
  Book,
  Beaker,
  Briefcase,
  Timer,
  Database,
  Code,
  Camera,
  Music,
  Palette,
  Mountain,
  Compass,
  ChevronRight,
  Clock
} from 'lucide-react';

const StudentsAcademiaPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [achievementPoints, setAchievementPoints] = useState(2850);
  const [streakDays, setStreakDays] = useState(14);
  const [floatingElements, setFloatingElements] = useState(true);
  const controls = useAnimation();

  useEffect(() => {
    // Animate achievement counter on load
    controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: 0.5, delay: 1 }
    });
  }, [controls]);

  const heroStats = [
    { label: 'Active Students', value: '50K+', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Scholarships', value: '1,200+', icon: Award, color: 'from-blue-500 to-cyan-500' },
    { label: 'Research Projects', value: '850+', icon: Beaker, color: 'from-green-500 to-emerald-500' },
    { label: 'Success Rate', value: '94%', icon: Target, color: 'from-orange-500 to-red-500' }
  ];

  const quickActions = [
    { 
      id: 'scholarships', 
      title: 'Find Scholarships',
      subtitle: 'AI-matched funding opportunities',
      icon: Award,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-r from-yellow-50 to-orange-50',
      count: '127 new',
      action: 'Browse Now'
    },
    { 
      id: 'courses', 
      title: 'Study Programs',
      subtitle: 'Courses from top universities',
      icon: BookOpen,
      color: 'from-blue-400 to-indigo-500',
      bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50',
      count: '89 available',
      action: 'Explore'
    },
    { 
      id: 'research', 
      title: 'Research Hub',
      subtitle: 'Collaborate on cutting-edge projects',
      icon: Beaker,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-gradient-to-r from-green-50 to-emerald-50',
      count: '45 active',
      action: 'Join'
    },
    { 
      id: 'mentoring', 
      title: 'Expert Mentors',
      subtitle: '1-on-1 guidance from industry leaders',
      icon: Users,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
      count: '234 mentors',
      action: 'Connect'
    }
  ];

  const featuredOpportunities = [
    {
      id: 1,
      type: 'scholarship',
      title: 'Global Innovation Scholarship',
      provider: 'Tech Leaders Foundation',
      amount: '$50,000',
      deadline: '15 days left',
      difficulty: 'Competitive',
      description: 'Full scholarship for outstanding students in STEM fields with innovative project ideas.',
      tags: ['STEM', 'Innovation', 'Global'],
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop',
      rating: 4.9,
      applicants: 1250,
      successRate: '12%',
      verified: true
    },
    {
      id: 2,
      type: 'research',
      title: 'AI Ethics Research Position',
      provider: 'Future Labs Institute',
      amount: '$3,500/month',
      deadline: '8 days left',
      difficulty: 'Advanced',
      description: 'Paid research position exploring ethical implications of AI in healthcare and education.',
      tags: ['AI', 'Ethics', 'Healthcare'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
      rating: 4.8,
      applicants: 89,
      successRate: '25%',
      verified: true
    },
    {
      id: 3,
      type: 'course',
      title: 'Advanced Data Science Bootcamp',
      provider: 'DataMax Academy',
      amount: 'Free',
      deadline: 'Rolling admission',
      difficulty: 'Intermediate',
      description: 'Intensive 12-week program covering machine learning, statistical analysis, and big data.',
      tags: ['Data Science', 'ML', 'Analytics'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop',
      rating: 4.7,
      applicants: 2340,
      successRate: '78%',
      verified: true
    }
  ];

  const achievements = [
    { name: 'First Application', icon: Trophy, unlocked: true, points: 50 },
    { name: 'Research Explorer', icon: Beaker, unlocked: true, points: 100 },
    { name: 'Scholarship Hunter', icon: Award, unlocked: true, points: 150 },
    { name: 'Knowledge Seeker', icon: Brain, unlocked: false, points: 200 },
    { name: 'Innovation Master', icon: Lightbulb, unlocked: false, points: 300 },
    { name: 'Global Scholar', icon: Globe, unlocked: false, points: 500 }
  ];

  const FloatingElement = ({ delay = 0, children }: { delay?: number; children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: [0.3, 0.7, 0.3],
        y: [-10, -20, -10],
        rotate: [0, 5, 0]
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute pointer-events-none"
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden relative">
      {/* Floating Background Elements */}
      {floatingElements && (
        <>
          <FloatingElement delay={0}>
            <div className="absolute top-20 left-10 text-purple-300/20">
              <Sparkles className="w-12 h-12" />
            </div>
          </FloatingElement>
          <FloatingElement delay={1}>
            <div className="absolute top-40 right-20 text-blue-300/20">
              <Brain className="w-16 h-16" />
            </div>
          </FloatingElement>
          <FloatingElement delay={2}>
            <div className="absolute bottom-40 left-32 text-green-300/20">
              <Rocket className="w-14 h-14" />
            </div>
          </FloatingElement>
          <FloatingElement delay={0.5}>
            <div className="absolute top-60 right-40 text-yellow-300/20">
              <Lightbulb className="w-10 h-10" />
            </div>
          </FloatingElement>
        </>
      )}

      {/* Hero Section */}
      <div className="relative z-10 pt-8 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Achievement System */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
          >
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4"
              >
                Student Universe
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl"
              >
                Your gateway to unlimited opportunities, scholarships, and academic excellence
              </motion.p>
            </div>

            {/* Achievement Panel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 md:mt-0 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-300">Achievement Points</p>
                  <motion.p 
                    animate={controls}
                    className="text-2xl font-bold text-yellow-400"
                  >
                    {achievementPoints.toLocaleString()}
                  </motion.p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-semibold">{streakDays} day streak!</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16"
          >
            {heroStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                  transition: { duration: 0.2 }
                }}
                className={`relative group bg-gradient-to-r ${stat.color} p-[1px] rounded-2xl overflow-hidden`}
              >
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotateX: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                className={`${action.bgColor} border border-white/10 rounded-2xl p-6 cursor-pointer group relative overflow-hidden backdrop-blur-xl`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs bg-white/20 backdrop-blur text-slate-800 px-2 py-1 rounded-full font-medium">
                      {action.count}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{action.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{action.subtitle}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">{action.action}</span>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Opportunities */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  🔥 Trending Opportunities
                </h2>
                <p className="text-slate-400">Hand-picked for ambitious students like you</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
              >
                View All <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + index * 0.1 }}
                  whileHover={{ 
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  className="bg-slate-900/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={opportunity.image} 
                      alt={opportunity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    
                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        opportunity.type === 'scholarship' ? 'bg-yellow-500 text-yellow-900' :
                        opportunity.type === 'research' ? 'bg-green-500 text-green-900' :
                        'bg-blue-500 text-blue-900'
                      }`}>
                        {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                      </span>
                    </div>

                    {/* Verified Badge */}
                    {opportunity.verified && (
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Deadline */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-red-500/90 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {opportunity.deadline}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                        {opportunity.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-slate-400">{opportunity.rating}</span>
                      </div>
                    </div>

                    <p className="text-purple-400 font-semibold mb-2">{opportunity.provider}</p>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{opportunity.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {opportunity.tags.map((tag) => (
                        <span key={tag} className="bg-slate-800 text-slate-300 px-2 py-1 rounded-lg text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-green-400">{opportunity.amount}</div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">{opportunity.applicants} applicants</p>
                        <p className="text-xs text-slate-400">Success: {opportunity.successRate}</p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg transition-shadow"
                    >
                      <Play className="w-4 h-4" />
                      Apply Now
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievement System */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="bg-gradient-to-r from-slate-900/50 to-purple-900/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Your Achievement Journey</h3>
                <p className="text-slate-400">Unlock rewards as you progress</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
                      : 'bg-slate-800/50 border-slate-700/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                      : 'bg-slate-700'
                  }`}>
                    <achievement.icon className={`w-6 h-6 ${
                      achievement.unlocked ? 'text-white' : 'text-slate-400'
                    }`} />
                  </div>
                  <h4 className={`text-sm font-semibold mb-1 ${
                    achievement.unlocked ? 'text-white' : 'text-slate-400'
                  }`}>
                    {achievement.name}
                  </h4>
                  <p className={`text-xs ${
                    achievement.unlocked ? 'text-yellow-400' : 'text-slate-500'
                  }`}>
                    {achievement.points} pts
                  </p>
                  
                  {achievement.unlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentsAcademiaPage;