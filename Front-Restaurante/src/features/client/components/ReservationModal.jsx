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

export const  ReservationCard = ({ reservation: r, getStatusLabel, getStatusStyle, getStatusIcon, onCancel }) => {
    const canCancel = r.status === "PENDIENTE";

    const date = new Date(r.date).toLocaleDateString("es-GT", {
        weekday: "long", day: "numeric", month: "long"
    });

    return (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-black/5 p-6 hover:translate-y-[-4px] transition-all group">
            <div className="flex items-start justify-between mb-6">
                <div className="min-w-0">
                    <h4 className="font-black text-lg text-gray-900 truncate leading-tight group-hover:text-orange-500 transition-colors">
                        {r.restaurant?.name ?? "Restaurante"}
                    </h4>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mt-1">
                        {formatTime(r.time)} • {date}
                    </p>
                </div>
                <span className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${getStatusStyle(r.status)}`}>
                    {getStatusIcon(r.status)} {getStatusLabel(r.status)}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Comensales</p>
                    <p className="text-sm font-bold text-gray-700">👥 {r.numberOfGuests}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-3 text-center">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Ubicación</p>
                    <p className="text-sm font-bold text-gray-700 truncate">🪑 {r.table?.number ? `Mesa ${r.table.number}` : "Asignando..."}</p>
                </div>
            </div>

            {r.specialRequests && (
                <div className="mb-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Notas Especiales</p>
                    <p className="text-xs text-gray-600 bg-orange-50/50 border border-orange-100 rounded-2xl px-4 py-3 italic">
                        "{r.specialRequests}"
                    </p>
                </div>
            )}

            {canCancel && (
                <button
                    onClick={onCancel}
                    className="w-full py-3 rounded-2xl border-2 border-red-50 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                >
                    Cancelar Reserva
                </button>
            )}
        </div>
    );
}

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
