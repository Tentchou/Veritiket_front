
const styles = {
  minimal: {
    bg: 'bg-white text-slate-800 border-slate-200 shadow-slate-200/50',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    accent: 'text-indigo-600',
    qrBg: 'bg-slate-50 border border-slate-100'
  },
  vip_gold: {
    bg: 'bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-amber-100 border-amber-500/40 shadow-black/40',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    accent: 'text-amber-400',
    qrBg: 'bg-white p-1 rounded-xl'
  },
  festival_neon: {
    bg: 'bg-gradient-to-r from-indigo-950 to-purple-950 text-fuchsia-100 border-fuchsia-500/40 shadow-purple-950/20',
    badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
    accent: 'text-fuchsia-400',
    qrBg: 'bg-cyan-400/10 border border-cyan-400/30'
  }
};

const TicketPreview = ({ templateId, category, price }) => {
  const current = styles[templateId] || styles.minimal;

  return (
    <div className={`w-full border rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl relative transition-all duration-300 ${current.bg}`}>
      
      {/* CORPS DU BILLET */}
      <div className="flex-1 p-6 flex flex-col justify-between min-w-0 relative">
        <div>
          <div className="flex justify-between items-start gap-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${current.badge}`}>
              {category || 'CATÉGORIE'}
            </span>
            <div className="text-xs font-black tracking-widest opacity-40">VERITICKET SECURE</div>
          </div>
          <h3 className="text-2xl font-black tracking-tight truncate">CONCERT ACADÉMIE</h3>
          <p className="text-xs opacity-60 mt-1"><i className="fa-solid fa-location-dot mr-1"></i> Complexe Sportif, Douala</p>
        </div>

        <div className="mt-8 flex justify-between items-end border-t border-dashed border-current/20 pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Prix du billet</p>
            <p className={`text-2xl AppFont font-black ${current.accent}`}>{Number(price).toLocaleString('fr-FR')} <span className="text-sm font-bold">FCFA</span></p>
          </div>
          <div className="text-right text-[10px] font-mono opacity-40">#VT-PREVIEW</div>
        </div>
      </div>

      {/* LIGNE DE PERFORATION & ENCOCHES (Style Ticket Pro) */}
      <div className="hidden md:flex flex-col justify-between items-center relative w-1">
        <div className={`w-6 h-6 rounded-full absolute -top-3 -left-3 border-b ${templateId === 'minimal' ? 'bg-slate-50 border-slate-200' : 'bg-navy-deep border-slate-800'}`}></div>
        <div className="h-full border-r-2 border-dashed border-current/20 my-3"></div>
        <div className={`w-6 h-6 rounded-full absolute -bottom-3 -left-3 border-t ${templateId === 'minimal' ? 'bg-slate-50 border-slate-200' : 'bg-navy-deep border-slate-800'}`}></div>
      </div>

      {/* COUPON DE SCAN (Le QR Code) */}
      <div className="p-6 md:w-52 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-dashed border-current/20 shrink-0">
        <div className={`w-32 h-32 flex items-center justify-center rounded-2xl ${current.qrBg}`}>
          <i className={`fa-solid fa-qrcode text-7xl opacity-80 ${current.accent}`}></i>
        </div>
        <p className="text-[10px] font-bold tracking-widest uppercase opacity-40 mt-3">Sceau Crypto HMAC</p>
      </div>

    </div>
  );
};

export default TicketPreview;