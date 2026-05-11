import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DishCard } from "../components/DishCard";
import { useCartStore } from "../store/UseCartStore";
import { useReviewStore } from "../../admin-restaurante/store/UseReviewStore";
import { useAuthStore } from "../../auth/store/authStore";
import { getRestaurantByIdRequest } from "../../../shared/api/restaurants.js";
import { getDishesRequest } from "../../../shared/api/platillos.js";

/* ── CONFIGURACIÓN ── */
const DISH_TYPES = [
    { value: "TODOS",        label: "Todos" },
    { value: "ENTRADA",      label: "Entradas" },
    { value: "PLATO_FUERTE", label: "Fuertes" },
    { value: "POSTRE",       label: "Postres" },
    { value: "BEBIDA",       label: "Bebidas" },
    { value: "GUARNICION",   label: "Extras" },
];

/* ── COMPONENTES AUXILIARES ── */

const InfoCard = ({ icon, label, value }) => (
    <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[24px] border border-gray-100 shadow-xl shadow-black/5 flex flex-col items-center text-center transition-transform hover:-translate-y-1">
        <div className="mb-3 p-2 bg-gray-50 rounded-xl">{icon}</div>
        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-1">{label}</p>
        <p className="text-sm font-[900] text-gray-900 tracking-tight">{value}</p>
    </div>
);

const StarRating = ({ value, onChange, size = 24 }) => (
    <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                onClick={() => onChange && onChange(star)}
                className={`focus:outline-none transition-all ${onChange ? 'hover:scale-125 active:scale-90' : 'cursor-default'}`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill={star <= value ? "#ff6600" : "none"}
                    stroke={star <= value ? "#ff6600" : "#E5E7EB"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </button>
        ))}
    </div>
);

const ReviewCard = ({ review, currentUserId, onEdit, onDelete }) => {
    const isOwner = currentUserId && (review.userId === currentUserId || review.userId?._id === currentUserId);

    return (
        <div className="group bg-white border border-gray-100 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500/10 group-hover:bg-orange-500 transition-colors" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-black text-white text-2xl uppercase shadow-lg shadow-orange-200/50 transform group-hover:rotate-3 transition-transform">
                        {(review.userInfo?.name || "U").charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-black text-base text-gray-900 tracking-tight">
                            {review.userInfo?.name || "Usuario"}
                        </h4>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString("es-GT", {
                                day: "2-digit", month: "short", year: "numeric"
                            }) : ""}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <StarRating value={review.rating} size={14} />
                </div>
            </div>

            <div className="relative">
                <svg className="absolute -top-2 -left-2 w-8 h-8 text-orange-500/10" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V5C14.017 4.44772 14.4647 4 15.017 4H20.017C21.1216 4 22.017 4.89543 22.017 6V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM2.01695 21L2.01695 18C2.01695 16.8954 2.91238 16 4.01695 16H7.01695C7.56923 16 8.01695 15.5523 8.01695 15V9C8.01695 8.44772 7.56923 8 7.01695 8H3.01695C2.46467 8 2.01695 7.55228 2.01695 7V5C2.01695 4.44772 2.46467 4 3.01695 4H8.01695C9.12152 4 10.017 4.89543 10.017 6V15C10.017 18.3137 7.33066 21 4.01695 21H2.01695Z" /></svg>
                <p className="text-gray-600 leading-relaxed text-[15px] font-medium relative z-10 pl-6">
                    {review.comment || "Sin comentario"}
                </p>
            </div>

            {isOwner && (
                <div className="mt-6 pt-4 border-t border-gray-50 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(review)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-tighter hover:bg-blue-100 transition-colors">
                        Editar
                    </button>
                    <button onClick={() => onDelete(review._id)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-tighter hover:bg-red-100 transition-colors">
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};

/* ── COMPONENTE PRINCIPAL ── */
export const RestaurantDetailPage = () => {
    const { id }     = useParams();
    const navigate   = useNavigate();

    const openCart   = useCartStore((s) => s.openCart);
    const totalItems = useCartStore((s) => s.getTotalItems());
    const cartRestId = useCartStore((s) => s.restaurantId);
    const user       = useAuthStore((s) => s.user);

    const {
        reviews, loading: loadingReviews, submitting,
        fetchReviews, createReview, updateReview, deleteReview,
    } = useReviewStore();

    const [restaurant, setRestaurant] = useState(null);
    const [dishes,     setDishes]     = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [error,      setError]      = useState(null);
    const [activeType, setActiveType] = useState("TODOS");
    const [searchDish, setSearchDish] = useState("");

    const [activeTab,      setActiveTab]      = useState("menu");
    const [reviewRating,   setReviewRating]   = useState(0);
    const [reviewComment,  setReviewComment]  = useState("");
    const [editingReview,  setEditingReview]  = useState(null);
    const [reviewMsg,      setReviewMsg]      = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [restRes, dishRes] = await Promise.all([
                    getRestaurantByIdRequest(id),
                    getDishesRequest()
                ]);

                // Backend devuelve: { success: true, data: restaurant }
                const restData  = restRes.data?.data ?? restRes.data?.restaurant ?? restRes.data;
                // Backend devuelve: { success: true, data: [...dishes] }
                const allDishes = dishRes.data?.data ?? dishRes.data?.dishes ?? [];

                setRestaurant(restData);
                const restaurantDishes = allDishes.filter(
                    (d) => d.restaurant === id || d.restaurant?._id === id
                );
                setDishes(restaurantDishes);
            } catch (err) {
                setError(err.response?.data?.message || "Error al cargar el restaurante");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    useEffect(() => {
        if (id) fetchReviews(id);
    }, [id, fetchReviews]);

    const filteredDishes = dishes.filter((d) => {
        const matchType   = activeType === "TODOS" || d.type === activeType;
        const matchSearch = d.name.toLowerCase().includes(searchDish.toLowerCase());
        return matchType && matchSearch;
    });

    const grouped = DISH_TYPES.filter((t) => t.value !== "TODOS").reduce((acc, { value, label }) => {
        const items = filteredDishes.filter((d) => d.type === value);
        if (items.length > 0) acc.push({ type: value, label, items });
        return acc;
    }, []);

    const resetReviewForm = () => {
        setReviewRating(0);
        setReviewComment("");
        setEditingReview(null);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (reviewRating === 0) {
            setReviewMsg({ type: "error", text: "Selecciona una calificación." });
            return;
        }
        let result;
        if (editingReview) {
            result = await updateReview(editingReview._id, { rating: reviewRating, comment: reviewComment });
        } else {
            result = await createReview(id, { rating: reviewRating, comment: reviewComment });
        }

        if (result.success) {
            setReviewMsg({ type: "success", text: editingReview ? "Reseña actualizada." : "¡Reseña publicada!" });
            resetReviewForm();
        } else {
            setReviewMsg({ type: "error", text: result.message });
        }
        setTimeout(() => setReviewMsg(null), 3500);
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setReviewRating(review.rating);
        setReviewComment(review.comment || "");
        document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("¿Eliminar esta reseña?")) return;
        const result = await deleteReview(reviewId);
        if (!result.success) {
            setReviewMsg({ type: "error", text: result.message });
            setTimeout(() => setReviewMsg(null), 3500);
        }
    };

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    if (loading) return (
        <div className="flex flex-col items-center py-40 gap-4">
            <div className="w-12 h-12 rounded-full border-[4px] border-gray-100 border-t-orange-500 animate-spin" />
            <p className="font-black text-gray-400 uppercase tracking-tighter text-xs">Preparando el menú...</p>
        </div>
    );

    if (error || !restaurant) return (
        <div className="text-center py-32 px-10">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">🏜️</div>
            <p className="text-gray-900 font-black text-xl">Restaurante no disponible</p>
            <button onClick={() => navigate("/client")} className="mt-6 px-8 py-3 bg-black text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-transform active:scale-95">
                Volver a explorar
            </button>
        </div>
    );

    const isCartFromHere = cartRestId === id;

    return (
        <div className="min-h-screen bg-white">
            {/* HERO CINEMÁTICO */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <img
                    src={restaurant.photo || "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg"}
                    alt={restaurant.name}
                    className="w-full h-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-black/20 to-black/40" />

                <div className="absolute top-8 left-8">
                    <button
                        onClick={() => navigate("/client")}
                        className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                </div>

                <div className="absolute bottom-10 left-8 right-8">
                    <div className="max-w-[1200px] mx-auto">
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block shadow-lg">
                            Abierto ahora
                        </span>
                        <h1 className="text-5xl md:text-7xl font-[900] text-white tracking-tighter drop-shadow-2xl">
                            {restaurant.name}.
                        </h1>
                        <div className="flex items-center gap-4 mt-2 text-white/90">
                            <p className="font-bold text-sm flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="11" r="3"/><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/></svg>
                                {restaurant.address}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-8">
                {/* INFO CARDS SUPERIORES */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-8 relative z-20">
                    <InfoCard
                        icon={<svg className="text-orange-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>}
                        label="Rating"
                        value={avgRating ?? (restaurant.averageRating ? restaurant.averageRating.toFixed(1) : "Nuevo")}
                    />
                    <InfoCard
                        icon={<svg className="text-green-600" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>}
                        label="Promedio"
                        value={restaurant.averagePrice != null ? `Q${Number(restaurant.averagePrice).toFixed(2)}` : 'N/D'}
                    />
                    <InfoCard
                        icon={<svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                        label="Horario"
                        value={restaurant.openingHours && restaurant.closingHours ? `${restaurant.openingHours} - ${restaurant.closingHours}` : 'N/D'}
                    />
                    <InfoCard
                        icon={<svg className="text-purple-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>}
                        label="Contacto"
                        value={restaurant.phone}
                    />
                </div>

                {/* PESTAÑAS: MENÚ / RESEÑAS */}
                <div className="mt-12 flex gap-2 border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab("menu")}
                        className={`px-6 py-3 text-xs font-black uppercase tracking-widest rounded-t-2xl transition-all ${activeTab === "menu" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-gray-900"}`}
                    >
                        🍽️ Menú
                    </button>
                    <button
                        onClick={() => setActiveTab("reviews")}
                        className={`px-6 py-3 text-xs font-black uppercase tracking-widest rounded-t-2xl transition-all ${activeTab === "reviews" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-gray-900"}`}
                    >
                        ⭐ Reseñas {reviews.length > 0 && `(${reviews.length})`}
                    </button>
                </div>

                {/* TAB: MENÚ */}
                {activeTab === "menu" ? (
                    <div className="mt-10 flex flex-col md:flex-row gap-12 items-start">
                        {/* Barra lateral de filtros */}
                        <div className="w-full md:w-64 space-y-8 sticky top-8">
                            <div>
                                <h3 className="text-2xl font-[900] tracking-tighter mb-4">Menú.</h3>
                                <div className="relative">
                                    <input
                                        value={searchDish}
                                        onChange={(e) => setSearchDish(e.target.value)}
                                        placeholder="Buscar plato..."
                                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                {DISH_TYPES.map(({ value, label }) => (
                                    <button
                                        key={value}
                                        onClick={() => setActiveType(value)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all
                                            ${activeType === value ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-900"}`}
                                    >
                                        {label}
                                        {activeType === value && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contenido del Menú */}
                        <div className="flex-1 pb-32">
                            {grouped.length > 0 ? (
                                grouped.map(({ label, items }) => (
                                    <div key={label} className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="flex items-center gap-4 mb-8">
                                            <h2 className="text-xs font-black text-black uppercase tracking-[0.3em] whitespace-nowrap">{label}</h2>
                                            <div className="h-[1px] w-full bg-gray-100" />
                                        </div>
                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                            {items.map((dish) => (
                                                <DishCard
                                                    key={dish._id}
                                                    dish={dish}
                                                    restaurantId={id}
                                                    restaurantName={restaurant.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center min-h-[450px] text-center border-2 border-dashed border-gray-100 rounded-[40px] px-10">
                                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl">
                                        🍽️
                                    </div>
                                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest max-w-[200px] leading-relaxed">
                                        Por el momento no hay platillos disponibles en esta categoría
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                ) : (
                    /* TAB: RESEÑAS */
                    <div className="mt-10 pb-32 w-full animate-in fade-in duration-500">
                        {/* RESUMEN DE RESEÑAS */}
                        {reviews.length > 0 && (
                            <div className="flex flex-col md:flex-row items-center gap-12 bg-black text-white rounded-[40px] p-12 mb-16 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full" />
                                <div className="text-center md:border-r md:border-white/10 md:pr-16 z-10">
                                    <p className="text-xs font-black uppercase tracking-[0.4em] text-orange-500 mb-4">Rating Global</p>
                                    <p className="text-8xl font-[900] tracking-tighter leading-none">{avgRating}</p>
                                    <div className="flex justify-center mt-6">
                                        <StarRating value={Math.round(parseFloat(avgRating))} size={20} />
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-4">{reviews.length} experiencias compartidas</p>
                                </div>
                                <div className="flex-1 w-full space-y-4 z-10">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = reviews.filter((r) => r.rating === star).length;
                                        const pct   = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-6">
                                                <span className="text-[10px] font-black text-gray-500 w-4">{star}</span>
                                                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-1000 rounded-full" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500 w-8 text-right">{pct}%</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* FORMULARIO (izquierda) | COMENTARIOS (derecha) */}
                        <div className="flex flex-col lg:flex-row gap-12 items-start">

                            {/* COLUMNA IZQUIERDA: FORMULARIO */}
                            <div className="w-full lg:w-[400px] lg:sticky lg:top-10">
                                {user ? (
                                    <div id="review-form" className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-[0_10px_50px_rgb(0,0,0,0.03)]">
                                        <h3 className="font-[900] text-2xl tracking-tight mb-2">
                                            {editingReview ? "Editar opinión" : "Tu experiencia."}
                                        </h3>
                                        <p className="text-gray-400 text-xs mb-8 font-medium">Comparte tu opinión con la comunidad.</p>

                                        {reviewMsg && (
                                            <div className={`mb-6 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest ${reviewMsg.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                                                {reviewMsg.text}
                                            </div>
                                        )}

                                        <div className="space-y-6">
                                            <div className="bg-gray-50/50 p-5 rounded-2xl">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Calificación</p>
                                                <StarRating value={reviewRating} onChange={setReviewRating} size={28} />
                                            </div>

                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3">Comentario</p>
                                                <textarea
                                                    value={reviewComment}
                                                    onChange={(e) => setReviewComment(e.target.value)}
                                                    placeholder="¿Qué tal estuvo la comida?"
                                                    rows={4}
                                                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-[20px] text-sm font-semibold focus:ring-2 focus:ring-orange-500 outline-none resize-none transition-all"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                <button
                                                    onClick={handleSubmitReview}
                                                    disabled={submitting}
                                                    className="w-full py-4 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[18px] hover:bg-orange-600 transition-all disabled:opacity-50 shadow-xl shadow-black/10"
                                                >
                                                    {submitting ? "Enviando..." : editingReview ? "Guardar cambios" : "Publicar ahora"}
                                                </button>
                                                {editingReview && (
                                                    <button onClick={resetReviewForm} className="w-full py-3 bg-gray-100 text-gray-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-[18px]">
                                                        Cancelar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-[32px] p-10 text-center border-2 border-dashed border-gray-200">
                                        <p className="text-gray-900 font-black text-base mb-2">¿Te gustó el lugar?</p>
                                        <p className="text-gray-400 text-xs mb-6 font-medium">Inicia sesión para reseñar.</p>
                                        <button onClick={() => navigate("/auth")} className="px-8 py-3 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-transform">
                                            Identificarse
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* COLUMNA DERECHA: LISTA DE COMENTARIOS */}
                            <div className="flex-1 w-full">
                                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-4">
                                    Comentarios Recientes
                                    <div className="h-[1px] flex-1 bg-gray-100" />
                                </h3>

                                {loadingReviews ? (
                                    <div className="flex justify-center py-20">
                                        <div className="w-10 h-10 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin" />
                                    </div>
                                ) : reviews.length === 0 ? (
                                    <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-gray-100">
                                        <p className="text-gray-300 font-[900] uppercase text-[10px] tracking-[0.4em]">Sin testimonios aún</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {reviews.map((r) => (
                                            <ReviewCard
                                                key={r._id}
                                                review={r}
                                                currentUserId={user?.id}
                                                onEdit={handleEditReview}
                                                onDelete={handleDeleteReview}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* BOTÓN FLOTANTE CARRITO PREMIUM */}
            {isCartFromHere && totalItems > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                    <button
                        onClick={openCart}
                        className="group flex items-center gap-4 pl-8 pr-3 py-3 bg-black text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
                    >
                        <span className="font-black uppercase text-[10px] tracking-[0.2em]">Ver mi orden</span>
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-black text-sm group-hover:rotate-12 transition-transform">
                            {totalItems}
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};