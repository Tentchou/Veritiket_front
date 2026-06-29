import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const ticketTemplates = [
  { 
    id: 'minimal', 
    name: 'Minimaliste', 
    desc: 'Épuré, fond blanc, parfait pour les imprimantes de bureau.',
    preview: 'bg-white border-2 border-slate-200 text-slate-800'
  },
  { 
    id: 'vip_gold', 
    name: 'VIP Gold', 
    desc: 'Bords dorés et fond sombre pour les accès premium.',
    preview: 'bg-slate-900 border-2 border-amber-500 text-amber-100'
  },
  { 
    id: 'festival_neon', 
    name: 'Festival Néon', 
    desc: 'Couleurs vibrantes, idéal pour les concerts de nuit.',
    preview: 'bg-indigo-950 border-2 border-fuchsia-500 text-fuchsia-100'
  }
];

const TicketTemplateSelector = ({ selected, onSelect }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {ticketTemplates.map(tpl => (
        <div 
          key={tpl.id}
          onClick={() => onSelect(tpl.id)}
          className={`cursor-pointer rounded-2xl p-1 transition-all duration-200 ${selected === tpl.id ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-navy-deep scale-[1.02]' : 'opacity-80 hover:opacity-100'}`}
        >
          {/* Fausse miniature visuelle du billet (Preview Canva-style) */}
          <div className={`w-full h-32 rounded-xl flex flex-col justify-between p-4 ${tpl.preview}`}>
             <div className="flex justify-between items-start">
               <div className="font-bold text-xs uppercase tracking-widest">{tpl.name}</div>
               <i className="fa-solid fa-qrcode text-2xl opacity-50"></i>
             </div>
             <div className="text-xl font-bold opacity-80">VERITICKET</div>
          </div>
          
          <div className="mt-3 text-center">
            <h4 className={`font-bold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{tpl.name}</h4>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{tpl.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketTemplateSelector;