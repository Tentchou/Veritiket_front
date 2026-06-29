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
        // 1. Charger les billets
        const result = await TicketService.getTicketsByEvent(eventId, page, 50);
        console.log("Tickets loaded:", result);
        setData(result);
        
        // 2. Charger le nom de l'événement via les stats
        // (C'est une astuce rapide, on utilise l'endpoint existant)
        const eventStats = await EventService.getEventStats(eventId);
        console.log("Event stats:", eventStats);
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
      setTicketToDistribute(null); // Ferme la modale
    } catch (error) {
      console.error(error);
    }
  };

  // 2. Ajoute cette fonction
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const toastId = toast.loading("Génération du fichier Excel/CSV...");
      
      const blobData = await TicketService.exportTicketsToCSV(eventId);
      
      // Astuce JS experte pour forcer le téléchargement du Blob
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      // Remplace .csv par .xlsx
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
        <div className="p-10 border-2 border-dashed border-slate-700/60 rounded-3xl text-center text-slate-500">
          Veuillez sélectionner un événement depuis la page "Mes Événements" pour voir ses billets.
        </div>
      </DashboardLayout>
    );
  }

  const tableBg = isDarkMode ? 'bg-navy-slate border-slate-800/60' : 'bg-white border-slate-200';
  const thClass = isDarkMode ? 'bg-slate-800/40 text-slate-400 border-slate-800/60' : 'bg-slate-50 text-slate-500 border-slate-100';

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-1">Billets Générés</h1>
          <p className="text-slate-500 font-medium">Consultez, imprimez ou générez de nouveaux billets.</p>
        </div>
        {/* ZONE DES BOUTONS */}
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/events" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all no-underline inline-flex items-center">
             <i className="fa-solid fa-arrow-left mr-2"></i> Retour
          </Link>
          
          {/* BOUTON EXPORT IMPRIMERIE*/}
          <button 
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-4 py-2 bg-white text-success border border-slate-200 hover:bg-slate-100 text-slate-800 rounded-xl text-sm font-bold transition-all inline-flex items-center dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700 shadow-sm disabled:opacity-50"
          >
            {isExporting ? <i className="fa-solid fa-spinner fa-spin mr-2 text-emerald-500"></i> : <i className="fa-solid fa-file-csv mr-2 text-emerald-500"></i>}
            {isExporting ? 'Création...' : 'Exporter Data (Excel)'}
          </button>

          <Link to={`/dashboard/tickets/generate?eventId=${eventId}`} className="px-4 py-2 bg-indigo-accent hover:bg-indigo-600 text-white rounded-xl text-sm font-bold transition-all no-underline inline-flex items-center shadow-md shadow-indigo-500/20">
            <i className="fa-solid fa-bolt mr-2 text-yellow-300"></i> Générer un Lot
          </Link>
        </div>
      </div>

      <div className={`rounded-3xl border overflow-hidden shadow-xl transition-all duration-300 ${tableBg}`}>
        <div className="overflow-x-auto max-h-[700px]">
          <table className="w-full border-collapse text-left min-w-[700px] relative">
            <thead className="sticky top-0 z-10">
              <tr className={`border-b text-xs font-bold uppercase tracking-wider ${thClass}`}>
                <th className="py-4 px-6">ID Billet</th>
                <th className="py-4 px-6">Catégorie</th>
                <th className="py-4 px-6">Prix</th>
                <th className="py-4 px-6 text-center">Statut</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className={`transition-opacity duration-300 ${loading ? 'opacity-40' : 'opacity-100'}`}>
              {loading && data.items.length === 0 ? (
                Array.from({ length: 5 }).map((_, idx) => <EventRowSkeleton key={idx} />)
              ) : data.items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-500 font-medium">Aucun billet généré pour cet événement.</td>
                </tr>
              ) : (
                data.items.map(ticket => (
                  <tr key={ticket.id} className={`border-b transition-colors duration-200 ${isDarkMode ? 'border-slate-800/60 hover:bg-slate-800/40' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className={`py-4 px-6 font-mono text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{ticket.id.split('-')[0]}</td>
                    <td className={`py-4 px-6 font-medium ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{ticket.customMessage}</td>
                    <td className={`py-4 px-6 font-medium ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{ticket.price} FCFA</td>
                    <td className="py-4 px-6 text-center">
                      {ticket.isScanned ? (
                        <span className="px-2 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-500">
                          <i className="fa-solid fa-lock mr-1"></i> Scanné
                        </span>
                      ) : ticket.isDistributed ? (
                        <span className="px-2 py-1 rounded-md text-xs font-bold bg-indigo-500/10 text-indigo-400 whitespace-nowrap">
                          <i className="fa-solid fa-user-check mr-1"></i> {ticket.distributedTo}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-500">
                          <i className="fa-solid fa-box mr-1"></i> En stock
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center flex justify-end gap-2">
                      {/* On ne peut assigner que s'il est en stock (non distribué, non scanné) */}
                      {!ticket.isDistributed && !ticket.isScanned && (
                        <button 
                          onClick={() => setTicketToDistribute(ticket)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
                        >
                          <i className="fa-solid fa-share-nodes"></i> Assigner
                        </button>
                      )}

                      <button 
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-3 py-2 bg-indigo-accent/10 hover:bg-indigo-accent text-indigo-400 hover:text-white rounded-xl text-xs font-bold transition-all"
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

      {/* Pagination ultra-pro */}
      {data.totalPages > 1 && (
        <div className="flex justify-end items-center gap-3 mt-6">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-10 h-10 rounded-xl border border-slate-700/50 flex items-center justify-center disabled:opacity-30 hover:bg-indigo-accent hover:text-white transition-all">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className="text-sm font-semibold text-slate-500">Page {page} sur {data.totalPages}</span>
          <button disabled={page === data.totalPages} onClick={() => setPage(p => p + 1)} className="w-10 h-10 rounded-xl border border-slate-700/50 flex items-center justify-center disabled:opacity-30 hover:bg-indigo-accent hover:text-white transition-all">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Rendu de la fenêtre modale */}
      {selectedTicket && (
        <TicketQRCodeModal 
          ticket={selectedTicket} 
          eventName={eventName} // <-- NOUVEAU
          onClose={() => setSelectedTicket(null)} 
        />
      )}

      {ticketToDistribute && (
        <DistributeTicketModal 
          ticket={ticketToDistribute} 
          onClose={() => setTicketToDistribute(null)}
          onSuccess={refreshTickets} // On passe la fonction de rafraîchissement
        />
      )}
    </DashboardLayout>
  );
};

export default TicketsList;