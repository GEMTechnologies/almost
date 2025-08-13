import React from 'react';

const Header = ({ user, onLogout, onMenuToggle }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ml-2">Granada NGO Management</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <img
                className="w-8 h-8 rounded-full bg-gray-300"
                src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                alt={user?.name || 'User'}
              />
              <span className="ml-2 text-gray-700">{user?.name || 'User'}</span>
            </button>
          </div>
          
          <button
            onClick={onLogout}
            className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;