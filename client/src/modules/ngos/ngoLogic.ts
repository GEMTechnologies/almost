// NGO Management Logic and Data Structures

// 1. Donors Management
export interface Donor {
  id: string;
  name: string;
  type: 'individual' | 'corporate' | 'institution' | 'foundation';
  email: string;
  phone: string;
  address: string;
  country: string;
  totalDonations: number;
  lastDonation: string;
  donationHistory: Donation[];
  preferences: DonorPreferences;
  communicationLog: CommunicationLog[];
  status: 'active' | 'inactive' | 'pending';
  tags: string[];
  relationship: 'major' | 'regular' | 'new' | 'lapsed';
}

export interface Donation {
  id: string;
  donorId: string;
  amount: number;
  currency: string;
  date: string;
  purpose: string;
  projectId?: string;
  method: 'bank_transfer' | 'credit_card' | 'mobile_money' | 'check' | 'cash';
  receiptNumber: string;
  thankYouSent: boolean;
  taxDeductible: boolean;
}

export interface DonorPreferences {
  communicationFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annual';
  preferredContact: 'email' | 'phone' | 'mail';
  interestAreas: string[];
  anonymousGiving: boolean;
}

export interface CommunicationLog {
  id: string;
  donorId: string;
  type: 'email' | 'phone' | 'meeting' | 'letter';
  subject: string;
  content: string;
  date: string;
  outcome: string;
  followUpRequired: boolean;
}

// 2. Proposal & Grant Management
export interface Proposal {
  id: string;
  title: string;
  donorName: string;
  donorType: 'EU' | 'UN' | 'USAID' | 'Gates' | 'Ford' | 'Other';
  amount: number;
  currency: string;
  submissionDate: string;
  deadline: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  description: string;
  objectives: string[];
  activities: Activity[];
  budget: Budget;
  logframe: Logframe;
  documents: Document[];
  team: TeamMember[];
  timeline: Timeline[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  responsible: string;
  deliverables: string[];
  status: 'planned' | 'ongoing' | 'completed' | 'delayed';
}

export interface Budget {
  totalAmount: number;
  categories: BudgetCategory[];
  indirect: number;
  direct: number;
}

export interface BudgetCategory {
  name: string;
  amount: number;
  percentage: number;
  subcategories: BudgetSubcategory[];
}

export interface BudgetSubcategory {
  name: string;
  amount: number;
  justification: string;
}

export interface Logframe {
  goal: string;
  outcomes: Outcome[];
  outputs: Output[];
  assumptions: string[];
}

export interface Outcome {
  description: string;
  indicators: Indicator[];
  targets: string[];
}

export interface Output {
  description: string;
  indicators: Indicator[];
  activities: string[];
}

export interface Indicator {
  name: string;
  baseline: string;
  target: string;
  meansOfVerification: string;
  frequency: string;
}

// 3. Documentation & Policy Repository
export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  type: string;
  uploadDate: string;
  expiryDate?: string;
  version: string;
  status: 'active' | 'expired' | 'draft' | 'archived';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approver?: string;
  fileUrl: string;
  tags: string[];
  description: string;
  reminders: Reminder[];
}

export type DocumentCategory = 
  | 'organizational'
  | 'policies'
  | 'staff'
  | 'financial'
  | 'compliance'
  | 'projects'
  | 'legal'
  | 'governance';

export interface Reminder {
  id: string;
  documentId: string;
  type: 'expiry' | 'review' | 'renewal';
  date: string;
  sent: boolean;
  recipient: string;
}

// 4. Project & Activity Management
export interface Project {
  id: string;
  name: string;
  description: string;
  donor: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'planning' | 'ongoing' | 'completed' | 'suspended' | 'cancelled';
  manager: string;
  team: TeamMember[];
  location: string[];
  beneficiaries: number;
  objectives: string[];
  activities: ProjectActivity[];
  milestones: Milestone[];
  budget: ProjectBudget;
  risks: Risk[];
  reports: Report[];
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'ongoing' | 'completed' | 'delayed';
  budget: number;
  responsible: string;
  deliverables: Deliverable[];
  progress: number;
}

export interface Deliverable {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  documents: string[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  actualDate?: string;
  status: 'planned' | 'achieved' | 'delayed' | 'missed';
  criteria: string[];
}

export interface ProjectBudget {
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  categories: BudgetCategory[];
  variance: number;
}

// 5. Monitoring & Evaluation
export interface MEIndicator {
  id: string;
  name: string;
  type: 'impact' | 'outcome' | 'output' | 'input';
  description: string;
  baseline: string;
  target: string;
  current: string;
  unit: string;
  frequency: 'monthly' | 'quarterly' | 'annually';
  dataSource: string;
  responsible: string;
  lastUpdated: string;
  progress: number;
  projectId: string;
}

export interface EvaluationReport {
  id: string;
  title: string;
  projectId: string;
  type: 'baseline' | 'midterm' | 'final' | 'annual';
  date: string;
  evaluator: string;
  methodology: string;
  findings: Finding[];
  recommendations: Recommendation[];
  score: number;
  status: 'draft' | 'final' | 'approved';
  documents: string[];
}

export interface Finding {
  area: string;
  description: string;
  evidence: string;
  rating: number;
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  description: string;
  responsible: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
}

// 6. Compliance & Risk Management
export interface ComplianceItem {
  id: string;
  requirement: string;
  category: 'legal' | 'donor' | 'regulatory' | 'internal';
  status: 'compliant' | 'non_compliant' | 'partially_compliant';
  dueDate: string;
  responsible: string;
  evidence: string[];
  lastReview: string;
  nextReview: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'operational' | 'strategic' | 'reputation' | 'legal';
  probability: number;
  impact: number;
  riskScore: number;
  mitigation: string;
  responsible: string;
  status: 'identified' | 'assessed' | 'mitigated' | 'closed';
  dateIdentified: string;
  lastReview: string;
}

export interface AuditRecord {
  id: string;
  type: 'internal' | 'external' | 'donor';
  auditor: string;
  date: string;
  scope: string[];
  findings: AuditFinding[];
  recommendations: string[];
  overallRating: string;
  status: 'planned' | 'ongoing' | 'completed';
}

export interface AuditFinding {
  area: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  recommendation: string;
  responsible: string;
  deadline: string;
  status: 'open' | 'in_progress' | 'closed';
}

// 7. Staff & Volunteer Management
export interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'inactive' | 'terminated';
  contractType: 'permanent' | 'contract' | 'volunteer' | 'intern';
  supervisor: string;
  documents: StaffDocument[];
  performance: PerformanceRecord[];
  training: TrainingRecord[];
  leave: LeaveRecord[];
}

export interface StaffDocument {
  type: 'contract' | 'id_copy' | 'cv' | 'certificate' | 'photo';
  name: string;
  url: string;
  uploadDate: string;
  expiryDate?: string;
}

export interface PerformanceRecord {
  id: string;
  period: string;
  supervisor: string;
  rating: number;
  strengths: string[];
  improvements: string[];
  goals: string[];
  comments: string;
  date: string;
}

export interface TrainingRecord {
  id: string;
  name: string;
  type: 'safeguarding' | 'technical' | 'leadership' | 'compliance';
  provider: string;
  date: string;
  duration: number;
  status: 'planned' | 'completed' | 'expired';
  certificate?: string;
}

export interface LeaveRecord {
  id: string;
  type: 'annual' | 'sick' | 'maternity' | 'study' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  status: 'requested' | 'approved' | 'rejected' | 'taken';
  approver?: string;
  reason: string;
}

// 8. Financial Management
export interface FinancialReport {
  id: string;
  type: 'annual' | 'quarterly' | 'monthly' | 'project';
  period: string;
  totalIncome: number;
  totalExpenditure: number;
  netResult: number;
  categories: FinancialCategory[];
  variance: number;
  status: 'draft' | 'final' | 'audited';
  preparedBy: string;
  approvedBy: string;
  date: string;
}

export interface FinancialCategory {
  name: string;
  budgeted: number;
  actual: number;
  variance: number;
  percentage: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  currency: string;
  donor?: string;
  project?: string;
  receipt?: string;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
}

// 9. Communications & Outreach
export interface Campaign {
  id: string;
  name: string;
  type: 'fundraising' | 'awareness' | 'newsletter' | 'event';
  startDate: string;
  endDate: string;
  target: string;
  channels: CommunicationChannel[];
  metrics: CampaignMetrics;
  status: 'planned' | 'active' | 'completed' | 'paused';
  budget: number;
  responsible: string;
}

export interface CommunicationChannel {
  type: 'email' | 'sms' | 'social_media' | 'website' | 'print';
  reach: number;
  engagement: number;
  cost: number;
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  responses: number;
  conversions: number;
  revenue: number;
}

// 10. Templates & Tools
export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  type: 'document' | 'form' | 'presentation' | 'spreadsheet';
  description: string;
  version: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  downloads: number;
  fileUrl: string;
  tags: string[];
  approved: boolean;
}

export type TemplateCategory = 
  | 'proposals'
  | 'budgets'
  | 'reports'
  | 'policies'
  | 'hr'
  | 'monitoring'
  | 'communications'
  | 'compliance';

// Utility Functions
export const getDonorStats = (donors: Donor[]) => {
  return {
    total: donors.length,
    active: donors.filter(d => d.status === 'active').length,
    major: donors.filter(d => d.relationship === 'major').length,
    totalDonations: donors.reduce((sum, d) => sum + d.totalDonations, 0)
  };
};

export const getProjectStats = (projects: Project[]) => {
  return {
    total: projects.length,
    active: projects.filter(p => p.status === 'ongoing').length,
    completed: projects.filter(p => p.status === 'completed').length,
    totalBudget: projects.reduce((sum, p) => sum + p.amount, 0)
  };
};

export const getComplianceScore = (items: ComplianceItem[]) => {
  const compliant = items.filter(i => i.status === 'compliant').length;
  return Math.round((compliant / items.length) * 100);
};

export const generateReceiptNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RCP-${year}${month}${day}-${random}`;
};

export const calculateRiskScore = (probability: number, impact: number): number => {
  return probability * impact;
};

export const getFinancialHealth = (report: FinancialReport): string => {
  const ratio = report.totalIncome / report.totalExpenditure;
  if (ratio > 1.2) return 'excellent';
  if (ratio > 1.0) return 'good';
  if (ratio > 0.8) return 'fair';
  return 'poor';
};