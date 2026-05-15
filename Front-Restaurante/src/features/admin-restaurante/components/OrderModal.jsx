import { useState, useEffect } from "react";
import { useOrderStore }    from "../store/useOrderStore";
import { usePlatilloStore } from "../store/usePlatilloStore";
import { useMesaStore }     from "../store/useMesaStore";
import { useAuthStore }     from "../../auth/store/useAuthStore";

const STATUS_CONFIG = {
    PENDIENTE:      { label: "Pendiente",      badge: "bg-amber-500/15 text-amber-300 border-amber-400/30",     sel: "bg-amber-500/15 text-amber-300 border-amber-400/50" },
    CONFIRMADO:     { label: "Confirmado",     badge: "bg-blue-500/15 text-blue-300 border-blue-400/30",       sel: "bg-blue-500/15 text-blue-300 border-blue-400/50" },
    EN_PREPARACION: { label: "En preparación", badge: "bg-violet-500/15 text-violet-300 border-violet-400/30", sel: "bg-violet-500/15 text-violet-300 border-violet-400/50" },
    LISTO:          { label: "Listo",          badge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30", sel: "bg-emerald-500/15 text-emerald-300 border-emerald-400/50" },
    EN_CAMINO:      { label: "En camino",      badge: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",       sel: "bg-cyan-500/15 text-cyan-300 border-cyan-400/50" },
    ENTREGADO:      { label: "Entregado",      badge: "bg-green-500/15 text-green-300 border-green-400/30",    sel: "bg-green-500/15 text-green-300 border-green-400/50" },
    CANCELADO:      { label: "Cancelado",      badge: "bg-red-500/15 text-red-300 border-red-400/30",          sel: "bg-red-500/15 text-red-300 border-red-400/50" },
};

const ORDER_TYPE_LABELS = {
    EN_MESA:     "🪑 En mesa",
    PARA_LLEVAR: "🥡 Para llevar",
    DOMICILIO:   "🛵 Domicilio",
};

const VALID_STATUSES = Object.keys(STATUS_CONFIG);
const EMPTY_DETAIL   = { dish: "", quantity: 1, unitPrice: 0, specialInstructions: "" };

export const OrderModal = ({ isOpen, onClose, order = null, mode = "view" }) => {
    const { createOrder, updateOrder, updateOrderStatus, cancelOrder, loading } = useOrderStore();

    const { dishes, getDishes, loading: loadingDishes }   = usePlatilloStore();
    const { tables, getTables, loading: loadingTables }   = useMesaStore();
    const { user, getProfile }                             = useAuthStore();

    const isCreate = mode === "create";
    const isEdit   = mode === "edit";
    const isView   = mode === "view";
    const isStatus = mode === "status";
    const canEdit  = isCreate || isEdit;

    const [activeTab,      setActiveTab]      = useState("info");
    const [confirmCancel,  setConfirmCancel]  = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("PENDIENTE");
    const [error,   setError]   = useState(null);
    const [success, setSuccess] = useState(null);

    const [form, setForm] = useState({
        orderType:       "EN_MESA",
        table:           "",
        notes:           "",
        deliveryAddress: { street: "", city: "", zone: "", additionalInfo: "" },
        deliveryPhone:   "",
        couponCode:      "",
        details:         [{ ...EMPTY_DETAIL }],
    });

    useEffect(() => {
        if (!isOpen) return;
        if (!user) getProfile();
        getDishes();
        getTables();

        setError(null);
        setSuccess(null);
        setConfirmCancel(false);
        setActiveTab(isStatus ? "status" : "info");

        if (order && !isCreate) {
            setForm({
                orderType:       order.orderType || "EN_MESA",
                table:           order.table?._id || order.table || "",
                notes:           order.notes || "",
                deliveryAddress: order.deliveryAddress || { street: "", city: "", zone: "", additionalInfo: "" },
                deliveryPhone:   order.deliveryPhone || "",
                couponCode:      "",
                details: order.details?.map(d => ({
                    dish:                d.dish?._id || d.dish || "",
                    quantity:            d.quantity,
                    unitPrice:           d.unitPrice,
                    specialInstructions: d.specialInstructions || "",
                })) || [{ ...EMPTY_DETAIL }],
            });
            setSelectedStatus(order.status || "PENDIENTE");
        } else if (isCreate) {
            setForm({
                orderType: "EN_MESA", table: "", notes: "",
                deliveryAddress: { street: "", city: "", zone: "", additionalInfo: "" },
                deliveryPhone: "", couponCode: "", details: [{ ...EMPTY_DETAIL }],
            });
        }
    }, [isOpen, order, mode]);

    if (!isOpen) return null;

    const setField  = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const setDetail = (i, key, val) => {
        const details = [...form.details];
        details[i]    = { ...details[i], [key]: val };
        if (key === "dish") {
            const found = dishes.find(d => d._id === val);
            if (found) details[i].unitPrice = found.priceNumber ?? parseFloat(found.price?.["$numberDecimal"]) ?? 0;
        }
        setForm(f => ({ ...f, details }));
    };

    const addDetail    = () => setForm(f => ({ ...f, details: [...f.details, { ...EMPTY_DETAIL }] }));
    const removeDetail = (i) => setForm(f => ({ ...f, details: f.details.filter((_, idx) => idx !== i) }));

    const total     = form.details.reduce((s, d) => s + d.quantity * d.unitPrice, 0);
    const statusCfg = order ? STATUS_CONFIG[order.status] : null;

    const availableTables = tables.filter(t => t.status === "AVAILABLE" || t._id === form.table);

    const inputCls  = "w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm text-sm text-[#F2EDE8] outline-none focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/10 focus:bg-white/[0.07] transition-all duration-200 placeholder:text-[#6B6560] disabled:opacity-40 disabled:cursor-not-allowed";
    const selectCls = `${inputCls} cursor-pointer`;

    const handleSave = async () => {
        setError(null);
        if (form.orderType === "EN_MESA" && !form.table) return setError("Selecciona una mesa.");
        const validDetails = form.details.filter(d => d.dish);
        if (validDetails.length === 0) return setError("Agrega al menos un platillo.");

        const restaurantId = user?.restaurantId ?? null;
        const payload = { ...form, details: validDetails, restaurant: restaurantId };
        const res     = isCreate
            ? await createOrder(payload)
            : await updateOrder(order._id, payload);

        if (res?.success === false) return setError(res.error);
        setSuccess("✓ Guardado correctamente");
        setTimeout(() => { setSuccess(null); onClose(); }, 1200);
    };

    const handleStatusUpdate = async () => {
        setError(null);
        await updateOrderStatus(order._id, selectedStatus);
        setSuccess("✓ Estado actualizado");
        setTimeout(() => { setSuccess(null); onClose(); }, 1200);
    };

    const handleCancel = async () => {
        setError(null);
        await cancelOrder(order._id);
        setSuccess("✓ Pedido cancelado");
        setTimeout(() => { setSuccess(null); onClose(); }, 1200);
    };

    const TABS = [
        { key: "info",   label: "📋 Información" },
        { key: "items",  label: "🍽️ Platillos" },
        { key: "status", label: "🔄 Estado" },
    ];

    const showStatusActions =
        (isStatus || (!isCreate && !isStatus && activeTab === "status")) &&
        !isView && !confirmCancel;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="relative bg-[#1C1A17]/90 backdrop-blur-2xl border border-white/10 rounded-[32px] w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl shadow-black/60 overflow-hidden">

                {/* Ambient top glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/4 via-transparent to-transparent pointer-events-none rounded-[32px]" />

                {/* ── Header ──────────────────────────────────────────── */}
                <div className="relative flex items-start justify-between px-7 pt-6 pb-4 border-b border-white/8">
                    <div>
                        <div className="flex items-center gap-3 mb-1.5">
                            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 shadow-lg shadow-orange-500/40" />
                            <h2
                                className="text-xl font-extrabold text-[#F2EDE8] leading-tight"
                                style={{ fontFamily: 'Syne, sans-serif' }}
                            >
                                {isCreate && "Nuevo Pedido"}
                                {isEdit   && "Editar Pedido"}
                                {isView   && `Pedido #${order?._id?.slice(-6).toUpperCase()}`}
                                {isStatus && "Actualizar Estado"}
                            </h2>
                        </div>
                        <div className="pl-4 flex items-center gap-2">
                            {(isCreate || isEdit) && (
                                <span className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase">
                                    Gestión de Pedidos
                                </span>
                            )}
                            {(isView || isStatus) && statusCfg && (
                                <span className={`text-[10px] font-black px-3 py-1 rounded-full border backdrop-blur-sm uppercase tracking-wider ${statusCfg.badge}`}>
                                    {statusCfg.label}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/10
                            text-[#A09890] hover:bg-white/[0.12] hover:text-[#F2EDE8] hover:border-white/20
                            transition-all duration-200 text-sm font-bold flex-shrink-0"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Tabs ────────────────────────────────────────────── */}
                {!isCreate && !isStatus && (
                    <div className="relative flex gap-1 px-6 pt-2 border-b border-white/8">
                        {TABS.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                className={`px-4 py-2.5 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all duration-200 ${
                                    activeTab === t.key
                                        ? "border-orange-500 text-orange-400"
                                        : "border-transparent text-[#6B6560] hover:text-[#A09890]"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Body ────────────────────────────────────────────── */}
                <div className="relative flex-1 overflow-y-auto px-7 py-5 space-y-4
                    [&::-webkit-scrollbar]:w-1.5
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-white/10
                    [&::-webkit-scrollbar-thumb]:rounded-full">

                    {/* ══ TAB: Información ══════════════════════════════ */}
                    {(activeTab === "info" || isCreate) && !isStatus && (
                        <>
                            {/* Tipo de orden */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase">
                                    Tipo de Orden
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {Object.entries(ORDER_TYPE_LABELS).map(([val, lbl]) => (
                                        <button
                                            key={val}
                                            onClick={() => canEdit && setField("orderType", val)}
                                            disabled={isView}
                                            className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all duration-200 ${
                                                form.orderType === val
                                                    ? "border-orange-500/50 bg-orange-500/15 text-orange-300 shadow-lg shadow-orange-500/10"
                                                    : "border-white/8 bg-white/[0.04] text-[#A09890] hover:border-white/20 hover:text-[#F2EDE8] disabled:cursor-default"
                                            }`}
                                        >
                                            {lbl}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* ── Selector de Mesa ── */}
                            {form.orderType === "EN_MESA" && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase">
                                        Mesa
                                    </label>
                                    {loadingTables ? (
                                        <p className="text-xs text-[#6B6560] py-2">Cargando mesas...</p>
                                    ) : (
                                        <select
                                            className={selectCls}
                                            value={form.table}
                                            onChange={e => setField("table", e.target.value)}
                                            disabled={isView}
                                        >
                                            <option value="">— Seleccionar mesa —</option>
                                            {availableTables.map(t => (
                                                <option key={t._id} value={t._id}>
                                                    Mesa {t.number}
                                                    {t.location ? ` · ${t.location}` : ""}
                                                    {t.capacity ? ` · ${t.capacity} personas` : ""}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {!loadingTables && availableTables.length === 0 && (
                                        <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-400/20 px-4 py-2.5 rounded-xl">
                                            ⚠ No hay mesas disponibles en este momento.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* ── Dirección de domicilio ── */}
                            {form.orderType === "DOMICILIO" && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase">
                                        Dirección de Entrega
                                    </label>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {[
                                            { key: "street", ph: "Calle / Dirección" },
                                            { key: "city",   ph: "Ciudad" },
                                            { key: "zone",   ph: "Zona" },
                                        ].map(({ key, ph }) => (
                                            <input
                                                key={key}
                                                className={inputCls}
                                                value={form.deliveryAddress[key]}
                                                onChange={e => setField("deliveryAddress", {
                                                    ...form.deliveryAddress, [key]: e.target.value
                                                })}
                                                disabled={isView}
                                                placeholder={ph}
                                            />
                                        ))}
                                        <input
                                            className={inputCls}
                                            value={form.deliveryPhone}
                                            onChange={e => setField("deliveryPhone", e.target.value)}
                                            disabled={isView}
                                            placeholder="Teléfono de entrega"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Notas */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase">
                                    Notas
                                </label>
                                <textarea
                                    className={`${inputCls} h-20 resize-none`}
                                    value={form.notes}
                                    onChange={e => setField("notes", e.target.value)}
                                    disabled={isView}
                                    placeholder="Instrucciones especiales, alergias..."
                                />
                            </div>

                            {/* Cupón */}
                            {canEdit && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase">
                                        Cupón (Opcional)
                                    </label>
                                    <input
                                        className={inputCls}
                                        value={form.couponCode}
                                        onChange={e => setField("couponCode", e.target.value.toUpperCase())}
                                        placeholder="Ej. VERANO20"
                                    />
                                </div>
                            )}

                            {/* Info cliente (solo vista) */}
                            {isView && order?.userInfo && (
                                <div className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-4 border border-white/8">
                                    <p className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase mb-2">
                                        Cliente
                                    </p>
                                    <p className="text-sm font-bold text-[#F2EDE8]">{order.userInfo.name}</p>
                                    <p className="text-xs text-[#6B6560] mt-0.5">{order.userInfo.email}</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* ══ TAB: Platillos ════════════════════════════════ */}
                    {(activeTab === "items" || isCreate) && !isStatus && (
                        <>
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase">
                                    Platillos
                                </label>
                                {canEdit && (
                                    <button
                                        onClick={addDetail}
                                        className="text-[11px] font-black text-orange-400 bg-orange-500/10 border border-orange-500/20
                                            px-3.5 py-1.5 rounded-xl hover:bg-orange-500/20 hover:border-orange-500/40
                                            transition-all duration-200 uppercase tracking-wider"
                                    >
                                        + Agregar platillo
                                    </button>
                                )}
                            </div>

                            {loadingDishes && (
                                <p className="text-xs text-[#6B6560] py-2">Cargando platillos...</p>
                            )}

                            <div className="space-y-3">
                                {form.details.map((d, i) => {
                                    const selectedDish = dishes.find(dish => dish._id === d.dish);
                                    return (
                                        <div
                                            key={i}
                                            className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-4 border border-white/8 space-y-3
                                                hover:border-white/12 transition-all duration-200"
                                        >
                                            {/* Selector de platillo */}
                                            {canEdit ? (
                                                <select
                                                    className={selectCls}
                                                    value={d.dish}
                                                    onChange={e => setDetail(i, "dish", e.target.value)}
                                                >
                                                    <option value="">— Seleccionar platillo —</option>
                                                    {dishes.map(dish => (
                                                        <option key={dish._id} value={dish._id}>
                                                            {dish.name}
                                                            {dish.category ? ` · ${dish.category}` : ""}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p className="text-sm font-bold text-[#F2EDE8]">
                                                    {selectedDish?.name || d.dish}
                                                    {selectedDish?.category && (
                                                        <span className="ml-2 text-xs font-normal text-[#6B6560]">
                                                            {selectedDish.category}
                                                        </span>
                                                    )}
                                                </p>
                                            )}

                                            {/* Cantidad · Precio · Subtotal */}
                                            <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase">
                                                        Cantidad
                                                    </p>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className={inputCls}
                                                        value={d.quantity}
                                                        onChange={e => setDetail(i, "quantity", Math.max(1, Number(e.target.value)))}
                                                        disabled={isView}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase">
                                                        Precio Unit.
                                                    </p>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className={inputCls}
                                                        value={d.unitPrice}
                                                        onChange={e => setDetail(i, "unitPrice", parseFloat(e.target.value) || 0)}
                                                        disabled={isView}
                                                    />
                                                </div>
                                                <div className="text-right pt-5">
                                                    <span className="text-sm font-extrabold text-[#F2EDE8]">
                                                        <span className="text-orange-400 text-xs mr-0.5">Q</span>
                                                        {(d.quantity * d.unitPrice).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Instrucciones especiales + botón eliminar */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    className={`${inputCls} flex-1`}
                                                    value={d.specialInstructions}
                                                    onChange={e => setDetail(i, "specialInstructions", e.target.value)}
                                                    disabled={isView}
                                                    placeholder="Instrucciones especiales (opcional)"
                                                />
                                                {canEdit && form.details.length > 1 && (
                                                    <button
                                                        onClick={() => removeDetail(i)}
                                                        className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl
                                                            bg-red-500/10 border border-red-400/20 text-red-400
                                                            hover:bg-red-500/20 hover:border-red-400/40
                                                            text-xs font-bold transition-all duration-200"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between pt-4 border-t border-dashed border-white/10">
                                <span className="text-sm font-bold text-[#6B6560] uppercase tracking-widest text-[11px]">
                                    Total estimado
                                </span>
                                <span className="text-2xl font-extrabold text-[#F2EDE8]" style={{ fontFamily: 'Syne, sans-serif' }}>
                                    <span className="text-orange-400 text-sm mr-1">Q</span>
                                    {total.toFixed(2)}
                                </span>
                            </div>
                        </>
                    )}

                    {/* ══ TAB: Estado ═══════════════════════════════════ */}
                    {(activeTab === "status" || isStatus) && !isCreate && (
                        <>
                            {/* Estado actual */}
                            {order && statusCfg && (
                                <div className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-4 border border-white/8">
                                    <p className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase mb-2.5">
                                        Estado Actual
                                    </p>
                                    <span className={`text-[11px] font-black px-3.5 py-1.5 rounded-xl border uppercase tracking-wider backdrop-blur-sm ${statusCfg.badge}`}>
                                        {statusCfg.label}
                                    </span>
                                </div>
                            )}

                            {/* Selector de nuevo estado */}
                            {!isView && (
                                <>
                                    <label className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase block">
                                        Cambiar a
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {VALID_STATUSES.map(s => {
                                            const cfg        = STATUS_CONFIG[s];
                                            const isSelected = selectedStatus === s;
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => setSelectedStatus(s)}
                                                    className={`py-2.5 px-2 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all duration-200 ${
                                                        isSelected
                                                            ? `${cfg.sel} shadow-lg scale-[1.03]`
                                                            : "border-white/8 bg-white/[0.03] text-[#6B6560] hover:border-white/20 hover:text-[#A09890]"
                                                    }`}
                                                >
                                                    {cfg.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {/* Zona de peligro */}
                            {!isView &&
                             order?.status !== "CANCELADO" &&
                             order?.status !== "ENTREGADO" && (
                                <div className="pt-4 border-t border-white/8 space-y-3">
                                    <p className="text-[10px] font-black tracking-widest text-red-400 uppercase">
                                        Zona de Peligro
                                    </p>
                                    {!confirmCancel ? (
                                        <button
                                            onClick={() => setConfirmCancel(true)}
                                            className="px-4 py-2.5 rounded-xl border border-red-400/25 bg-red-500/8
                                                text-red-400 text-sm font-bold hover:bg-red-500/15 hover:border-red-400/40
                                                transition-all duration-200"
                                        >
                                            Cancelar este pedido
                                        </button>
                                    ) : (
                                        <div className="bg-red-500/8 backdrop-blur-sm rounded-2xl p-4 border border-red-400/20 space-y-3">
                                            <p className="text-sm text-[#A09890]">
                                                ¿Confirmar cancelación? Esta acción no se puede deshacer.
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleCancel}
                                                    disabled={loading}
                                                    className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-bold
                                                        hover:from-red-400 hover:to-red-500 shadow-lg shadow-red-500/20
                                                        transition-all duration-200 disabled:opacity-50"
                                                >
                                                    {loading ? "Cancelando..." : "Sí, cancelar"}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmCancel(false)}
                                                    className="px-4 py-2.5 bg-white/[0.06] border border-white/10 text-[#A09890] rounded-xl text-sm font-bold
                                                        hover:bg-white/[0.10] hover:text-[#F2EDE8] transition-all duration-200"
                                                >
                                                    No, volver
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Mensajes */}
                    {error && (
                        <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3 backdrop-blur-sm">
                            ⚠ {error}
                        </p>
                    )}
                    {success && (
                        <p className="text-sm text-emerald-300 font-bold bg-emerald-500/10 border border-emerald-400/20 rounded-xl px-4 py-3 backdrop-blur-sm">
                            {success}
                        </p>
                    )}
                </div>

                {/* ── Footer ──────────────────────────────────────────── */}
                <div className="relative flex items-center justify-end gap-2.5 px-7 py-4 border-t border-white/8">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-white/[0.06] border border-white/10 text-[#A09890] rounded-xl text-sm font-bold
                            hover:bg-white/[0.10] hover:text-[#F2EDE8] hover:border-white/20
                            transition-all duration-200"
                    >
                        Cerrar
                    </button>

                    {canEdit && activeTab !== "status" && (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-bold
                                hover:from-orange-400 hover:to-orange-500 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
                                transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Guardando..." : isCreate ? "Crear Pedido" : "Guardar Cambios"}
                        </button>
                    )}

                    {showStatusActions && (
                        <button
                            onClick={handleStatusUpdate}
                            disabled={loading}
                            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-bold
                                hover:from-orange-400 hover:to-orange-500 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
                                transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Actualizando..." : "Actualizar Estado"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};