import { NavLink, Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"

export const AdminGeneralLayout = () => {
  return (
    <div className="h-screen bg-gray-100 flex flex-col">

      {/* Navbar arriba */}
      <Navbar />

      {/* Contenido debajo */}
      <div className="flex flex-1">

        <aside className="w-64 bg-white border-r p-6">

          <h1 className="text-lg font-semibold text-orange-600 mb-8">
            Admin General
          </h1>

          <nav className="space-y-2">

            <NavLink
              to="/adminGeneral"
              end
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Administradores Restaurante
            </NavLink>

            <NavLink
              to="/adminGeneral/restaurantes"
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-orange-100 text-orange-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Restaurantes
            </NavLink>

          </nav>

        </aside>

        <main className="flex-1 p-8 bg-gray-50">
          <Outlet />
        </main>

      </div>
    </div>
  )
}