import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardLayout from '../layouts/DashboardLayout';
import TemplateSelector from '../components/TemplateSelector';
import { EventService } from '../api/services/EventService';
import { useTheme } from '../contexts/ThemeContext';

const predefinedCategories = ["Concert", "Sport", "Conférence", "Théâtre", "Festival", "Autre"];

const CreateEvent = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // L'état du formulaire
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    categorySelect: '', // La sélection (Recherche native)
    customCategory: '', // Si "Autre" est sélectionné
    templateStyle: 'Standard'
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Déduction de la catégorie finale (Choix ou Personnalisée)
    const finalCategory = formData.categorySelect === "Autre" ? formData.customCategory : formData.categorySelect;

    if (!finalCategory) {
      toast.error("Veuillez préciser une catégorie.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        location: formData.location,
        date: new Date(formData.date).toISOString(), // Formatage pour .NET
        category: finalCategory,
        templateStyle: formData.templateStyle
      };

      await EventService.createEvent(payload);
      toast.success("Événement créé avec succès !");
      navigate('/dashboard/events'); // On redirige vers la liste des événements
    } catch (error) {
      toast.error(error.response?.data?.Message || "Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none font-medium transition-all focus:border-indigo-500 
    ${isDarkMode ? 'bg-navy-deep border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'}`;
  const labelClass = `block text-sm font-bold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Nouvel Événement</h1>
        <p className="text-slate-500 font-medium mb-8">Configurez les détails de votre prochaine billetterie.</p>

        <form onSubmit={handleSubmit} className={`p-8 rounded-3xl shadow-xl border ${isDarkMode ? 'bg-navy-slate border-slate-800/60' : 'bg-white border-slate-200'}`}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={labelClass}>Nom de l'événement <span className="text-red-500">*</span></label>
              <input required type="text" name="name" placeholder="Ex: Concert Fally Ipupa" value={formData.name} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Lieu <span className="text-red-500">*</span></label>
              <input required type="text" name="location" placeholder="Ex: Stade Japoma" value={formData.location} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className={labelClass}>Date et Heure <span className="text-red-500">*</span></label>
              <input required type="datetime-local" name="date" value={formData.date} onChange={handleChange} className={inputClass} />
            </div>
            
            <div>
              <label className={labelClass}>Catégorie (Recherche) <span className="text-red-500">*</span></label>
              {/* Le combo input + datalist permet la recherche native parfaite ! */}
              <input required list="categories" name="categorySelect" placeholder="Choisissez ou tapez..." value={formData.categorySelect} onChange={handleChange} className={inputClass} />
              <datalist id="categories">
                {predefinedCategories.map(cat => <option key={cat} value={cat} />)}
              </datalist>
            </div>
          </div>

          {/* Affichage conditionnel de la catégorie "Autre" */}
          {formData.categorySelect === "Autre" && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <label className={labelClass}>Précisez la catégorie <span className="text-red-500">*</span></label>
              <input required type="text" name="customCategory" placeholder="Ex: Masterclass Cuisine" value={formData.customCategory} onChange={handleChange} className={`${inputClass} border-indigo-500/50 bg-indigo-500/5`} />
            </div>
          )}

          <div className="mb-10">
            <label className={labelClass}>Design des Billets</label>
            <TemplateSelector value={formData.templateStyle} onChange={(val) => setFormData({...formData, templateStyle: val})} />
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-700/30">
            <button disabled={loading} type="submit" className="px-8 py-3 bg-indigo-accent hover:bg-indigo-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2">
              {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-plus"></i>}
              {loading ? 'Création...' : 'Créer l\'événement'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateEvent;