import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import EventRow from '../components/EventRow';
import { EventService } from '../api/services/EventService';
import { useTheme } from '../contexts/ThemeContext';
import { EventRowSkeleton } from '../components/Skeletons';
import { Link } from 'react-router-dom';

const EventsList = () => {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState({ items: [], totalPages: 1 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const result = await EventService.getEvents(search, page, 5);
        setData(result);
      } catch (error) {
        console.error("Erreur lors du chargement des événements", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Délai pour ne pas faire vibrer/spammer l'API à chaque frappe
    const delayDebounceFn = setTimeout(() => {
      loadEvents();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, page]);

  // Styles de l'ancien modèle bien structuré
  const tableBg = isDarkMode ? 'bg-navy-slate border-slate-800/60' : 'bg-white border-slate-200';
  const thClass = isDarkMode ? 'bg-slate-800/40 text-slate-400 border-slate-800/60' : 'bg-slate-50 text-slate-500 border-slate-100';
  const inputClass = isDarkMode ? 'bg-navy-deep border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-100 border-slate-200 text-slate-900 focus:bg-white';

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex justify-between w-full md:w-auto items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-1">Mes Événements</h1>
            <p className="text-slate-500 font-medium">Gérez et suivez vos billetteries actives.</p>
          </div>
          <Link to="/dashboard/events/new" className="hidden md:inline-flex px-5 py-3 bg-indigo-accent hover:bg-indigo-600 text-white rounded-xl font-bold transition-all items-center gap-2">
            <i className="fa-solid fa-plus"></i> Créer
          </Link>
        </div>
        
        {/* Barre de recherche (Le spinner s'affiche ici, le tableau ne bouge pas) */}
        <div className="relative w-full md:w-80">
          {loading ? (
             <i className="fa-solid fa-circle-notch fa-spin absolute left-4 top-1/2 -translate-y-1/2 text-indigo-accent"></i>
          ) : (
             <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
          )}
          <input 
            type="text" placeholder="Rechercher un événement..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className={`w-full pl-11 pr-4 py-3 rounded-2xl border outline-none text-sm font-medium transition-all ${inputClass}`}
          />
        </div>
      </div>

      {/* Le Tableau dans sa jolie boîte (min-h-[400px] empêche la vibration) */}
      <div className={`rounded-3xl border overflow-hidden shadow-xl transition-all duration-300 ${tableBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left min-w-[600px]">
            <thead>
              <tr className={`border-b text-xs font-bold uppercase tracking-wider ${thClass}`}>
                <th className="py-4 px-6">Nom de l'événement</th>
                <th className="py-4 px-6">Lieu</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Catégorie</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            {/* Si ça charge, on grise légèrement le tableau au lieu de le vider */}
            <tbody>
              {loading && data.items.length === 0 ? (
                /* Affichage de 5 Skeletons pendant le chargement initial */
                Array.from({ length: 5 }).map((_, index) => (
                  <EventRowSkeleton key={index} />
                ))
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-500 font-medium">Aucun événement trouvé.</td>
                </tr>
              ) : (
                data.items.map(event => <EventRow key={event.id} event={event} isDarkMode={isDarkMode} />)
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination en bas */}
      {data.totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 mt-6">
          <button 
            disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="w-10 h-10 rounded-xl border border-slate-700/50 flex items-center justify-center disabled:opacity-30 hover:bg-indigo-accent hover:text-white transition-all"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className="text-sm font-semibold text-slate-500">Page {page} sur {data.totalPages}</span>
          <button 
            disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)}
            className="w-10 h-10 rounded-xl border border-slate-700/50 flex items-center justify-center disabled:opacity-30 hover:bg-indigo-accent hover:text-white transition-all"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EventsList;