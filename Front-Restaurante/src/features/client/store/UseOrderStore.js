import { create } from "zustand";
import { getOrdersRequest, getOrderByIdRequest, cancelOrderRequest } from "../../../shared/api/orders.js";

export const useOrderStore = create((set, get) => ({
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,

    // ── Etiquetas y estilos ───────────────────────────────────────
    getStatusLabel: (status) => {
        const labels = {
            PENDIENTE:      "Pendiente",
            CONFIRMADO:     "Confirmado",
            EN_PREPARACION: "En preparación",
            LISTO:          "Listo",
            EN_CAMINO:      "En camino",
            ENTREGADO:      "Entregado",
            CANCELADO:      "Cancelado",
        };
        return labels[status] ?? status;
    },

    getStatusStyle: (status) => {
        const styles = {
            PENDIENTE:      "bg-yellow-100 text-yellow-700",
            CONFIRMADO:     "bg-blue-100 text-blue-700",
            EN_PREPARACION: "bg-orange-100 text-orange-700",
            LISTO:          "bg-green-100 text-green-700",
            EN_CAMINO:      "bg-purple-100 text-purple-700",
            ENTREGADO:      "bg-emerald-100 text-emerald-700",
            CANCELADO:      "bg-red-100 text-red-700",
        };
        return styles[status] ?? "bg-gray-100 text-gray-600";
    },

    getStatusIcon: (status) => {
        const icons = {
            PENDIENTE:      "🕐",
            CONFIRMADO:     "✅",
            EN_PREPARACION: "👨‍🍳",
            LISTO:          "🔔",
            EN_CAMINO:      "🛵",
            ENTREGADO:      "🎉",
            CANCELADO:      "❌",
        };
        return icons[status] ?? "📋";
    },

    getOrderTypeLabel: (type) => {
        const labels = {
            EN_MESA:     "🪑 En mesa",
            PARA_LLEVAR: "🥡 Para llevar",
            DOMICILIO:   "🛵 Domicilio",
        };
        return labels[type] ?? type;
    },

    // ── Obtener lista de pedidos ──────────────────────────────────
    fetchOrders: async () => {
        try {
            set({ loading: true, error: null });
            const res  = await getOrdersRequest({ limit: 50 });
            // El backend devuelve { success, data: [...] } o { success, data: { orders: [...] } }
            const raw  = res.data?.data;
            const data = Array.isArray(raw) ? raw : (raw?.orders ?? []);
            set({ orders: data, loading: false });
        } catch (err) {
            set({
                error:   err.response?.data?.message || "Error al cargar los pedidos",
                loading: false,
            });
        }
    },

    // ── Obtener detalle de UN pedido por ID ───────────────────────
    // ANTES: llamaba a getOrdersRequest (todos) — por eso llegaba un array
    // y la vista mostraba NaN / Invalid Date / campos vacíos.
    // AHORA: usa getOrderByIdRequest(id) y desenvuelve res.data.data
    fetchOrderById: async (id) => {
        try {
            set({ loading: true, error: null, selectedOrder: null });
            const res   = await getOrderByIdRequest(id);
            // El backend responde: { success: true, data: { ...order } }
            const order = res.data?.data ?? res.data;
            set({ selectedOrder: order, loading: false });
        } catch (err) {
            set({
                error:   err.response?.data?.message || "Error al cargar el pedido",
                loading: false,
            });
        }
    },

    // ── Cancelar un pedido ────────────────────────────────────────
    cancelOrder: async (id) => {
        try {
            set({ loading: true, error: null });
            await cancelOrderRequest(id);
            set((s) => ({
                orders: s.orders.map((o) =>
                    o._id === id ? { ...o, status: "CANCELADO" } : o
                ),
                selectedOrder: s.selectedOrder?._id === id
                    ? { ...s.selectedOrder, status: "CANCELADO" }
                    : s.selectedOrder,
                loading: false,
            }));
        } catch (err) {
            set({
                error:   err.response?.data?.message || "Error al cancelar el pedido",
                loading: false,
            });
            throw err;
        }
    },

    clearError:         () => set({ error: null }),
    clearSelectedOrder: () => set({ selectedOrder: null }),
}));