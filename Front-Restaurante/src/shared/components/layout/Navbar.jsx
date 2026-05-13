import { useAuthStore } from '../../../features/auth/store/useAuthStore'
import { useNavigate } from 'react-router-dom'

export const Navbar = () => {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem',
        background: '#222',
        color: '#fff'
        }}>
        <h3>Dashboard</h3>

        <div>
            <span style={{ marginRight: '1rem' }}>
            {user?.name} ({user?.role?.name})
            </span>

            <button onClick={handleLogout}>
            Logout
            </button>
        </div>
        </nav>
    )
}