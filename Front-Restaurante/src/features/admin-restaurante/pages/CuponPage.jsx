import { useEffect, useState } from "react";
import { useCuponStore } from "../store/UseCuponStore";
import { CuponModal } from "../components/CuponModal";

const TYPE_STYLES = {
    PERCENTAGE: "bg-violet-100 text-violet-800",
    FIXED:      "bg-blue-100  text-blue-800",
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

    return (
        <div className="p-7 w-full min-h-screen font-sans">

            {/* Error banner */}
            {error && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200
                    rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
                    <span>{error}</span>
                    <button
                        onClick={clearError}
                        className="text-red-400 hover:text-red-600 text-base leading-none ml-4"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-7 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Cupones</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {coupons.length} en total · {totalActive} activos
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    disabled={loading}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60
                        text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    + Agregar cupón
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por código o descripción…"
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm w-64
                        outline-none focus:border-orange-400 transition-colors"
                />
                <div className="flex gap-2 flex-wrap">
                    {["Todos", "PERCENTAGE", "FIXED"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilterType(t)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors
                                ${filterType === t
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300"}`}
                        >
                            {t === "Todos" ? "Todos" : TYPE_LABELS[t]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenido */}
            {loading ? (
                <div className="flex flex-col items-center py-20 gap-3">
                    <div className="w-9 h-9 rounded-full border-[3px] border-gray-100
                        border-t-orange-500 animate-spin" />
                    <p className="text-sm text-gray-400">Cargando cupones…</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-5xl mb-3">🏷️</p>
                    <p className="text-gray-400 text-sm">No se encontraron cupones.</p>
                </div>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
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

            {/* Confirm delete */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1100]">
                    <div className="bg-white rounded-2xl px-8 py-7 w-96 shadow-2xl">
                        <p className="font-semibold text-base text-gray-900 mb-1">
                            {deleteConfirm.usedCount > 0
                                ? "Este cupón ya fue usado"
                                : "¿Deseas eliminar este cupón?"}
                        </p>
                        <p className="text-sm text-gray-500 mb-5">
                            {deleteConfirm.usedCount > 0
                                ? "Como ya fue utilizado, se desactivará en lugar de eliminarse."
                                : `Se eliminará el cupón "${deleteConfirm.code}" permanentemente.`}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-sm
                                    text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    deleteCoupon(deleteConfirm._id);
                                    setDeleteConfirm(null);
                                }}
                                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600
                                    text-white text-sm font-semibold transition-colors"
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

// ── Tarjeta de cupón ──────────────────────────────────────────
function CouponCard({ coupon, onEdit, onDelete }) {
    const typeClass = TYPE_STYLES[coupon.discountType] || "bg-gray-100 text-gray-600";

    const discountLabel =
        coupon.discountType === "PERCENTAGE"
            ? `${coupon.discountValue}% OFF`
            : `Q ${Number(coupon.discountValue).toFixed(2)} OFF`;

    const formatDate = (d) =>
        d ? new Date(d).toLocaleDateString("es-GT", {
            day: "2-digit", month: "short", year: "numeric"
        }) : "—";

    const now       = new Date();
    const isExpired = coupon.validUntil && new Date(coupon.validUntil) < now;
    const isFull    = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

    // Estado visual del cupón
    let statusLabel = "Activo";
    let statusClass = "bg-emerald-100 text-emerald-700";
    if (!coupon.isActive)        { statusLabel = "Inactivo";  statusClass = "bg-red-50 text-red-400"; }
    else if (isExpired)          { statusLabel = "Expirado";  statusClass = "bg-gray-100 text-gray-500"; }
    else if (isFull)             { statusLabel = "Agotado";   statusClass = "bg-amber-100 text-amber-700"; }

    return (
        <div className={`bg-white border border-gray-100 rounded-2xl overflow-hidden
            shadow-sm hover:shadow-md transition-shadow
            ${(!coupon.isActive || isExpired) ? "opacity-60" : ""}`}>

            {/* Franja superior con el descuento destacado */}
            <div className="bg-orange-50 border-b border-orange-100 px-5 py-4 flex items-center justify-between">
                <div>
                    <p className="text-xl font-bold text-orange-500">{discountLabel}</p>
                    <p className="text-xs font-mono font-semibold text-gray-500 mt-0.5 tracking-widest">
                        {coupon.code}
                    </p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusClass}`}>
                    {statusLabel}
                </span>
            </div>

            <div className="p-4 space-y-3">
                {/* Tipo */}
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${typeClass}`}>
                    {TYPE_LABELS[coupon.discountType]}
                </span>

                {/* Descripción */}
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {coupon.description}
                </p>

                {/* Detalles */}
                <div className="text-xs text-gray-600 space-y-1">
                    <p>📅 {formatDate(coupon.validFrom)} → {formatDate(coupon.validUntil)}</p>
                    {coupon.minPurchaseAmount > 0 && (
                        <p>🛒 Compra mínima: Q {Number(coupon.minPurchaseAmount).toFixed(2)}</p>
                    )}
                    {coupon.maxDiscount && (
                        <p>🔒 Máx. descuento: Q {Number(coupon.maxDiscount).toFixed(2)}</p>
                    )}
                    <p>
                        🔢 Usos: {coupon.usedCount}
                        {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}
                    </p>
                    {coupon.newUsersOnly && (
                        <p>🆕 Solo nuevos usuarios</p>
                    )}
                </div>

                {/* Acciones */}
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={onEdit}
                        className="flex-1 py-1.5 rounded-lg border border-orange-200 bg-orange-50
                            text-xs text-orange-600 hover:bg-orange-100 hover:border-orange-300
                            transition-colors font-medium"
                    >
                        Editar
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 py-1.5 rounded-lg border border-red-400 bg-red-500
                            text-xs text-white hover:bg-red-600 transition-colors"
                    >
                        {coupon.usedCount > 0 ? "Desactivar" : "Eliminar"}
                    </button>
                </div>
            </div>
        </div>
    );
}