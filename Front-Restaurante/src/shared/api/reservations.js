import { axiosRestaurante } from "./api";

export const getReservationsRequest = (params) =>
    axiosRestaurante.get("/kinalGourmetHouse/v1/reservations/", { params });

export const createReservationRequest = (data) =>
    axiosRestaurante.post("/kinalGourmetHouse/v1/reservations/create", data);

export const updateReservationRequest = (id, data) =>
    axiosRestaurante.put(`/kinalGourmetHouse/v1/reservations/${id}`, data);

export const getReservationByIdRequest = (id) =>
    axiosRestaurante.get(`/kinalGourmetHouse/v1/reservations/${id}`);

export const deleteReservationRequest = (id) =>
    axiosRestaurante.delete(`/kinalGourmetHouse/v1/reservations/${id}`);

export const updateReservationStatusRequest = (id, status) =>
    axiosRestaurante.patch(`/kinalGourmetHouse/v1/reservations/${id}/status`,{ status });