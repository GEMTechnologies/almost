// Shared TypeScript types for Proposal Writing Module

export interface Proposal {
  id: string;
  title: string;
  funding_opportunity_id: string;
  proposal_type: ProposalType;
  organization_id: string;
  description?: string;
  objectives: string[];
  requested_amount?: number;
  project_duration?: number;
  target_beneficiaries: string[];
  geographic_scope: string[];
  sectors: string[];
  keywords: string[];
  deadline?: string;
  priority: string;
  team_members: TeamMember[];
  metadata: Record<string, any>;
  status: ProposalStatus;
  progress_percentage: number;
  word_count: number;
  sections_count: number;
  created_by: string;
  created_at: string;
  last_modified: string;
}

export interface ProposalSection {
  id: string;
  proposal_id: string;
  section_type: SectionType;
  title: string;
  content: string;
  order_index: number;
  word_count: number;
  is_ai_generated: boolean;
  ai_confidence?: number;
  ai_metadata?: AIMetadata;
  is_approved: boolean;
  created_at: string;
  last_modified: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  qualifications: string[];
  responsibilities: string[];
  time_commitment: number; // percentage
}

export interface AIMetadata {
  ai_model: string;
  key_points: string[];
  suggestions: string[];
  citations_needed: string[];
  confidence_score: number;
  generation_timestamp: string;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  proposal_type: ProposalType;
  description?: string;
  sections: TemplateSection[];
  styling: StylingOptions;
  is_public: boolean;
  funder_specific?: string;
  created_by: string;
  created_at: string;
}

export interface TemplateSection {
  section_type: SectionType;
  title: string;
  description: string;
  word_count_target?: number;
  required: boolean;
  order_index: number;
  guidelines: string[];
}

export interface StylingOptions {
  font_family: string;
  font_size: number;
  line_spacing: number;
  margin_top: number;
  margin_bottom: number;
  margin_left: number;
  margin_right: number;
  header_styles: HeaderStyle[];
  citation_format: string;
}

export interface HeaderStyle {
  level: number;
  font_size: number;
  font_weight: string;
  color: string;
  spacing_before: number;
  spacing_after: number;
}

export interface ProposalReview {
  id: string;
  proposal_id: string;
  reviewer_id: string;
  reviewer_type: ReviewerType;
  overall_score?: number;
  section_scores: Record<string, number>;
  comments?: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  is_final: boolean;
  submitted_at: string;
  created_at: string;
}

export interface ProposalComment {
  id: string;
  proposal_id: string;
  section_id?: string;
  user_id: string;
  content: string;
  thread_id?: string;
  parent_comment_id?: string;
  is_resolved: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIGenerationRequest {
  proposal_id: string;
  ai_model: AIModel;
  generate_sections: SectionType[];
  custom_instructions?: string;
  tone: string;
  word_count_target?: number;
  include_citations: boolean;
  focus_areas: string[];
  competitive_analysis: boolean;
}

export interface AIGenerationResponse {
  proposal_id: string;
  generated_sections: GeneratedSection[];
  ai_model: string;
  generation_timestamp: string;
  total_words_generated: number;
  average_confidence: number;
}

export interface GeneratedSection {
  section_type: string;
  content: string;
  word_count: number;
  confidence_score: number;
  key_points: string[];
  suggestions: string[];
  citations_needed: string[];
}

export interface ExportOptions {
  format: ExportFormat;
  include_sections: SectionType[];
  template_id?: string;
  custom_styling: StylingOptions;
  include_comments: boolean;
  include_metadata: boolean;
}

export interface CollaborationInvite {
  id: string;
  proposal_id: string;
  inviter_id: string;
  collaborator_email: string;
  role: CollaborationRole;
  permissions: Permission[];
  message?: string;
  status: InviteStatus;
  expires_at: string;
  created_at: string;
}

export interface ProposalVersion {
  id: string;
  proposal_id: string;
  version_number: number;
  title: string;
  sections_snapshot: ProposalSection[];
  created_by: string;
  created_at: string;
  change_summary: string;
}

// Enums
export enum ProposalStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  COMPLETED = 'completed',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVISION_REQUIRED = 'revision_required'
}

export enum ProposalType {
  GRANT = 'grant',
  FELLOWSHIP = 'fellowship',
  RESEARCH = 'research',
  PROJECT = 'project',
  FUNDING = 'funding',
  SCHOLARSHIP = 'scholarship',
  BUSINESS = 'business',
  NONPROFIT = 'nonprofit'
}

export enum SectionType {
  EXECUTIVE_SUMMARY = 'executive_summary',
  PROJECT_DESCRIPTION = 'project_description',
  OBJECTIVES = 'objectives',
  METHODOLOGY = 'methodology',
  TIMELINE = 'timeline',
  BUDGET = 'budget',
  EVALUATION = 'evaluation',
  SUSTAINABILITY = 'sustainability',
  TEAM = 'team',
  REFERENCES = 'references',
  APPENDIX = 'appendix',
  LITERATURE_REVIEW = 'literature_review',
  RISK_MANAGEMENT = 'risk_management',
  IMPACT_STATEMENT = 'impact_statement',
  DISSEMINATION = 'dissemination'
}

export enum AIModel {
  DEEPSEEK = 'deepseek',
  GEMINI = 'gemini',
  MIXED = 'mixed'
}

export enum ExportFormat {
  PDF = 'pdf',
  DOCX = 'docx',
  MARKDOWN = 'markdown',
  HTML = 'html',
  LATEX = 'latex'
}

export enum ReviewerType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  AI = 'ai',
  PEER = 'peer'
}

export enum CollaborationRole {
  OWNER = 'owner',
  EDITOR = 'editor',
  REVIEWER = 'reviewer',
  VIEWER = 'viewer',
  CONTRIBUTOR = 'contributor'
}

export enum Permission {
  READ = 'read',
  WRITE = 'write',
  COMMENT = 'comment',
  REVIEW = 'review',
  EXPORT = 'export',
  INVITE = 'invite',
  DELETE = 'delete'
}

export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

// API Response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// Form types
export interface ProposalCreateForm {
  title: string;
  funding_opportunity_id: string;
  proposal_type: ProposalType;
  organization_id: string;
  description?: string;
  objectives: string[];
  requested_amount?: number;
  project_duration?: number;
  target_beneficiaries: string[];
  geographic_scope: string[];
  sectors: string[];
  keywords: string[];
  deadline?: string;
  priority: string;
  team_members: TeamMember[];
}

export interface SectionUpdateForm {
  title?: string;
  content?: string;
  order_index?: number;
  is_approved?: boolean;
}

export interface ReviewSubmissionForm {
  overall_score?: number;
  section_scores: Record<string, number>;
  comments?: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  is_final: boolean;
}

// Analytics types
export interface ProposalAnalytics {
  total_proposals: number;
  proposals_by_status: Record<ProposalStatus, number>;
  proposals_by_type: Record<ProposalType, number>;
  average_completion_time: number;
  word_count_statistics: {
    average: number;
    median: number;
    min: number;
    max: number;
  };
  ai_usage_statistics: {
    total_ai_generated_sections: number;
    ai_adoption_rate: number;
    average_ai_confidence: number;
  };
  collaboration_statistics: {
    proposals_with_collaborators: number;
    average_collaborators_per_proposal: number;
    most_active_collaborators: string[];
  };
}

// Utility types
export type ProposalSortField = 'created_at' | 'last_modified' | 'title' | 'status' | 'progress_percentage' | 'deadline';
export type SortOrder = 'asc' | 'desc';

export interface ProposalFilters {
  status?: ProposalStatus[];
  proposal_type?: ProposalType[];
  organization_id?: string;
  created_after?: string;
  created_before?: string;
  deadline_after?: string;
  deadline_before?: string;
  search?: string;
}

export interface ProposalListParams {
  page?: number;
  limit?: number;
  sort_field?: ProposalSortField;
  sort_order?: SortOrder;
  filters?: ProposalFilters;
}