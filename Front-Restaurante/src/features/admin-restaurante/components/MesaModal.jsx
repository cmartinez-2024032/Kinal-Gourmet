import { useState, useEffect, useRef } from "react";
import { useMesaStore } from "../store/UseMesaStore";

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
        if (isModalOpen) {
            if (selectedTable) {
                setForm({
                    number: selectedTable.number || "",
                    capacity: selectedTable.capacity || "",
                    minCapacity: selectedTable.minCapacity || "1",
                    location: selectedTable.location || "INTERIOR",
                    status: selectedTable.status || "AVAILABLE",
                    shape: selectedTable.shape || "CUADRADA",
                    description: selectedTable.description || "",
                    internalNotes: selectedTable.internalNotes || "",
                    extraCharge: selectedTable.extraCharge ?? "0",
                    requiresReservation: selectedTable.requiresReservation ?? false,
                    isActive: selectedTable.isActive ?? true,
                    features: {
                        isAccessible: selectedTable.features?.isAccessible ?? false,
                        hasView: selectedTable.features?.hasView ?? false,
                        isQuiet: selectedTable.features?.isQuiet ?? false,
                        hasPowerOutlet: selectedTable.features?.hasPowerOutlet ?? false,
                        nearWindow: selectedTable.features?.nearWindow ?? false,
                        nearKitchen: selectedTable.features?.nearKitchen ?? false,
                    },
                });
                setImagePreview(selectedTable.image || "");
            } else {
                setForm(emptyForm);
                setImagePreview("");
            }
            setImageFile(null);
            setErrors({});
        }
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

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const validate = () => {
        const errs = {};
        if (!form.number.trim()) errs.number = "El número de mesa es requerido.";
        if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1)
            errs.capacity = "La capacidad debe ser al menos 1.";
        if (Number(form.minCapacity) > Number(form.capacity))
            errs.minCapacity = "La capacidad mínima no puede superar la máxima.";
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

        const payload = new FormData();
        payload.append("number", form.number.trim());
        payload.append("capacity", parseInt(form.capacity));
        payload.append("minCapacity", parseInt(form.minCapacity));
        payload.append("location", form.location);
        payload.append("status", form.status);
        payload.append("shape", form.shape);
        payload.append("description", form.description.trim());
        payload.append("internalNotes", form.internalNotes.trim());
        payload.append("extraCharge", parseFloat(form.extraCharge));
        payload.append("requiresReservation", form.requiresReservation);
        payload.append("isActive", form.isActive);
        payload.append("restaurant", restaurantId);
        payload.append("features", JSON.stringify(form.features));

        if (imageFile) payload.append("image", imageFile);

        try {
            if (isEditing) {
                await updateTable(selectedTable._id, payload);
            } else {
                await createTable(payload);
            }
            closeModal();
        } catch {
            // el error ya queda en el store
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {isEditing ? "Editar Mesa" : "Nueva Mesa"}
                    </h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4" noValidate>

                    {/* Número + Capacidad */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Número de mesa" error={errors.number} required>
                            <input
                                name="number"
                                value={form.number}
                                onChange={handleChange}
                                placeholder="Ej. 1, A1, VIP-3"
                                className={inputClass(errors.number)}
                            />
                        </Field>
                        <Field label="Capacidad máx." error={errors.capacity} required>
                            <input
                                name="capacity"
                                type="number"
                                min="1"
                                max="20"
                                value={form.capacity}
                                onChange={handleChange}
                                placeholder="4"
                                className={inputClass(errors.capacity)}
                            />
                        </Field>
                    </div>

                    {/* Capacidad mín + Cargo extra */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Capacidad mín." error={errors.minCapacity}>
                            <input
                                name="minCapacity"
                                type="number"
                                min="1"
                                value={form.minCapacity}
                                onChange={handleChange}
                                placeholder="1"
                                className={inputClass(errors.minCapacity)}
                            />
                        </Field>
                        <Field label="Cargo extra (Q)">
                            <input
                                name="extraCharge"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.extraCharge}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={inputClass()}
                            />
                        </Field>
                    </div>

                    {/* Ubicación + Estado */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Ubicación" required>
                            <select name="location" value={form.location} onChange={handleChange} className={inputClass()}>
                                <option value="INTERIOR">Interior</option>
                                <option value="TERRAZA">Terraza</option>
                                <option value="VIP">VIP</option>
                                <option value="BAR">Bar</option>
                                <option value="PRIVADO">Privado</option>
                            </select>
                        </Field>
                        <Field label="Estado">
                            <select name="status" value={form.status} onChange={handleChange} className={inputClass()}>
                                <option value="AVAILABLE">Disponible</option>
                                <option value="OCCUPIED">Ocupada</option>
                                <option value="RESERVED">Reservada</option>
                                <option value="MAINTENANCE">Mantenimiento</option>
                            </select>
                        </Field>
                    </div>

                    {/* Forma */}
                    <Field label="Forma de la mesa">
                        <select name="shape" value={form.shape} onChange={handleChange} className={inputClass()}>
                            <option value="CUADRADA">Cuadrada</option>
                            <option value="RECTANGULAR">Rectangular</option>
                            <option value="CIRCULAR">Circular</option>
                            <option value="OVAL">Oval</option>
                        </select>
                    </Field>

                    {/* Descripción */}
                    <Field label="Descripción">
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Descripción opcional de la mesa…"
                            rows={2}
                            className={`${inputClass()} resize-y`}
                        />
                    </Field>

                    {/* Notas internas */}
                    <Field label="Notas internas">
                        <textarea
                            name="internalNotes"
                            value={form.internalNotes}
                            onChange={handleChange}
                            placeholder="Notas para el equipo (no visibles al cliente)…"
                            rows={2}
                            className={`${inputClass()} resize-y`}
                        />
                    </Field>

                    {/* Características */}
                    <div>
                        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
                            Características
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { name: "isAccessible",  label: "♿ Accesible" },
                                { name: "hasView",       label: "🌅 Con vista" },
                                { name: "isQuiet",       label: "🔇 Zona tranquila" },
                                { name: "hasPowerOutlet",label: "🔌 Enchufe" },
                                { name: "nearWindow",    label: "🪟 Cerca de ventana" },
                                { name: "nearKitchen",   label: "👨‍🍳 Cerca de cocina" },
                            ].map(({ name, label }) => (
                                <label key={name} className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name={name}
                                        checked={form.features[name]}
                                        onChange={handleFeatureChange}
                                        className="w-4 h-4 accent-orange-500 rounded"
                                    />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Imagen */}
                    <Field label="Imagen de la mesa">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden
                                cursor-pointer hover:border-orange-400 hover:bg-orange-50/40 transition-colors
                                min-h-[120px] flex items-center justify-center"
                        >
                            {imagePreview ? (
                                <img src={imagePreview} alt="Vista previa" className="w-full h-44 object-cover" />
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-gray-400 py-6 text-center">
                                    <span className="text-3xl">📷</span>
                                    <span className="text-sm">Haz clic para subir una imagen</span>
                                    <span className="text-xs text-gray-300">PNG, JPG, WEBP · máx 5 MB</span>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {imagePreview && (
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="mt-1.5 text-xs text-orange-500 hover:underline"
                            >
                                ✕ Borrar imagen
                            </button>
                        )}
                    </Field>

                    {/* Checkboxes finales */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="requiresReservation"
                                checked={form.requiresReservation}
                                onChange={handleChange}
                                className="w-4 h-4 accent-orange-500 rounded"
                            />
                            <span className="text-sm text-gray-700">Requiere reservación</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 accent-orange-500 rounded"
                            />
                            <span className="text-sm text-gray-700">Mesa activa</span>
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
                        >
                            {isEditing ? "Guardar cambios" : "Crear mesa"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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