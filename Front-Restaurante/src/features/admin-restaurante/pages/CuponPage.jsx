import { useEffect, useState } from "react";
import { useCuponStore } from "../store/useCuponStore";
import { CuponModal } from "../components/CuponModal";

const TYPE_STYLES = {
  PERCENTAGE: "bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-violet-500/10",
  FIXED:      "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/10",
};

const TYPE_LABELS = {
  PERCENTAGE: "Porcentaje",
  FIXED:      "Monto fijo",
};

export const CuponPage = () => {
  const {
    coupons, searchTerm, filterType, loading, error,
    getFilteredCoupons, getCoupons,
    openCreateModal, openEditModal, deleteCoupon,
    setSearchTerm, setFilterType, clearError,
  } = useCuponStore();

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { getCoupons(); }, []);

  const filtered     = getFilteredCoupons();
  const totalActive  = coupons.filter((c) => c.isActive).length;
  const totalExpired = coupons.filter((c) => c.validUntil && new Date(c.validUntil) < new Date()).length;

  return (
    <div className="w-full min-h-screen text-[#F2EDE8] relative overflow-x-hidden p-6 md:p-8 bg-[#0F0E0D]">
      
      {/* Cinematic Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-700/5 blur-[100px]" />
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between mb-8 bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-2xl px-6 py-4 text-sm text-red-200 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="flex items-center gap-3 font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">!</span> 
            {error}
          </span>
          <button onClick={clearError} className="hover:rotate-90 transition-transform duration-300 text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-orange-500 to-orange-700 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
            <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Cupones
            </h1>
          </div>
          <p className="text-sm font-medium text-[#A09890] pl-6">Gestiona descuentos y promociones de código</p>
        </div>

        <button
          onClick={openCreateModal}
          disabled={loading}
          className="group relative flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-2xl font-black transition-all duration-500 hover:bg-orange-700 hover:shadow-[0_15px_35px_-10px_rgba(234,88,12,0.4)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-40"
        >
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-white">Agregar cupón</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total", val: coupons.length, color: "from-orange-500/20 to-orange-500/5", border: "border-orange-500/30" },
          { label: "Activos", val: totalActive, color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30" },
          { label: "Expirados", val: totalExpired, color: "from-red-500/20 to-red-500/5", border: "border-red-500/30" }
        ].map((stat, i) => (
          <div key={i} className={`bg-white/[0.03] backdrop-blur-xl border ${stat.border} rounded-3xl p-6 relative overflow-hidden group`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <p className="text-3xl font-black text-white relative z-10" style={{ fontFamily: 'Syne, sans-serif' }}>{stat.val}</p>
            <p className="text-[10px] text-[#A09890] mt-1 font-black uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Glassmorphic Toolbar */}
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 mb-10 shadow-2xl relative overflow-hidden">
        <div className="relative mb-6">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6560]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código o descripción…"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium text-white placeholder-[#6B6560] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/30 focus:bg-white/[0.06] transition-all duration-300"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-black text-[#6B6560] uppercase tracking-[0.2em] mr-2">Filtrar Tipo</span>
          {["Todos", "PERCENTAGE", "FIXED"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 border ${
                filterType === t
                  ? "bg-white text-black border-white shadow-lg scale-105"
                  : "bg-white/5 border-white/5 text-[#A09890] hover:border-white/20 hover:text-white hover:bg-white/10"
              }`}
            >
              {t === "Todos" ? "Todos" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-white/5 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-xs font-black text-[#6B6560] tracking-widest uppercase animate-pulse">Cargando Cupones</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[40px] py-32 text-center backdrop-blur-sm">
          <span className="text-5xl block mb-6 filter grayscale opacity-50">🏷️</span>
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Sin resultados</h3>
          <p className="text-[#6B6560] font-medium">No hay cupones que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((coupon) => (
            <CouponCard
              key={coupon._id}
              coupon={coupon}
              onEdit={() => openEditModal(coupon)}
              onDelete={() => setDeleteConfirm(coupon)}
            />
          ))}
        </div>
      )}

      <CuponModal />

      {/* Confirm Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[2000] p-6 animate-in fade-in duration-300">
          <div className="bg-[#1C1A17] border border-white/10 rounded-[40px] p-10 max-w-sm w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-8 mx-auto border border-red-500/20">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-4 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>
              {deleteConfirm.usedCount > 0 ? "Desactivar cupón" : "¿Eliminar cupón?"}
            </h2>
            <p className="text-[#A09890] mb-10 text-center font-medium leading-relaxed">
              {deleteConfirm.usedCount > 0
                ? "Este cupón ya tiene historial de uso. Para mantener la integridad de los datos, lo desactivaremos."
                : `Se borrará el código "${deleteConfirm.code}" permanentemente.`}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 rounded-2xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10">Cancelar</button>
              <button onClick={() => { deleteCoupon(deleteConfirm._id); setDeleteConfirm(null); }} className="flex-1 py-4 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/20">
                {deleteConfirm.usedCount > 0 ? "Desactivar" : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function CouponCard({ coupon, onEdit, onDelete }) {
  const typeClass = TYPE_STYLES[coupon.discountType] || "bg-white/5 text-white border-white/10";
  const discountLabel = coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `Q ${Number(coupon.discountValue).toFixed(2)} OFF`;
  const formatDate = (d) => d ? new Date(d).toLocaleDateString("es-GT", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  
  const now = new Date();
  const isExpired = coupon.validUntil && new Date(coupon.validUntil) < now;
  const isFull = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

  let statusLabel = "Activo";
  let statusClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10";
  let statusDot = "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]";

  if (!coupon.isActive) { statusLabel = "Inactivo"; statusDot = "bg-stone-500"; statusClass = "bg-stone-500/10 text-stone-400 border-stone-500/20"; }
  else if (isExpired) { statusLabel = "Expirado"; statusDot = "bg-red-400"; statusClass = "bg-red-500/10 text-red-400 border-red-500/20"; }
  else if (isFull) { statusLabel = "Agotado"; statusDot = "bg-amber-400"; statusClass = "bg-amber-500/10 text-amber-400 border-amber-500/20"; }

  const usagePct = coupon.usageLimit ? Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100) : null;

  return (
    <div className={`group relative bg-white/[0.04] border border-white/5 rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:border-white/20 hover:-translate-y-2 ${!coupon.isActive || isExpired ? "opacity-60" : ""}`}>
      
      {/* Top Accent Gradient */}
      <div className={`h-1.5 w-full ${!coupon.isActive || isExpired ? "bg-white/10" : "bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.3)]"}`} />

      <div className="p-7 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-3xl font-black text-white leading-none tracking-tight mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              {discountLabel}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black font-mono text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded tracking-widest uppercase">
                {coupon.code}
              </span>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider backdrop-blur-xl ${statusClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
            {statusLabel}
          </div>
        </div>

        <div className="flex-1 space-y-4 mb-6">
          <div className="space-y-1">
            <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border backdrop-blur-xl ${typeClass}`}>
              {TYPE_LABELS[coupon.discountType]}
            </span>
            {coupon.description && (
              <p className="text-sm text-[#A09890] leading-relaxed line-clamp-2 font-medium italic">{coupon.description}</p>
            )}
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-2">
            <p className="text-[11px] text-[#6B6560] font-bold flex items-center gap-2">
              📅 <span className="text-white/80">{formatDate(coupon.validFrom)} — {formatDate(coupon.validUntil)}</span>
            </p>
            {coupon.minPurchaseAmount > 0 && (
              <p className="text-[11px] text-[#6B6560] font-bold flex items-center gap-2">
                🛒 Mínimo: <span className="text-orange-400">Q{Number(coupon.minPurchaseAmount).toFixed(2)}</span>
              </p>
            )}
            {coupon.newUsersOnly && (
              <p className="text-[11px] text-emerald-400 font-black">🆕 Solo nuevos usuarios</p>
            )}
          </div>
        </div>

        {/* Usage status */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <p className="text-[10px] font-black text-[#6B6560] uppercase tracking-widest">Utilización</p>
            <p className="text-xs font-black text-white">
              {coupon.usedCount} <span className="text-[#6B6560] font-medium">{coupon.usageLimit ? `/ ${coupon.usageLimit}` : "/ ∞"}</span>
            </p>
          </div>
          {usagePct !== null && (
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  usagePct >= 100 ? "bg-red-500" : usagePct > 70 ? "bg-orange-500" : "bg-emerald-500"
                }`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all duration-300 active:scale-95 shadow-lg"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#6B6560] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}