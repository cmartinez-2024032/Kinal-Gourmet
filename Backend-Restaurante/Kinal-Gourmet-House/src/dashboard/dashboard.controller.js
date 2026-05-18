'use strict';

import Order from '../orders/order.model.js';
import Reservation from '../reservations/reservation.model.js';
import Dish from '../dishes/dish.model.js';
import Event from '../events/event.model.js';
import mongoose from 'mongoose';

export const getDashboardSummary = async (req, res) => {
    try {
        const filter = {};

        if (req.user && req.user.role === 'ADMIN_RESTAURANTE' && req.user.restaurantId) {
            filter.restaurant = new mongoose.Types.ObjectId(req.user.restaurantId);
        
        }

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

            Order.countDocuments(filter).catch(() => 0),
            Reservation.countDocuments(filter).catch(() => 0),
            Dish.countDocuments(filter).catch(() => 0),
            Event.countDocuments(filter).catch(() => 0),

            Order.countDocuments({ ...filter, status: 'PENDIENTE' }).catch(() => 0),
            Order.countDocuments({ ...filter, status: 'ENTREGADO' }).catch(() => 0),
            Event.countDocuments({ ...filter, isActive: true }).catch(() => 0),

            Order.find(filter).select('totalPrice').lean().catch(() => []),

            Order.find(filter)
                .sort({ createdAt: -1 })
                .limit(5)
                .select('userInfo totalPrice status orderType createdAt')
                .lean()
                .catch(() => []),

            Dish.find(filter)
                .sort({ orderedCount: -1 })
                .limit(5)
                .select('name orderedCount image')
                .lean()
                .catch(() => [])
        ]);

        // CÁLCULO DE VENTAS TOTALES SEGURO
        const totalSales = orders.reduce((acc, order) => {
            const value = parseFloat(order.totalPrice?.toString?.() || 0);
            return acc + (isNaN(value) ? 0 : value);
        }, 0);
        // RESPUESTA EXITOSA PARA EL FRONTEND
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
            message: 'Error interno al obtener el resumen del dashboard',
            error: error.message
        });
    }
};