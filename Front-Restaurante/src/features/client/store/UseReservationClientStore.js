import { create } from "zustand";

import {
    getReservationsRequest,
    createReservationRequest,
    updateReservationRequest,
} from "../../../shared/api/reservations";

export const useReservationClientStore = create((set, get) => ({
    reservations: [],
    loading: false,
    error: null,

    // Modal
    isModalOpen: false,

    openModal: () => set({ isModalOpen: true }),

    closeModal: () => set({ isModalOpen: false }),

    getStatusLabel: (status) => {
        const labels = {
            PENDIENTE: "Pendiente",
            CONFIRMADA: "Confirmada",
            CANCELADA: "Cancelada",
            COMPLETADA: "Completada",
        };

        return labels[status] ?? status;
    },

    getStatusStyle: (status) => {
        const styles = {
            PENDIENTE: "bg-yellow-100 text-yellow-700",
            CONFIRMADA: "bg-green-100 text-green-700",
            CANCELADA: "bg-red-100 text-red-700",
            COMPLETADA: "bg-blue-100 text-blue-700",
        };

        return styles[status] ?? "bg-gray-100 text-gray-600";
    },

    getStatusIcon: (status) => {
        const icons = {
            PENDIENTE: "🕐",
            CONFIRMADA: "✅",
            CANCELADA: "❌",
            COMPLETADA: "🎉",
        };

        return icons[status] ?? "📅";
    },

    // Obtener reservaciones
    fetchReservations: async () => {
        try {
            set({ loading: true, error: null });

            const res = await getReservationsRequest({
                limit: 50,
            });

            const data = res.data?.data ?? [];

            set({
                reservations: data,
                loading: false,
            });

        } catch (err) {
            set({
                error:
                    err.response?.data?.message ||
                    "Error al cargar reservaciones",
                loading: false,
            });
        }
    },

    // Crear reservación
    createReservation: async (payload) => {
        try {
            set({ loading: true, error: null });

            await createReservationRequest(payload);

            await get().fetchReservations();

            set({
                loading: false,
                isModalOpen: false,
            });

        } catch (err) {
            set({
                error:
                    err.response?.data?.message ||
                    "Error al crear reservación",
                loading: false,
            });

            throw err;
        }
    },

    // Cancelar reservación
    cancelReservation: async (id) => {
        try {
            set({ loading: true, error: null });

            await updateReservationRequest(id, {
                status: "CANCELADA",
            });

            set((state) => ({
                reservations: state.reservations.map((r) =>
                    r._id === id
                        ? { ...r, status: "CANCELADA" }
                        : r
                ),

                loading: false,
            }));

        } catch (err) {
            set({
                error:
                    err.response?.data?.message ||
                    "Error al cancelar reservación",
                loading: false,
            });

            throw err;
        }
    },

    clearError: () => set({ error: null }),
}));