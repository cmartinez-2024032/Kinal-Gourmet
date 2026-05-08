import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurantClientStore } from "../store/UseRestaurantClientStore";
import { Search, SlidersHorizontal, MapPin, Star, X, UtensilsCrossed } from "lucide-react";

const FEATURE_FILTERS = [
    { key: "hasDelivery", label: "🛵 Delivery" },
    { key: "acceptsReservations", label: "📅 Reservas" },
    { key: "hasWifi", label: "📶 WiFi" },
    { key: "hasParking", label: "🅿️ Parqueo" },
    { key: "hasOutdoorSeating", label: "🌿 Exterior" },
];

export const HomePage = () => {
    const navigate = useNavigate();
    const {
        loading, searchTerm, filterCategory, filterFeature,
        fetchRestaurants, getFiltered, getCategories, getCategoryLabel,
        setSearchTerm, setFilterCategory, setFilterFeature,
        clearFilters,
    } = useRestaurantClientStore();

    useEffect(() => { fetchRestaurants(); }, []);

    const filtered = getFiltered();
    const categories = getCategories();

    return (
        <div className="w-full min-h-screen bg-white pb-20">
            
            {/* 1. SECCIÓN HERO: Imagen de fondo y altura reducida */}
            <header className="relative w-full h-[400px] flex items-center overflow-hidden">
                {/* Imagen de fondo con Overlay para legibilidad */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070" 
                        className="w-full h-full object-cover"
                        alt="Hero Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                </div>
                
                <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">
                    <div className="max-w-4xl">
                        {/* Texto en una sola línea */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter whitespace-nowrap mb-4">
                            ¿Qué se te antoja <span className="text-orange-500 font-serif italic">hoy</span>?
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl font-light">
                            Explora la excelencia gastronómica de Guatemala.
                        </p>

                        {/* Buscador */}
                        <div className="relative group max-w-xl">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={22} />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Busca un restaurante o especialidad..."
                                className="w-full pl-16 pr-6 py-5 rounded-2xl text-lg text-gray-900 bg-white border-none shadow-2xl outline-none"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. CONTENIDO PRINCIPAL */}
            <main className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16 mt-12 space-y-10">
                
                {/* Sección de Filtros Unificados */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={18} className="text-orange-500" strokeWidth={3} />
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest">Explorar</h2>
                        </div>
                        {(searchTerm || filterCategory !== "Todas" || filterFeature) && (
                            <button onClick={clearFilters} className="font-black text-orange-600 hover:bg-orange-50 rounded-lg px-3 py-1.5 transition-all flex items-center gap-1 uppercase tracking-widest">
                                REINICIAR FILTROS
                            </button>
                        )}
                    </div>

                    {/* Botones de Categorías y Características con el mismo estilo */}
                    <div className="flex flex-col gap-4">
                        {/* Categorías */}
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-8 py-3 rounded-xl text-sm font-black whitespace-nowrap transition-all border-2
                                        ${filterCategory === cat
                                            ? "bg-black text-white border-black shadow-lg scale-105"
                                            : "bg-gray-50 text-gray-500 border-transparent hover:border-gray-200"}`}
                                >
                                    {getCategoryLabel(cat).toUpperCase()}
                                </button>
                            ))}
                        </div>

                        {/* Características (Mismo estilo que categorías) */}
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {FEATURE_FILTERS.map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilterFeature(filterFeature === key ? null : key)}
                                    className={`px-6 py-3 rounded-xl text-sm font-black whitespace-nowrap transition-all border-2
                                        ${filterFeature === key
                                            ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-100"
                                            : "bg-gray-50 text-gray-500 border-transparent hover:border-gray-200"}`}
                                >
                                    {label.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. GRID DE RESULTADOS */}
                <section>
                    {loading ? (
                        <div className="flex flex-col items-center py-20">
                            <div className="w-12 h-12 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin mb-4" />
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Cargando...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] py-24 text-center">
                            <UtensilsCrossed size={50} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-xl font-bold text-gray-900">No hay coincidencias</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filtered.map((r) => (
                                <RestaurantCard
                                    key={r._id}
                                    restaurant={r}
                                    onClick={() => navigate(`/client/restaurante/${r._id}`)}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

/* Card de Restaurante */
function RestaurantCard({ restaurant: r, onClick }) {
    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
        >
            <div className="relative h-56 overflow-hidden">
                {r.photo ? (
                    <img src={r.photo} alt={r.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full bg-orange-50 flex items-center justify-center text-5xl">🍽</div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black uppercase text-gray-800">
                        {r.category?.replace("_", " ")}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-tight italic">
                        {r.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-400 px-2 py-0.5 rounded-lg">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[10px] font-black">{r.averageRating > 0 ? r.averageRating.toFixed(1) : "NUEVO"}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400 mb-4">
                    <MapPin size={14} />
                    <p className="text-[11px] truncate">{r.address}</p>
                </div>
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="text-lg font-black text-gray-900">Q{r.averagePrice || 0}</div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase">Ver menú →</span>
                </div>
            </div>
        </div>
    );
}