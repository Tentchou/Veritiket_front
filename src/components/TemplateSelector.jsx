import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const templates = [
  { id: 'Standard', name: 'Minimaliste', icon: 'fa-ticket-simple', desc: 'Design épuré et professionnel.' },
  { id: 'VIP', name: 'VIP Premium', icon: 'fa-crown', desc: 'Couleurs dorées et accès prioritaire.' },
  { id: 'Sport', name: 'Stade / Sport', icon: 'fa-futbol', desc: 'Grand format pour les matchs.' },
];

const TemplateSelector = ({ value, onChange }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
      {templates.map((tpl) => {
        const isSelected = value === tpl.id;
        const bgClass = isSelected 
          ? 'border-indigo-500 bg-indigo-500/10' 
          : isDarkMode ? 'border-slate-700 bg-slate-800/40 hover:border-slate-500' : 'border-slate-200 bg-slate-50 hover:border-slate-400';

        return (
          <div 
            key={tpl.id}
            onClick={() => onChange(tpl.id)}
            className={`cursor-pointer border-2 rounded-xxl p-4 transition-all duration-200 ${bgClass}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-500/20 text-slate-500'}`}>
                <i className={`fa-solid ${tpl.icon}`}></i>
              </div>
              <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{tpl.name}</span>
            </div>
            <p className="text-sm text-slate-500">{tpl.desc}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TemplateSelector;