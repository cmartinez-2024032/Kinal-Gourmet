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
        <header className="bg-white border-b border-stone-100 px-8 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-3">
                <img
                    src={logo}
                    alt="Kinal Gourmet House"
                    className="h-12 w-auto object-contain"
                />
                <div className="hidden md:block w-px h-8 bg-stone-100" />
                <span className="hidden md:block text-xs font-bold text-stone-300 tracking-widest uppercase">
                    Panel de administración
                </span>
            </div>

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 border-2 border-red-200 text-red-400 hover:bg-red-500 hover:text-white hover:border-transparent px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Cerrar sesión
            </button>
        </header>
    )
}