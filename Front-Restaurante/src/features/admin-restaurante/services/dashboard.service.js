import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3006/kinalGourmetHouse/v1'
});
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
        
            config.headers.Authorization = `Bearer ${token.trim()}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getDashboardSummary = async () => {
    const response = await apiClient.get('/dashboard/summary');
    return response.data;
};