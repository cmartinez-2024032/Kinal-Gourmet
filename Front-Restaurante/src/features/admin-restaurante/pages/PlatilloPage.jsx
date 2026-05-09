import { useEffect, useState } from "react";
import { usePlatilloStore } from "../store/UsePlatilloStore";
import { PlatilloModal } from "../components/PlatilloModal";

const CATEGORY_STYLES = {
  ENTRADA:      "bg-amber-50 text-amber-700 border-amber-100",
  PLATO_FUERTE: "bg-blue-50 text-blue-700 border-blue-100",
  POSTRE:       "bg-pink-50 text-pink-700 border-pink-100",
  BEBIDA:       "bg-emerald-50 text-emerald-700 border-emerald-100",
  GUARNICION:   "bg-violet-50 text-violet-700 border-violet-100",
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
    <div className="w-full min-h-screen font-sans bg-[#FDFCFB]">

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200
          rounded-2xl px-5 py-3.5 mb-6 text-sm text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
          <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-4 transition-colors">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Platillos</h1>
          <p className="text-stone-400 text-sm mt-1">
            {dishes.length} platillos registrados · <span className="text-emerald-500 font-semibold">{totalActive} disponibles</span>
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600
            disabled:opacity-60 text-white text-sm font-bold rounded-2xl
            transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Platillo
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 mb-8 flex flex-col gap-5">
        
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o ingredientes…"
            className="w-full border border-stone-200 rounded-2xl pl-11 pr-4 py-3 text-sm
              text-stone-700 bg-stone-50 placeholder-stone-300
              focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all"
          />
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.15em] mr-2">Categoría</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200
                ${filterCategory === cat
                  ? "bg-stone-900 text-white border-stone-900 shadow-md"
                  : "bg-white text-stone-500 border-stone-200 hover:border-orange-300 hover:text-orange-500"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex flex-col items-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-[3px] border-stone-100 border-t-orange-500 animate-spin" />
          <p className="text-sm text-stone-400 font-medium">Actualizando menú…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-stone-100 py-24 text-center">
          <p className="text-5xl mb-4">🍽️</p>
          <p className="text-stone-500 font-bold text-lg">No hay platillos aquí</p>
          <p className="text-stone-300 text-sm mt-1 font-medium">Intenta cambiar el filtro o agrega uno nuevo</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
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
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-[1100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </div>
            <p className="font-black text-xl text-stone-900 mb-2">¿Eliminar platillo?</p>
            <p className="text-sm text-stone-400 mb-8 leading-relaxed">Esta acción no se puede deshacer y el platillo desaparecerá del menú digital.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3.5 rounded-2xl border border-stone-200 text-sm text-stone-600
                  hover:bg-stone-50 transition-colors font-bold"
              >
                No, volver
              </button>
              <button
                onClick={() => { deleteDish(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white
                  text-sm font-bold transition-all shadow-lg shadow-red-200"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tarjeta de Platillo ─────────────────────────────────────────────
function DishCard({ dish, onEdit, onDelete }) {
  const typeStyle = CATEGORY_STYLES[dish.type] || "bg-stone-100 text-stone-600 border-stone-200";
  const price = parseFloat(dish.price?.$numberDecimal ?? dish.price ?? 0);

  return (
    <div className={`group bg-white border-2 rounded-[2.5rem] overflow-hidden transition-all duration-300 
      hover:-translate-y-1.5 hover:shadow-2xl flex flex-col
      ${!dish.isAvailable ? "opacity-60 border-stone-100" : "border-transparent hover:border-orange-100 shadow-sm"}`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden m-2 rounded-[2rem]">
        {dish.image ? (
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300 text-4xl">
            🍲
          </div>
        )}
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border backdrop-blur-md ${typeStyle}`}>
            {dish.type}
          </span>
          {!dish.isAvailable && (
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 text-red-500 border border-red-100 shadow-sm">
              Agotado
            </span>
          )}
        </div>
      </div>

      <div className="p-6 pt-2 flex flex-col flex-1">
        {/* Category Label */}
        {dish.category && dish.category !== "NINGUNA" && (
          <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">
            {dish.category}
          </p>
        )}

        <h3 className="font-black text-lg text-stone-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors">
          {dish.name}
        </h3>

        {/* Description & Ingredients */}
        <div className="flex-1">
          {dish.description && (
            <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 mb-3 font-medium">
              {dish.description}
            </p>
          )}

          {dish.ingredients?.length > 0 && (
            <div className="flex items-start gap-1.5 mb-4">
              <span className="text-xs">🧂</span>
              <p className="text-[11px] text-stone-500 font-semibold italic line-clamp-1">
                {dish.ingredients.join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Price & Actions */}
        <div className="mt-auto">
          <p className="text-2xl font-black text-stone-900 mb-5">
            <span className="text-sm font-bold text-orange-500 mr-0.5">Q</span>
            {price.toFixed(2)}
          </p>

          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 py-2.5 rounded-xl border-2 border-orange-100 bg-orange-50/50 
                text-xs font-bold text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500
                transition-all duration-200"
            >
              Editar
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2.5 rounded-xl border-2 border-stone-100 bg-stone-50
                text-stone-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100
                transition-all duration-200"
              title="Eliminar platillo"
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