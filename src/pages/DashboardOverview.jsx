import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // <-- Ajout de useSearchParams
import { toast } from 'sonner';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import { EventService } from '../api/services/EventService';
import { StatCardSkeleton } from '../components/Skeletons';

const DashboardOverview = () => {
  const [searchParams] = useSearchParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Récupération dynamique de l'ID depuis l'URL (?eventId=...)
  const eventId = searchParams.get('eventId');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let targetEventId = eventId;

        // Si aucun ID n'est présent dans l'URL, on cherche le premier événement de l'utilisateur
        if (!targetEventId) {
          const eventsData = await EventService.getEvents('', 1, 1);
          if (eventsData && eventsData.items && eventsData.items.length > 0) {
            targetEventId = eventsData.items[0].id;
          }
        }

        // Si on a un ID valide (soit de l'URL, soit le premier de la liste), on charge les stats
        if (targetEventId) {
          const data = await EventService.getEventStats(targetEventId);
          setStats(data);
        } else {
          setStats(null); // Aucun événement créé pour le moment
        }
      } catch (error) {
        console.error("Erreur API : Impossible de charger le dashboard", error);
        toast.error("Impossible de récupérer les données en temps réel.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [eventId]); // Le useEffect se relance automatiquement si l'ID dans l'URL change !

  return (
    <DashboardLayout>
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {stats ? stats.eventName : "Tableau de bord"}
          </h1>
          <p className="text-slate-500 font-medium">
            {stats ? "Statistiques de votre événement en direct." : "Créez un événement pour voir vos performances."}
          </p>
        </div>
        {stats && (
          <Link to="/dashboard/events" className="px-4 py-2 bg-slate-800 border border-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all no-underline">
            <i className="fa-solid fa-arrow-left mr-2"></i> Changer d'événement
          </Link>
        )}
      </div>
      
      {loading ? (
        /* L'effet Skeleton remplace le spinner ! On affiche 3 fausses cartes */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Billets Générés" 
            value={stats.totalTicketsGenerated} 
            icon="fa-solid fa-ticket"
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white border-none"
          />
          <StatCard 
            title="Billets Scannés" 
            value={stats.totalTicketsScanned} 
            icon="fa-solid fa-qrcode"
            trend={`${stats.attendancePercentage}%`}
            trendLabel="Taux de remplissage"
          />
          <StatCard 
            title="Revenus Réalisés" 
            value={stats.totalRevenueRealized.toLocaleString('fr-FR')} 
            suffix="FCFA"
            icon="fa-solid fa-wallet"
            trendLabel={`Estimé total : ${stats.totalRevenueEstimated.toLocaleString('fr-FR')} FCFA`}
          />
        </div>
      ) : (
        <div className="p-10 border-2 border-dashed border-slate-700/60 rounded-3xl text-center text-slate-500">
          <i className="fa-solid fa-calendar-xmark text-4xl mb-3 text-slate-600 block"></i>
          Aucun événement disponible pour générer des statistiques.
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardOverview;