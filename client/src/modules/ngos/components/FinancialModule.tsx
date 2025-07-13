import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Download,
  Calendar,
  FileText,
  PieChart,
  BarChart3,
  Receipt,
  CreditCard,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import type { FinancialReport, Transaction } from '../ngoLogic';

const FinancialModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample financial reports
  const financialReports: FinancialReport[] = [
    {
      id: '1',
      type: 'annual',
      period: '2023',
      totalIncome: 4500000,
      totalExpenditure: 4200000,
      netResult: 300000,
      categories: [
        { name: 'Grants', budgeted: 4000000, actual: 4200000, variance: 200000, percentage: 93.3 },
        { name: 'Donations', budgeted: 300000, actual: 280000, variance: -20000, percentage: 6.2 },
        { name: 'Other Income', budgeted: 50000, actual: 20000, variance: -30000, percentage: 0.4 }
      ],
      variance: 5.0,
      status: 'audited',
      preparedBy: 'Finance Manager',
      approvedBy: 'Executive Director',
      date: '2024-03-31'
    },
    {
      id: '2',
      type: 'quarterly',
      period: 'Q2 2024',
      totalIncome: 1200000,
      totalExpenditure: 1150000,
      netResult: 50000,
      categories: [
        { name: 'Programs', budgeted: 800000, actual: 820000, variance: 20000, percentage: 71.3 },
        { name: 'Administration', budgeted: 200000, actual: 180000, variance: -20000, percentage: 15.7 },
        { name: 'Fundraising', budgeted: 150000, actual: 150000, variance: 0, percentage: 13.0 }
      ],
      variance: 2.5,
      status: 'final',
      preparedBy: 'Finance Officer',
      approvedBy: 'Finance Manager',
      date: '2024-07-15'
    }
  ];

  // Sample transactions
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-07-15',
      description: 'Gates Foundation Grant - Health Systems Project Q2',
      category: 'Grant Income',
      type: 'income',
      amount: 625000,
      currency: 'USD',
      donor: 'Gates Foundation',
      project: 'Health Systems Strengthening',
      receipt: 'RCP-2024-0715-001',
      status: 'approved'
    },
    {
      id: '2',
      date: '2024-07-14',
      description: 'Medical Equipment Purchase - Gulu Health Center',
      category: 'Medical Supplies',
      type: 'expense',
      amount: 85000,
      currency: 'USD',
      project: 'Health Systems Strengthening',
      receipt: 'INV-2024-0714-045',
      status: 'approved',
      approver: 'Project Manager'
    },
    {
      id: '3',
      date: '2024-07-13',
      description: 'Staff Salaries - July 2024',
      category: 'Personnel',
      type: 'expense',
      amount: 45000,
      currency: 'USD',
      receipt: 'PAY-2024-07-001',
      status: 'approved',
      approver: 'HR Manager'
    },
    {
      id: '4',
      date: '2024-07-12',
      description: 'Individual Donation - Dr. Sarah Johnson',
      category: 'Individual Donations',
      type: 'income',
      amount: 5000,
      currency: 'USD',
      donor: 'Dr. Sarah Johnson',
      receipt: 'RCP-2024-0712-002',
      status: 'approved'
    },
    {
      id: '5',
      date: '2024-07-11',
      description: 'Training Workshop Expenses - Kampala',
      category: 'Training',
      type: 'expense',
      amount: 12000,
      currency: 'USD',
      project: 'Capacity Building',
      receipt: 'TRN-2024-0711-008',
      status: 'pending'
    },
    {
      id: '6',
      date: '2024-07-10',
      description: 'Vehicle Maintenance - Field Operations',
      category: 'Transportation',
      type: 'expense',
      amount: 3500,
      currency: 'USD',
      receipt: 'VEH-2024-0710-003',
      status: 'approved',
      approver: 'Operations Manager'
    }
  ];

  const financialStats = {
    totalIncome: transactions.filter(t => t.type === 'income' && t.status === 'approved').reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions.filter(t => t.type === 'expense' && t.status === 'approved').reduce((sum, t) => sum + t.amount, 0),
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    netBalance: transactions.filter(t => t.status === 'approved').reduce((sum, t) => 
      t.type === 'income' ? sum + t.amount : sum - t.amount, 0)
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (transaction.donor && transaction.donor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateBudgetVariance = (budgeted: number, actual: number) => {
    const variance = ((actual - budgeted) / budgeted) * 100;
    return variance;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Oversight & Reporting</h1>
          <p className="text-gray-600">Manage financial reports, fund utilization, budget tracking, and transaction oversight.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(financialStats.totalIncome)}</p>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
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
              <p className="text-3xl font-bold text-red-600">{formatCurrency(financialStats.totalExpenses)}</p>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
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
              <p className={`text-3xl font-bold ${financialStats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(financialStats.netBalance)}
              </p>
              <p className="text-sm font-medium text-gray-600">Net Balance</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
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
              <p className="text-3xl font-bold text-yellow-600">{financialStats.pendingTransactions}</p>
              <p className="text-sm font-medium text-gray-600">Pending</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </motion.div>
      </div>

      {/* Financial Reports Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Financial Reports Overview</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
            <Plus className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {financialReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report - {report.period}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(report.date).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      report.status === 'audited' ? 'bg-green-100 text-green-700' :
                      report.status === 'final' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${report.netResult >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(report.netResult)}
                  </p>
                  <p className="text-sm text-gray-500">Net Result</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{formatCurrency(report.totalIncome)}</p>
                    <p className="text-sm text-gray-600">Total Income</p>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-red-600">{formatCurrency(report.totalExpenditure)}</p>
                    <p className="text-sm text-gray-600">Total Expenditure</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-gray-900">Budget vs Actual:</h4>
                {report.categories.slice(0, 3).map((category, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{formatCurrency(category.actual)}</span>
                      <span className={`text-xs ${category.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ({category.variance >= 0 ? '+' : ''}{formatCurrency(category.variance)})
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions by description, category, or donor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
        <div className="space-y-3">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className={`w-5 h-5 ${getTypeColor(transaction.type)}`} />
                  ) : (
                    <TrendingDown className={`w-5 h-5 ${getTypeColor(transaction.type)}`} />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{transaction.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                    {transaction.project && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {transaction.project}
                      </span>
                    )}
                    {transaction.donor && (
                      <span className="text-blue-600">{transaction.donor}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(transaction.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Receipt className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <PieChart className="w-6 h-6 text-yellow-600" />
            <h3 className="font-bold text-gray-900">Budget Analysis</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Analyze budget performance, variances, and spending patterns.</p>
          <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            View Analysis
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h3 className="font-bold text-gray-900">Financial Dashboard</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">View interactive charts, trends, and financial performance metrics.</p>
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Open Dashboard
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-green-600" />
            <h3 className="font-bold text-gray-900">Expense Management</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Process expense claims, approvals, and reimbursements efficiently.</p>
          <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Manage Expenses
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FinancialModule;