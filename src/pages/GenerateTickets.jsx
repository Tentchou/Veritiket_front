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

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
        
        {/* COLONNE GAUCHE : FORMULAIRE (7/12 de l'écran) */}
        <form onSubmit={handleGenerate} className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-1">Générer des Billets</h1>
            <p className="text-slate-500 font-medium">Configurez et lancez une impression numérique cryptographique.</p>
          </div>

          <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-navy-slate border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-base font-bold mb-4 text-indigo-accent">1. Style graphique</h3>
            <TicketTemplateSelector selected={formData.templateId} onSelect={(id) => setFormData({...formData, templateId: id})} />
          </div>

          <div className={`p-6 rounded-3xl border space-y-4 ${isDarkMode ? 'bg-navy-slate border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-base font-bold text-indigo-accent">2. Paramètres du lot</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Catégorie du billet</label>
                <SearchableSelect options={categoriesCatalog} value={formData.category} onChange={(val) => setFormData({...formData, category: val})} placeholder="Sélectionnez le type..." />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-2">Prix unitaire (FCFA)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className={`w-full px-4 py-3 rounded-xl border outline-none font-medium ${isDarkMode ? 'bg-navy-deep border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
              </div>
            </div>
            <div className="w-full">
              <label className="text-xs font-bold text-slate-500 block mb-2">Quantité à émettre</label>
              <input type="number" min="1" max="500" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className={`w-full px-4 py-3 rounded-xl border outline-none font-medium ${isDarkMode ? 'bg-navy-deep border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`} />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 bg-indigo-accent hover:bg-indigo-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bolt"></i>}
            {loading ? 'Calcul des signatures...' : `Signer et émettre ${formData.quantity} billets`}
          </button>
        </form>

        {/* COLONNE DROITE : LE PREVIEW CANVA EN TEMPS RÉEL (5/12 de l'écran) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 h-max space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest"><i className="fa-solid fa-wand-magic-sparkles text-indigo-accent mr-1"></i> Aperçu Live Canva</h3>
          <TicketPreview templateId={formData.templateId} category={formData.category} price={formData.price} />
        </div>

      </div>
    </DashboardLayout>
  );
};

export default GenerateTickets;