import { useEffect, useState } from "react";
import { usePlatilloStore } from "../store/usePlatilloStore";
import { PlatilloModal } from "../components/PlatilloModal";

const CATEGORY_STYLES = {
  ENTRADA:      "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10",
  PLATO_FUERTE: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/10",
  POSTRE:       "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/10",
  BEBIDA:       "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10",
  GUARNICION:   "bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-violet-500/10",
};

export const PlatilloPage = () => {
  const {
    dishes, searchTerm, filterCategory, loading, error,
    getFilteredDishes, getCategories, getDishes,
    openCreateModal, openEditModal, deleteDish,
    setSearchTerm, setFilterCategory, clearError,
  } = usePlatilloStore();

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { getDishes(); }, []);

  const filtered    = getFilteredDishes();
  const categories  = getCategories();
  const totalActive = dishes.filter((d) => d.isAvailable).length;

  return (
    <div className="w-full min-h-screen text-[#F2EDE8] relative overflow-x-hidden p-6 md:p-8 bg-[#0F0E0D]">
      
      {/* Cinematic Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-700/5 blur-[100px]" />
      </div>

      {error && (
        <div className="flex items-center justify-between mb-8 bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-2xl px-6 py-4 text-sm text-red-200 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="flex items-center gap-3 font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">!</span> 
            {error}
          </span>
          <button onClick={clearError} className="hover:rotate-90 transition-transform duration-300 text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-orange-500 to-orange-700 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
            <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Platillos
            </h1>
          </div>
          <p className="text-sm font-medium text-[#A09890] pl-6">
            <span className="text-white font-bold">{dishes.length}</span> registrados ·{" "}
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">{totalActive} disponibles</span>
          </p>
        </div>

        <button
          onClick={openCreateModal}
          disabled={loading}
          className="group relative flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-2xl font-black transition-all duration-500 hover:bg-orange-500 hover:shadow-[0_15px_35px_-10px_rgba(234,88,12,0.4)] hover:-translate-y-1 disabled:opacity-40"
        >
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nuevo Platillo</span>
        </button>
      </div>

      {/* Glassmorphic Toolbar */}
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 mb-10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        
        <div className="relative mb-6">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6560]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o ingredientes…"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium text-white placeholder-[#6B6560] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/30 focus:bg-white/[0.06] transition-all duration-300"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-black text-[#6B6560] uppercase tracking-[0.2em] mr-2">Filtros</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                filterCategory === cat
                  ? "bg-white text-black border-white shadow-lg scale-105"
                  : "bg-white/5 border-white/5 text-[#A09890] hover:border-white/20 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-white/5 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-xs font-black text-[#6B6560] tracking-widest uppercase animate-pulse">Cargando Menú</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[40px] py-32 text-center backdrop-blur-sm">
          <span className="text-5xl block mb-6 filter grayscale opacity-50">🍽️</span>
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>No hay resultados</h3>
          <p className="text-[#6B6560] font-medium">Intenta cambiar los filtros o el término de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((dish) => (
            <DishCard
              key={dish._id}
              dish={dish}
              onEdit={() => openEditModal(dish)}
              onDelete={() => setDeleteConfirm(dish._id)}
            />
          ))}
        </div>
      )}

      <PlatilloModal />

      {/* Modern Modal Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[2000] p-6 animate-in fade-in duration-300">
          <div className="bg-[#1C1A17] border border-white/10 rounded-[40px] p-10 max-w-sm w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-8 mx-auto border border-red-500/20">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-4 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>¿Estás seguro?</h2>
            <p className="text-[#A09890] mb-10 text-center font-medium leading-relaxed">Este platillo se eliminará permanentemente de tu base de datos.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 rounded-2xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10">No, volver</button>
              <button onClick={() => { deleteDish(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-4 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/20">Sí, borrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function DishCard({ dish, onEdit, onDelete }) {
  const typeStyle = CATEGORY_STYLES[dish.type] || "bg-white/5 text-white border-white/10";
  const price = parseFloat(dish.price?.$numberDecimal ?? dish.price ?? 0);

  return (
    <div className={`group relative bg-white/[0.04] border border-white/5 rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:border-white/20 hover:-translate-y-2 ${!dish.isAvailable ? "opacity-50" : ""}`}>
      
      {/* Dish Image Container */}
      <div className="relative h-56 overflow-hidden m-3 rounded-[24px]">
        {dish.image ? (
          <img src={dish.image} alt={dish.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full bg-[#1C1A17] flex items-center justify-center text-5xl opacity-40">🍲</div>
        )}
        
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0D] via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border backdrop-blur-xl shadow-lg ${typeStyle}`}>
            {dish.type}
          </span>
          {!dish.isAvailable && (
            <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xl shadow-red-600/20">
              Agotado
            </span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex flex-col flex-1">
        {dish.category && dish.category !== "NINGUNA" && (
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1.5">{dish.category}</span>
        )}

        {/* Improved Legibility Title */}
        <h3 className="text-xl font-extrabold text-white mb-2 leading-tight tracking-tight group-hover:text-orange-400 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
          {dish.name}
        </h3>

        <div className="flex-1 mb-6">
          <p className="text-sm text-[#A09890] leading-relaxed line-clamp-2 font-medium">
            {dish.description || "Inspiración culinaria del chef sin descripción detallada."}
          </p>
          {dish.ingredients?.length > 0 && (
            <p className="text-[11px] font-bold text-orange-500/70 mt-3 flex items-center gap-1">
              🧂 <span className="italic line-clamp-1">{dish.ingredients.join(", ")}</span>
            </p>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-[#6B6560] uppercase tracking-widest mb-1">Precio</span>
              <p className="text-3xl font-black text-white leading-none" style={{ fontFamily: 'Syne, sans-serif' }}>
                <span className="text-sm text-orange-500 mr-1.5 font-bold">Q</span>{price.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 py-3.5 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-wider hover:bg-orange-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 active:scale-95"
            >
              Gestionar
            </button>
            <button
              onClick={onDelete}
              className="px-4 flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-[#6B6560] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}