import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Award,
  DollarSign,
  Clock,
  FileText,
  Search,
  Brain,
  Target,
  Sparkles,
  Play,
  ChevronDown,
  Menu,
  X,
  Building
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Dr. Sarah Kimani",
      role: "Executive Director, Education Foundation Kenya",
      image: "👩‍💼",
      quote: "Granada OS revolutionized our funding strategy. The expert-powered proposal generator helped us secure $2.3M for East African education initiatives in just 3 months!",
      amount: "$2.3M",
      verified: true,
      organization: "Education Foundation Kenya"
    },
    {
      name: "Michael Ochieng",
      role: "Healthcare Program Director, Kampala Medical Center",
      image: "👨‍⚕️",
      quote: "The intelligent funding discovery found 23 perfect opportunities we never knew existed. Granada OS saved us 6 months of research and landed us major WHO grants.",
      amount: "$1.8M",
      verified: true,
      organization: "Kampala Medical Center"
    },
    {
      name: "Grace Wanjiku",
      role: "CEO, Rural Development Consortium",
      image: "👩‍🌾",
      quote: "Granada's expert proposal intelligence transformed our grant applications. We went from 15% to 82% success rate. The ROI is incredible!",
      amount: "$3.4M",
      verified: true,
      organization: "Rural Development Consortium"
    },
    {
      name: "Prof. David Musoke",
      role: "Research Director, Makerere Innovation Hub",
      image: "👨‍🔬",
      quote: "As a research institution, Granada OS is our secret weapon. The expert system understands complex funding landscapes and delivers results that surpass human capabilities.",
      amount: "$4.7M",
      verified: true,
      organization: "Makerere University"
    },
    {
      name: "Amina Hassan",
      role: "Founder, Women Empowerment Initiative",
      image: "👩‍💼",
      quote: "Granada's expert intelligence helped us navigate international funding successfully. From USAID to Gates Foundation - we're now a recognized leader in our sector.",
      amount: "$2.1M",
      verified: true,
      organization: "Women Empowerment Initiative"
    }
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Intelligent Funding Discovery",
      description: "Expert-powered bots continuously monitor 2,500+ global funding sources including Gates Foundation, USAID, World Bank, EU Commission, and regional development funds to discover opportunities perfectly matched to your organization.",
      color: "from-blue-500 to-cyan-500",
      stats: "2,500+ Sources Monitored"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Expert Proposal Generator",
      description: "Generate comprehensive 40+ page professional proposals using advanced DeepSeek AI. Complete funding applications with executive summaries, detailed budgets, implementation timelines, and risk assessments in minutes.",
      color: "from-purple-500 to-pink-500",
      stats: "40+ Page Documents"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Precision Opportunity Matching",
      description: "Advanced expert algorithms analyze your organization's sector, location, budget requirements, and historical performance to match you with high-probability funding opportunities with 92% accuracy rate.",
      color: "from-emerald-500 to-teal-500",
      stats: "92% Match Accuracy"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Proposal Intelligence & Analysis",
      description: "Upload existing proposals for expert analysis, competitive positioning, optimization recommendations, and success probability scoring. Get detailed insights on strengths, weaknesses, and improvement strategies.",
      color: "from-orange-500 to-red-500",
      stats: "Expert-Level Analysis"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Due Diligence & Verification",
      description: "Every funding opportunity undergoes rigorous verification. We validate donor legitimacy, check application requirements, verify deadlines, and ensure opportunities are authentic and accessible.",
      color: "from-red-500 to-pink-500",
      stats: "100% Verified Opportunities"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global & Regional Focus",
      description: "Specialized coverage of East African funding landscape including Kenya, Uganda, Tanzania, Rwanda, and South Sudan. Plus comprehensive international opportunities from major global development organizations.",
      color: "from-indigo-500 to-purple-500",
      stats: "Global + Regional Coverage"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Organizations Served", icon: <Users className="w-6 h-6" />, description: "NGOs, Universities, Hospitals, Research Centers" },
    { number: "78%", label: "Funding Success Rate", icon: <TrendingUp className="w-6 h-6" />, description: "Industry-leading grant approval rate" },
    { number: "$247M+", label: "Funding Secured", icon: <DollarSign className="w-6 h-6" />, description: "Total funding obtained through Granada OS" },
    { number: "2,500+", label: "Funding Sources", icon: <Globe className="w-6 h-6" />, description: "Global and regional donor organizations" }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$25",
      originalPrice: "$25",
      period: "/month",
      description: "Perfect for small organizations getting started",
      features: [
        "100 opportunity searches",
        "5 AI proposal generations",
        "Basic matching algorithm",
        "Email support",
        "Standard templates"
      ],
      highlighted: false,
      coupon: "WELCOME20"
    },
    {
      name: "Professional",
      price: "$75",
      originalPrice: "$150",
      period: "/month",
      description: "Ideal for growing organizations",
      features: [
        "Unlimited opportunity searches",
        "25 AI proposal generations",
        "Advanced matching & analytics",
        "Priority support",
        "All premium templates",
        "Document intelligence",
        "Competitive analysis"
      ],
      highlighted: true,
      coupon: "SAVE99"
    },
    {
      name: "Enterprise",
      price: "$200",
      originalPrice: "$400",
      period: "/month",
      description: "For large organizations and institutions",
      features: [
        "Everything in Professional",
        "Unlimited AI generations",
        "Custom bot configurations",
        "Dedicated success manager",
        "White-label options",
        "API access",
        "Custom integrations"
      ],
      highlighted: false,
      coupon: "SAVE50"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center"
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Granada OS
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Success Stories
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
              >
                Get Started
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-4"
              >
                <button
                  onClick={() => scrollToSection('features')}
                  className="block w-full text-left px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="block w-full text-left px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="block w-full text-left px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  Success Stories
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="block w-full text-left px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                >
                  Get Started
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI-Powered Funding Platform</span>
                </motion.div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Transform Your Funding Success with
                  <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    {" "}Expert Intelligence
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  The most comprehensive funding intelligence platform for NGOs, universities, hospitals, research institutions, and development organizations across East Africa and globally. Discover hidden opportunities, generate expert-level proposals, and multiply your funding success rate with Granada OS.
                </p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">24/7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Expert Monitoring</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">40+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Page Proposals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">5 Min</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Setup Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">92%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Match Accuracy</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold text-lg shadow-lg"
                >
                  <span>Start Finding Funding</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection('features')}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-semibold text-lg"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </motion.button>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 text-center group hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all"
                  >
                    <div className="flex items-center justify-center mb-3 text-emerald-600 group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{stat.label}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{stat.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-xl opacity-20"></div>
                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-20"></div>
                
                <div className="relative space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">AI Analysis Complete</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Found 47 matching opportunities</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Gates Foundation Grant</span>
                      </div>
                      <span className="text-sm text-green-600 font-semibold">98% Match</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">USAID Innovation Fund</span>
                      </div>
                      <span className="text-sm text-blue-600 font-semibold">95% Match</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">World Bank Initiative</span>
                      </div>
                      <span className="text-sm text-purple-600 font-semibold">92% Match</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-cyan-600 transition-all">
                    Generate Winning Proposals
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Funding Success
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to discover, apply, and secure funding opportunities with expert-level intelligence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all group overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${feature.color} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="relative">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <div className={`inline-block px-3 py-1 bg-gradient-to-r ${feature.color} text-white text-xs font-semibold rounded-full`}>
                      {feature.stats}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Hover Effect Arrow */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className={`w-5 h-5 text-gradient-to-r ${feature.color.split(' ')[0]} ${feature.color.split(' ')[2]}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Success Stories from Our Community
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Real results from organizations using Granada OS
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-gray-900 rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
                  <div className="flex-shrink-0 relative">
                    <div className="w-32 h-32 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-5xl shadow-2xl">
                      {testimonials[currentTestimonial].image}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                      <span className="ml-2 text-gray-600 dark:text-gray-400 text-sm">5.0 out of 5</span>
                    </div>
                    
                    <blockquote className="text-2xl lg:text-3xl text-gray-900 dark:text-white font-medium leading-relaxed mb-8">
                      "{testimonials[currentTestimonial].quote}"
                    </blockquote>
                    
                    <div className="flex flex-col lg:flex-row items-center lg:items-end justify-center lg:justify-between">
                      <div className="text-center lg:text-left">
                        <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 mb-2">
                          {testimonials[currentTestimonial].role}
                        </div>
                        <div className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300">
                          <Users className="w-4 h-4 mr-2" />
                          {testimonials[currentTestimonial].organization}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-center lg:items-end mt-6 lg:mt-0">
                        <div className="text-4xl font-bold text-emerald-600 mb-2">
                          {testimonials[currentTestimonial].amount}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Verified Result</span>
                          </div>
                          <div className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-medium">
                            Secured
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation */}
            <div className="flex items-center justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'bg-emerald-600 w-8'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Start securing funding today with our special promotional pricing
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Limited Time: Up to 99% Off with code SAVE99</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 transition-all ${
                  plan.highlighted
                    ? 'border-emerald-500 shadow-xl'
                    : 'border-gray-200 dark:border-gray-700 shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {plan.period}
                      </span>
                    </div>
                    {plan.originalPrice !== plan.price && (
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-lg text-gray-500 line-through">
                          {plan.originalPrice}
                        </span>
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 text-xs rounded-full font-medium">
                          Use {plan.coupon}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/credits-purchase/${plan.name.toLowerCase()}`)}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                  }`}
                >
                  Get Started
                </motion.button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              All plans include 30-day money-back guarantee
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Shield className="w-5 h-5" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-5 h-5" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Award className="w-5 h-5" />
                <span>SOC 2 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Secure Your Next Grant?
            </h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Join 50,000+ organizations already using Granada OS to discover funding opportunities and generate winning proposals
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-white text-emerald-600 rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg shadow-lg"
              >
                Start Free Trial
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('features')}
                className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-emerald-600 transition-all font-semibold text-lg"
              >
                Learn More
              </motion.button>
            </div>
            
            <p className="text-emerald-100 text-sm">
              No credit card required • Setup takes 2 minutes • 30-day money-back guarantee
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Granada OS</span>
            </div>
            
            <div className="flex items-center space-x-6 text-gray-400">
              <span>© 2024 Granada OS. All rights reserved.</span>
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Support</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;