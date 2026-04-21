import { useAuthStore } from '../../features/auth/store/authStore'
import { useEffect } from 'react'

export const DashboardPage = () => {
    const { user, getProfile } = useAuthStore()

    useEffect(() => {
        if (!user) {
        getProfile()
        }
    }, [])

    return (
        <div>
        <h1>Bienvenido al Dashboard</h1>

        {user && (
            <div>
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role?.name}</p>
            </div>
        )}
        </div>
    )
}