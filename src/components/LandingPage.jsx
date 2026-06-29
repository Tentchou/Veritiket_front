
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-navy-deep overflow-hidden">
      
      {/* Blobs de dégradés esthétiques (Arrière-plan) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* NAVBAR : Fine, discrète et élégante */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <div className="text-2xl font-bold tracking-tighter text-white">
          Veri<span className="text-indigo-accent">Ticket</span>
        </div>
        
        {/* Actions de la Navbar (Petits boutons de connexion/profil) */}
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-6 py-2 bg-indigo-accent/20 hover:bg-indigo-accent/40 text-indigo-300 border border-indigo-500/30 rounded-full font-medium transition-all">
                Se connecter
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </nav>

      {/* CONTENU CENTRAL : Le message fort et les Call-to-Action (Gros boutons) */}
      <div className="relative z-10 text-center px-4 max-w-4xl mt-10">
        <h1 className="text-7xl md:text-8xl font-bold text-white leading-none tracking-tight">
          VeriTicket <span className="text-indigo-accent block md:inline">SaaS</span>
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto">
          La plateforme de billetterie sécurisée pour les organisateurs d'élite en Afrique.
        </p>
        
        {/* LA ZONE DES GROS BOUTONS D'ACTION (En forme de pilule) */}
        <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center items-center">
          
          {/* SI NON CONNECTÉ : On propose l'inscription ou la démo */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-8 py-4 bg-slate-200 text-navy-deep rounded-full font-bold text-lg hover:bg-slate-300 transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                Démarrer maintenant
              </button>
            </SignInButton>
            <button className="px-8 py-4 bg-transparent border-2 border-slate-700 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              Voir la démo
            </button>
          </SignedOut>

          {/* SI CONNECTÉ : On affiche un gros bouton vers le Dashboard */}
          <SignedIn>
            <Link to="/dashboard">
              <button className="px-10 py-4 bg-indigo-accent text-white rounded-full font-bold text-xl hover:bg-indigo-600 transition-transform active:scale-95 shadow-[0_0_40px_rgba(129,140,248,0.4)]">
                Accéder à mon Dashboard <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
            </Link>
          </SignedIn>
        </div>

        {/* STATISTIQUES ET PREUVES DE CONFIANCE */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-slate-800 pt-10">
          <div>
            <span className="text-indigo-accent text-3xl font-bold">0%</span>
            <p className="text-slate-400 mt-1">Fraude visuelle grâce à la signature HMAC.</p>
          </div>
          <div>
            <span className="text-indigo-accent text-3xl font-bold">20ms</span>
            <p className="text-slate-400 mt-1">Vitesse de scan ultra-rapide (Dapper).</p>
          </div>
          <div>
            <span className="text-indigo-accent text-3xl font-bold">LTS</span>
            <p className="text-slate-400 mt-1">Architecture robuste et sécurisée.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;