import axiosClient from './axiosClient';

export const setupAxiosInterceptors = (getToken) => {
  // On nettoie les intercepteurs précédents pour éviter les doublons au rechargement
  axiosClient.interceptors.request.clear();
  
  axiosClient.interceptors.request.use(
    async (config) => {
      // On récupère le JWT frais via Clerk avant chaque requête
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};