import { useNavigate, Link } from "react-router-dom"
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
        <header className="bg-black border-b px-8 py-4 flex justify-center items-center shadow-sm">

            {/* Logo con redirección a landing */}
            <Link to="/">
                <img
                    src={logo}
                    alt="Kinal Gourmet House"
                    className="h-14 w-auto object-contain"
                />
            </Link>

        </header>
    )
}