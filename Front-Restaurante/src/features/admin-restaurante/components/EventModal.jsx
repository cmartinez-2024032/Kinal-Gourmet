import { useState, useEffect } from "react";
import { useEventStore } from "../store/useEventStore";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
            additionalServices: form.additionalServices ? form.additionalServices.split(",").map(s => s.trim()) : []
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
            className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-300 overflow-y-auto"
            onClick={closeModal}
        >
            <div 
                className="bg-[#1C1A17] border border-white/10 rounded-[40px] w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] my-auto relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/10 blur-[80px] pointer-events-none" />

                {/* Header Premium */}
                <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 relative z-10">
                    <div>
                        <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                            {isEditing ? "Editar Evento" : "Nuevo Evento"}
                        </h2>
                        <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] mt-1">
                            {isEditing ? "Ajusta los detalles de la reserva" : "Configuración de Agenda"}
                        </p>
                    </div>
                    <button 
                        onClick={closeModal} 
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#6B6560] hover:text-white hover:bg-red-500 transition-all duration-300"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
                    
                    <Field label="Nombre del Evento" error={errors.name} required>
                        <input name="name" value={form.name} onChange={handleChange} className={inputClass(errors.name)} placeholder="Ej. Gala Anual 2024" />
                    </Field>

                    <Field label="Descripción" error={errors.description} required>
                        <textarea name="description" value={form.description} onChange={handleChange} rows="3" className={`${inputClass(errors.description)} resize-none`} placeholder="Escribe de qué trata el evento..." />
                    </Field>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Capacidad" error={errors.capacity} required>
                            <div className="relative">
                                <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className={inputClass(errors.capacity)} placeholder="0" />
                                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6B6560] text-[10px] font-black uppercase tracking-widest">Pax</span>
                            </div>
                        </Field>
                        <Field label="Estado del Evento">
                            <select name="status" value={form.status} onChange={handleChange} className={inputClass()}>
                                <option value="PROGRAMADO" className="bg-[#1C1A17]">📅 Programado</option>
                                <option value="EN_CURSO" className="bg-[#1C1A17]">🔥 En curso</option>
                                <option value="FINALIZADO" className="bg-[#1C1A17]">✅ Finalizado</option>
                                <option value="CANCELADO" className="bg-[#1C1A17]">🚫 Cancelado</option>
                            </select>
                        </Field>
                    </div>

                    <Field label="Servicios Adicionales">
                        <input name="additionalServices" value={form.additionalServices} onChange={handleChange} className={inputClass()} placeholder="Música, Buffet, Luces..." />
                    </Field>

                    <div className="flex items-center p-6 bg-white/[0.02] rounded-3xl border border-white/5">
                        <label className="group flex items-center justify-between w-full cursor-pointer">
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-white group-hover:text-orange-400 transition-colors uppercase tracking-tight">Visibilidad Pública</span>
                                <span className="text-[10px] text-[#A09890] font-medium mt-1">Mostrar este evento en el portal de clientes</span>
                            </div>
                            <div className="relative">
                                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="sr-only peer" />
                                <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 shadow-inner"></div>
                            </div>
                        </label>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                        <button 
                            type="button" 
                            onClick={closeModal} 
                            className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#6B6560] hover:text-white transition-all"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="px-10 py-4 rounded-2xl bg-white text-black hover:bg-orange-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 shadow-xl hover:shadow-orange-500/20 active:scale-95"
                        >
                            {isEditing ? "Guardar Cambios" : "Crear Evento"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function Field({ label, children, error, required }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-[#6B6560] uppercase tracking-[0.15em] ml-1">
                {label} {required && <span className="text-orange-500">*</span>}
            </label>
            {children}
            {error && <p className="text-[10px] font-bold text-red-500 animate-pulse ml-1">✕ {error}</p>}
        </div>
    );
}

const inputClass = (error) =>
    `w-full px-5 py-4 rounded-2xl border text-sm font-medium outline-none transition-all duration-300 bg-[#1C1A17] text-white placeholder-[#6B6560] focus:ring-4 focus:ring-orange-500/5 appearance-none
    ${error 
        ? "border-red-500/30 bg-red-500/5 focus:border-red-500" 
        : "border-white/5 focus:border-orange-500/30 focus:bg-[#25221F]"}`;