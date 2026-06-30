import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import EventRow from '../components/EventRow';
import { EventService } from '../api/services/EventService';
import { useTheme } from '../contexts/ThemeContext';
import { EventRowSkeleton } from '../components/Skeletons';
import CreateEventModal from '../components/CreateEventModal'; // L'IMPORT DE LA MODALE

const EventsList = () => {
  const { isDarkMode } = useTheme();
  
  const [data, setData] = useState({ items: [], totalPages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Nouvel état pour gérer l'ouverture de la modale de création
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Mémorisation de la fonction de chargement pour pouvoir l'appeler facilement après une création
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const result = await EventService.getEvents(search, page, 5);
      setData(result);
    } catch (error) {
      console.error("Erreur chargement", error);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { loadEvents(); }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [loadEvents]);

  // Fonction appelée quand un événement est créé avec succès
  const handleCreationSuccess = () => {
    setIsCreateModalOpen(false); // On ferme la modale
    setPage(1); // On revient à la première page
    loadEvents(); // On rafraîchit la liste
  };

  const tableBg = isDarkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200';
  const thClass = isDarkMode ? 'bg-slate-800/50 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-100';
  const inputClass = isDarkMode ? 'bg-[#0B1120] border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-400';

  return (
    <DashboardLayout>
      
      {/* HEADER ADAPTATIF */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between w-full lg:w-auto gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">Mes Événements</h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base">Gérez et suivez vos billetteries actives.</p>
          </div>
          
          {/* Le bouton déclenche maintenant l'ouverture de la Modale */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-accent border border-indigo-accent text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-indigo-500 hover:-translate-y-1 hover:scale-105 shadow-[0_0_20px_rgba(129,140,248,0.3)] hover:shadow-[0_0_40px_rgba(129,140,248,0.6)]"
          >
            <i className="fa-solid fa-plus"></i> Créer
          </button>
        </div>
        
        {/* Barre de recherche avec beaux effets de focus */}
        <div className="relative w-full lg:w-80 shrink-0">
          {loading ? (
             <i className="fa-solid fa-circle-notch fa-spin absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"></i>
          ) : (
             <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          )}
          <input 
            type="text" placeholder="Rechercher un événement..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className={`w-full pl-11 pr-4 py-3 rounded-xxl border outline-indigo-accent text-sm font-medium transition-all duration-300 shadow-sm focus:ring-2 focus:ring-indigo-500 ${inputClass}`}
          />
        </div>
      </div>

      {/* TABLEAU RESPONSIVE */}
      <div className={`border border-indigo-accent shadow-xl transition-all duration-300 ${tableBg}`}>
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left min-w-[700px]">
            <thead className="sticky top-0 z-10 backdrop-blur-md">
              <tr className={`border-b text-xs font-bold uppercase tracking-wider ${thClass}`}>
                <th className="py-4 px-6">Événement</th>
                <th className="py-4 px-6">Lieu</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Catégorie</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && data.items.length === 0 ? (
                Array.from({ length: 5 }).map((_, index) => <EventRowSkeleton key={index} />)
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <i className="fa-regular fa-folder-open text-4xl opacity-50"></i>
                      <p>Aucun événement trouvé.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.items.map(event => <EventRow key={event.id} event={event} isDarkMode={isDarkMode} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {data.totalPages > 1 && (
        <div className="flex justify-center sm:justify-end items-center gap-4 mt-8">
          <button 
            disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center disabled:opacity-30 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all shadow-sm"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className="text-sm font-semibold text-slate-500 px-2">Page {page} sur {data.totalPages}</span>
          <button 
            disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}
            className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center disabled:opacity-30 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all shadow-sm"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* MODALE DE CRÉATION RENDERISÉE ICI */}
      {isCreateModalOpen && (
        <CreateEventModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={handleCreationSuccess} 
        />
      )}

    </DashboardLayout>
  );
};

export default EventsList;