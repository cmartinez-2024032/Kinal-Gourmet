import { create } from "zustand";
import {
    getPromotionsRequest,
    createPromotionRequest,
    updatePromotionRequest,
    deletePromotionRequest,
} from "../../../shared/api/promotions";

export const usePromotionStore = create((set, get) => ({
    promotions:     [],
    selectedPromo:  null,
    isModalOpen:    false,
    searchTerm:     "",
    loading:        false,
    error:          null,

    getFilteredPromotions: () => {
        const { promotions, searchTerm } = get();

        if (!Array.isArray(promotions)) return [];

        return promotions.filter((p) =>
            p.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    },

    openCreateModal: () => set({ isModalOpen: true, selectedPromo: null }),
    openEditModal:   (promo) => set({ isModalOpen: true, selectedPromo: promo }),
    closeModal:      () => set({ isModalOpen: false, selectedPromo: null }),

    getPromotions: async () => {
        try {
            set({ loading: true, error: null });

            const response = await getPromotionsRequest();

            const raw = response.data?.data ?? response.data ?? [];

            const promotions = Array.isArray(raw)
                ? raw
                : raw.promotions || [];

            set({ promotions, loading: false });

        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener promociones",
                loading: false,
            });
        }
    },

    createPromotion: async (payload) => {
        try {
            set({ loading: true, error: null });
            await createPromotionRequest(payload);
            await get().getPromotions();
            set({ loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al crear promoción",
                loading: false,
            });
            throw error;
        }
    },

    updatePromotion: async (id, payload) => {
        try {
            set({ loading: true, error: null });
            await updatePromotionRequest(id, payload);
            await get().getPromotions();
            set({ loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al actualizar promoción",
                loading: false,
            });
            throw error;
        }
    },

    deletePromotion: async (id) => {
        try {
            set({ loading: true, error: null });
            await deletePromotionRequest(id);
            await get().getPromotions();
            set({ loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al eliminar promoción",
                loading: false,
            });
        }
    },

    setSearchTerm: (term) => set({ searchTerm: term }),
    clearError:    ()     => set({ error: null }),
}));