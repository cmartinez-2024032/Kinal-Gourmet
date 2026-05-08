import { create } from "zustand";
import {
  getReservationsRequest,
  createReservationRequest,
  updateReservationRequest,
  deleteReservationRequest,
} from "../../../shared/api/reservations";

export const useReservationStore = create((set, get) => ({ 
  reservations: [],
  loading: false,
  error: null,

  getReservations: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getReservationsRequest();
      set({
        reservations:
          res.data.reservations ||
          res.data.data ||
          res.data ||
          [],
      });
    } catch (error) {
      console.error("Error al obtener reservaciones:", error);
      set({ error: "No se pudieron cargar las reservaciones." });
    } finally {
      set({ loading: false });
    }
  },

  createReservation: async (data) => {
    set({ loading: true, error: null });
    try {
      await createReservationRequest(data);
      await get().getReservations(); 
    } catch (error) {
      console.error("Error al crear reservación:", error);
      set({ error: "No se pudo crear la reservación." });
    } finally {
      set({ loading: false });
    }
  },

  updateReservation: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await updateReservationRequest(id, data);
      await get().getReservations(); 
    } catch (error) {
      console.error("Error al actualizar reservación:", error);
      set({ error: "No se pudo actualizar la reservación." });
    } finally {
      set({ loading: false });
    }
  },

  confirmReservation: async (id) => {
    set({ loading: true, error: null });

    try {
      await updateReservationRequest(id, {
        status: "CONFIRMADA",
      });

      await get().getReservations();
    } catch (error) {
      set({ error: "No se pudo confirmar la reservación." });
    } finally {
      set({ loading: false });
    }
  },

  deleteReservation: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteReservationRequest(id);
      set((state) => ({
        reservations: state.reservations.filter((r) => r._id !== id),
      }));
    } catch (error) {
      console.error("Error al eliminar reservación:", error);
      set({ error: "No se pudo eliminar la reservación." });
    } finally {
      set({ loading: false });
    }
  },
}));