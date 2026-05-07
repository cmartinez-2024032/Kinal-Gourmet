import { create } from "zustand";
import api from "../../../shared/api/api";

export const useRestaurantClientStore = create((set, get) => ({
    restaurants: [],
    loading: false,
    error: null,

    // Filtros
    searchTerm: "",
    filterCategory: "Todas",
    filterFeature: null,

    // Categorías disponibles para filtrar
    getCategories: () => [
        "Todas",
        "GOURMET", "CASUAL", "CAFETERIA", "FAST_FOOD",
        "BAR", "PIZZERIA", "ITALIANA", "MEXICANA",
        "ASIATICA", "MARISCOS", "PARRILLADA", "VEGETARIANA",
        "POSTRES", "OTRO"
    ],

    getCategoryLabel: (cat) => {
        const labels = {
            Todas:       "Todas",
            GOURMET:     "Gourmet",
            CASUAL:      "Casual",
            CAFETERIA:   "Cafetería",
            FAST_FOOD:   "Rápida",
            BAR:         "Bar",
            PIZZERIA:    "Pizzería",
            ITALIANA:    "Italiana",
            MEXICANA:    "Mexicana",
            ASIATICA:    "Asiática",
            MARISCOS:    "Mariscos",
            PARRILLADA:  "Parrillada",
            VEGETARIANA: "Vegetariana",
            POSTRES:     "Postres",
            OTRO:        "Otro",
        };
        return labels[cat] ?? cat;
    },

    // Restaurantes filtrados localmente
    getFiltered: () => {
        const { restaurants, searchTerm, filterCategory, filterFeature } = get();
        return restaurants.filter((r) => {
            const matchSearch =
                r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.address?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchCategory =
                filterCategory === "Todas" || r.category === filterCategory;

            const matchFeature =
                !filterFeature || r.features?.[filterFeature] === true;

            return matchSearch && matchCategory && matchFeature;
        });
    },

    // Cargar restaurantes activos
    fetchRestaurants: async () => {
        try {
            set({ loading: true, error: null });
            const res = await api.get("/restaurants", { params: { status: "ACTIVE", limit: 100 } });
            const data = res.data?.data ?? res.data ?? [];
            set({ restaurants: data, loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.message || "Error al cargar restaurantes",
                loading: false,
            });
        }
    },

    // Setters de filtros
    setSearchTerm:     (term)    => set({ searchTerm: term }),
    setFilterCategory: (cat)     => set({ filterCategory: cat }),
    setFilterFeature:  (feature) => set({ filterFeature: feature }),
    clearFilters: () => set({ searchTerm: "", filterCategory: "Todas", filterFeature: null }),
    clearError:   () => set({ error: null }),
}));