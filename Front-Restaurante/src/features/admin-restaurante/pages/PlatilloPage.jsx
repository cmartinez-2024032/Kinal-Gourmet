import { useEffect, useState } from "react";
import { usePlatilloStore } from "../store/UsePlatilloStore";
import {PlatilloModal} from "../components/PlatilloModal";

const CATEGORY_STYLES = {
  ENTRADA:        "bg-amber-100 text-amber-800",
  PLATO_FUERTE:   "bg-blue-100 text-blue-800",
  POSTRE:         "bg-pink-100 text-pink-700",
  BEBIDA:         "bg-emerald-100 text-emerald-800",
  GUARNICION:     "bg-violet-100 text-violet-800",
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
    <div className="p-7 w-full min-h-screen font-sans">

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200
          rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-400 hover:text-red-600 text-base leading-none ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platillos</h1>
          <p className="text-sm text-gray-400 mt-1">
            {dishes.length} en total · {totalActive} disponibles
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={loading}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60
            text-white text-sm font-semibold rounded-xl transition-colors"
        >
          + Agregar platillo 
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar platillo…"
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm w-56
            outline-none focus:border-orange-400 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${filterCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-9 h-9 rounded-full border-[3px] border-gray-100 border-t-orange-500 animate-spin" />
          <p className="text-sm text-gray-400">Cargando platillos…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-3">🍽️</p>
          <p className="text-gray-400 text-sm">No se encontraron platillos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1100]">
          <div className="bg-white rounded-2xl px-8 py-7 w-80 shadow-2xl">
            <p className="font-semibold text-base text-gray-900 mb-1">¿Deseas eliminar este platillo?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700
                  hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { deleteDish(deleteConfirm); setDeleteConfirm(null); }}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600
                  text-white text-sm font-semibold transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Estilo de la tarjeta a mostrar el platillo */
function DishCard({ dish, onEdit, onDelete }) {
  const typeClass = CATEGORY_STYLES[dish.type] || "bg-gray-100 text-gray-600";

  // Convierte Decimal128 de MongoDB a número legible
  const price = parseFloat(dish.price?.$numberDecimal ?? dish.price ?? 0);

  return (
    <div className={`bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm
      hover:shadow-md transition-shadow ${!dish.isAvailable ? "opacity-60" : ""}`}>
      {dish.image && (
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-40 object-cover"
          onError={(e) => { e.target.style.display = "none"; }}
        />
      )}
      <div className="p-4">
        <div className="flex gap-2 flex-wrap mb-3">
          {/* Tipo */}
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${typeClass}`}>
            {dish.type}
          </span>
          {/* Categoría si no es NINGUNA */}
          {dish.category && dish.category !== "NINGUNA" && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
              {dish.category}
            </span>
          )}
          {/* Disponibilidad */}
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold
            ${dish.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-400"}`}>
            {dish.isAvailable ? "Disponible" : "No disponible"}
          </span>
        </div>

        <h3 className="font-semibold text-sm text-gray-900 mb-1">{dish.name}</h3>

        {dish.description && (
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-2">
                {dish.description}
            </p>
        )}

        {/* Ingredientes */}
        {dish.ingredients?.length > 0 && (
            <p className="text-xs text-gray-600 font-medium mb-3 line-clamp-2">
                🧂 {dish.ingredients.join(", ")}
            </p>
        )}

        <p className="text-lg font-bold text-orange-500 mb-4">
          Q {price.toFixed(2)}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-xs text-orange-600
                hover:bg-orange-100 hover:border-orange-300 transition-colors font-medium"
            >
            Editar
         </button>
          <button
            onClick={onDelete}
            className="flex-1 py-1.5 rounded-lg border border-red-400 bg-red-500 text-xs
                text-white hover:bg-red-600 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}