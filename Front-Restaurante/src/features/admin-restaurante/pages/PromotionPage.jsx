import { useEffect, useState } from "react";
import { UsePromotionStore } from "../store/UsePromotionStore";
import PromotionModal from "../components/PromotionModal";

const PromotionPage = () => {
  const { promotions, getPromotions, deletePromotion } = UsePromotionStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    getPromotions();
  }, []);

  const handleDelete = async (id) => {
    await deletePromotion(id);
    getPromotions();
    setDeleteConfirm(null);
  };

  const handleEdit = (promo) => {
    setSelected(promo);
    setOpen(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFCFB] font-sans pb-10">
      
      {/* HEADER */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4 pt-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Promociones</h1>
          <p className="text-stone-400 text-sm mt-1">
            {promotions.length} campañas configuradas · <span className="text-orange-500 font-semibold">Ofertas activas</span>
          </p>
        </div>

        <button 
          onClick={handleCreate} 
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 
            text-white text-sm font-bold rounded-2xl transition-all duration-200 
            shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Promoción
        </button>
      </div>

      {/* GRID DE PROMOCIONES */}
      {promotions.length === 0 ? (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-stone-100 py-24 text-center">
          <p className="text-5xl mb-4">🏷️</p>
          <p className="text-stone-500 font-bold text-lg">Sin promociones activas</p>
          <p className="text-stone-300 text-sm mt-1">Comienza creando una oferta especial para tus clientes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {promotions.map((p) => (
            <div 
              key={p._id} 
              className={`group bg-white border-2 rounded-[2.5rem] p-6 transition-all duration-300 
                hover:shadow-2xl hover:-translate-y-1.5 flex flex-col
                ${!p.isActive ? "opacity-75 border-stone-100" : "border-transparent shadow-sm hover:border-orange-100"}`}
            >
              {/* Top / Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border
                  ${p.isActive 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                    : "bg-stone-50 text-stone-400 border-stone-100"}`}
                >
                  {p.isActive ? "● Activa" : "○ Inactiva"}
                </div>
                <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-3 py-1 rounded-xl border border-orange-100">
                  {p.type || "GENERAL"}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="text-xl font-black text-stone-900 mb-2 group-hover:text-orange-500 transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-stone-400 leading-relaxed font-medium mb-6">
                  {p.description || "Sin descripción detallada para esta promoción."}
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-2 mt-auto">
                <button 
                  onClick={() => handleEdit(p)}
                  className="flex-1 py-3 rounded-2xl border-2 border-stone-900 bg-stone-900 
                    text-white text-xs font-bold hover:bg-orange-500 hover:border-orange-500 
                    transition-all duration-200"
                >
                  Editar
                </button>
                <button 
                  onClick={() => setDeleteConfirm(p._id)}
                  className="px-4 py-3 rounded-2xl border-2 border-stone-100 bg-stone-50 
                    text-stone-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 
                    transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE EDICIÓN/CREACIÓN */}
      {open && (
        <PromotionModal
          onClose={() => {
            setOpen(false);
            getPromotions();
          }}
          promotion={selected}
        />
      )}

      {/* CONFIRMACIÓN DE ELIMINACIÓN */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-[1100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </div>
            <h3 className="font-black text-xl text-stone-900 mb-2">¿Eliminar promoción?</h3>
            <p className="text-sm text-stone-400 mb-8 leading-relaxed">
              Esta oferta dejará de estar disponible para los clientes inmediatamente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3.5 rounded-2xl border border-stone-200 text-sm text-stone-600 font-bold hover:bg-stone-50"
              >
                Volver
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-200"
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

export default PromotionPage;