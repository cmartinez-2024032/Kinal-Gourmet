import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../auth/store/useAuthStore"
import logo from "../../../assets/logo_2.png"

export const Navbar = () => {
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)
    const user = useAuthStore((state) => state.user)

    const handleLogout = () => {
        logout()
        navigate("/login", { replace: true })
    }

    const initials = user?.name
        ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
        : "AD"

    return (
        <header style={{
            background: '#181714',
            borderBottom: '1px solid #33302B',
            padding: '0 24px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            flexShrink: 0
        }}>

            {/* LEFT — logo + separador + label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                    src={logo}
                    alt="Kinal Gourmet House"
                    style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
                />
                <div style={{ width: '1px', height: '28px', background: '#33302B' }} />
                <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#6B6560',
                    letterSpacing: '2px',
                    textTransform: 'uppercase'
                }}>
                    Panel de administración
                </span>
            </div>

            {/* RIGHT — usuario + logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                {/* Chip del usuario */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#211F1C',
                    border: '1px solid #33302B',
                    borderRadius: '10px',
                    padding: '6px 12px 6px 6px'
                }}>
                    <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '7px',
                        background: 'linear-gradient(135deg, #E8591A, #C44010)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#fff',
                        fontFamily: 'Syne, sans-serif',
                        flexShrink: 0
                    }}>
                        {initials}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#F2EDE8' }}>
                            {user?.name || 'Administrador'}
                        </span>
                        <span style={{ fontSize: '10px', color: '#E8591A' }}>
                            {user?.role === 'admin_general' ? 'Admin General' : 'Admin Restaurante'}
                        </span>
                    </div>
                </div>

                {/* Botón logout */}
                <button
                    onClick={handleLogout}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(220,60,60,0.12)'
                        e.currentTarget.style.borderColor = 'rgba(220,60,60,0.4)'
                        e.currentTarget.style.color = '#E05555'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = '#211F1C'
                        e.currentTarget.style.borderColor = '#33302B'
                        e.currentTarget.style.color = '#6B6560'
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '7px',
                        background: '#211F1C',
                        border: '1px solid #33302B',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: '#6B6560',
                        cursor: 'pointer',
                        transition: 'all .15s',
                        fontFamily: "'DM Sans', sans-serif"
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                    </svg>
                    Cerrar sesión
                </button>

            </div>
        </header>
    )
}