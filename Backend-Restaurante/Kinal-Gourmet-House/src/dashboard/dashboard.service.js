import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3006/kinalGourmetHouse/v1'
});

export const getDashboardSummary = async () => {

    const response = await apiClient.get('/dashboard/summary');

    return response.data;
};