import { useState } from 'react';
import { toast } from 'sonner';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale/fr'; // Pour mettre le calendrier en Français
import "react-datepicker/dist/react-datepicker.css"; // Les styles de base du calendrier

import TemplateSelector from './TemplateSelector';
import { EventService } from '../api/services/EventService';
import { useTheme } from '../contexts/ThemeContext';

// On enregistre la langue française pour le calendrier
registerLocale('fr', fr);

const predefinedCategories = ["Concert", "Sport", "Conférence", "Théâtre", "Festival", "Autre"];

const CreateEventModal = ({ onClose, onSuccess }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: new Date(Date.now() + 60 * 60 * 1000), // On initialise avec la date d'aujourd'hui + 1h pour le futur
    categorySelect: '',
    customCategory: '',
    templateStyle: 'Standard'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  // Gère spécifiquement le changement du DatePicker
  const handleDateChange = (date) => setFormData({ ...formData, date });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = formData.categorySelect === "Autre" ? formData.customCategory : formData.categorySelect;

    if (!finalCategory) {
      toast.error("Veuillez préciser une catégorie.");
      return;
    }

    try {
      setLoading(true);
      await EventService.createEvent({
        name: formData.name,
        location: formData.location,
        date: formData.date.toISOString(), // Le backend .NET gère très bien l'ISOString
        category: finalCategory,
        templateStyle: formData.templateStyle
      });
      toast.success("Événement créé avec succès !");
      onSuccess(); 
    } catch (error) {
      ttoast.error(error.response?.data?.message || "Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  // ================= STYLES EXPERTS (HOVER & FOCUS) =================
  const bgClass = isDarkMode ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200';
  const textClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const labelClass = `block text-xs font-bold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`;
  
  // Le secret d'un input "Premium" : Hover doux + Ring large et transparent au focus
  const inputContainerClass = "relative w-full group";
  const inputClass = `w-full pl-11 pr-4 py-3.5 rounded-xxl border outline-indigo-accent font-medium transition-all duration-300 
    hover:border-indigo-accent
    focus:border-indigo-accent focus:ring-4 focus:ring-indigo-500/20 
    ${isDarkMode ? 'bg-[#0B1120] border-slate-700 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'}`;
  const iconClass = `absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-indigo-500 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`;
  // ===================================================================

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className={`relative w-full max-w-2xl max-h-[95vh] flex flex-col rounded-xl shadow-2xl border ${bgClass}`}>
        
        <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-500/10 hover:bg-slate-500/20 hover:rotate-90 text-slate-500 transition-all z-10 duration-300">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="flex-shrink-0 p-6 sm:p-8 border-b border-slate-700/20">
          <h2 className={`text-2xl sm:text-3xl font-bold mb-1 ${textClass}`}>Nouvel Événement</h2>
          <p className="text-slate-500 font-medium text-sm sm:text-base">Configurez les détails de votre prochaine billetterie.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <form id="create-event-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* NOM */}
              <div>
                <label className={labelClass}>Nom de l'événement <span className="text-red-500">*</span></label>
                <div className={inputContainerClass}>
                  <i className={`fa-solid fa-heading ${iconClass}`}></i>
                  <input required type="text" name="name" placeholder="Ex: Concert Fally Ipupa" value={formData.name} onChange={handleChange} className={inputClass} autoFocus />
                </div>
              </div>

              {/* LIEU */}
              <div>
                <label className={labelClass}>Lieu <span className="text-red-500">*</span></label>
                <div className={inputContainerClass}>
                  <i className={`fa-solid fa-location-dot ${iconClass}`}></i>
                  <input required type="text" name="location" placeholder="Ex: Stade Japoma" value={formData.location} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* DATE & HEURE (Avec react-datepicker) */}
              <div>
                <label className={labelClass}>Date et Heure <span className="text-red-500">*</span></label>
                <div className={inputContainerClass}>
                  <i className={`fa-solid fa-calendar-days ${iconClass} z-10`}></i>
                  {/* Le wrapper div permet au datepicker de prendre toute la largeur */}
                  <div className="w-full">
                    <DatePicker 
                      selected={formData.date} 
                      onChange={handleDateChange} 
                      showTimeSelect 
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      timeCaption="Heure"
                      dateFormat="d MMMM yyyy, HH:mm" // Ex: 12 Janvier 2026, 18:00
                      locale="fr"
                      className={inputClass}
                      wrapperClassName="w-full"
                    />
                  </div>
                </div>
              </div>
              
              {/* CATÉGORIE */}
              <div>
                <label className={labelClass}>Catégorie <span className="text-red-500">*</span></label>
                <div className={inputContainerClass}>
                  <i className={`fa-solid fa-layer-group ${iconClass}`}></i>
                  <input required list="categories" name="categorySelect" placeholder="Choisissez ou tapez..." value={formData.categorySelect} onChange={handleChange} className={inputClass} />
                  <datalist id="categories">
                    {predefinedCategories.map(cat => <option key={cat} value={cat} />)}
                  </datalist>
                </div>
              </div>
            </div>

            {/* CATÉGORIE AUTRE (Conditionnelle) */}
            {formData.categorySelect === "Autre" && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <label className={labelClass}>Précisez la catégorie <span className="text-red-500">*</span></label>
                <div className={inputContainerClass}>
                  <i className={`fa-solid fa-pen ${iconClass}`}></i>
                  <input required type="text" name="customCategory" placeholder="Ex: Masterclass Cuisine" value={formData.customCategory} onChange={handleChange} className={`${inputClass} bg-indigo-500/5`} />
                </div>
              </div>
            )}

            <div>
              <label className={labelClass}>Design des Billets</label>
              <TemplateSelector value={formData.templateStyle} onChange={(val) => setFormData({...formData, templateStyle: val})} />
            </div>

          </form>
        </div>

        <div className="flex-shrink-0 p-6 border-t border-slate-700/20 bg-black/5 rounded-b-3xl flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-500/10 transition-colors">
            Annuler
          </button>
          <button type="submit" form="create-event-form" disabled={loading} className="px-8 py-3 bg-indigo-accent hover:bg-indigo-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:-translate-y-1">
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-check"></i>}
            {loading ? 'Création...' : 'Valider'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateEventModal;