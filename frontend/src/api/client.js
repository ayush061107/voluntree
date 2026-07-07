import axios from 'axios';

// Create a configured axios instance targeting our FastAPI port
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Automatically inject the auth token if it exists
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('voluntree_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;