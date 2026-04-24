import { useEffect } from "react"
import{useAdminGeneralStore} from "../store/useAdminGeneralStore"

export const AdminGeneralPage = () => {
  const {
    users,
    restaurants,
    loading,
    error,
    success,

    showForm,
    showEditModal,

    form,
    editForm,
    search,

    getData,
    createAdmin,
    updateAdmin,
    deleteAdmin,

    setShowForm,
    setShowEditModal,
    setSearch,
    setForm,
    setEditForm,
    setSelectedUser,
    clearMessages
  } = useAdminGeneralStore()

  useEffect(() => {
    getData()
  }, [])

  const availableRestaurants = restaurants.filter(r => !r.ownerUserId)

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

      {/* HEADER */}
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
          onClick={() => {
            setShowForm(true)
            clearMessages()
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Agregar admin
        </button>
      </div>

      {/* SUCCESS */}
      {success && !showForm && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="w-full bg-white border rounded-xl p-8 mb-6">

          <h2 className="text-xl font-semibold mb-6">
            Crear administrador de restaurante
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              createAdmin(form)
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">Nombre</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-3"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Email</label>
              <input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-3"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600 block mb-1">
                Restaurante
              </label>

              <select
                value={form.restaurantId}
                onChange={(e) =>
                  setForm({ ...form, restaurantId: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-3"
              >
                <option value="">Selecciona</option>
                {availableRestaurants.map(r => (
                  <option key={r._id} value={r._id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg"
              >
                {loading ? "Creando..." : "Crear"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border px-6 py-3 rounded-lg"
              >
                Cancelar
              </button>
            </div>

          </form>
        </div>
      )}

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar..."
        className="w-full border rounded-lg px-3 py-2 mb-4"
      />

      {/* LIST */}
      <div className="space-y-2">

        {filteredUsers.map(user => (
          <div
            key={user._id}
            className="border rounded-lg px-4 py-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>

              {user.restaurantId && (
                <p className="text-xs text-orange-500">
                  🍽 {restaurantMap[user.restaurantId]}
                </p>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedUser(user)
                setEditForm({
                  name: user.name,
                  email: user.email,
                  isActive: user.isActive,
                  restaurantId: user.restaurantId
                })
                setShowEditModal(true)
              }}
              className="bg-orange-500 text-white px-3 py-1 rounded text-xs"
            >
              Editar
            </button>
          </div>
        ))}

      </div>

      {/* MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <h2 className="text-lg font-semibold mb-4">
              Editar administrador
            </h2>

            <input
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-2"
            />

            <input
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-2"
            />

            <select
              value={String(editForm.isActive)}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  isActive: e.target.value === "true"
                })
              }
              className="w-full border rounded-lg px-3 py-2 mb-2"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>

            <div className="flex justify-between mt-4">

              <button
                onClick={() => deleteAdmin(editForm.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Eliminar
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => updateAdmin(editForm.id, editForm)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                >
                  Guardar
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}