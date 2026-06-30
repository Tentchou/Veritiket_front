import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardLayout from '../layouts/DashboardLayout';
import TicketTemplateSelector from '../components/TicketTemplateSelector';
import SearchableSelect from '../components/SearchableSelect';
import TicketPreview from '../components/TicketPreview';
import { TicketService } from '../api/services/TicketService';
import { useTheme } from '../contexts/ThemeContext';

const categoriesCatalog = ["Entrée Standard", "Accès VIP", "Pass VVIP", "Place Tribune", "Early Bird", "Autre"];

const GenerateTickets = () => {
  const { isDarkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get('eventId');
  const [loading, setLoading] = useState(false);
  const [mobileTab, setMobileTab] = useState('form'); // 'form' | 'preview' (sous lg uniquement)

  const [formData, setFormData] = useState({
    quantity: 100,
    price: 5000,
    category: 'Entrée Standard',
    templateId: 'minimal'
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await TicketService.generateTickets({
        eventId: eventId,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        customMessage: formData.category
      });
      toast.success(response.Message);
      navigate(`/dashboard/tickets?eventId=${eventId}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Erreur de génération.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full pl-10 pr-3 py-2.5 border outline-none text-sm font-medium transition-all duration-300 
    hover:border-indigo-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 
    ${isDarkMode ? 'bg-[#0B1120] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`;

  const iconClass = `absolute left-3.5 top-1/2 -translate-y-1/2 text-sm transition-colors duration-300 group-focus-within:text-indigo-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`;

  const cardClass = `p-4 sm:p-5 border shadow-sm ${isDarkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`;

  return (
    <DashboardLayout>
      <form onSubmit={handleGenerate} className="h-full flex flex-col">

        {/* HEADER — hauteur fixe, ne bouge jamais */}
        <div className="flex items-center justify-between gap-4 pb-4 shrink-0">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Générer des Billets</h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">Configurez et lancez une impression numérique.</p>
          </div>

          {/* Onglets — uniquement sous lg, pour ne jamais empiler form + aperçu */}
          <div className={`lg:hidden flex items-center gap-1 p-1 rounded-xl shrink-0 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <button type="button" onClick={() => setMobileTab('form')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mobileTab === 'form' ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}>Config</button>
            <button type="button" onClick={() => setMobileTab('preview')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mobileTab === 'preview' ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}>Aperçu</button>
          </div>
        </div>

        {/* ZONE PRINCIPALE — occupe tout l'espace restant, jamais plus */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* COLONNE FORMULAIRE — scroll interne SI besoin, jamais le navigateur */}
          <div className={`lg:col-span-7 min-h-0 flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar ${mobileTab === 'form' ? 'flex' : 'hidden lg:flex'}`}>
            <div className={cardClass}>
              <h3 className="text-xs font-bold mb-3 text-indigo-500 uppercase tracking-widest"><i className="fa-solid fa-palette mr-2"></i>1. Style graphique</h3>
              <TicketTemplateSelector selected={formData.templateId} onSelect={(id) => setFormData({...formData, templateId: id})} />
            </div>

            <div className={`${cardClass} space-y-4`}>
              <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest"><i className="fa-solid fa-sliders mr-2"></i>2. Paramètres du lot</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Catégorie du billet</label>
                  <SearchableSelect options={categoriesCatalog} value={formData.category} onChange={(val) => setFormData({...formData, category: val})} placeholder="Sélectionnez le type..." />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Prix unitaire (FCFA)</label>
                  <div className="relative group w-full">
                    <i className={`fa-solid fa-coins ${iconClass}`}></i>
                    <input type="number" min="0" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className={inputClass} />
                  </div>
                </div>
              </div>

              <div className="w-full">
                <label className="text-[11px] font-bold text-slate-500 block mb-1.5 uppercase tracking-wider">Quantité à émettre</label>
                <div className="relative group w-full">
                   <i className={`fa-solid fa-copy ${iconClass}`}></i>
                   <input type="number" min="1" max="1000" required value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* COLONNE APERÇU */}
          <div className={`lg:col-span-5 min-h-0 flex-col gap-3 overflow-y-auto custom-scrollbar ${mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'}`}>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1 shrink-0">
              <i className="fa-solid fa-wand-magic-sparkles text-indigo-500 mr-2"></i> Aperçu Live
            </h3>
            <TicketPreview templateId={formData.templateId} category={formData.category} price={formData.price} />
          </div>

        </div>

        {/* BOUTON — toujours visible, jamais perdu en bas de page */}
        <div className="shrink-0 pt-4">
          <button
            disabled={loading}
            type="submit"
            className="w-full py-3.5 bg-indigo-accent border border-indigo-accent text-white rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 hover:bg-indigo-500 hover:-translate-y-1 hover:scale-105 shadow-[0_0_20px_rgba(129,140,248,0.3)] hover:shadow-[0_0_40px_rgba(129,140,248,0.6)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-[0_0_20px_rgba(129,140,248,0.3)]"
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-bolt text-yellow-300"></i>}
            {loading ? 'Calcul des signatures...' : `Signer et émettre ${formData.quantity} billets`}
          </button>
        </div>

      </form>
    </DashboardLayout>
  );
};

export default GenerateTickets;