import { useState, useEffect, useRef } from "react";
import { useMesaStore } from "../store/useMesaStore";
import { XMarkIcon } from "@heroicons/react/24/outline";

const emptyForm = {
    number: "",
    capacity: "",
    minCapacity: "1",
    location: "INTERIOR",
    status: "AVAILABLE",
    shape: "CUADRADA",
    description: "",
    internalNotes: "",
    extraCharge: "0",
    requiresReservation: false,
    isActive: true,
    features: {
        isAccessible: false,
        hasView: false,
        isQuiet: false,
        hasPowerOutlet: false,
        nearWindow: false,
        nearKitchen: false,
    },
};

export const MesaModal = () => {
    const { isModalOpen, selectedTable, closeModal, createTable, updateTable } = useMesaStore();
    const isEditing = !!selectedTable;
    const fileInputRef = useRef(null);

    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isModalOpen) return;
        if (selectedTable) {
            setForm({
                ...selectedTable,
                extraCharge: selectedTable.extraCharge ?? "0",
                features: { ...emptyForm.features, ...selectedTable.features }
            });
            setImagePreview(selectedTable.image || "");
        } else {
            setForm(emptyForm);
            setImagePreview("");
        }
        setImageFile(null);
        setErrors({});
    }, [isModalOpen, selectedTable]);

    if (!isModalOpen) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleFeatureChange = (e) => {
        const { name, checked } = e.target;
        setForm((prev) => ({ ...prev, features: { ...prev.features, [name]: checked } }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const restaurantId = JSON.parse(atob(token.split(".")[1]))?.restaurantId || "";

        const payload = new FormData();
        Object.keys(form).forEach(key => {
            if (key === "features") payload.append(key, JSON.stringify(form[key]));
            else payload.append(key, form[key]);
        });
        payload.append("restaurant", restaurantId);
        if (imageFile) payload.append("image", imageFile);

        try {
            if (isEditing) await updateTable(selectedTable._id, payload);
            else await createTable(payload);
            closeModal();
        } catch (err) { }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-300 overflow-y-auto">
            <div
                className="bg-[#1C1A17] border border-white/10 rounded-[40px] w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] my-auto relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/10 blur-[80px] pointer-events-none" />

                {/* Header Premium */}
                <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 relative z-10">
                    <div>
                        <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                            {isEditing ? "Editar Mesa" : "Nueva Mesa"}
                        </h2>
                        <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] mt-1">Gestión de distribución</p>
                    </div>
                    <button
                        onClick={closeModal}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#6B6560] hover:text-white hover:bg-red-500 transition-all duration-300"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <Field label="Mesa #" error={errors.number} required>
                            <input name="number" value={form.number} onChange={handleChange} placeholder="A1" className={inputClass(errors.number)} />
                        </Field>
                        <Field label="Cap. Máx" required>
                            <input name="capacity" type="number" value={form.capacity} onChange={handleChange} className={inputClass()} />
                        </Field>
                        <Field label="Cap. Mín">
                            <input name="minCapacity" type="number" value={form.minCapacity} onChange={handleChange} className={inputClass()} />
                        </Field>
                        <Field label="Cargo Extra (Q)">
                            <input name="extraCharge" type="number" value={form.extraCharge} onChange={handleChange} className={inputClass()} />
                        </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Field label="Ubicación">
                            <select name="location" value={form.location} onChange={handleChange} className={inputClass()}>
                                <option className="bg-[#1C1A17]" value="INTERIOR">Interior</option>
                                <option className="bg-[#1C1A17]" value="TERRAZA">Terraza</option>
                                <option className="bg-[#1C1A17]" value="VIP">VIP</option>
                                <option className="bg-[#1C1A17]" value="BAR">Bar</option>
                            </select>
                        </Field>
                        <Field label="Estado">
                            <select name="status" value={form.status} onChange={handleChange} className={inputClass()}>
                                <option className="bg-[#1C1A17]" value="AVAILABLE">Disponible</option>
                                <option className="bg-[#1C1A17]" value="OCCUPIED">Ocupada</option>
                                <option className="bg-[#1C1A17]" value="MAINTENANCE">Mantenimiento</option>
                            </select>
                        </Field>
                        <Field label="Forma">
                            <select name="shape" value={form.shape} onChange={handleChange} className={inputClass()}>
                                <option className="bg-[#1C1A17]" value="CUADRADA">Cuadrada</option>
                                <option className="bg-[#1C1A17]" value="CIRCULAR">Circular</option>
                                <option className="bg-[#1C1A17]" value="RECTANGULAR">Rectangular</option>
                            </select>
                        </Field>
                    </div>

                    {/* Características Glassmorphism */}
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px]">
                        <p className="text-[10px] font-black text-[#6B6560] uppercase tracking-widest mb-6 ml-1">Atributos de la Mesa</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { name: "isAccessible", label: "Accesible", icon: "♿" },
                                { name: "hasView", label: "Vista", icon: "🌅" },
                                { name: "isQuiet", label: "Silenciosa", icon: "🔇" },
                                { name: "hasPowerOutlet", label: "Enchufe", icon: "🔌" },
                                { name: "nearWindow", label: "Ventana", icon: "🪟" },
                                { name: "nearKitchen", label: "Cocina", icon: "👨‍🍳" },
                            ].map((feat) => (
                                <label key={feat.name} className={`
                  flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer group
                  ${form.features[feat.name] ? "border-orange-500/50 bg-orange-500/10 text-white" : "border-white/5 bg-white/5 text-[#A09890] hover:border-white/10"}
                `}>
                                    <input type="checkbox" name={feat.name} checked={form.features[feat.name]} onChange={handleFeatureChange} className="hidden" />
                                    <span className={`text-lg transition-transform duration-300 group-active:scale-90 ${form.features[feat.name] ? "scale-110" : ""}`}>{feat.icon}</span>
                                    <span className="text-[10px] font-black uppercase tracking-tight">{feat.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Imagen y Notas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="h-full min-h-[160px] rounded-[32px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all cursor-pointer overflow-hidden relative group"
                        >
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="preview" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest bg-orange-600 px-4 py-2 rounded-full">Cambiar Foto</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center p-6">
                                    <span className="text-3xl mb-2 block opacity-40">📸</span>
                                    <span className="text-[10px] font-black text-[#6B6560] uppercase tracking-widest">Subir Imagen</span>
                                </div>
                            )}
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>

                        <div className="space-y-6">
                            <Field label="Notas Internas">
                                <textarea name="internalNotes" value={form.internalNotes} onChange={handleChange} rows={3} className={`${inputClass()} resize-none`} placeholder="Solo personal..." />
                            </Field>
                            <div className="flex flex-col gap-4">
                                <Toggle label="Requiere Reserva" name="requiresReservation" checked={form.requiresReservation} onChange={handleChange} />
                                <Toggle label="Mesa Activa" name="isActive" checked={form.isActive} onChange={handleChange} color="emerald" />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                        <button type="button" onClick={closeModal} className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#6B6560] hover:text-white transition-all">
                            Cerrar
                        </button>
                        <button type="submit" className="px-10 py-4 rounded-2xl bg-white text-black hover:bg-orange-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 shadow-xl hover:shadow-orange-500/20 active:scale-95">
                            {isEditing ? "Guardar Cambios" : "Configurar Mesa"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Field = ({ label, children, error, required }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black text-[#6B6560] uppercase tracking-[0.15em] ml-1">
            {label} {required && <span className="text-orange-500">*</span>}
        </label>
        {children}
        {error && <p className="text-[10px] font-bold text-red-500 animate-pulse ml-1">✕ {error}</p>}
    </div>
);

const Toggle = ({ label, name, checked, onChange, color = "orange" }) => {
    const accentColor = color === "emerald" ? "peer-checked:bg-emerald-600" : "peer-checked:bg-orange-600";
    return (
        <label className="group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-white/10 transition-all duration-300">
            <span className="text-[11px] font-black text-white group-hover:text-orange-400 transition-colors uppercase tracking-tight">{label}</span>
            <div className="relative">
                <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
                <div className={`w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${accentColor} shadow-inner`}></div>
            </div>
        </label>
    );
};

const inputClass = (error) =>
    `w-full px-5 py-4 rounded-2xl border text-sm font-medium outline-none transition-all duration-300 bg-[#1C1A17] text-white placeholder-[#6B6560] focus:ring-4 focus:ring-orange-500/5 appearance-none
   ${error
        ? "border-red-500/30 bg-red-500/5 focus:border-red-500"
        : "border-white/5 focus:border-orange-500/30 focus:bg-[#25221F]"}`;