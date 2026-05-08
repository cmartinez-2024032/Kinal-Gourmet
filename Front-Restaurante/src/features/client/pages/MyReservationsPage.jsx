import { useEffect, useState } from "react";
import { useReservationClientStore } from "../store/UseReservationClientStore";
import { getRestaurantsRequest } from "../../../shared/api/restaurants.js";
import { getTablesRequest } from "../../../shared/api/mesas.js";

const emptyForm = {
    restaurant: "",
    table:      "",
    date:       "",
    time:       "",
    numberOfGuests: 1,
    specialRequests: "",
};

export const MyReservationsPage = () => {
    const {
        reservations, loading, error,
        isModalOpen, openModal, closeModal,
        fetchReservations, createReservation, cancelReservation,
        getStatusLabel, getStatusStyle, getStatusIcon,
        clearError,
    } = useReservationClientStore();

    const [filterStatus, setFilterStatus] = useState("TODAS");
    const [cancelConfirm, setCancelConfirm] = useState(null);

    useEffect(() => { fetchReservations(); }, []);

    const filtered = filterStatus === "TODAS"
        ? reservations
        : reservations.filter((r) => r.status === filterStatus);

    const handleCancel = async () => {
        if (!cancelConfirm) return;
        try { await cancelReservation(cancelConfirm); }
        finally { setCancelConfirm(null); }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* HERO SECTION - Estilo HomePage */}
            <div className="relative bg-zinc-950 text-white pt-24 pb-32 px-8 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                        className="w-full h-full object-cover"
                        alt="Hero Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                </div>

                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="flex justify-between items-end flex-wrap gap-6">
                        <div>
                            <h1 className="text-6xl md:text-7xl font-[900] mb-6 tracking-tighter leading-none">
                                Mis <span className="text-orange-500 font-serif italic">Reservaciones</span>
                            </h1>
                            <p className="text-gray-300 text-xl max-w-xl font-medium leading-relaxed opacity-90">
                                Asegura tu lugar en los mejores puntos gastronómicos de la ciudad.
                            </p>
                        </div>
                        <button
                            onClick={openModal}
                            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-[900] 
                                    rounded-2xl transition-all shadow-lg shadow-orange-500/20 hover:scale-105 uppercase text-xs tracking-widest"
                        >
                            + Nueva reservación
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-8 -mt-10 pb-20 relative z-20">
                {/* Error Banner */}
                {error && (
                    <div className="flex items-center justify-between bg-red-500 text-white rounded-2xl px-6 py-4 text-sm font-bold mb-6 shadow-xl animate-bounce">
                        <span>{error}</span>
                        <button onClick={clearError} className="hover:scale-125 transition-transform">✕</button>
                    </div>
                )}

                {/* Filtros Estabilizados (Sin temblor) */}
                <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-4 border border-gray-100 flex gap-2 overflow-x-auto no-scrollbar mb-10">
                    {[
                        { value: "TODAS", label: "Todas" },
                        { value: "PENDIENTE", label: "Pendientes" },
                        { value: "CONFIRMADA", label: "Confirmadas" },
                        { value: "COMPLETADA", label: "Completadas" },
                        { value: "CANCELADA", label: "Canceladas" },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setFilterStatus(value)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-[900] uppercase tracking-widest transition-all shrink-0 border-2
                                ${filterStatus === value
                                    ? "bg-black text-white shadow-lg shadow-black/20 border-black"
                                    : "bg-gray-50 text-gray-400 hover:bg-gray-100 border-transparent"}`}
                            style={{ minWidth: "max-content" }}
                        >
                            <span className="relative inline-flex flex-col items-center">
                                {label}
                                <span className="block font-[900] h-0 overflow-hidden invisible" aria-hidden="true">
                                    {label}
                                </span>
                            </span>
                        </button>
                    ))}
                </div>

                {/* Contenido */}
                {loading ? (
                    <div className="flex flex-col items-center py-32 gap-4">
                        <div className="w-12 h-12 rounded-full border-[4px] border-gray-100 border-t-orange-500 animate-spin" />
                        <p className="font-black text-gray-400 uppercase tracking-tighter">Preparando tu agenda...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-200 py-32 text-center shadow-sm">
                        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">📅</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No encontramos nada por aquí</h3>
                        <p className="text-gray-400 font-medium mb-8">
                            {filterStatus === "TODAS" ? "Parece que aún no has realizado ninguna reserva." : "No hay reservas con este estado."}
                        </p>
                        {filterStatus === "TODAS" && (
                            <button
                                onClick={openModal}
                                className="px-8 py-4 bg-black text-white font-[900] rounded-2xl hover:bg-orange-500 transition-all uppercase text-xs tracking-widest"
                            >
                                Hacer una reservación
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((res) => (
                            <ReservationCard
                                key={res._id}
                                reservation={res}
                                getStatusLabel={getStatusLabel}
                                getStatusStyle={getStatusStyle}
                                getStatusIcon={getStatusIcon}
                                onCancel={() => setCancelConfirm(res._id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modales mantenidos con la misma lógica funcional */}
            {isModalOpen && (
                <ReservationModal
                    onClose={closeModal}
                    onCreate={createReservation}
                    loading={loading}
                />
            )}

            {/* Confirm cancelar */}
            {cancelConfirm && (
                <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[32px] px-8 py-8 w-full max-w-sm shadow-2xl border border-gray-100">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto text-2xl">⚠️</div>
                        <p className="text-xl font-black text-gray-900 mb-2 text-center">¿Cancelar reserva?</p>
                        <p className="text-sm text-gray-500 mb-8 text-center leading-relaxed">Esta acción liberará tu mesa y otros podrán tomarla.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setCancelConfirm(null)}
                                className="px-4 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition-all text-sm"
                            >
                                Mantener
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 text-sm disabled:opacity-50"
                            >
                                Sí, cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ── Card de reservación Mejorada ── */
function ReservationCard({ reservation: r, getStatusLabel, getStatusStyle, getStatusIcon, onCancel }) {
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
                        {r.time} • {date}
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

/* ── Modal crear reservación ── */
function ReservationModal({ onClose, onCreate, loading }) {
    const [form,       setForm]       = useState(emptyForm);
    const [restaurants, setRestaurants] = useState([]);
    const [tables,      setTables]      = useState([]);
    const [errors,      setErrors]      = useState({});

    // Cargar restaurantes al abrir
    useEffect(() => {
        getRestaurantsRequest()
            .then((res) => {
                const data = res.data?.data ?? res.data ?? [];

                // solo activos
                const activeRestaurants = data.filter(
                    (r) => r.status === "ACTIVE"
                );

                setRestaurants(activeRestaurants);
            })
            .catch(() => {});
    }, []);

    // Cargar mesas cuando cambia el restaurante
    useEffect(() => {
        if (!form.restaurant) {
            setTables([]);
            return;
        }

        getTablesRequest()
            .then((res) => {
                const data = res.data?.data ?? res.data ?? [];

                // Filtrar mesas del restaurante y disponibles
                const filteredTables = data.filter(
                    (t) =>
                        t.restaurant === form.restaurant &&
                        t.status === "AVAILABLE"
                );

                setTables(filteredTables);
            })
            .catch(() => {});
    }, [form.restaurant]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const errs = {};
        if (!form.restaurant)     errs.restaurant     = "Selecciona un restaurante";
        if (!form.table)          errs.table          = "Selecciona una mesa";
        if (!form.date)           errs.date           = "Selecciona una fecha";
        if (!form.time)           errs.time           = "Selecciona una hora";
        if (!form.numberOfGuests || form.numberOfGuests < 1)
            errs.numberOfGuests = "Debe haber al menos 1 comensal";
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        try {
            await onCreate({
                ...form,
                numberOfGuests: parseInt(form.numberOfGuests),
            });
        } catch {
            // el error queda en el store
        }
    };

    // Fecha mínima = hoy
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}>
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}>

                {/* Header */}
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

                    {/* Mesa */}
                    <Field label="Mesa" error={errors.table} required>
                        <select name="table" value={form.table}
                            onChange={handleChange}
                            disabled={!form.restaurant}
                            className={inputClass(errors.table)}>
                            <option value="">
                                {form.restaurant ? "Selecciona una mesa…" : "Primero elige un restaurante"}
                            </option>
                            {tables.map((t) => (
                                <option key={t._id} value={t._id}>
                                    Mesa {t.number} · {t.capacity} personas · {t.location}
                                </option>
                            ))}
                        </select>
                    </Field>

                    {/* Fecha + Hora */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Fecha" error={errors.date} required>
                            <input type="date" name="date" value={form.date} min={today}
                                onChange={handleChange} className={inputClass(errors.date)} />
                        </Field>
                        <Field label="Hora" error={errors.time} required>
                            <input type="time" name="time" value={form.time}
                                onChange={handleChange} className={inputClass(errors.time)} />
                        </Field>
                    </div>

                    {/* Comensales */}
                    <Field label="Número de personas" error={errors.numberOfGuests} required>
                        <input type="number" name="numberOfGuests" value={form.numberOfGuests}
                            min="1" max="20" onChange={handleChange}
                            className={inputClass(errors.numberOfGuests)} />
                    </Field>

                    {/* Peticiones especiales */}
                    <Field label="Peticiones especiales">
                        <textarea name="specialRequests" value={form.specialRequests}
                            onChange={handleChange} rows={2}
                            placeholder="Alergias, ocasión especial, preferencias de mesa…"
                            className={`${inputClass()} resize-none`} />
                    </Field>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose}
                            className="px-5 py-2 rounded-lg border border-gray-200 text-sm
                                text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600
                                text-white text-sm font-semibold transition-colors disabled:opacity-60">
                            {loading ? "Reservando…" : "Confirmar reservación"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, children, error, required }) {
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

const inputClass = (error) =>
    `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors bg-white
    ${error ? "border-orange-500" : "border-gray-300 focus:border-orange-500"}`;