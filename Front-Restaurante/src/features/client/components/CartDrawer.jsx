import { useCartStore } from "../store/useCartStore.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CouponSection from "./CouponSection";
import { useAuthStore } from "../../auth/store/useAuthStore.js";
import { InvoiceModal } from "./InvoiceModal";

export const CartDrawer = () => {
    const { user } = useAuthStore();
    const userId = user?._id || user?.id;

    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

    const {
        isCartOpen, closeCart,
        items, restaurantName, restaurantId,
        removeItem, deleteItem, addItem,
        getTotalItems, getTotalPrice,
        clearCart,
        discountAmount, getFinalTotal,
        // ← orderType ahora viene del store global
        orderType, setOrderType,
    } = useCartStore();

    const navigate  = useNavigate();
    const subtotal   = getTotalPrice();
    const totalFinal = getFinalTotal();
    const totalQty   = getTotalItems();

    const handleConfirmOrder = (invoiceResult) => {
        // El InvoiceModal ya hizo la petición al backend, aquí solo cerramos
        setIsInvoiceModalOpen(false);
        closeCart();
        clearCart();
        navigate("/client/pedidos");
    };

    // Opciones de tipo de orden — EN_MESA fue eliminado porque las
    // reservaciones tienen su propio módulo en la aplicación.
    const ORDER_TYPES = [
        { value: "PARA_LLEVAR", label: "Llevar", icon: "🥡" },
        { value: "DOMICILIO",   label: "Envío",  icon: "🛵" },
    ];

    return (
        <>
            {/* Overlay */}
            <div
                onClick={closeCart}
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500
                    ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />

            {/* Drawer */}
            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-[-20px_0_50px_rgba(0,0,0,0.2)]
                    flex flex-col transition-transform duration-500
                    ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="px-8 py-7 border-b border-gray-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-[900] text-black tracking-tighter uppercase">Carrito</h2>
                        {restaurantName && (
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{restaurantName}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all active:scale-90"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-[30px] flex items-center justify-center text-4xl mb-6">🛒</div>
                            <p className="text-xl font-black text-black tracking-tighter uppercase mb-2">Carrito Vacío</p>
                            <p className="text-gray-400 text-xs font-medium max-w-[200px] leading-relaxed mb-8">
                                Parece que aún no has elegido tu próximo festín.
                            </p>
                            <button
                                onClick={() => { closeCart(); navigate("/client"); }}
                                className="px-8 py-3 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-black transition-colors"
                            >
                                Explorar Menú
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <CartItem
                                    key={item.dishId}
                                    item={item}
                                    onAdd={() => addItem(
                                        { _id: item.dishId, name: item.name, price: item.unitPrice, image: item.image },
                                        useCartStore.getState().restaurantId,
                                        useCartStore.getState().restaurantName
                                    )}
                                    onRemove={() => removeItem(item.dishId)}
                                    onDelete={() => deleteItem(item.dishId)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-8 bg-gray-50/50 border-t border-gray-100 space-y-6">

                        {/* Selector tipo de orden */}
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                                ¿Cómo recibes tu orden?
                            </p>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
                                {ORDER_TYPES.map(({ value, label, icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => setOrderType(value)}
                                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                            ${orderType === value
                                                ? "bg-white text-black shadow-sm"
                                                : "text-gray-400 hover:text-gray-600"}`}
                                    >
                                        <span className="block text-base mb-0.5">{icon}</span>
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Aviso contextual según tipo */}
                            {orderType === "DOMICILIO" && (
                                <p className="text-[9px] font-bold text-orange-500 uppercase tracking-wider mt-2 ml-1">
                                    📍 Se pedirá tu dirección al confirmar
                                </p>
                            )}
                            {orderType === "PARA_LLEVAR" && (
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-2 ml-1">
                                    🥡 Pasarás a recoger tu pedido en el restaurante
                                </p>
                            )}
                        </div>

                        {/* Cupón */}
                        <CouponSection
                            userId={userId}
                            restaurantId={restaurantId}
                        />

                        {/* Totales */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end px-2">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                                        Total a pagar
                                    </p>
                                    {discountAmount > 0 && (
                                        <p className="text-[10px] text-red-400 line-through">
                                            Q{subtotal.toFixed(2)}
                                        </p>
                                    )}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-orange-500 font-black text-sm">Q</span>
                                        <span className="text-4xl font-[900] text-black tracking-tighter leading-none">
                                            {totalFinal.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    {totalQty} Items
                                </p>
                            </div>

                            <button
                                onClick={() => setIsInvoiceModalOpen(true)}
                                className="w-full py-5 bg-black text-white font-[900] text-[11px] uppercase tracking-[0.3em] rounded-[24px] hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/10"
                            >
                                Confirmar Orden →
                            </button>

                            <button
                                onClick={clearCart}
                                className="w-full text-[9px] font-black text-gray-300 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                            >
                                Vaciar Carrito
                            </button>
                        </div>
                    </div>
                )}
            </aside>

            <InvoiceModal
                isOpen={isInvoiceModalOpen}
                onClose={() => setIsInvoiceModalOpen(false)}
                onConfirm={handleConfirmOrder}
            />
        </>
    );
};

/* ─── CartItem (sin cambios) ─────────────────────────────────────── */
function CartItem({ item, onAdd, onRemove, onDelete }) {
    const price    = Number(item.unitPrice || 0);
    const qty      = Number(item.quantity || 0);
    const subtotal = qty * price;

    return (
        <div className="group flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-16 h-16 rounded-2xl shrink-0 border border-gray-100 overflow-hidden">
                {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <span className="text-xs font-black text-gray-200 uppercase">Sin Img</span>
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-[900] text-black uppercase tracking-tight truncate">{item.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5 tracking-wider">
                    Q{price.toFixed(2)} c/u
                </p>
                <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center bg-gray-100 rounded-full p-1">
                        <button onClick={onRemove} className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-xs font-black hover:text-orange-500 transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
                        </button>
                        <span className="w-8 text-center text-[11px] font-[900] text-black leading-none">{item.quantity}</span>
                        <button onClick={onAdd} className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-xs font-black hover:text-orange-500 transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                    </div>
                    <button onClick={onDelete} className="text-[9px] font-black text-gray-300 hover:text-red-500 uppercase tracking-widest transition-colors">
                        Eliminar
                    </button>
                </div>
            </div>

            <div className="text-right">
                <p className="text-sm font-[900] text-black tracking-tight leading-none">Q{subtotal.toFixed(2)}</p>
            </div>
        </div>
    );
}