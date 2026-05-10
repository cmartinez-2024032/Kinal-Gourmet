import { create } from "zustand";
import { 
    getEventsRequest, 
    createEventRequest, 
    updateEventRequest, 
    deleteEventRequest,
    cancelEventRequest,
    updateEventStatusRequest
} from "../../../shared/api/eventos.js";

export const useEventStore = create((set, get) => ({
    // --- ESTADO ---
    events: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 10
    },
    selectedEvent: null, // Para saber si estamos editando
    isModalOpen: false,
    loading: false,
    error: null,

    // Filtros de búsqueda (basados en tus query params del backend)
    filters: {
        page: 1,
        limit: 10,
        status: "",
        upcoming: false,
        past: false
    },

    // --- ACCIONES DE UI ---
    openCreateModal: () => set({ 
        isModalOpen: true, 
        selectedEvent: null,
        error: null 
    }),

    openEditModal: (event) => set({ 
        isModalOpen: true, 
        selectedEvent: event,
        error: null 
    }),

    closeModal: () => set({ 
        isModalOpen: false, 
        selectedEvent: null 
    }),

    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters, page: 1 } // Reset a pág 1 al filtrar
    })),

    // --- PETICIONES AL BACKEND ---

    // Obtener eventos con filtros y paginación
    getEvents: async () => {
        const { filters } = get();
        try {
            set({ loading: true, error: null });
            const response = await getEventsRequest(filters);
            
            // Tu backend devuelve { success, data, pagination }
            set({ 
                events: response.data.data, 
                pagination: response.data.pagination,
                loading: false 
            });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error al obtener eventos", 
                loading: false 
            });
        }
    },

    // Crear un nuevo evento
    createEvent: async (payload) => {
        try {
            set({ loading: true, error: null });
            await createEventRequest(payload);
            await get().getEvents(); // Recargar lista
            set({ loading: false });
        } catch (error) {
            const msg = error.response?.data?.message || "Error al crear el evento";
            set({ error: msg, loading: false });
            throw error; // Re-lanzamos para que el componente maneje el error si es necesario
        }
    },

    // Actualizar evento existente
    updateEvent: async (id, payload) => {
        try {
            set({ loading: true, error: null });
            await updateEventRequest(id, payload);
            await get().getEvents();
            set({ loading: false });
        } catch (error) {
            set({ 
                error: error.response?.data?.message || "Error al actualizar", 
                loading: false 
            });
            throw error;
        }
    },

    // Cambiar estado (PROGRAMADO, EN_CURSO, etc)
    updateStatus: async (id, status) => {
        try {
            set({ loading: true });
            await updateEventStatusRequest(id, status);
            await get().getEvents();
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message, loading: false });
        }
    },

    // Cancelar evento (Patch /cancel en tu route)
    cancelEvent: async (id) => {
        try {
            set({ loading: true });
            await cancelEventRequest(id);
            await get().getEvents();
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message, loading: false });
        }
    },

    // Eliminar permanentemente
    deleteEvent: async (id) => {
        try {
            set({ loading: true });
            await deleteEventRequest(id);
            await get().getEvents();
            set({ loading: false });
        } catch (error) {
            set({ error: error.response?.data?.message, loading: false });
            throw error;
        }
    },

    clearError: () => set({ error: null })
}));