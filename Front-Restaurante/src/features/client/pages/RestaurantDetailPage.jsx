import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DishCard } from "../components/DishCard";
import { useCartStore } from "../store/UseCartStore";

import { getRestaurantByIdRequest } from "../../../shared/api/restaurants.js";
import { getDishesRequest } from "../../../shared/api/platillos.js";

const DISH_TYPES = [
    { value: "TODOS",        label: "Todos" },
    { value: "ENTRADA",      label: "Entradas" },
    { value: "PLATO_FUERTE", label: "Platos fuertes" },
    { value: "POSTRE",       label: "Postres" },
    { value: "BEBIDA",       label: "Bebidas" },
    { value: "GUARNICION",   label: "Guarniciones" },
];

export const RestaurantDetailPage = () => {
    const { id }     = useParams();
    const navigate   = useNavigate();
    
    // Zustand Store
    const openCart   = useCartStore((s) => s.openCart);
    const totalItems = useCartStore((s) => s.getTotalItems());
    const cartRestId = useCartStore((s) => s.restaurantId);

    // Estados locales
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
                setError(null);

                // Ejecutamos ambas peticiones en paralelo usando apis del backend
                const [restRes, dishRes] = await Promise.all([
                    getRestaurantByIdRequest(id),
                    getDishesRequest()
                ]);

                // Ajuste de data según la respuesta de tu backend
                const restData = restRes.data?.restaurant ?? restRes.data;
                const allDishes = dishRes.data?.dishes ?? dishRes.data?.data ?? [];

                setRestaurant(restData);
                
                // Filtramos los platos que pertenecen a este restaurante específicamente
                const restaurantDishes = allDishes.filter(
                    (d) => d.restaurant === id || d.restaurant?._id === id
                );
                setDishes(restaurantDishes);

            } catch (err) {
                console.error("Error al cargar detalle:", err);
                setError(err.response?.data?.message || "Error al cargar el restaurante");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [id]);

    // Lógica de filtrado en el cliente (por tipo y búsqueda)
    const filteredDishes = dishes.filter((d) => {
        const matchType   = activeType === "TODOS" || d.type === activeType;
        const matchSearch = d.name.toLowerCase().includes(searchDish.toLowerCase());
        return matchType && matchSearch;
    });

    // Agrupación de platos por categoría para el diseño
    const grouped = DISH_TYPES.filter((t) => t.value !== "TODOS").reduce((acc, { value, label }) => {
        const items = filteredDishes.filter((d) => d.type === value);
        if (items.length > 0) acc.push({ type: value, label, items });
        return acc;
    }, []);

    const untyped = filteredDishes.filter((d) => !d.type);
    if (untyped.length > 0) grouped.push({ type: "OTRO", label: "Otros", items: untyped });

    // Renderizado de estados de carga y error
    if (loading) return (
        <div className="flex flex-col items-center py-24 gap-3">
            <div className="w-9 h-9 rounded-full border-[3px] border-gray-100 border-t-orange-500 animate-spin" />
            <p className="text-sm text-gray-400">Cargando menú…</p>
        </div>
    );

    if (error || !restaurant) return (
        <div className="text-center py-24">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-gray-500 text-sm font-medium">{error || "No se encontró el restaurante"}</p>
            <button onClick={() => navigate("/client")} className="mt-4 px-5 py-2 bg-orange-500 text-white rounded-xl">
                Volver al inicio
            </button>
        </div>
    );

    const isCartFromHere = cartRestId === id;

    return (
        <div className="space-y-6 pb-24">
            <button onClick={() => navigate("/client")} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors">
                ← Volver
            </button>

            {/* Banner del Restaurante */}
            <div className="relative rounded-2xl overflow-hidden h-52 bg-gray-200">
                {restaurant.photo && (
                    <img src={restaurant.photo} alt={restaurant.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-5 text-white">
                    <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                    <p className="text-sm text-white/80">{restaurant.address}</p>
                </div>
            </div>

            {/* Info rápida */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <InfoCard icon="⭐" label="Calificación" value={restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "Nuevo"} />
                <InfoCard icon="💰" label="Precio" value={`Q${restaurant.averagePrice || '---'}`} />
                <InfoCard icon="🕐" label="Horario" value={`${restaurant.openingHours} - ${restaurant.closingHours}`} />
                <InfoCard icon="📞" label="Teléfono" value={restaurant.phone} />
            </div>

            {/* Listado de Platos */}
            <div className="pt-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Nuestro Menú</h2>
                
                {/* Filtros */}
                <div className="space-y-4 mb-8">
                    <input
                        value={searchDish}
                        onChange={(e) => setSearchDish(e.target.value)}
                        placeholder="Buscar en el menú..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                    />
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {DISH_TYPES.map(({ value, label }) => (
                            <button
                                key={value}
                                onClick={() => setActiveType(value)}
                                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all shrink-0
                                    ${activeType === value ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600"}`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Renderizado de platos por categorías */}
                {grouped.length > 0 ? (
                    grouped.map(({ label, items }) => (
                        <div key={label} className="mb-10">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{label}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <p className="text-center text-gray-400 py-10">No se encontraron platillos con esos filtros.</p>
                )}
            </div>

            {/* Botón Flotante del Carrito */}
            {isCartFromHere && totalItems > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                    <button onClick={openCart} className="flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-full shadow-2xl hover:scale-105 transition-transform">
                        <span>🛒 Ver Carrito</span>
                        <span className="bg-white text-orange-600 px-2 py-0.5 rounded-full text-xs font-bold">{totalItems}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

// Componente pequeño para las tarjetas de información superior
const InfoCard = ({ icon, label, value }) => (
    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <p className="text-[10px] text-gray-400 uppercase font-bold">{icon} {label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
    </div>
);