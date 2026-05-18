import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboard.service";
import { 
    DollarSign, 
    ShoppingBag, 
    Clock, 
    CheckCircle2, 
    Calendar, 
    UtensilsCrossed, 
    PartyPopper, 
    TrendingUp,
    Loader2,
    Utensils
} from "lucide-react";

export const ResumenPage = () => {
    const [summary, setSummary] = useState({
        totalSales: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        totalReservations: 0,
        totalDishes: 0,
        totalEvents: 0,
        activeEvents: 0,
        recentOrders: [],
        topDishes: []
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getDashboardSummary();
                console.log("Dashboard response:", data);

                if (data?.success && data?.summary) {
                    setSummary({
                        totalSales: data.summary.totalSales || 0,
                        totalOrders: data.summary.totalOrders || 0,
                        pendingOrders: data.summary.pendingOrders || 0,
                        deliveredOrders: data.summary.deliveredOrders || 0,
                        totalReservations: data.summary.totalReservations || 0,
                        totalDishes: data.summary.totalDishes || 0,
                        totalEvents: data.summary.totalEvents || 0,
                        activeEvents: data.summary.activeEvents || 0,
                        recentOrders: data.summary.recentOrders || [],
                        topDishes: data.summary.topDishes || []
                    });
                }
            } catch (error) {
                console.log("Error dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        const interval = setInterval(() => {
            loadData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3 text-white">
                <Loader2 className="animate-spin text-orange-500" size={40} />
                <h2 className="text-zinc-400 font-medium tracking-wide">Cargando estadísticas reales...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 lg:p-8 space-y-10">
            
            {/* ENCABEZADO */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                        <span className="w-2.5 h-8 bg-orange-500 rounded-full inline-block" />
                        Resumen Ejecutivo
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Monitoreo en tiempo real de las operaciones y rendimiento de tu cocina.
                    </p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-xs font-semibold text-orange-500 flex items-center gap-2 self-start sm:self-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    ACTUALIZANDO EN VIVO
                </div>
            </header>

            {/* SECCIÓN DE TARJETAS (CARDS KPIN) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Ventas Totales (Destacada) */}
                <div className="bg-zinc-900 border-2 border-orange-500/40 rounded-2xl p-5 shadow-xl shadow-orange-950/10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 bg-gradient-to-bl from-orange-500/10 to-transparent rounded-bl-full pointer-events-none" />
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-bold text-sm tracking-wide uppercase">Ventas Totales</span>
                        <div className="p-2.5 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-500/20">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">Q {summary.totalSales}</span>
                        <TrendingUp size={16} className="text-green-500" />
                    </div>
                </div>

                {/* Pedidos Totales */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg hover:border-zinc-700 transition-all group">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-bold text-sm tracking-wide uppercase">Pedidos</span>
                        <div className="p-2.5 bg-zinc-800 text-zinc-300 group-hover:text-orange-500 transition-colors rounded-xl">
                            <ShoppingBag size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-black text-white">{summary.totalOrders}</span>
                    </div>
                </div>

                {/* Pedidos Pendientes */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg hover:border-zinc-700 transition-all group">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-bold text-sm tracking-wide uppercase">Pedidos Pendientes</span>
                        <div className="p-2.5 bg-zinc-800 text-zinc-300 group-hover:text-orange-500 transition-colors rounded-xl">
                            <Clock size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-black text-orange-500">{summary.pendingOrders}</span>
                    </div>
                </div>

                {/* Pedidos Entregados */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg hover:border-zinc-700 transition-all group">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-bold text-sm tracking-wide uppercase">Pedidos Entregados</span>
                        <div className="p-2.5 bg-zinc-800 text-zinc-300 group-hover:text-orange-500 transition-colors rounded-xl">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-black text-white">{summary.deliveredOrders}</span>
                    </div>
                </div>

                {/* Reservaciones */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg hover:border-zinc-700 transition-all group">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-bold text-sm tracking-wide uppercase">Reservaciones</span>
                        <div className="p-2.5 bg-zinc-800 text-zinc-300 group-hover:text-orange-500 transition-colors rounded-xl">
                            <Calendar size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-black text-white">{summary.totalReservations}</span>
                    </div>
                </div>

                {/* Platillos Disponibles */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg hover:border-zinc-700 transition-all group">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-bold text-sm tracking-wide uppercase">Platillos</span>
                        <div className="p-2.5 bg-zinc-800 text-zinc-300 group-hover:text-orange-500 transition-colors rounded-xl">
                            <UtensilsCrossed size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-black text-white">{summary.totalDishes}</span>
                    </div>
                </div>

                {/* Eventos Activos */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg hover:border-zinc-700 transition-all group">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-bold text-sm tracking-wide uppercase">Eventos Activos</span>
                        <div className="p-2.5 bg-zinc-800 text-zinc-300 group-hover:text-orange-500 transition-colors rounded-xl">
                            <PartyPopper size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-black text-white">{summary.activeEvents}</span>
                    </div>
                </div>
            </section>

            {/* SECCIÓN INFERIOR COMPUESTA */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* ÚLTIMOS PEDIDOS (Ocupa 2 columnas en pantallas muy grandes) */}
                <div className="xl:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white tracking-tight">Últimos Pedidos Entrados</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                                    <th className="pb-3 pl-2">Cliente</th>
                                    <th className="pb-3">Total</th>
                                    <th className="pb-3">Estado</th>
                                    <th className="pb-3 pr-2">Tipo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50 text-sm">
                                {summary.recentOrders.length > 0 ? (
                                    summary.recentOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-zinc-800/30 transition-colors group">
                                            <td className="py-4 pl-2 font-medium text-white group-hover:text-orange-500 transition-colors">
                                                {order.userInfo?.name || "Sin nombre"}
                                            </td>
                                            <td className="py-4 font-bold text-zinc-200">
                                                Q {order.totalPrice}
                                            </td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    order.status === 'PENDIENTE' 
                                                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                                                        : order.status === 'LISTO' || order.status === 'ENTREGADO'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-zinc-800 text-zinc-400'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-4 pr-2 text-zinc-400 text-xs font-medium">
                                                {order.orderType}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-10 text-zinc-500 font-medium">
                                            No hay flujos de pedidos recientes en este restaurante.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PLATILLOS MÁS PEDIDOS (Top 5 en Barra Lateral) */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col space-y-4">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Platillos Más Pedidos</h2>
                        <p className="text-xs text-zinc-500 mt-0.5">Los favoritos de tu menú.</p>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto max-h-[380px] pr-1">
                        {summary.topDishes.length > 0 ? (
                            summary.topDishes.map((dish) => (
                                <div 
                                    key={dish._id} 
                                    className="flex items-center gap-4 p-2 bg-zinc-950 border border-zinc-850 rounded-xl hover:border-zinc-700 transition-all group"
                                >
                                    {dish.image ? (
                                        <img
                                            src={dish.image}
                                            alt={dish.name}
                                            className="w-14 h-14 object-cover rounded-lg bg-zinc-900"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-600">
                                            <Utensils size={20} />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-zinc-200 truncate group-hover:text-orange-500 transition-colors">
                                            {dish.name}
                                        </h4>
                                        <p className="text-xs text-zinc-500 font-medium mt-0.5 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full inline-block" />
                                            Pedidos: <span className="text-zinc-300 font-bold">{dish.orderedCount || 0}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-zinc-500 font-medium text-sm">
                                No se registran ventas de platillos todavía.
                            </div>
                        )}
                    </div>
                </div>

            </section>
        </div>
    );
};