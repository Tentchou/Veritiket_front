import React, { useState } from 'react';
import { toast } from 'sonner';
import { TicketService } from '../api/services/TicketService';
import { useTheme } from '../contexts/ThemeContext';

const DistributeTicketModal = ({ ticket, onClose, onSuccess }) => {
  const { isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      await TicketService.distributeTicket(ticket.id, name);
      toast.success(`Billet assigné à ${name} !`);
      onSuccess(); // Rafraîchit la liste des billets
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur lors de l'assignation.");
    } finally {
      setLoading(false);
    }
  };

  const bgClass = isDarkMode ? 'bg-navy-deep border-slate-800' : 'bg-white border-slate-200';
  const textClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const inputClass = isDarkMode ? 'bg-navy-slate border-slate-700 text-white focus:border-indigo-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-sm p-6 rounded-3xl shadow-2xl border ${bgClass}`}>
        
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-500/10 hover:bg-slate-500/20 transition">
          <i className="fa-solid fa-xmark text-slate-500"></i>
        </button>

        <h3 className={`text-xl font-bold mb-2 ${textClass}`}>Assigner le billet</h3>
        <p className="text-sm text-slate-500 mb-6">Billet ID: <span className="font-mono">{ticket.id.split('-')[0]}</span></p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-500 mb-2">Nom / WhatsApp de l'acheteur</label>
            <input 
              autoFocus required type="text" placeholder="Ex: Paul - 690000000" 
              value={name} onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none font-medium transition-colors ${inputClass}`} 
            />
          </div>
          
          <button disabled={loading} type="submit" className="w-full py-3 bg-indigo-accent hover:bg-indigo-600 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-check"></i>}
            {loading ? 'Assignation...' : 'Valider la distribution'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default DistributeTicketModal;