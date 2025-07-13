// Dashboard logic and utilities
export interface DashboardStats {
  label: string;
  value: string;
  icon: any;
  color: string;
  trend?: number;
}

export interface ActivityItem {
  id: number;
  type: 'application' | 'funding' | 'donor' | 'deadline';
  title: string;
  time: string;
  status: 'pending' | 'approved' | 'new' | 'urgent';
}

export interface DeadlineItem {
  id: number;
  title: string;
  deadline: string;
  amount: string;
  urgency: 'high' | 'medium' | 'low';
}

export const getDashboardData = () => {
  // This would typically fetch from API
  return {
    stats: [
      { label: 'Active Applications', value: '12', trend: 15 },
      { label: 'Total Funding', value: '$2.4M', trend: 8 },
      { label: 'Success Rate', value: '68%', trend: 12 },
      { label: 'Active Donors', value: '45', trend: 5 },
    ],
    recentActivities: [
      { id: 1, type: 'application', title: 'Health Systems Grant submitted', time: '2 hours ago', status: 'pending' },
      { id: 2, type: 'funding', title: 'Education Initiative approved', time: '1 day ago', status: 'approved' },
      { id: 3, type: 'donor', title: 'New donor match found', time: '2 days ago', status: 'new' },
      { id: 4, type: 'deadline', title: 'Research Grant deadline in 5 days', time: '3 days ago', status: 'urgent' },
    ],
    upcomingDeadlines: [
      { id: 1, title: 'Community Development Grant', deadline: '2024-07-20', amount: '$50,000', urgency: 'high' },
      { id: 2, title: 'Technology Innovation Fund', deadline: '2024-07-25', amount: '$100,000', urgency: 'medium' },
      { id: 3, title: 'Healthcare Improvement Program', deadline: '2024-08-01', amount: '$75,000', urgency: 'low' },
    ]
  };
};

export const getQuickActions = () => {
  return [
    {
      id: 'new-application',
      title: 'Create New Application',
      description: 'Start a new funding proposal',
      icon: 'FileText',
      color: 'blue',
      path: '/proposal-generator'
    },
    {
      id: 'find-donors',
      title: 'Find Donors',
      description: 'Discover matching opportunities',
      icon: 'Target',
      color: 'green',
      path: '/donor-discovery'
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Track your success metrics',
      icon: 'TrendingUp',
      color: 'purple',
      path: '/analytics'
    }
  ];
};