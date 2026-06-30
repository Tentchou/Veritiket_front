import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const ticketTemplates = [
  { id: 'minimal', name: 'Minimaliste', preview: 'bg-white border-2 border-slate-200 text-slate-800' },
  { id: 'vip_gold', name: 'VIP Gold', preview: 'bg-slate-900 border-2 border-amber-500 text-amber-100' },
  { id: 'festival_neon', name: 'Festival Néon', preview: 'bg-indigo-950 border-2 border-fuchsia-500 text-fuchsia-100' }
];

const TicketTemplateSelector = ({ selected, onSelect }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-3">
      {ticketTemplates.map(tpl => (
        <div
          key={tpl.id}
          onClick={() => onSelect(tpl.id)}
          className={`cursor-pointer p-1 transition-all duration-200 ${selected === tpl.id ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-navy-deep' : 'opacity-80 hover:opacity-100'}`}
        >
          <div className={`w-full h-14 sm:h-16 rounded-lg flex items-center justify-between px-3 ${tpl.preview}`}>
            <span className="font-bold text-[10px] uppercase tracking-widest">{tpl.name}</span>
            <i className="fa-solid fa-qrcode text-lg opacity-50"></i>
          </div>
          <p className={`mt-3 text-center text-[11px] font-semibold truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{tpl.name}</p>
        </div>
      ))}
    </div>
  );
};

export default TicketTemplateSelector;