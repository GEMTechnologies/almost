-- Granada NGO Management System Database Initialization

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create schemas for different services
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS grants;
CREATE SCHEMA IF NOT EXISTS projects;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS ai_insights;

-- Users and Organizations
CREATE TABLE users.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'ngo',
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    website VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address JSONB,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES users.organizations(id),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'member',
    permissions JSONB DEFAULT '[]',
    profile JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finance Tables
CREATE TABLE finance.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES users.organizations(id),
    project_id UUID,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    transaction_type VARCHAR(50) NOT NULL, -- 'income', 'expense', 'transfer'
    category VARCHAR(100),
    description TEXT,
    reference_number VARCHAR(100),
    attachment_urls JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID REFERENCES users.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE finance.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES users.organizations(id),
    project_id UUID,
    name VARCHAR(255) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    allocated_amount DECIMAL(15,2) DEFAULT 0,
    spent_amount DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    period_start DATE,
    period_end DATE,
    categories JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'active',
    created_by UUID REFERENCES users.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grants Tables
CREATE TABLE grants.grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    organization VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    deadline DATE,
    application_deadline DATE,
    requirements JSONB DEFAULT '[]',
    eligibility_criteria JSONB DEFAULT '[]',
    focus_areas JSONB DEFAULT '[]',
    geographical_scope JSONB DEFAULT '[]',
    contact_info JSONB DEFAULT '{}',
    external_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'closed', 'under_review'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE grants.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES users.organizations(id),
    grant_id UUID REFERENCES grants.grants(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requested_amount DECIMAL(15,2),
    proposal_text TEXT,
    documents JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'under_review', 'approved', 'rejected'
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    decision_notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Tables
CREATE TABLE projects.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES users.organizations(id),
    grant_application_id UUID REFERENCES grants.applications(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    objectives JSONB DEFAULT '[]',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2),
    spent_amount DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'active', 'on_hold', 'completed', 'cancelled'
    progress_percentage INTEGER DEFAULT 0,
    team_members JSONB DEFAULT '[]',
    stakeholders JSONB DEFAULT '[]',
    location JSONB DEFAULT '{}',
    tags JSONB DEFAULT '[]',
    created_by UUID REFERENCES users.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects.milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects.projects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    completion_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'overdue'
    deliverables JSONB DEFAULT '[]',
    dependencies JSONB DEFAULT '[]',
    assigned_to JSONB DEFAULT '[]',
    created_by UUID REFERENCES users.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects.projects(id),
    milestone_id UUID REFERENCES projects.milestones(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    planned_start DATE,
    planned_end DATE,
    actual_start DATE,
    actual_end DATE,
    status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'in_progress', 'completed', 'cancelled'
    outcomes TEXT,
    beneficiaries_reached INTEGER DEFAULT 0,
    cost DECIMAL(15,2) DEFAULT 0,
    location JSONB DEFAULT '{}',
    assigned_to JSONB DEFAULT '[]',
    created_by UUID REFERENCES users.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Insights Tables
CREATE TABLE ai_insights.insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES users.organizations(id),
    type VARCHAR(100) NOT NULL, -- 'funding_opportunity', 'efficiency', 'risk', 'recommendation'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    data_sources JSONB DEFAULT '[]',
    confidence_score DECIMAL(3,2),
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    impact_score DECIMAL(3,2),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'dismissed', 'implemented'
    action_taken TEXT,
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ai_insights.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES users.organizations(id),
    related_entity_type VARCHAR(50), -- 'project', 'grant', 'transaction', 'budget'
    related_entity_id UUID,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL, -- 'info', 'warning', 'error', 'critical'
    title VARCHAR(255) NOT NULL,
    message TEXT,
    recommended_actions JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT false,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES users.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_transactions_org_id ON finance.transactions(organization_id);
CREATE INDEX idx_transactions_created_at ON finance.transactions(created_at);
CREATE INDEX idx_grants_deadline ON grants.grants(deadline);
CREATE INDEX idx_applications_org_grant ON grants.applications(organization_id, grant_id);
CREATE INDEX idx_projects_org_id ON projects.projects(organization_id);
CREATE INDEX idx_projects_status ON projects.projects(status);
CREATE INDEX idx_milestones_project_due ON projects.milestones(project_id, due_date);
CREATE INDEX idx_insights_org_priority ON ai_insights.insights(organization_id, priority);
CREATE INDEX idx_alerts_org_unread ON ai_insights.alerts(organization_id, is_read);

-- Full-text search indexes
CREATE INDEX idx_grants_search ON grants.grants USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_projects_search ON projects.projects USING gin(to_tsvector('english', name || ' ' || description));

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON users.organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON finance.transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON finance.budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grants_updated_at BEFORE UPDATE ON grants.grants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON grants.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON projects.milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON projects.activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON ai_insights.insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON ai_insights.alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO users.organizations (id, name, description, type, contact_email) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Sample NGO Organization', 'A demonstration NGO for the Granada management system', 'ngo', 'contact@samplengo.org');

INSERT INTO users.users (id, organization_id, username, email, password_hash, first_name, last_name, role) VALUES 
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'admin', 'admin@samplengo.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewGDT5OKz9FjIwOS', 'John', 'Doe', 'admin');

-- Sample grants
INSERT INTO grants.grants (title, description, organization, amount, deadline, requirements) VALUES 
('Education Excellence Grant', 'Supporting innovative education programs in underserved communities', 'Global Education Foundation', 75000.00, '2024-06-30', '["Nonprofit status", "Education focus", "Community impact plan"]'),
('Environmental Sustainability Fund', 'Funding for environmental conservation and sustainability projects', 'Green Earth Initiative', 100000.00, '2024-08-15', '["Environmental focus", "Measurable outcomes", "Local partnerships"]');

-- Sample projects
INSERT INTO projects.projects (id, organization_id, name, description, start_date, end_date, budget, status, created_by) VALUES 
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Community Literacy Program', 'Teaching reading and writing skills to adults in rural areas', '2024-01-01', '2024-12-31', 45000.00, 'active', '550e8400-e29b-41d4-a716-446655440001');

COMMIT;