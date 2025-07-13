import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  Users,
  Calendar,
  Award,
  FileText,
  Eye,
  Edit,
  Download,
  Mail,
  Phone,
  MapPin,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import type { StaffMember } from '../ngoLogic';

const StaffModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample staff data
  const staffMembers: StaffMember[] = [
    {
      id: '1',
      employeeId: 'EMP001',
      firstName: 'Sarah',
      lastName: 'Nakato',
      email: 'sarah.nakato@ngo.org',
      phone: '+256-701-234567',
      position: 'Project Manager',
      department: 'Programs',
      startDate: '2022-03-15',
      status: 'active',
      contractType: 'permanent',
      supervisor: 'Dr. James Mugisha',
      documents: [
        {
          type: 'contract',
          name: 'Employment Contract 2022',
          url: '/docs/contracts/sarah-contract.pdf',
          uploadDate: '2022-03-10'
        },
        {
          type: 'id_copy',
          name: 'National ID Copy',
          url: '/docs/ids/sarah-id.pdf',
          uploadDate: '2022-03-10'
        },
        {
          type: 'cv',
          name: 'Curriculum Vitae',
          url: '/docs/cvs/sarah-cv.pdf',
          uploadDate: '2022-03-05'
        }
      ],
      performance: [
        {
          id: 'perf1',
          period: '2023-Annual',
          supervisor: 'Dr. James Mugisha',
          rating: 4.5,
          strengths: ['Leadership', 'Project Management', 'Stakeholder Engagement'],
          improvements: ['Time Management', 'Report Writing'],
          goals: ['Complete PMP Certification', 'Lead 2 major projects'],
          comments: 'Excellent performance with strong leadership qualities',
          date: '2024-01-15'
        }
      ],
      training: [
        {
          id: 'train1',
          name: 'Child Protection Training',
          type: 'safeguarding',
          provider: 'UNICEF Uganda',
          date: '2024-02-20',
          duration: 16,
          status: 'completed',
          certificate: '/docs/certificates/sarah-child-protection.pdf'
        },
        {
          id: 'train2',
          name: 'Project Management Professional (PMP)',
          type: 'technical',
          provider: 'PMI Uganda',
          date: '2024-06-15',
          duration: 40,
          status: 'completed',
          certificate: '/docs/certificates/sarah-pmp.pdf'
        }
      ],
      leave: [
        {
          id: 'leave1',
          type: 'annual',
          startDate: '2024-08-01',
          endDate: '2024-08-15',
          days: 14,
          status: 'approved',
          approver: 'Dr. James Mugisha',
          reason: 'Family vacation'
        }
      ]
    },
    {
      id: '2',
      employeeId: 'EMP002',
      firstName: 'James',
      lastName: 'Okello',
      email: 'james.okello@ngo.org',
      phone: '+256-702-345678',
      position: 'Field Coordinator',
      department: 'Operations',
      startDate: '2021-08-20',
      status: 'active',
      contractType: 'permanent',
      supervisor: 'Sarah Nakato',
      documents: [],
      performance: [],
      training: [
        {
          id: 'train3',
          name: 'Emergency Response Training',
          type: 'technical',
          provider: 'Red Cross Uganda',
          date: '2024-03-10',
          duration: 24,
          status: 'completed'
        }
      ],
      leave: []
    },
    {
      id: '3',
      employeeId: 'VOL001',
      firstName: 'Grace',
      lastName: 'Tumukunde',
      email: 'grace.tumukunde@ngo.org',
      phone: '+256-703-456789',
      position: 'Community Volunteer',
      department: 'Community',
      startDate: '2024-01-10',
      status: 'active',
      contractType: 'volunteer',
      supervisor: 'James Okello',
      documents: [],
      performance: [],
      training: [
        {
          id: 'train4',
          name: 'Community Mobilization',
          type: 'technical',
          provider: 'NGO Internal Training',
          date: '2024-01-15',
          duration: 8,
          status: 'completed'
        }
      ],
      leave: []
    },
    {
      id: '4',
      employeeId: 'EMP003',
      firstName: 'Robert',
      lastName: 'Kayongo',
      email: 'robert.kayongo@ngo.org',
      phone: '+256-704-567890',
      position: 'Finance Officer',
      department: 'Finance',
      startDate: '2023-06-01',
      status: 'active',
      contractType: 'contract',
      supervisor: 'Mary Asiimwe',
      documents: [],
      performance: [],
      training: [
        {
          id: 'train5',
          name: 'Financial Management for NGOs',
          type: 'technical',
          provider: 'ACCA Uganda',
          date: '2024-04-20',
          duration: 32,
          status: 'completed'
        }
      ],
      leave: []
    },
    {
      id: '5',
      employeeId: 'INT001',
      firstName: 'Betty',
      lastName: 'Namukasa',
      email: 'betty.namukasa@ngo.org',
      phone: '+256-705-678901',
      position: 'Communications Intern',
      department: 'Communications',
      startDate: '2024-05-01',
      endDate: '2024-11-01',
      status: 'active',
      contractType: 'intern',
      supervisor: 'David Ssemakula',
      documents: [],
      performance: [],
      training: [],
      leave: []
    }
  ];

  const staffStats = {
    total: staffMembers.length,
    permanent: staffMembers.filter(s => s.contractType === 'permanent').length,
    contract: staffMembers.filter(s => s.contractType === 'contract').length,
    volunteers: staffMembers.filter(s => s.contractType === 'volunteer').length,
    interns: staffMembers.filter(s => s.contractType === 'intern').length,
    trainingCompliance: Math.round((staffMembers.filter(s => 
      s.training.some(t => t.type === 'safeguarding' && t.status === 'completed')
    ).length / staffMembers.length) * 100)
  };

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || staff.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getContractTypeIcon = (type: string) => {
    switch (type) {
      case 'permanent': return <Briefcase className="w-4 h-4" />;
      case 'contract': return <FileText className="w-4 h-4" />;
      case 'volunteer': return <Users className="w-4 h-4" />;
      case 'intern': return <GraduationCap className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'permanent': return 'bg-green-100 text-green-700';
      case 'contract': return 'bg-blue-100 text-blue-700';
      case 'volunteer': return 'bg-purple-100 text-purple-700';
      case 'intern': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'terminated': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPerformanceRating = (staff: StaffMember) => {
    if (staff.performance.length === 0) return null;
    const latestPerformance = staff.performance[staff.performance.length - 1];
    return latestPerformance.rating;
  };

  const hasSafeguardingTraining = (staff: StaffMember) => {
    return staff.training.some(t => t.type === 'safeguarding' && t.status === 'completed');
  };

  const getTenure = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years}y ${months}m`;
    }
    return `${months}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Volunteer & Staff Management</h1>
          <p className="text-gray-600">Manage staff directory, volunteers, HR processes, and performance tracking.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Staff Member
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export List
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{staffStats.total}</p>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
            </div>
            <UserCheck className="w-8 h-8 text-teal-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{staffStats.permanent}</p>
              <p className="text-sm font-medium text-gray-600">Permanent</p>
            </div>
            <Briefcase className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{staffStats.contract}</p>
              <p className="text-sm font-medium text-gray-600">Contract</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{staffStats.volunteers}</p>
              <p className="text-sm font-medium text-gray-600">Volunteers</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{staffStats.interns}</p>
              <p className="text-sm font-medium text-gray-600">Interns</p>
            </div>
            <GraduationCap className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{staffStats.trainingCompliance}%</p>
              <p className="text-sm font-medium text-gray-600">Training</p>
            </div>
            <Award className="w-8 h-8 text-orange-500" />
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search staff by name, position, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="Programs">Programs</option>
              <option value="Operations">Operations</option>
              <option value="Finance">Finance</option>
              <option value="Communications">Communications</option>
              <option value="Community">Community</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="terminated">Terminated</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff, index) => (
          <motion.div
            key={staff.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {staff.firstName[0]}{staff.lastName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{staff.firstName} {staff.lastName}</h3>
                  <p className="text-sm text-gray-600">{staff.position}</p>
                  <p className="text-xs text-gray-500">{staff.employeeId}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                  {staff.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getContractTypeColor(staff.contractType)}`}>
                  {getContractTypeIcon(staff.contractType)}
                  {staff.contractType}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="truncate">{staff.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{staff.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{staff.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Tenure: {getTenure(staff.startDate)}</span>
              </div>
              {staff.supervisor && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Reports to: {staff.supervisor}</span>
                </div>
              )}
            </div>

            {/* Performance & Training Indicators */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  {getPerformanceRating(staff) ? (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold text-sm">{getPerformanceRating(staff)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">N/A</span>
                  )}
                </div>
                <p className="text-xs text-gray-600">Performance</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <span className="font-bold text-sm">{staff.training.length}</span>
                </div>
                <p className="text-xs text-gray-600">Trainings</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  {hasSafeguardingTraining(staff) ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <p className="text-xs text-gray-600">Safeguarding</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm">
                <Eye className="w-4 h-4" />
                View
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Edit className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-teal-600" />
            <h3 className="font-bold text-gray-900">Training Management</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Schedule training sessions, track certifications, and manage compliance.</p>
          <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            Manage Training
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-6 h-6 text-yellow-600" />
            <h3 className="font-bold text-gray-900">Performance Reviews</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Conduct annual reviews, set goals, and track performance improvements.</p>
          <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            Review Performance
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-900">Leave Management</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Process leave requests, track balances, and manage holiday schedules.</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Manage Leave
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffModule;