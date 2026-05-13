import { NavLink, Outlet } from "react-router-dom"
import { Navbar } from "./Navbar.jsx"

export const AdminRestLayout = () => {
  return (
    <div className="h-screen flex flex-col" style={{ background: '#F5F2EE' }}>

      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar — oscuro */}
        <aside className="flex flex-col overflow-y-auto flex-shrink-0" style={{
          width: '220px',
          background: '#181714',
          borderRight: '1px solid #33302B'
        }}>

          <div style={{ margin: '16px 12px', background: '#211F1C', border: '1px solid #33302B', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', color: '#ff4d00', marginTop: '1px' }}>Gestión de Restaurante</div>
            </div>
          </div>

          <nav style={{ padding: '0 8px', flex: 1 }}>
            <SideSection label="General" />
            <SideLink to="/adminRestaurante" end icon="⊞" label="Resumen" />

            <SideSection label="Menú" />
            <SideLink to="/adminRestaurante/platillos"     icon="🍽"  label="Platillos" />
            <SideLink to="/adminRestaurante/cupones"       icon="🏷"  label="Cupones" />
            <SideLink to="/adminRestaurante/promociones"   icon="🔥"  label="Promociones" />
            <SideLink to="/adminRestaurante/eventos"       icon="🎉"  label="Eventos" />

            <SideSection label="Operaciones" />
            <SideLink to="/adminRestaurante/mesas"         icon="▦"   label="Mesas" />
            <SideLink to="/adminRestaurante/reservaciones" icon="📅"  label="Reservaciones" />
            <SideLink to="/adminRestaurante/pedidos"       icon="📋"  label="Pedidos" />
            <SideLink to="/adminRestaurante/reportes"      icon="📊"  label="Reportes" />

            <SideSection label="Configuración" />
            <SideLink to="/adminRestaurante/restaurante"   icon="🏪"  label="Mi Restaurante" />
          </nav>

          <div style={{ padding: '12px', borderTop: '1px solid #33302B' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '10px', cursor: 'pointer',
              color: '#6B6560', fontSize: '13px', transition: '.15s'
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#E05555'; e.currentTarget.style.background = 'rgba(220,60,60,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#6B6560'; e.currentTarget.style.background = 'transparent' }}
            >
              <span>→</span> Cerrar sesión
            </div>
          </div>
        </aside>

        {/* Main — crema cálido */}
        <main className="flex-1 overflow-y-auto p-8" style={{ background: '#F5F2EE' }}>
          <Outlet />
        </main>

      </div>
    </div>
  )
}

const SideSection = ({ label }) => (
  <p style={{
    fontSize: '10px', color: '#6B6560', letterSpacing: '2px',
    textTransform: 'uppercase', fontWeight: 500,
    padding: '16px 12px 6px'
  }}>{label}</p>
)

const SideLink = ({ to, end, icon, label }) => (
  <NavLink to={to} end={end} style={{ textDecoration: 'none' }}>
    {({ isActive }) => (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '9px 12px', borderRadius: '10px', margin: '2px 0',
        fontSize: '13px', fontWeight: isActive ? 500 : 400, transition: '.15s',
        background: isActive ? 'rgba(232,89,26,0.15)' : 'transparent',
        color: isActive ? '#E8591A' : '#A09890', cursor: 'pointer'
      }}>
        <span style={{ fontSize: '16px', width: '20px', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
        {label}
      </div>
    )}
  </NavLink>
)