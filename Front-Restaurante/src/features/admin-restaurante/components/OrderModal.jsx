import { useState, useEffect } from "react";
import { useOrderStore }    from "../store/useOrderStore";
import { usePlatilloStore } from "../store/usePlatilloStore";
import { useMesaStore }     from "../store/useMesaStore";
import { useAuthStore }     from "../../auth/store/useAuthStore";

const STATUS_CONFIG = {
    PENDIENTE:      { label: "Pendiente",      badge: "bg-amber-100 text-amber-800",     sel: "bg-amber-50 text-amber-700 border-amber-400" },
    CONFIRMADO:     { label: "Confirmado",     badge: "bg-blue-100 text-blue-800",       sel: "bg-blue-50 text-blue-700 border-blue-400" },
    EN_PREPARACION: { label: "En preparación", badge: "bg-violet-100 text-violet-800",   sel: "bg-violet-50 text-violet-700 border-violet-400" },
    LISTO:          { label: "Listo",          badge: "bg-emerald-100 text-emerald-800", sel: "bg-emerald-50 text-emerald-700 border-emerald-400" },
    EN_CAMINO:      { label: "En camino",      badge: "bg-cyan-100 text-cyan-800",       sel: "bg-cyan-50 text-cyan-700 border-cyan-400" },
    ENTREGADO:      { label: "Entregado",      badge: "bg-green-100 text-green-800",     sel: "bg-green-50 text-green-700 border-green-400" },
    CANCELADO:      { label: "Cancelado",      badge: "bg-red-100 text-red-800",         sel: "bg-red-50 text-red-700 border-red-400" },
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

    // ── Cargar platillos y mesas al abrir ──────────────────────────────────────
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
        // Auto-rellenar precio unitario al seleccionar un platillo
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

    // Mesas disponibles para EN_MESA
    const availableTables = tables.filter(t => t.status === "AVAILABLE" || t._id === form.table);

    // Clases reutilizables
    const inputCls  = "w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none focus:border-orange-400 transition-colors placeholder:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed";
    const selectCls = `${inputCls} cursor-pointer`;

    const handleSave = async () => {
        setError(null);

        // Validaciones básicas
        if (form.orderType === "EN_MESA" && !form.table) {
            return setError("Selecciona una mesa.");
        }
        const validDetails = form.details.filter(d => d.dish);
        if (validDetails.length === 0) {
            return setError("Agrega al menos un platillo.");
        }

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

                {/* ── Header ──────────────────────────────────────────── */}
                <div className="flex items-start justify-between px-7 pt-6 pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                            {isCreate && "Nuevo Pedido"}
                            {isEdit   && "Editar Pedido"}
                            {isView   && `Pedido #${order?._id?.slice(-6).toUpperCase()}`}
                            {isStatus && "Actualizar Estado"}
                        </h2>
                        <div className="mt-1.5 flex items-center gap-2">
                            {(isCreate || isEdit) && (
                                <span className="text-[10px] font-bold tracking-widest text-gray-400">
                                    GESTIÓN DE PEDIDOS
                                </span>
                            )}
                            {(isView || isStatus) && statusCfg && (
                                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusCfg.badge}`}>
                                    {statusCfg.label}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors text-sm font-bold flex-shrink-0"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Tabs ────────────────────────────────────────────── */}
                {!isCreate && !isStatus && (
                    <div className="flex gap-1 px-7 border-b border-gray-100">
                        {TABS.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                                    activeTab === t.key
                                        ? "border-orange-500 text-orange-500"
                                        : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* ── Body ────────────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto px-7 py-5 space-y-4">

                    {/* ══ TAB: Información ══════════════════════════════ */}
                    {(activeTab === "info" || isCreate) && !isStatus && (
                        <>
                            {/* Tipo de orden */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold tracking-widest text-gray-400">
                                    TIPO DE ORDEN
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {Object.entries(ORDER_TYPE_LABELS).map(([val, lbl]) => (
                                        <button
                                            key={val}
                                            onClick={() => canEdit && setField("orderType", val)}
                                            disabled={isView}
                                            className={`px-4 py-2 rounded-xl border-[1.5px] text-sm font-medium transition-all ${
                                                form.orderType === val
                                                    ? "border-orange-400 bg-orange-50 text-orange-500"
                                                    : "border-gray-200 text-gray-500 hover:border-gray-300 disabled:cursor-default"
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
                                    <label className="text-[10px] font-bold tracking-widest text-gray-400">
                                        MESA
                                    </label>
                                    {loadingTables ? (
                                        <p className="text-xs text-gray-400 py-2">Cargando mesas...</p>
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
                                        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                                            ⚠ No hay mesas disponibles en este momento.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* ── Dirección de domicilio ── */}
                            {form.orderType === "DOMICILIO" && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold tracking-widest text-gray-400">
                                        DIRECCIÓN DE ENTREGA
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
                                <label className="text-[10px] font-bold tracking-widest text-gray-400">
                                    NOTAS
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
                                    <label className="text-[10px] font-bold tracking-widest text-gray-400">
                                        CUPÓN (OPCIONAL)
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
                                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                                    <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-1">
                                        CLIENTE
                                    </p>
                                    <p className="text-sm font-semibold text-gray-800">{order.userInfo.name}</p>
                                    <p className="text-xs text-gray-400">{order.userInfo.email}</p>
                                </div>
                            )}
                        </>
                    )}

                    {/* ══ TAB: Platillos ════════════════════════════════ */}
                    {(activeTab === "items" || isCreate) && !isStatus && (
                        <>
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold tracking-widest text-gray-400">
                                    PLATILLOS
                                </label>
                                {canEdit && (
                                    <button
                                        onClick={addDetail}
                                        className="text-xs font-bold text-orange-500 bg-orange-50 border border-orange-200 px-3 py-1 rounded-lg hover:bg-orange-100 transition-colors"
                                    >
                                        + Agregar platillo
                                    </button>
                                )}
                            </div>

                            {loadingDishes && (
                                <p className="text-xs text-gray-400 py-2">Cargando platillos...</p>
                            )}

                            <div className="space-y-2.5">
                                {form.details.map((d, i) => {
                                    const selectedDish = dishes.find(dish => dish._id === d.dish);
                                    return (
                                        <div
                                            key={i}
                                            className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 space-y-2"
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
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {selectedDish?.name || d.dish}
                                                    {selectedDish?.category && (
                                                        <span className="ml-2 text-xs font-normal text-gray-400">
                                                            {selectedDish.category}
                                                        </span>
                                                    )}
                                                </p>
                                            )}

                                            {/* Cantidad · Precio · Subtotal */}
                                            <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-bold tracking-widest text-gray-400">
                                                        CANTIDAD
                                                    </p>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        className={`${inputCls} bg-white`}
                                                        value={d.quantity}
                                                        onChange={e => setDetail(i, "quantity", Math.max(1, Number(e.target.value)))}
                                                        disabled={isView}
                                                    />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-[10px] font-bold tracking-widest text-gray-400">
                                                        PRECIO UNIT.
                                                    </p>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className={`${inputCls} bg-white`}
                                                        value={d.unitPrice}
                                                        onChange={e => setDetail(i, "unitPrice", parseFloat(e.target.value) || 0)}
                                                        disabled={isView}
                                                    />
                                                </div>
                                                <div className="text-right pt-4">
                                                    <span className="text-sm font-bold text-gray-700">
                                                        Q{(d.quantity * d.unitPrice).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Instrucciones especiales + botón eliminar */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    className={`${inputCls} bg-white flex-1`}
                                                    value={d.specialInstructions}
                                                    onChange={e => setDetail(i, "specialInstructions", e.target.value)}
                                                    disabled={isView}
                                                    placeholder="Instrucciones especiales (opcional)"
                                                />
                                                {canEdit && form.details.length > 1 && (
                                                    <button
                                                        onClick={() => removeDetail(i)}
                                                        className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 text-xs font-bold transition-colors"
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
                            <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200">
                                <span className="text-sm text-gray-500">Total estimado</span>
                                <span className="text-2xl font-extrabold text-orange-500">
                                    Q{total.toFixed(2)}
                                </span>
                            </div>
                        </>
                    )}

                    {/* ══ TAB: Estado ═══════════════════════════════════ */}
                    {(activeTab === "status" || isStatus) && !isCreate && (
                        <>
                            {/* Estado actual */}
                            {order && statusCfg && (
                                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                                    <p className="text-[10px] font-bold tracking-widest text-gray-400 mb-2">
                                        ESTADO ACTUAL
                                    </p>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${statusCfg.badge}`}>
                                        {statusCfg.label}
                                    </span>
                                </div>
                            )}

                            {/* Selector de nuevo estado */}
                            {!isView && (
                                <>
                                    <label className="text-[10px] font-bold tracking-widest text-gray-400 block">
                                        CAMBIAR A
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {VALID_STATUSES.map(s => {
                                            const cfg        = STATUS_CONFIG[s];
                                            const isSelected = selectedStatus === s;
                                            return (
                                                <button
                                                    key={s}
                                                    onClick={() => setSelectedStatus(s)}
                                                    className={`py-2.5 px-2 rounded-xl border-[1.5px] text-xs font-semibold transition-all ${
                                                        isSelected
                                                            ? cfg.sel
                                                            : "border-gray-200 text-gray-500 hover:border-gray-300"
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
                                <div className="pt-4 border-t border-gray-100 space-y-3">
                                    <p className="text-[10px] font-bold tracking-widest text-red-400">
                                        ZONA DE PELIGRO
                                    </p>
                                    {!confirmCancel ? (
                                        <button
                                            onClick={() => setConfirmCancel(true)}
                                            className="px-4 py-2 rounded-xl border-[1.5px] border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors"
                                        >
                                            Cancelar este pedido
                                        </button>
                                    ) : (
                                        <div className="bg-red-50 rounded-xl p-4 border border-red-200 space-y-3">
                                            <p className="text-sm text-gray-700">
                                                ¿Confirmar cancelación? Esta acción no se puede deshacer.
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleCancel}
                                                    disabled={loading}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
                                                >
                                                    {loading ? "Cancelando..." : "Sí, cancelar"}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmCancel(false)}
                                                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
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
                    {error   && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                            ⚠ {error}
                        </p>
                    )}
                    {success && (
                        <p className="text-sm text-green-700 font-semibold bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                            {success}
                        </p>
                    )}
                </div>

                {/* ── Footer ──────────────────────────────────────────── */}
                <div className="flex items-center justify-end gap-2.5 px-7 py-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Cerrar
                    </button>

                    {/* Solo crear o editar info/platillos — NO en tab estado */}
                    {canEdit && activeTab !== "status" && (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
                        >
                            {loading ? "Guardando..." : isCreate ? "Crear Pedido" : "Guardar Cambios"}
                        </button>
                    )}

                    {/* Solo en tab estado o modo status */}
                    {showStatusActions && (
                        <button
                            onClick={handleStatusUpdate}
                            disabled={loading}
                            className="px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
                        >
                            {loading ? "Actualizando..." : "Actualizar Estado"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};