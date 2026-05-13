import {create } from "zustand";
import { 
    getOrdersRequest,
    createOrderRequest,
    updateOrderRequest,
    getOrderByIdRequest,
    cancelOrderRequest
} from "../../../shared/api/orders";

const VALID_STATUSES = [
    "PENDIENTE",
    "CONFIRMADO",
    "EN_PREPARACION",
    "LISTO",
    "EN_CAMINO",
    "ENTREGADO",
    "CANCELADO",
];

export const useOrderStore = create((set, get) => ({
    orders: [],
    selectedOrder: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 10,
    },
    loading: false,
    error: null,

    fetchOrders: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const response = await getOrdersRequest(params);
            set({
                orders: response.data.data,
                pagination: response.data.pagination,
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener pedidos.",
                loading: false,
            });
        }
    },

    fetchOrderById: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await getOrderByIdRequest(id);
            set({ selectedOrder: response.data.data, loading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener pedido.",
                loading: false,
            });
        }
    },

    createOrder: async (orderData) => {
        try {
            set({ loading: true, error: null });
            const response = await createOrderRequest(orderData);
            set({
                orders: [response.data.data, ...get().orders],
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al crear pedido.",
                loading: false,
            });
        }
    },

    updateOrder: async (id, orderData) => {
        try {
            set({ loading: true, error: null });
            const response = await updateOrderRequest(id, orderData);
            const updated = response.data.data;
            set({
                orders: get().orders.map((o) => (o._id === id ? updated : o)),
                selectedOrder: get().selectedOrder?._id === id
                    ? updated
                    : get().selectedOrder,
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al actualizar pedido.",
                loading: false,
            });
        }
    },

    updateOrderStatus: async (id, status) => {
        try {
            set({ loading: true, error: null });

            if (!VALID_STATUSES.includes(status)) {
                set({
                    error: `Estado inválido. Use: ${VALID_STATUSES.join(", ")}`,
                    loading: false,
                });
                return;
            }

            const response = await updateOrderStatusRequest(id, status);
            const updated = response.data.data;
            set({
                orders: get().orders.map((o) => (o._id === id ? updated : o)),
                selectedOrder: get().selectedOrder?._id === id
                    ? updated
                    : get().selectedOrder,
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al actualizar estado.",
                loading: false,
            });
        }
    },

    cancelOrder: async (id) => {
        try {
            set({ loading: true, error: null });
            await cancelOrderRequest(id);
            set({
                orders: get().orders.map((o) =>
                    o._id === id ? { ...o, status: "CANCELADO" } : o
                ),
                selectedOrder: get().selectedOrder?._id === id
                    ? { ...get().selectedOrder, status: "CANCELADO" }
                    : get().selectedOrder,
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al cancelar pedido.",
                loading: false,
            });
        }
    }
    
}));