// Intelligent Auto-Fill Service with AI Assistance

interface UserProfile {
  id: string;
  organizationName: string;
  organizationType: string;
  sector: string;
  country: string;
  previousProposals: any[];
  expertise: string[];
}

interface AutoFillSuggestions {
  problemStatement: string[];
  solutionApproach: string[];
  expectedOutcomes: string[];
  organizationNames: string[];
  projectTitles: string[];
  targetBeneficiaries: string[];
}

class IntelligentAutoFillService {
  private userProfile: UserProfile | null = null;
  
  async loadUserProfile(userId: string): Promise<UserProfile> {
    // In production, this would fetch from database
    const mockProfile: UserProfile = {
      id: userId,
      organizationName: "Health for All Foundation",
      organizationType: "NGO",
      sector: "Health",
      country: "Uganda",
      previousProposals: [
        {
          title: "Community Health Workers Training Program",
          problemStatement: "Limited access to healthcare in rural communities",
          solutionApproach: "Train and deploy community health workers",
          targetBeneficiaries: ["Rural communities", "Women", "Children under 5"]
        },
        {
          title: "Maternal Health Improvement Initiative",
          problemStatement: "High maternal mortality rates in remote areas", 
          solutionApproach: "Mobile health clinics and skilled birth attendants",
          targetBeneficiaries: ["Pregnant women", "New mothers", "Rural families"]
        }
      ],
      expertise: ["Community Health", "Training Programs", "Mobile Health Services"]
    };
    
    this.userProfile = mockProfile;
    return mockProfile;
  }

  async getAutoFillSuggestions(fieldType: string, currentInput: string): Promise<string[]> {
    if (!this.userProfile) return [];

    const suggestions: Record<string, string[]> = {
      organizationName: [
        this.userProfile.organizationName,
        `${this.userProfile.organizationName} Foundation`,
        `${this.userProfile.organizationName} Initiative`
      ],
      
      problemStatement: [
        "Limited access to quality healthcare services in underserved communities",
        "Lack of trained healthcare workers in rural and remote areas",
        "Inadequate health infrastructure and medical equipment",
        "Poor health education and awareness among target populations",
        "High disease burden due to preventable conditions",
        ...this.extractFromPreviousProposals('problemStatement')
      ],
      
      solutionApproach: [
        "Implement community-based health interventions with local partnerships",
        "Develop capacity building programs for healthcare workers",
        "Establish mobile health services to reach remote populations",
        "Create health education campaigns using culturally appropriate methods",
        "Build sustainable health systems through technology integration",
        ...this.extractFromPreviousProposals('solutionApproach')
      ],
      
      expectedOutcomes: [
        "Improved health outcomes for target beneficiaries",
        "Increased access to quality healthcare services",
        "Enhanced capacity of local healthcare systems",
        "Reduced morbidity and mortality rates",
        "Strengthened community health networks",
        "Sustainable behavior change in health practices"
      ],
      
      targetBeneficiaries: [
        "Rural communities in " + this.userProfile.country,
        "Women and children in underserved areas",
        "Healthcare workers and community volunteers",
        "Vulnerable populations including elderly and disabled",
        "Students and youth in target communities",
        ...this.extractFromPreviousProposals('targetBeneficiaries').flat()
      ],
      
      projectTitle: this.generateProjectTitles(currentInput)
    };

    const fieldSuggestions = suggestions[fieldType] || [];
    return this.filterAndRankSuggestions(fieldSuggestions, currentInput);
  }

  private extractFromPreviousProposals(field: string): string[] {
    if (!this.userProfile?.previousProposals) return [];
    
    return this.userProfile.previousProposals
      .map(proposal => proposal[field])
      .filter(Boolean)
      .flat();
  }

  private generateProjectTitles(input: string): string[] {
    const { sector, organizationType } = this.userProfile || {};
    const templates = [
      `${sector} Innovation Program`,
      `Community ${sector} Initiative`,
      `Sustainable ${sector} Development Project`,
      `${sector} Capacity Building Program`,
      `Integrated ${sector} Solutions`,
      `${sector} Access and Quality Improvement`,
      `${sector} Technology Integration Project`,
      `${sector} Community Empowerment Initiative`
    ];
    
    if (input.length > 3) {
      templates.unshift(
        `${input} Enhancement Program`,
        `${input} Development Initiative`,
        `${input} Innovation Project`
      );
    }
    
    return templates;
  }

  private filterAndRankSuggestions(suggestions: string[], input: string): string[] {
    if (!input || input.length < 2) {
      return suggestions.slice(0, 8);
    }
    
    const filtered = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(input.toLowerCase())
    );
    
    const exact = filtered.filter(s => 
      s.toLowerCase().startsWith(input.toLowerCase())
    );
    
    const partial = filtered.filter(s => 
      !s.toLowerCase().startsWith(input.toLowerCase())
    );
    
    return [...exact, ...partial].slice(0, 8);
  }

  async generateSmartContent(fieldType: string, context: any): Promise<string> {
    // AI-powered content generation based on context
    const prompts: Record<string, string> = {
      problemStatement: `Generate a compelling problem statement for a ${context.sector} project in ${context.country}`,
      solutionApproach: `Suggest an evidence-based solution approach for: ${context.problemStatement}`,
      expectedOutcomes: `Define measurable outcomes for: ${context.solutionApproach}`,
      projectDescription: `Create a detailed project description based on: ${JSON.stringify(context)}`
    };

    // Simulate AI generation (in production, this would call DeepSeek API)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses: Record<string, string> = {
      problemStatement: `Limited access to quality ${context.sector?.toLowerCase() || 'health'} services affects over 60% of rural communities in ${context.country || 'the target region'}, with inadequate infrastructure, shortage of trained personnel, and cultural barriers preventing effective service delivery to vulnerable populations.`,
      
      solutionApproach: `Our evidence-based approach combines community engagement, capacity building, and technology integration to address systemic challenges. We will implement a multi-phase strategy including stakeholder consultation, infrastructure development, training programs, and sustainable monitoring systems.`,
      
      expectedOutcomes: `Expected outcomes include 40% improvement in service access, training of 150 community workers, establishment of 5 service points, and sustainable behavior change among 2,000 beneficiaries, measured through baseline and endline assessments.`,
      
      projectDescription: `This comprehensive initiative addresses critical gaps in ${context.sector?.toLowerCase() || 'community'} services through innovative, community-driven solutions. The project leverages local partnerships, evidence-based methodologies, and sustainable practices to create lasting positive impact for underserved populations.`
    };

    return responses[fieldType] || "AI-generated content based on your inputs and organizational profile.";
  }

  async validateAndEnhance(field: string, content: string): Promise<{
    isValid: boolean;
    suggestions: string[];
    enhancedContent?: string;
  }> {
    // Real-time validation and enhancement
    const validation = {
      problemStatement: {
        minWords: 20,
        shouldInclude: ['community', 'challenge', 'need', 'gap'],
        enhancement: 'Consider adding specific statistics or evidence'
      },
      solutionApproach: {
        minWords: 25,
        shouldInclude: ['approach', 'strategy', 'implement', 'deliver'],
        enhancement: 'Include methodology and expected timeline'
      },
      expectedOutcomes: {
        minWords: 15,
        shouldInclude: ['improve', 'increase', 'reduce', 'achieve'],
        enhancement: 'Add specific, measurable targets'
      }
    };

    const rules = validation[field as keyof typeof validation];
    if (!rules) return { isValid: true, suggestions: [] };

    const wordCount = content.split(' ').length;
    const isValid = wordCount >= rules.minWords;
    const suggestions = [];

    if (!isValid) {
      suggestions.push(`Add more detail (minimum ${rules.minWords} words)`);
    }

    const hasKeywords = rules.shouldInclude.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    if (!hasKeywords) {
      suggestions.push(`Consider including: ${rules.shouldInclude.join(', ')}`);
    }

    if (suggestions.length === 0) {
      suggestions.push(rules.enhancement);
    }

    return { isValid, suggestions };
  }
}

export const intelligentAutoFill = new IntelligentAutoFillService();