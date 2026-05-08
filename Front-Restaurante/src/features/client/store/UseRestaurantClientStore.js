import { create } from "zustand";
import { getRestaurantsRequest } from "../../../shared/api/restaurants.js"; 

export const useRestaurantClientStore = create((set, get) => ({
    restaurants: [],
    loading: false,
    error: null,

    searchTerm: "",
    filterCategory: "Todas",
    filterFeature: null,

    getFiltered: () => {
        const { restaurants, searchTerm, filterCategory, filterFeature } = get();
        const items = Array.isArray(restaurants) ? restaurants : [];
        
        return items.filter((r) => {
            const matchSearch =
                r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.address?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchCategory =
                filterCategory === "Todas" || r.category === filterCategory;

            const matchFeature =
                !filterFeature || r.features?.[filterFeature] === true;

            return matchSearch && matchCategory && matchFeature;
        });
    },

    getCategories: () => {
        const { restaurants } = get();
        const items = Array.isArray(restaurants) ? restaurants : [];
        const cats = [...new Set(items.map((r) => r.category).filter(Boolean))];
        return ["Todas", ...cats];
    },

    getCategoryLabel: (cat) => {
        if (cat === "Todas") return "🍽 Todas";
        return cat?.replace("_", " ") ?? cat;
    },

    fetchRestaurants: async () => {
        try {
            set({ loading: true, error: null });
            const res = await getRestaurantsRequest();
            const data = res.data?.data ?? [];  // ✅ único cambio
            set({ restaurants: Array.isArray(data) ? data : [], loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.message || "Error al cargar restaurantes",
                loading: false,
            });
        }
    },

    setSearchTerm:     (term)    => set({ searchTerm: term }),
    setFilterCategory: (cat)     => set({ filterCategory: cat }),
    setFilterFeature:  (feature) => set({ filterFeature: feature }),
    clearFilters: () => set({ searchTerm: "", filterCategory: "Todas", filterFeature: null }),
    clearError:   () => set({ error: null }),
}));