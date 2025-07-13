import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  decimal,
  date,
  jsonb,
  uuid,
  serial,
  index,
  foreignKey,
  primaryKey
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==================== CORE ORGANIZATION TABLES ====================

// Organizations (Main NGO table)
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  registrationNumber: varchar("registration_number", { length: 100 }),
  legalStatus: varchar("legal_status", { length: 100 }),
  establishedDate: date("established_date"),
  mission: text("mission"),
  vision: text("vision"),
  objectives: jsonb("objectives").$type<string[]>(),
  sector: varchar("sector", { length: 100 }),
  subsector: varchar("subsector", { length: 100 }),
  geographicFocus: jsonb("geographic_focus").$type<string[]>(),
  beneficiaryTypes: jsonb("beneficiary_types").$type<string[]>(),
  website: varchar("website", { length: 255 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  taxId: varchar("tax_id", { length: 100 }),
  isActive: boolean("is_active").default(true),
  complianceStatus: varchar("compliance_status", { length: 50 }).default("pending"),
  lastAuditDate: date("last_audit_date"),
  nextAuditDue: date("next_audit_due"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Organization Branches/Offices
export const organizationOffices = pgTable("organization_offices", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }), // headquarters, branch, field_office
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  managerName: varchar("manager_name", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// ==================== DONORS & FUNDING TABLES ====================

// Donors
export const donors = pgTable("donors", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }), // individual, corporate, foundation, government, multilateral
  category: varchar("category", { length: 50 }), // major, regular, occasional
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  website: varchar("website", { length: 255 }),
  contactPerson: varchar("contact_person", { length: 255 }),
  preferredCommunication: varchar("preferred_communication", { length: 50 }),
  interestAreas: jsonb("interest_areas").$type<string[]>(),
  fundingCapacity: varchar("funding_capacity", { length: 50 }),
  donationFrequency: varchar("donation_frequency", { length: 50 }),
  firstDonationDate: date("first_donation_date"),
  lastDonationDate: date("last_donation_date"),
  totalDonated: decimal("total_donated", { precision: 15, scale: 2 }).default("0"),
  averageDonation: decimal("average_donation", { precision: 15, scale: 2 }).default("0"),
  status: varchar("status", { length: 50 }).default("active"),
  notes: text("notes"),
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Donations
export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  donorId: uuid("donor_id").references(() => donors.id),
  projectId: uuid("project_id").references(() => projects.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD"),
  donationDate: date("donation_date").notNull(),
  donationType: varchar("donation_type", { length: 50 }), // cash, in_kind, pledge
  purpose: varchar("purpose", { length: 255 }),
  restrictions: text("restrictions"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  referenceNumber: varchar("reference_number", { length: 100 }),
  receiptNumber: varchar("receipt_number", { length: 100 }),
  receiptIssued: boolean("receipt_issued").default(false),
  receiptDate: date("receipt_date"),
  taxDeductible: boolean("tax_deductible").default(true),
  acknowledged: boolean("acknowledged").default(false),
  acknowledgedDate: date("acknowledged_date"),
  campaign: varchar("campaign", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

// Donor Communications
export const donorCommunications = pgTable("donor_communications", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  donorId: uuid("donor_id").references(() => donors.id),
  type: varchar("type", { length: 50 }), // email, letter, phone, meeting
  subject: varchar("subject", { length: 255 }),
  content: text("content"),
  sentDate: timestamp("sent_date"),
  sentBy: varchar("sent_by", { length: 255 }),
  responseReceived: boolean("response_received").default(false),
  responseDate: timestamp("response_date"),
  responseContent: text("response_content"),
  attachments: jsonb("attachments").$type<string[]>(),
  status: varchar("status", { length: 50 }).default("sent"),
  createdAt: timestamp("created_at").defaultNow()
});

// ==================== PROPOSALS & GRANTS TABLES ====================

// Grant Opportunities
export const grantOpportunities = pgTable("grant_opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  title: varchar("title", { length: 255 }).notNull(),
  funderName: varchar("funder_name", { length: 255 }),
  funderType: varchar("funder_type", { length: 100 }),
  description: text("description"),
  eligibilityCriteria: text("eligibility_criteria"),
  focus Areas: jsonb("focus_areas").$type<string[]>(),
  geographicScope: jsonb("geographic_scope").$type<string[]>(),
  minAmount: decimal("min_amount", { precision: 15, scale: 2 }),
  maxAmount: decimal("max_amount", { precision: 15, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("USD"),
  applicationDeadline: date("application_deadline"),
  projectStartDate: date("project_start_date"),
  projectEndDate: date("project_end_date"),
  applicationUrl: varchar("application_url", { length: 500 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  requirements: jsonb("requirements").$type<string[]>(),
  status: varchar("status", { length: 50 }).default("open"),
  source: varchar("source", { length: 255 }),
  addedDate: date("added_date").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

// Proposals
export const proposals = pgTable("proposals", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  grantOpportunityId: uuid("grant_opportunity_id").references(() => grantOpportunities.id),
  title: varchar("title", { length: 255 }).notNull(),
  proposalNumber: varchar("proposal_number", { length: 100 }),
  projectTitle: varchar("project_title", { length: 255 }),
  requestedAmount: decimal("requested_amount", { precision: 15, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("USD"),
  projectDuration: integer("project_duration_months"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  submissionDeadline: date("submission_deadline"),
  submissionDate: date("submission_date"),
  status: varchar("status", { length: 50 }).default("draft"), // draft, submitted, under_review, approved, rejected
  leadWriter: varchar("lead_writer", { length: 255 }),
  reviewers: jsonb("reviewers").$type<string[]>(),
  abstract: text("abstract"),
  problemStatement: text("problem_statement"),
  objectives: jsonb("objectives").$type<string[]>(),
  methodology: text("methodology"),
  expectedOutcomes: text("expected_outcomes"),
  sustainability: text("sustainability"),
  riskAssessment: text("risk_assessment"),
  monitoringPlan: text("monitoring_plan"),
  evaluationPlan: text("evaluation_plan"),
  attachments: jsonb("attachments").$type<string[]>(),
  feedback: text("feedback"),
  version: integer("version").default(1),
  parentProposalId: uuid("parent_proposal_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Proposal Budgets
export const proposalBudgets = pgTable("proposal_budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  proposalId: uuid("proposal_id").references(() => proposals.id),
  category: varchar("category", { length: 100 }), // personnel, equipment, travel, etc.
  subcategory: varchar("subcategory", { length: 100 }),
  description: text("description"),
  quantity: decimal("quantity", { precision: 10, scale: 2 }),
  unitCost: decimal("unit_cost", { precision: 15, scale: 2 }),
  totalCost: decimal("total_cost", { precision: 15, scale: 2 }),
  fundingSource: varchar("funding_source", { length: 100 }),
  year: integer("year"),
  quarter: integer("quarter"),
  justification: text("justification"),
  createdAt: timestamp("created_at").defaultNow()
});

// ==================== PROJECTS TABLES ====================

// Projects
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  proposalId: uuid("proposal_id").references(() => proposals.id),
  title: varchar("title", { length: 255 }).notNull(),
  projectCode: varchar("project_code", { length: 100 }),
  description: text("description"),
  objectives: jsonb("objectives").$type<string[]>(),
  sector: varchar("sector", { length: 100 }),
  theme: varchar("theme", { length: 100 }),
  geographicScope: jsonb("geographic_scope").$type<string[]>(),
  targetBeneficiaries: jsonb("target_beneficiaries").$type<object>(),
  totalBudget: decimal("total_budget", { precision: 15, scale: 2 }),
  approvedBudget: decimal("approved_budget", { precision: 15, scale: 2 }),
  spentAmount: decimal("spent_amount", { precision: 15, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  actualStartDate: date("actual_start_date"),
  actualEndDate: date("actual_end_date"),
  status: varchar("status", { length: 50 }).default("planning"), // planning, active, suspended, completed, cancelled
  priority: varchar("priority", { length: 50 }).default("medium"),
  projectManager: varchar("project_manager", { length: 255 }),
  teamMembers: jsonb("team_members").$type<string[]>(),
  partners: jsonb("partners").$type<string[]>(),
  donors: jsonb("donors").$type<string[]>(),
  riskLevel: varchar("risk_level", { length: 50 }).default("medium"),
  approvalDate: date("approval_date"),
  completionPercentage: integer("completion_percentage").default(0),
  lastReportDate: date("last_report_date"),
  nextReportDue: date("next_report_due"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Project Activities
export const projectActivities = pgTable("project_activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  objective: varchar("objective", { length: 255 }),
  output: varchar("output", { length: 255 }),
  outcome: varchar("outcome", { length: 255 }),
  plannedStartDate: date("planned_start_date"),
  plannedEndDate: date("planned_end_date"),
  actualStartDate: date("actual_start_date"),
  actualEndDate: date("actual_end_date"),
  status: varchar("status", { length: 50 }).default("planned"),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  spentAmount: decimal("spent_amount", { precision: 15, scale: 2 }).default("0"),
  responsible: varchar("responsible", { length: 255 }),
  location: varchar("location", { length: 255 }),
  beneficiaries: jsonb("beneficiaries").$type<object>(),
  completionPercentage: integer("completion_percentage").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Project Deliverables
export const projectDeliverables = pgTable("project_deliverables", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id),
  activityId: uuid("activity_id").references(() => projectActivities.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }), // report, training, equipment, service
  dueDate: date("due_date"),
  completionDate: date("completion_date"),
  status: varchar("status", { length: 50 }).default("pending"),
  responsible: varchar("responsible", { length: 255 }),
  qualityStandards: text("quality_standards"),
  submissionDate: date("submission_date"),
  approvalDate: date("approval_date"),
  attachments: jsonb("attachments").$type<string[]>(),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow()
});

// ==================== MONITORING & EVALUATION TABLES ====================

// M&E Frameworks
export const meFrameworks = pgTable("me_frameworks", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  projectId: uuid("project_id").references(() => projects.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }), // logframe, results_framework, theory_of_change
  description: text("description"),
  vision: text("vision"),
  goal: text("goal"),
  outcomes: jsonb("outcomes").$type<object[]>(),
  outputs: jsonb("outputs").$type<object[]>(),
  activities: jsonb("activities").$type<object[]>(),
  assumptions: jsonb("assumptions").$type<string[]>(),
  risks: jsonb("risks").$type<object[]>(),
  externalFactors: jsonb("external_factors").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Indicators
export const indicators = pgTable("indicators", {
  id: uuid("id").primaryKey().defaultRandom(),
  frameworkId: uuid("framework_id").references(() => meFrameworks.id),
  projectId: uuid("project_id").references(() => projects.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }), // outcome, output, impact
  level: varchar("level", { length: 50 }), // goal, outcome, output, activity
  dataType: varchar("data_type", { length: 50 }), // quantitative, qualitative
  measurementUnit: varchar("measurement_unit", { length: 100 }),
  baseline: varchar("baseline", { length: 255 }),
  target: varchar("target", { length: 255 }),
  targetDate: date("target_date"),
  dataSource: varchar("data_source", { length: 255 }),
  collectionMethod: varchar("collection_method", { length: 255 }),
  frequency: varchar("frequency", { length: 50 }), // monthly, quarterly, annually
  responsible: varchar("responsible", { length: 255 }),
  reportingFormat: varchar("reporting_format", { length: 100 }),
  disaggregation: jsonb("disaggregation").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Data Collection
export const dataCollection = pgTable("data_collection", {
  id: uuid("id").primaryKey().defaultRandom(),
  indicatorId: uuid("indicator_id").references(() => indicators.id),
  projectId: uuid("project_id").references(() => projects.id),
  collectionDate: date("collection_date").notNull(),
  reportingPeriod: varchar("reporting_period", { length: 100 }),
  value: varchar("value", { length: 255 }),
  qualitativeData: text("qualitative_data"),
  dataSource: varchar("data_source", { length: 255 }),
  collectionMethod: varchar("collection_method", { length: 255 }),
  collectedBy: varchar("collected_by", { length: 255 }),
  verifiedBy: varchar("verified_by", { length: 255 }),
  verificationDate: date("verification_date"),
  location: varchar("location", { length: 255 }),
  disaggregatedData: jsonb("disaggregated_data").$type<object>(),
  comments: text("comments"),
  attachments: jsonb("attachments").$type<string[]>(),
  qualityRating: varchar("quality_rating", { length: 50 }),
  isValidated: boolean("is_validated").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Reports
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  projectId: uuid("project_id").references(() => projects.id),
  type: varchar("type", { length: 100 }), // narrative, financial, technical, annual
  title: varchar("title", { length: 255 }).notNull(),
  reportingPeriodStart: date("reporting_period_start"),
  reportingPeriodEnd: date("reporting_period_end"),
  submissionDate: date("submission_date"),
  dueDate: date("due_date"),
  status: varchar("status", { length: 50 }).default("draft"),
  preparedBy: varchar("prepared_by", { length: 255 }),
  reviewedBy: varchar("reviewed_by", { length: 255 }),
  approvedBy: varchar("approved_by", { length: 255 }),
  submittedTo: varchar("submitted_to", { length: 255 }),
  executiveSummary: text("executive_summary"),
  achievements: text("achievements"),
  challenges: text("challenges"),
  lessonsLearned: text("lessons_learned"),
  recommendations: text("recommendations"),
  nextSteps: text("next_steps"),
  financialSummary: jsonb("financial_summary").$type<object>(),
  attachments: jsonb("attachments").$type<string[]>(),
  feedback: text("feedback"),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// ==================== STAFF & HR TABLES ====================

// Staff
export const staff = pgTable("staff", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  employeeId: varchar("employee_id", { length: 100 }),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  middleName: varchar("middle_name", { length: 100 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  personalEmail: varchar("personal_email", { length: 255 }),
  dateOfBirth: date("date_of_birth"),
  gender: varchar("gender", { length: 20 }),
  nationality: varchar("nationality", { length: 100 }),
  idNumber: varchar("id_number", { length: 100 }),
  passportNumber: varchar("passport_number", { length: 100 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }),
  emergencyContact: jsonb("emergency_contact").$type<object>(),
  position: varchar("position", { length: 255 }),
  department: varchar("department", { length: 100 }),
  officeId: uuid("office_id").references(() => organizationOffices.id),
  supervisor: varchar("supervisor", { length: 255 }),
  employmentType: varchar("employment_type", { length: 50 }), // full_time, part_time, contract, volunteer
  contractType: varchar("contract_type", { length: 50 }), // permanent, fixed_term, consultant
  startDate: date("start_date"),
  endDate: date("end_date"),
  probationPeriod: integer("probation_period_months"),
  salary: decimal("salary", { precision: 15, scale: 2 }),
  currency: varchar("currency", { length: 10 }).default("USD"),
  payrollFrequency: varchar("payroll_frequency", { length: 50 }),
  benefits: jsonb("benefits").$type<string[]>(),
  qualifications: jsonb("qualifications").$type<object[]>(),
  skills: jsonb("skills").$type<string[]>(),
  languages: jsonb("languages").$type<object[]>(),
  workPermit: varchar("work_permit", { length: 100 }),
  visaStatus: varchar("visa_status", { length: 100 }),
  bankAccount: jsonb("bank_account").$type<object>(),
  taxInfo: jsonb("tax_info").$type<object>(),
  status: varchar("status", { length: 50 }).default("active"),
  terminationDate: date("termination_date"),
  terminationReason: varchar("termination_reason", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Training Records
export const trainingRecords = pgTable("training_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffId: uuid("staff_id").references(() => staff.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  trainingTitle: varchar("training_title", { length: 255 }).notNull(),
  trainingType: varchar("training_type", { length: 100 }), // mandatory, optional, certification
  provider: varchar("provider", { length: 255 }),
  startDate: date("start_date"),
  endDate: date("end_date"),
  duration: integer("duration_hours"),
  location: varchar("location", { length: 255 }),
  format: varchar("format", { length: 50 }), // online, in_person, hybrid
  status: varchar("status", { length: 50 }).default("registered"),
  completionDate: date("completion_date"),
  grade: varchar("grade", { length: 50 }),
  certificateIssued: boolean("certificate_issued").default(false),
  certificateNumber: varchar("certificate_number", { length: 100 }),
  expiryDate: date("expiry_date"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  fundingSource: varchar("funding_source", { length: 255 }),
  feedback: text("feedback"),
  attachments: jsonb("attachments").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow()
});

// Performance Reviews
export const performanceReviews = pgTable("performance_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  staffId: uuid("staff_id").references(() => staff.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  reviewPeriodStart: date("review_period_start"),
  reviewPeriodEnd: date("review_period_end"),
  reviewType: varchar("review_type", { length: 50 }), // annual, mid_year, probation
  reviewer: varchar("reviewer", { length: 255 }),
  reviewDate: date("review_date"),
  overallRating: varchar("overall_rating", { length: 50 }),
  achievements: text("achievements"),
  areasForImprovement: text("areas_for_improvement"),
  goalsNextPeriod: text("goals_next_period"),
  trainingNeeds: text("training_needs"),
  careerDevelopment: text("career_development"),
  employeeComments: text("employee_comments"),
  reviewerComments: text("reviewer_comments"),
  recommendedActions: text("recommended_actions"),
  salaryAdjustment: decimal("salary_adjustment", { precision: 10, scale: 2 }),
  promotionRecommended: boolean("promotion_recommended").default(false),
  attachments: jsonb("attachments").$type<string[]>(),
  status: varchar("status", { length: 50 }).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// ==================== FINANCIAL TABLES ====================

// Budgets
export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  projectId: uuid("project_id").references(() => projects.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }), // organizational, project, departmental
  fiscalYear: integer("fiscal_year"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  totalBudget: decimal("total_budget", { precision: 15, scale: 2 }),
  approvedBudget: decimal("approved_budget", { precision: 15, scale: 2 }),
  revisedBudget: decimal("revised_budget", { precision: 15, scale: 2 }),
  utilizedAmount: decimal("utilized_amount", { precision: 15, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  status: varchar("status", { length: 50 }).default("draft"),
  approvedBy: varchar("approved_by", { length: 255 }),
  approvalDate: date("approval_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Budget Line Items
export const budgetLineItems = pgTable("budget_line_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  budgetId: uuid("budget_id").references(() => budgets.id),
  category: varchar("category", { length: 100 }),
  subcategory: varchar("subcategory", { length: 100 }),
  description: text("description"),
  accountCode: varchar("account_code", { length: 50 }),
  budgetedAmount: decimal("budgeted_amount", { precision: 15, scale: 2 }),
  actualAmount: decimal("actual_amount", { precision: 15, scale: 2 }).default("0"),
  variance: decimal("variance", { precision: 15, scale: 2 }).default("0"),
  quarter1: decimal("quarter1", { precision: 15, scale: 2 }).default("0"),
  quarter2: decimal("quarter2", { precision: 15, scale: 2 }).default("0"),
  quarter3: decimal("quarter3", { precision: 15, scale: 2 }).default("0"),
  quarter4: decimal("quarter4", { precision: 15, scale: 2 }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow()
});

// Transactions
export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  projectId: uuid("project_id").references(() => projects.id),
  budgetId: uuid("budget_id").references(() => budgets.id),
  donationId: uuid("donation_id").references(() => donations.id),
  transactionNumber: varchar("transaction_number", { length: 100 }),
  date: date("date").notNull(),
  type: varchar("type", { length: 50 }), // income, expense, transfer
  category: varchar("category", { length: 100 }),
  subcategory: varchar("subcategory", { length: 100 }),
  description: text("description"),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  referenceNumber: varchar("reference_number", { length: 100 }),
  vendor: varchar("vendor", { length: 255 }),
  accountCode: varchar("account_code", { length: 50 }),
  costCenter: varchar("cost_center", { length: 100 }),
  taxAmount: decimal("tax_amount", { precision: 15, scale: 2 }).default("0"),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 6 }).default("1"),
  baseAmount: decimal("base_amount", { precision: 15, scale: 2 }),
  approvedBy: varchar("approved_by", { length: 255 }),
  processedBy: varchar("processed_by", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"),
  receiptAttached: boolean("receipt_attached").default(false),
  attachments: jsonb("attachments").$type<string[]>(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Financial Reports
export const financialReports = pgTable("financial_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  reportType: varchar("report_type", { length: 100 }), // income_statement, balance_sheet, cash_flow, budget_variance
  title: varchar("title", { length: 255 }).notNull(),
  periodStart: date("period_start"),
  periodEnd: date("period_end"),
  generatedDate: timestamp("generated_date").defaultNow(),
  generatedBy: varchar("generated_by", { length: 255 }),
  data: jsonb("data").$type<object>(),
  summary: text("summary"),
  status: varchar("status", { length: 50 }).default("draft"),
  attachments: jsonb("attachments").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow()
});

// ==================== COMPLIANCE & DOCUMENTATION TABLES ====================

// Documents
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  projectId: uuid("project_id").references(() => projects.id),
  staffId: uuid("staff_id").references(() => staff.id),
  title: varchar("title", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }), // policy, procedure, form, template, legal, compliance
  category: varchar("category", { length: 100 }),
  description: text("description"),
  fileName: varchar("file_name", { length: 255 }),
  fileSize: integer("file_size"),
  fileType: varchar("file_type", { length: 50 }),
  filePath: varchar("file_path", { length: 500 }),
  version: varchar("version", { length: 50 }).default("1.0"),
  status: varchar("status", { length: 50 }).default("active"),
  accessLevel: varchar("access_level", { length: 50 }).default("internal"),
  uploadedBy: varchar("uploaded_by", { length: 255 }),
  approvedBy: varchar("approved_by", { length: 255 }),
  reviewDate: date("review_date"),
  expiryDate: date("expiry_date"),
  reminderDate: date("reminder_date"),
  tags: jsonb("tags").$type<string[]>(),
  keywords: jsonb("keywords").$type<string[]>(),
  isConfidential: boolean("is_confidential").default(false),
  retentionPeriod: integer("retention_period_years"),
  lastAccessed: timestamp("last_accessed"),
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Document Versions
export const documentVersions = pgTable("document_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").references(() => documents.id),
  version: varchar("version", { length: 50 }).notNull(),
  fileName: varchar("file_name", { length: 255 }),
  filePath: varchar("file_path", { length: 500 }),
  fileSize: integer("file_size"),
  changeLog: text("change_log"),
  uploadedBy: varchar("uploaded_by", { length: 255 }),
  uploadDate: timestamp("upload_date").defaultNow(),
  status: varchar("status", { length: 50 }).default("active")
});

// Compliance Requirements
export const complianceRequirements = pgTable("compliance_requirements", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }), // legal, regulatory, donor, internal
  category: varchar("category", { length: 100 }),
  authority: varchar("authority", { length: 255 }),
  frequency: varchar("frequency", { length: 50 }), // once, annual, quarterly, monthly
  dueDate: date("due_date"),
  nextDueDate: date("next_due_date"),
  responsible: varchar("responsible", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending"),
  priority: varchar("priority", { length: 50 }).default("medium"),
  evidence: text("evidence"),
  attachments: jsonb("attachments").$type<string[]>(),
  lastCompleted: date("last_completed"),
  completedBy: varchar("completed_by", { length: 255 }),
  notes: text("notes"),
  reminderDays: integer("reminder_days").default(30),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Risk Register
export const riskRegister = pgTable("risk_register", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  projectId: uuid("project_id").references(() => projects.id),
  riskTitle: varchar("risk_title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // operational, financial, strategic, compliance
  type: varchar("type", { length: 100 }), // internal, external
  probability: varchar("probability", { length: 50 }), // low, medium, high
  impact: varchar("impact", { length: 50 }), // low, medium, high
  riskLevel: varchar("risk_level", { length: 50 }), // low, medium, high, critical
  causes: text("causes"),
  consequences: text("consequences"),
  currentControls: text("current_controls"),
  mitigationActions: text("mitigation_actions"),
  responsible: varchar("responsible", { length: 255 }),
  targetDate: date("target_date"),
  status: varchar("status", { length: 50 }).default("open"),
  residualRisk: varchar("residual_risk", { length: 50 }),
  lastReviewed: date("last_reviewed"),
  nextReview: date("next_review"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// ==================== COMMUNICATIONS TABLES ====================

// Communication Campaigns
export const communicationCampaigns = pgTable("communication_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }), // fundraising, awareness, advocacy, newsletter
  description: text("description"),
  objective: text("objective"),
  targetAudience: jsonb("target_audience").$type<string[]>(),
  channels: jsonb("channels").$type<string[]>(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  budget: decimal("budget", { precision: 15, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 15, scale: 2 }).default("0"),
  manager: varchar("manager", { length: 255 }),
  status: varchar("status", { length: 50 }).default("planning"),
  reach: integer("reach").default(0),
  engagement: integer("engagement").default(0),
  conversions: integer("conversions").default(0),
  roi: decimal("roi", { precision: 10, scale: 2 }).default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Newsletter Subscriptions
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }),
  subscriptionDate: timestamp("subscription_date").defaultNow(),
  status: varchar("status", { length: 50 }).default("active"),
  preferences: jsonb("preferences").$type<string[]>(),
  source: varchar("source", { length: 100 }),
  unsubscribeDate: timestamp("unsubscribe_date"),
  unsubscribeReason: varchar("unsubscribe_reason", { length: 255 }),
  tags: jsonb("tags").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow()
});

// Export types for TypeScript
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;
export type Donor = typeof donors.$inferSelect;
export type InsertDonor = typeof donors.$inferInsert;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type Staff = typeof staff.$inferSelect;
export type InsertStaff = typeof staff.$inferInsert;
export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = typeof proposals.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// Define relationships
export const organizationsRelations = relations(organizations, ({ many }) => ({
  offices: many(organizationOffices),
  donors: many(donors),
  donations: many(donations),
  projects: many(projects),
  staff: many(staff),
  proposals: many(proposals),
  documents: many(documents),
  budgets: many(budgets),
  reports: many(reports)
}));

export const donorsRelations = relations(donors, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [donors.organizationId],
    references: [organizations.id]
  }),
  donations: many(donations),
  communications: many(donorCommunications)
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [projects.organizationId],
    references: [organizations.id]
  }),
  proposal: one(proposals, {
    fields: [projects.proposalId],
    references: [proposals.id]
  }),
  activities: many(projectActivities),
  deliverables: many(projectDeliverables),
  indicators: many(indicators),
  reports: many(reports)
}));

export const staffRelations = relations(staff, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [staff.organizationId],
    references: [organizations.id]
  }),
  office: one(organizationOffices, {
    fields: [staff.officeId],
    references: [organizationOffices.id]
  }),
  trainings: many(trainingRecords),
  reviews: many(performanceReviews)
}));