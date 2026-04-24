import { Navigate } from "react-router-dom"
import { useAuthStore } from "../../features/auth/store/authStore"

export const PrivateRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token)
    const localToken = localStorage.getItem("token")

    if (!token && !localToken) {
        return <Navigate to="/login" replace />
    }

    return children
}