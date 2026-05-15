import { useEffect, useState } from "react";
import { UsePromotionStore } from "../store/usePromotionStore";
import PromotionModal from "../components/PromotionModal";

export const PromotionPage = () => {
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
    <div className="w-full min-h-screen text-[#F2EDE8] relative overflow-x-hidden p-6 md:p-8 bg-[#0F0E0D]">
      
      {/* Cinematic Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-700/5 blur-[100px]" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-orange-500 to-orange-700 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
            <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Promociones
            </h1>
          </div>
          <p className="text-sm font-medium text-[#A09890] pl-6">
            <span className="text-white font-bold">{promotions.length}</span> campañas configuradas · 
            <span className="text-orange-400 font-bold ml-1">Ofertas especiales</span>
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="group relative flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-2xl font-black transition-all duration-500 hover:bg-orange-500 hover:shadow-[0_15px_35px_-10px_rgba(234,88,12,0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-95"
        >
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nueva Promoción</span>
        </button>
      </div>

      {/* Grid Content */}
      {promotions.length === 0 ? (
        <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[40px] py-32 text-center backdrop-blur-sm shadow-2xl">
          <span className="text-6xl block mb-6 filter grayscale opacity-50">🏷️</span>
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Sin campañas activas</h3>
          <p className="text-[#6B6560] font-medium max-w-xs mx-auto">Comienza creando una oferta especial para atraer más clientes a tu negocio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {promotions.map((p) => (
            <div 
              key={p._id} 
              className={`group relative bg-white/[0.04] border border-white/5 rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:border-white/20 hover:-translate-y-2 p-7 ${!p.isActive ? "opacity-50 grayscale" : ""}`}
            >
              {/* Top Accent Gradient */}
              <div className={`absolute top-0 left-0 h-1.5 w-full ${p.isActive ? "bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : "bg-white/10"}`} />

              {/* Badges */}
              <div className="flex justify-between items-center mb-6">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider backdrop-blur-xl
                  ${p.isActive 
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10" 
                    : "bg-white/5 text-[#6B6560] border-white/10"}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-[#6B6560]"}`} />
                  {p.isActive ? "Activa" : "Pausada"}
                </div>
                <span className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-3 py-1 rounded-lg border border-orange-500/20 uppercase tracking-widest">
                  {p.type || "GENERAL"}
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex-1 mb-8">
                <h3 className="text-xl font-extrabold text-white mb-3 leading-tight tracking-tight group-hover:text-orange-400 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {p.title}
                </h3>
                <p className="text-sm text-[#A09890] leading-relaxed line-clamp-3 font-medium italic">
                  {p.description || "Incentiva el consumo con esta oferta especial diseñada para tus mejores clientes."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(p)}
                  className="flex-1 py-3.5 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-wider hover:bg-orange-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 active:scale-95"
                >
                  Editar Plan
                </button>
                <button 
                  onClick={() => setDeleteConfirm(p._id)}
                  className="px-4 flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-[#6B6560] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL SECTION */}
      {open && (
        <PromotionModal
          onClose={() => {
            setOpen(false);
            getPromotions();
          }}
          promotion={selected}
        />
      )}

      {/* DELETE CONFIRMATION OVERLAY */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[2000] p-6 animate-in fade-in duration-300">
          <div className="bg-[#1C1A17] border border-white/10 rounded-[40px] p-10 max-w-sm w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-8 mx-auto border border-red-500/20">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-4 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>¿Eliminar campaña?</h2>
            <p className="text-[#A09890] mb-10 text-center font-medium leading-relaxed">Esta oferta dejará de ser visible para los clientes de forma inmediata.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 rounded-2xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10">Cancelar</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-4 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 active:scale-95">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionPage;