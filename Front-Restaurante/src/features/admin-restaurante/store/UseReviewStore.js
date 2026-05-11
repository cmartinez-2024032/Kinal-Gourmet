import { create } from "zustand";
import {
    getReviewsByRestaurantRequest,
    createReviewRequest,
    updateReviewRequest,
    deleteReviewRequest,
} from "../../../shared/api/reviews.js";

export const useReviewStore = create((set, get) => ({
    reviews: [],
    pagination: null,
    loading: false,
    submitting: false,
    error: null,

    fetchReviews: async (restaurantId, page = 1) => {
        try {
            set({ loading: true, error: null });
            const res = await getReviewsByRestaurantRequest(restaurantId, page);
            const { data, pagination } = res.data;
            set({ reviews: data ?? [], pagination: pagination ?? null, loading: false });
        } catch (err) {
            set({
                error: err.response?.data?.message || "Error al cargar reseñas",
                loading: false,
            });
        }
    },

    createReview: async (restaurantId, { rating, comment }) => {
        try {
            set({ submitting: true, error: null });
            const res = await createReviewRequest({ restaurant: restaurantId, rating, comment });
            const newReview = res.data.data;
            set((state) => ({
                reviews: [newReview, ...state.reviews],
                submitting: false,
            }));
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al crear reseña";
            set({ error: msg, submitting: false });
            return { success: false, message: msg };
        }
    },

    updateReview: async (reviewId, { rating, comment }) => {
        try {
            set({ submitting: true, error: null });
            const res = await updateReviewRequest(reviewId, { rating, comment });
            const updated = res.data.data;
            set((state) => ({
                reviews: state.reviews.map((r) => (r._id === reviewId ? updated : r)),
                submitting: false,
            }));
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al actualizar reseña";
            set({ error: msg, submitting: false });
            return { success: false, message: msg };
        }
    },

    deleteReview: async (reviewId) => {
        try {
            await deleteReviewRequest(reviewId);
            set((state) => ({
                reviews: state.reviews.filter((r) => r._id !== reviewId),
            }));
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || "Error al eliminar reseña";
            set({ error: msg });
            return { success: false, message: msg };
        }
    },

    clearError: () => set({ error: null }),
}));