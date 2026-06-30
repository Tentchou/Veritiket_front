import React, { useState, useEffect } from 'react';
import { useAuth, UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from 'react-router-dom';
import { setupAxiosInterceptors } from '../api/axiosSetup';
import { useTheme } from '../contexts/ThemeContext';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const { getToken } = useAuth();
  
  useEffect(() => {
    setupAxiosInterceptors(getToken);
  }, [getToken]);
  
  const { isDarkMode, setIsDarkMode } = useTheme(); 
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
      else setIsCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Vue d\'ensemble', path: '/dashboard', icon: 'fa-solid fa-chart-pie' },
    { name: 'Mes Événements', path: '/dashboard/events', icon: 'fa-solid fa-calendar-days' },
  ];

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0B1120] text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* SIDEBAR */}
      <aside 
        className={`absolute lg:relative flex-shrink-0 flex flex-col h-full border-r transition-[width,transform] duration-300 ease-in-out z-40
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-20' : 'translate-x-0 w-72'} 
        ${isDarkMode ? 'bg-[#111827] border-slate-800 shadow-2xl shadow-black/50' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}
      >
        <div className="h-20 flex-shrink-0 flex items-center justify-center border-b border-transparent">
          <Link to="/" className="text-2xl font-bold tracking-tighter no-underline flex items-center justify-center w-full px-4">
            {!isCollapsed ? (
              <span className={`transition-opacity duration-300 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Veri<span className="text-indigo-accent">Ticket</span>
              </span>
            ) : (
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 mx-auto hover:bg-indigo-500/20 transition-all duration-300 shrink-0">
                <span className="text-indigo-500 text-lg font-black">VT</span>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-3 mt-6 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : ""}
                className={`group flex items-center py-3.5 font-medium transition-all duration-300 no-underline whitespace-nowrap
                  ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4 gap-4'}
                  ${isActive 
                    ? 'bg-indigo-accent text-white shadow-lg shadow-indigo-500/25 scale-[1.02]' 
                    : `${isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`
                  }`}
              >
                <i className={`${item.icon} text-lg w-6 text-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0
                  ${isActive ? 'text-white' : 'text-indigo-accent group-hover:text-indigo-500'}`}>
                </i>
                <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto block'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 flex-shrink-0 border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
           <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
              {!isCollapsed && <span className="text-xs font-bold tracking-wider text-slate-500 uppercase truncate">Mon Profil</span>}
              <div className="flex-shrink-0 hover:scale-105 transition-transform">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }} />
              </div>
           </div>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}

      {/* ZONE CENTRALE */}
      <main className="flex-1 min-w-0 flex flex-col h-full relative">
        <header className={`h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-8 border-b transition-colors duration-300 z-10
          ${isDarkMode ? 'border-slate-800 bg-[#0B1120]/80' : 'border-slate-200 bg-slate-50/80'} backdrop-blur-md`}
        >
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
              ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}
          >
            <i className={`fa-solid ${isCollapsed ? 'fa-bars lg:fa-indent' : 'fa-xmark lg:fa-outdent'} text-lg`}></i>
          </button>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border hover:scale-105
              ${isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-amber-300 shadow-[0_0_15px_rgba(252,211,77,0.1)]' 
                : 'bg-white border-slate-200 text-indigo-500 shadow-sm'}`}
          >
            <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 w-full scroll-smooth">
          <div className="w-full h-full max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;