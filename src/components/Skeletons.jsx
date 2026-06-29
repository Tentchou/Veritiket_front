import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const StatCardSkeleton = () => {
  const { isDarkMode } = useTheme();
  
  // Couleurs dynamiques pour le skeleton
  const cardBg = isDarkMode ? 'bg-navy-slate border-slate-800' : 'bg-white border-slate-200';
  const pulseBlock = isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200';

  return (
    <div className={`rounded-3xl p-6 border shadow-sm animate-pulse ${cardBg}`}>
      <div className="flex justify-between items-start mb-4">
        {/* Fausse icône */}
        <div className={`w-12 h-12 rounded-xl ${pulseBlock}`}></div>
        {/* Faux badge de tendance */}
        <div className={`w-20 h-6 rounded-full ${pulseBlock}`}></div>
      </div>
      {/* Faux Titre */}
      <div className={`w-32 h-4 rounded mt-6 ${pulseBlock}`}></div>
      {/* Fausse Valeur géante */}
      <div className={`w-24 h-10 rounded mt-3 ${pulseBlock}`}></div>
    </div>
  );
};

export const EventRowSkeleton = () => {
  const { isDarkMode } = useTheme();
  
  const borderClass = isDarkMode ? 'border-slate-800/60' : 'border-slate-100';
  const pulseBlock = isDarkMode ? 'bg-slate-700/50' : 'bg-slate-200';

  return (
    <tr className={`border-b ${borderClass} animate-pulse`}>
      <td className="py-5 px-6"><div className={`h-5 w-48 rounded ${pulseBlock}`}></div></td>
      <td className="py-5 px-6"><div className={`h-4 w-32 rounded ${pulseBlock}`}></div></td>
      <td className="py-5 px-6"><div className={`h-4 w-24 rounded ${pulseBlock}`}></div></td>
      <td className="py-5 px-6"><div className={`h-6 w-24 rounded-full ${pulseBlock}`}></div></td>
      <td className="py-5 px-6 flex justify-end"><div className={`h-9 w-24 rounded-xl ${pulseBlock}`}></div></td>
    </tr>
  );
};