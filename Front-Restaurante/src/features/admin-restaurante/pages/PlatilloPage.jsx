import { useEffect, useState } from "react";
import { usePlatilloStore } from "../store/usePlatilloStore";
import { PlatilloModal } from "../components/PlatilloModal";

const CATEGORY_STYLES = {
  ENTRADA:      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  PLATO_FUERTE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  POSTRE:       "bg-pink-500/10 text-pink-400 border-pink-500/20",
  BEBIDA:       "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  GUARNICION:   "bg-violet-500/10 text-violet-400 border-violet-500/20",
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
    <div className="w-full min-h-screen text-[#F2EDE8]">

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-500/10 border border-red-500/25 rounded-xl px-5 py-3 mb-6 text-sm text-red-400">
          <span>⚠ {error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-red-300 ml-4 bg-transparent border-none cursor-pointer text-base">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-7 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F2EDE8] tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Platillos
          </h1>
          <p className="text-sm text-[#6B6560] mt-1">
            {dishes.length} registrados ·{" "}
            <span className="text-emerald-400 font-semibold">{totalActive} disponibles</span>
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-50
            text-white text-sm font-semibold rounded-xl transition-all duration-150 hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Platillo
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-[#1C1A17] border border-[#33302B] rounded-2xl p-4 mb-6 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o ingredientes…"
            className="w-full bg-[#211F1C] border border-[#33302B] rounded-xl pl-10 pr-4 py-2.5
              text-sm text-[#F2EDE8] placeholder-[#6B6560]
              focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10 transition-all"
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-[#6B6560] uppercase tracking-widest mr-1">Categoría</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150
                ${filterCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-[#211F1C] text-[#A09890] border-[#33302B] hover:border-orange-500/40 hover:text-orange-400"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center py-24 gap-4">
          <div className="w-9 h-9 rounded-full border-2 border-[#33302B] border-t-orange-500 animate-spin" />
          <p className="text-sm text-[#6B6560] font-medium">Cargando menú…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#1C1A17] border-2 border-dashed border-[#33302B] rounded-2xl py-24 text-center">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="text-[#A09890] font-bold text-base">No hay platillos aquí</p>
          <p className="text-[#6B6560] text-sm mt-1">Intenta cambiar el filtro o agrega uno nuevo</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(270px,1fr))] gap-5">
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

      {/* Confirm delete */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1100] p-4">
          <div className="bg-[#1C1A17] border border-[#33302B] rounded-2xl p-7 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </div>
            <p className="font-bold text-lg text-[#F2EDE8] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>¿Eliminar platillo?</p>
            <p className="text-sm text-[#6B6560] mb-6 leading-relaxed">Esta acción no se puede deshacer y el platillo desaparecerá del menú.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 rounded-xl border border-[#33302B] text-sm text-[#A09890]
                  hover:bg-[#211F1C] transition-colors font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={() => { deleteDish(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 py-3 rounded-xl bg-red-500/90 hover:bg-red-500 text-white text-sm font-bold transition-all"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Dish Card ──────────────────────────────────────────────────────
function DishCard({ dish, onEdit, onDelete }) {
  const typeStyle = CATEGORY_STYLES[dish.type] || "bg-[#33302B] text-[#A09890] border-[#33302B]";
  const price = parseFloat(dish.price?.$numberDecimal ?? dish.price ?? 0);

  return (
    <div className={`group bg-[#1C1A17] border rounded-2xl overflow-hidden flex flex-col transition-all duration-300
      hover:-translate-y-1 hover:border-orange-500/30 hover:shadow-xl hover:shadow-black/30
      ${!dish.isAvailable ? "opacity-50 border-[#2A2723]" : "border-[#33302B]"}`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden m-2 rounded-xl">
        {dish.image ? (
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full bg-[#211F1C] flex items-center justify-center text-3xl">
            🍲
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${typeStyle}`}>
            {dish.type}
          </span>
          {!dish.isAvailable && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-red-400 border border-red-500/20">
              Agotado
            </span>
          )}
        </div>
      </div>

      <div className="p-4 pt-2 flex flex-col flex-1">
        {dish.category && dish.category !== "NINGUNA" && (
          <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">
            {dish.category}
          </p>
        )}

        <h3 className="font-bold text-base text-[#F2EDE8] mb-1.5 leading-tight group-hover:text-orange-400 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
          {dish.name}
        </h3>

        <div className="flex-1">
          {dish.description && (
            <p className="text-xs text-[#6B6560] leading-relaxed line-clamp-2 mb-2">
              {dish.description}
            </p>
          )}
          {dish.ingredients?.length > 0 && (
            <p className="text-[11px] text-[#A09890] italic line-clamp-1 mb-3">
              🧂 {dish.ingredients.join(", ")}
            </p>
          )}
        </div>

        <div className="mt-auto">
          <p className="text-xl font-extrabold text-[#F2EDE8] mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
            <span className="text-sm font-bold text-orange-500 mr-0.5">Q</span>
            {price.toFixed(2)}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 py-2 rounded-lg border border-orange-500/20 bg-orange-500/5
                text-xs font-semibold text-orange-400 hover:bg-orange-500 hover:text-white hover:border-orange-500
                transition-all duration-150"
            >
              Editar
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2 rounded-lg border border-[#33302B] bg-[#211F1C]
                text-[#6B6560] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20
                transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}