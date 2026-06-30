import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SearchableSelect = ({ options, value, onChange, placeholder }) => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );
  
  // N'oublions pas de proposer "Autre" même si on tape un truc bizarre
  if (search && !filteredOptions.includes("Autre")) {
     filteredOptions.push("Autre");
  }

  // Styles cohérents avec les nouveaux inputs de GenerateTickets
  const btnClass = `w-full px-4 py-3.5 border font-medium cursor-pointer flex justify-between items-center transition-all duration-300
    ${isOpen ? 'border-indigo-500 ring-4 ring-indigo-500/20' : 'hover:border-indigo-400'}
    ${isDarkMode ? 'bg-[#0B1120] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`;

  const listBg = isDarkMode ? 'bg-[#111827] border-slate-700' : 'bg-white border-slate-200';
  const searchInputBg = isDarkMode ? 'bg-[#0B1120] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';

  return (
    <div className="relative w-full" ref={dropdownRef}>
      
      {/* Bouton Principal */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={btnClass}
      >
        <span className={value ? '' : 'text-slate-500'}>{value || placeholder}</span>
        <i className={`fa-solid fa-chevron-down text-xs text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}></i>
      </div>

      {/* Menu Déroulant (Flottant) */}
      {isOpen && (
        <div className={`absolute left-0 mt-2 w-full border shadow-2xl p-2 z-50 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200 ${listBg}`}>
          
          <div className="relative mb-2">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              autoFocus // Focus automatique pour taper tout de suite
              placeholder="Rechercher..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-8 pr-3 py-2.5 border text-sm outline-none transition-colors focus:border-indigo-500 ${searchInputBg}`}
            />
          </div>

          <div className="space-y-1">
            {filteredOptions.length > 0 ? filteredOptions.map(opt => (
              <div 
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); setSearch(''); }}
                className={`px-3 py-2.5 text-sm font-bold cursor-pointer transition-colors 
                  ${opt === value 
                    ? 'bg-indigo-500 text-white' 
                    : isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
              >
                {opt}
              </div>
            )) : (
              <div className="px-3 py-4 text-center text-sm text-slate-500 font-medium">
                Aucun résultat. Sélectionnez "Autre".
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;