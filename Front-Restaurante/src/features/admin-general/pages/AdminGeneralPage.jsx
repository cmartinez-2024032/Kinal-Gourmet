import { useState, useEffect } from "react"
import {
  createAdminRestaurantRequest,
  getUsersRequest,
  updateAdminUserRequest,
  deleteAdminUserRequest
} from "../../../shared/api/auth"
import { getRestaurantsRequest } from "../../../shared/api/restaurants"

export const AdminGeneralPage = () => {
  const [showForm, setShowForm]       = useState(false)
  const [users, setUsers]             = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [search, setSearch]           = useState("")
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState("")
  const [success, setSuccess]         = useState("")

  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    isActive: true,
    restaurantId: ""
  })

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    restaurantId: ""
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const getData = async () => {
    try {
      const [usersRes, restaurantsRes] = await Promise.all([
        getUsersRequest(),
        getRestaurantsRequest()
      ])

      console.log(restaurantsRes.data.data)

      setUsers(usersRes.data.users || usersRes.data)
      setRestaurants(restaurantsRes.data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { getData() }, [])

  // Solo restaurantes sin admin asignado para el selector
  const availableRestaurants = restaurants.filter(r => !r.ownerUserId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await createAdminRestaurantRequest(form)

      setSuccess(`Administrador "${form.name}" creado y vinculado correctamente`)
      setForm({ name: "", email: "", password: "", restaurantId: "" })
      await getData()       // refresca usuarios Y restaurantes
      setShowForm(false)

    } catch (err) {
      setError(err.response?.data?.error || "Error al crear el administrador")
    } finally {
      setLoading(false)
    }
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      isActive: user.isActive ?? true,
      restaurantId: user.restaurantId || ""
    })
    setShowEditModal(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target

    setEditForm({
      ...editForm,
      [name]: name === "isActive"
        ? value === "true"
        : value
    })
  }

  const handleUpdateUser = async () => {
    try {
      await updateAdminUserRequest(selectedUser.id, editForm)

      setSuccess("Administrador actualizado correctamente")
      setShowEditModal(false)
      await getData()

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Error al actualizar administrador"
      )
    }
  }

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este administrador?"
    )

    if (!confirmDelete) return

    try {
      await deleteAdminUserRequest(selectedUser.id)

      setSuccess("Administrador eliminado correctamente")
      setShowEditModal(false)
      await getData()

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Error al eliminar administrador"
      )
    }
  }

  // Mapa restaurantId → nombre para mostrarlo en la lista de usuarios
  const restaurantMap = restaurants.reduce((acc, r) => {
    acc[r._id] = r.name
    return acc
  }, {})

  const filteredUsers = users
    .filter(u =>
      ["ADMIN_RESTAURANTE", "ADMIN_GENERAL"].includes(
        u.Role?.name || u.role?.name
      )
    )
    .filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="w-full h-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Administradores de Restaurante
          </h1>
          <p className="text-gray-500 text-sm">
            Crea administradores y asígnalos a un restaurante
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(""); setSuccess("") }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Agregar admin
        </button>
      </div>

      {/* Alerta de éxito fuera del form */}
      {success && !showForm && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="w-full bg-white border rounded-xl p-8 mb-6">
          <h2 className="text-xl font-semibold mb-6">
            Crear administrador de restaurante
          </h2>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">Nombre completo</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-3"
                placeholder="Ej. Carlos Méndez"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Correo electrónico</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-3"
                placeholder="admin@restaurante.com"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Contraseña temporal</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full border rounded-lg px-3 py-3"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {/* Selector de restaurante */}
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">
                Restaurante a asignar
              </label>

              {availableRestaurants.length === 0 ? (
                <div className="w-full border border-orange-200 bg-orange-50 text-orange-600 rounded-lg px-3 py-3 text-sm">
                  No hay restaurantes disponibles sin administrador asignado
                </div>
              ) : (
                <select
                  name="restaurantId"
                  value={form.restaurantId}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-3 bg-white text-gray-700"
                >
                  <option value="">— Selecciona un restaurante —</option>
                  {availableRestaurants.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.name} · {r.category}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="md:col-span-2 flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || availableRestaurants.length === 0}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg text-sm"
              >
                {loading ? "Creando..." : "Crear administrador"}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError("") }}
                className="border px-6 py-3 rounded-lg text-sm"
              >
                Cancelar
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="w-full bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Usuarios registrados</h2>

        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <div className="space-y-2">
          {filteredUsers.map((user) => {
            const roleName = user.Role?.name || user.role?.name
            const restaurantName = user.restaurantId
              ? restaurantMap[user.restaurantId]
              : null

            return (
              <div
                key={user._id}
                className="border rounded-lg px-4 py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  {/* Restaurante asignado */}
                  {restaurantName && (
                    <p className="text-xs text-orange-500 mt-0.5">
                      🍽 {restaurantName}
                    </p>
                  )}
                  {roleName === "ADMIN_RESTAURANTE" && !restaurantName && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Sin restaurante asignado
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs shrink-0">
                    {roleName}
                  </span>

                  {roleName === "ADMIN_RESTAURANTE" && (
                    <button
                      onClick={() => openEditModal(user)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Editar / Eliminar
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {filteredUsers.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No se encontraron usuarios
            </p>
          )}
        </div>
      </div>
      
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h2 className="text-lg font-semibold mb-4">
              Editar Administrador
            </h2>

            <div className="space-y-4">

              <div>
                <label className="text-sm text-gray-600">
                  Nombre
                </label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Email
                </label>
                <input
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Estado
                </label>
                <select
                  name="isActive"
                  value={String(editForm.isActive)}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Restaurante asignado
                </label>

                <select
                  name="restaurantId"
                  value={editForm.restaurantId}
                  onChange={handleEditChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Sin restaurante</option>

                  {restaurants.map((restaurant) => (
                    <option
                      key={restaurant._id}
                      value={restaurant._id}
                    >
                      {restaurant.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex justify-between mt-6">

              <div className="flex gap-2">
                <button
                  onClick={handleDeleteUser}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Eliminar
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleUpdateUser}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
                >
                  Guardar cambios
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}