import { useState, useEffect } from "react";
import { useReservationStore } from "../store/UseReservationStore";

const STATUS_OPTIONS = [
  { value: "PENDIENTE",  label: "Pendiente",  color: "text-amber-500",   dot: "bg-amber-400"   },
  { value: "CONFIRMADA", label: "Confirmada", color: "text-emerald-500", dot: "bg-emerald-400" },
  { value: "CANCELADA",  label: "Cancelada",  color: "text-red-500",     dot: "bg-red-400"     },
  { value: "COMPLETADA", label: "Completada", color: "text-blue-500",    dot: "bg-blue-400"    },
];

const inputClass =
  "w-full mt-1.5 px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-800 " +
  "placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition";

const ReservationForm = ({ reservation, onClose }) => {
  const { createReservation, updateReservation } = useReservationStore();
  const isEdit = Boolean(reservation);

  const [formData, setFormData] = useState({
    restaurant:      "",
    table:           "",
    date:            "",
    time:            "",
    numberOfGuests:  1,
    specialRequests: "",
  });
  const [status,     setStatus]     = useState("PENDIENTE");
  const [submitting, setSubmitting] = useState(false);
  const [formError,  setFormError]  = useState("");

  // Sincroniza cuando cambia la reservación recibida
  useEffect(() => {
    setFormData({
      restaurant:      reservation?.restaurant?._id ?? reservation?.restaurant ?? "",
      table:           reservation?.table?._id      ?? reservation?.table      ?? "",
      date:            reservation?.date
                         ? new Date(reservation.date).toISOString().substring(0, 10)
                         : "",
      time:            reservation?.time            ?? "",
      numberOfGuests:  reservation?.numberOfGuests  ?? 1,
      specialRequests: reservation?.specialRequests ?? "",
    });
    setStatus(reservation?.status ?? "PENDIENTE");
    setFormError("");
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.restaurant || !formData.table || !formData.date || !formData.time) {
      setFormError("Restaurante, mesa, fecha y hora son obligatorios.");
      return;
    }

    setSubmitting(true);
    try {
      let result;
      if (isEdit) {
        result = await updateReservation(reservation._id, { ...formData, status });
      } else {
        result = await createReservation({ ...formData, status });
      }

      if (result?.success === false) {
        setFormError(result.message || "Ocurrió un error al guardar.");
        return;
      }
      onClose();
    } catch (err) {
      setFormError("Error inesperado. Intenta de nuevo.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === status);

  return (
    <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">

      {/* ── Estado ── */}
      <div>
        <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest">
          Estado de la reservación
        </label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                ${status === opt.value
                  ? "bg-stone-900 text-white border-stone-900 shadow"
                  : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Restaurante ── */}
      <div>
        <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest">
          ID Restaurante
        </label>
        <input
          type="text"
          name="restaurant"
          value={formData.restaurant}
          onChange={handleChange}
          placeholder="ObjectId del restaurante"
          className={inputClass}
          required
        />
      </div>

      {/* ── Mesa + Comensales ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest">
            ID Mesa
          </label>
          <input
            type="text"
            name="table"
            value={formData.table}
            onChange={handleChange}
            placeholder="ObjectId de la mesa"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest">
            Comensales
          </label>
          <input
            type="number"
            name="numberOfGuests"
            value={formData.numberOfGuests}
            onChange={handleChange}
            min={1}
            max={50}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* ── Fecha + Hora ── */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest">
            Fecha
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest">
            Hora
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* ── Notas ── */}
      <div>
        <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest">
          Notas especiales
        </label>
        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleChange}
          rows={3}
          placeholder="Alergias, preferencias, ocasión especial..."
          className={inputClass + " resize-none"}
        />
      </div>

      {/* ── Error ── */}
      {formError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-semibold">
          <span>⚠️</span> {formError}
        </div>
      )}

      {/* ── Acciones ── */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="flex-1 py-3.5 rounded-2xl border border-stone-200 text-sm font-bold text-stone-600
            hover:bg-stone-50 transition disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold
            shadow-lg shadow-orange-500/20 transition disabled:opacity-60 active:scale-95"
        >
          {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear reservación"}
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;