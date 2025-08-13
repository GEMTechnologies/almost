import React, { useEffect, useRef } from 'react';

const FinanceContainer = () => {
  const ref = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const mount = async () => {
      if (mountedRef.current) return;

      try {
        // In production, this would load the remote module
        // For now, we'll create a placeholder that matches the service UI
        if (ref.current) {
          ref.current.innerHTML = `
            <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
              <h1 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 24px; color: #1f2937;">Finance Management</h1>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 32px;">
                <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; color: #374151;">Recent Transactions</h2>
                  <div style="color: #6b7280;">
                    <p style="margin-bottom: 8px;">• Grant funding received - $25,000</p>
                    <p style="margin-bottom: 8px;">• Office supplies - $450</p>
                    <p style="margin-bottom: 8px;">• Program materials - $1,200</p>
                    <p>• Volunteer training - $800</p>
                  </div>
                </div>

                <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; color: #374151;">Budget Overview</h2>
                  <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="color: #6b7280;">Total Budget</span>
                      <span style="font-weight: 600;">$75,000</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <span style="color: #6b7280;">Spent</span>
                      <span style="color: #dc2626;">$28,450</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                      <span style="color: #6b7280;">Remaining</span>
                      <span style="color: #059669;">$46,550</span>
                    </div>
                  </div>
                  <div style="width: 100%; background: #e5e7eb; border-radius: 4px; height: 8px;">
                    <div style="background: #3b82f6; height: 8px; border-radius: 4px; width: 38%;"></div>
                  </div>
                </div>
              </div>

              <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; color: #374151;">Add New Transaction</h2>
                <form style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                  <input type="text" placeholder="Description" style="border: 1px solid #d1d5db; border-radius: 4px; padding: 8px 12px;" />
                  <input type="number" placeholder="Amount" style="border: 1px solid #d1d5db; border-radius: 4px; padding: 8px 12px;" />
                  <select style="border: 1px solid #d1d5db; border-radius: 4px; padding: 8px 12px;">
                    <option value="">Select Type</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <button type="submit" style="background: #3b82f6; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">Add Transaction</button>
                </form>
              </div>
            </div>
          `;
          mountedRef.current = true;
        }
      } catch (error) {
        console.error('Failed to load Finance service:', error);
        if (ref.current) {
          ref.current.innerHTML = `
            <div style="padding: 24px; text-align: center;">
              <h2 style="color: #dc2626; margin-bottom: 16px;">Finance Service Unavailable</h2>
              <p style="color: #6b7280;">The finance service is currently unavailable. Please try again later.</p>
            </div>
          `;
        }
      }
    };

    mount();

    return () => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
      mountedRef.current = false;
    };
  }, []);

  return <div ref={ref} style={{ minHeight: '400px' }} />;
};

export default FinanceContainer;