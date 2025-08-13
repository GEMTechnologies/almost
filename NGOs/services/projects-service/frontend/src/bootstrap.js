import React from 'react';
import ReactDOM from 'react-dom/client';
import ProjectsApp from './App';

// Bootstrap the projects service frontend
const mount = (element) => {
  const root = ReactDOM.createRoot(element);
  root.render(<ProjectsApp />);
  return root;
};

// Export for micro-frontend architecture
if (typeof window !== 'undefined') {
  window.ProjectsService = { mount };
}

export { mount };