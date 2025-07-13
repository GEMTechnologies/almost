import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const BillingHistory: React.FC = () => {
  const navigate = useNavigate();

  const { data: transactionHistory, isLoading } = useQuery({
    queryKey: ['/api/billing/transactions'],
    queryFn: () => fetch('/api/billing/transactions', {
      headers: { 'X-User-ID': 'demo-user' }
    }).then(res => res.json())
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    return method === 'mobile' ? 
      <Smartphone className="w-4 h-4 text-emerald-400" /> :
      <CreditCard className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/50 p-4">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/billing')}
            className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <h1 className="text-lg font-bold">Transaction History</h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {transactionHistory?.transactions?.map((transaction: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      {getStatusIcon(transaction.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">
                        {transaction.description}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getPaymentMethodIcon(transaction.paymentMethod || 'card')}
                        <span className="text-slate-400 text-xs">
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-bold ${
                      transaction.type === 'purchase' ? 'text-emerald-400' : 'text-orange-400'
                    }`}>
                      {transaction.type === 'purchase' ? '+' : '-'}
                      {Math.abs(transaction.credits)} Credits
                    </div>
                    {transaction.amount && (
                      <div className="text-slate-400 text-xs">
                        ${transaction.amount}
                      </div>
                    )}
                  </div>
                </div>

                {transaction.status === 'completed' && transaction.type === 'purchase' && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50">
                    <button className="flex items-center gap-2 text-emerald-400 text-xs hover:text-emerald-300 transition-colors">
                      <Download className="w-3 h-3" />
                      Download Receipt
                    </button>
                  </div>
                )}
              </motion.div>
            ))}

            {(!transactionHistory?.transactions || transactionHistory.transactions.length === 0) && (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <h3 className="text-xl font-bold text-white mb-2">No Transactions Yet</h3>
                <p className="text-slate-400 mb-6">Your billing history will appear here</p>
                <button
                  onClick={() => navigate('/billing')}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Purchase Credits
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingHistory;