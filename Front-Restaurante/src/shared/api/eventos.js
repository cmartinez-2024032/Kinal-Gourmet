import { axiosRestaurante } from "./api";

// Obtener todos (con filtros opcionales como page, status, etc)
export const getEventsRequest = (params) => 
    axiosRestaurante.get("/kinalGourmetHouse/v1/events/", { params });

export const getEventByIdRequest = (id) => 
    axiosRestaurante.get(`/kinalGourmetHouse/v1/events/${id}`);

export const getEventsByRestaurantRequest = (restaurantId) => 
    axiosRestaurante.get(`/kinalGourmetHouse/v1/events/restaurant/${restaurantId}`);

export const createEventRequest = (data) => 
    axiosRestaurante.post("/kinalGourmetHouse/v1/events/create", data);

export const updateEventRequest = (id, data) => 
    axiosRestaurante.put(`/kinalGourmetHouse/v1/events/${id}`, data);

export const updateEventStatusRequest = (id, status) => 
    axiosRestaurante.patch(`/kinalGourmetHouse/v1/events/${id}/status`, { status });

export const cancelEventRequest = (id) => 
    axiosRestaurante.patch(`/kinalGourmetHouse/v1/events/${id}/cancel`);

export const deleteEventRequest = (id) => 
    axiosRestaurante.delete(`/kinalGourmetHouse/v1/events/${id}`);