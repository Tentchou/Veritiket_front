import axios from 'axios';

// On pointe vers l'URL de notre API .NET locale
const axiosClient = axios.create({
  baseURL: 'http://localhost:5109/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;