// Students & Academia logic and data management
export interface Scholarship {
  id: number;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  location: string;
  description: string;
  requirements: string[];
  rating: number;
  category: string;
  level: 'undergraduate' | 'graduate' | 'phd' | 'postdoc';
}

export interface Course {
  id: number;
  title: string;
  provider: string;
  duration: string;
  level: string;
  price: string;
  description: string;
  students: number;
  rating: number;
  category: string;
}

export interface ResearchOpportunity {
  id: number;
  title: string;
  institution: string;
  type: string;
  duration: string;
  stipend: string;
  description: string;
  skills: string[];
  category: string;
}

export const getScholarships = (category?: string, level?: string) => {
  const allScholarships: Scholarship[] = [
    {
      id: 1,
      title: 'Global Health Research Scholarship',
      provider: 'World Health Foundation',
      amount: '$15,000',
      deadline: '2024-08-15',
      location: 'Global/Remote',
      description: 'Supporting graduate students in health research and policy development.',
      requirements: ['GPA 3.5+', 'Research proposal', 'Letters of recommendation'],
      rating: 4.8,
      category: 'health',
      level: 'graduate'
    },
    {
      id: 2,
      title: 'Technology Innovation Grant',
      provider: 'Tech for Good Foundation',
      amount: '$25,000',
      deadline: '2024-09-01',
      location: 'East Africa',
      description: 'Funding innovative technology solutions for social impact.',
      requirements: ['Technical background', 'Project proposal', 'Team formation'],
      rating: 4.6,
      category: 'technology',
      level: 'graduate'
    },
    {
      id: 3,
      title: 'Community Development Fellowship',
      provider: 'Social Impact Institute',
      amount: '$12,000',
      deadline: '2024-07-30',
      location: 'Uganda',
      description: 'One-year fellowship focusing on community-based development projects.',
      requirements: ['Community experience', 'Leadership skills', 'Project plan'],
      rating: 4.7,
      category: 'development',
      level: 'graduate'
    }
  ];

  return allScholarships.filter(scholarship => {
    if (category && category !== 'all' && scholarship.category !== category) return false;
    if (level && level !== 'all' && scholarship.level !== level) return false;
    return true;
  });
};

export const getCourses = (category?: string) => {
  const allCourses: Course[] = [
    {
      id: 1,
      title: 'Grant Writing Masterclass',
      provider: 'Funding Academy',
      duration: '6 weeks',
      level: 'Intermediate',
      price: 'Free',
      description: 'Learn professional grant writing techniques and best practices.',
      students: 1250,
      rating: 4.9,
      category: 'funding'
    },
    {
      id: 2,
      title: 'Research Methodology in Health',
      provider: 'Global Health University',
      duration: '12 weeks',
      level: 'Advanced',
      price: '$299',
      description: 'Comprehensive research methods for health and medical studies.',
      students: 850,
      rating: 4.7,
      category: 'health'
    },
    {
      id: 3,
      title: 'Social Impact Measurement',
      provider: 'Impact Learning Center',
      duration: '8 weeks',
      level: 'Beginner',
      price: '$149',
      description: 'Learn to measure and evaluate social impact of development projects.',
      students: 650,
      rating: 4.5,
      category: 'development'
    }
  ];

  return allCourses.filter(course => {
    if (category && category !== 'all' && course.category !== category) return false;
    return true;
  });
};

export const getResearchOpportunities = (category?: string) => {
  const opportunities: ResearchOpportunity[] = [
    {
      id: 1,
      title: 'Healthcare Systems Analysis in East Africa',
      institution: 'African Health Research Institute',
      type: 'Paid Research Position',
      duration: '6 months',
      stipend: '$2,000/month',
      description: 'Research position focusing on healthcare delivery systems and policy analysis.',
      skills: ['Data analysis', 'Health policy', 'Research writing'],
      category: 'health'
    },
    {
      id: 2,
      title: 'Technology Adoption in Rural Communities',
      institution: 'Digital Development Lab',
      type: 'Research Internship',
      duration: '3 months',
      stipend: '$1,500/month',
      description: 'Study technology adoption patterns and barriers in rural communities.',
      skills: ['Field research', 'Survey design', 'Data visualization'],
      category: 'technology'
    }
  ];

  return opportunities.filter(opportunity => {
    if (category && category !== 'all' && opportunity.category !== category) return false;
    return true;
  });
};

export const getAcademiaCategories = () => {
  return [
    { id: 'all', label: 'All Categories', count: 25 },
    { id: 'health', label: 'Health & Medicine', count: 8 },
    { id: 'technology', label: 'Technology', count: 6 },
    { id: 'development', label: 'Development Studies', count: 5 },
    { id: 'funding', label: 'Funding & Grants', count: 4 },
    { id: 'environment', label: 'Environment', count: 2 }
  ];
};