import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/UseOrderStore";
import { Search, ClipboardList, Clock, CheckCircle, Truck, XCircle, ChevronRight, AlertCircle } from "lucide-react";

const STATUS_FILTERS = [
    { value: "TODOS",          label: "Todos",           icon: <ClipboardList size={16} /> },
    { value: "PENDIENTE",      label: "Pendientes",      icon: <Clock size={16} /> },
    { value: "EN_PREPARACION", label: "En preparación", icon: <Clock size={16} /> },
    { value: "LISTO",          label: "Listos",          icon: <CheckCircle size={16} /> },
    { value: "EN_CAMINO",      label: "En camino",       icon: <Truck size={16} /> },
    { value: "ENTREGADO",      label: "Entregados",      icon: <CheckCircle size={16} /> },
    { value: "CANCELADO",      label: "Cancelados",      icon: <XCircle size={16} /> },
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
        <div className="min-h-screen bg-[#fcfcfc]">
            {/* HERO SECTION - Ajustado para dar más aire */}
            <div className="relative bg-zinc-950 text-white pt-24 pb-32 px-8 overflow-hidden">
                {/* Imagen de Fondo con Querencia a Pedidos */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.pexels.com/photos/4393426/pexels-photo-4393426.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                        className="w-full h-full object-cover"
                        alt="Hero Background"
                    />
                    {/* Degradado para fundir con el diseño */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                </div>

                <div className="max-w-[1400px] mx-auto relative z-10">
                    {/* Estilo de Fuente "Kinal Gourmet" (Extra Bold / Black) */}
                    <h1 className="text-6xl md:text-7xl font-[900] mb-6 tracking-tighter leading-none">
                        Tus <span className="text-orange-500 font-serif italic">Pedidos</span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl font-light">
                        Gestiona tus antojos y sigue el estado de tus platillos favoritos en tiempo real.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-8 -mt-12 pb-20 relative z-20"> {/* -mt-12 para un solapamiento más limpio */}
                {/* FILTROS DE ESTADO - Con estabilización de ancho */}
                <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-4 border border-gray-100 flex gap-2 overflow-x-auto no-scrollbar mb-10">
                    {STATUS_FILTERS.map(({ value, label, icon }) => (
                        <button
                            key={value}
                            onClick={() => setFilterStatus(value)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shrink-0 border-2
                                ${filterStatus === value
                                    ? "bg-black text-white shadow-lg shadow-black/20 border-black"
                                    : "bg-gray-50 text-gray-400 hover:bg-gray-100 border-transparent"}`}
                            style={{
                                // Esto evita que el botón cambie de tamaño al activarse
                                minWidth: "max-content" 
                            }}
                        >
                            <span className="shrink-0">{icon}</span>
                            {/* Usamos un truco de CSS para que el texto ocupe siempre el mismo ancho aunque cambie de peso */}
                            <span className="relative inline-flex flex-col items-center">
                                {label}
                                <span className="block font-black h-0 overflow-hidden invisible" aria-hidden="true">
                                    {label}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>

                {/* ALERTAS DE ERROR */}
                {error && (
                    <div className="mb-6 flex items-center justify-between bg-red-50 border border-red-100 rounded-2xl px-6 py-4 text-red-600 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle size={20} />
                            <span className="font-bold text-sm uppercase tracking-tight">{error}</span>
                        </div>
                        <button onClick={clearError} className="p-2 hover:bg-red-100 rounded-full transition-colors">✕</button>
                    </div>
                )}

                {/* CONTENIDO PRINCIPAL */}
                {loading ? (
                    <div className="flex flex-col items-center py-32 gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-orange-500 animate-spin" />
                        <p className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">Sincronizando cocina...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No encontramos nada por aquí</h3>
                        <p className="text-gray-400 font-medium mb-8">
                            {filterStatus === "TODOS" ? "Parece que aún no has realizado ningún pedido." : "No hay órdenes con este estado actualmente."}
                        </p>
                        <button
                            onClick={() => navigate("/client")}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all hover:scale-105 active:scale-95"
                        >
                            Explorar Menú
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </div>

            {/* MODAL DE CANCELACIÓN */}
            {cancelConfirm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
                    <div className="bg-white rounded-[32px] p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
                        <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                            <AlertCircle className="text-red-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">¿Detener el pedido?</h2>
                        <p className="text-gray-500 font-medium mb-8">Esta acción notificará al restaurante de inmediato y no podrá revertirse.</p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setCancelConfirm(null)}
                                className="py-4 rounded-2xl border border-gray-100 text-gray-500 font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all"
                            >
                                Mantener
                            </button>
                            <button
                                onClick={handleCancel}
                                className="py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                            >
                                Sí, Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── CARD DE PEDIDO ESTILIZADA ── */
function OrderCard({ order, getStatusLabel, getStatusStyle, getStatusIcon, getOrderTypeLabel, onView, onCancel }) {
    const canCancel = order.status === "PENDIENTE";
    const date = new Date(order.createdAt).toLocaleDateString("es-GT", {
        day: "numeric", month: "long"
    });

    return (
        <div className="group bg-white rounded-[32px] border border-gray-100 p-6 transition-all hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] block mb-1">
                        {order.orderType === "DOMICILIO" ? "Delivery" : "En Restaurante"}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-orange-500 transition-colors">
                        {order.restaurant?.name ?? "Restaurante"}
                    </h3>
                    <p className="text-gray-400 text-xs font-bold">{date}</p>
                </div>
                <div className={`p-3 rounded-2xl shadow-sm ${getStatusStyle(order.status)}`}>
                    {getStatusIcon(order.status)}
                </div>
            </div>

            <div className="space-y-3 mb-8">
                {order.details?.slice(0, 2).map((d, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50/50 rounded-xl p-3">
                        <span className="text-sm font-bold text-gray-700 truncate mr-4">
                            <span className="text-orange-500 mr-2">{d.quantity}x</span> {d.dish?.name ?? "Platillo"}
                        </span>
                    </div>
                ))}
                {order.details?.length > 2 && (
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest pl-2">
                        + {order.details.length - 2} productos más
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Total Pagado</p>
                    <p className="text-2xl font-black text-gray-900">Q{Number(order.totalPrice).toFixed(2)}</p>
                </div>
                <div className="flex gap-2">
                    {canCancel && (
                        <button
                            onClick={onCancel}
                            className="p-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all"
                            title="Cancelar pedido"
                        >
                            <XCircle size={20} />
                        </button>
                    )}
                    <button
                        onClick={onView}
                        className="bg-black text-white p-3 rounded-xl hover:bg-orange-500 transition-all shadow-lg shadow-black/10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest px-5"
                    >
                        Detalles
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}