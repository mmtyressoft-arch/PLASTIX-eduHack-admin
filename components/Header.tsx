
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b sticky top-0 z-10">
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-3 border rounded-lg bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
            placeholder="Search for anything..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-1 rounded-full text-slate-400 hover:text-slate-500 hover:bg-slate-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>
        <div className="h-6 w-px bg-slate-200 mx-2"></div>
        <button className="flex items-center space-x-2 p-1 px-2 rounded-lg hover:bg-slate-100">
          <span className="text-sm font-medium text-slate-700">English</span>
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
