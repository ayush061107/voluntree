import axios from 'axios';

// Dynamically uses an environment variable fallback for production/deployment ease
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://solid-space-funicular-4jvr5rw697x42jj57-8000.app.github.dev/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('voluntree_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
