import { create } from "zustand";
import {
  getDishesRequest,
  createDishRequest,
  updateDishRequest,
  deleteDishRequest
} from "../../../shared/api/platillos";
 
export const usePlatilloStore = create((set, get) => ({
  dishes: [],
  selectedDish: null,
  isModalOpen: false,
  searchTerm: "",
  filterCategory: "Todas",
  loading: false,
  error: null,
 
  getFilteredDishes: () => {
    const { dishes, searchTerm, filterCategory } = get();
    return dishes.filter((d) => {
      const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filterCategory === "Todas" || d.category === filterCategory;
      return matchSearch && matchCat;
    });
  },
 
  getCategories: () => {
    const { dishes } = get();
    return ["Todas", ...new Set(dishes.map((d) => d.category))];
  },
 
  openCreateModal: () => set({ isModalOpen: true, selectedDish: null }),
  openEditModal:   (dish) => set({ isModalOpen: true, selectedDish: dish }),
  closeModal:      () => set({ isModalOpen: false, selectedDish: null }),
 
  getDishes: async () => {
    try {
        set({ loading: true, error: null });
        const response = await getDishesRequest();
        
        const dishes = response.data?.data ?? response.data ?? [];
        set({ dishes, loading: false });
    } catch (error) {
        set({
        error: error.response?.data?.message || "Endpoint no encontrado",
        loading: false,
        });
    }
    },
 
  createDish: async (payload) => {
    try {
      set({ loading: true, error: null });
      await createDishRequest(payload);
      await get().getDishes();
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al crear el platillo.",
        loading: false
      });
      throw error;
    }
  },
 
  updateDish: async (id, payload) => {
    try {
      set({ loading: true, error: null });
      await updateDishRequest(id, payload);
      await get().getDishes();
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al actualizar el platillo.",
        loading: false
      });
      throw error;
    }
  },
 
  deleteDish: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteDishRequest(id);
      await get().getDishes();
      set({ loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error al eliminar el platillo.",
        loading: false
      });
      throw error;
    }
  },
 
  // Filtar por categoria, nombre
  setSearchTerm:     (term)     => set({ searchTerm: term }),
  setFilterCategory: (category) => set({ filterCategory: category }),
  clearError:        ()         => set({ error: null }),
}));
 