import { useEffect, useState } from "react";
import { usePromotionStore } from "../store/UsePromotionStore";
import { PromotionModal } from "../components/PromotionModal";

export const PromotionPage = () => {
  const {
    promotions,
    loading,
    error,
    getPromotions,
    getFilteredPromotions,
    openCreateModal,
    openEditModal,
    deletePromotion,
    setSearchTerm,
    clearError,
  } = usePromotionStore();

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    getPromotions();
  }, []);

  const filtered = getFilteredPromotions();

  return (
    <div className="p-7 w-full min-h-screen font-sans">

      {/* Error */}
      {error && (
        <div className="flex justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={clearError}>✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold">Promociones</h1>
          <p className="text-sm text-gray-400">
            {promotions.length} promociones
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-orange-500 text-white rounded-xl"
        >
          + Crear promoción
        </button>
      </div>

      {/* Buscador */}
      <input
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar promoción…"
        className="mb-6 px-4 py-2 border rounded-xl"
      />

      {/* Contenido */}
      {loading ? (
        <p>Cargando…</p>
      ) : filtered.length === 0 ? (
        <p>No hay promociones</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
          {filtered.map((promo) => (
            <PromoCard
              key={promo._id}
              promo={promo}
              onEdit={() => openEditModal(promo)}
              onDelete={() => setDeleteConfirm(promo._id)}
            />
          ))}
        </div>
      )}

      <PromotionModal />

      {/* Confirm delete */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl">
            <p>¿Eliminar promoción?</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button
                onClick={() => {
                  deletePromotion(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function PromoCard({ promo, onEdit, onDelete }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <h3 className="font-bold">{promo.name}</h3>
      <p className="text-sm text-gray-500">{promo.description}</p>

      <p className="text-orange-500 font-bold mt-2">
        {promo.discount}%
      </p>

      <div className="flex gap-2 mt-4">
        <button onClick={onEdit} className="text-orange-600 text-sm">
          Editar
        </button>
        <button onClick={onDelete} className="text-red-500 text-sm">
          Eliminar
        </button>
      </div>
    </div>
  );
}