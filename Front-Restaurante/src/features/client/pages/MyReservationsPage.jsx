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

    const [filterStatus,   setFilterStatus]   = useState("TODAS");
    const [cancelConfirm,  setCancelConfirm]  = useState(null);

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
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mis Reservaciones</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {reservations.length} reservación{reservations.length !== 1 ? "es" : ""} en total
                    </p>
                </div>
                <button
                    onClick={openModal}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600
                        text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    + Nueva reservación
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200
                    rounded-xl px-4 py-3 text-sm text-red-700">
                    <span>{error}</span>
                    <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-4">✕</button>
                </div>
            )}

            {/* Filtros */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                    { value: "TODAS",     label: "Todas" },
                    { value: "PENDIENTE", label: "Pendientes" },
                    { value: "CONFIRMADA",label: "Confirmadas" },
                    { value: "COMPLETADA",label: "Completadas" },
                    { value: "CANCELADA", label: "Canceladas" },
                ].map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setFilterStatus(value)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap
                            transition-colors shrink-0
                            ${filterStatus === value
                                ? "bg-orange-500 text-white border-orange-500"
                                : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Contenido */}
            {loading ? (
                <div className="flex flex-col items-center py-20 gap-3">
                    <div className="w-9 h-9 rounded-full border-[3px] border-gray-100
                        border-t-orange-500 animate-spin" />
                    <p className="text-sm text-gray-400">Cargando reservaciones…</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-5xl mb-3">📅</p>
                    <p className="text-gray-500 font-medium text-sm">
                        {filterStatus === "TODAS" ? "Aún no tienes reservaciones" : "No hay reservaciones en este estado"}
                    </p>
                    {filterStatus === "TODAS" && (
                        <button
                            onClick={openModal}
                            className="mt-4 px-5 py-2 bg-orange-500 hover:bg-orange-600
                                text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            Hacer una reservación
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
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

            {/* Modal crear reservación */}
            {isModalOpen && (
                <ReservationModal
                    onClose={closeModal}
                    onCreate={createReservation}
                    loading={loading}
                />
            )}

            {/* Confirm cancelar */}
            {cancelConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl px-7 py-6 w-full max-w-sm shadow-2xl">
                        <p className="font-semibold text-gray-900 mb-1">¿Cancelar esta reservación?</p>
                        <p className="text-sm text-gray-400 mb-5">Esta acción no se puede deshacer.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setCancelConfirm(null)}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-sm
                                    text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                No, mantener
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600
                                    text-white text-sm font-semibold transition-colors disabled:opacity-60"
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

/* ── Card de reservación ── */
function ReservationCard({ reservation: r, getStatusLabel, getStatusStyle, getStatusIcon, onCancel }) {
    const canCancel = r.status === "PENDIENTE";
    const date = new Date(r.date).toLocaleDateString("es-GT", {
        weekday: "short", day: "numeric", month: "short", year: "numeric"
    });

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate">
                        {r.restaurant?.name ?? "Restaurante"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 capitalize">{date} · {r.time}</p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold
                    flex items-center gap-1 ${getStatusStyle(r.status)}`}>
                    {getStatusIcon(r.status)} {getStatusLabel(r.status)}
                </span>
            </div>

            <div className="flex gap-4 text-xs text-gray-500">
                <span>👥 {r.numberOfGuests} {r.numberOfGuests === 1 ? "persona" : "personas"}</span>
                {r.table && <span>🪑 Mesa {r.table?.number ?? "—"}</span>}
            </div>

            {r.specialRequests && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                    📝 {r.specialRequests}
                </p>
            )}

            {canCancel && (
                <div className="flex justify-end pt-1 border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-xs
                            text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                        Cancelar reservación
                    </button>
                </div>
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