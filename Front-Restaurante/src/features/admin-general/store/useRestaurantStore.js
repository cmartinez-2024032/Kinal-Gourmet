import { create } from "zustand";
import {
  getRestaurantsRequest,
  createRestaurantRequest,
  updateRestaurantRequest,
  deleteRestaurantRequest
} from "../../../shared/api/restaurants";

export const useRestaurantStore = create((set, get) => ({
  restaurants: [],
  loading: false,
  error: null,

  getRestaurants: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getRestaurantsRequest();
      set({ restaurants: response.data.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al obtener restaurantes.",
        loading: false
      });
    }
  },

  createRestaurant: async (payload) => {
    try {
      set({ loading: true, error: null });
      await createRestaurantRequest(payload);
      await get().getRestaurants();
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al crear el restaurante.",
        loading: false
      });
      throw error; // para que el componente pueda capturarlo
    }
  },

  updateRestaurant: async (id, data) => {
    try {
      set({ loading: true, error: null });
      await updateRestaurantRequest(id, data);
      await get().getRestaurants();
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error al actualizar restaurante.",
        loading: false
      });
      throw error;
    }
  },

  deleteRestaurant: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteRestaurantRequest(id);
      await get().getRestaurants();
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error al eliminar restaurante.",
        loading: false
      });
      throw error;
    }
  }
}));