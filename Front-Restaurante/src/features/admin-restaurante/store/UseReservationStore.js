import { create } from "zustand";
import {
  getReservationsRequest,
  createReservationRequest,
  updateReservationRequest,
  deleteReservationRequest,
} from "../services/reservationApi";

export const useReservationStore = create((set) => ({
  reservations: [],
  loading: false,

  getReservations: async () => {
    set({ loading: true });

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
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  createReservation: async (data) => {
    await createReservationRequest(data);
  },

  updateReservation: async (id, data) => {
    await updateReservationRequest(id, data);
  },

  deleteReservation: async (id) => {
    await deleteReservationRequest(id);

    set((state) => ({
      reservations: state.reservations.filter(
        (r) => r._id !== id
      ),
    }));
  },
}));