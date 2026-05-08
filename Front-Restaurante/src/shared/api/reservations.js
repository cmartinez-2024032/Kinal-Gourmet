import { axiosRestaurantAdmin } from "./api";

export const getReservationsRequest = (params) =>
    axiosRestaurantAdmin.get("/kinalGourmetHouse/v1/reservations/", { params });

export const createReservationRequest = (data) =>
    axiosRestaurantAdmin.post("/kinalGourmetHouse/v1/reservations/create", data);

export const updateReservationRequest = (id, data) =>
    axiosRestaurantAdmin.put(`/kinalGourmetHouse/v1/reservations/${id}`, data);

export const getReservationByIdRequest = (id) =>
    axiosRestaurantAdmin.get(`/kinalGourmetHouse/v1/reservations/${id}`);

export const deleteReservationRequest = (id) =>
    axiosRestaurantAdmin.delete(`/kinalGourmetHouse/v1/reservations/${id}`);