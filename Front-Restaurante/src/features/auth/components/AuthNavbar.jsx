import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../../auth/store/useAuthStore"
import logo from "../../../assets/logo_2.png"

export const Navbar = () => {
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)

    const handleLogout = () => {
        logout()
        navigate("/login", { replace: true })
    }

    return (

        <header className="absolute top-0 left-0 w-full z-50 bg-black border-b border-white/10 px-8 py-3 flex justify-center items-center shadow-2xl">

            {/* Logo con redirección a landing */}
            <Link to="/" className="hover:opacity-80 transition-opacity">
                <img
                    src={logo}
                    alt="Kinal Gourmet House"
                    className="h-16 w-auto object-contain"
                />
            </Link>

        </header>
    )
}