# Granada OS Proposal Elements & Styling Guide

## Core Proposal Elements

### 1. **Executive Summary**
- **Purpose**: Concise overview of the entire proposal
- **Length**: 1-2 pages maximum
- **Styling**: 
  - Large, bold heading
  - Highlight key figures with colored backgrounds
  - Use bullet points for key achievements
  - Call-out boxes for impact metrics

### 2. **Organization Background**
- **Purpose**: Establish credibility and expertise
- **Elements**: 
  - Mission statement (styled with quotation marks)
  - Track record with visual timeline
  - Team bios with photos and credentials
  - Partnership logos in grid layout

### 3. **Problem Statement**
- **Purpose**: Define the challenge being addressed
- **Styling**:
  - Statistics in large, colored numbers
  - Infographics showing problem scope
  - Geographic maps for location-specific issues
  - Before/after comparisons

### 4. **Project Description**
- **Purpose**: Detailed explanation of proposed solution
- **Elements**:
  - Methodology flowcharts
  - Activity timelines with progress bars
  - Resource allocation pie charts
  - Logic model diagrams

### 5. **Budget & Financial Plan**
- **Purpose**: Transparent financial breakdown
- **Styling**:
  - Interactive budget tables
  - Cost breakdown charts
  - Funding source visualizations
  - Cost-effectiveness comparisons

### 6. **Implementation Timeline**
- **Purpose**: Project phases and milestones
- **Styling**:
  - Gantt charts with color coding
  - Milestone markers with icons
  - Progress tracking bars
  - Phase separation with visual dividers

### 7. **Monitoring & Evaluation**
- **Purpose**: Measurement and accountability framework
- **Elements**:
  - KPI dashboards
  - Results framework matrices
  - Data collection flowcharts
  - Impact measurement tools

### 8. **Sustainability Plan**
- **Purpose**: Long-term viability strategy
- **Styling**:
  - Sustainability pillars with icons
  - Financial projections graphs
  - Partnership evolution timelines
  - Exit strategy roadmaps

## Template-Specific Styling

### WHO Health Grant Template
```css
/* Medical/Health Styling */
.who-template {
  --primary-color: #007DC3;
  --secondary-color: #E31C23;
  --accent-color: #00A651;
}

.health-metrics {
  background: linear-gradient(135deg, #007DC3, #00A651);
  color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 125, 195, 0.3);
}

.medical-section {
  border-left: 4px solid #E31C23;
  padding-left: 16px;
  margin: 16px 0;
}
```

### USAID Education Template
```css
/* Government/Education Styling */
.usaid-template {
  --primary-color: #002F6C;
  --secondary-color: #BA0C2F;
  --accent-color: #FDB515;
}

.education-framework {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 24px;
  background: #F8F9FA;
  border-radius: 8px;
}

.results-indicator {
  background: white;
  border: 2px solid #002F6C;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}
```

### EU Horizon Europe Template
```css
/* Research/Innovation Styling */
.eu-template {
  --primary-color: #003399;
  --secondary-color: #FFCC00;
  --accent-color: #E50059;
}

.innovation-excellence {
  background: linear-gradient(45deg, #003399, #E50059);
  color: white;
  padding: 24px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.innovation-excellence::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: url('/eu-stars.svg') no-repeat;
  opacity: 0.2;
}

.work-package {
  border: 2px solid #FFCC00;
  background: #F9F9F9;
  padding: 20px;
  margin: 16px 0;
  border-radius: 12px;
}
```

### Gates Foundation Template
```css
/* Foundation/Innovation Styling */
.gates-template {
  --primary-color: #FF6900;
  --secondary-color: #00AEEF;
  --accent-color: #8CC63F;
}

.global-health-challenge {
  background: linear-gradient(135deg, #FF6900, #00AEEF);
  color: white;
  padding: 32px;
  border-radius: 20px;
  text-align: center;
  position: relative;
}

.innovation-approach {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: white;
  border: 3px solid #8CC63F;
  border-radius: 16px;
  margin: 20px 0;
}

.scalability-metric {
  background: #8CC63F;
  color: white;
  padding: 12px 20px;
  border-radius: 24px;
  font-weight: bold;
  display: inline-block;
  margin: 8px;
}
```

## Advanced Styling Features

### 1. **Interactive Elements**
- Hover effects on sections
- Expandable/collapsible content
- Progressive disclosure for complex information
- Interactive charts and graphs

### 2. **Responsive Design**
- Mobile-optimized layouts
- Print-friendly versions
- Screen reader accessibility
- Multiple export formats

### 3. **Brand Adaptation**
- Automatic color scheme matching
- Logo integration
- Font customization
- Cultural sensitivity adjustments

### 4. **Visual Hierarchy**
```css
/* Typography Scale */
.proposal-h1 { font-size: 2.5rem; font-weight: 700; }
.proposal-h2 { font-size: 2rem; font-weight: 600; }
.proposal-h3 { font-size: 1.5rem; font-weight: 600; }
.proposal-body { font-size: 1rem; line-height: 1.6; }
.proposal-caption { font-size: 0.875rem; color: #6B7280; }

/* Spacing System */
.section-spacing { margin: 48px 0; }
.paragraph-spacing { margin: 24px 0; }
.element-spacing { margin: 16px 0; }
```

### 5. **Data Visualization Styling**
```css
/* Charts and Graphs */
.budget-chart {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.timeline-milestone {
  position: relative;
  background: #F3F4F6;
  border-left: 4px solid var(--primary-color);
  padding: 16px 24px;
  margin: 12px 0;
}

.impact-metric {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border-radius: 12px;
  font-size: 1.25rem;
  font-weight: 600;
}
```

## Template Customization System

### 1. **Automatic Template Detection**
The system analyzes:
- Funder organization name
- Funding sector/category
- Grant amount range
- Geographic focus
- Application requirements

### 2. **Section Adaptation**
Each template automatically:
- Reorders sections per funder requirements
- Adjusts word limits and page counts
- Includes mandatory subsections
- Applies appropriate terminology

### 3. **Style Inheritance**
```typescript
interface TemplateStyle {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  headerStyle: 'formal' | 'modern' | 'academic';
  layoutType: 'grid' | 'linear' | 'modular';
  visualElements: boolean;
  brandElements: string[];
}
```

### 4. **Content Guidelines**
Each template includes:
- Required section formats
- Preferred language tone
- Citation standards
- Appendix requirements
- Review criteria alignment

## Export & Formatting Options

### 1. **Document Formats**
- **PDF**: Print-ready with proper pagination
- **Word**: Editable with style preservation
- **HTML**: Web-optimized with responsive design
- **LaTeX**: Academic formatting for research proposals

### 2. **Style Preservation**
- CSS-to-Word conversion
- Font embedding for PDFs
- Color profile management
- Image optimization

### 3. **Accessibility Features**
- Screen reader compatibility
- High contrast modes
- Large text options
- Navigation aids

This comprehensive styling system ensures that proposals not only meet funder requirements but also create compelling, professional presentations that maximize funding success rates.