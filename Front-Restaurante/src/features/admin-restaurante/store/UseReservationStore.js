import { create } from "zustand";
import {
  getReservationsRequest,
  createReservationRequest,
  updateReservationRequest,
  updateReservationStatusRequest,
  deleteReservationRequest,
} from "../../../shared/api/reservations";

export const useReservationStore = create((set, get) => ({
  reservations: [],
  loading: false,
  error: null,

  getReservations: async (params) => {
    set({ loading: true, error: null });

    try {
      const res = await getReservationsRequest(params);

      const data =
        res.data?.data ??
        res.data?.reservations ??
        res.data ??
        [];

      set({
        reservations: Array.isArray(data) ? data : [],
      });

    } catch (error) {

      console.error("Error al obtener reservaciones:", error);

      set({
        error: "No se pudieron cargar las reservaciones.",
      });

    } finally {

      set({ loading: false });

    }
  },

  updateReservation: async (id, data) => {
    set({ loading: true, error: null });

    try {

      await updateReservationRequest(id, data);

      await get().getReservations();

      return { success: true };

    } catch (error) {

      const msg =
        error?.response?.data?.message ||
        "No se pudo actualizar la reservación.";

      console.error("Error al actualizar reservación:", error);

      set({ error: msg });

      return {
        success: false,
        message: msg,
      };

    } finally {

      set({ loading: false });

    }
  },

  updateReservationStatus: async (id, status) => {
    set({ loading: true, error: null });

    try {

      await updateReservationStatusRequest(id, status);

      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === id
            ? { ...r, status }
            : r
        ),
      }));

      return { success: true };

    } catch (error) {

      console.log("ERROR COMPLETO:", error);

      console.log("RESPONSE:", error.response);

      console.log("DATA:", error.response?.data);

      console.log("MESSAGE:", error.response?.data?.message);

      const msg =
        error?.response?.data?.message ||
        "No se pudo actualizar el estado.";

      console.error("Error al actualizar estado:", error);

      set({ error: msg });

      return {
        success: false,
        message: msg,
      };

    } finally {

      set({ loading: false });

    }
  },

  confirmReservation: async (id) =>
    get().updateReservationStatus(id, "CONFIRMADA"),

  cancelReservation: async (id) =>
    get().updateReservationStatus(id, "CANCELADA"),

  deleteReservation: async (id) => {
    set({ loading: true, error: null });

    try {

      await deleteReservationRequest(id);

      set((state) => ({
        reservations: state.reservations.filter(
          (r) => r._id !== id
        ),
      }));

      return { success: true };

    } catch (error) {

      const msg =
        error?.response?.data?.message ||
        "No se pudo eliminar la reservación.";

      console.error("Error al eliminar reservación:", error);

      set({ error: msg });

      return {
        success: false,
        message: msg,
      };

    } finally {

      set({ loading: false });

    }
  },
}));