import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  Shield, 
  DollarSign, 
  BarChart3, 
  Heart, 
  FolderOpen, 
  Calendar, 
  CheckCircle, 
  X,
  Target,
  FileText,
  Users,
  Activity,
  MessageSquare,
  Plus
} from 'lucide-react';

interface GranadaNGODashboardProps {
  onModuleSelect: (moduleId: string) => void;
}

const GranadaNGODashboard: React.FC<GranadaNGODashboardProps> = ({ onModuleSelect }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Donor Discovery */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                GRANADA NGO DASHBOARD
              </h1>
              <p className="text-slate-400 text-lg">
                Last Login: {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Donor Discovery System - Main Feature */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">System Donor Discovery</h2>
                  <p className="text-blue-100">Intelligent funding opportunities matching</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Live System Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-6 h-6 text-blue-200" />
                  <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">+12 New</span>
                </div>
                <p className="text-2xl font-bold text-white">1,247</p>
                <p className="text-blue-200 text-sm">Active Opportunities</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-6 h-6 text-purple-200" />
                  <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">96%</span>
                </div>
                <p className="text-2xl font-bold text-white">892</p>
                <p className="text-purple-200 text-sm">System Matches</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-6 h-6 text-green-200" />
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">High</span>
                </div>
                <p className="text-2xl font-bold text-white">$847M</p>
                <p className="text-green-200 text-sm">Available Funding</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-6 h-6 text-yellow-200" />
                  <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full">Today</span>
                </div>
                <p className="text-2xl font-bold text-white">34</p>
                <p className="text-yellow-200 text-sm">Perfect Matches</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate('/donor-discovery')}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                Discover New Donors
              </button>
              <button className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                View System Analysis
              </button>
              <button 
                onClick={() => onModuleSelect('donors')}
                className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors flex items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Manage Donors
              </button>
            </div>
          </div>

          {/* Latest Donor Matches */}
          <div className="bg-slate-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Latest System Matches</h3>
              <span className="text-sm text-slate-400">Updated 2 minutes ago</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                onClick={() => navigate('/donor-discovery')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Bill & Melinda Gates Foundation</p>
                    <p className="text-sm text-slate-400">Global Health Initiative • 98% match</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">$2.5M - $5M</p>
                  <p className="text-xs text-slate-400">Deadline: Mar 15, 2025</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                onClick={() => navigate('/donor-discovery')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">USAID Development Innovation</p>
                    <p className="text-sm text-slate-400">Technology for Development • 94% match</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">$500K - $1.2M</p>
                  <p className="text-xs text-slate-400">Deadline: Feb 28, 2025</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer"
                onClick={() => navigate('/donor-discovery')}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Ford Foundation</p>
                    <p className="text-sm text-slate-400">Social Justice Program • 91% match</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">$100K - $300K</p>
                  <p className="text-xs text-slate-400">Deadline: Apr 10, 2025</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/donor-discovery')}
              className="w-full mt-4 text-blue-400 hover:text-blue-300 font-medium py-2 border border-slate-600 rounded-lg hover:border-slate-500 transition-colors"
            >
              View All 34 Perfect Matches →
            </button>
          </div>
        </motion.div>

        {/* Quick Access Tools - Including Documents & Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <button 
            onClick={() => navigate('/ngodocument')}
            className="bg-teal-600 hover:bg-teal-700 p-4 rounded-xl transition-colors text-left"
          >
            <FolderOpen className="w-8 h-8 text-white mb-2" />
            <p className="font-semibold text-white">NGO Documents</p>
            <p className="text-teal-200 text-sm">Manage all documents</p>
          </button>
          <button 
            onClick={() => navigate('/projects')}
            className="bg-indigo-600 hover:bg-indigo-700 p-4 rounded-xl transition-colors text-left"
          >
            <Activity className="w-8 h-8 text-white mb-2" />
            <p className="font-semibold text-white">NGO Pipeline</p>
            <p className="text-indigo-200 text-sm">Project pipeline flow</p>
          </button>
          <button 
            onClick={() => onModuleSelect('donors')}
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded-xl transition-colors text-left"
          >
            <Plus className="w-8 h-8 text-white mb-2" />
            <p className="font-semibold text-white">Add New Donor</p>
            <p className="text-blue-200 text-sm">Register donor profile</p>
          </button>
          <button 
            onClick={() => navigate('/donor-discovery')}
            className="bg-purple-600 hover:bg-purple-700 p-4 rounded-xl transition-colors text-left"
          >
            <Target className="w-8 h-8 text-white mb-2" />
            <p className="font-semibold text-white">System Search</p>
            <p className="text-purple-200 text-sm">Find new opportunities</p>
          </button>
          <button 
            onClick={() => onModuleSelect('proposals')}
            className="bg-green-600 hover:bg-green-700 p-4 rounded-xl transition-colors text-left"
          >
            <FileText className="w-8 h-8 text-white mb-2" />
            <p className="font-semibold text-white">Create Proposal</p>
            <p className="text-green-200 text-sm">Draft new application</p>
          </button>
          <button 
            onClick={() => onModuleSelect('communications')}
            className="bg-orange-600 hover:bg-orange-700 p-4 rounded-xl transition-colors text-left"
          >
            <MessageSquare className="w-8 h-8 text-white mb-2" />
            <p className="font-semibold text-white">Communications</p>
            <p className="text-orange-200 text-sm">Donor outreach</p>
          </button>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Pending Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-750 transition-colors cursor-pointer"
            onClick={() => onModuleSelect('compliance')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Pending Actions</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>2 Policies Expired</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>1 Grant Due in 3 Days</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>3 Staff Contracts Ending</span>
              </div>
            </div>
          </motion.div>

          {/* Policy Compliance Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-750 transition-colors cursor-pointer"
            onClick={() => onModuleSelect('documentation')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Policy Compliance Tracker</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white">Code of Conduct</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-400" />
                <span className="text-white">Financial Policy <span className="text-red-400">(expired)</span></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white">Anti-Harassment</span>
              </div>
            </div>
          </motion.div>

          {/* Financial Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-750 transition-colors cursor-pointer"
            onClick={() => onModuleSelect('financial')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Financial Overview</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-slate-400 mb-1">Total Donations: $28,500</div>
                <div className="text-slate-400 mb-1">Expenses This Month: 9K</div>
                <div className="text-slate-400 mb-2">Fund Utilization: 76%</div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* M&E Snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-750 transition-colors cursor-pointer"
            onClick={() => onModuleSelect('monitoring')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">M&E Snapshot</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white">Projects: 4 Active</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white">Indicators On Track: 85%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white">Last Report: July 10, 2025</span>
              </div>
            </div>
          </motion.div>

          {/* Donors Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-750 transition-colors cursor-pointer"
            onClick={() => onModuleSelect('donors')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Donors Summary</h3>
            </div>
            <div className="space-y-2 text-sm text-white">
              <div>Top Donor: EU Delegation</div>
              <div>New This Month: 3</div>
              <div>Recurring Donors: 5</div>
            </div>
          </motion.div>

          {/* Key Documents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-750 transition-colors cursor-pointer"
            onClick={() => onModuleSelect('documentation')}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Key Documents</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white">Constitution</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-4 h-4 text-red-400" />
                <span className="text-white">AML Policy <span className="text-red-400">(Missing)</span></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-white">Board Minutes July</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Upcoming Deadlines - Wide Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Upcoming Deadlines</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white">
            <div>Grant Proposal: Jul 15</div>
            <div>M&E Report Due: Jul 20</div>
            <div>Staff Appraisals: Jul 30</div>
          </div>
        </motion.div>

        {/* Quick Access Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800 border border-slate-700 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Quick Access Modules</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { id: 'donors', icon: Heart, label: 'Donors', color: 'bg-red-500' },
              { id: 'proposals', icon: FileText, label: 'Proposals', color: 'bg-blue-500' },
              { id: 'projects', icon: Activity, label: 'Projects', color: 'bg-purple-500' },
              { id: 'staff', icon: Users, label: 'Staff', color: 'bg-teal-500' },
              { id: 'communications', icon: MessageSquare, label: 'Communications', color: 'bg-pink-500' }
            ].map((module, index) => (
              <motion.button
                key={module.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                onClick={() => onModuleSelect(module.id)}
                className="flex flex-col items-center gap-2 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <div className={`w-10 h-10 ${module.color} rounded-full flex items-center justify-center`}>
                  <module.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm text-white">{module.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GranadaNGODashboard;