
import axios from 'axios';

// For production we'll use a real API base URL, for development we can use mockups
// This should be replaced with your actual MongoDB API endpoint in production
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.arc-admin.demo'  // Replace with your production MongoDB API
  : 'http://localhost:5000/api';  // Assuming local MongoDB server runs on port 5000

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// For development fallback when MongoDB is not available
export const useMockData = process.env.NODE_ENV !== 'production';

export default apiClient;
