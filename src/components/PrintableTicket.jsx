import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const PrintableTicket = ({ ticket, eventName }) => {
  const qrData = JSON.stringify({
    ticketId: ticket.id,
    eventId: ticket.eventId,
    price: ticket.price,
    customMessage: ticket.customMessage,
    cryptographicSignature: ticket.cryptographicSignature
  });

  return (
    // Suppression du h-40 restrictif, utilisation de w-full pour occuper la grille
    <div className="flex border-2 border-slate-800 rounded-2xl overflow-hidden w-full bg-white text-slate-900 break-inside-avoid print:shadow-none">
      
      {/* Zone Infos : min-h-[160px] garantit une belle taille sans bloquer l'expansion */}
      <div className="flex-1 p-4 flex flex-col justify-between border-r-2 border-dashed border-slate-400 min-h-[160px]">
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-bold uppercase tracking-wider">
              {ticket.customMessage}
            </span>
            <span className="text-[9px] font-black tracking-widest text-slate-400">VERITICKET</span>
          </div>
          {/* line-clamp-2 évite qu'un nom trop long pousse le prix vers le bas */}
          <h3 className="text-lg font-black tracking-tight leading-tight line-clamp-2">
            {eventName || "ÉVÉNEMENT"}
          </h3>
        </div>

        <div className="flex justify-between items-end mt-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Prix d'entrée</p>
            {/* leading-none évite les marges invisibles sous le texte */}
            <p className="text-xl font-black leading-none">{Number(ticket.price).toLocaleString('fr-FR')} <span className="text-xs">FCFA</span></p>
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            ID: {ticket.id.split('-')[0]}
          </div>
        </div>
      </div>

      {/* Zone QR Code */}
      <div className="w-32 p-3 flex flex-col items-center justify-center bg-slate-50 shrink-0">
        <QRCodeSVG value={qrData} size={90} level="H" />
        <p className="text-[8px] font-bold tracking-widest uppercase text-slate-400 mt-2 text-center leading-none">
          Scan <br/> Obligatoire
        </p>
      </div>

    </div>
  );
};

export default PrintableTicket;