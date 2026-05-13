import { useEffect, useState } from "react";
import { useOrderStore } from "../store/useOrderStore";
import {OrderModal} from "../components/OrderModal";

const STATUS_CONFIG = {
    PENDIENTE:      { label: "Pendiente",      dot: "bg-amber-400",   badge: "bg-amber-100 text-amber-800",   pill: "bg-amber-50 text-amber-700 border-amber-400" },
    CONFIRMADO:     { label: "Confirmado",     dot: "bg-blue-500",    badge: "bg-blue-100 text-blue-900",     pill: "bg-blue-50 text-blue-700 border-blue-500" },
    EN_PREPARACION: { label: "En preparación", dot: "bg-violet-500",  badge: "bg-violet-100 text-violet-900", pill: "bg-violet-50 text-violet-700 border-violet-500" },
    LISTO:          { label: "Listo",          dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-900", pill: "bg-emerald-50 text-emerald-700 border-emerald-500" },
    EN_CAMINO:      { label: "En camino",      dot: "bg-cyan-500",    badge: "bg-cyan-100 text-cyan-900",     pill: "bg-cyan-50 text-cyan-700 border-cyan-500" },
    ENTREGADO:      { label: "Entregado",      dot: "bg-green-500",   badge: "bg-green-100 text-green-900",   pill: "bg-green-50 text-green-700 border-green-500" },
    CANCELADO:      { label: "Cancelado",      dot: "bg-red-500",     badge: "bg-red-100 text-red-900",       pill: "bg-red-50 text-red-700 border-red-500" },
};

const ORDER_TYPE_CONFIG = {
    EN_MESA:     { label: "En mesa",     icon: "🪑" },
    PARA_LLEVAR: { label: "Para llevar", icon: "🥡" },
    DOMICILIO:   { label: "Domicilio",   icon: "🛵" },
};

const SUMMARY_CARDS = [
    { key: "PENDIENTE",      label: "Pendientes",     icon: "⏳", bg: "bg-amber-100",  text: "text-amber-800" },
    { key: "EN_PREPARACION", label: "En preparación", icon: "🍳", bg: "bg-violet-100", text: "text-violet-900" },
    { key: "LISTO",          label: "Listos",          icon: "✅", bg: "bg-emerald-100", text: "text-emerald-900" },
    { key: "ENTREGADO",      label: "Entregados",      icon: "🎉", bg: "bg-green-100",  text: "text-green-900" },
    { key: "CANCELADO",      label: "Cancelados",      icon: "✕",  bg: "bg-red-100",    text: "text-red-900" },
];

export const OrderPage = () => {
    const { orders, pagination, loading, error, fetchOrders } = useOrderStore();

    const [activeFilter, setActiveFilter]   = useState("ALL");
    const [searchText, setSearchText]       = useState("");
    const [modalOpen, setModalOpen]         = useState(false);
    const [modalMode, setModalMode]         = useState("view");
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders({ force: true });
    }, []);
    
    const summaryCounts = SUMMARY_CARDS.reduce((acc, c) => {
        acc[c.key] = orders.filter(o => o.status === c.key).length;
        return acc;
    }, {});

    const filtered = orders.filter(o => {
        const matchStatus = activeFilter === "ALL" || o.status === activeFilter;
        const matchSearch = !searchText ||
            o._id?.toLowerCase().includes(searchText.toLowerCase()) ||
            o.userInfo?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            o.userInfo?.email?.toLowerCase().includes(searchText.toLowerCase());
        return matchStatus && matchSearch;
    });

    // ── Modal helpers ──────────────────────────────────────────────────────────
    const openModal = (mode, order = null) => {
        setModalMode(mode);
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
        fetchOrders({ force: true });
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="px-8 py-7 max-w-[1100px] mx-auto font-sans">

            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="m-0 text-[28px] font-extrabold text-gray-900">Pedidos</h1>
                    <p className="mt-1.5 mb-0 text-sm text-gray-500">
                        {pagination.totalRecords} en total ·{" "}
                        <span className="text-orange-500 font-semibold">
                            {summaryCounts.PENDIENTE || 0} pendientes
                        </span>{" "}
                        ·{" "}
                        <span className="text-violet-500 font-semibold">
                            {summaryCounts.EN_PREPARACION || 0} en preparación
                        </span>
                    </p>
                </div>
                <button
                    onClick={() => openModal("create")}
                    className="px-5 py-2.5 bg-gradient-to-br from-orange-400 to-orange-600 border-0 rounded-xl text-white text-sm font-bold cursor-pointer shadow-[0_4px_14px_rgba(249,115,22,0.35)] hover:opacity-90 transition-opacity"
                >
                    + Nuevo Pedido
                </button>
            </div>

            {/* ── Summary cards ───────────────────────────────────────── */}
            <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
                {SUMMARY_CARDS.map(c => (
                    <div
                        key={c.key}
                        className={`${c.bg} rounded-2xl p-3.5 px-4 flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform`}
                        onClick={() => setActiveFilter(activeFilter === c.key ? "ALL" : c.key)}
                    >
                        <span className="text-2xl">{c.icon}</span>
                        <div>
                            <p className={`m-0 text-2xl font-extrabold leading-none ${c.text}`}>
                                {summaryCounts[c.key] || 0}
                            </p>
                            <p className={`mt-0.5 mb-0 text-[10px] font-bold tracking-widest uppercase ${c.text}`}>
                                {c.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filters + search ────────────────────────────────────── */}
            <div className="flex justify-between items-start gap-4 mb-5 flex-wrap">
                <div className="flex gap-1.5 flex-wrap">
                    <button
                        className={`px-3.5 py-1.5 border-[1.5px] rounded-full text-xs font-medium cursor-pointer transition-all ${
                            activeFilter === "ALL"
                                ? "bg-orange-50 border-orange-400 text-orange-500"
                                : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                        onClick={() => setActiveFilter("ALL")}
                    >
                        Todos ({orders.length})
                    </button>
                    {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <button
                            key={key}
                            className={`px-3.5 py-1.5 border-[1.5px] rounded-full text-xs font-medium cursor-pointer transition-all ${
                                activeFilter === key
                                    ? cfg.pill
                                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                            }`}
                            onClick={() => setActiveFilter(activeFilter === key ? "ALL" : key)}
                        >
                            {cfg.label} ({orders.filter(o => o.status === key).length})
                        </button>
                    ))}
                </div>
                <input
                    className="px-4 py-2 border-[1.5px] border-gray-200 rounded-xl text-[13px] bg-gray-50 outline-none min-w-[220px] focus:border-gray-300"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    placeholder="🔍  Buscar por ID, cliente..."
                />
            </div>

            {/* ── Content ─────────────────────────────────────────────── */}
            {loading && (
                <div className="text-center py-16 px-5 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <span className="text-5xl">⏳</span>
                    <p className="text-lg font-bold text-gray-700 mt-3 mb-1">Cargando pedidos...</p>
                </div>
            )}

            {!loading && error && (
                <div className="px-4 py-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    ⚠ {error}
                </div>
            )}

            {!loading && !error && filtered.length === 0 && (
                <div className="text-center py-16 px-5 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <span className="text-5xl">🧾</span>
                    <p className="text-lg font-bold text-gray-700 mt-3 mb-1">Sin pedidos</p>
                    <p className="text-gray-400 text-sm m-0">
                        {activeFilter !== "ALL"
                            ? `No hay pedidos con estado "${STATUS_CONFIG[activeFilter]?.label}"`
                            : "Aún no hay pedidos registrados"}
                    </p>
                </div>
            )}

            {!loading && !error && filtered.length > 0 && (
                <div className="flex flex-col gap-3">
                    {filtered.map(order => {
                        const sc  = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDIENTE;
                        const otc = ORDER_TYPE_CONFIG[order.orderType] || {};
                        const itemCount = order.details?.length || 0;
                        const dateStr = order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("es-GT", {
                                day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                              })
                            : "—";

                        return (
                            <div
                                key={order._id}
                                className="bg-white rounded-2xl border border-gray-100 flex overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md transition-shadow"
                            >
                                {/* Left accent bar */}
                                <div className={`w-1 shrink-0 ${sc.dot}`} />

                                {/* Main content */}
                                <div className="flex-1 px-4 py-3.5">
                                    <div className="flex justify-between items-start mb-2.5">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className="text-sm font-extrabold text-gray-900 font-mono">
                                                    #{order._id?.slice(-6).toUpperCase()}
                                                </span>
                                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${sc.badge}`}>
                                                    {sc.label}
                                                </span>
                                                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                                    {otc.icon} {otc.label}
                                                </span>
                                            </div>
                                            <p className="m-0 text-[15px] font-semibold text-gray-700">
                                                {order.userInfo?.name || "Cliente"}
                                            </p>
                                            <p className="mt-0.5 mb-0 text-xs text-gray-400">
                                                {dateStr} · {itemCount} platillo{itemCount !== 1 ? "s" : ""}
                                                {order.table && ` · Mesa ${order.table?.number || order.table}`}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0 ml-4">
                                            <span className="text-xl font-extrabold text-orange-500 block">
                                                Q{(order.totalPrice || 0).toFixed(2)}
                                            </span>
                                            {order.discount > 0 && (
                                                <span className="text-[11px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full inline-block mt-1">
                                                    -Q{order.discount.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 flex-wrap border-t border-gray-50 pt-2.5 mt-1">
                                        <button
                                            onClick={() => openModal("view", order)}
                                            className="px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            👁 Ver detalle
                                        </button>
                                        {order.status === "PENDIENTE" && (
                                            <button
                                                onClick={() => openModal("edit", order)}
                                                className="px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors"
                                            >
                                                ✏️ Editar
                                            </button>
                                        )}
                                        {order.status !== "CANCELADO" && order.status !== "ENTREGADO" && (
                                            <button
                                                onClick={() => openModal("status", order)}
                                                className="px-3.5 py-1.5 bg-orange-50 border border-orange-200 rounded-lg text-xs font-semibold text-orange-600 cursor-pointer hover:bg-orange-100 transition-colors"
                                            >
                                                🔄 Cambiar estado
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Pagination info ─────────────────────────────────────── */}
            {pagination.totalPages > 1 && (
                <div className="text-center mt-6 text-sm text-gray-400">
                    Página {pagination.currentPage} de {pagination.totalPages} ·{" "}
                    {pagination.totalRecords} pedidos en total
                </div>
            )}

            {/* ── Modal ───────────────────────────────────────────────── */}
            <OrderModal
                isOpen={modalOpen}
                onClose={closeModal}
                order={selectedOrder}
                mode={modalMode}
            />
        </div>
    );
}