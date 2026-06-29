import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const inputBg = isDarkMode ? 'bg-navy-deep border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900';
  const listBg = isDarkMode ? 'bg-navy-slate border-slate-800' : 'bg-white border-slate-200';

  return (
    <div className="relative w-full">
      {/* Bouton Principal */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl border font-medium cursor-pointer flex justify-between items-center transition-colors ${inputBg}`}
      >
        <span className={value ? '' : 'text-slate-500'}>{value || placeholder}</span>
        <i className={`fa-solid fa-chevron-down text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </div>

      {/* Menu Déroulant */}
      {isOpen && (
        <div className={`absolute left-0 mt-2 w-full rounded-2xl border shadow-2xl p-2 z-50 max-h-60 overflow-y-auto ${listBg}`}>
          <input 
            type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl border text-sm outline-none mb-2 ${inputBg}`}
          />
          <div className="space-y-1">
            {filteredOptions.map(opt => (
              <div 
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); setSearch(''); }}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors ${opt === value ? 'bg-indigo-accent text-white' : isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;