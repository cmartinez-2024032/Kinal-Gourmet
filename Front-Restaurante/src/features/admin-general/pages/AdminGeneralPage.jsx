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
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border-t-4 border-t-orange-500 shadow-sm">
          <p className="text-3xl font-bold text-stone-900">{filteredUsers.length}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Total usuarios</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-t-4 border-t-stone-500 shadow-sm">
        <p className="text-3xl font-bold text-stone-900">
          {totalAdminGeneral}
        </p>

        <p className="text-xs text-stone-500 mt-1 font-medium uppercase tracking-wide">
          Admin General
        </p>
      </div>
        <div className="bg-white rounded-2xl p-5 border-t-4 border-t-orange-400 shadow-sm">
          <p className="text-3xl font-bold text-stone-900">{totalAdminRestaurante}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Admin Restaurante</p>
        </div>
      </div>

      {/* Buscador */}
      <div className="w-full bg-white rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 bg-orange-500 rounded-full" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredUsers.map((user) => {
          const roleName = user.Role?.name || user.role?.name

          const restaurantName = user.restaurantId
            ? restaurantMap[user.restaurantId]
            : null

          const isGeneral = roleName === "ADMIN_GENERAL"

          const initials = user.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()

          return (
            <div
              key={user._id || user.id}
              className="
                group
                relative
                bg-white
                border
                border-stone-200
                rounded-3xl
                overflow-hidden
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-2xl
                hover:border-orange-200
              "
            >

            {/* Gradient top */}
          <div
            className={`h-2 w-full ${
              isGeneral
                ? "bg-gradient-to-r from-stone-300 via-stone-400 to-neutral-500"
                : "bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300"
            }`}
          />

          {/* Action button */}
          {!isGeneral && (
            <button
              onClick={() => openEdit(user)}
              className="
                absolute
                top-4
                right-4
                z-10
                w-9
                h-9
                rounded-xl
                bg-white/90
                backdrop-blur
                border
                border-stone-200
                flex
                items-center
                justify-center
                shadow-sm
                hover:bg-orange-50
                hover:border-orange-200
                transition-all
              "
            >
              <svg
                className="w-4 h-4 text-stone-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6h.01M12 12h.01M12 18h.01"
                />
              </svg>
            </button>
          )}

          {/* Content */}
          <div className="p-5">

            {/* Top section */}
            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div className="relative shrink-0">

                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="
                      w-20
                      h-20
                      rounded-2xl
                      object-cover
                      border-4
                      border-white
                      shadow-lg
                    "
                  />
                ) : (
                  <div
                    className={`
                      w-20
                      h-20
                      rounded-2xl
                      flex
                      items-center
                      justify-center
                      text-2xl
                      font-bold
                      text-white
                      shadow-lg
                      ${
                        isGeneral
                          ? "bg-gradient-to-br from-stone-300 via-stone-500 to-neutral-700"
                          : "bg-gradient-to-br from-orange-500 to-amber-400"
                      }
                    `}
                  >
                    {initials}
                  </div>
                )}

                {/* Status */}
                <span
                  className={`
                    absolute
                    -top-1
                    -right-1
                    w-5
                    h-5
                    rounded-full
                    border-[3px]
                    border-white
                    ${
                      user.isActive !== false
                        ? "bg-green-400"
                        : "bg-stone-300"
                    }
                  `}
                />
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">

                {/* Badge */}
                <span
                  className={`
                    inline-flex
                    items-center
                    px-3
                    py-1
                    rounded-full
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                    mb-2
                    ${
                      isGeneral
                        ? "bg-stone-100 text-stone-700"
                        : "bg-orange-100 text-orange-600"
                    }
                  `}
                >
                  {isGeneral ? "Admin General" : "Admin Restaurante"}
                </span>

                {/* Name */}
                <h3 className="text-2xl font-bold text-stone-800 leading-tight">
                  {user.name}
                </h3>

                {/* Email */}
                <div className="flex items-center gap-2 mt-3 text-sm text-stone-500">
                  <span className="text-sm shrink-0">📧</span>

                  <span className="truncate">
                    {user.email}
                  </span>
                </div>

                {/* Restaurant */}
                {restaurantName && (
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <span className="shrink-0">🍽️</span>

                    <span className="text-orange-500 font-semibold truncate">
                      {restaurantName}
                    </span>
                  </div>
                )}
              </div>
            </div>


            {/* Divider */}
            <div className="my-4 border-t border-stone-100" />

            {/* Status */}
            <div className="grid grid-cols-1 gap-3">

              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-100">
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">
                  Estado
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`
                      w-2.5
                      h-2.5
                      rounded-full
                      ${
                        user.isActive !== false
                          ? "bg-green-400"
                          : "bg-stone-300"
                      }
                    `}
                  />

                  <p
                    className={`
                      text-sm
                      font-semibold
                      ${
                        user.isActive !== false
                          ? "text-green-500"
                          : "text-stone-400"
                      }
                    `}
                  >
                    {user.isActive !== false ? "Activo" : "Inactivo"}
                  </p>
                </div>
              </div>
            </div>

            {/* Edit button */}
            {!isGeneral && (
              <button
                onClick={() => openEdit(user)}
                className="
                  mt-4
                  w-full
                  py-2.5
                  rounded-2xl
                  bg-gradient-to-r
                  from-orange-500
                  to-amber-400
                  hover:from-orange-600
                  hover:to-orange-500
                  text-white
                  text-sm
                  font-bold
                  shadow-md
                  hover:shadow-lg
                  transition-all
                  duration-200
                "
              >
                ✏️ Editar administrador
              </button>
            )}
          </div>
          </div>
        )
      })}

      {/* Add new admin card */}
      <div
        onClick={openCreate}
        className="
          group
          border-2
          border-dashed
          border-stone-200
          hover:border-orange-300
          hover:bg-orange-50/50
          rounded-3xl
          min-h-[320px]
          flex
          flex-col
          items-center
          justify-center
          cursor-pointer
          transition-all
          duration-300
          hover:shadow-xl
          hover:-translate-y-1
        "
      >
        <div
          className="
            w-16
            h-16
            rounded-2xl
            bg-stone-100
            group-hover:bg-orange-100
            flex
            items-center
            justify-center
            transition-colors
            shadow-sm
          "
        >
          <svg
            className="
              w-8
              h-8
              text-stone-300
              group-hover:text-orange-500
              transition-colors
            "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>

        <p className="mt-4 text-lg font-bold text-stone-400 group-hover:text-orange-500 transition-colors">
          Agregar admin
        </p>

        <p className="text-sm text-stone-300 mt-1">
          Crear nuevo administrador
        </p>
      </div>

      {/* Empty state */}
      {filteredUsers.length === 0 && (
        <div className="col-span-full">
          <div className="bg-white rounded-3xl border border-dashed border-stone-200 py-16 flex flex-col items-center justify-center">

            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-stone-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5V4H2v16h5m10 0v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m10 0H7"
                />
              </svg>
            </div>

            <p className="text-lg font-bold text-stone-500">
              No se encontraron usuarios
            </p>

            <p className="text-sm text-stone-300 mt-1">
              Intenta cambiar tu búsqueda
            </p>
          </div>
        </div>
      )}

    </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-stone-100 overflow-hidden">

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

            <div className="px-6 pt-4">
              <span className="text-[11px] font-bold text-orange-500 border-b-2 border-orange-500 pb-1">
                1 · Información
              </span>
            </div>

            {error && (
              <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              {/* Drag & drop */}
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
                    <img src={previewImage} className="w-16 h-16 rounded-full object-cover border-4 border-orange-100" />
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