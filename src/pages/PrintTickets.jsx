import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import PrintableTicket from '../components/PrintableTicket';
import { TicketService } from '../api/services/TicketService';

const PrintTickets = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get('eventId');
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Référence pour capturer la zone A4 et la transformer en PDF
  const printZoneRef = useRef(null);

  useEffect(() => {
    if (!eventId) return;
    
    const fetchAllTicketsForPrint = async () => {
      try {
        setLoading(true);
        const result = await TicketService.getTicketsByEvent(eventId, 1, 100);
        setTickets(result.items || []);
      } catch (error) {
        toast.error("Impossible de charger les billets.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllTicketsForPrint();
  }, [eventId]);

  // ACTION 1 : IMPRIMER (Imprimante physique)
  const handlePrint = () => {
    window.print(); 
  };

  // ACTION 2 : TÉLÉCHARGER (Vrai fichier PDF)
  const handleDownloadPDF = async () => {
    const element = printZoneRef.current;
    if (!element) return;

    let toastId;
    try {
      setIsDownloading(true);
      toastId = toast.loading("Génération du fichier PDF en cours...");

      // 1. Capture propre avec html-to-image (Supporte le CSS moderne oklch)
      const dataUrl = await toPng(element, { 
        quality: 1,
        pixelRatio: 2, // Haute résolution
        skipFonts: false,
        // Astuce : s'assurer que le fond est blanc lors de la capture
        backgroundColor: '#ffffff'
      });
      
      // 2. On crée le document PDF au format A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 3. Ajustement des dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      // On calcule la hauteur proportionnelle en fonction de la capture
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // 4. Lancement du téléchargement
      pdf.save(`Billets_VeriTicket_${eventId.substring(0, 5)}.pdf`);
      
      toast.success("Fichier PDF téléchargé avec succès !", { id: toastId });
    } catch (error) {
      console.error("Erreur de génération PDF:", error);
      // On s'assure d'écraser le toast de chargement par celui d'erreur
      toast.error("Erreur lors de la création du PDF.", { id: toastId });
    } finally {
      // Le finally garantit que le bouton redevient cliquable même en cas de crash
      setIsDownloading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Préparation des planches...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white text-slate-900 font-sans p-8 print:p-0 relative">
      
      {/* BARRE D'OUTILS (Cachée à l'impression) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-navy-deep p-4 rounded-2xl shadow-2xl z-50 print:hidden w-max">
        
        <button onClick={() => navigate(-1)} className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition">
          Annuler
        </button>
        
        <div className="w-px h-8 bg-slate-700 mx-2"></div> {/* Séparateur */}
        
        {/* BOUTON 1 : VRAIE IMPRESSION */}
        <button onClick={handlePrint} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition flex items-center gap-2">
          <i className="fa-solid fa-print"></i> Imprimer
        </button>

        {/* BOUTON 2 : VRAI TÉLÉCHARGEMENT PDF */}
        <button 
          onClick={handleDownloadPDF} 
          disabled={isDownloading}
          className="px-5 py-2.5 bg-indigo-accent hover:bg-indigo-600 text-white rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-50"
        >
          {isDownloading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-download"></i>}
          {isDownloading ? 'Création...' : 'Télécharger en PDF'}
        </button>

      </div>

      {/* ZONE CAPTURÉE (On attache la référence ici) */}
      <div 
        ref={printZoneRef} 
        className="max-w-[210mm] mx-auto bg-white print:shadow-none shadow-lg print:max-w-full p-4 print:p-0"
      >
        {tickets.length === 0 ? (
          <div className="p-10 text-center">Aucun billet à traiter.</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 print:gap-4 content-start">
            {tickets.map(ticket => (
              <div key={ticket.id} className="[-webkit-print-color-adjust:exact] [color-adjust:exact]">
                <PrintableTicket ticket={ticket} eventName="Mon Événement" />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default PrintTickets;