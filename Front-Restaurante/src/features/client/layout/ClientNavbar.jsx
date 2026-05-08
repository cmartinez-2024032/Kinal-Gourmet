import { NavLink, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/UseCartStore";
import logoRest from "../../../assets/logo_2.png";

// Lee el usuario del JWT en localStorage
const getUser = () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
};

const NAV_LINKS = [
    { to: "/client",               label: "Explorar",        end: true },
    { to: "/client/pedidos",       label: "Mis Pedidos" },
    { to: "/client/reservaciones", label: "Mis Reservaciones" },
];

export const ClientNavbar = () => {
    const navigate   = useNavigate();
    const toggleCart = useCartStore((s) => s.toggleCart);
    const totalItems = useCartStore((s) => s.getTotalItems());
    const user       = getUser();

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "?";

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <NavLink to="/client" className="flex items-center gap-2 shrink-0">
    
                    <img 
                        src={logoRest} 
                        alt="Logo RestauranteApp" 
                        className="w-8 h-8 object-contain"
                    />
                    
                    <span className="font-bold text-orange-500 text-base tracking-tight hidden sm:block">
                        Kinal Gourmet
                    </span>
                </NavLink>

                {/* Nav links*/}
                <nav className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-orange-50 text-orange-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Acciones derecha */}
                <div className="flex items-center gap-2">

                    {/* Botón carrito con badge */}
                    <button
                        onClick={toggleCart}
                        className="relative p-2 rounded-xl text-gray-600 hover:bg-orange-50
                            hover:text-orange-500 transition-colors"
                        aria-label="Abrir carrito"
                    >
                        <span className="text-xl leading-none">🛒</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1
                                bg-orange-500 text-white text-[10px] font-bold rounded-full
                                flex items-center justify-center leading-none">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </button>

                    {/* Avatar con nombre */}
                    <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-xs
                            font-bold flex items-center justify-center select-none shrink-0">
                            {initials}
                        </div>
                        <span className="text-sm text-gray-700 font-medium hidden sm:block max-w-[120px] truncate">
                            {user?.name || "Usuario"}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1 hidden sm:block"
                            title="Cerrar sesión"
                        >
                            Salir
                        </button>
                    </div>
                </div>
            </div>

            {/* Nav móvil — barra inferior */}
            <nav className="md:hidden flex border-t border-gray-100">
                {NAV_LINKS.map(({ to, label, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex-1 text-center py-2.5 text-[11px] font-medium transition-colors ${
                                isActive
                                    ? "text-orange-500 border-t-2 border-orange-500 -mt-px bg-orange-50/50"
                                    : "text-gray-500 hover:text-gray-700"
                            }`
                        }
                    >
                        {label}
                    </NavLink>
                ))}
            </nav>
        </header>
    );
};