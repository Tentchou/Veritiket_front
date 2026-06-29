import axiosClient from '../axiosClient';

export const EventService = {
  
  // Méthode pour récupérer les statistiques d'un événement
  getEventStats: async (eventId) => {
    // Plus besoin de gérer le header Authorization, l'intercepteur s'en occupe !
    const response = await axiosClient.get(`/events/${eventId}/stats`);
    return response.data;
  },
  // NOUVEAU : Récupération de la liste paginée et filtrée
  getEvents: async (search = '', pageNumber = 1, pageSize = 10) => {
    const params = {
      pageNumber,
      pageSize,
      ...(search && { search }) // N'ajoute le paramètre 'search' que s'il n'est pas vide
    };
    
    const response = await axiosClient.get('/events', { params });
    return response.data; // Retourne { items, totalCount, pageNumber, pageSize, totalPages }
  },
  // NOUVEAU : Création de l'événement
  createEvent: async (eventData) => {
    const response = await axiosClient.post('/events', eventData);
    return response.data; // Retourne l'EventId créé
  },
  
  // On préparera les autres méthodes ici plus tard...
  // getEvents: async (page, size) => { ... }
  // createEvent: async (data) => { ... }
};