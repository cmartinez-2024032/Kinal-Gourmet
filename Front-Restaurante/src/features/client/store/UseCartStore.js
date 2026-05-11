import { create } from "zustand";
import axios from 'axios';

const CART_KEY = "restaurant_cart";

const loadCart = () => {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : {
            items: [],
            restaurantId: null,
            restaurantName: "",
            orderType: "PARA_LLEVAR",
            deliveryAddress: "",
            deliveryPhone: "",
        };
    } catch {
        return {
            items: [],
            restaurantId: null,
            restaurantName: "",
            orderType: "PARA_LLEVAR",
            deliveryAddress: "",
            deliveryPhone: "",
        };
    }
};

const saveCart = (state) => {
    localStorage.setItem(CART_KEY, JSON.stringify({
        items: state.items,
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
        orderType: state.orderType,
        deliveryAddress: state.deliveryAddress,
        deliveryPhone: state.deliveryPhone,
    }));
};

export const useCartStore = create((set, get) => ({
    ...loadCart(),
    isCartOpen: false,

    // ─── Drawer ───────────────────────────────────────────────
    openCart:   () => set({ isCartOpen: true }),
    closeCart:  () => set({ isCartOpen: false }),
    toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

    // ─── Tipo de orden y datos de entrega ─────────────────────
    /**
     * Valores válidos: "PARA_LLEVAR" | "DOMICILIO"
     * EN_MESA fue eliminado del flujo del carrito porque las reservaciones
     * tienen su propio módulo en la aplicación.
     */
    setOrderType: (type) => {
        const next = { ...get(), orderType: type };
        saveCart(next);
        set({ orderType: type });
    },

    setDeliveryAddress: (address) => {
        const next = { ...get(), deliveryAddress: address };
        saveCart(next);
        set({ deliveryAddress: address });
    },

    setDeliveryPhone: (phone) => {
        const next = { ...get(), deliveryPhone: phone };
        saveCart(next);
        set({ deliveryPhone: phone });
    },

    // ─── Cupones ──────────────────────────────────────────────
    appliedCoupon:     null,
    appliedCouponCode: null,
    discountAmount:    0,
    isApplyingCoupon:  false,

    applyCoupon: async (code, userId, restaurantId) => {
        set({ isApplyingCoupon: true });
        const total = get().getTotalPrice();

        try {
            const response = await axios.post(
                'http://localhost:3006/kinalGourmetHouse/v1/coupons/validate',
                { code, userId, restaurantId, orderTotal: total }
            );

            if (response.data.success) {
                set({
                    appliedCoupon:     response.data.data.coupon,
                    appliedCouponCode: code,
                    discountAmount:    response.data.data.estimatedDiscount,
                    isApplyingCoupon:  false,
                });
                return { success: true, message: 'Cupón aplicado' };
            }
        } catch (error) {
            set({ appliedCoupon: null, appliedCouponCode: null, discountAmount: 0, isApplyingCoupon: false });
            return {
                success: false,
                message: error.response?.data?.message || 'Error al validar cupón',
            };
        }
    },

    removeCoupon: () => set({ appliedCoupon: null, appliedCouponCode: null, discountAmount: 0 }),

    // ─── Items ────────────────────────────────────────────────
    addItem: (dish, restaurantId, restaurantName) => {
        const state = get();

        const cleanPrice = (p) => {
            if (p && typeof p === 'object' && p.$numberDecimal) return parseFloat(p.$numberDecimal);
            return parseFloat(p) || 0;
        };

        const price = cleanPrice(dish.price);

        // Si cambia de restaurante, limpia el carrito
        if (state.restaurantId && state.restaurantId !== restaurantId) {
            const next = {
                items: [{ dishId: dish._id, name: dish.name, unitPrice: price, image: dish.image, quantity: 1, specialInstructions: "" }],
                restaurantId,
                restaurantName,
                orderType: state.orderType,
                deliveryAddress: state.deliveryAddress,
                deliveryPhone: state.deliveryPhone,
            };
            saveCart(next);
            set(next);
            return;
        }

        const existing = state.items.find((i) => i.dishId === dish._id);
        const newItems = existing
            ? state.items.map((i) => i.dishId === dish._id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...state.items, { dishId: dish._id, name: dish.name, unitPrice: price, image: dish.image, quantity: 1, specialInstructions: "" }];

        const next = { ...state, items: newItems, restaurantId, restaurantName };
        saveCart(next);
        set(next);
    },

    removeItem: (dishId) => {
        const state = get();
        const newItems = state.items
            .map((i) => i.dishId === dishId ? { ...i, quantity: i.quantity - 1 } : i)
            .filter((i) => i.quantity > 0);

        const next = {
            ...state,
            items: newItems,
            restaurantId:   newItems.length === 0 ? null : state.restaurantId,
            restaurantName: newItems.length === 0 ? "" : state.restaurantName,
        };
        saveCart(next);
        set(next);
    },

    deleteItem: (dishId) => {
        const state = get();
        const newItems = state.items.filter((i) => i.dishId !== dishId);
        const next = {
            ...state,
            items: newItems,
            restaurantId:   newItems.length === 0 ? null : state.restaurantId,
            restaurantName: newItems.length === 0 ? "" : state.restaurantName,
        };
        saveCart(next);
        set(next);
    },

    updateInstructions: (dishId, specialInstructions) => {
        const state = get();
        const newItems = state.items.map((i) => i.dishId === dishId ? { ...i, specialInstructions } : i);
        const next = { ...state, items: newItems };
        saveCart(next);
        set(next);
    },

    clearCart: () => {
        const next = {
            items: [],
            restaurantId: null,
            restaurantName: "",
            orderType: "PARA_LLEVAR",
            deliveryAddress: "",
            deliveryPhone: "",
        };
        saveCart(next);
        set({ ...next, appliedCoupon: null, appliedCouponCode: null, discountAmount: 0 });
    },

    // ─── Getters ──────────────────────────────────────────────
    getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    getTotalPrice: () => get().items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0),
    getFinalTotal: () => {
        const subtotal = get().items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
        return Math.max(0, subtotal - get().discountAmount);
    },

    // Construye el payload listo para enviar al backend
    buildCheckoutPayload: (invoiceData) => {
        const { items, restaurantId, restaurantName, orderType, deliveryAddress, deliveryPhone, appliedCouponCode, getFinalTotal } = get();

        return {
            orderData: {
                restaurant: restaurantId,
                orderType,
                details: items.map((i) => ({
                    dish:      i.dishId,
                    dishName:  i.name,
                    quantity:  i.quantity,
                    unitPrice: i.unitPrice,
                })),
                // Solo se incluye si es DOMICILIO
                ...(orderType === 'DOMICILIO' && {
                    deliveryAddress: { street: deliveryAddress },
                    deliveryPhone,
                }),
                notes: invoiceData.notes || "",
            },
            customerInfo: {
                name:  invoiceData.name,
                email: invoiceData.email,
                nit:   invoiceData.nit,
            },
            restaurantInfo: {
                name:    restaurantName,
                address: "Ciudad de Guatemala",
            },
            paymentMethod: invoiceData.paymentMethod,
            amountPaid:    getFinalTotal(),
            ...(appliedCouponCode && { couponCode: appliedCouponCode }),
        };
    },
}));