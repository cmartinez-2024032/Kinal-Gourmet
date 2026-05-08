import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DishCard } from "../components/DishCard";
import { useCartStore } from "../store/UseCartStore";
import { getRestaurantByIdRequest } from "../../../shared/api/restaurants.js";
import { getDishesRequest } from "../../../shared/api/platillos.js";

const DISH_TYPES = [
    { value: "TODOS",        label: "Todos" },
    { value: "ENTRADA",      label: "Entradas" },
    { value: "PLATO_FUERTE", label: "Fuertes" },
    { value: "POSTRE",       label: "Postres" },
    { value: "BEBIDA",       label: "Bebidas" },
    { value: "GUARNICION",   label: "Extras" },
];

export const RestaurantDetailPage = () => {
    const { id }     = useParams();
    const navigate   = useNavigate();
    
    const openCart   = useCartStore((s) => s.openCart);
    const totalItems = useCartStore((s) => s.getTotalItems());
    const cartRestId = useCartStore((s) => s.restaurantId);

    const [restaurant, setRestaurant] = useState(null);
    const [dishes,     setDishes]     = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState(null);
    const [activeType, setActiveType] = useState("TODOS");
    const [searchDish, setSearchDish] = useState("");

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [restRes, dishRes] = await Promise.all([
                    getRestaurantByIdRequest(id),
                    getDishesRequest()
                ]);

                const restData = restRes.data?.restaurant ?? restRes.data;
                const allDishes = dishRes.data?.dishes ?? dishRes.data?.data ?? [];

                setRestaurant(restData);
                const restaurantDishes = allDishes.filter(
                    (d) => d.restaurant === id || d.restaurant?._id === id
                );
                setDishes(restaurantDishes);
            } catch (err) {
                setError(err.response?.data?.message || "Error al cargar el restaurante");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    const filteredDishes = dishes.filter((d) => {
        const matchType   = activeType === "TODOS" || d.type === activeType;
        const matchSearch = d.name.toLowerCase().includes(searchDish.toLowerCase());
        return matchType && matchSearch;
    });

    const grouped = DISH_TYPES.filter((t) => t.value !== "TODOS").reduce((acc, { value, label }) => {
        const items = filteredDishes.filter((d) => d.type === value);
        if (items.length > 0) acc.push({ type: value, label, items });
        return acc;
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center py-40 gap-4">
            <div className="w-12 h-12 rounded-full border-[4px] border-gray-100 border-t-orange-500 animate-spin" />
            <p className="font-black text-gray-400 uppercase tracking-tighter text-xs">Preparando el menú...</p>
        </div>
    );

    if (error || !restaurant) return (
        <div className="text-center py-32 px-10">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🏜️</div>
            <p className="text-gray-900 font-black text-xl">Restaurante no disponible</p>
            <button onClick={() => navigate("/client")} className="mt-6 px-8 py-3 bg-black text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-transform active:scale-95">
                Volver a explorar
            </button>
        </div>
    );

    const isCartFromHere = cartRestId === id;

    return (
        <div className="min-h-screen bg-white">
            {/* HERO CINEMÁTICO */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <img 
                    src={restaurant.photo || "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"} 
                    alt={restaurant.name} 
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-black/20 to-black/40" />
                
                <div className="absolute top-8 left-8">
                    <button 
                        onClick={() => navigate("/client")} 
                        className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                </div>

                <div className="absolute bottom-10 left-8 right-8">
                    <div className="max-w-[1200px] mx-auto">
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block shadow-lg">
                            Abierto ahora
                        </span>
                        <h1 className="text-5xl md:text-7xl font-[900] text-white tracking-tighter drop-shadow-2xl">
                            {restaurant.name}.
                        </h1>
                        <div className="flex items-center gap-4 mt-2 text-white/90">
                            <p className="font-bold text-sm flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="11" r="3"/><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/></svg>
                                {restaurant.address}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-8">
                {/* INFO CARDS SUPERIORES */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-8 relative z-20">
                    <InfoCard 
                        icon={<svg className="text-orange-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>} 
                        label="Rating" 
                        value={restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "Nuevo"} 
                    />
                    <InfoCard 
                        icon={<svg className="text-green-600" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>} 
                        label="Promedio" 
                        value={`Q${restaurant.averagePrice || '0.00'}`} 
                    />
                    <InfoCard 
                        icon={<svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} 
                        label="Horario" 
                        value={`${restaurant.openingHours} - ${restaurant.closingHours}`} 
                    />
                    <InfoCard 
                        icon={<svg className="text-purple-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>} 
                        label="Contacto" 
                        value={restaurant.phone} 
                    />
                </div>

                {/* MENÚ Y FILTROS */}
                <div className="mt-20 flex flex-col md:flex-row gap-12 items-start">
                    {/* Barra lateral de filtros */}
                    <div className="w-full md:w-64 space-y-8 sticky top-8">
                        <div>
                            <h3 className="text-2xl font-[900] tracking-tighter mb-4">Menú.</h3>
                            <div className="relative">
                                <input
                                    value={searchDish}
                                    onChange={(e) => setSearchDish(e.target.value)}
                                    placeholder="Buscar plato..."
                                    className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            {DISH_TYPES.map(({ value, label }) => (
                                <button
                                    key={value}
                                    onClick={() => setActiveType(value)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
                                        ${activeType === value ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-900"}`}
                                >
                                    {label}
                                    {activeType === value && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Contenido del Menú */}
                    <div className="flex-1 pb-32">
                        {grouped.length > 0 ? (
                            grouped.map(({ label, items }) => (
                                <div key={label} className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center gap-4 mb-8">
                                        <h2 className="text-xs font-black text-black uppercase tracking-[0.3em] whitespace-nowrap">{label}</h2>
                                        <div className="h-[1px] w-full bg-gray-100" />
                                    </div>
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        {items.map((dish) => (
                                            <DishCard 
                                                key={dish._id} 
                                                dish={dish} 
                                                restaurantId={id} 
                                                restaurantName={restaurant.name} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center min-h-[450px] text-center border-2 border-dashed border-gray-100 rounded-[40px] px-10">
                                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl">
                                    🍽️
                                </div>
                                <p className="text-gray-400 font-black uppercase text-xs tracking-widest max-w-[200px] leading-relaxed">
                                    Por el momento no hay platillos disponibles en esta categoría
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* BOTÓN FLOTANTE CARRITO PREMIUM */}
            {isCartFromHere && totalItems > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                    <button 
                        onClick={openCart} 
                        className="group flex items-center gap-4 pl-8 pr-3 py-3 bg-black text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
                    >
                        <span className="font-black uppercase text-[10px] tracking-[0.2em]">Ver mi orden</span>
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-black text-sm group-hover:rotate-12 transition-transform">
                            {totalItems}
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};

const InfoCard = ({ icon, label, value }) => (
    <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[24px] border border-gray-100 shadow-xl shadow-black/5 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
        <div className="mb-3 p-2 bg-gray-50 rounded-xl">{icon}</div>
        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">{label}</p>
        <p className="text-sm font-[900] text-gray-900 tracking-tight">{value}</p>
    </div>
);