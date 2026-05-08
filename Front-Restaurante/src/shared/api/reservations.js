import api from "./api";

// Obtener reservaciones
export const getReservationsRequest = (params) =>
    api.get("/reservations", { params });

// Crear reservación
export const createReservationRequest = (data) =>
    api.post("/reservations/create", data);

// Actualizar reservación
export const updateReservationRequest = (id, data) =>
    api.put(`/reservations/${id}`, data);

// Obtener reservación por ID
export const getReservationByIdRequest = (id) =>
    api.get(`/reservations/${id}`);

// Eliminar reservación
export const deleteReservationRequest = (id) =>
    api.delete(`/reservations/${id}`);