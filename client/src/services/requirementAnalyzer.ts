import { useAuth } from '../contexts/AuthContext';

interface FundingRequirement {
  id: string;
  title: string;
  description: string;
  required: boolean;
  wordLimit?: number;
  priority: 'high' | 'medium' | 'low';
  category: 'organizational' | 'project' | 'financial' | 'impact' | 'technical';
}

interface ProposalOutline {
  sections: ProposalSection[];
  totalWordCount: number;
  estimatedPages: number;
  complianceItems: string[];
}

interface ProposalSection {
  id: string;
  title: string;
  description: string;
  content: string;
  wordLimit?: number;
  required: boolean;
  aiSuggestions: string[];
  requirements: string[];
  category: string;
  order: number;
}

export class RequirementAnalyzer {
  private static instance: RequirementAnalyzer;
  
  static getInstance(): RequirementAnalyzer {
    if (!RequirementAnalyzer.instance) {
      RequirementAnalyzer.instance = new RequirementAnalyzer();
    }
    return RequirementAnalyzer.instance;
  }

  async analyzeOpportunityRequirements(opportunity: any): Promise<ProposalOutline> {
    try {
      // Extract requirements from opportunity description and source
      const extractedRequirements = this.extractRequirementsFromText(
        `${opportunity.description} ${opportunity.requirements?.join(' ') || ''} ${opportunity.eligibility || ''}`
      );
      
      // Analyze funder type for specific requirements
      const funderRequirements = this.analyzeFunderType(opportunity.sourceName, opportunity.sector);
      
      // Generate dynamic outline based on requirements
      const outline = this.generateDynamicOutline(extractedRequirements, funderRequirements, opportunity);
      
      return outline;
    } catch (error) {
      console.error('Requirement analysis failed:', error);
      return this.getDefaultOutline();
    }
  }

  private extractRequirementsFromText(text: string): FundingRequirement[] {
    const requirements: FundingRequirement[] = [];
    const lowerText = text.toLowerCase();
    
    // Common requirement patterns
    const patterns = [
      // Organizational requirements
      { 
        keywords: ['organization', 'background', 'history', 'track record', 'experience'], 
        section: { 
          id: 'org-background',
          title: 'Organization Background', 
          category: 'organizational',
          priority: 'high' as const,
          required: true,
          wordLimit: 800
        }
      },
      
      // Project description requirements
      { 
        keywords: ['project', 'program', 'initiative', 'solution', 'approach'], 
        section: { 
          id: 'project-description',
          title: 'Project Description', 
          category: 'project',
          priority: 'high' as const,
          required: true,
          wordLimit: 1500
        }
      },
      
      // Budget requirements
      { 
        keywords: ['budget', 'cost', 'financial', 'funding', 'expenses'], 
        section: { 
          id: 'budget',
          title: 'Budget & Financial Plan', 
          category: 'financial',
          priority: 'high' as const,
          required: true,
          wordLimit: 1000
        }
      },
      
      // Impact requirements
      { 
        keywords: ['impact', 'outcome', 'result', 'benefit', 'change'], 
        section: { 
          id: 'impact',
          title: 'Expected Impact & Outcomes', 
          category: 'impact',
          priority: 'high' as const,
          required: true,
          wordLimit: 800
        }
      },
      
      // Implementation requirements
      { 
        keywords: ['implementation', 'timeline', 'plan', 'methodology', 'approach'], 
        section: { 
          id: 'implementation',
          title: 'Implementation Plan', 
          category: 'project',
          priority: 'medium' as const,
          required: true,
          wordLimit: 1200
        }
      },
      
      // Monitoring & Evaluation
      { 
        keywords: ['monitoring', 'evaluation', 'assessment', 'measurement', 'tracking'], 
        section: { 
          id: 'monitoring',
          title: 'Monitoring & Evaluation', 
          category: 'project',
          priority: 'medium' as const,
          required: true,
          wordLimit: 600
        }
      },
      
      // Sustainability
      { 
        keywords: ['sustainability', 'continuation', 'long-term', 'future'], 
        section: { 
          id: 'sustainability',
          title: 'Sustainability Plan', 
          category: 'project',
          priority: 'medium' as const,
          required: false,
          wordLimit: 500
        }
      },
      
      // Team/Capacity
      { 
        keywords: ['team', 'staff', 'capacity', 'expertise', 'qualifications'], 
        section: { 
          id: 'team',
          title: 'Team & Capacity', 
          category: 'organizational',
          priority: 'medium' as const,
          required: false,
          wordLimit: 600
        }
      },
      
      // Partnerships
      { 
        keywords: ['partnership', 'collaboration', 'stakeholder', 'network'], 
        section: { 
          id: 'partnerships',
          title: 'Partnerships & Collaborations', 
          category: 'organizational',
          priority: 'low' as const,
          required: false,
          wordLimit: 400
        }
      },
      
      // Risk Management
      { 
        keywords: ['risk', 'challenge', 'mitigation', 'contingency'], 
        section: { 
          id: 'risk',
          title: 'Risk Management', 
          category: 'project',
          priority: 'low' as const,
          required: false,
          wordLimit: 400
        }
      }
    ];

    patterns.forEach(pattern => {
      const hasKeywords = pattern.keywords.some(keyword => lowerText.includes(keyword));
      if (hasKeywords) {
        requirements.push({
          ...pattern.section,
          description: `This section is required based on the funding opportunity requirements.`
        });
      }
    });

    return requirements;
  }

  private analyzeFunderType(sourceName: string, sector: string): FundingRequirement[] {
    const additionalRequirements: FundingRequirement[] = [];
    const lowerSource = sourceName.toLowerCase();
    const lowerSector = sector.toLowerCase();

    // Add executive summary for most funders
    additionalRequirements.push({
      id: 'executive-summary',
      title: 'Executive Summary',
      description: 'Concise overview of the entire proposal',
      required: true,
      wordLimit: 500,
      priority: 'high',
      category: 'project'
    });

    // Problem statement for most proposals
    additionalRequirements.push({
      id: 'problem-statement',
      title: 'Problem Statement',
      description: 'Clear definition of the problem being addressed',
      required: true,
      wordLimit: 800,
      priority: 'high',
      category: 'project'
    });

    // Health-specific requirements
    if (lowerSector.includes('health') || lowerSource.includes('who') || lowerSource.includes('health')) {
      additionalRequirements.push({
        id: 'health-outcomes',
        title: 'Health Outcomes & Indicators',
        description: 'Specific health metrics and measurement frameworks',
        required: true,
        wordLimit: 600,
        priority: 'high',
        category: 'impact'
      });
    }

    // Education-specific requirements
    if (lowerSector.includes('education') || lowerSource.includes('education') || lowerSource.includes('usaid')) {
      additionalRequirements.push({
        id: 'learning-outcomes',
        title: 'Learning Outcomes & Assessment',
        description: 'Educational objectives and assessment methods',
        required: true,
        wordLimit: 600,
        priority: 'high',
        category: 'impact'
      });
    }

    // Technology-specific requirements
    if (lowerSector.includes('technology') || lowerSource.includes('tech')) {
      additionalRequirements.push({
        id: 'technical-approach',
        title: 'Technical Approach & Innovation',
        description: 'Technical methodology and innovation aspects',
        required: true,
        wordLimit: 1000,
        priority: 'high',
        category: 'technical'
      });
    }

    // Government funder requirements
    if (lowerSource.includes('government') || lowerSource.includes('usaid') || lowerSource.includes('dfid')) {
      additionalRequirements.push({
        id: 'compliance',
        title: 'Compliance & Safeguards',
        description: 'Regulatory compliance and safeguard measures',
        required: true,
        wordLimit: 400,
        priority: 'medium',
        category: 'organizational'
      });
    }

    return additionalRequirements;
  }

  private generateDynamicOutline(
    extractedRequirements: FundingRequirement[],
    funderRequirements: FundingRequirement[],
    opportunity: any
  ): ProposalOutline {
    // Combine and deduplicate requirements
    const allRequirements = [...funderRequirements, ...extractedRequirements];
    const uniqueRequirements = allRequirements.filter((req, index, self) => 
      index === self.findIndex(r => r.id === req.id)
    );

    // Sort by priority and category
    const sortedRequirements = uniqueRequirements.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const categoryOrder = { 
        project: 4, 
        organizational: 3, 
        financial: 2, 
        impact: 1, 
        technical: 0 
      };
      
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      return categoryOrder[b.category] - categoryOrder[a.category];
    });

    // Generate proposal sections
    const sections: ProposalSection[] = sortedRequirements.map((req, index) => ({
      id: req.id,
      title: req.title,
      description: req.description,
      content: '',
      wordLimit: req.wordLimit,
      required: req.required,
      aiSuggestions: this.generateSectionSuggestions(req, opportunity),
      requirements: this.generateSectionRequirements(req, opportunity),
      category: req.category,
      order: index + 1
    }));

    const totalWordCount = sections.reduce((total, section) => 
      total + (section.wordLimit || 500), 0
    );

    return {
      sections,
      totalWordCount,
      estimatedPages: Math.ceil(totalWordCount / 250), // ~250 words per page
      complianceItems: this.generateComplianceChecklist(opportunity)
    };
  }

  private generateSectionSuggestions(requirement: FundingRequirement, opportunity: any): string[] {
    const suggestions: string[] = [];
    
    switch (requirement.category) {
      case 'organizational':
        suggestions.push(
          'Include organization mission and vision',
          'Highlight relevant experience and track record',
          'Showcase team expertise and qualifications',
          'Demonstrate organizational capacity'
        );
        break;
        
      case 'project':
        suggestions.push(
          'Clearly define project objectives',
          'Explain methodology and approach',
          'Include detailed timeline and milestones',
          'Address potential challenges and solutions'
        );
        break;
        
      case 'financial':
        suggestions.push(
          'Provide detailed budget breakdown',
          'Justify all major expenses',
          'Include cost-effectiveness analysis',
          'Show matching funds or co-financing'
        );
        break;
        
      case 'impact':
        suggestions.push(
          'Define clear, measurable outcomes',
          'Include baseline data and targets',
          'Explain long-term impact and sustainability',
          'Use relevant metrics and indicators'
        );
        break;
        
      case 'technical':
        suggestions.push(
          'Explain technical innovation and uniqueness',
          'Include technical specifications and requirements',
          'Address scalability and replicability',
          'Demonstrate technical feasibility'
        );
        break;
    }
    
    return suggestions;
  }

  private generateSectionRequirements(requirement: FundingRequirement, opportunity: any): string[] {
    const requirements: string[] = [];
    
    // Add word limit requirement if specified
    if (requirement.wordLimit) {
      requirements.push(`Maximum ${requirement.wordLimit} words`);
    }
    
    // Add sector-specific requirements
    if (opportunity.sector?.toLowerCase().includes('health')) {
      requirements.push('Include health indicators and metrics');
    }
    
    if (opportunity.sector?.toLowerCase().includes('education')) {
      requirements.push('Include learning outcomes and assessment methods');
    }
    
    // Add funder-specific requirements
    if (opportunity.sourceName?.toLowerCase().includes('government')) {
      requirements.push('Ensure compliance with government regulations');
    }
    
    return requirements;
  }

  private generateComplianceChecklist(opportunity: any): string[] {
    const checklist = [
      'All required sections completed',
      'Word limits adhered to',
      'Budget totals are accurate',
      'Contact information is current',
      'Required attachments included'
    ];
    
    // Add opportunity-specific compliance items
    if (opportunity.requirements) {
      checklist.push(...opportunity.requirements.map((req: string) => 
        `Requirement met: ${req}`
      ));
    }
    
    return checklist;
  }

  private getDefaultOutline(): ProposalOutline {
    return {
      sections: [
        {
          id: 'executive-summary',
          title: 'Executive Summary',
          description: 'Concise overview of the proposal',
          content: '',
          wordLimit: 500,
          required: true,
          aiSuggestions: ['Keep it concise and compelling', 'Include key objectives and outcomes'],
          requirements: ['Maximum 500 words'],
          category: 'project',
          order: 1
        },
        {
          id: 'organization-background',
          title: 'Organization Background',
          description: 'Information about your organization',
          content: '',
          wordLimit: 800,
          required: true,
          aiSuggestions: ['Highlight relevant experience', 'Include mission and vision'],
          requirements: ['Maximum 800 words'],
          category: 'organizational',
          order: 2
        },
        {
          id: 'project-description',
          title: 'Project Description',
          description: 'Detailed description of the proposed project',
          content: '',
          wordLimit: 1500,
          required: true,
          aiSuggestions: ['Clearly define objectives', 'Explain methodology'],
          requirements: ['Maximum 1500 words'],
          category: 'project',
          order: 3
        }
      ],
      totalWordCount: 2800,
      estimatedPages: 12,
      complianceItems: ['All required sections completed', 'Word limits adhered to']
    };
  }
}

export const requirementAnalyzer = RequirementAnalyzer.getInstance();