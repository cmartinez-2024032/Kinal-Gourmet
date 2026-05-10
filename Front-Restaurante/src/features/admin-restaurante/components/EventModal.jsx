import { useState, useEffect } from "react";
import { useEventStore } from "../store/useEventStore";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const emptyForm = {
    name: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    capacity: "",
    additionalServices: "",
    isActive: true,
    status: "PROGRAMADO",
};

export const EventModal = () => {
    const { isModalOpen, selectedEvent, closeModal, createEvent, updateEvent } = useEventStore();

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const isEditing = !!selectedEvent;

    useEffect(() => {
        if (isModalOpen) {
            if (selectedEvent) {
                const formattedDate = selectedEvent.date ? new Date(selectedEvent.date).toISOString().split('T')[0] : "";
                setForm({
                    name: selectedEvent.name || "",
                    description: selectedEvent.description || "",
                    date: formattedDate,
                    startTime: selectedEvent.startTime || "",
                    endTime: selectedEvent.endTime || "",
                    capacity: selectedEvent.capacity || "",
                    additionalServices: selectedEvent.additionalServices?.join(", ") || "",
                    isActive: selectedEvent.isActive ?? true,
                    status: selectedEvent.status || "PROGRAMADO",
                });
            } else {
                setForm(emptyForm);
            }
            setErrors({});
        }
    }, [isModalOpen, selectedEvent]);

    if (!isModalOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = "El nombre es obligatorio.";
        if (!form.description.trim()) errs.description = "La descripción es obligatoria.";
        if (!form.date) errs.date = "La fecha es obligatoria.";
        if (!form.startTime) errs.startTime = "Hora de inicio requerida.";
        if (!form.endTime) errs.endTime = "Hora de fin requerida.";
        if (!form.capacity || form.capacity < 1) errs.capacity = "Mínimo 1 persona.";
        if (form.startTime && form.endTime && form.startTime >= form.endTime) {
            errs.endTime = "Debe ser posterior al inicio.";
        }
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const token = localStorage.getItem("token");
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const restaurantId = tokenData?.restaurantId || "";

        const payload = {
            ...form,
            capacity: Number(form.capacity),
            restaurant: restaurantId,
        };

        try {
            if (isEditing) {
                await updateEvent(selectedEvent._id, payload);
            } else {
                await createEvent(payload);
            }
            closeModal();
        } catch (error) {
            console.error("Error en el formulario", error);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all"
            onClick={closeModal}
        >
            <div 
                className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Elegante */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isEditing ? "Editar Detalles" : "Nuevo Evento"}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">
                            {isEditing ? "Modifica la información de tu evento" : "Completa los campos para tu próximo gran evento"}
                        </p>
                    </div>
                    <button 
                        onClick={closeModal} 
                        className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    
                    <Field label="Nombre del Evento" error={errors.name} required>
                        <input name="name" value={form.name} onChange={handleChange} className={inputClass(errors.name)} placeholder="Ej. Gala Anual 2024" />
                    </Field>

                    <Field label="Descripción" error={errors.description} required>
                        <textarea name="description" value={form.description} onChange={handleChange} rows="3" className={inputClass(errors.description)} placeholder="Escribe de qué trata el evento..." />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Field label="Fecha" error={errors.date} required>
                            <input type="date" name="date" value={form.date} onChange={handleChange} className={inputClass(errors.date)} />
                        </Field>
                        <Field label="Hora Inicio" error={errors.startTime} required>
                            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className={inputClass(errors.startTime)} />
                        </Field>
                        <Field label="Hora Fin" error={errors.endTime} required>
                            <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className={inputClass(errors.endTime)} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Capacidad" error={errors.capacity} required>
                            <div className="relative">
                                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className={inputClass(errors.capacity)} placeholder="0" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold uppercase">Pax</span>
                            </div>
                        </Field>
                        <Field label="Estado Actual">
                            <select name="status" value={form.status} onChange={handleChange} className={inputClass()}>
                                <option value="PROGRAMADO">📅 Programado</option>
                                <option value="EN_CURSO">🔥 En curso</option>
                                <option value="FINALIZADO">✅ Finalizado</option>
                                <option value="CANCELADO">🚫 Cancelado</option>
                            </select>
                        </Field>
                    </div>

                    <Field label="Servicios Adicionales">
                        <input name="additionalServices" value={form.additionalServices} onChange={handleChange} className={inputClass()} placeholder="Separados por comas: Música, Buffet, Luces..." />
                    </Field>

                    <div className="flex items-center p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                            </div>
                            <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600 transition-colors">Visibilidad Pública</span>
                        </label>
                    </div>

                    {/* Footer con diseño Premium */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={closeModal} 
                            className="px-8 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all active:scale-95"
                        >
                            Cerrar
                        </button>
                        <button 
                            type="submit" 
                            className="px-8 py-3 rounded-2xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 shadow-xl shadow-orange-200 transition-all active:scale-95"
                        >
                            {isEditing ? "Actualizar Evento" : "Crear Evento"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Sub-componentes Refinados ---
function Field({ label, children, error, required }) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">
                {label} {required && <span className="text-orange-500">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-500 font-bold ml-1 animate-pulse italic">{error}</p>}
        </div>
    );
}

const inputClass = (error) =>
    `w-full px-5 py-3.5 rounded-[1.2rem] border text-sm font-medium outline-none transition-all duration-200
    ${error 
        ? "border-red-200 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
        : "border-gray-100 bg-gray-50/50 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10"}`;