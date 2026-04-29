import { create } from "zustand";
import {
    getTablesRequest,
    createTableRequest,
    updateTableRequest,
    deleteTableRequest
} from "../../../shared/api/mesas";

export const useMesaStore = create((set, get) => ({
    tables: [],
    selectedTable: null,
    isModalOpen: false,
    searchTerm: "",
    filterStatus: "Todas",
    filterLocation: "Todas",
    loading: false,
    error: null,

    getFilteredTables: () => {
        const { tables, searchTerm, filterStatus, filterLocation } = get();
        return tables.filter((t) => {
            const matchSearch = t.number.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = filterStatus === "Todas" || t.status === filterStatus;
            const matchLocation = filterLocation === "Todas" || t.location === filterLocation;
            return matchSearch && matchStatus && matchLocation;
        });
    },

    getStatuses: () => ["Todas", "AVAILABLE", "OCCUPIED", "RESERVED", "MAINTENANCE"],
    getLocations: () => ["Todas", "INTERIOR", "TERRAZA", "VIP", "BAR", "PRIVADO"],

    openCreateModal: () => set({ isModalOpen: true, selectedTable: null }),
    openEditModal:   (table) => set({ isModalOpen: true, selectedTable: table }),
    closeModal:      () => set({ isModalOpen: false, selectedTable: null }),

    getTables: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getTablesRequest();
            const tables = response.data?.data ?? response.data ?? [];
            set({ tables, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener las mesas",
                loading: false,
            });
        }
    },

    createTable: async (payload) => {
        try {
            set({ loading: true, error: null });
            await createTableRequest(payload);
            await get().getTables();
            set({ loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al crear la mesa.",
                loading: false
            });
            throw error;
        }
    },

    updateTable: async (id, payload) => {
        try {
            set({ loading: true, error: null });
            await updateTableRequest(id, payload);
            await get().getTables();
            set({ loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al actualizar la mesa.",
                loading: false
            });
            throw error;
        }
    },

    deleteTable: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteTableRequest(id);
            await get().getTables();
            set({ loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al eliminar la mesa.",
                loading: false
            });
            throw error;
        }
    },

    setSearchTerm:     (term)     => set({ searchTerm: term }),
    setFilterStatus:   (status)   => set({ filterStatus: status }),
    setFilterLocation: (location) => set({ filterLocation: location }),
    clearError:        ()         => set({ error: null }),
}));