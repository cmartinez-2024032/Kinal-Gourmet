import { create } from "zustand";
import {
    getCouponsRequest,
    createCouponRequest,
    updateCouponRequest,
    deleteCouponRequest,
} from "../../../shared/api/cupones";

export const useCuponStore = create((set, get) => ({
    coupons:        [],
    selectedCoupon: null,
    isModalOpen:    false,
    searchTerm:     "",
    filterType:     "Todos",
    loading:        false,
    error:          null,

    // ── Filtros
    getFilteredCoupons: () => {
        const { coupons, searchTerm, filterType } = get();
        return coupons.filter((c) => {
            const matchSearch =
                c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchType =
                filterType === "Todos" || c.discountType === filterType;
            return matchSearch && matchType;
        });
    },

    // ── Modal
    openCreateModal: () => set({ isModalOpen: true, selectedCoupon: null }),
    openEditModal:   (coupon) => set({ isModalOpen: true, selectedCoupon: coupon }),
    closeModal:      () => set({ isModalOpen: false, selectedCoupon: null }),

    // ── CRUD 
    getCoupons: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getCouponsRequest();
            const coupons = response.data?.data ?? response.data ?? [];
            set({ coupons, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener cupones",
                loading: false,
            });
        }
    },

    createCoupon: async (payload) => {
        try {
            set({ loading: true, error: null });
            await createCouponRequest(payload);
            await get().getCoupons();
            set({ loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al crear el cupón.",
                loading: false,
            });
            throw error;
        }
    },

    updateCoupon: async (id, payload) => {
        try {
            set({ loading: true, error: null });
            await updateCouponRequest(id, payload);
            await get().getCoupons();
            set({ loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al actualizar el cupón.",
                loading: false,
            });
            throw error;
        }
    },

    deleteCoupon: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteCouponRequest(id);
            await get().getCoupons();
            set({ loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al eliminar el cupón.",
                loading: false,
            });
        }
    },

    setSearchTerm:  (term)  => set({ searchTerm: term }),
    setFilterType:  (type)  => set({ filterType: type }),
    clearError:     ()      => set({ error: null }),
}));