import { getRestaurantsRequest } from "../../../shared/api/restaurants.js";
import { getTablesRequest } from "../../../shared/api/mesas.js";
import { useEffect, useState } from "react";

const emptyForm = {
        restaurant: "",
        table:      "",
        date:       "",
        time:       "",
        numberOfGuests: 1,
        specialRequests: "",
    };
    
const formatTime = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const period = h < 12 ? "AM" : "PM";
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

export const ReservationCard = ({ reservation: r, getStatusLabel, getStatusStyle, getStatusIcon, onCancel }) => {
    const canCancel = r.status === "PENDIENTE";

    const date = new Date(r.date).toLocaleDateString("es-GT", {
        weekday: "long", day: "numeric", month: "long"
    });

    const statusConfig = {
        PENDIENTE:  { bg: "bg-amber-400",   text: "text-amber-950",  bar: "from-amber-400/90",  icon: "⏳" },
        CONFIRMADA: { bg: "bg-emerald-400", text: "text-emerald-950",bar: "from-emerald-400/90",icon: "✅" },
        CANCELADA:  { bg: "bg-rose-500",    text: "text-white",      bar: "from-rose-500/90",   icon: "✕" },
        COMPLETADA: { bg: "bg-sky-400",     text: "text-sky-950",    bar: "from-sky-400/90",    icon: "🎉" },
    };

    const sc = statusConfig[r.status] ?? { bg: "bg-gray-300", text: "text-gray-800", bar: "from-gray-400/90", icon: "📅" };

    return (
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden hover:translate-y-[-6px] hover:shadow-2xl transition-all duration-300 group">

            {/* Imagen con gradiente overlay */}
            <div className="relative h-44 bg-gray-100 overflow-hidden">
                {r.table?.image ? (
                    <img
                        src={r.table.image}
                        alt={`Mesa ${r.table.number}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-700 flex items-center justify-center">
                        <span className="text-6xl opacity-20">🍽️</span>
                    </div>
                )}

                {/* Gradiente inferior */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badge status */}
                <div className="absolute top-3 left-3">
                    <span className={`${sc.bg} ${sc.text} text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg`}>
                        {sc.icon} {getStatusLabel(r.status)}
                    </span>
                </div>

                {/* Badge mesa */}
                <div className="absolute top-3 right-3">
                    <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">
                        🪑 {r.table?.number ? `Mesa ${r.table.number}` : "Por asignar"}
                    </span>
                </div>

                {/* Nombre restaurante sobre imagen */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                    <h4 className="font-black text-lg text-white leading-tight drop-shadow-lg truncate">
                        {r.restaurant?.name ?? "Restaurante"}
                    </h4>
                    <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest drop-shadow">
                        🕐 {formatTime(r.time)} · {date}
                    </p>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-4">

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 flex items-center gap-2">
                        <span className="text-xl">👥</span>
                        <div>
                            <p className="text-[9px] font-black text-orange-400 uppercase tracking-wide">Comensales</p>
                            <p className="text-sm font-black text-gray-800">{r.numberOfGuests}</p>
                        </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 flex items-center gap-2">
                        <span className="text-xl">📍</span>
                        <div>
                            <p className="text-[9px] font-black text-orange-400 uppercase tracking-wide">Ubicación</p>
                            <p className="text-sm font-black text-gray-800 truncate">{r.table?.location ?? "—"}</p>
                        </div>
                    </div>
                </div>

                {/* Notas especiales */}
                {r.specialRequests && (
                    <div className="relative rounded-2xl px-4 py-3 mb-3 flex gap-3 items-center overflow-hidden bg-zinc-900">
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-amber-500/20 to-transparent" />
                        <div className="shrink-0 w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg shadow-amber-400/30">
                            <span className="text-base">📌</span>
                        </div>
                        <div className="relative">
                            <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-0.5">Nota especial</p>
                            <p className="text-xs text-white font-medium leading-relaxed">"{r.specialRequests}"</p>
                        </div>
                    </div>
                )}

                {/* Botón cancelar */}
                {canCancel && (
                    <button
                        onClick={onCancel}
                        className="w-full py-2.5 rounded-2xl bg-red-500 text-white border-2 border-red-600
                                text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/30
                                hover:bg-red-600 hover:shadow-red-600/40
                                transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span>✕</span> Cancelar Reserva
                    </button>
                )}
            </div>
        </div>
    );
};

/* ── Selector de mesas ── */
export const  TableSelector = ({ tables, selected, onSelect }) => {
    if (!tables.length) return (
        <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-2xl">
            No hay mesas disponibles para este restaurante
        </div>
    );

    return (
        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
            {tables.map((t) => (
                <button
                    key={t._id}
                    type="button"
                    onClick={() => onSelect(t)}
                    className={`rounded-2xl border-2 overflow-hidden text-left transition-all hover:scale-[1.02]
                        ${selected === t._id
                            ? "border-orange-500 shadow-lg shadow-orange-500/20"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                >
                    <div className="w-full h-24 bg-gray-100 overflow-hidden">
                        {t.image ? (
                            <img
                                src={t.image}
                                alt={`Mesa ${t.number}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl bg-orange-50">
                                🪑
                            </div>
                        )}
                    </div>
                    <div className="p-2">
                        <p className="font-black text-sm text-gray-900">
                            Mesa {t.number}
                            {selected === t._id && (
                                <span className="ml-1 text-orange-500">✓</span>
                            )}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                            👥 {t.capacity} personas • {t.location}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}

/* ── Modal crear reservación ── */
export const ReservationModal = ({ onClose, onCreate, loading }) => {
    const [form,        setForm]        = useState(emptyForm);
    const [restaurants, setRestaurants] = useState([]);
    const [tables,      setTables]      = useState([]);
    const [errors,      setErrors]      = useState({});
    const [maxGuests,   setMaxGuests]   = useState(null);
    const [loadingTables, setLoadingTables] = useState(false);

    useEffect(() => {
        getRestaurantsRequest()
            .then((res) => {
                const data = res.data?.data ?? res.data ?? [];
                setRestaurants(data.filter((r) => r.status === "ACTIVE"));
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!form.restaurant) { setTables([]); return; }

        setLoadingTables(true);
        setForm((prev) => ({ ...prev, table: "" }));
        setMaxGuests(null);

        getTablesRequest({ restaurant: form.restaurant, status: "AVAILABLE" })
            .then((res) => {
                const data = res.data?.data ?? [];
                setTables(data);
            })
            .catch(() => setTables([]))
            .finally(() => setLoadingTables(false));
    }, [form.restaurant]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const errs = {};
        if (!form.restaurant)   errs.restaurant     = "Selecciona un restaurante";
        if (!form.table)        errs.table          = "Selecciona una mesa";
        if (!form.date)         errs.date           = "Selecciona una fecha";
        if (!form.time)         errs.time           = "Selecciona una hora";
        if (!form.numberOfGuests || form.numberOfGuests < 1)
            errs.numberOfGuests = "Debe haber al menos 1 comensal";
        if (maxGuests && form.numberOfGuests > maxGuests)
            errs.numberOfGuests = `Esta mesa tiene capacidad máxima de ${maxGuests} personas`;
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        try {
            await onCreate({ ...form, numberOfGuests: parseInt(form.numberOfGuests) });
        } catch {
            // el error queda en el store
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}>

                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">Nueva reservación</h2>
                    <button onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1 transition-colors">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4" noValidate>

                    {/* Restaurante */}
                    <Field label="Restaurante" error={errors.restaurant} required>
                        <select name="restaurant" value={form.restaurant}
                            onChange={handleChange} className={inputClass(errors.restaurant)}>
                            <option value="">Selecciona un restaurante…</option>
                            {restaurants.map((r) => (
                                <option key={r._id} value={r._id}>{r.name}</option>
                            ))}
                        </select>
                    </Field>

                    {/* Selector de mesas con imágenes */}
                    {form.restaurant && (
                        <Field label="Selecciona una mesa" error={errors.table} required>
                            {loadingTables ? (
                                <div className="flex items-center justify-center py-8 gap-3 text-gray-400">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-orange-500 animate-spin" />
                                    <span className="text-sm">Cargando mesas...</span>
                                </div>
                            ) : (
                                <TableSelector
                                    tables={tables}
                                    selected={form.table}
                                    onSelect={(t) => {
                                        setForm((prev) => ({ ...prev, table: t._id }));
                                        setMaxGuests(t.capacity);
                                        setErrors((prev) => ({ ...prev, table: "" }));
                                    }}
                                />
                            )}
                        </Field>
                    )}

                    {/* Fecha + Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Fecha" error={errors.date} required>
                            <input type="date" name="date" value={form.date} min={today}
                                onChange={handleChange} className={inputClass(errors.date)} />
                        </Field>
                        <Field label="Hora" error={errors.time} required>
                            <div className="flex items-center gap-2">
                                <input type="time" name="time" value={form.time}
                                    onChange={handleChange} className={inputClass(errors.time)} />
                                {form.time && (
                                    <span className="text-sm font-bold text-orange-500 shrink-0">
                                        {parseInt(form.time.split(":")[0]) < 12 ? "AM" : "PM"}
                                    </span>
                                )}
                            </div>
                        </Field>
                    </div>

                    {/* Comensales */}
                    <Field label="Número de personas" error={errors.numberOfGuests} required>
                        <input
                            type="number"
                            name="numberOfGuests"
                            value={form.numberOfGuests}
                            min="1"
                            onChange={handleChange}
                            className={inputClass(errors.numberOfGuests)}
                        />
                        {maxGuests && (
                            <p className="text-xs text-gray-400 mt-1">
                                Capacidad máxima de esta mesa: <span className="font-bold text-gray-600">{maxGuests} personas</span>
                            </p>
                        )}
                    </Field>

                    {/* Peticiones especiales */}
                    <Field label="Peticiones especiales">
                        <textarea name="specialRequests" value={form.specialRequests}
                            onChange={handleChange} rows={2}
                            placeholder="Alergias, ocasión especial, preferencias de mesa…"
                            className={`${inputClass()} resize-none`} />
                    </Field>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose}
                            className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors disabled:opacity-60">
                            {loading ? "Reservando…" : "Confirmar reservación"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export const  Field = ({ label, children, error, required }) => {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {label} {required && <span className="text-orange-500">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-orange-500">{error}</p>}
        </div>
    );
}

export const inputClass = (error) =>
    `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors bg-white
    ${error ? "border-orange-500" : "border-gray-300 focus:border-orange-500"}`;
