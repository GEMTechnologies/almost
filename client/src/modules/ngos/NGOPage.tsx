import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  FolderOpen, 
  Activity, 
  BarChart3, 
  Shield, 
  UserCheck, 
  DollarSign, 
  MessageSquare, 
  Library,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Heart,
  Target,
  Award,
  Calendar,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Download,
  Upload,
  Mail,
  Eye,
  ArrowLeft
} from 'lucide-react';

// Import all NGO modules
import DonorsModule from './components/DonorsModule';
import ProposalsModule from './components/ProposalsModule';
import DocumentationModule from './components/DocumentationModule';
import ProjectsModule from './components/ProjectsModule';
import MonitoringModule from './components/MonitoringModule';
import ComplianceModule from './components/ComplianceModule';
import StaffModule from './components/StaffModule';
import FinancialModule from './components/FinancialModule';
import CommunicationsModule from './components/CommunicationsModule';
import TemplatesModule from './components/TemplatesModule';
import GranadaNGODashboard from './components/GranadaNGODashboard';
import DonorDiscoverySystem from './components/DonorDiscoverySystem';

const NGOPage: React.FC = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const ngoModules = [
    {
      id: 'donor-discovery',
      title: 'System Donor Discovery',
      description: 'Intelligent funding opportunities matching and discovery',
      icon: Target,
      color: 'bg-blue-600',
      stats: { opportunities: '1,247', matches: '892', funding: '$847M' }
    },
    {
      id: 'donors',
      title: 'Donors Management',
      description: 'Manage donor profiles, track donations, generate receipts',
      icon: Heart,
      color: 'bg-red-500',
      stats: { donors: 245, donations: '$1.2M', receipts: 1834 }
    },
    {
      id: 'proposals',
      title: 'Proposal & Grant Management',
      description: 'Create proposals, track submissions, manage grant applications',
      icon: FileText,
      color: 'bg-blue-500',
      stats: { active: 12, submitted: 45, approved: 28 }
    },
    {
      id: 'documentation',
      title: 'Documentation & Policy Repository',
      description: 'Store organizational documents, policies, compliance files',
      icon: FolderOpen,
      color: 'bg-green-500',
      stats: { documents: 156, policies: 24, compliance: '98%' }
    },
    {
      id: 'projects',
      title: 'Project & Activity Management',
      description: 'Manage projects, track deliverables, monitor budgets',
      icon: Activity,
      color: 'bg-purple-500',
      stats: { active: 18, completed: 67, budget: '$3.2M' }
    },
    {
      id: 'monitoring',
      title: 'Monitoring & Evaluation (M&E)',
      description: 'Track indicators, evaluation reports, impact assessments',
      icon: BarChart3,
      color: 'bg-indigo-500',
      stats: { indicators: 89, reports: 34, impact: '45K lives' }
    },
    {
      id: 'compliance',
      title: 'Compliance & Risk Management',
      description: 'Manage compliance checklist, risk registry, audit preparation',
      icon: Shield,
      color: 'bg-orange-500',
      stats: { compliance: '96%', risks: 12, audits: 3 }
    },
    {
      id: 'staff',
      title: 'Volunteer & Staff Management',
      description: 'Manage staff directory, volunteers, HR processes',
      icon: UserCheck,
      color: 'bg-teal-500',
      stats: { staff: 45, volunteers: 120, training: '89%' }
    },
    {
      id: 'financial',
      title: 'Financial Oversight & Reporting',
      description: 'Financial reports, fund utilization, budget tracking',
      icon: DollarSign,
      color: 'bg-yellow-500',
      stats: { budget: '$2.8M', utilization: '78%', reports: 24 }
    },
    {
      id: 'communications',
      title: 'Communications & Outreach',
      description: 'Donor communications, newsletters, campaign management',
      icon: MessageSquare,
      color: 'bg-pink-500',
      stats: { campaigns: 15, emails: '12K', reach: '89K' }
    },
    {
      id: 'templates',
      title: 'Templates & Tools Library',
      description: 'Proposal templates, policy templates, standardized tools',
      icon: Library,
      color: 'bg-cyan-500',
      stats: { templates: 67, tools: 34, downloads: '2.4K' }
    }
  ];

  // Render specific module based on activeModule
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'donor-discovery': return <DonorDiscoverySystem onApply={(id) => console.log('Apply to opportunity:', id)} />;
      case 'donors': return <DonorsModule />;
      case 'proposals': return <ProposalsModule />;
      case 'documentation': return <DocumentationModule />;
      case 'projects': return <ProjectsModule />;
      case 'monitoring': return <MonitoringModule />;
      case 'compliance': return <ComplianceModule />;
      case 'staff': return <StaffModule />;
      case 'financial': return <FinancialModule />;
      case 'communications': return <CommunicationsModule />;
      case 'templates': return <TemplatesModule />;
      default: return null;
    }
  };

  // If a specific module is active, render it with its own navigation
  if (activeModule !== 'overview') {
    // For donor-discovery, use full screen layout without sidebar
    if (activeModule === 'donor-discovery') {
      return (
        <div>
          <div className="bg-slate-800 p-4">
            <button
              onClick={() => setActiveModule('overview')}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Granada Dashboard
            </button>
          </div>
          <DonorDiscoverySystem onApply={(id) => console.log('Apply to opportunity:', id)} />
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex">
          {/* NGO Module Sidebar */}
          <div className="w-80 bg-white shadow-lg border-r border-gray-200 h-screen sticky top-0">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <button
                onClick={() => setActiveModule('overview')}
                className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Overview
              </button>
              <h2 className="text-xl font-bold text-gray-900">NGO Management</h2>
              <p className="text-sm text-gray-600">Organizational Management System</p>
            </div>

            {/* Module Navigation */}
            <div className="p-4 space-y-2">
              {ngoModules.map((module) => {
                const isActive = activeModule === module.id;
                return (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      isActive 
                        ? `${module.color} text-white shadow-lg` 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <module.icon className="w-5 h-5" />
                    <div>
                      <p className="font-medium">{module.title}</p>
                      <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {module.description.slice(0, 40)}...
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="p-4 border-t border-gray-200 mt-auto">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Donors</span>
                  <span className="font-medium">245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compliance</span>
                  <span className="font-medium text-green-600">96%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6">
            {renderActiveModule()}
          </div>
        </div>
      </div>
    );
  }

  // If no active module, show the new Granada dashboard
  if (activeModule === 'overview') {
    return <GranadaNGODashboard onModuleSelect={setActiveModule} />;
  }

  return null;
};

export default NGOPage;