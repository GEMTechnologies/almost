import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FinanceApp = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      // Load transactions and budgets
      const [transactionsRes, budgetsRes] = await Promise.all([
        axios.get('/api/finance/transactions?organization_id=demo'),
        axios.get('/api/finance/budgets/demo')
      ]);
      
      setTransactions(transactionsRes.data.transactions || []);
      setBudgets(budgetsRes.data.budget ? [budgetsRes.data.budget] : []);
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData) => {
    try {
      await axios.post('/api/finance/transactions', transactionData);
      loadFinanceData(); // Refresh data
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading finance data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Finance Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions found</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((transaction, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="flex justify-between">
                    <span>{transaction.description}</span>
                    <span className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{transaction.type}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Budget Overview</h2>
          {budgets.length === 0 ? (
            <p className="text-gray-500">No budgets found</p>
          ) : (
            <div className="space-y-4">
              {budgets.map((budget, index) => (
                <div key={index} className="border rounded p-4">
                  <div className="flex justify-between mb-2">
                    <span>Total Budget</span>
                    <span className="font-medium">${budget.total_amount}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Allocated</span>
                    <span>${budget.allocated_amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spent</span>
                    <span className="text-red-600">${budget.spent_amount}</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(budget.spent_amount / budget.total_amount) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          createTransaction({
            amount: parseFloat(formData.get('amount')),
            type: formData.get('type'),
            description: formData.get('description'),
            currency: 'USD'
          });
          e.target.reset();
        }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="description"
              type="text"
              placeholder="Description"
              className="border rounded px-3 py-2"
              required
            />
            <input
              name="amount"
              type="number"
              step="0.01"
              placeholder="Amount"
              className="border rounded px-3 py-2"
              required
            />
            <select name="type" className="border rounded px-3 py-2" required>
              <option value="">Select Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <button 
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinanceApp;