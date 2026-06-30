import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // État du formulaire de contact
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Gestion de l'envoi vers WhatsApp
  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    
    // Formatage du message pour WhatsApp avec des sauts de ligne (%0A) et du gras (*)
    const text = `*NOUVEAU CONTACT - VERITICKET*%0A%0A*Nom:* ${formData.name}%0A*Email:* ${formData.email}%0A*Message:* ${formData.message}`;
    
    // Ton numéro au format international (sans le +)
    const phoneNumber = "237678065506"; 
    
    // Ouverture du lien WhatsApp dans un nouvel onglet
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');
    
    // Optionnel : Vider le formulaire après clic
    setFormData({ name: '', email: '', message: '' });
  };

  // Fonction pour scroller doucement vers le contact
  const scrollToContact = (e) => {
    e.preventDefault();
    document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    // overflow-x-hidden permet le défilement vertical, mais empêche le débordement horizontal
    <div className="relative min-h-screen flex flex-col bg-navy-deep overflow-x-hidden font-sans">
      
      {/* Blobs de dégradés esthétiques (Background) */}
      <div className="fixed top-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-accent/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-5%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-emerald-500/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>

      {/* NAVBAR */}
      <nav className="absolute top-0 left-0 w-full px-4 sm:px-6 md:px-12 py-4 md:py-6 flex justify-between items-center z-50">
        <div className="text-lg sm:text-xl md:text-2xl font-bold tracking-tighter text-white shrink-0">
          Veri<span className="text-indigo-accent">Ticket</span>
        </div>
        
        <div className="shrink-0 ml-4 flex items-center gap-4 sm:gap-6">
          {/* Nouveau Bouton Contact (Scroll) */}
          <a 
            href="#contact-section" 
            onClick={scrollToContact}
            className="text-slate-300 hover:text-white text-xs sm:text-sm md:text-base font-medium transition-colors hidden sm:block"
          >
            Contact
          </a>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 sm:px-5 sm:py-2.5 bg-indigo-accent/20 hover:bg-indigo-accent/40 text-indigo-300 border border-indigo-500/30 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20 whitespace-nowrap">
                Se connecter
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <div className="flex items-center gap-4 hover:scale-105 transition-transform duration-300">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </nav>

      {/* SECTION HÉROS (HAUT) */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 pt-32 md:pt-40 pb-20 max-w-5xl mx-auto text-center min-h-screen">
        
        <h1 className="text-4xl min-[375px]:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight">
          VeriTicket <span className="text-indigo-accent block md:inline">SaaS</span>
        </h1>
        
        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto px-2">
          La plateforme de billetterie sécurisée pour les organisateurs d'élite en Afrique.
        </p>
        
        <div className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-slate-200 text-navy-deep rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 hover:bg-white hover:-translate-y-1 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                Démarrer maintenant
              </button>
            </SignInButton>
            <button onClick={scrollToContact} className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-slate-700 text-white rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 hover:bg-slate-800 hover:-translate-y-1 hover:border-slate-500 hover:shadow-lg">
              Demander une démo
            </button>
          </SignedOut>

          <SignedIn>
            <Link to="/dashboard" className="w-full sm:w-auto block">
              <button className="w-full sm:w-auto px-6 py-3 sm:px-10 sm:py-4 bg-indigo-accent text-white rounded-full font-bold text-sm sm:text-base md:text-xl transition-all duration-300 hover:bg-indigo-500 hover:-translate-y-1 hover:scale-105 shadow-[0_0_20px_rgba(129,140,248,0.3)] hover:shadow-[0_0_40px_rgba(129,140,248,0.6)]">
                Accéder à mon Dashboard <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </Link>
          </SignedIn>
        </div>

        <div className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 text-center sm:text-left border-t border-slate-800/80 pt-10 md:pt-14 w-full">
          <div className="transform transition-all duration-300 hover:-translate-y-2">
            <span className="text-indigo-accent text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">0%</span>
            <p className="text-slate-400 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-medium">Fraude visuelle grâce à la signature HMAC.</p>
          </div>
          <div className="transform transition-all duration-300 hover:-translate-y-2">
            <span className="text-indigo-accent text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">20ms</span>
            <p className="text-slate-400 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-medium">Vitesse de scan ultra-rapide (Dapper).</p>
          </div>
          <div className="transform transition-all duration-300 hover:-translate-y-2">
            <span className="text-indigo-accent text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">LTS</span>
            <p className="text-slate-400 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-medium">Architecture robuste et sécurisée.</p>
          </div>
        </div>
      </div>

      {/* SECTION CONTACT (BAS DE PAGE) */}
      <div id="contact-section" className="relative z-10 w-full bg-slate-900/50 border-t border-slate-800 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Besoin d'une solution sur-mesure ?</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Contactez-nous directement. L'équipe VeriTicket est prête à accompagner votre prochain grand événement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            
            {/* Informations de contact (Gauche) */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <i className="fa-brands fa-whatsapp text-xl"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Ligne Directe (WhatsApp)</p>
                  <p className="text-white text-lg font-medium">+237 678 06 55 06</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-indigo-accent/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-accent group-hover:text-white transition-all duration-300">
                  <i className="fa-solid fa-envelope text-xl"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Email Professionnel</p>
                  <p className="text-white text-lg font-medium">tentchouromeo58@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-slate-700 transition-all duration-300">
                  <i className="fa-solid fa-location-dot text-xl"></i>
                </div>
                <div>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">Localisation</p>
                  <p className="text-white text-lg font-medium">Cameroun</p>
                </div>
              </div>
            </div>

            {/* Formulaire WhatsApp (Droite) */}
            <form onSubmit={handleWhatsAppSubmit} className="bg-slate-800/40 p-6 sm:p-8 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Votre Nom complet</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Paul Atangana" 
                    className="w-full px-4 py-3 bg-navy-deep border border-slate-700 rounded-xl text-white outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email ou Téléphone</label>
                  <input 
                    type="text" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Comment vous recontacter ?" 
                    className="w-full px-4 py-3 bg-navy-deep border border-slate-700 rounded-xl text-white outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Votre Message</label>
                  <textarea 
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Parlez-nous de votre événement (Date, Nombre de billets estimé...)" 
                    className="w-full px-4 py-3 bg-navy-deep border border-slate-700 rounded-xl text-white outline-none transition-all duration-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                  ></textarea>
                </div>

                <button type="submit" className="w-full mt-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 shadow-lg shadow-emerald-600/20">
                  <i className="fa-brands fa-whatsapp text-2xl"></i>
                  Envoyer sur WhatsApp
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;