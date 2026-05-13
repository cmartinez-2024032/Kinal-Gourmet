import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../auth/store/useAuthStore"
import logo from "../../../assets/logo_2.png"

export const Navbar = () => {
  const navigate  = useNavigate()
  const logout    = useAuthStore((state) => state.logout)
  const user      = useAuthStore((state) => state.user)

  const handleLogout = () => { logout(); navigate("/login", { replace: true }) }

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "AD"

  return (
    <header className="flex items-center justify-between px-6 sticky top-0 z-50 flex-shrink-0"
      style={{ background: '#181714', borderBottom: '1px solid #33302B', height: '60px' }}>

      {/* Left */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="Kinal" className="h-9 w-auto object-contain" />
        <div style={{ width: '1px', height: '28px', background: '#33302B' }} />
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#6B6560', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Panel de administración
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* User chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{ background: '#211F1C', border: '1px solid #33302B' }}>
          <div className="flex items-center justify-center rounded-lg text-white text-xs font-bold flex-shrink-0"
            style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg,#E8591A,#C44010)', fontFamily: 'Syne,sans-serif' }}>
            {initials}
          </div>
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-xs font-semibold" style={{ color: '#F2EDE8' }}>
              {user?.name || 'Administrador'}
            </span>
            <span className="text-[10px]" style={{ color: '#E8591A' }}>
              {user?.role === 'admin_general' ? 'Admin General' : 'Admin Restaurante'}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150
            hover:text-red-400 hover:border-red-500/30"
          style={{ background: '#211F1C', border: '1px solid #33302B', color: '#6B6560', fontFamily: "'DM Sans',sans-serif" }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(220,60,60,0.08)'; e.currentTarget.style.borderColor='rgba(220,60,60,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.background='#211F1C'; e.currentTarget.style.borderColor='#33302B' }}
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}