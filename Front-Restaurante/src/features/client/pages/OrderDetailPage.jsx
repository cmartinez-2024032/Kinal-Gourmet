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
        <div className="flex flex-col items-center py-32 gap-4">
            <div className="w-12 h-12 rounded-full border-[4px] border-gray-100 border-t-orange-500 animate-spin" />
            <p className="font-black text-gray-400 uppercase tracking-tighter text-sm">Rastreando pedido...</p>
        </div>
    );

    if (error) return (
        <div className="text-center py-32 px-8">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">😕</div>
            <p className="text-gray-900 font-black text-xl mb-2">¡Ups! Algo salió mal</p>
            <p className="text-gray-500 text-sm mb-8">{error}</p>
            <button
                onClick={() => { clearError(); navigate("/client/pedidos"); }}
                className="px-8 py-4 bg-black text-white font-[900] rounded-2xl hover:bg-orange-500 transition-all uppercase text-xs tracking-widest"
            >
                Volver a mis pedidos
            </button>
        </div>
    );

    if (!order) return null;

    const canCancel = order.status === "PENDIENTE";
    const date = new Date(order.createdAt).toLocaleDateString("es-GT", {
        weekday: "long", day: "numeric", month: "long"
    });
    const time = new Date(order.createdAt).toLocaleTimeString("es-GT", {
        hour: "2-digit", minute: "2-digit"
    });

    const STATUS_STEPS = ["PENDIENTE", "CONFIRMADO", "EN_PREPARACION", "LISTO", "EN_CAMINO", "ENTREGADO"];
    const currentIndex = STATUS_STEPS.indexOf(order.status);
    const isCancelled  = order.status === "CANCELADO";

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* HERO SECTION - Estilo Cinemático */}
            <div className="relative bg-zinc-950 text-white pt-20 pb-32 px-8 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                        alt="Orden Detail"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                </div>

                <div className="max-w-[1200px] mx-auto relative z-10">
                    <button
                        onClick={() => navigate("/client/pedidos")}
                        className="mb-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-orange-500 hover:text-white transition-colors"
                    >
                        ← Volver a pedidos
                    </button>
                    
                    <div className="flex justify-between items-end flex-wrap gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${getStatusStyle(order.status)}`}>
                                    {getStatusIcon(order.status)} {getStatusLabel(order.status)}
                                </span>
                                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                                    ID: #{order._id?.slice(-6).toUpperCase()}
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-[900] tracking-tighter leading-none mb-2">
                                Detalle del <span className="text-orange-500">Pedido.</span>
                            </h1>
                            <p className="text-gray-400 font-medium capitalize italic">{date} · {time}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-8 -mt-12 relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna Izquierda: Progreso y Detalles */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Timeline de progreso Premium */}
                    {!isCancelled && (
                        <div className="bg-white rounded-[32px] shadow-xl shadow-black/5 p-8 border border-gray-100">
                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-10">Estado del rastreo</h3>
                            <div className="relative flex justify-between items-start">
                                {/* Línea de fondo */}
                                <div className="absolute top-5 left-0 w-full h-[3px] bg-gray-100 z-0" />
                                
                                {STATUS_STEPS.map((step, i) => {
                                    const isDone = i <= currentIndex;
                                    const isCurrent = i === currentIndex;

                                    return (
                                        <div key={step} className="relative z-10 flex flex-col items-center group">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500
                                                ${isCurrent ? "bg-orange-500 text-white scale-125 shadow-xl shadow-orange-500/40 ring-4 ring-white" 
                                                : isDone ? "bg-black text-white" : "bg-white border-2 border-gray-100 text-gray-300"}`}>
                                                {isDone ? "✓" : i + 1}
                                            </div>
                                            <p className={`mt-4 text-[9px] font-black uppercase tracking-tighter text-center w-12 leading-tight transition-colors
                                                ${isDone ? "text-black" : "text-gray-300"}`}>
                                                {getStatusLabel(step)}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Lista de Platillos */}
                    <div className="bg-white rounded-[32px] shadow-xl shadow-black/5 p-8 border border-gray-100">
                        <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Tu Orden</h3>
                        <div className="space-y-4">
                            {order.details?.map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 font-black text-sm group-hover:bg-orange-500 group-hover:text-white transition-all">
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <p className="font-black text-gray-900 text-base">{item.dish?.name ?? "Platillo"}</p>
                                            {item.specialInstructions && (
                                                <p className="text-xs text-gray-400 font-medium mt-1 italic">
                                                    “{item.specialInstructions}”
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="font-black text-gray-900">
                                        Q{Number(item.unitPrice * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Resumen de Pago e Info */}
                <div className="space-y-6">
                    {/* Resumen de Pago */}
                    <div className="bg-black text-white rounded-[32px] shadow-2xl p-8">
                        <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 text-center">Resumen de Pago</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span className="font-bold">Q{(Number(order.totalPrice) + Number(order.discount) - Number(order.deliveryFee)).toFixed(2)}</span>
                            </div>
                            
                            {order.deliveryFee > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Envío</span>
                                    <span className="font-bold">Q{Number(order.deliveryFee).toFixed(2)}</span>
                                </div>
                            )}

                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-400">
                                    <span className="font-black uppercase tracking-widest text-[10px]">Descuento</span>
                                    <span className="font-black">- Q{Number(order.discount).toFixed(2)}</span>
                                </div>
                            )}

                            <div className="pt-6 mt-2 border-t border-zinc-800 flex justify-between items-end">
                                <span className="font-black uppercase tracking-widest text-xs text-orange-500">Total Final</span>
                                <span className="text-3xl font-[900] tracking-tighter">Q{Number(order.totalPrice).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Información Logística */}
                    <div className="bg-white rounded-[32px] shadow-xl shadow-black/5 p-8 border border-gray-100 space-y-6">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Restaurante</p>
                            <p className="text-sm font-black text-gray-900">{order.restaurant?.name ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Entrega</p>
                            <p className="text-sm font-black text-gray-900">{getOrderTypeLabel(order.orderType)}</p>
                        </div>
                        {order.orderType === "DOMICILIO" && order.deliveryAddress && (
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Dirección</p>
                                <p className="text-xs font-bold text-gray-600 leading-relaxed italic">
                                    {[order.deliveryAddress.street, order.deliveryAddress.zone, order.deliveryAddress.city]
                                        .filter(Boolean).join(", ")}
                                </p>
                            </div>
                        )}
                        {order.notes && (
                            <div className="bg-orange-50/50 rounded-2xl p-4 border border-orange-100">
                                <p className="text-[10px] font-black text-orange-600 uppercase mb-2">Nota del cliente</p>
                                <p className="text-xs text-orange-800 font-medium italic">"{order.notes}"</p>
                            </div>
                        )}
                    </div>

                    {/* Botón Cancelar */}
                    {canCancel && (
                        <button
                            onClick={() => setCancelConfirm(true)}
                            className="w-full py-4 rounded-2xl border-2 border-red-50 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                            Cancelar este pedido
                        </button>
                    )}
                </div>
            </div>

            {/* Modal de Confirmación Estilizado */}
            {cancelConfirm && (
                <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[32px] px-8 py-8 w-full max-w-sm shadow-2xl">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto text-2xl">⚠️</div>
                        <p className="text-xl font-black text-gray-900 mb-2 text-center tracking-tighter">¿Detener pedido?</p>
                        <p className="text-sm text-gray-500 mb-8 text-center font-medium leading-relaxed">Si cancelas ahora, tu comida no llegará y el restaurante será notificado.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setCancelConfirm(false)}
                                className="px-4 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition-all text-xs uppercase"
                            >
                                Mantener
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 py-3 rounded-xl bg-red-500 text-white font-black hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 text-xs uppercase"
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