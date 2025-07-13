// Jobs module logic and data management
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string;
  deadline: string;
  rating: number;
  saved: boolean;
  category: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface JobStats {
  label: string;
  value: string;
  icon: any;
  color: string;
}

export const getJobs = (filters?: {
  category?: string;
  type?: string;
  experience?: string;
  salary?: string;
  search?: string;
}) => {
  const allJobs: Job[] = [
    {
      id: 1,
      title: 'Program Manager - Health Systems',
      company: 'Global Health Partners',
      location: 'Kampala, Uganda',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '$45,000 - $60,000',
      description: 'Lead health system strengthening programs across East Africa. Manage implementation of community health initiatives and coordinate with local partners.',
      requirements: [
        'Masters in Public Health or related field',
        'Experience in program management',
        'Knowledge of health systems in East Africa',
        'Strong communication skills'
      ],
      benefits: ['Health insurance', 'Professional development', 'Flexible working', 'Travel opportunities'],
      posted: '2 days ago',
      deadline: '2024-08-15',
      rating: 4.8,
      saved: false,
      category: 'health',
      urgency: 'high'
    },
    {
      id: 2,
      title: 'Research Coordinator',
      company: 'African Development Research Institute',
      location: 'Nairobi, Kenya',
      type: 'Contract',
      experience: '2-4 years',
      salary: '$35,000 - $45,000',
      description: 'Coordinate multi-country research projects focusing on economic development and poverty reduction in Sub-Saharan Africa.',
      requirements: [
        'PhD in Economics, Development Studies, or related field',
        'Research experience in development economics',
        'Statistical analysis skills (R, Stata, Python)',
        'Experience with field research'
      ],
      benefits: ['Research funding', 'Conference attendance', 'Publication support', 'Networking opportunities'],
      posted: '1 week ago',
      deadline: '2024-07-30',
      rating: 4.6,
      saved: true,
      category: 'research',
      urgency: 'medium'
    },
    {
      id: 3,
      title: 'Grant Writer & Fundraising Specialist',
      company: 'Community Development Network',
      location: 'Remote (Africa)',
      type: 'Full-time',
      experience: '3-6 years',
      salary: '$40,000 - $55,000',
      description: 'Develop funding strategies and write compelling grant proposals for community development projects across Africa.',
      requirements: [
        'Proven track record in grant writing',
        'Experience with international donors',
        'Strong writing and communication skills',
        'Knowledge of development sector'
      ],
      benefits: ['Remote work', 'Performance bonuses', 'Training programs', 'Career advancement'],
      posted: '3 days ago',
      deadline: '2024-08-01',
      rating: 4.7,
      saved: false,
      category: 'development',
      urgency: 'high'
    },
    {
      id: 4,
      title: 'Technology Project Manager',
      company: 'Digital Innovation Hub',
      location: 'Lagos, Nigeria',
      type: 'Full-time',
      experience: '4-7 years',
      salary: '$50,000 - $70,000',
      description: 'Manage technology projects that create digital solutions for social impact across Africa.',
      requirements: [
        'Computer Science or Engineering degree',
        'Project management certification (PMP)',
        'Experience with software development lifecycle',
        'Understanding of African tech ecosystem'
      ],
      benefits: ['Equity options', 'Innovation time', 'Tech conferences', 'Startup environment'],
      posted: '5 days ago',
      deadline: '2024-08-10',
      rating: 4.9,
      saved: false,
      category: 'technology',
      urgency: 'medium'
    }
  ];

  return allJobs.filter(job => {
    if (filters?.category && filters.category !== 'all' && job.category !== filters.category) return false;
    if (filters?.type && job.type !== filters.type) return false;
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    return true;
  });
};

export const getJobCategories = () => {
  return [
    { id: 'all', label: 'All Jobs', count: 150 },
    { id: 'health', label: 'Health & Medicine', count: 35 },
    { id: 'research', label: 'Research & Academia', count: 28 },
    { id: 'development', label: 'Development & NGO', count: 42 },
    { id: 'technology', label: 'Technology', count: 25 },
    { id: 'finance', label: 'Finance & Grants', count: 20 }
  ];
};

export const getJobStats = (): JobStats[] => {
  return [
    { label: 'Total Jobs', value: '150+', icon: 'Briefcase', color: 'blue' },
    { label: 'Active Employers', value: '85', icon: 'Building', color: 'green' },
    { label: 'Average Salary', value: '$48K', icon: 'DollarSign', color: 'purple' },
    { label: 'Success Rate', value: '78%', icon: 'Star', color: 'orange' }
  ];
};

export const toggleJobSave = (jobId: number, jobs: Job[]): Job[] => {
  return jobs.map(job => 
    job.id === jobId 
      ? { ...job, saved: !job.saved }
      : job
  );
};

export const getRecommendedJobs = (userProfile?: any): Job[] => {
  // This would typically use user profile data to recommend jobs
  const jobs = getJobs();
  return jobs.slice(0, 3); // Return top 3 for now
};