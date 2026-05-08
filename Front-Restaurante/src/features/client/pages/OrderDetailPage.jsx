import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/UseOrderStore";

export const OrderDetailPage = () => {
    const { id }     = useParams();
    const navigate   = useNavigate();
    const {
        selectedOrder: order, loading, error,
        fetchOrderById, cancelOrder,
        getStatusLabel, getStatusStyle, getStatusIcon, getOrderTypeLabel,
        clearError,
    } = useOrderStore();

    const [cancelConfirm, setCancelConfirm] = useState(false);

    useEffect(() => {
        fetchOrderById(id);
    }, [id]);

    const handleCancel = async () => {
        try {
            await cancelOrder(id);
        } finally {
            setCancelConfirm(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center py-24 gap-3">
            <div className="w-9 h-9 rounded-full border-[3px] border-gray-100
                border-t-orange-500 animate-spin" />
            <p className="text-sm text-gray-400">Cargando pedido…</p>
        </div>
    );

    if (error) return (
        <div className="text-center py-24">
            <p className="text-4xl mb-3">😕</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <button
                onClick={() => { clearError(); navigate("/client/pedidos"); }}
                className="mt-4 px-5 py-2 bg-orange-500 hover:bg-orange-600
                    text-white text-sm font-semibold rounded-xl transition-colors"
            >
                Volver a mis pedidos
            </button>
        </div>
    );

    if (!order) return null;

    const canCancel = order.status === "PENDIENTE";
    const date = new Date(order.createdAt).toLocaleDateString("es-GT", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
    const time = new Date(order.createdAt).toLocaleTimeString("es-GT", {
        hour: "2-digit", minute: "2-digit"
    });

    // Timeline de estados
    const STATUS_STEPS = ["PENDIENTE", "CONFIRMADO", "EN_PREPARACION", "LISTO", "EN_CAMINO", "ENTREGADO"];
    const currentIndex = STATUS_STEPS.indexOf(order.status);
    const isCancelled  = order.status === "CANCELADO";

    return (
        <div className="space-y-5 pb-10">

            {/* Volver */}
            <button
                onClick={() => navigate("/client/pedidos")}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors"
            >
                ← Mis pedidos
            </button>

            {/* Header */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Detalle del pedido</h1>
                    <p className="text-xs text-gray-400 mt-1 capitalize">{date} · {time}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5
                    ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)} {getStatusLabel(order.status)}
                </span>
            </div>

            {/* Timeline de progreso */}
            {!isCancelled && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                        Progreso del pedido
                    </p>
                    <div className="flex items-center gap-0">
                        {STATUS_STEPS.map((step, i) => {
                            const isDone    = i <= currentIndex;
                            const isCurrent = i === currentIndex;
                            const isLast    = i === STATUS_STEPS.length - 1;

                            return (
                                <div key={step} className="flex items-center flex-1 last:flex-none">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center
                                            text-xs font-bold transition-colors
                                            ${isCurrent
                                                ? "bg-orange-500 text-white ring-4 ring-orange-100"
                                                : isDone
                                                    ? "bg-orange-500 text-white"
                                                    : "bg-gray-100 text-gray-400"}`}>
                                            {isDone ? "✓" : i + 1}
                                        </div>
                                        <p className={`text-[9px] font-medium text-center w-14 leading-tight
                                            ${isDone ? "text-orange-500" : "text-gray-400"}`}>
                                            {getStatusLabel(step)}
                                        </p>
                                    </div>
                                    {!isLast && (
                                        <div className={`flex-1 h-0.5 mb-5 mx-1
                                            ${i < currentIndex ? "bg-orange-500" : "bg-gray-100"}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Info restaurante + tipo */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Información</p>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-400">Restaurante</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            {order.restaurant?.name ?? "—"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Tipo de pedido</p>
                        <p className="text-sm font-semibold text-gray-900 mt-0.5">
                            {getOrderTypeLabel(order.orderType)}
                        </p>
                    </div>
                    {order.table && (
                        <div>
                            <p className="text-xs text-gray-400">Mesa</p>
                            <p className="text-sm font-semibold text-gray-900 mt-0.5">
                                Mesa {order.table?.number ?? "—"}
                            </p>
                        </div>
                    )}
                    {order.orderType === "DOMICILIO" && order.deliveryAddress && (
                        <div className="col-span-2">
                            <p className="text-xs text-gray-400">Dirección de entrega</p>
                            <p className="text-sm font-semibold text-gray-900 mt-0.5">
                                {[order.deliveryAddress.street, order.deliveryAddress.zone, order.deliveryAddress.city]
                                    .filter(Boolean).join(", ")}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Platillos */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Platillos</p>
                <div className="space-y-2">
                    {order.details?.map((item, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 py-2
                            border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600
                                    text-xs font-bold flex items-center justify-center shrink-0">
                                    {item.quantity}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {item.dish?.name ?? "Platillo"}
                                    </p>
                                    {item.specialInstructions && (
                                        <p className="text-xs text-gray-400 truncate">
                                            📝 {item.specialInstructions}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 shrink-0">
                                Q{Number(item.unitPrice * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Resumen de precios */}
                <div className="pt-3 space-y-1.5 border-t border-gray-100">
                    {order.discount > 0 && (
                        <>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Subtotal</span>
                                <span>Q{(Number(order.totalPrice) + Number(order.discount)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-green-600 font-medium">
                                <span>🏷 Descuento</span>
                                <span>- Q{Number(order.discount).toFixed(2)}</span>
                            </div>
                        </>
                    )}
                    {order.deliveryFee > 0 && (
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Envío</span>
                            <span>Q{Number(order.deliveryFee).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-gray-900 pt-1">
                        <span>Total</span>
                        <span>Q{Number(order.totalPrice).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Notas */}
            {order.notes && (
                <div className="bg-amber-50 rounded-2xl border border-amber-100 px-4 py-3">
                    <p className="text-xs font-semibold text-amber-700 mb-1">📝 Notas del pedido</p>
                    <p className="text-sm text-amber-800">{order.notes}</p>
                </div>
            )}

            {/* Cancelar */}
            {canCancel && (
                <button
                    onClick={() => setCancelConfirm(true)}
                    className="w-full py-3 rounded-xl border border-red-200 text-red-500
                        hover:bg-red-50 text-sm font-semibold transition-colors"
                >
                    Cancelar pedido
                </button>
            )}

            {/* Confirm modal */}
            {cancelConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl px-7 py-6 w-full max-w-sm shadow-2xl">
                        <p className="font-semibold text-gray-900 mb-1">¿Cancelar este pedido?</p>
                        <p className="text-sm text-gray-400 mb-5">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setCancelConfirm(false)}
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