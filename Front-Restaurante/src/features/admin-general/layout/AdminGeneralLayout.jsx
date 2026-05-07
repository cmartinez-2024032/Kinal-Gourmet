import { NavLink, Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../auth/store/authStore"
import logo from "../../../assets/logo_2.png"

export const AdminGeneralLayout = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: "#f1f0ed" }}>

      {/* Sidebar */}
      <aside className="flex flex-col flex-shrink-0" style={{ width: "220px", backgroundColor: "#1a1a2e" }}>

        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <img src={logo} alt="Kinal" className="h-10 w-auto object-contain" />
          <p style={{ fontSize: "9px", fontWeight: "700", color: "rgba(255,255,255,0.25)", letterSpacing: "2px", marginTop: "6px" }}>
            PANEL DE ADMINISTRACIÓN
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1" style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: "2px" }}>
          <p style={{ fontSize: "9px", fontWeight: "700", color: "rgba(255,255,255,0.2)", letterSpacing: "1.5px", padding: "0 8px", marginBottom: "6px" }}>
            GENERAL
          </p>

          <NavLink
            to="/adminGeneral"
            end
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", borderRadius: "12px", fontSize: "14px",
              transition: "all 0.15s",
              backgroundColor: isActive ? "rgba(249,115,22,0.18)" : "transparent",
              color: isActive ? "#fb923c" : "rgba(255,255,255,0.45)",
              fontWeight: isActive ? "600" : "400",
              textDecoration: "none"
            })}
          >
            <svg style={{ width: "16px", height: "16px", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Administradores
          </NavLink>

          <NavLink
            to="/adminGeneral/restaurantes"
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", borderRadius: "12px", fontSize: "14px",
              transition: "all 0.15s",
              backgroundColor: isActive ? "rgba(249,115,22,0.18)" : "transparent",
              color: isActive ? "#fb923c" : "rgba(255,255,255,0.45)",
              fontWeight: isActive ? "600" : "400",
              textDecoration: "none"
            })}
          >
            <svg style={{ width: "16px", height: "16px", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 19h6" />
            </svg>
            Restaurantes
          </NavLink>

        </nav>

        {/* Cerrar sesión */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", borderRadius: "12px", fontSize: "14px",
              color: "rgba(255,255,255,0.3)", background: "none",
              border: "none", cursor: "pointer", width: "100%",
              transition: "all 0.15s"
            }}
          >
            <svg style={{ width: "16px", height: "16px", flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>

      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header style={{
          backgroundColor: "white",
          borderBottom: "1px solid #f0ede8",
          padding: "12px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#a8a29e" }}>
            <span>Admin General</span>
            <span>/</span>
            <span style={{ color: "#1c1917", fontWeight: "500" }}>Administradores</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              backgroundColor: "#1c1917",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "white"
            }}>
              SA
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" style={{ padding: "32px", backgroundColor: "#f8f7f4" }}>
          <Outlet />
        </main>

      </div>
    </div>
  )
}