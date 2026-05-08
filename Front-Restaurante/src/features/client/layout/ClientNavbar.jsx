import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/UseCartStore";
import { LogOut, ShoppingCart, User, Settings, ChevronDown } from "lucide-react";
import logoRest from "../../../assets/logo_2.png";
import userIcon from "../../../assets/icon.png";

const getUser = () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        return JSON.parse(atob(token.split(".")[1]));
    } catch { return null; }
};

const NAV_LINKS = [
    { to: "/client",             label: "Explorar",         end: true },
    { to: "/client/pedidos",       label: "Mis Pedidos" },
    { to: "/client/reservaciones", label: "Mis Reservaciones" },
];

export const ClientNavbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleCart = useCartStore((s) => s.toggleCart);
    const totalItems = useCartStore((s) => s.getTotalItems());
    const user = getUser();

    const handleLogout = () => {
        localStorage.removeItem("token");

        setIsMenuOpen(false);

        navigate("/login", { replace: true });

        window.location.reload(); 
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-black/95 backdrop-blur-md border-b border-white/10 shadow-2xl">
            <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center">
                
                {/* 1. LOGO (Solo imagen) */}
                <div className="flex-1 flex justify-start">
                    <NavLink to="/client" className="shrink-0 transition-transform hover:scale-105">
                        <img 
                            src={logoRest} 
                            alt="Logo" 
                            className="w-25 h-25 object-contain"
                        />
                    </NavLink>
                </div>

                {/* 2. NAVEGACIÓN CENTRAL (Centrada absolutamente) */}
                <nav className="hidden lg:flex items-center gap-10">
                    {NAV_LINKS.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `relative py-2 text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                                    isActive ? "text-orange-500" : "text-gray-400 hover:text-white"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {label}
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-orange-500 shadow-[0_0_15px_#f97316]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* 3. ACCIONES DERECHA */}
                <div className="flex-1 flex justify-end items-center gap-6">
                    
                    {/* Botón Carrito */}
                    <button
                        onClick={toggleCart}
                        className="relative p-3 rounded-full text-gray-300 hover:bg-white/10 transition-all"
                    >
                        <ShoppingCart size={22} strokeWidth={2} />
                        {totalItems > 0 && (
                            <span className="absolute top-1 right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-black">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* Perfil con Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-3 p-1 pr-3 rounded-full bg-white/5 hover:bg-white/10 transition-all border border-white/5 group"
                        >
                            {/* Espacio para Imagen de Usuario */}
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-500 shadow-lg shrink-0">
                                <img 
                                    src={userIcon}
                                    alt="User Profile" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Esto es por si la imagen falla, muestra un color sólido
                                        e.target.src = "https://ui-avatars.com/api/?name=User&background=f97316&color=fff";
                                    }}
                                />
                            </div>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* MINI MENÚ DESPLEGABLE */}
                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                                <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                                    <div className="px-4 py-3 border-b border-white/5 mb-2">
                                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">Sesión iniciada como</p>
                                        <p className="text-sm text-white font-bold truncate">{user?.name || "Usuario"}</p>
                                    </div>

                                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white transition-colors text-sm font-medium">
                                        <Settings size={18} />
                                        Opciones de cuenta
                                    </button>

                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-bold"
                                    >
                                        <LogOut size={18} />
                                        Cerrar sesión
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};