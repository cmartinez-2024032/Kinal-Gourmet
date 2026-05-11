import axios from 'axios';

const createInstance = (url) => {
    const instance = axios.create({
        baseURL: url
    });

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return instance;
};

// Autenticación
export const axiosAuth = createInstance('http://localhost:3005/api');

// Única instancia para todo lo demás (Restaurantes, Platillos, Eventos)
export const axiosRestaurante = createInstance('http://localhost:3006');