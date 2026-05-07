import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantClientStore } from "../store/UseRestaurantClientStore";

const PRICE_RANGE_LABEL = { "$": "Económico", "$$": "Moderado", "$$$": "Elevado", "$$$$": "Premium" };

const FEATURE_FILTERS = [
    { key: "hasDelivery",         label: "🛵 Delivery" },
    { key: "acceptsReservations", label: "📅 Reservaciones" },
    { key: "hasWifi",             label: "📶 WiFi" },
    { key: "hasParking",          label: "🅿️ Parqueo" },
    { key: "hasOutdoorSeating",   label: "🌿 Exterior" },
];

export const HomePage = () => {
    const navigate = useNavigate();
    const {
        loading, error,
        searchTerm, filterCategory, filterFeature,
        fetchRestaurants, getFiltered, getCategories, getCategoryLabel,
        setSearchTerm, setFilterCategory, setFilterFeature,
        clearFilters, clearError,
    } = useRestaurantClientStore();

    useEffect(() => { fetchRestaurants(); }, []);

    const filtered   = getFiltered();
    const categories = getCategories();

    return (
        <div className="space-y-6">

            {/* Error banner */}
            {error && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200
                    rounded-xl px-4 py-3 text-sm text-red-700">
                    <span>{error}</span>
                    <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-4">✕</button>
                </div>
            )}

            {/* Hero / buscador */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl px-6 py-8 text-white">
                <h1 className="text-2xl font-bold mb-1">¿Qué quieres comer hoy?</h1>
                <p className="text-orange-100 text-sm mb-5">
                    Explora restaurantes, realiza tu pedido o reserva una mesa
                </p>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre o dirección…"
                        className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-gray-900
                            outline-none focus:ring-2 focus:ring-white/50 bg-white shadow-sm"
                    />
                </div>
            </div>

            {/* Filtro por característica */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                    onClick={() => setFilterFeature(null)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors shrink-0
                        ${!filterFeature
                            ? "bg-orange-500 text-white border-orange-500"
                            : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"}`}
                >
                    Todos
                </button>
                {FEATURE_FILTERS.map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => setFilterFeature(filterFeature === key ? null : key)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors shrink-0
                            ${filterFeature === key
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Filtro por categoría */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors shrink-0
                            ${filterCategory === cat
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}
                    >
                        {getCategoryLabel(cat)}
                    </button>
                ))}
            </div>

            {/* Resultados */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-500">
                        {loading ? "Cargando…" : `${filtered.length} restaurante${filtered.length !== 1 ? "s" : ""}`}
                    </p>
                    {(searchTerm || filterCategory !== "Todas" || filterFeature) && (
                        <button
                            onClick={clearFilters}
                            className="text-xs text-orange-500 hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-20 gap-3">
                        <div className="w-9 h-9 rounded-full border-[3px] border-gray-100
                            border-t-orange-500 animate-spin" />
                        <p className="text-sm text-gray-400">Buscando restaurantes…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-3">🍽</p>
                        <p className="text-gray-500 font-medium text-sm">No encontramos restaurantes</p>
                        <p className="text-gray-400 text-xs mt-1">Intenta con otros filtros</p>
                        <button
                            onClick={clearFilters}
                            className="mt-4 px-5 py-2 bg-orange-500 hover:bg-orange-600
                                text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            Ver todos
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((r) => (
                            <RestaurantCard
                                key={r._id}
                                restaurant={r}
                                onClick={() => navigate(`/client/restaurante/${r._id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── Card de restaurante ── */
function RestaurantCard({ restaurant: r, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm
                hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
        >
            {/* Foto */}
            <div className="relative h-40 bg-gradient-to-br from-orange-100 to-orange-50 overflow-hidden">
                {r.photo ? (
                    <img
                        src={r.photo}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.style.display = "none"; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🍽</div>
                )}
                {/* Badge categoría */}
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm
                    rounded-full text-[10px] font-semibold text-gray-700 shadow-sm">
                    {r.category?.replace("_", " ")}
                </span>
                {/* Badge precio */}
                {r.priceRange && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-orange-500
                        rounded-full text-[10px] font-bold text-white shadow-sm">
                        {r.priceRange}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm truncate">{r.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{r.address}</p>

                {/* Rating + precio promedio */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                        <span className="text-xs text-yellow-500">★</span>
                        <span className="text-xs font-medium text-gray-700">
                            {r.averageRating > 0 ? r.averageRating.toFixed(1) : "Nuevo"}
                        </span>
                        {r.reviewCount > 0 && (
                            <span className="text-xs text-gray-400">({r.reviewCount})</span>
                        )}
                    </div>
                    {r.averagePrice > 0 && (
                        <span className="text-xs text-gray-500">~Q{r.averagePrice.toFixed(0)}</span>
                    )}
                </div>

                {/* Features rápidas */}
                <div className="flex gap-1.5 mt-2.5 flex-wrap">
                    {r.features?.hasDelivery && (
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                            🛵 Delivery
                        </span>
                    )}
                    {r.features?.acceptsReservations && (
                        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
                            📅 Reservas
                        </span>
                    )}
                    {r.features?.hasWifi && (
                        <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                            📶 WiFi
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}