import { useState } from "react"
import { registerRequest } from "../../../shared/api/auth"

export const AdminGeneralPage = () => {
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

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

        // opcional mensaje
        alert("Administrador creado correctamente")

        setShowForm(false)

        } catch (error) {
        console.log(error.response?.data)
        }
    }

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
                className="w-full border rounded-lg px-3 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="w-full border rounded-lg px-3 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="w-full border rounded-lg px-3 py-3 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="border px-6 py-3 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  )
}