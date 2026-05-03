import { useState, useEffect } from "react";
import { useCuponStore } from "../store/UseCuponStore";

// Fecha local en formato datetime-local (YYYY-MM-DDTHH:mm)
const toLocalDatetimeInput = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return "";
    // Ajusta a la zona horaria local
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d - offset).toISOString().slice(0, 16);
};

const today = () => toLocalDatetimeInput(new Date().toISOString());

const emptyForm = {
    code:                "",
    description:         "",
    discountType:        "PERCENTAGE",
    discountValue:       "",
    maxDiscount:         "",
    minPurchaseAmount:   "0",
    validFrom:           today(),
    validUntil:          "",
    usageLimit:          "",
    usageLimitPerUser:   "1",
    newUsersOnly:        false,
    isActive:            true,
};

export const CuponModal = () => {
    const {
        isModalOpen, selectedCoupon,
        closeModal, createCoupon, updateCoupon,
    } = useCuponStore();

    const isEditing = !!selectedCoupon;

    const [form,   setForm]   = useState(emptyForm);
    const [errors, setErrors] = useState({});

    // ── Poblar form al abrir ──────────────────────────────────
    useEffect(() => {
        if (!isModalOpen) return;

        if (selectedCoupon) {
            setForm({
                code:               selectedCoupon.code               || "",
                description:        selectedCoupon.description        || "",
                discountType:       selectedCoupon.discountType       || "PERCENTAGE",
                discountValue:      selectedCoupon.discountValue      ?? "",
                maxDiscount:        selectedCoupon.maxDiscount        ?? "",
                minPurchaseAmount:  selectedCoupon.minPurchaseAmount  ?? "0",
                validFrom:          toLocalDatetimeInput(selectedCoupon.validFrom),
                validUntil:         toLocalDatetimeInput(selectedCoupon.validUntil),
                usageLimit:         selectedCoupon.usageLimit         ?? "",
                usageLimitPerUser:  selectedCoupon.usageLimitPerUser  ?? "1",
                newUsersOnly:       selectedCoupon.newUsersOnly       ?? false,
                isActive:           selectedCoupon.isActive           ?? true,
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
    }, [isModalOpen, selectedCoupon]);

    if (!isModalOpen) return null;

    // ── Handlers ──────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // ── Validación ────────────────────────────────────────────
    const validate = () => {
        const errs = {};
        if (!form.code.trim())
            errs.code = "El código es requerido.";
        else if (form.code.trim().length < 4)
            errs.code = "Mínimo 4 caracteres.";

        if (!form.description.trim())
            errs.description = "La descripción es requerida.";

        if (form.discountValue === "" || isNaN(form.discountValue) || Number(form.discountValue) < 0)
            errs.discountValue = "Ingresa un valor de descuento válido.";
        else if (form.discountType === "PERCENTAGE" && Number(form.discountValue) > 100)
            errs.discountValue = "El porcentaje no puede exceder 100.";

        if (!form.validFrom)
            errs.validFrom = "La fecha de inicio es requerida.";

        if (!form.validUntil)
            errs.validUntil = "La fecha de expiración es requerida.";
        else if (new Date(form.validUntil) <= new Date(form.validFrom))
            errs.validUntil = "Debe ser posterior a la fecha de inicio.";

        return errs;
    };

    // ── Submit ────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Obtener restaurantId del token
        const token     = localStorage.getItem("token");
        const tokenData = JSON.parse(atob(token.split(".")[1]));
        const restaurantId = tokenData?.restaurantId || "";

        const payload = {
            code:               form.code.trim().toUpperCase(),
            description:        form.description.trim(),
            discountType:       form.discountType,
            discountValue:      Number(form.discountValue),
            minPurchaseAmount:  Number(form.minPurchaseAmount) || 0,
            validFrom:          new Date(form.validFrom).toISOString(),
            validUntil:         new Date(form.validUntil).toISOString(),
            usageLimitPerUser:  Number(form.usageLimitPerUser) || 1,
            newUsersOnly:       form.newUsersOnly,
            isActive:           form.isActive,
            applicableRestaurants: [restaurantId],
        };

        // Opcionales solo si tienen valor
        if (form.maxDiscount !== "")
            payload.maxDiscount = Number(form.maxDiscount);
        if (form.usageLimit !== "")
            payload.usageLimit = Number(form.usageLimit);

        try {
            if (isEditing) {
                await updateCoupon(selectedCoupon._id, payload);
            } else {
                await createCoupon(payload);
            }
            closeModal();
        } catch {
            // El error queda en el store
        }
    };

    // ── Render ────────────────────────────────────────────────
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
                        {isEditing ? "Editar Cupón" : "Nuevo Cupón"}
                    </h2>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4" noValidate>

                    {/* Código */}
                    <Field label="Código del cupón" error={errors.code} required>
                        <input
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            placeholder="Ej. VERANO25"
                            className={inputClass(errors.code)}
                            style={{ textTransform: "uppercase" }}
                            disabled={isEditing && selectedCoupon?.usedCount > 0}
                        />
                        {isEditing && selectedCoupon?.usedCount > 0 && (
                            <p className="text-[11px] text-amber-500 mt-0.5">
                                ⚠ El código no se puede cambiar porque el cupón ya fue usado.
                            </p>
                        )}
                    </Field>

                    {/* Descripción */}
                    <Field label="Descripción" error={errors.description} required>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Ej. 25% de descuento en tu pedido de verano"
                            rows={2}
                            className={`${inputClass(errors.description)} resize-y`}
                        />
                    </Field>

                    {/* Tipo + Valor */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Tipo de descuento" required>
                            <select
                                name="discountType"
                                value={form.discountType}
                                onChange={handleChange}
                                className={inputClass()}
                            >
                                <option value="PERCENTAGE">Porcentaje (%)</option>
                                <option value="FIXED">Monto fijo (Q)</option>
                            </select>
                        </Field>

                        <Field
                            label={form.discountType === "PERCENTAGE" ? "Descuento (%)" : "Descuento (Q)"}
                            error={errors.discountValue}
                            required
                        >
                            <input
                                name="discountValue"
                                type="number"
                                min="0"
                                max={form.discountType === "PERCENTAGE" ? "100" : undefined}
                                step="0.01"
                                value={form.discountValue}
                                onChange={handleChange}
                                placeholder={form.discountType === "PERCENTAGE" ? "Ej. 25" : "Ej. 50.00"}
                                className={inputClass(errors.discountValue)}
                            />
                        </Field>
                    </div>

                    {/* Descuento máx + Monto mínimo */}
                    <div className="grid grid-cols-2 gap-4">
                        {form.discountType === "PERCENTAGE" && (
                            <Field label="Descuento máximo (Q)" hint="Opcional">
                                <input
                                    name="maxDiscount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.maxDiscount}
                                    onChange={handleChange}
                                    placeholder="Sin límite"
                                    className={inputClass()}
                                />
                            </Field>
                        )}

                        <Field label="Compra mínima (Q)">
                            <input
                                name="minPurchaseAmount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.minPurchaseAmount}
                                onChange={handleChange}
                                placeholder="0.00"
                                className={inputClass()}
                            />
                        </Field>
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Válido desde" error={errors.validFrom} required>
                            <input
                                name="validFrom"
                                type="datetime-local"
                                value={form.validFrom}
                                onChange={handleChange}
                                className={inputClass(errors.validFrom)}
                            />
                        </Field>

                        <Field label="Válido hasta" error={errors.validUntil} required>
                            <input
                                name="validUntil"
                                type="datetime-local"
                                value={form.validUntil}
                                onChange={handleChange}
                                className={inputClass(errors.validUntil)}
                            />
                        </Field>
                    </div>

                    {/* Límites de uso */}
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Límite total de usos" hint="Opcional — vacío = ilimitado">
                            <input
                                name="usageLimit"
                                type="number"
                                min="1"
                                step="1"
                                value={form.usageLimit}
                                onChange={handleChange}
                                placeholder="Ilimitado"
                                className={inputClass()}
                            />
                        </Field>

                        <Field label="Usos por usuario">
                            <input
                                name="usageLimitPerUser"
                                type="number"
                                min="1"
                                step="1"
                                value={form.usageLimitPerUser}
                                onChange={handleChange}
                                placeholder="1"
                                className={inputClass()}
                            />
                        </Field>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex flex-col gap-2 pt-1">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="newUsersOnly"
                                checked={form.newUsersOnly}
                                onChange={handleChange}
                                className="w-4 h-4 accent-orange-500"
                            />
                            <span className="text-sm text-gray-700">
                                Solo para nuevos usuarios
                            </span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 accent-orange-500"
                            />
                            <span className="text-sm text-gray-700">Cupón activo</span>
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-700
                                hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm
                                font-semibold hover:bg-orange-600 transition-colors"
                        >
                            {isEditing ? "Guardar cambios" : "Crear cupón"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

function Field({ label, children, error, hint, required }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {label}{" "}
                {required && <span className="text-orange-500">*</span>}
                {hint && <span className="normal-case text-gray-400 ml-1">· {hint}</span>}
            </label>
            {children}
            {error && <p className="text-xs text-orange-500">{error}</p>}
        </div>
    );
}

const inputClass = (error) =>
    `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors bg-white
    ${error ? "border-orange-500" : "border-gray-300 focus:border-orange-500"}`;