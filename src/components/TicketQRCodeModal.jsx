import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';

const ticketStyles = {
  minimal: { header: 'bg-slate-800 text-white', body: 'bg-white text-slate-800', qrBorder: 'border-slate-200', accent: 'text-slate-800' },
  vip_gold: { header: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900', body: 'bg-slate-900 text-amber-100', qrBorder: 'border-amber-500/30', accent: 'text-amber-400' },
  festival_neon: { header: 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white', body: 'bg-indigo-950 text-fuchsia-100', qrBorder: 'border-fuchsia-500/30', accent: 'text-fuchsia-400' }
};

// NOUVEAU : On ajoute 'eventName' dans les props
const TicketQRCodeModal = ({ ticket, eventName, onClose }) => {
  const ticketRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  if (!ticket) return null;

  const isVip = ticket.customMessage.toUpperCase().includes('VIP');
  const currentTheme = isVip ? ticketStyles.vip_gold : ticketStyles.minimal;

  const qrDataString = JSON.stringify({
    ticketId: ticket.id,
    eventId: ticket.eventId,
    price: ticket.price,
    customMessage: ticket.customMessage,
    cryptographicSignature: ticket.cryptographicSignature
  });

  const handleDownloadImage = async () => {
    if (!ticketRef.current) return;
    try {
      setIsDownloading(true);
      const toastId = toast.loading("Préparation du billet...");
      const dataUrl = await toPng(ticketRef.current, { quality: 1, pixelRatio: 3, backgroundColor: null, style: { transform: 'scale(1)', margin: '0' } });
      const link = document.createElement('a');
      link.download = `Billet_${eventName.replace(/\s+/g, '_')}_${ticket.id.substring(0, 5)}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Billet téléchargé ! Prêt à être envoyé.", { id: toastId });
    } catch (error) {
      toast.error("Impossible de générer l'image.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-700 transition z-50">
        <i className="fa-solid fa-xmark text-xl"></i>
      </button>

      <div ref={ticketRef} className={`relative w-full max-w-[320px] rounded-2xl overflow-hidden flex flex-col shadow-2xl ${currentTheme.body}`}>
        <div className={`p-6 text-center relative ${currentTheme.header}`}>
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
          
          {/* NOUVEAU : Affichage du nom de l'événement et de la catégorie */}
          <h2 className="text-2xl font-black uppercase tracking-tight relative z-10 leading-tight line-clamp-2">
            {eventName || "ÉVÉNEMENT"}
          </h2>
          <p className="text-xs uppercase tracking-widest font-bold opacity-80 mt-2 relative z-10 bg-black/20 inline-block px-3 py-1 rounded-full">
            {ticket.customMessage}
          </p>
        </div>

        <div className={`w-full flex justify-center -mt-3 z-20`}>
           <div className={`w-full border-t-[6px] border-dotted ${currentTheme.body} opacity-50`}></div>
        </div>

        <div className="p-8 flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-1">Tarif</p>
            <p className={`text-3xl font-black ${currentTheme.accent}`}>
              {Number(ticket.price).toLocaleString('fr-FR')} <span className="text-sm">FCFA</span>
            </p>
          </div>
          <div className={`p-3 bg-white rounded-xl shadow-inner border-2 ${currentTheme.qrBorder}`}>
            <QRCodeSVG value={qrDataString} size={160} level="H" />
          </div>
          <p className="text-[10px] font-mono opacity-50 mt-4 mb-2">ID: {ticket.id.split('-')[0]}</p>
          <p className={`text-[9px] font-bold uppercase tracking-widest ${currentTheme.accent}`}>
            <i className="fa-solid fa-shield-check mr-1"></i> Billet Crypté
          </p>
        </div>
      </div>

      <div className="mt-8 z-10">
        <button onClick={handleDownloadImage} disabled={isDownloading} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-3 disabled:opacity-50">
          {isDownloading ? <i className="fa-solid fa-circle-notch fa-spin text-xl"></i> : <i className="fa-brands fa-whatsapp text-xl"></i>}
          {isDownloading ? 'Génération...' : 'Télécharger l\'Image'}
        </button>
      </div>
    </div>
  );
};

export default TicketQRCodeModal;