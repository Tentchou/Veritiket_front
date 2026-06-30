import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import TicketQRCodeModal from '../components/TicketQRCodeModal';
import { EventRowSkeleton } from '../components/Skeletons';
import { TicketService } from '../api/services/TicketService';
import { useTheme } from '../contexts/ThemeContext';
import { EventService } from '../api/services/EventService';
import DistributeTicketModal from '../components/DistributeTicketModal';
import { toast } from 'sonner';

const TicketsList = () => {
  const { isDarkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [data, setData] = useState({ items: [], totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [eventName, setEventName] = useState("Chargement...");
  const [ticketToDistribute, setTicketToDistribute] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await TicketService.getTicketsByEvent(eventId, page, 50);
        setData(result);
        
        const eventStats = await EventService.getEventStats(eventId);
        setEventName(eventStats.eventName);
      } catch (error) {
        console.error("Erreur chargement", error);
        setEventName("Événement inconnu");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [eventId, page]);

  const refreshTickets = async () => {
    try {
      const result = await TicketService.getTicketsByEvent(eventId, page, 50);
      setData(result);
      setTicketToDistribute(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const toastId = toast.loading("Génération du fichier Excel/CSV...");
      
      const blobData = await TicketService.exportTicketsToCSV(eventId);
      
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `VeriTicket_Imprimerie_${eventId.substring(0,5)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Fichier exporté avec succès !", { id: toastId });
    } catch (error) {
      toast.error("Erreur lors de l'exportation. Assurez-vous d'avoir des billets non scannés.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!eventId) {
    return (
      <DashboardLayout>
        <div className="flex flex-col justify-center items-center h-full p-10 border-2 border-dashed border-slate-700/60 rounded-3xl text-center text-slate-500 max-w-2xl mx-auto">
          <i className="fa-solid fa-ticket text-5xl mb-6 opacity-40"></i>
          <p className="text-lg">Veuillez sélectionner un événement depuis la page "Mes Événements" pour voir ses billets.</p>
          <Link to="/dashboard/events" className="mt-8 px-6 py-3 bg-indigo-accent text-white rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 hover:-translate-y-1">
            Aller aux événements
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const tableBg = isDarkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200';
  const thClass = isDarkMode ? 'bg-slate-800/50 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-100';

  return (
    <DashboardLayout>
      {/* On utilise un Flex container sur toute la hauteur disponible pour gérer l'espace */}
      <div className="flex flex-col h-full max-h-[calc(100vh-120px)]">
        
        {/* HEADER ADAPTATIF */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6 shrink-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">Billets Générés</h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base">Consultez, assignez ou exportez les billets.</p>
          </div>
          
          {/* ZONE DES BOUTONS */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Link to="/dashboard/events" className="flex-1 sm:flex-none justify-center px-4 py-3 bg-slate-800 border border-slate-700 text-slate-300 text-sm font-bold transition-all duration-300 no-underline inline-flex items-center hover:bg-slate-700 hover:-translate-y-1 hover:scale-105 shadow-[0_0_15px_rgba(51,65,85,0.25)] hover:shadow-[0_0_30px_rgba(51,65,85,0.45)]">
               <i className="fa-solid fa-arrow-left sm:mr-2"></i> <span className="hidden sm:inline">Retour</span>
            </Link>
            
            <button 
              onClick={handleExportCSV}
              disabled={isExporting}
              className="flex-1 sm:flex-none justify-center px-4 py-3 bg-transparent text-emerald-600 border border-slate-200 text-sm font-bold transition-all duration-300 inline-flex items-center dark:bg-slate-800 dark:border-slate-700 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-300 hover:-translate-y-1 hover:scale-105 shadow-[0_0_15px_rgba(16,185,129,0.20)] hover:shadow-[0_0_35px_rgba(16,185,129,0.45)] disabled:opacity-50"
            >
              {isExporting ? <i className="fa-solid fa-spinner fa-spin sm:mr-2"></i> : <i className="fa-solid fa-file-excel sm:mr-2"></i>}
              <span className="hidden sm:inline">{isExporting ? 'Création...' : 'Exporter (.xlsx)'}</span>
            </button>

            <Link to={`/dashboard/tickets/generate?eventId=${eventId}`} className="w-full sm:w-auto justify-center px-6 py-3 bg-indigo-accent border border-transparent text-white text-sm font-bold transition-all duration-300 no-underline inline-flex items-center hover:bg-indigo-500 hover:-translate-y-1 hover:scale-105 shadow-[0_0_20px_rgba(129,140,248,0.3)] hover:shadow-[0_0_40px_rgba(129,140,248,0.6)]">
              <i className="fa-solid fa-bolt mr-2 text-yellow-300"></i> Générer un Lot
            </Link>
          </div>
        </div>

        {/* TABLEAU RESPONSIVE (Prend tout l'espace restant) */}
        {/* On utilise flex-1 et min-h-0 pour forcer le tableau à se contracter si besoin */}
        <div className={`flex-1 min-h-0 shadow-xl border transition-all duration-300 flex flex-col ${tableBg}`}>
          {/* Le secret pour cacher la scrollbar : classes 'scrollbar-hide' ou CSS inline */}
          <div 
            className="flex-1 overflow-auto w-full custom-scrollbar-hide" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Pour Firefox et IE
          >
            {/* Ajout d'un style global pour masquer la scrollbar Webkit */}
            <style>{`
              .custom-scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            <table className="w-full border-collapse text-left min-w-[700px] relative">
              <thead className="sticky top-0 z-10 backdrop-blur-md">
                <tr className={`border-b text-xs font-bold uppercase tracking-wider ${thClass}`}>
                  <th className="py-4 px-6">ID Billet</th>
                  <th className="py-4 px-6">Catégorie</th>
                  <th className="py-4 px-6">Prix</th>
                  <th className="py-4 px-6 text-center">Statut</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-slate-100 dark:divide-slate-800 transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
                {loading && data.items.length === 0 ? (
                  Array.from({ length: 5 }).map((_, idx) => <EventRowSkeleton key={idx} />)
                ) : data.items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                         <i className="fa-solid fa-ticket text-4xl opacity-30"></i>
                         <p>Aucun billet généré pour cet événement.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.items.map(ticket => (
                    <tr key={ticket.id} className={`transition-colors duration-200 group ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}`}>
                      <td className={`py-3 px-4 font-mono text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{ticket.id.split('-')[0]}</td>
                      <td className={`py-3 px-4 font-bold ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{ticket.customMessage}</td>
                      <td className={`py-3 px-4 font-medium ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{ticket.price} FCFA</td>
                      <td className="py-3 px-4 text-center">
                        {ticket.isScanned ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold border bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 whitespace-nowrap">
                            <i className="fa-solid fa-lock mr-1"></i> Scanné
                          </span>
                        ) : ticket.isDistributed ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold border bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 whitespace-nowrap">
                            <i className="fa-solid fa-user-check mr-1"></i> {ticket.distributedTo}
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 whitespace-nowrap">
                            <i className="fa-solid fa-box mr-1"></i> En stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right flex justify-end gap-2">
                        {!ticket.isDistributed && !ticket.isScanned && (
                          <button 
                            onClick={() => setTicketToDistribute(ticket)}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            <i className="fa-solid fa-share-nodes"></i> Assigner
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedTicket(ticket)}
                          className="px-3 py-2 bg-indigo-50 hover:bg-indigo-500 text-indigo-600 hover:text-white dark:bg-indigo-500/10 dark:hover:bg-indigo-500 dark:text-indigo-400 dark:hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          <i className="fa-solid fa-qrcode"></i> Billet
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION (Shrink-0 pour qu'elle reste toujours visible en bas) */}
        {data.totalPages > 1 && (
          <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pb-2">
            <span className="text-sm text-slate-500 font-medium">
              Affichage de {(data.pageNumber - 1) * data.pageSize + 1}
              {" "}à{" "}
              {Math.min(data.pageNumber * data.pageSize, data.totalCount)}
              {" "}sur{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {data.totalCount}
              </span>{" "}
              billets
            </span>

            <div className="flex items-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center disabled:opacity-30 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all shadow-sm"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <span className="text-sm font-semibold text-slate-500 px-2">
                Page {page} sur {data.totalPages}
              </span>

              <button
                disabled={page === data.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center disabled:opacity-30 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all shadow-sm"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Modales */}
      {selectedTicket && (
        <TicketQRCodeModal 
          ticket={selectedTicket} 
          eventName={eventName}
          onClose={() => setSelectedTicket(null)} 
        />
      )}

      {ticketToDistribute && (
        <DistributeTicketModal 
          ticket={ticketToDistribute} 
          onClose={() => setTicketToDistribute(null)}
          onSuccess={refreshTickets}
        />
      )}
    </DashboardLayout>
  );
};

export default TicketsList;