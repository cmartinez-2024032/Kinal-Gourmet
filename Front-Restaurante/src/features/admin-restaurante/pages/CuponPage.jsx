import { useEffect, useState } from "react";
import { useCuponStore } from "../store/useCuponStore";
import { CuponModal } from "../components/CuponModal";

const TYPE_STYLES = {
  PERCENTAGE: "bg-violet-100 text-violet-700 border border-violet-200",
  FIXED:      "bg-blue-100 text-blue-700 border border-blue-200",
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

  const filtered    = getFilteredCoupons();
  const totalActive = coupons.filter((c) => c.isActive).length;
  const totalExpired = coupons.filter((c) => c.validUntil && new Date(c.validUntil) < new Date()).length;

  return (
    <div className="w-full min-h-screen font-sans">

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200
          rounded-2xl px-5 py-3.5 mb-6 text-sm text-red-700 shadow-sm">
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
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Cupones</h1>
          <p className="text-stone-400 text-sm mt-0.5">Gestiona descuentos y promociones de código</p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600
            disabled:opacity-60 text-white text-sm font-bold rounded-xl
            transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agregar cupón
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border-t-4 border-t-orange-500 shadow-sm">
          <p className="text-3xl font-bold text-stone-900">{coupons.length}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Total</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-t-4 border-t-emerald-500 shadow-sm">
          <p className="text-3xl font-bold text-stone-900">{totalActive}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Activos</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-t-4 border-t-stone-400 shadow-sm">
          <p className="text-3xl font-bold text-stone-900">{totalExpired}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Expirados</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código o descripción…"
            className="w-full border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm
              text-stone-700 bg-stone-50 placeholder-stone-300
              focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Todos", "PERCENTAGE", "FIXED"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-150
                ${filterType === t
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "bg-stone-50 text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-500"}`}
            >
              {t === "Todos" ? "Todos" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-[3px] border-stone-100 border-t-orange-500 animate-spin" />
          <p className="text-sm text-stone-400">Cargando cupones…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-200 py-20 text-center shadow-sm">
          <p className="text-5xl mb-4">🏷️</p>
          <p className="text-stone-500 font-semibold">No se encontraron cupones</p>
          <p className="text-stone-300 text-sm mt-1">Intenta ajustar la búsqueda o crea uno nuevo</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-5">
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

      {/* Confirm delete modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1100]">
          <div className="bg-white rounded-2xl px-8 py-7 w-96 shadow-2xl border border-stone-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </div>
            <p className="font-bold text-base text-stone-900 mb-1">
              {deleteConfirm.usedCount > 0 ? "Este cupón ya fue usado" : "¿Eliminar este cupón?"}
            </p>
            <p className="text-sm text-stone-400 mb-6">
              {deleteConfirm.usedCount > 0
                ? "Como ya fue utilizado, se desactivará en lugar de eliminarse."
                : `Se eliminará el cupón "${deleteConfirm.code}" permanentemente.`}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-600
                  hover:bg-stone-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => { deleteCoupon(deleteConfirm._id); setDeleteConfirm(null); }}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm
                  font-bold transition-colors shadow-sm"
              >
                {deleteConfirm.usedCount > 0 ? "Desactivar" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Tarjeta de cupón ────────────────────────────────────────────
function CouponCard({ coupon, onEdit, onDelete }) {
  const typeClass = TYPE_STYLES[coupon.discountType] || "bg-stone-100 text-stone-600 border border-stone-200";

  const discountLabel =
    coupon.discountType === "PERCENTAGE"
      ? `${coupon.discountValue}% OFF`
      : `Q ${Number(coupon.discountValue).toFixed(2)} OFF`;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("es-GT", {
      day: "2-digit", month: "short", year: "numeric"
    }) : "—";

  const now      = new Date();
  const isExpired = coupon.validUntil && new Date(coupon.validUntil) < now;
  const isFull   = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

  let statusLabel = "Activo";
  let statusDot   = "bg-emerald-400";
  let statusText  = "text-emerald-600";
  let statusBg    = "bg-emerald-50 border-emerald-200";

  if (!coupon.isActive)  { statusLabel = "Inactivo"; statusDot = "bg-stone-300"; statusText = "text-stone-400"; statusBg = "bg-stone-50 border-stone-200"; }
  else if (isExpired)    { statusLabel = "Expirado"; statusDot = "bg-stone-400"; statusText = "text-stone-500"; statusBg = "bg-stone-50 border-stone-200"; }
  else if (isFull)       { statusLabel = "Agotado";  statusDot = "bg-amber-400"; statusText = "text-amber-600"; statusBg = "bg-amber-50 border-amber-200"; }

  const usagePct = coupon.usageLimit ? Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100) : null;

  return (
    <div className={`group bg-white border-2 rounded-3xl overflow-hidden
      transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
      ${!coupon.isActive || isExpired ? "opacity-60 border-stone-200" : "border-orange-200 hover:border-orange-300"}`}
    >
      {/* Top accent */}
      <div className={`h-1.5 w-full ${!coupon.isActive || isExpired ? "bg-stone-300" : "bg-gradient-to-r from-orange-400 to-orange-500"}`} />

      {/* Discount hero */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-3xl font-black text-orange-500 leading-none">{discountLabel}</p>
          <p className="text-xs font-mono font-bold text-stone-400 mt-1.5 tracking-[0.2em] uppercase">
            {coupon.code}
          </p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold ${statusBg} ${statusText}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
          {statusLabel}
        </div>
      </div>

      <div className="px-5 pb-5 space-y-4">
        {/* Type badge + description */}
        <div>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-2 ${typeClass}`}>
            {TYPE_LABELS[coupon.discountType]}
          </span>
          {coupon.description && (
            <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">{coupon.description}</p>
          )}
        </div>

        {/* Details grid */}
        <div className="bg-stone-50 rounded-2xl p-3 space-y-1.5 border border-stone-100">
          <p className="text-xs text-stone-500">📅 <span className="text-stone-600">{formatDate(coupon.validFrom)}</span> → <span className="text-stone-600">{formatDate(coupon.validUntil)}</span></p>
          {coupon.minPurchaseAmount > 0 && (
            <p className="text-xs text-stone-500">🛒 Compra mínima: <span className="font-semibold text-stone-700">Q {Number(coupon.minPurchaseAmount).toFixed(2)}</span></p>
          )}
          {coupon.maxDiscount && (
            <p className="text-xs text-stone-500">🔒 Máx. descuento: <span className="font-semibold text-stone-700">Q {Number(coupon.maxDiscount).toFixed(2)}</span></p>
          )}
          {coupon.newUsersOnly && (
            <p className="text-xs text-stone-500">🆕 Solo nuevos usuarios</p>
          )}
        </div>

        {/* Usage bar */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Usos</p>
            <p className="text-xs font-bold text-stone-700">
              {coupon.usedCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}
            </p>
          </div>
          {usagePct !== null && (
            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${usagePct >= 100 ? "bg-red-400" : usagePct > 70 ? "bg-amber-400" : "bg-emerald-400"}`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onEdit}
            className="flex-1 py-2 rounded-xl border-2 border-orange-200 bg-orange-50
              text-xs font-bold text-orange-600 hover:bg-orange-100 hover:border-orange-300
              transition-all duration-150"
          >
            ✏️ Editar
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-2 rounded-xl border-2 border-red-200 bg-red-50
              text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500
              transition-all duration-150"
          >
            {coupon.usedCount > 0 ? "⊘ Desactivar" : "🗑 Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}