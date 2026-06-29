
import axios from 'axios';

const axiosClient = axios.create({
  // Si VITE_API_URL existe (en prod), il l'utilise. Sinon, il prend le localhost (en dev).
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ... (le reste de ton code pour injecter le token Clerk si tu l'as configuré)
export default axiosClient;