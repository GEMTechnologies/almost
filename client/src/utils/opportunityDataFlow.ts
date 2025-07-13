// Utility functions for seamless data flow from donor discovery to proposal generation

interface OpportunityData {
  id: string;
  title: string;
  description: string;
  country: string;
  sector: string;
  amountMin: number;
  amountMax: number;
  currency: string;
  deadline: string;
  sourceUrl: string;
  sourceName: string;
  isVerified: boolean;
  requirements?: string[];
  eligibility?: string[];
  funderPriorities?: string[];
  applicationFormat?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  fundingType?: string;
  tags?: string[];
}

interface ProposalFormData {
  opportunityId: string;
  organizationName: string;
  organizationType: string;
  projectTitle: string;
  projectDescription: string;
  requestedAmount: string;
  projectDuration: string;
  targetBeneficiaries: string;
  problemStatement: string;
  solutionApproach: string;
  expectedOutcomes: string;
  documentFormat: string;
}

export const transformOpportunityToProposalData = (
  opportunity: OpportunityData,
  userProfile?: any
): Partial<ProposalFormData> => {
  const averageAmount = Math.floor((opportunity.amountMin + opportunity.amountMax) / 2);
  
  // Generate smart project title based on opportunity
  const projectTitle = generateProjectTitle(opportunity);
  
  // Create problem statement template based on sector and opportunity
  const problemStatement = generateProblemStatement(opportunity);
  
  // Generate solution approach template
  const solutionApproach = generateSolutionApproach(opportunity);
  
  // Generate expected outcomes template
  const expectedOutcomes = generateExpectedOutcomes(opportunity);
  
  return {
    opportunityId: opportunity.id,
    organizationName: userProfile?.organizationName || '',
    organizationType: userProfile?.organizationType || 'Non-Profit Organization',
    projectTitle,
    projectDescription: `Project aligned with ${opportunity.title} focusing on ${opportunity.sector} sector in ${opportunity.country}`,
    requestedAmount: averageAmount.toString(),
    projectDuration: determineDuration(opportunity),
    targetBeneficiaries: generateTargetBeneficiaries(opportunity),
    problemStatement,
    solutionApproach,
    expectedOutcomes,
    documentFormat: opportunity.applicationFormat || 'docx'
  };
};

const generateProjectTitle = (opportunity: OpportunityData): string => {
  const sectorKeywords = {
    'Health': ['Health', 'Wellness', 'Care', 'Medical'],
    'Education': ['Education', 'Learning', 'Academic', 'Skills'],
    'Environment': ['Environmental', 'Green', 'Sustainable', 'Climate'],
    'Agriculture': ['Agricultural', 'Farming', 'Food', 'Rural'],
    'Technology': ['Digital', 'Tech', 'Innovation', 'Smart'],
    'Economic Development': ['Economic', 'Business', 'Trade', 'Development']
  };
  
  const keywords = sectorKeywords[opportunity.sector as keyof typeof sectorKeywords] || ['Community'];
  const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
  
  return `${randomKeyword} Innovation Initiative for ${opportunity.country}`;
};

const generateProblemStatement = (opportunity: OpportunityData): string => {
  const templates = {
    'Health': `Limited access to quality healthcare services affects vulnerable populations in ${opportunity.country}, with inadequate infrastructure and shortage of trained medical personnel creating significant barriers to essential health services.`,
    
    'Education': `Educational disparities persist in ${opportunity.country}, where many communities lack access to quality learning opportunities, modern educational resources, and skilled educators, limiting potential for sustainable development.`,
    
    'Environment': `Environmental degradation and climate change impacts threaten sustainable development in ${opportunity.country}, requiring immediate intervention to protect natural resources and build community resilience.`,
    
    'Agriculture': `Food security challenges and agricultural productivity limitations affect rural communities in ${opportunity.country}, where smallholder farmers lack access to modern techniques, markets, and sustainable farming practices.`,
    
    'Technology': `The digital divide limits access to technology and innovation opportunities in ${opportunity.country}, preventing communities from benefiting from digital solutions and modern communication technologies.`,
    
    'Economic Development': `Economic opportunities remain limited for marginalized communities in ${opportunity.country}, where lack of access to financial services, markets, and business development support hinders sustainable livelihoods.`
  };
  
  return templates[opportunity.sector as keyof typeof templates] || 
    `Significant challenges exist in the ${opportunity.sector.toLowerCase()} sector in ${opportunity.country}, requiring innovative solutions to address community needs and promote sustainable development.`;
};

const generateSolutionApproach = (opportunity: OpportunityData): string => {
  const approaches = {
    'Health': 'Our evidence-based approach combines community health worker training, mobile health services, and technology integration to improve healthcare access and quality in underserved areas.',
    
    'Education': 'We will implement a comprehensive educational enhancement program featuring teacher training, curriculum development, technology integration, and community engagement to improve learning outcomes.',
    
    'Environment': 'Our multi-faceted environmental program includes community-based conservation, renewable energy initiatives, waste management systems, and climate adaptation strategies.',
    
    'Agriculture': 'We propose an integrated agricultural development approach combining modern farming techniques, market linkage facilitation, cooperative formation, and sustainable resource management.',
    
    'Technology': 'Our digital inclusion strategy involves infrastructure development, digital literacy training, technology access programs, and innovation hub establishment to bridge the digital divide.',
    
    'Economic Development': 'We will implement a holistic economic empowerment program featuring microfinance, business development training, market access facilitation, and entrepreneurship support.'
  };
  
  return approaches[opportunity.sector as keyof typeof approaches] || 
    `Our comprehensive approach addresses ${opportunity.sector.toLowerCase()} challenges through community engagement, capacity building, and sustainable intervention strategies.`;
};

const generateExpectedOutcomes = (opportunity: OpportunityData): string => {
  const outcomes = {
    'Health': 'Expected outcomes include 40% improvement in healthcare access, training of 150+ community health workers, establishment of 5 health service points, and sustainable health behavior change among 2,000+ beneficiaries.',
    
    'Education': 'Anticipated results include 50% improvement in learning outcomes, training of 75+ educators, establishment of 3 learning centers, and enhanced educational opportunities for 1,500+ students.',
    
    'Environment': 'Target outcomes include 30% reduction in environmental degradation, establishment of 10 conservation initiatives, training of 200+ community members, and improved climate resilience for 3,000+ people.',
    
    'Agriculture': 'Expected results include 60% increase in agricultural productivity, formation of 8 farmer cooperatives, training of 300+ farmers, and improved food security for 2,500+ individuals.',
    
    'Technology': 'Anticipated outcomes include 70% increase in digital access, training of 400+ community members, establishment of 4 technology centers, and enhanced digital literacy for 1,800+ beneficiaries.',
    
    'Economic Development': 'Target results include 45% increase in household income, creation of 250+ sustainable livelihoods, establishment of 6 business support centers, and economic empowerment for 2,200+ individuals.'
  };
  
  return outcomes[opportunity.sector as keyof typeof outcomes] || 
    `Expected outcomes include significant improvements in ${opportunity.sector.toLowerCase()}, sustainable community development, and measurable positive impact for target beneficiaries.`;
};

const generateTargetBeneficiaries = (opportunity: OpportunityData): string => {
  const beneficiaries = {
    'Health': `Rural communities, women, children, elderly, and marginalized populations in ${opportunity.country}`,
    'Education': `Students, teachers, parents, and educational institutions in underserved areas of ${opportunity.country}`,
    'Environment': `Environmental stewards, farmers, local communities, and future generations in ${opportunity.country}`,
    'Agriculture': `Smallholder farmers, rural cooperatives, agricultural communities, and food-insecure populations in ${opportunity.country}`,
    'Technology': `Youth, entrepreneurs, small businesses, and digitally excluded communities in ${opportunity.country}`,
    'Economic Development': `Low-income families, women entrepreneurs, youth, and marginalized communities in ${opportunity.country}`
  };
  
  return beneficiaries[opportunity.sector as keyof typeof beneficiaries] || 
    `Communities and individuals affected by ${opportunity.sector.toLowerCase()} challenges in ${opportunity.country}`;
};

const determineDuration = (opportunity: OpportunityData): string => {
  const amount = (opportunity.amountMin + opportunity.amountMax) / 2;
  
  if (amount < 25000) return '12 months';
  if (amount < 100000) return '18 months';
  if (amount < 250000) return '24 months';
  return '36 months';
};

export const saveOpportunityContext = (opportunity: OpportunityData) => {
  localStorage.setItem('selectedOpportunity', JSON.stringify(opportunity));
  localStorage.setItem('opportunityTimestamp', Date.now().toString());
};

export const getOpportunityContext = (): OpportunityData | null => {
  try {
    const stored = localStorage.getItem('selectedOpportunity');
    const timestamp = localStorage.getItem('opportunityTimestamp');
    
    if (!stored || !timestamp) return null;
    
    // Context expires after 1 hour
    const oneHour = 60 * 60 * 1000;
    if (Date.now() - parseInt(timestamp) > oneHour) {
      clearOpportunityContext();
      return null;
    }
    
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const clearOpportunityContext = () => {
  localStorage.removeItem('selectedOpportunity');
  localStorage.removeItem('opportunityTimestamp');
};