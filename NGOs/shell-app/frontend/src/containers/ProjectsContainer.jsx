import React, { useEffect, useRef } from 'react';

const ProjectsContainer = () => {
  const ref = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const mount = async () => {
      if (mountedRef.current) return;

      try {
        if (ref.current) {
          ref.current.innerHTML = `
            <div style="padding: 24px; max-width: 1200px; margin: 0 auto;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                <h1 style="font-size: 1.875rem; font-weight: bold; color: #1f2937;">Projects Management</h1>
                <button style="background: #059669; color: white; border: none; border-radius: 4px; padding: 8px 16px; cursor: pointer;">Create Project</button>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 24px;">
                <div>
                  <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; color: #374151;">Projects Overview</h2>
                  <div style="space-y: 16px;">
                    <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin-bottom: 16px; cursor: pointer;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1f2937;">Community Education Program</h3>
                        <span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem;">active</span>
                      </div>
                      <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 16px;">Literacy program for rural communities</p>
                      
                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; font-size: 0.875rem; margin-bottom: 16px;">
                        <div>
                          <span style="color: #6b7280;">Budget:</span>
                          <span style="font-weight: 500; margin-left: 8px;">$25,000</span>
                        </div>
                        <div>
                          <span style="color: #6b7280;">Spent:</span>
                          <span style="font-weight: 500; margin-left: 8px;">$8,500</span>
                        </div>
                        <div>
                          <span style="color: #6b7280;">Start:</span>
                          <span style="margin-left: 8px;">Jan 1, 2024</span>
                        </div>
                        <div>
                          <span style="color: #6b7280;">Team:</span>
                          <span style="margin-left: 8px;">3 members</span>
                        </div>
                      </div>

                      <div style="margin-bottom: 8px;">
                        <div style="width: 100%; background: #e5e7eb; border-radius: 4px; height: 8px;">
                          <div style="background: #3b82f6; height: 8px; border-radius: 4px; width: 34%;"></div>
                        </div>
                        <div style="font-size: 0.75rem; color: #6b7280; margin-top: 4px;">34% of budget used</div>
                      </div>
                    </div>

                    <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); cursor: pointer;">
                      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <h3 style="font-size: 1.125rem; font-weight: 600; color: #1f2937;">Clean Water Initiative</h3>
                        <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem;">planning</span>
                      </div>
                      <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 16px;">Water well construction in remote areas</p>
                      
                      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; font-size: 0.875rem; margin-bottom: 16px;">
                        <div>
                          <span style="color: #6b7280;">Budget:</span>
                          <span style="font-weight: 500; margin-left: 8px;">$40,000</span>
                        </div>
                        <div>
                          <span style="color: #6b7280;">Spent:</span>
                          <span style="font-weight: 500; margin-left: 8px;">$2,000</span>
                        </div>
                        <div>
                          <span style="color: #6b7280;">Start:</span>
                          <span style="margin-left: 8px;">Mar 1, 2024</span>
                        </div>
                        <div>
                          <span style="color: #6b7280;">Team:</span>
                          <span style="margin-left: 8px;">2 members</span>
                        </div>
                      </div>

                      <div style="margin-bottom: 8px;">
                        <div style="width: 100%; background: #e5e7eb; border-radius: 4px; height: 8px;">
                          <div style="background: #3b82f6; height: 8px; border-radius: 4px; width: 5%;"></div>
                        </div>
                        <div style="font-size: 0.75rem; color: #6b7280; margin-top: 4px;">5% of budget used</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px; color: #374151;">Project Details</h2>
                  <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px; color: #1f2937;">Community Education Program</h3>
                    <p style="color: #6b7280; margin-bottom: 16px;">Literacy program for rural communities</p>
                    
                    <div style="margin-bottom: 16px;">
                      <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 8px;">Status:</label>
                      <select style="border: 1px solid #d1d5db; border-radius: 4px; padding: 8px 12px;">
                        <option value="planning">Planning</option>
                        <option value="active" selected>Active</option>
                        <option value="on_hold">On Hold</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div style="margin-bottom: 16px;">
                      <h4 style="font-weight: 500; margin-bottom: 8px;">Team Members:</h4>
                      <div style="display: flex; flex-wrap: gap: 8px;">
                        <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem;">John Doe</span>
                        <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem;">Jane Smith</span>
                        <span style="background: #dbeafe; color: #1d4ed8; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem;">Mike Wilson</span>
                      </div>
                    </div>

                    <div>
                      <h4 style="font-weight: 500; margin-bottom: 8px;">Milestones:</h4>
                      <div style="space-y: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px;">
                          <div>
                            <div style="font-weight: 500;">Curriculum Development</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">Due: Feb 15, 2024</div>
                          </div>
                          <select style="border: 1px solid #d1d5db; border-radius: 4px; padding: 4px 8px; font-size: 0.875rem;">
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed" selected>Completed</option>
                          </select>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px; margin-bottom: 8px;">
                          <div>
                            <div style="font-weight: 500;">Teacher Training</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">Due: Apr 30, 2024</div>
                          </div>
                          <select style="border: 1px solid #d1d5db; border-radius: 4px; padding: 4px 8px; font-size: 0.875rem;">
                            <option value="pending">Pending</option>
                            <option value="in_progress" selected>In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border: 1px solid #e5e7eb; border-radius: 4px;">
                          <div>
                            <div style="font-weight: 500;">Program Launch</div>
                            <div style="font-size: 0.875rem; color: #6b7280;">Due: Jun 1, 2024</div>
                          </div>
                          <select style="border: 1px solid #d1d5db; border-radius: 4px; padding: 4px 8px; font-size: 0.875rem;">
                            <option value="pending" selected>Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
          mountedRef.current = true;
        }
      } catch (error) {
        console.error('Failed to load Projects service:', error);
        if (ref.current) {
          ref.current.innerHTML = `
            <div style="padding: 24px; text-align: center;">
              <h2 style="color: #dc2626; margin-bottom: 16px;">Projects Service Unavailable</h2>
              <p style="color: #6b7280;">The projects service is currently unavailable. Please try again later.</p>
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

export default ProjectsContainer;