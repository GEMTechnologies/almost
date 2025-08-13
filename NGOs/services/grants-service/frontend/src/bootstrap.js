import React from 'react';
import ReactDOM from 'react-dom/client';
import GrantsApp from './App';

// Bootstrap the grants service frontend
const mount = (element) => {
  const root = ReactDOM.createRoot(element);
  root.render(<GrantsApp />);
  return root;
};

// Export for micro-frontend architecture
if (typeof window !== 'undefined') {
  window.GrantsService = { mount };
}

export { mount };