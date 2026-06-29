import React from 'react';
import { useTheme } from '../contexts/ThemeContext'; // <-- La carte écoute le thème !

const StatCard = ({ title, value, icon, gradient, trend, trendLabel, suffix }) => {
  const { isDarkMode } = useTheme();

  // STYLES DYNAMIQUES (Sombre vs Clair)
  const defaultBg = isDarkMode 
    ? 'bg-navy-slate border-slate-700/50 text-white shadow-xl' 
    : 'bg-white border-slate-200 text-slate-800 shadow-lg shadow-slate-200/50';
    
  const iconBg = isDarkMode 
    ? 'bg-slate-800/80 border-slate-700 text-indigo-400' 
    : 'bg-indigo-50 border-indigo-100 text-indigo-600';
    
  const textColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const valueColor = isDarkMode ? 'text-white' : 'text-slate-900';
  
  const bgIconColor = isDarkMode ? 'text-slate-800 opacity-20' : 'text-slate-100 opacity-60';

  return (
    <div className={`rounded-3xl p-6 relative overflow-hidden group border transition-colors duration-300 ${gradient ? gradient + ' shadow-xl' : defaultBg}`}>
      
      {/* Icône d'arrière-plan géante et transparente */}
      <div className={`absolute -right-10 -top-10 transition-transform duration-500 group-hover:scale-110 ${gradient ? 'text-white/10' : bgIconColor}`}>
        <i className={`${icon} text-9xl`}></i>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          
          {/* Le petit carré de l'icône en haut à gauche */}
          <div className={`p-3 rounded-xl border transition-colors duration-300 ${gradient ? 'bg-white/20 border-white/10 text-white' : iconBg}`}>
            <i className={`${icon} text-xl`}></i>
          </div>
          
          {/* Badge de tendance optionnel (ex: +12%) */}
          {trend && (
             <span className={`px-3 py-1 rounded-full text-sm font-bold border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' 
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
             }`}>
               <i className="fa-solid fa-arrow-trend-up mr-1"></i> {trend}
             </span>
          )}
        </div>
        
        {/* Titre (ex: Billets Scannés) */}
        <p className={`font-medium mb-1 transition-colors duration-300 ${gradient ? 'text-indigo-100' : textColor}`}>
          {title}
        </p>
        
        {/* Valeur Principale (ex: 3,105) */}
        <div className="flex items-baseline gap-2">
          <h3 className={`text-4xl font-bold tracking-tight transition-colors duration-300 ${gradient ? 'text-white' : valueColor}`}>
            {value}
          </h3>
          {suffix && <span className={`text-lg font-medium transition-colors duration-300 ${gradient ? 'text-indigo-200' : textColor}`}>{suffix}</span>}
        </div>
        
        {/* Sous-titre optionnel */}
        {trendLabel && <p className={`mt-2 text-sm transition-colors duration-300 ${gradient ? 'text-indigo-200' : textColor}`}>{trendLabel}</p>}
      </div>
    </div>
  );
};

export default StatCard;