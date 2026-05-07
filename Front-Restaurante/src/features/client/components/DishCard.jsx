import { useCartStore } from "../store/UseCartStore";

const CATEGORY_LABELS = {
    VEGETARIANO: "🥗 Vegetariano",
    VEGANO:      "🌱 Vegano",
    SIN_GLUTEN:  "🌾 Sin gluten",
    KETO:        "🥑 Keto",
    LIGHT:       "💚 Light",
    PICANTE:     "🌶 Picante",
    INFANTIL:    "👶 Infantil",
    PREMIUM:     "⭐ Premium",
};

const TYPE_LABELS = {
    ENTRADA:      "Entrada",
    PLATO_FUERTE: "Plato fuerte",
    POSTRE:       "Postre",
    BEBIDA:       "Bebida",
    GUARNICION:   "Guarnición",
};

export const DishCard = ({ dish, restaurantId, restaurantName }) => {
    const { items, addItem, removeItem } = useCartStore();

    const cartItem = items.find((i) => i.dishId === dish._id);
    const quantity = cartItem?.quantity ?? 0;

    const handleAdd = () => addItem(dish, restaurantId, restaurantName);
    const handleRemove = () => removeItem(dish._id);

    const isAvailable = dish.isAvailable !== false;

    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
            transition-all ${!isAvailable ? "opacity-50" : "hover:shadow-md"}`}>

            {/* Imagen */}
            <div className="relative h-36 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                {dish.image ? (
                    <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🍽</div>
                )}

                {/* Badge */}
                {dish.type && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm
                        rounded-full text-[10px] font-semibold text-gray-600 shadow-sm">
                        {TYPE_LABELS[dish.type] ?? dish.type}
                    </span>
                )}

                {/* Badge no disponible */}
                {!isAvailable && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700">
                            No disponible
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3">
                <h4 className="font-semibold text-sm text-gray-900 truncate">{dish.name}</h4>

                {dish.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {dish.description}
                    </p>
                )}

                {/* Categoría */}
                {dish.category && CATEGORY_LABELS[dish.category] && (
                    <span className="inline-block mt-1.5 text-[10px] bg-orange-50 text-orange-600
                        px-2 py-0.5 rounded-full font-medium">
                        {CATEGORY_LABELS[dish.category]}
                    </span>
                )}

                {/* Precio + controles */}
                <div className="flex items-center justify-between mt-3">
                    <span className="text-base font-bold text-gray-900">
                        Q{Number(dish.price).toFixed(2)}
                    </span>

                    {isAvailable && (
                        quantity === 0 ? (
                            <button
                                onClick={handleAdd}
                                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600
                                    text-white text-xs font-semibold rounded-lg transition-colors"
                            >
                                + Agregar
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleRemove}
                                    className="w-7 h-7 rounded-full border border-gray-300 text-gray-600
                                        hover:border-orange-400 hover:text-orange-500 transition-colors
                                        font-bold flex items-center justify-center text-base leading-none"
                                >
                                    −
                                </button>
                                <span className="text-sm font-bold text-gray-900 w-4 text-center">
                                    {quantity}
                                </span>
                                <button
                                    onClick={handleAdd}
                                    className="w-7 h-7 rounded-full bg-orange-500 hover:bg-orange-600
                                        text-white font-bold flex items-center justify-center
                                        text-base leading-none transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};