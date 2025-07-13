import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  Search, 
  Users, 
  GraduationCap,
  Calendar,
  DollarSign,
  MapPin,
  Filter,
  Star
} from 'lucide-react';

const StudentsAcademiaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('scholarships');

  const scholarships = [
    {
      id: 1,
      title: 'Global Health Research Scholarship',
      provider: 'World Health Foundation',
      amount: '$15,000',
      deadline: '2024-08-15',
      location: 'Global/Remote',
      description: 'Supporting graduate students in health research and policy development.',
      requirements: ['GPA 3.5+', 'Research proposal', 'Letters of recommendation'],
      rating: 4.8
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
      rating: 4.6
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
      rating: 4.7
    }
  ];

  const courses = [
    {
      id: 1,
      title: 'Grant Writing Masterclass',
      provider: 'Funding Academy',
      duration: '6 weeks',
      level: 'Intermediate',
      price: 'Free',
      description: 'Learn professional grant writing techniques and best practices.',
      students: 1250,
      rating: 4.9
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
      rating: 4.7
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
      rating: 4.5
    }
  ];

  const researchOpportunities = [
    {
      id: 1,
      title: 'Healthcare Systems Analysis in East Africa',
      institution: 'African Health Research Institute',
      type: 'Paid Research Position',
      duration: '6 months',
      stipend: '$2,000/month',
      description: 'Research position focusing on healthcare delivery systems and policy analysis.',
      skills: ['Data analysis', 'Health policy', 'Research writing']
    },
    {
      id: 2,
      title: 'Technology Adoption in Rural Communities',
      institution: 'Digital Development Lab',
      type: 'Research Internship',
      duration: '3 months',
      stipend: '$1,500/month',
      description: 'Study technology adoption patterns and barriers in rural communities.',
      skills: ['Field research', 'Survey design', 'Data visualization']
    }
  ];

  const tabs = [
    { id: 'scholarships', label: 'Scholarships', icon: Award },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'research', label: 'Research', icon: Search },
    { id: 'mentoring', label: 'Mentoring', icon: Users }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'scholarships':
        return (
          <div className="space-y-6">
            {scholarships.map((scholarship) => (
              <motion.div
                key={scholarship.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{scholarship.title}</h3>
                    <p className="text-blue-600 font-medium">{scholarship.provider}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{scholarship.amount}</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{scholarship.rating}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{scholarship.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Deadline: {scholarship.deadline}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {scholarship.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Graduate Level
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.requirements.map((req, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'courses':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-blue-600 font-medium">{course.provider}</p>
                </div>

                <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">{course.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Level:</span>
                    <span className="text-sm font-medium">{course.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Students:</span>
                    <span className="text-sm font-medium">{course.students.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{course.rating}</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{course.price}</span>
                </div>

                <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Enroll Now
                </button>
              </motion.div>
            ))}
          </div>
        );

      case 'research':
        return (
          <div className="space-y-6">
            {researchOpportunities.map((research) => (
              <motion.div
                key={research.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{research.title}</h3>
                    <p className="text-blue-600 font-medium">{research.institution}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {research.type}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{research.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Duration: {research.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Stipend: {research.stipend}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {research.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply for Position
                  </button>
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Contact PI
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'mentoring':
        return (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mentoring Program</h3>
            <p className="text-gray-600 mb-6">Connect with experienced professionals and academics for guidance and support.</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Find a Mentor
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Students & Academia</h1>
          <p className="text-gray-600">Discover scholarships, courses, research opportunities, and mentoring programs.</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-wrap gap-4 items-center">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
              <option>All Categories</option>
              <option>Health & Medicine</option>
              <option>Technology</option>
              <option>Social Sciences</option>
              <option>Environment</option>
            </select>
            <select className="px-4 py-2 bg-white border border-gray-300 rounded-lg">
              <option>All Levels</option>
              <option>Undergraduate</option>
              <option>Graduate</option>
              <option>PhD</option>
              <option>Postdoc</option>
            </select>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentsAcademiaPage;