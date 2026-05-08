import { useCartStore } from "../store/UseCartStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const CartDrawer = () => {
    const {
        isCartOpen, closeCart,
        items, restaurantName,
        removeItem, deleteItem, addItem,
        getTotalItems, getTotalPrice,
        clearCart,
    } = useCartStore();

    const navigate  = useNavigate();
    const total     = getTotalPrice();
    const totalQty  = getTotalItems();

    const [orderType, setOrderType] = useState("EN_MESA");
    const [coupon, setCoupon]       = useState("");

    const handleCheckout = () => {
        closeCart();
        navigate("/client/checkout", { state: { orderType, coupon } });
    };

    return (
        <>
            {/* Overlay */}
            <div
                onClick={closeCart}
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300
                    ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />

            {/* Drawer */}
            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl
                    flex flex-col transition-transform duration-300 ease-in-out
                    ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div>
                        <h2 className="font-semibold text-gray-900 text-base">Mi Carrito</h2>
                        {restaurantName && (
                            <p className="text-xs text-gray-400 mt-0.5">🍽 {restaurantName}</p>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600
                            hover:bg-gray-100 transition-colors text-lg leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Contenido */}
                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-6">
                        <span className="text-5xl">🛒</span>
                        <p className="text-gray-500 text-sm font-medium">Tu carrito está vacío</p>
                        <p className="text-gray-400 text-xs">
                            Explora restaurantes y agrega platillos para comenzar
                        </p>
                        <button
                            onClick={() => { closeCart(); navigate("/client"); }}
                            className="mt-2 px-5 py-2 bg-orange-500 hover:bg-orange-600
                                text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            Explorar restaurantes
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Lista de items  */}
                        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                            {items.map((item) => (
                                <CartItem
                                    key={item.dishId}
                                    item={item}
                                    onAdd={() =>
                                        addItem(
                                            { _id: item.dishId, name: item.name, price: item.unitPrice },
                                            useCartStore.getState().restaurantId,
                                            useCartStore.getState().restaurantName
                                        )
                                    }
                                    onRemove={() => removeItem(item.dishId)}
                                    onDelete={() => deleteItem(item.dishId)}
                                />
                            ))}
                        </div>

                        {/* Footer con resumen + acciones */}
                        <div className="border-t border-gray-100 px-5 py-4 space-y-3">

                            {/* Tipo de orden */}
                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1.5">Tipo de pedido</p>
                                <div className="flex gap-2">
                                    {[
                                        { value: "EN_MESA",    label: "🪑 En mesa" },
                                        { value: "PARA_LLEVAR",label: "🥡 Para llevar" },
                                        { value: "DOMICILIO",  label: "🛵 Domicilio" },
                                    ].map(({ value, label }) => (
                                        <button
                                            key={value}
                                            onClick={() => setOrderType(value)}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors
                                                ${orderType === value
                                                    ? "bg-orange-500 text-white border-orange-500"
                                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300"}`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cupón */}
                            <div className="flex gap-2">
                                <input
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                    placeholder="Código de cupón"
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs
                                        outline-none focus:border-orange-400 transition-colors uppercase"
                                />
                                {coupon && (
                                    <button
                                        onClick={() => setCoupon("")}
                                        className="px-3 py-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between py-2 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400">{totalQty} {totalQty === 1 ? "platillo" : "platillos"}</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        Q{total.toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600
                                        text-white font-semibold text-sm rounded-xl transition-colors"
                                >
                                    Confirmar pedido
                                </button>
                            </div>

                            {/* Vaciar carrito */}
                            <button
                                onClick={clearCart}
                                className="w-full text-xs text-gray-400 hover:text-red-500
                                    transition-colors text-center py-1"
                            >
                                Vaciar carrito
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </>
    );
};

/* ── Item individual dentro del drawer ── */
function CartItem({ item, onAdd, onRemove, onDelete }) {
    const subtotal = item.quantity * item.unitPrice;

    return (
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                    Q(item.unitPrice).toFixed(2)
                </p>
            </div>

            {/* Controles cantidad */}
            <div className="flex items-center gap-1.5 shrink-0">
                <button
                    onClick={onRemove}
                    className="w-6 h-6 rounded-full border border-gray-300 text-gray-600
                        hover:border-orange-400 hover:text-orange-500 transition-colors
                        text-sm font-bold flex items-center justify-center leading-none"
                >
                    −
                </button>
                <span className="w-5 text-center text-sm font-semibold text-gray-900">
                    {item.quantity}
                </span>
                <button
                    onClick={onAdd}
                    className="w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600
                        text-white transition-colors text-sm font-bold
                        flex items-center justify-center leading-none"
                >
                    +
                </button>
            </div>

            {/* Subtotal + eliminar */}
            <div className="text-right shrink-0 min-w-[52px]">
                <p className="text-sm font-semibold text-gray-900">Q{subtotal.toFixed(2)}</p>
                <button
                    onClick={onDelete}
                    className="text-[10px] text-gray-300 hover:text-red-400 transition-colors mt-0.5"
                >
                    Quitar
                </button>
            </div>
        </div>
    );
}