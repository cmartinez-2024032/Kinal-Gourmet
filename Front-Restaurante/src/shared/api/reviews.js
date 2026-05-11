import { axiosRestaurante } from "./api";

export const getReviewsByRestaurantRequest = (restaurantId, page = 1, limit = 10) =>
    axiosRestaurante.get(`/kinalGourmetHouse/v1/reviews/`, {
        params: { restaurant: restaurantId, page, limit }
    });

export const createReviewRequest = (data) =>
    axiosRestaurante.post(`/kinalGourmetHouse/v1/reviews/create`, data);

export const updateReviewRequest = (id, data) =>
    axiosRestaurante.put(`/kinalGourmetHouse/v1/reviews/${id}`, data);

export const deleteReviewRequest = (id) =>
    axiosRestaurante.delete(`/kinalGourmetHouse/v1/reviews/${id}`);