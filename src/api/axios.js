import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('AXIOS ERROR:', error);
        console.error('STATUS:', error.response?.status);
        console.error('DATA:', error.response?.data);
        console.error('URL:', error.config?.url);
        console.error('BASE URL:', error.config?.baseURL);

        return Promise.reject(error);
    }
);

export default api;