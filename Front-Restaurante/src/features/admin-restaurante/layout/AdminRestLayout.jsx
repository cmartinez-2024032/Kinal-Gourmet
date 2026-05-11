import { NavLink, Outlet } from "react-router-dom"
import { Navbar } from "../../admin-general/layout/Navbar.jsx"

export const AdminRestLayout = () => {
  return (
    <div className="h-screen bg-gray-100 flex flex-col">

      {/* Navbar arriba */}
      <Navbar />

      {/* Contenido debajo */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 bg-white border-r flex flex-col overflow-y-auto">

          <div className="p-6">
            <h1 className="text-lg font-semibold text-orange-600 mb-1">
              Admin Restaurante
            </h1>
            <p className="text-xs text-gray-400 mb-8">Panel de gestión</p>

            <nav className="space-y-1">

              {/* Overview */}
              <NavLink
                to="/adminRestaurante"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="text-base leading-none">⊞</span>
                Resumen
              </NavLink>

              {/* Divider con label */}
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-1">
                Menú
              </p>

              <NavLink
                to="/adminRestaurante/platillos"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="text-base leading-none">🍽</span>
                Platillos
              </NavLink>

              <NavLink
                to="/adminRestaurante/cupones"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="text-base leading-none">🏷</span>
                Cupones
              </NavLink>

              <NavLink
                to="/adminRestaurante/promociones"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="text-base leading-none">🔥</span>
                Promociones
              </NavLink>

              <NavLink
                to="/adminRestaurante/eventos"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="text-base leading-none">🎉</span>
                Eventos
              </NavLink>

              {/* Divider */}
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-1">
                Operaciones
              </p>

              <NavLink
                to="/adminRestaurante/mesas"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="text-base leading-none">▦</span>
                Mesas
              </NavLink>

              <NavLink
                to="/adminRestaurante/reservaciones"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="text-base leading-none">📅</span>
                Reservaciones
              </NavLink>

              <NavLink
                to="/adminRestaurante/pedidos"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="text-base leading-none">📋</span>
                Pedidos
              </NavLink>

              <NavLink
  to="/adminRestaurante/reportes"
  className={({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
      isActive
        ? "bg-orange-50 text-orange-600 font-medium"
        : "text-gray-600 hover:bg-gray-50"
    }`
  }
>
  <span className="text-base leading-none">📊</span>
  Reportes
</NavLink>

              {/* Divider */}
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-1">
                Configuración
              </p>

              <NavLink
                to="/adminRestaurante/restaurante"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <span className="text-base leading-none">🏪</span>
                Mi Restaurante
              </NavLink>

            </nav>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}
