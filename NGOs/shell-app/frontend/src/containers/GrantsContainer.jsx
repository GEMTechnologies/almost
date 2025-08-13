import React, { useEffect, useRef } from 'react';

const GrantsContainer = () => {
  const ref = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const mount = async () => {
      if (mountedRef.current) return;

      try {
        if (ref.current) {
          ref.current.innerHTML = `
            <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
              <h1 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 24px; color: #1f2937;">Grants Management</h1>
              
              <div style="margin-bottom: 24px;">
                <div style="display: flex; gap: 16px;">
                  <input type="text" placeholder="Search grants..." style="flex: 1; border: 1px solid #d1d5db; border-radius: 4px; padding: 8px 12px;" />
                  <button style="background: #3b82f6; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">Search</button>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 24px;">
                <div>
                  <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; color: #374151;">Available Grants</h2>
                  <div style="space-y: 16px;">
                    <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-bottom: 16px;">
                      <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Education Excellence Grant</h3>
                      <p style="color: #6b7280; margin-bottom: 8px;">Global Education Foundation</p>
                      <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 16px;">Supporting innovative education programs in underserved communities</p>
                      
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <span style="font-size: 1.125rem; font-weight: bold; color: #059669;">$75,000</span>
                        <span style="font-size: 0.875rem; color: #6b7280;">Due: June 30, 2024</span>
                      </div>

                      <div style="margin-bottom: 16px;">
                        <h4 style="font-weight: 500; margin-bottom: 8px;">Requirements:</h4>
                        <ul style="color: #6b7280; font-size: 0.875rem; list-style: disc; margin-left: 20px;">
                          <li>Nonprofit status</li>
                          <li>Education focus</li>
                          <li>Community impact plan</li>
                        </ul>
                      </div>

                      <button style="width: 100%; background: #3b82f6; color: white; border: none; border-radius: 4px; padding: 8px; cursor: pointer;">Apply Now</button>
                    </div>

                    <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                      <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Environmental Conservation Fund</h3>
                      <p style="color: #6b7280; margin-bottom: 8px;">Green Earth Initiative</p>
                      <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 16px;">Conservation projects for environmental protection</p>
                      
                      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <span style="font-size: 1.125rem; font-weight: bold; color: #059669;">$100,000</span>
                        <span style="font-size: 0.875rem; color: #6b7280;">Due: August 15, 2024</span>
                      </div>

                      <div style="margin-bottom: 16px;">
                        <h4 style="font-weight: 500; margin-bottom: 8px;">Requirements:</h4>
                        <ul style="color: #6b7280; font-size: 0.875rem; list-style: disc; margin-left: 20px;">
                          <li>Environmental focus</li>
                          <li>Measurable outcomes</li>
                          <li>Local partnerships</li>
                        </ul>
                      </div>

                      <button style="width: 100%; background: #3b82f6; color: white; border: none; border-radius: 4px; padding: 8px; cursor: pointer;">Apply Now</button>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; color: #374151;">My Applications</h2>
                  <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Application #001</h3>
                    <p style="color: #6b7280; margin-bottom: 8px;">Grant: Education Excellence Grant</p>
                    <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 8px;">Submitted: March 15, 2024</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem;">submitted</span>
                      <button style="color: #3b82f6; background: none; border: none; cursor: pointer; text-decoration: underline;">View Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
          mountedRef.current = true;
        }
      } catch (error) {
        console.error('Failed to load Grants service:', error);
        if (ref.current) {
          ref.current.innerHTML = `
            <div style="padding: 24px; text-align: center;">
              <h2 style="color: #dc2626; margin-bottom: 16px;">Grants Service Unavailable</h2>
              <p style="color: #6b7280;">The grants service is currently unavailable. Please try again later.</p>
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

export default GrantsContainer;