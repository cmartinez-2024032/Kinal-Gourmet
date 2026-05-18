'use strict';

import Order from '../orders/order.model.js';
import Reservation from '../reservations/reservation.model.js';
import Dish from '../dishes/dish.model.js';
import Event from '../events/event.model.js';

export const getDashboardSummary = async (req, res) => {

    try {

        // =========================
        // CONSULTAS EN PARALELO
        // =========================

        const [
            totalOrders,
            totalReservations,
            totalDishes,
            totalEvents,
            pendingOrders,
            deliveredOrders,
            activeEvents,
            orders,
            recentOrders,
            topDishes
        ] = await Promise.all([

            Order.countDocuments(),
            Reservation.countDocuments(),
            Dish.countDocuments(),
            Event.countDocuments(),

            Order.countDocuments({ status: 'PENDIENTE' }),
            Order.countDocuments({ status: 'ENTREGADO' }),
            Event.countDocuments({ isActive: true }),

            Order.find().select('totalPrice'),

            Order.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('userInfo totalPrice status orderType createdAt')
                .lean(),

            Dish.find()
                .sort({ orderedCount: -1 })
                .limit(5)
                .select('name orderedCount image')
                .lean()
        ]);

        // =========================
        // VENTAS TOTALES SEGURAS
        // =========================

        const totalSales = orders.reduce((acc, order) => {

            const value = parseFloat(order.totalPrice?.toString?.() || 0);

            return acc + (isNaN(value) ? 0 : value);

        }, 0);

        // =========================
        // RESPONSE FINAL
        // =========================

        return res.status(200).json({

            success: true,

            summary: {
                totalSales,
                totalOrders,
                totalReservations,
                totalDishes,
                totalEvents,
                pendingOrders,
                deliveredOrders,
                activeEvents,
                recentOrders: recentOrders || [],
                topDishes: topDishes || []
            }
        });

    } catch (error) {

        console.error('Dashboard error:', error);

        return res.status(500).json({

            success: false,
            message: 'Error obteniendo dashboard',
            error: error.message
        });
    }
};