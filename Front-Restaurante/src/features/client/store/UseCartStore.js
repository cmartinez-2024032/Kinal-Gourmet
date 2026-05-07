import { create } from "zustand";

const CART_KEY = "restaurant_cart";

const loadCart = () => {
    try {
        const raw = localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : { items: [], restaurantId: null, restaurantName: "" };
    } catch {
        return { items: [], restaurantId: null, restaurantName: "" };
    }
};

const saveCart = (state) => {
    localStorage.setItem(CART_KEY, JSON.stringify({
        items: state.items,
        restaurantId: state.restaurantId,
        restaurantName: state.restaurantName,
    }));
};

export const useCartStore = create((set, get) => ({
    ...loadCart(),
    isCartOpen: false,

    // Abrir / cerrar drawer
    openCart:  () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),
    toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

    // Agregar platillo al carrito
    // Si es de un restaurante diferente, limpia el carrito primero
    addItem: (dish, restaurantId, restaurantName) => {
        const state = get();

        // Si cambia de restaurante, resetear
        if (state.restaurantId && state.restaurantId !== restaurantId) {
            const reset = {
                items: [],
                restaurantId,
                restaurantName,
            };
            const existing = reset.items.find((i) => i.dishId === dish._id);
            const newItems = existing
                ? reset.items.map((i) =>
                    i.dishId === dish._id ? { ...i, quantity: i.quantity + 1 } : i
                )
                : [...reset.items, { dishId: dish._id, name: dish.name, unitPrice: dish.price, quantity: 1, specialInstructions: "" }];

            const next = { ...reset, items: newItems };
            saveCart(next);
            set(next);
            return;
        }

        const items = state.items;
        const existing = items.find((i) => i.dishId === dish._id);
        const newItems = existing
            ? items.map((i) =>
                i.dishId === dish._id ? { ...i, quantity: i.quantity + 1 } : i
            )
            : [...items, { dishId: dish._id, name: dish.name, unitPrice: dish.price, quantity: 1, specialInstructions: "" }];

        const next = { items: newItems, restaurantId, restaurantName };
        saveCart(next);
        set(next);
    },

    // Quitar 1 unidad (si llega a 0 elimina el item)
    removeItem: (dishId) => {
        const state = get();
        const newItems = state.items
            .map((i) => i.dishId === dishId ? { ...i, quantity: i.quantity - 1 } : i)
            .filter((i) => i.quantity > 0);

        const next = {
            items: newItems,
            restaurantId: newItems.length === 0 ? null : state.restaurantId,
            restaurantName: newItems.length === 0 ? "" : state.restaurantName,
        };
        saveCart(next);
        set(next);
    },

    // Eliminar item completo
    deleteItem: (dishId) => {
        const state = get();
        const newItems = state.items.filter((i) => i.dishId !== dishId);
        const next = {
            items: newItems,
            restaurantId: newItems.length === 0 ? null : state.restaurantId,
            restaurantName: newItems.length === 0 ? "" : state.restaurantName,
        };
        saveCart(next);
        set(next);
    },

    // Actualizar instrucciones especiales de un item
    updateInstructions: (dishId, specialInstructions) => {
        const state = get();
        const newItems = state.items.map((i) =>
            i.dishId === dishId ? { ...i, specialInstructions } : i
        );
        const next = { ...state, items: newItems };
        saveCart(next);
        set(next);
    },

    // Limpiar carrito completo
    clearCart: () => {
        const next = { items: [], restaurantId: null, restaurantName: "" };
        saveCart(next);
        set(next);
    },

    // Getters computados
    getTotalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
    getTotalPrice: () => get().items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0),

    // Construir el payload para POST /orders/create
    buildOrderPayload: (extras = {}) => {
        const { items, restaurantId } = get();
        return {
            restaurant: restaurantId,
            details: items.map((i) => ({
                dish: i.dishId,
                quantity: i.quantity,
                unitPrice: i.unitPrice,
                specialInstructions: i.specialInstructions || undefined,
            })),
            ...extras,
        };
    },
}));