import axiosClient from '../axiosClient';

export const TicketService = {
  // Récupère les billets d'un événement spécifique
  getTicketsByEvent: async (eventId, pageNumber = 1, pageSize = 2) => {
    const response = await axiosClient.get(`/tickets/event/${eventId}`, {
      params: { pageNumber, pageSize }
    });
    return response.data; // Retourne { items, totalCount, pageNumber, pageSize, totalPages }
  },
  // Appel à ton contrôleur .NET GenerateTickets
  generateTickets: async (payload) => {
    const response = await axiosClient.post('/tickets/generate', payload);
    return response.data; // Retourne le message de succès ("X tickets générés...")
  },
  // Assigner un billet
  distributeTicket: async (ticketId, distributedTo) => {
    const response = await axiosClient.patch(`/tickets/${ticketId}/distribute`, { distributedTo });
    return response.data;
  },
  // Ajoute ceci dans TicketService :
  exportTicketsToCSV: async (eventId) => {
    // responseType: 'blob' est VITAL pour télécharger un fichier binaire/texte depuis le backend
    const response = await axiosClient.get(`/tickets/event/${eventId}/export`, {
      responseType: 'blob'
    });
    return response.data;
  }
};