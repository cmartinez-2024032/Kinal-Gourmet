import { useState } from "react";
import { useReservationStore } from "../store/UseReservationStore";

const inputClass = "w-full px-5 py-3 rounded-2xl border-2 border-stone-100 bg-stone-50 text-stone-700 text-sm font-bold outline-none transition-all focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50";

const Field = ({ label, children, required }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
  </div>
);

const ReservationForm = ({ reservation, onClose }) => {
  const { createReservation, updateReservation } = useReservationStore();

  const [formData, setFormData] = useState({
    table:           reservation?.table?._id        || reservation?.table        || "",
    date:            reservation?.date?.slice(0, 10) || "",
    time:            reservation?.time               || "",
    numberOfGuests:  reservation?.numberOfGuests     || "",
    specialRequests: reservation?.specialRequests    || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reservation) await updateReservation(reservation._id, formData);
    else             await createReservation(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">

      <Field label="ID de la Mesa" required>
        <input
          type="text"
          name="table"
          value={formData.table}
          onChange={handleChange}
          placeholder="ID de la mesa"
          required
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Fecha" required>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Hora" required>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Número de comensales" required>
        <input
          type="number"
          name="numberOfGuests"
          value={formData.numberOfGuests}
          onChange={handleChange}
          placeholder="Ej: 4"
          required
          min={1}
          className={inputClass}
        />
      </Field>

      <Field label="Peticiones especiales">
        <textarea
          name="specialRequests"
          value={formData.specialRequests}
          onChange={handleChange}
          placeholder="Alergias, preferencias, celebraciones... (opcional)"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-8 py-4 rounded-2xl text-stone-400 font-bold hover:bg-stone-100 transition-all text-sm"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-10 py-4 rounded-2xl bg-stone-900 text-white font-black text-sm shadow-xl hover:bg-orange-500 transition-all active:scale-95"
        >
          {reservation ? "Actualizar" : "Crear Reservación"}
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;