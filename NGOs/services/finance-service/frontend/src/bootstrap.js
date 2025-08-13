import React from 'react';
import ReactDOM from 'react-dom/client';
import FinanceApp from './App';

// Bootstrap the finance service frontend
const mount = (element) => {
  const root = ReactDOM.createRoot(element);
  root.render(<FinanceApp />);
  return root;
};

// Export for micro-frontend architecture
if (typeof window !== 'undefined') {
  window.FinanceService = { mount };
}

export { mount };