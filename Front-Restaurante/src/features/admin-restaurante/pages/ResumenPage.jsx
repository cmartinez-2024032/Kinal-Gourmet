import { useEffect, useState } from "react";
import { getDashboardSummary } from "../services/dashboard.service";

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

                // VALIDACIÓN SEGURA
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

        // CARGA INICIAL
        loadData();

        // AUTO REFRESH CADA 5 SEGUNDOS
        const interval = setInterval(() => {
            loadData();
        }, 5000);

        // LIMPIAR INTERVAL
        return () => clearInterval(interval);

    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <h2>Cargando dashboard...</h2>
            </div>
        );
    }

    return (
        <div className="dashboard-container p-6">

            <h1 className="text-2xl font-bold mb-6">
                Resumen Restaurante
            </h1>

            {/* CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

                <div className="card border p-4 rounded shadow">
                    <h3 className="font-semibold">Ventas Totales</h3>
                    <p>Q {summary.totalSales}</p>
                </div>

                <div className="card border p-4 rounded shadow">
                    <h3 className="font-semibold">Pedidos</h3>
                    <p>{summary.totalOrders}</p>
                </div>

                <div className="card border p-4 rounded shadow">
                    <h3 className="font-semibold">Pedidos Pendientes</h3>
                    <p>{summary.pendingOrders}</p>
                </div>

                <div className="card border p-4 rounded shadow">
                    <h3 className="font-semibold">Pedidos Entregados</h3>
                    <p>{summary.deliveredOrders}</p>
                </div>

                <div className="card border p-4 rounded shadow">
                    <h3 className="font-semibold">Reservaciones</h3>
                    <p>{summary.totalReservations}</p>
                </div>

                <div className="card border p-4 rounded shadow">
                    <h3 className="font-semibold">Platillos</h3>
                    <p>{summary.totalDishes}</p>
                </div>

                <div className="card border p-4 rounded shadow">
                    <h3 className="font-semibold">Eventos Activos</h3>
                    <p>{summary.activeEvents}</p>
                </div>

            </div>

            {/* ÚLTIMOS PEDIDOS */}
            <h2 className="text-xl font-semibold mb-3">
                Últimos pedidos
            </h2>

            <div className="overflow-x-auto mb-10">

                <table className="w-full border">

                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Cliente</th>
                            <th className="p-2">Total</th>
                            <th className="p-2">Estado</th>
                            <th className="p-2">Tipo</th>
                        </tr>
                    </thead>

                    <tbody>

                        {summary.recentOrders.length > 0 ? (

                            summary.recentOrders.map((order) => (

                                <tr key={order._id} className="border-t">

                                    <td className="p-2">
                                        {order.userInfo?.name || "Sin nombre"}
                                    </td>

                                    <td className="p-2">
                                        Q {order.totalPrice}
                                    </td>

                                    <td className="p-2">
                                        {order.status}
                                    </td>

                                    <td className="p-2">
                                        {order.orderType}
                                    </td>

                                </tr>

                            ))

                        ) : (

                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center p-4"
                                >
                                    No hay pedidos recientes
                                </td>
                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

            {/* TOP PLATILLOS */}
            <h2 className="text-xl font-semibold mb-3">
                Platillos más pedidos
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                {summary.topDishes.length > 0 ? (

                    summary.topDishes.map((dish) => (

                        <div
                            key={dish._id}
                            className="border p-3 rounded shadow"
                        >

                            <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-full h-24 object-cover rounded"
                            />

                            <h4 className="font-semibold mt-2">
                                {dish.name}
                            </h4>

                            <p className="text-sm">
                                Pedidos: {dish.orderedCount || 0}
                            </p>

                        </div>

                    ))

                ) : (

                    <p>No hay platillos registrados</p>

                )}

            </div>

        </div>
    );
};