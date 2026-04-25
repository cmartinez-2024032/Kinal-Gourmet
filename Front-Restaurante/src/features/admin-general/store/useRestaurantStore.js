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

  createRestaurant: async (payload, photoFile) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();

      // Campos simples
      const simpleFields = [
        'name',
        'description',
        'address',
        'phone',
        'email',
        'category',
        'averagePrice',
        'priceRange',
        'openingHours',
        'closingHours'
      ];

      simpleFields.forEach(field => {
        if (payload[field] !== undefined) {
          formData.append(field, payload[field]);
        }
      });

      // Campos JSON
      const jsonFields = [
        'location',
        'addressDetails',
        'features',
        'paymentMethods',
        'subcategories'
      ];

      jsonFields.forEach(field => {
        if (payload[field] !== undefined) {
          formData.append(field, JSON.stringify(payload[field]));
        }
      });

      // imagen
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      await createRestaurantRequest(formData);

      await get().getRestaurants();

      set({ loading: false });

    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error al crear restaurante.",
        loading: false
      });

      throw error;
    }
  },

  updateRestaurant: async (id, payload, photoFile) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();

      // campos simples
      const simpleFields = [
        'name',
        'description',
        'address',
        'phone',
        'email',
        'category',
        'averagePrice',
        'priceRange',
        'openingHours',
        'closingHours'
      ];

      simpleFields.forEach(field => {
        if (payload[field] !== undefined) {
          formData.append(field, payload[field]);
        }
      });

      // campos JSON
      const jsonFields = [
        'location',
        'addressDetails',
        'features',
        'paymentMethods',
        'subcategories'
      ];

      jsonFields.forEach(field => {
        if (payload[field] !== undefined) {
          formData.append(field, JSON.stringify(payload[field]));
        }
      });

      // imagen nueva
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      await updateRestaurantRequest(id, formData);

      await get().getRestaurants();

      set({ loading: false });

    } catch (error) {
      set({
        error:
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Error al actualizar restaurante.",
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