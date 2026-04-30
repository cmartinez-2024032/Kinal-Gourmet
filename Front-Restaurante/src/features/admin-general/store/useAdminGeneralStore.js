import { create } from "zustand"
import {
  createAdminRestaurantRequest,
  getUsersRequest,
  updateAdminUserRequest,
  deleteAdminUserRequest
} from "../../../shared/api/auth"
import { getRestaurantsRequest } from "../../../shared/api/restaurants"

export const useAdminGeneralStore = create((set, get) => ({
  users:        [],
  restaurants:  [],
  loading:      false,
  error:        "",
  success:      "",
  showModal:    false,
  selectedUser: null,
  search:       "",

  form: {
    name: "", email: "", password: "", restaurantId: "", image: null, isActive: true
  },

  setShowModal:    (val) => set({ showModal: val }),
  setSelectedUser: (val) => set({ selectedUser: val }),
  setSearch:       (val) => set({ search: val }),
  setForm:         (val) => set({ form: val }),
  clearMessages:   ()    => set({ error: "", success: "" }),

  getData: async () => {
    try {
      const [usersRes, restaurantsRes] = await Promise.all([
        getUsersRequest(),
        getRestaurantsRequest()
      ])
      set({
        users:       usersRes.data.users || usersRes.data,
        restaurants: restaurantsRes.data.data || []
      })
    } catch (err) {
      console.error(err)
    }
  },

  createAdmin: async (form) => {
    set({ loading: true, error: "", success: "" })
    try {
      const formData = new FormData()
      formData.append("name",         form.name)
      formData.append("email",        form.email)
      formData.append("password",     form.password)
      formData.append("restaurantId", form.restaurantId)
      if (form.image) formData.append("image", form.image)

      await createAdminRestaurantRequest(formData)

      set({
        success:  `Administrador "${form.name}" creado correctamente`,
        showModal: false,
        form:     { name: "", email: "", password: "", restaurantId: "", image: null, isActive: true }
      })
      await get().getData()
    } catch (err) {
      set({ error: err.response?.data?.error || "Error al crear el administrador" })
    } finally {
      set({ loading: false })
    }
  },

  updateAdmin: async (id, form) => {
    set({ loading: true, error: "", success: "" })
    try {
      const formData = new FormData()
      formData.append("name",         form.name)
      formData.append("email",        form.email)
      formData.append("isActive",     form.isActive)
      formData.append("restaurantId", form.restaurantId || "")
      if (form.image) formData.append("image", form.image)

      await updateAdminUserRequest(id, formData)

      set({
        success:   "Administrador actualizado correctamente",
        showModal: false
      })
      await get().getData()
    } catch (err) {
      set({ error: err.response?.data?.error || "Error al actualizar" })
    } finally {
      set({ loading: false })
    }
  },

  deleteAdmin: async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este administrador?")) return
    try {
      await deleteAdminUserRequest(id)
      set({ success: "Administrador eliminado correctamente", showModal: false })
      await get().getData()
    } catch (err) {
      set({ error: err.response?.data?.error || "Error al eliminar" })
    }
  }
}))