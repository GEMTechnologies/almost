import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IntelligentAssistantUI, AssistantFloatingButton } from './shared/IntelligentAssistantUI';
import { intelligentAssistant } from './modules/ai/services/intelligentAssistant';
import Header from './shared/Header';
import Sidebar from './shared/Sidebar';
import MobileNavigation from './shared/MobileNavigation';

// Landing and Onboarding
import LandingPage from './modules/landing/LandingPage';
import OnboardingChat from './modules/onboarding/OnboardingChat';

// Dashboards
import Dashboard from './modules/dashboard/Dashboard';
import DonorDashboard from './modules/dashboard/DonorDashboard';
import StudentDashboard from './modules/dashboard/StudentDashboard';
import DashboardPage from './modules/dashboard/DashboardPage';

// Proposals
import ProposalManager from './modules/proposals/ProposalManager';
import ProposalGenerator from './modules/proposals/ProposalGenerator';
import ProjectManager from './modules/proposals/ProjectManager';
import NGOPipeline from './modules/proposals/NGOPipeline';

// Donors
import DonorDiscovery from './modules/donors/DonorDiscovery';

// NGO Management
import NGOPage from './modules/ngos/NGOPage';
import NGODocumentSystem from './modules/ngos/components/documents/NGODocumentSystem';
import NGOPipelineSystem from './modules/ngos/components/pipeline/NGOPipelineSystem';

// New modular pages
import StudentsAcademiaPage from './modules/students-academia/StudentsAcademiaPage';
import JobsPage from './modules/jobs/JobsPage';
import BusinessPage from './modules/business/BusinessPage';

// Billing System
import { BillingDashboard, BillingHistory, UserDashboard } from './modules/billing';

// Legacy Payment (keeping for compatibility)
import CreditsPurchase from './modules/payment/CreditsPurchase';
import CreditsPage from './modules/payment/CreditsPage';
import PurchasePage from './modules/payment/PurchasePage';

// Other Pages
import AIAssistant from './modules/ai/AIAssistant';
import Settings from './modules/settings/Settings';
import Funding from './modules/funding/Funding';
import Documents from './modules/documents/Documents';
import Analytics from './modules/analytics/Analytics';
import HumanHelpPage from './modules/help/HumanHelpPage';
import HumanHelpButton from './shared/HumanHelpButton';

import AddictionProvider from './contexts/AddictionContext';
import { AuthProvider } from './contexts/AuthContext';
import { OpportunityProvider } from './contexts/OpportunityContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client outside of component to avoid recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  // Initialize intelligent assistant
  useEffect(() => {
    // Activate the intelligent assistant after component mounts
    intelligentAssistant.setActive(true);
    return () => {
      intelligentAssistant.setActive(false);
    };
  }, []);
  
  // Check if user needs onboarding - DISABLED for testing
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  
  useEffect(() => {
    // Onboarding disabled - users can access features directly
    setNeedsOnboarding(false);
    
    // Set demo completion status
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('granadaUserData', JSON.stringify({
      fullName: 'Demo User',
      email: 'demo@example.com',
      organizationName: 'Test Organization',
      organizationType: 'NGO'
    }));
  }, []);

  // For development, bypass auth and provide default user
  const mockUser = { 
    id: 'demo_user',
    userType: 'ngo', 
    email: 'demo@example.com',
    firstName: 'Demo',
    lastName: 'User',
    country: 'UG',
    sector: 'Health',
    organizationType: 'NGO'
  };
  const isAuthenticated = true;

  // Check if user is a student
  const isStudent = mockUser?.userType === 'student';

  // Show onboarding for first-time visitors
  if (needsOnboarding) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AddictionProvider>
            <OnboardingChat />
          </AddictionProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OpportunityProvider>
          <AddictionProvider>
          <div className="min-h-screen safari-fix" style={{ background: 'var(--theme-background)' }}>
            <Header />
            
            <div className="flex">
              <Sidebar 
                collapsed={sidebarCollapsed} 
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
              />
              
              <main className={`flex-1 transition-all duration-300 pt-16 ${
                sidebarCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-64'
              }`}>
                <Routes>
                  {/* NGOs as main landing dashboard */}
                  <Route path="/" element={<NGOPage />} />
                  <Route path="/NGOs" element={<NGOPage />} />
                  
                  {/* Original routes for backward compatibility */}
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/onboard" element={<OnboardingChat />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/donor-dashboard" element={<DonorDashboard />} />
                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                  <Route path="/student" element={<StudentDashboard />} />
                  
                  {/* New modular navigation routes */}
                  <Route path="/donor-discovery" element={<DonorDiscovery />} />
                  <Route path="/students-academia" element={<StudentsAcademiaPage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/business" element={<BusinessPage />} />
                  <Route path="/projects" element={<ProjectManager />} />
                  <Route path="/ngodocument" element={<NGODocumentSystem />} />
                  <Route path="/ngopipeline" element={<NGOPipelineSystem />} />
                  
                  {/* Existing functionality routes */}
                  <Route path="/proposal-generator" element={<ProposalGenerator />} />
                  <Route path="/proposals" element={<ProposalManager />} />
                  <Route path="/projects" element={<ProjectManager />} />
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  <Route path="/human-help" element={<HumanHelpPage />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/funding" element={<Funding />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/analytics" element={<Analytics />} />
                  
                  {/* New Billing System */}
                  <Route path="/billing" element={<BillingDashboard />} />
                  <Route path="/billing/dashboard" element={<UserDashboard />} />
                  <Route path="/billing/history" element={<BillingHistory />} />
                  
                  {/* Legacy Credits (redirects to billing) */}
                  <Route path="/credits" element={<BillingDashboard />} />
                  <Route path="/credits-mobile" element={<BillingDashboard />} />
                  <Route path="/purchase/:packageId" element={<PurchasePage />} />
                  <Route path="/credits-purchase/:packageId" element={<CreditsPurchase />} />
                  <Route path="/ngo-pipeline" element={<NGOPipeline />} />
                </Routes>
              </main>
            </div>
            
            {/* Mobile Navigation */}
            <MobileNavigation />
            
            {/* Human Help Button */}
            <HumanHelpButton />
            
            {/* Intelligent Assistant System */}
            <IntelligentAssistantUI />
            <AssistantFloatingButton />
          </div>
          </AddictionProvider>
        </OpportunityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;