import { axiosPlatillos } from "./api";

// Obtener todos (con filtros opcionales como page, status, etc)
export const getEventsRequest = (params) => 
    axiosPlatillos.get("/kinalGourmetHouse/v1/events/", { params });

export const getEventByIdRequest = (id) => 
    axiosPlatillos.get(`/kinalGourmetHouse/v1/events/${id}`);

export const getEventsByRestaurantRequest = (restaurantId) => 
    axiosPlatillos.get(`/kinalGourmetHouse/v1/events/restaurant/${restaurantId}`);

export const createEventRequest = (data) => 
    axiosPlatillos.post("/kinalGourmetHouse/v1/events/create", data);

export const updateEventRequest = (id, data) => 
    axiosPlatillos.put(`/kinalGourmetHouse/v1/events/${id}`, data);

export const updateEventStatusRequest = (id, status) => 
    axiosPlatillos.patch(`/kinalGourmetHouse/v1/events/${id}/status`, { status });

export const cancelEventRequest = (id) => 
    axiosPlatillos.patch(`/kinalGourmetHouse/v1/events/${id}/cancel`);

export const deleteEventRequest = (id) => 
    axiosPlatillos.delete(`/kinalGourmetHouse/v1/events/${id}`);