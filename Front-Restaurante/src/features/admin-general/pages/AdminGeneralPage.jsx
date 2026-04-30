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
  const [selectedUser, setSelectedUser]   = useState(null)

  const [editForm, setEditForm] = useState({
    name: "", email: "", isActive: true, restaurantId: ""
  })
  const [form, setForm] = useState({
    name: "", email: "", password: "", restaurantId: ""
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const getData = async () => {
    try {
      const [usersRes, restaurantsRes] = await Promise.all([
        getUsersRequest(),
        getRestaurantsRequest()
      ])
      setUsers(usersRes.data.users || usersRes.data)
      setRestaurants(restaurantsRes.data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => { getData() }, [])

  const availableRestaurants = restaurants.filter(r => !r.ownerUserId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(""); setSuccess(""); setLoading(true)
    try {
      await createAdminRestaurantRequest(form)
      setSuccess(`Administrador "${form.name}" creado y vinculado correctamente`)
      setForm({ name: "", email: "", password: "", restaurantId: "" })
      await getData()
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
      [name]: name === "isActive" ? value === "true" : value
    })
  }

  const handleUpdateUser = async () => {
    try {
      await updateAdminUserRequest(selectedUser.id, editForm)
      setSuccess("Administrador actualizado correctamente")
      setShowEditModal(false)
      await getData()
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar administrador")
    }
  }

  const handleDeleteUser = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar este administrador?")) return
    try {
      await deleteAdminUserRequest(selectedUser.id)
      setSuccess("Administrador eliminado correctamente")
      setShowEditModal(false)
      await getData()
    } catch (err) {
      setError(err.response?.data?.error || "Error al eliminar administrador")
    }
  }

  const restaurantMap = restaurants.reduce((acc, r) => {
    acc[r._id] = r.name
    return acc
  }, {})

  const filteredUsers = users
    .filter(u => ["ADMIN_RESTAURANTE", "ADMIN_GENERAL"].includes(u.Role?.name || u.role?.name))
    .filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )

  const totalAdminGeneral     = users.filter(u => (u.Role?.name || u.role?.name) === "ADMIN_GENERAL").length
  const totalAdminRestaurante = users.filter(u => (u.Role?.name || u.role?.name) === "ADMIN_RESTAURANTE").length

  const labelClass = "text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1.5"
  const inputClass = "w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 bg-stone-50 placeholder-stone-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"

  return (
    <div className="w-full h-full">

      {/* Alerta de éxito */}
      {success && !showForm && (
        <div className="mb-5 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            Administradores
          </h1>
          <p className="text-stone-400 text-sm mt-0.5">
            Gestiona accesos y asignaciones por restaurante
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(""); setSuccess("") }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors duration-150 shadow-sm tracking-wide"
        >
          + Agregar Administrador
        </button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-stone-100 rounded-2xl p-4 border-t-4 border-t-orange-500">
          <p className="text-3xl font-bold text-stone-900">{filteredUsers.length}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Total usuarios</p>
        </div>
        <div className="bg-white border border-stone-100 rounded-2xl p-4 border-t-4 border-t-violet-500">
          <p className="text-3xl font-bold text-stone-900">{totalAdminGeneral}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Admin general</p>
        </div>
        <div className="bg-white border border-stone-100 rounded-2xl p-4 border-t-4 border-t-orange-400">
          <p className="text-3xl font-bold text-stone-900">{totalAdminRestaurante}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Admin restaurante</p>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="w-full bg-white border border-stone-100 rounded-2xl p-8 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-orange-500 rounded-full" />
            <div>
              <h2 className="text-base font-bold text-stone-900">Crear administrador</h2>
              <p className="text-xs text-stone-400">Completa los datos para registrar un nuevo acceso</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Nombre completo</label>
              <input name="name" value={form.name} onChange={handleChange} required
                className={inputClass} placeholder="Ej. Carlos Méndez" />
            </div>
            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                className={inputClass} placeholder="admin@restaurante.com" />
            </div>
            <div>
              <label className={labelClass}>Contraseña temporal</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                required minLength={6} className={inputClass} placeholder="Mínimo 6 caracteres" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Restaurante a asignar</label>
              {availableRestaurants.length === 0 ? (
                <div className="w-full border border-orange-200 bg-orange-50 text-orange-600 rounded-xl px-4 py-3 text-sm font-medium">
                  No hay restaurantes disponibles sin administrador asignado
                </div>
              ) : (
                <select name="restaurantId" value={form.restaurantId} onChange={handleChange} required
                  className={inputClass}>
                  <option value="">— Selecciona un restaurante —</option>
                  {availableRestaurants.map(r => (
                    <option key={r._id} value={r._id}>{r.name} · {r.category}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="md:col-span-2 flex gap-3 pt-1">
              <button type="submit"
                disabled={loading || availableRestaurants.length === 0}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
                {loading ? "Creando..." : "Crear administrador"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setError("") }}
                className="border border-stone-200 hover:bg-stone-50 text-stone-600 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista */}
      <div className="w-full bg-white border border-stone-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-orange-500 rounded-full" />
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Administradores registrados</h2>
        </div>

        <div className="relative mb-4">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input type="text" placeholder="Buscar por nombre o correo..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-700 bg-stone-50 placeholder-stone-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUsers.map((user) => {
            const roleName = user.Role?.name || user.role?.name
            const restaurantName = user.restaurantId ? restaurantMap[user.restaurantId] : null
            const isGeneral = roleName === "ADMIN_GENERAL"

            return (
              <div key={user._id}
                className="bg-white border border-stone-100 rounded-2xl p-5 flex flex-col items-center text-center gap-3 hover:border-orange-200 hover:shadow-md transition-all duration-150">

                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=${isGeneral ? "6d28d9" : "f97316"}&textColor=ffffff&fontSize=38`}
                  className={`w-16 h-16 rounded-full border-3 ${isGeneral ? "border-violet-200" : "border-orange-200"}`}
                  style={{ border: `3px solid ${isGeneral ? "#ddd6fe" : "#fed7aa"}` }}
                />

                <div>
                  <p className="font-bold text-sm text-stone-800">{user.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{user.email}</p>
                  {restaurantName && (
                    <p className="text-xs text-orange-500 mt-1 font-semibold">🍽 {restaurantName}</p>
                  )}
                  {roleName === "ADMIN_RESTAURANTE" && !restaurantName && (
                    <p className="text-xs text-orange-400 mt-1 font-semibold">⚠ Sin restaurante asignado</p>
                  )}
                </div>

                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                  isGeneral
                    ? "bg-violet-50 text-violet-700 border-violet-200"
                    : "bg-stone-100 text-stone-600 border-stone-300"
                }`}>
                  {isGeneral ? "Admin General" : "Admin Restaurante"}
                </span>

                {!isGeneral && (
                  <button
                    onClick={() => openEditModal(user)}
                    className="w-full text-xs py-2 rounded-xl border-2 border-stone-400 text-stone-600 hover:bg-stone-700 hover:text-white hover:border-transparent transition-all duration-150 font-bold mt-auto"
                  >
                    Editar
                  </button>
                )}
              </div>
            )
          })}

          {filteredUsers.length === 0 && (
            <p className="col-span-full text-sm text-stone-300 text-center py-10 font-medium">
              No se encontraron usuarios
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-stone-100 overflow-hidden">

            <div className="bg-orange-50 border-b border-orange-100 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-orange-600">Editar Administrador</h2>
                <p className="text-xs text-orange-400 mt-0.5">{selectedUser?.name}</p>
              </div>
              <button onClick={() => setShowEditModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-400 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Nombre</label>
                <input name="name" value={editForm.name} onChange={handleEditChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input name="email" value={editForm.email} onChange={handleEditChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Estado</label>
                <select name="isActive" value={String(editForm.isActive)} onChange={handleEditChange} className={inputClass}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Restaurante asignado</label>
                <select name="restaurantId" value={editForm.restaurantId} onChange={handleEditChange} className={inputClass}>
                  <option value="">Sin restaurante</option>
                  {restaurants.map(r => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between px-6 pb-6 pt-2 border-t border-stone-100">
              <button onClick={handleDeleteUser}
                className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-transparent transition-all duration-150 font-bold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
                </svg>
                Eliminar
              </button>
              <div className="flex gap-2">
                <button onClick={() => setShowEditModal(false)}
                  className="text-sm px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-medium transition-colors">
                  Cancelar
                </button>
                <button onClick={handleUpdateUser}
                  className="text-sm px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors shadow-sm">
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