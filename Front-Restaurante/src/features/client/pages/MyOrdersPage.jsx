import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/UseOrderStore";

const STATUS_FILTERS = [
    { value: "TODOS",          label: "Todos" },
    { value: "PENDIENTE",      label: "Pendientes" },
    { value: "EN_PREPARACION", label: "En preparación" },
    { value: "LISTO",          label: "Listos" },
    { value: "EN_CAMINO",      label: "En camino" },
    { value: "ENTREGADO",      label: "Entregados" },
    { value: "CANCELADO",      label: "Cancelados" },
];

export const MyOrdersPage = () => {
    const navigate = useNavigate();
    const {
        orders, loading, error,
        fetchOrders, cancelOrder,
        getStatusLabel, getStatusStyle, getStatusIcon, getOrderTypeLabel,
        clearError,
    } = useOrderStore();

    const [filterStatus, setFilterStatus] = useState("TODOS");
    const [cancelConfirm, setCancelConfirm] = useState(null);

    useEffect(() => { fetchOrders(); }, []);

    const filtered = filterStatus === "TODOS"
        ? orders
        : orders.filter((o) => o.status === filterStatus);

    const handleCancel = async () => {
        if (!cancelConfirm) return;
        try {
            await cancelOrder(cancelConfirm);
        } finally {
            setCancelConfirm(null);
        }
    };

    return (
        <div className="space-y-5">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Pedidos</h1>
                <p className="text-sm text-gray-400 mt-1">
                    {orders.length} pedido{orders.length !== 1 ? "s" : ""} en total
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200
                    rounded-xl px-4 py-3 text-sm text-red-700">
                    <span>{error}</span>
                    <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-4">✕</button>
                </div>
            )}

            {/* Filtros */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {STATUS_FILTERS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setFilterStatus(value)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap
                            transition-colors shrink-0
                            ${filterStatus === value
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Contenido */}
            {loading ? (
                <div className="flex flex-col items-center py-20 gap-3">
                    <div className="w-9 h-9 rounded-full border-[3px] border-gray-100
                        border-t-orange-500 animate-spin" />
                    <p className="text-sm text-gray-400">Cargando pedidos…</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-5xl mb-3">📋</p>
                    <p className="text-gray-500 font-medium text-sm">
                        {filterStatus === "TODOS" ? "Aún no tienes pedidos" : "No hay pedidos en este estado"}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                        {filterStatus === "TODOS" && "Explora restaurantes y haz tu primer pedido"}
                    </p>
                    {filterStatus === "TODOS" && (
                        <button
                            onClick={() => navigate("/client")}
                            className="mt-4 px-5 py-2 bg-orange-500 hover:bg-orange-600
                                text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            Explorar restaurantes
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((order) => (
                        <OrderCard
                            key={order._id}
                            order={order}
                            getStatusLabel={getStatusLabel}
                            getStatusStyle={getStatusStyle}
                            getStatusIcon={getStatusIcon}
                            getOrderTypeLabel={getOrderTypeLabel}
                            onView={() => navigate(`/client/pedidos/${order._id}`)}
                            onCancel={() => setCancelConfirm(order._id)}
                        />
                    ))}
                </div>
            )}

            {/* Confirm cancelar */}
            {cancelConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl px-7 py-6 w-full max-w-sm shadow-2xl">
                        <p className="font-semibold text-gray-900 mb-1">¿Cancelar este pedido?</p>
                        <p className="text-sm text-gray-400 mb-5">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setCancelConfirm(null)}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-sm
                                    text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                No, mantener
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600
                                    text-white text-sm font-semibold transition-colors disabled:opacity-60"
                            >
                                Sí, cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Card de pedido ── */
function OrderCard({ order, getStatusLabel, getStatusStyle, getStatusIcon, getOrderTypeLabel, onView, onCancel }) {
    const canCancel = order.status === "PENDIENTE";
    const date      = new Date(order.createdAt).toLocaleDateString("es-GT", {
        day: "numeric", month: "short", year: "numeric"
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">

            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                        {order.restaurant?.name ?? "Restaurante"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold
                    flex items-center gap-1 ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)} {getStatusLabel(order.status)}
                </span>
            </div>

            {/* Detalle platillos */}
            <div className="text-xs text-gray-500 space-y-0.5">
                {order.details?.slice(0, 3).map((d, i) => (
                    <p key={i}>
                        {d.quantity}x {d.dish?.name ?? "Platillo"}
                    </p>
                ))}
                {order.details?.length > 3 && (
                    <p className="text-gray-400">+{order.details.length - 3} más…</p>
                )}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="space-y-0.5">
                    <p className="text-xs text-gray-400">{getOrderTypeLabel(order.orderType)}</p>
                    <p className="text-sm font-bold text-gray-900">Q{Number(order.totalPrice).toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                    {canCancel && (
                        <button
                            onClick={onCancel}
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-xs
                                text-red-500 hover:bg-red-50 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        onClick={onView}
                        className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600
                            text-white text-xs font-semibold transition-colors"
                    >
                        Ver detalle
                    </button>
                </div>
            </div>
        </div>
    );
}