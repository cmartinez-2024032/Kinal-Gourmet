import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../auth/store/authStore"
import logo from "../../../assets/logo_2.png"

export const Navbar = () => {
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)

    const handleLogout = () => {
        logout()
        navigate("/login", { replace: true })
    }

    return (
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center">
            <img
                src={logo}
                alt="Kinal Gourmet House"
                className="h-14 w-auto object-contain"
            />
        </div>

        <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
            Cerrar sesión
        </button>
        </header>
    )
}