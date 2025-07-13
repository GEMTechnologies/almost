import { pgTable, text, integer, boolean, timestamp, uuid, jsonb, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  hashedPassword: text("hashed_password").notNull(),
  fullName: text("full_name").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  userType: text("user_type").notNull().default("user"),

  country: text("country"),
  sector: text("sector"),
  organizationType: text("organization_type"),
  credits: integer("credits").default(100),
  isActive: boolean("is_active").default(true),
  isBanned: boolean("is_banned").default(false),
  isSuperuser: boolean("is_superuser").default(false),
  organizationId: uuid("organization_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document Writing Jobs System
export const documentWritingJobs = pgTable("document_writing_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  documentName: text("document_name").notNull(),
  documentType: text("document_type").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, failed, cancelled
  progress: integer("progress").default(0), // 0-100
  estimatedDuration: integer("estimated_duration"), // in minutes
  actualDuration: integer("actual_duration"), // in minutes
  
  creditsRequired: integer("credits_required").notNull(),
  creditsDeducted: boolean("credits_deducted").default(false),
  
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  failedAt: timestamp("failed_at"),
  
  generatedContent: text("generated_content"),
  qualityScore: decimal("quality_score"),
  wordCount: integer("word_count"),
  
  adminNotified: boolean("admin_notified").default(false),
  adminNotes: text("admin_notes"),
  
  metadata: jsonb("metadata"),
  errorMessage: text("error_message"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin Notifications System
export const adminNotifications = pgTable("admin_notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").notNull(), // document_request, document_completed, credit_low, user_activity
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  
  userId: uuid("user_id").references(() => users.id),
  jobId: uuid("job_id").references(() => documentWritingJobs.id),
  
  isRead: boolean("is_read").default(false),
  isActioned: boolean("is_actioned").default(false),
  actionTaken: text("action_taken"),
  
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
  actionedAt: timestamp("actioned_at"),
});

// Credit Transactions System
export const creditTransactions = pgTable("credit_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // debit, credit, refund
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  
  jobId: uuid("job_id").references(() => documentWritingJobs.id),
  balanceBefore: integer("balance_before").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  
  metadata: jsonb("metadata"),
  
  createdAt: timestamp("created_at").defaultNow(),
});



export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  country: text("country").notNull(),
  sector: text("sector").notNull(),
  description: text("description"),
  website: text("website"),
  contactEmail: text("contact_email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donors = pgTable("donors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  country: text("country"),
  focusAreas: text("focus_areas").array(),
  website: text("website"),
  contactEmail: text("contact_email"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donorCalls = pgTable("donor_calls", {
  id: uuid("id").primaryKey().defaultRandom(),
  donorId: uuid("donor_id").references(() => donors.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eligibilityCriteria: text("eligibility_criteria"),
  fundingAmount: decimal("funding_amount"),
  deadline: timestamp("deadline"),
  applicationProcess: text("application_process"),
  contactInfo: text("contact_info"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const proposals = pgTable("proposals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  opportunityId: uuid("opportunity_id").references(() => donorOpportunities.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status").default("draft"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sector: text("sector").notNull(),
  budget: decimal("budget"),
  duration: text("duration"),
  status: text("status").default("planning"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiInteractions = pgTable("ai_interactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  type: text("type").notNull(),
  input: text("input").notNull(),
  output: text("output").notNull(),
  creditsUsed: integer("credits_used").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donorOpportunities = pgTable("donor_opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sourceName: text("source_name").notNull(),
  sourceUrl: text("source_url").notNull(),
  country: text("country").notNull(),
  sector: text("sector").notNull(),
  fundingAmount: text("funding_amount"),
  deadline: text("deadline"),
  eligibility: text("eligibility"),
  applicationProcess: text("application_process"),
  requirements: text("requirements").array(),
  contactInfo: text("contact_info"),
  isVerified: boolean("is_verified").default(false),
  isActive: boolean("is_active").default(true),
  contentHash: text("content_hash").unique(),
  aiMatchScore: integer("ai_match_score").default(0),
  viewCount: integer("view_count").default(0),
  applicationCount: integer("application_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const searchBots = pgTable("search_bots", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  sector: text("sector"),
  isActive: boolean("is_active").default(true),
  lastRun: timestamp("last_run"),
  opportunitiesFound: integer("opportunities_found").default(0),
  successRate: decimal("success_rate").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const botRewards = pgTable("bot_rewards", {
  id: uuid("id").primaryKey().defaultRandom(),
  botId: uuid("bot_id").references(() => searchBots.id),
  rewardType: text("reward_type").notNull(),
  amount: integer("amount").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const searchTargets = pgTable("search_targets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  country: text("country").notNull(),
  sector: text("sector"),
  searchTerms: text("search_terms").array(),
  isActive: boolean("is_active").default(true),
  lastScraped: timestamp("last_scraped"),
  successCount: integer("success_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const opportunityVerifications = pgTable("opportunity_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  opportunityId: uuid("opportunity_id").references(() => donorOpportunities.id),
  verifiedBy: uuid("verified_by").references(() => users.id),
  status: text("status").notNull(),
  notes: text("notes"),
  verifiedAt: timestamp("verified_at").defaultNow(),
});

export const searchStatistics = pgTable("search_statistics", {
  id: uuid("id").primaryKey().defaultRandom(),
  botId: uuid("bot_id").references(() => searchBots.id),
  targetId: uuid("target_id").references(() => searchTargets.id),
  searchDate: timestamp("search_date").defaultNow(),
  opportunitiesFound: integer("opportunities_found").default(0),
  processingTime: integer("processing_time"),
  success: boolean("success").default(false),
  errorMessage: text("error_message"),
});

export const userInteractions = pgTable("user_interactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  page: text("page"),
  details: jsonb("details"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Document Upload and Management System
export const uploadedDocuments = pgTable("uploaded_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  fileType: text("file_type").notNull(), // pdf, docx, jpg, png, etc
  fileSize: integer("file_size").notNull(), // in bytes
  filePath: text("file_path").notNull(),
  
  // Document categorization
  category: text("category").notNull(), // governance, financial, policies, etc
  subcategory: text("subcategory"),
  documentType: text("document_type").notNull(), // certificate, policy, report, etc
  
  // Metadata
  description: text("description"),
  tags: text("tags").array(),
  isConfidential: boolean("is_confidential").default(false),
  
  // Status and approval
  status: text("status").notNull().default("pending"), // pending, approved, rejected, archived
  approvalStatus: text("approval_status").notNull().default("pending"), // pending, approved, rejected
  approvedBy: uuid("approved_by").references(() => users.id),
  rejectionReason: text("rejection_reason"),
  
  // Dates
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  expiryDate: timestamp("expiry_date"),
  
  // Versioning
  version: text("version").default("1.0"),
  parentDocumentId: uuid("parent_document_id"), // for document versions
  
  // Admin notes
  adminNotes: text("admin_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document Access Logs
export const documentAccessLogs = pgTable("document_access_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").references(() => uploadedDocuments.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // view, download, edit, delete
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  accessedAt: timestamp("accessed_at").defaultNow(),
});

// Document Sharing
export const documentShares = pgTable("document_shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  documentId: uuid("document_id").references(() => uploadedDocuments.id).notNull(),
  sharedBy: uuid("shared_by").references(() => users.id).notNull(),
  sharedWith: uuid("shared_with").references(() => users.id).notNull(),
  permissions: text("permissions").notNull().default("view"), // view, download, edit
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemSettings = pgTable("system_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique().notNull(),
  value: jsonb("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const savedPaymentMethods = pgTable("saved_payment_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  paymentType: text("payment_type").notNull(), // 'card', 'mobile-money', 'paypal'
  displayName: text("display_name").notNull(), // e.g., "Visa ending in 1234", "MTN 0701234567"
  
  // Card details (optional, only for cards)
  cardholderName: text("cardholder_name"),
  lastFourDigits: varchar("last_four_digits", { length: 4 }),
  cardType: text("card_type"), // visa, mastercard, amex, discover
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  billingZip: varchar("billing_zip", { length: 10 }),
  
  // Mobile money details (optional, only for mobile money)
  phoneNumber: text("phone_number"),
  mobileProvider: text("mobile_provider"), // MTN, Airtel, etc.
  
  // PayPal details (optional, only for PayPal)
  paypalEmail: text("paypal_email"),
  
  // Common fields
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  encryptedToken: text("encrypted_token"), // encrypted payment details/tokens
  processorCustomerId: text("processor_customer_id"),
  
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  paymentMethodId: uuid("payment_method_id").references(() => savedPaymentMethods.id),
  packageId: text("package_id").notNull(),
  originalAmount: decimal("original_amount", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  finalAmount: decimal("final_amount", { precision: 10, scale: 2 }).notNull(),
  couponCode: text("coupon_code"),
  creditsAdded: integer("credits_added").notNull(),
  status: text("status").notNull(), // pending, completed, failed, refunded
  transactionId: text("transaction_id").unique().notNull(),
  processorResponse: text("processor_response"), // JSON response from payment processor
  failureReason: text("failure_reason"),
  paymentMethod: text("payment_method").notNull(), // mobile, card, paypal
  processorType: text("processor_type"), // pesapal, stripe, paypal
  countryCode: text("country_code"),
  mobileNumber: text("mobile_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced credit usage tracking
export const creditUsageLog = pgTable("credit_usage_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  creditsUsed: integer("credits_used").notNull(),
  activityType: text("activity_type").notNull(), // 'proposal', 'search', 'analysis', etc.
  description: text("description").notNull(),
  status: text("status").notNull().default("completed"), // 'completed', 'failed'
  metadata: jsonb("metadata"), // Additional data about the activity
  createdAt: timestamp("created_at").defaultNow()
});

// User subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  planId: text("plan_id").notNull(),
  planName: text("plan_name").notNull(),
  status: text("status").notNull().default("active"), // 'active', 'cancelled', 'expired'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  billingCycle: text("billing_cycle").notNull().default("monthly"), // 'monthly', 'yearly'
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  processorSubscriptionId: text("processor_subscription_id"), // External payment processor ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Billing preferences
export const billingPreferences = pgTable("billing_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  autoRecharge: boolean("auto_recharge").default(false),
  autoRechargeThreshold: integer("auto_recharge_threshold").default(10),
  autoRechargeAmount: integer("auto_recharge_amount").default(100),
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  preferredPaymentMethod: text("preferred_payment_method").default("mobile"),
  defaultCountryCode: text("default_country_code").default("KE"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Coupon system
export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").unique().notNull(), // WELCOME20, STUDENT50, etc.
  name: text("name").notNull(), // "Welcome Discount", "Student Special"
  description: text("description"),
  discountType: text("discount_type").notNull(), // 'percentage', 'fixed_amount', 'free_credits'
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(), // 20 for 20%, 5.00 for $5 off
  minimumPurchase: decimal("minimum_purchase", { precision: 10, scale: 2 }).default("0"),
  maximumDiscount: decimal("maximum_discount", { precision: 10, scale: 2 }), // Cap for percentage discounts
  
  // Usage limits
  usageLimit: integer("usage_limit"), // null = unlimited
  usageCount: integer("usage_count").default(0),
  userUsageLimit: integer("user_usage_limit").default(1), // How many times per user
  
  // Validity
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until"),
  isActive: boolean("is_active").default(true),
  
  // Targeting
  allowedPackages: text("allowed_packages").array(), // null = all packages
  allowedUserTypes: text("allowed_user_types").array(), // 'student', 'ngo', 'business'
  firstTimeOnly: boolean("first_time_only").default(false),
  
  // Admin
  createdBy: uuid("created_by").references(() => users.id),
  adminNotes: text("admin_notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Coupon usage tracking
export const couponUsage = pgTable("coupon_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  couponId: uuid("coupon_id").references(() => coupons.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  transactionId: uuid("transaction_id").references(() => paymentTransactions.id),
  discountApplied: decimal("discount_applied", { precision: 10, scale: 2 }).notNull(),
  originalAmount: decimal("original_amount", { precision: 10, scale: 2 }).notNull(),
  finalAmount: decimal("final_amount", { precision: 10, scale: 2 }).notNull(),
  usedAt: timestamp("used_at").defaultNow()
});



// User settings and preferences
export const userSettings = pgTable("user_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  
  // Payment preferences
  defaultPaymentMethodId: uuid("default_payment_method_id").references(() => savedPaymentMethods.id),
  autoSavePaymentMethods: boolean("auto_save_payment_methods").default(true),
  
  // Notification preferences
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  pushNotifications: boolean("push_notifications").default(true),
  
  // UI preferences
  theme: text("theme").default("light"), // light, dark, auto
  language: text("language").default("en"),
  currency: text("currency").default("USD"),
  timezone: text("timezone"),
  
  // Privacy settings
  profileVisibility: text("profile_visibility").default("public"), // public, private, contacts
  showPaymentHistory: boolean("show_payment_history").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  hashedPassword: true,
  fullName: true,
  firstName: true,
  lastName: true,
  userType: true,
  organizationType: true,
  country: true,
  sector: true,
}).extend({
  password: z.string().min(6),
});

// Global Jobs Platform Database Tables
export const countries = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // ISO 3166-1 alpha-2 code
  dialCode: text("dial_code"), // +1, +44, +256, etc.
  currency: text("currency"), // USD, GBP, UGX, etc.
  timezone: text("timezone"), // UTC offset
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cities = pgTable("cities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  countryId: uuid("country_id").references(() => countries.id).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  isCapital: boolean("is_capital").default(false),
  population: integer("population"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  website: text("website"),
  description: text("description"),
  industry: text("industry"),
  size: text("size"), // startup, small, medium, large, enterprise
  
  // Global Location Data
  countryId: uuid("country_id").references(() => countries.id),
  cityId: uuid("city_id").references(() => cities.id),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  foundedYear: integer("founded_year"),
  employeeCount: integer("employee_count"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  facebookUrl: text("facebook_url"),
  
  // Company Verification & Status
  isVerified: boolean("is_verified").default(false),
  verificationLevel: text("verification_level").default("basic"), // basic, verified, premium
  isActive: boolean("is_active").default(true),
  isPremium: boolean("is_premium").default(false),
  
  // SEO & Discovery
  searchKeywords: text("search_keywords").array(),
  benefits: text("benefits").array(),
  culture: text("culture").array(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobCategories = pgTable("job_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  parentId: uuid("parent_id").references(() => jobCategories.id),
  icon: text("icon"),
  color: text("color"),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").references(() => companies.id).notNull(),
  categoryId: uuid("category_id").references(() => jobCategories.id),
  
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  responsibilities: text("responsibilities").array(),
  benefits: text("benefits").array(),
  skills: text("skills").array(),
  
  // Global Location Support
  countryId: uuid("country_id").references(() => countries.id).notNull(),
  cityId: uuid("city_id").references(() => cities.id),
  isRemote: boolean("is_remote").default(false),
  remoteType: text("remote_type"), // fully-remote, hybrid, on-site
  timezoneRequirement: text("timezone_requirement"),
  
  // Job Details
  jobType: text("job_type").notNull(), // full-time, part-time, contract, internship
  experienceLevel: text("experience_level"), // entry, mid, senior, executive
  educationLevel: text("education_level"), // high-school, bachelor, master, phd
  
  // Salary Information with Global Currency Support
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryCurrency: text("salary_currency").default("USD"),
  salaryPeriod: text("salary_period").default("monthly"), // hourly, monthly, yearly
  isNegotiable: boolean("is_negotiable").default(false),
  
  // Application Process
  applicationMethod: text("application_method").default("internal"), // internal, external, email
  externalApplicationUrl: text("external_application_url"),
  applicationEmail: text("application_email"),
  deadline: timestamp("deadline"),
  
  // Job Management
  postedBy: uuid("posted_by").references(() => users.id),
  status: text("status").default("active"), // active, paused, filled, expired
  isFeatured: boolean("is_featured").default(false),
  isPremium: boolean("is_premium").default(false),
  isUrgent: boolean("is_urgent").default(false),
  
  // Analytics
  viewCount: integer("view_count").default(0),
  applicationCount: integer("application_count").default(0),
  clickCount: integer("click_count").default(0),
  
  // SEO & Search
  searchKeywords: text("search_keywords").array(),
  metaDescription: text("meta_description"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cvProfiles = pgTable("cv_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Personal Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"),
  
  // Global Location
  countryId: uuid("country_id").references(() => countries.id),
  cityId: uuid("city_id").references(() => cities.id),
  address: text("address"),
  isWillingToRelocate: boolean("is_willing_to_relocate").default(false),
  
  // Professional Information
  professionalTitle: text("professional_title"),
  summary: text("summary"),
  objective: text("objective"),
  skills: text("skills").array(),
  certifications: jsonb("certifications"), // Array of certification objects
  languages: jsonb("languages"), // Array of language objects with proficiency
  
  // Work Experience & Education
  experience: jsonb("experience"), // Array of experience objects
  education: jsonb("education"), // Array of education objects
  projects: jsonb("projects"), // Array of project objects
  achievements: jsonb("achievements"), // Array of achievement objects
  
  // References & Portfolio
  references: jsonb("references"), // Array of reference objects
  portfolio: jsonb("portfolio"), // Array of portfolio items
  
  // Social & Online Presence
  avatar: text("avatar"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  portfolioUrl: text("portfolio_url"),
  personalWebsite: text("personal_website"),
  
  // Job Preferences with Global Support
  desiredSalaryMin: integer("desired_salary_min"),
  desiredSalaryMax: integer("desired_salary_max"),
  desiredCurrency: text("desired_currency").default("USD"),
  preferredJobType: text("preferred_job_type"), // full-time, part-time, contract
  preferredWorkArrangement: text("preferred_work_arrangement"), // remote, hybrid, on-site
  availability: text("availability"), // immediate, 2-weeks, 1-month, etc.
  noticePeriod: text("notice_period"),
  
  // Privacy & Visibility
  isPublic: boolean("is_public").default(true),
  allowContactByRecruiters: boolean("allow_contact_by_recruiters").default(true),
  allowContactByCompanies: boolean("allow_contact_by_companies").default(true),
  isActive: boolean("is_active").default(true),
  
  // Analytics
  viewCount: integer("view_count").default(0),
  downloadCount: integer("download_count").default(0),
  contactCount: integer("contact_count").default(0),
  
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobApplications = pgTable("job_applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  cvId: uuid("cv_id").references(() => cvProfiles.id),
  
  // Application Content
  coverLetter: text("cover_letter"),
  additionalDocuments: text("additional_documents").array(),
  questionsAnswers: jsonb("questions_answers"), // Custom questions from employer
  
  // Application Status
  status: text("status").notNull().default("pending"), // pending, reviewed, interviewed, hired, rejected, withdrawn
  stage: text("stage").default("application"), // application, screening, interview, offer, final
  
  // Review Process
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  interviewNotes: text("interview_notes"),
  rejectionReason: text("rejection_reason"),
  
  // Scheduling
  interviewDate: timestamp("interview_date"),
  interviewType: text("interview_type"), // phone, video, in-person
  interviewLocation: text("interview_location"),
  
  // Timestamps
  appliedAt: timestamp("applied_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  interviewedAt: timestamp("interviewed_at"),
  respondedAt: timestamp("responded_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobSaves = pgTable("job_saves", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  notes: text("notes"),
  savedAt: timestamp("saved_at").defaultNow(),
});

export const jobAlerts = pgTable("job_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  title: text("title").notNull(),
  keywords: text("keywords").array(),
  excludeKeywords: text("exclude_keywords").array(),
  
  // Global Location Filters
  countryIds: text("country_ids").array(),
  cityIds: text("city_ids").array(),
  includeRemote: boolean("include_remote").default(true),
  
  // Job Filters
  categoryIds: text("category_ids").array(),
  jobTypes: text("job_types").array(),
  experienceLevels: text("experience_levels").array(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  currency: text("currency").default("USD"),
  
  // Notification Settings
  frequency: text("frequency").default("daily"), // immediate, daily, weekly
  lastSent: timestamp("last_sent"),
  emailNotifications: boolean("email_notifications").default(true),
  pushNotifications: boolean("push_notifications").default(false),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobViews = pgTable("job_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  userId: uuid("user_id").references(() => users.id),
  
  // Analytics Data
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  sessionDuration: integer("session_duration"), // seconds
  
  // Geographic Data
  countryId: uuid("country_id").references(() => countries.id),
  cityId: uuid("city_id").references(() => cities.id),
  
  viewedAt: timestamp("viewed_at").defaultNow(),
});

export const cvDownloads = pgTable("cv_downloads", {
  id: uuid("id").primaryKey().defaultRandom(),
  cvId: uuid("cv_id").references(() => cvProfiles.id).notNull(),
  downloadedBy: uuid("downloaded_by").references(() => users.id),
  
  // Context
  jobId: uuid("job_id").references(() => jobs.id), // If downloaded from job application
  companyId: uuid("company_id").references(() => companies.id),
  
  // Analytics
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  downloadType: text("download_type").default("pdf"), // pdf, doc, etc.
  
  downloadedAt: timestamp("downloaded_at").defaultNow(),
});

export const jobRecommendations = pgTable("job_recommendations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  
  matchScore: integer("match_score"), // 0-100
  reasons: text("reasons").array(),
  algorithmVersion: text("algorithm_version"),
  
  // User Interactions
  isViewed: boolean("is_viewed").default(false),
  isClicked: boolean("is_clicked").default(false),
  isApplied: boolean("is_applied").default(false),
  isSaved: boolean("is_saved").default(false),
  isDismissed: boolean("is_dismissed").default(false),
  
  // Feedback
  userFeedback: text("user_feedback"), // helpful, not_helpful, not_interested
  
  createdAt: timestamp("created_at").defaultNow(),
  viewedAt: timestamp("viewed_at"),
  clickedAt: timestamp("clicked_at"),
});

export const companyFollows = pgTable("company_follows", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  companyId: uuid("company_id").references(() => companies.id).notNull(),
  
  // Notification Preferences
  jobAlerts: boolean("job_alerts").default(true),
  companyNews: boolean("company_news").default(true),
  
  followedAt: timestamp("followed_at").defaultNow(),
});

export const jobFeedback = pgTable("job_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id").references(() => jobs.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  rating: integer("rating"), // 1-5 stars
  feedback: text("feedback"),
  categories: text("categories").array(), // job_description, salary, company, process
  isAnonymous: boolean("is_anonymous").default(false),
  isRecommended: boolean("is_recommended"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobSearchHistory = pgTable("job_search_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  
  searchQuery: text("search_query"),
  filters: jsonb("filters"), // All applied filters
  resultsCount: integer("results_count"),
  
  // Analytics
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  
  searchedAt: timestamp("searched_at").defaultNow(),
});

export const salaryInsights = pgTable("salary_insights", {
  id: uuid("id").primaryKey().defaultRandom(),
  
  // Global Location
  countryId: uuid("country_id").references(() => countries.id).notNull(),
  cityId: uuid("city_id").references(() => cities.id),
  
  // Job Details
  jobTitle: text("job_title").notNull(),
  categoryId: uuid("category_id").references(() => jobCategories.id),
  experienceLevel: text("experience_level"),
  
  // Salary Data
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  salaryAverage: integer("salary_average"),
  currency: text("currency").notNull(),
  
  // Sample Data
  sampleSize: integer("sample_size").default(1),
  dataSource: text("data_source"), // job_postings, user_reports, surveys
  
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Additional schemas for new tables
export const insertSavedPaymentMethodSchema = createInsertSchema(savedPaymentMethods);
export const insertUserSettingsSchema = createInsertSchema(userSettings);
export const insertCompanySchema = createInsertSchema(companies);
export const insertJobSchema = createInsertSchema(jobs);
export const insertCvProfileSchema = createInsertSchema(cvProfiles);
export const insertJobApplicationSchema = createInsertSchema(jobApplications);
export const insertCountrySchema = createInsertSchema(countries);
export const insertCitySchema = createInsertSchema(cities);
export const insertJobCategorySchema = createInsertSchema(jobCategories);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SavedPaymentMethod = typeof savedPaymentMethods.$inferSelect;
export type InsertSavedPaymentMethod = z.infer<typeof insertSavedPaymentMethodSchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;

// Jobs Platform Types
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type CvProfile = typeof cvProfiles.$inferSelect;
export type InsertCvProfile = z.infer<typeof insertCvProfileSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;
export type City = typeof cities.$inferSelect;
export type InsertCity = z.infer<typeof insertCitySchema>;
export type JobCategory = typeof jobCategories.$inferSelect;
export type InsertJobCategory = z.infer<typeof insertJobCategorySchema>;