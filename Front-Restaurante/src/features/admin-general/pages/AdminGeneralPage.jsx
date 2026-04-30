import { useEffect, useRef, useState } from "react"
import { useAdminGeneralStore } from "../store/useAdminGeneralStore"

export const AdminGeneralPage = () => {
  const {
    users, restaurants, loading, error, success,
    showModal, selectedUser,
    form, search,
    getData, createAdmin, updateAdmin, deleteAdmin,
    setShowModal, setSearch,
    setForm, setSelectedUser,
    clearMessages
  } = useAdminGeneralStore()

  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => { getData() }, [])

  const isEditing = !!selectedUser

  const availableRestaurants = isEditing
    ? restaurants
    : restaurants.filter(r => !r.ownerUserId)

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

  const openCreate = () => {
    setSelectedUser(null)
    setForm({ name: "", email: "", password: "", restaurantId: "", image: null, isActive: true })
    clearMessages()
    setShowModal(true)
  }

  const openEdit = (user) => {
    setSelectedUser(user)
    setForm({
      name:         user.name         || "",
      email:        user.email        || "",
      password:     "",
      restaurantId: user.restaurantId || "",
      isActive:     user.isActive     ?? true,
      image:        null
    })
    clearMessages()
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setSelectedUser(null)
    clearMessages()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isEditing) {
      updateAdmin(selectedUser.id, form)
    } else {
      createAdmin(form)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      setForm({ ...form, image: file })
    }
  }

  const previewImage = form.image
    ? URL.createObjectURL(form.image)
    : selectedUser?.image || null

  return (
    <div className="w-full h-full">

      {/* Alerta éxito */}
      {success && (
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
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Administradores</h1>
          <p className="text-stone-400 text-sm mt-0.5">Gestiona accesos y asignaciones por restaurante</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
        >
          + Agregar Administrador
        </button>
      </div>

      {/* Estadísticas */}
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

      {/* Buscador */}
      <div className="w-full bg-white border border-stone-100 rounded-2xl p-6 shadow-sm mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-orange-500 rounded-full" />
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">Administradores registrados</h2>
        </div>
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text" placeholder="Buscar por nombre o correo..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-700 bg-stone-50 placeholder-stone-300 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredUsers.map((user) => {
          const roleName       = user.Role?.name || user.role?.name
          const restaurantName = user.restaurantId ? restaurantMap[user.restaurantId] : null
          const isGeneral      = roleName === "ADMIN_GENERAL"

          return (
            <div key={user._id || user.id}
              className="bg-white border border-stone-100 rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-150">

              {/* Imagen grande cuadrada */}
              <img
                src={
                  user.image
                    ? user.image
                    : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=${isGeneral ? "6d28d9" : "f97316"}&textColor=ffffff&fontSize=38`
                }
                alt={user.name}
                className="w-full aspect-square object-cover"
              />

              {/* Info */}
              <div className="p-3 flex flex-col gap-1 flex-1">
                <p className="text-sm font-semibold text-stone-800 truncate">{user.name}</p>
                <p className="text-xs text-stone-400 truncate">{user.email}</p>

                <span className={`w-fit mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isGeneral
                    ? "bg-violet-50 text-violet-700 border-violet-200"
                    : "bg-stone-100 text-stone-500 border-stone-200"
                }`}>
                  {isGeneral ? "Admin General" : "Admin Restaurante"}
                </span>

                {restaurantName && (
                  <p className="text-[11px] text-orange-500 font-semibold truncate">{restaurantName}</p>
                )}
                {roleName === "ADMIN_RESTAURANTE" && !restaurantName && (
                  <p className="text-[11px] text-amber-400 font-semibold">Sin restaurante</p>
                )}

                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${user.isActive !== false ? "bg-green-400" : "bg-stone-300"}`} />
                  <span className="text-[11px] text-stone-400">{user.isActive !== false ? "Activo" : "Inactivo"}</span>
                </div>
              </div>

              {/* Botón editar */}
              {!isGeneral && (
                <div className="px-3 pb-3">
                  <button
                    onClick={() => openEdit(user)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2 text-xs font-bold transition-colors"
                  >
                    Editar
                  </button>
                </div>
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

      {/* MODAL UNIFICADO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-stone-100 overflow-hidden">

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-stone-100 flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900">
                  {isEditing ? "Editar administrador" : "Nuevo administrador"}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  {isEditing ? `Modificando datos de ${selectedUser?.name}` : "Completa los datos del administrador"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Paso */}
            <div className="px-6 pt-4">
              <span className="text-[11px] font-bold text-orange-500 border-b-2 border-orange-500 pb-1">
                1 · Información
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Drag & drop imagen */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-5 cursor-pointer transition-colors ${
                  dragOver
                    ? "border-orange-400 bg-orange-50"
                    : "border-stone-200 hover:border-orange-300 hover:bg-stone-50"
                }`}
              >
                {previewImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={previewImage}
                      className="w-16 h-16 rounded-full object-cover border-4 border-orange-100"
                    />
                    <span className="text-[10px] text-orange-400 font-semibold">
                      {form.image ? form.image.name : "Imagen actual · clic para cambiar"}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-stone-400">
                    <svg className="w-7 h-7 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm font-medium">Arrastra una foto o haz clic para subir</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file" accept="image/*" className="hidden"
                  onChange={(e) => setForm({ ...form, image: e.target.files[0] || null })}
                />
              </div>

              <div>
                <label className={labelClass}>Nombre completo</label>
                <input
                  value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass} placeholder="Ej. Carlos Méndez"
                />
              </div>

              <div>
                <label className={labelClass}>Correo electrónico</label>
                <input
                  type="email" value={form.email} required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass} placeholder="admin@restaurante.com"
                />
              </div>

              {!isEditing && (
                <div>
                  <label className={labelClass}>Contraseña temporal</label>
                  <input
                    type="password" value={form.password} required minLength={6}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={inputClass} placeholder="Mínimo 6 caracteres"
                  />
                </div>
              )}

              {isEditing && (
                <div>
                  <label className={labelClass}>Estado</label>
                  <select
                    value={String(form.isActive ?? true)}
                    onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
                    className={inputClass}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              )}

              <div>
                <label className={labelClass}>Restaurante a asignar</label>
                {availableRestaurants.length === 0 ? (
                  <div className="w-full border border-orange-200 bg-orange-50 text-orange-600 rounded-xl px-4 py-3 text-sm font-medium">
                    No hay restaurantes disponibles sin administrador asignado
                  </div>
                ) : (
                  <select
                    value={form.restaurantId}
                    onChange={(e) => setForm({ ...form, restaurantId: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">— Selecciona un restaurante —</option>
                    {availableRestaurants.map(r => (
                      <option key={r._id} value={r._id}>{r.name} · {r.category}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-2">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => deleteAdmin(selectedUser.id)}
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-transparent transition-all font-bold"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                ) : (
                  <span className="text-xs text-stone-400">Paso 1 de 1</span>
                )}

                <div className="flex gap-2">
                  <button
                    type="button" onClick={handleClose}
                    className="border border-stone-200 hover:bg-stone-50 text-stone-600 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || (!isEditing && availableRestaurants.length === 0)}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
                  >
                    {loading ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear →"}
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  )
}