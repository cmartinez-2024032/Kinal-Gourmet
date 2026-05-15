import { useEffect, useState } from "react";
import { useOrderStore } from "../store/useOrderStore";
import { OrderModal } from "../components/OrderModal";

const STATUS_CONFIG = {
    PENDIENTE:      { label: "Pendiente",      dot: "bg-amber-400",   badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",   pill: "bg-amber-500/10 text-amber-400 border-amber-400" },
    CONFIRMADO:     { label: "Confirmado",     dot: "bg-blue-500",    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",     pill: "bg-blue-500/10 text-blue-400 border-blue-500" },
    EN_PREPARACION: { label: "En preparación", dot: "bg-violet-500",  badge: "bg-violet-500/10 text-violet-400 border-violet-500/20", pill: "bg-violet-500/10 text-violet-400 border-violet-500" },
    LISTO:          { label: "Listo",          dot: "bg-emerald-500", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500" },
    EN_CAMINO:      { label: "En camino",      dot: "bg-cyan-500",    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",     pill: "bg-cyan-500/10 text-cyan-400 border-cyan-500" },
    ENTREGADO:      { label: "Entregado",      dot: "bg-green-500",   badge: "bg-green-500/10 text-green-400 border-green-500/20",   pill: "bg-green-500/10 text-green-400 border-green-500" },
    CANCELADO:      { label: "Cancelado",      dot: "bg-red-500",     badge: "bg-red-500/10 text-red-400 border-red-500/20",       pill: "bg-red-500/10 text-red-400 border-red-500" },
};

const ORDER_TYPE_CONFIG = {
    EN_MESA:     { label: "En mesa",     icon: "🪑" },
    PARA_LLEVAR: { label: "Para llevar", icon: "🥡" },
    DOMICILIO:   { label: "Domicilio",   icon: "🛵" },
};

const SUMMARY_CARDS = [
    { key: "PENDIENTE",      label: "Pendientes",     icon: "⏳", bg: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30", text: "text-amber-400" },
    { key: "EN_PREPARACION", label: "En proceso",    icon: "🍳", bg: "from-violet-500/20 to-violet-500/5", border: "border-violet-500/30", text: "text-violet-400" },
    { key: "LISTO",          label: "Listos",         icon: "✅", bg: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30", text: "text-emerald-400" },
    { key: "ENTREGADO",      label: "Entregados",     icon: "🎉", bg: "from-green-500/20 to-green-500/5", border: "border-green-500/30", text: "text-green-400" },
    { key: "CANCELADO",      label: "Cancelados",     icon: "✕",  bg: "from-red-500/20 to-red-500/5", border: "border-red-500/30", text: "text-red-400" },
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

    return (
        <div className="w-full min-h-screen text-[#F2EDE8] relative overflow-x-hidden p-6 md:p-8 bg-[#0F0E0D]">
            
            {/* Cinematic Background Glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-700/5 blur-[100px]" />
            </div>

            <div className="max-w-[1200px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-orange-500 to-orange-700 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
                            <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                                Pedidos
                            </h1>
                        </div>
                        <p className="text-sm font-medium text-[#A09890] pl-6">
                            <span className="text-white font-bold">{pagination.totalRecords}</span> registros totales · 
                            <span className="text-orange-400 font-bold ml-1">{summaryCounts.PENDIENTE || 0} pendientes</span>
                        </p>
                    </div>

                    <button
                        onClick={() => openModal("create")}
                        className="group relative flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-2xl font-black transition-all duration-500 hover:bg-orange-500 hover:shadow-[0_15px_35px_-10px_rgba(234,88,12,0.4)] hover:-translate-y-1 active:scale-95"
                    >
                        <span>+ Nuevo Pedido</span>
                    </button>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                    {SUMMARY_CARDS.map(c => (
                        <div
                            key={c.key}
                            className={`bg-white/[0.03] backdrop-blur-xl border ${c.border} rounded-3xl p-5 cursor-pointer relative overflow-hidden transition-all duration-500 hover:border-white/20 group`}
                            onClick={() => setActiveFilter(activeFilter === c.key ? "ALL" : c.key)}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <div className="flex items-center gap-3 relative z-10">
                                <span className="text-2xl filter drop-shadow-md">{c.icon}</span>
                                <div>
                                    <p className={`text-2xl font-black ${c.text}`} style={{ fontFamily: 'Syne, sans-serif' }}>
                                        {summaryCounts[c.key] || 0}
                                    </p>
                                    <p className="text-[9px] font-black text-[#A09890] uppercase tracking-widest">{c.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters + Search */}
                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 mb-10 shadow-2xl space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex gap-2 flex-wrap order-2 md:order-1">
                            <button
                                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                    activeFilter === "ALL"
                                        ? "bg-white text-black border-white shadow-lg scale-105"
                                        : "bg-white/5 border-white/5 text-[#A09890] hover:border-white/20 hover:text-white"
                                }`}
                                onClick={() => setActiveFilter("ALL")}
                            >
                                Todos
                            </button>
                            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                <button
                                    key={key}
                                    className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                        activeFilter === key
                                            ? `${cfg.pill} shadow-lg scale-105`
                                            : "bg-white/5 border-white/5 text-[#A09890] hover:border-white/20 hover:text-white"
                                    }`}
                                    onClick={() => setActiveFilter(activeFilter === key ? "ALL" : key)}
                                >
                                    {cfg.label}
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative w-full md:w-auto order-1 md:order-2">
                            <input
                                className="w-full md:w-[300px] bg-white/[0.04] border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-medium text-white placeholder-[#6B6560] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/30 focus:bg-white/[0.06] transition-all duration-300"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                placeholder="Buscar folio, cliente..."
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-lg">🔍</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-white/5 border-t-orange-500 rounded-full animate-spin" />
                        <p className="text-xs font-black text-[#6B6560] tracking-widest uppercase animate-pulse">Sincronizando Comandas</p>
                    </div>
                ) : (error) ? (
                    <div className="mb-8 bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-2xl px-6 py-4 text-sm text-red-200 shadow-2xl">
                        ⚠ {error}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[40px] py-32 text-center backdrop-blur-sm shadow-2xl">
                        <span className="text-6xl block mb-6 filter grayscale opacity-40">🧾</span>
                        <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>No hay pedidos</h3>
                        <p className="text-[#6B6560] font-medium">No se encontraron resultados para los filtros actuales.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5">
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
                                    className="group relative bg-white/[0.04] border border-white/5 rounded-[32px] overflow-hidden flex transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:border-white/10 hover:-translate-y-1"
                                >
                                    {/* Left Accent Status */}
                                    <div className={`w-1.5 shrink-0 ${sc.dot} opacity-80`} />

                                    <div className="flex-1 px-8 py-6 flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                <span className="text-sm font-black text-white font-mono bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                                    #{order._id?.slice(-6).toUpperCase()}
                                                </span>
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-wider border backdrop-blur-xl ${sc.badge}`}>
                                                    {sc.label}
                                                </span>
                                                <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-white/5 text-[#A09890] border border-white/5 uppercase tracking-wider">
                                                    {otc.icon} {otc.label}
                                                </span>
                                            </div>
                                            
                                            <h4 className="text-xl font-extrabold text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
                                                {order.userInfo?.name || "Cliente Invitado"}
                                            </h4>
                                            
                                            <p className="text-xs text-[#6B6560] font-medium flex items-center gap-2">
                                                <span>📅 {dateStr}</span>
                                                <span className="opacity-20">|</span>
                                                <span>📦 {itemCount} Items</span>
                                                {order.table && (
                                                    <>
                                                        <span className="opacity-20">|</span>
                                                        <span className="text-orange-500 font-bold">🪑 Mesa {order.table?.number || order.table}</span>
                                                    </>
                                                )}
                                            </p>
                                        </div>

                                        <div className="flex flex-col md:items-end justify-between gap-4">
                                            <div className="text-left md:text-right">
                                                <span className="text-3xl font-black text-white tracking-tighter" style={{ fontFamily: 'Syne, sans-serif' }}>
                                                    <span className="text-orange-500 text-sm mr-1">Q</span>
                                                    {(order.totalPrice || 0).toFixed(2)}
                                                </span>
                                                {order.discount > 0 && (
                                                    <div className="text-[11px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md inline-block mt-1 uppercase tracking-tighter">
                                                        Desc. -Q{order.discount.toFixed(2)}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openModal("view", order)}
                                                    className="px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#A09890] hover:text-white hover:bg-white/10 transition-all active:scale-95"
                                                >
                                                    Detalles
                                                </button>
                                                {order.status === "PENDIENTE" && (
                                                    <button
                                                        onClick={() => openModal("edit", order)}
                                                        className="px-4 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#A09890] hover:text-white hover:bg-white/10 transition-all active:scale-95"
                                                    >
                                                        ✏️
                                                    </button>
                                                )}
                                                {order.status !== "CANCELADO" && order.status !== "ENTREGADO" && (
                                                    <button
                                                        onClick={() => openModal("status", order)}
                                                        className="px-5 py-2.5 bg-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-500 shadow-lg shadow-orange-600/20 transition-all active:scale-95"
                                                    >
                                                        Estado
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination info */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 py-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-black text-[#6B6560] uppercase tracking-[0.3em]">
                            Página {pagination.currentPage} de {pagination.totalPages} · {pagination.totalRecords} Pedidos
                        </span>
                    </div>
                )}
            </div>

            {/* Modal */}
            <OrderModal
                isOpen={modalOpen}
                onClose={closeModal}
                order={selectedOrder}
                mode={modalMode}
            />
        </div>
    );
}