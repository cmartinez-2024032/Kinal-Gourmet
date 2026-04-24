import { useState, useEffect } from "react"
import { registerRequest , getUsersRequest} from "../../../shared/api/auth"

export const AdminGeneralPage = () => {
  const [showForm, setShowForm] = useState(false)
  const [users, setUsers] = useState([]) // lista de usuarios
  const [search, setSearch] = useState("")// busqueda por nombre o email

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const getUsers = async () => {
    try {
      const { data } = await getUsersRequest()
      setUsers(data.users || data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await registerRequest({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "ADMIN_RESTAURANTE"
      })

      setForm({
        name: "",
        email: "",
        password: ""
      })

      await getUsers()
      alert("Administrador creado correctamente")
      setShowForm(false)

    } catch (error) {
      console.log(error.response?.data)
    }
  }

  const filteredUsers = users
    .filter(user =>
        ["ADMIN_RESTAURANTE", "ADMIN_GENERAL"].includes(
        user.Role?.name || user.role?.name
        )
    )
    .filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="w-full h-full">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Administradores de Restaurante
          </h1>
          <p className="text-gray-500 text-sm">
            Crea administradores para cada restaurante
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
        >
          + Agregar admin
        </button>
      </div>

      {showForm && (
        <div className="w-full bg-white border rounded-xl p-8">

          <h2 className="text-xl font-semibold mb-8">
            Crear administrador de restaurante
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">
                Nombre completo
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-3 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Correo electrónico
              </label>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-3 mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Contraseña
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-3 mt-1"
              />
            </div>

            <div className="md:col-span-2 flex gap-3 pt-4">
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
              >
                Crear administrador
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

      <div className="w-full bg-white border rounded-xl p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">
          Usuarios registrados
        </h2>

        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <div className="space-y-2">
            {filteredUsers.map((user) => (
                <div
                key={user.id}
                className="border rounded-lg px-3 py-2 flex justify-between items-center"
                >
                <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {user.Role?.name || user.role?.name}
                </span>
                </div>
            ))}
        </div>
      </div>

    </div>
  )
}