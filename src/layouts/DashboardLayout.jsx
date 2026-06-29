import React, { useState, useEffect } from 'react';
import { useAuth, UserButton } from "@clerk/clerk-react";
import { Link, useLocation } from 'react-router-dom';
import { setupAxiosInterceptors } from '../api/axiosSetup';
import { useTheme } from '../contexts/ThemeContext';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const { getToken } = useAuth();
  // On configure Axios une seule fois quand le Layout se charge
  useEffect(() => {
    setupAxiosInterceptors(getToken);
  }, [getToken]);
  
  //On récupère l'état global au lieu d'un état local !
  const { isDarkMode, setIsDarkMode } = useTheme(); 
  
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => {
      // Sur mobile et tablette (moins de 1024px), on ferme automatiquement
      if (window.innerWidth < 1024) setIsCollapsed(true);
      else setIsCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Vue d\'ensemble', path: '/dashboard', icon: 'fa-solid fa-chart-pie' },
    { name: 'Mes Événements', path: '/dashboard/events', icon: 'fa-solid fa-calendar-days' },
    // { name: 'Scanners (Vigiles)', path: '/dashboard/scanners', icon: 'fa-solid fa-user-shield' },
    // { name: 'Paramètres', path: '/dashboard/settings', icon: 'fa-solid fa-gear' },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'bg-navy-deep text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* SIDEBAR : On utilise flex-shrink-0 pour qu'elle dicte sa taille */}
      <aside 
        className={`absolute lg:relative flex-shrink-0 flex flex-col h-full border-r transition-[width,transform] duration-300 ease-in-out z-30
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-24' : 'translate-x-0 w-72'} 
        ${isDarkMode ? 'bg-navy-slate border-slate-800/60 shadow-xl shadow-black/20' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}
      >
        <div className="h-20 flex-shrink-0 flex items-center justify-center border-b border-transparent">
          <Link to="/" className="text-2xl font-bold tracking-tighter no-underline flex items-center justify-center w-full">
            {!isCollapsed ? (
              <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>
                Veri<span className="text-indigo-accent">Ticket</span>
              </span>
            ) : (
              <div className="w-10 h-10 bg-indigo-accent/10 rounded-xl flex items-center justify-center border border-indigo-accent/30 mx-auto transition-all duration-300">
                <span className="text-indigo-accent text-xl font-black">VT</span>
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
                className={`group flex items-center py-3.5 rounded-2xl font-medium transition-all duration-300 no-underline whitespace-nowrap
                  ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4 gap-4'}
                  ${isActive 
                    ? 'bg-indigo-accent text-white shadow-lg shadow-indigo-500/25 scale-[1.02]' 
                    : `${isDarkMode ? 'text-slate-400 hover:bg-slate-800/80 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`
                  }`}
              >
                <i className={`${item.icon} text-xl w-6 text-center transition-transform duration-300 group-hover:scale-110 flex-shrink-0
                  ${isActive ? 'text-white' : 'text-indigo-400/70 group-hover:text-indigo-400'}`}>
                </i>
                
                <span className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 hidden w-0' : 'opacity-100 block'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className={`p-4 flex-shrink-0 border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-800/60' : 'border-slate-200'}`}>
           <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
              {!isCollapsed && <span className="text-sm font-semibold tracking-wide text-slate-500 uppercase truncate transition-all duration-300">Mon Compte</span>}
              <div className="flex-shrink-0 transform hover:scale-105 transition-transform">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }} />
              </div>
           </div>
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden transition-opacity"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}

      {/* ZONE CENTRALE : flex-1 min-w-0 permet à la zone d'agir comme un élastique fluide */}
      <main className="flex-1 min-w-0 flex flex-col h-full relative transition-all duration-300 ease-in-out">
        
        <header className={`h-20 flex-shrink-0 flex items-center justify-between px-4 md:px-8 border-b transition-colors duration-300 z-10
          ${isDarkMode ? 'border-slate-800/60 bg-navy-deep/80' : 'border-slate-200 bg-slate-50/80'} backdrop-blur-md`}
        >
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors
              ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'}`}
          >
            <i className={`fa-solid ${isCollapsed ? 'fa-bars lg:fa-indent' : 'fa-xmark lg:fa-outdent'} text-xl transition-transform duration-300`}></i>
          </button>

          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 border
              ${isDarkMode 
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-amber-300 shadow-[0_0_15px_rgba(252,211,77,0.1)]' 
                : 'bg-white border-slate-200 hover:bg-slate-100 text-indigo-500 shadow-sm'}`}
          >
            <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
          </button>
        </header>

        {/* LE SECRET EST ICI : Plus de max-w-7xl, le wrapper (w-full) prend toujours 100% de la place dispo ! */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth w-full">
          <div className="w-full h-full transition-all duration-300 ease-in-out">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;