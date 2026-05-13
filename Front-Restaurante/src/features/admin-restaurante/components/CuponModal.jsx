import { useState, useEffect } from "react";
import { useCuponStore } from "../store/useCuponStore";

const toLocalDatetimeInput = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d - offset).toISOString().slice(0, 16);
};

const today = () => toLocalDatetimeInput(new Date().toISOString());

const emptyForm = {
  code: "", description: "", discountType: "PERCENTAGE",
  discountValue: "", maxDiscount: "", minPurchaseAmount: "0",
  validFrom: today(), validUntil: "", usageLimit: "",
  usageLimitPerUser: "1", newUsersOnly: false, isActive: true,
};

export const CuponModal = () => {
  const { isModalOpen, selectedCoupon, closeModal, createCoupon, updateCoupon } = useCuponStore();
  const isEditing = !!selectedCoupon;
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isModalOpen) return;
    if (selectedCoupon) {
      setForm({
        code: selectedCoupon.code || "",
        description: selectedCoupon.description || "",
        discountType: selectedCoupon.discountType || "PERCENTAGE",
        discountValue: selectedCoupon.discountValue ?? "",
        maxDiscount: selectedCoupon.maxDiscount ?? "",
        minPurchaseAmount: selectedCoupon.minPurchaseAmount ?? "0",
        validFrom: toLocalDatetimeInput(selectedCoupon.validFrom),
        validUntil: toLocalDatetimeInput(selectedCoupon.validUntil),
        usageLimit: selectedCoupon.usageLimit ?? "",
        usageLimitPerUser: selectedCoupon.usageLimitPerUser ?? "1",
        newUsersOnly: selectedCoupon.newUsersOnly ?? false,
        isActive: selectedCoupon.isActive ?? true,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [isModalOpen, selectedCoupon]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.code.trim()) errs.code = "El código es requerido.";
    if (!form.description.trim()) errs.description = "La descripción es requerida.";
    if (form.discountValue === "" || Number(form.discountValue) < 0) errs.discountValue = "Valor inválido.";
    if (!form.validUntil) errs.validUntil = "Fecha requerida.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    const token = localStorage.getItem("token");
    const restaurantId = JSON.parse(atob(token.split(".")[1]))?.restaurantId || "";
    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      discountValue: Number(form.discountValue),
      minPurchaseAmount: Number(form.minPurchaseAmount),
      validFrom: new Date(form.validFrom).toISOString(),
      validUntil: new Date(form.validUntil).toISOString(),
      applicableRestaurants: [restaurantId],
    };

    try {
      if (isEditing) await updateCoupon(selectedCoupon._id, payload);
      else await createCoupon(payload);
      closeModal();
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 overflow-y-auto">
      <div
        className="bg-white border border-stone-100 rounded-2xl w-full max-w-2xl shadow-2xl my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100 bg-stone-50">
          <div>
            <h2 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'Syne, sans-serif' }}>
              {isEditing ? "Editar Cupón" : "Crear Cupón"}
            </h2>
            <p className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest mt-0.5">
              Configuración de Descuento
            </p>
          </div>
          <button
            onClick={closeModal}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-stone-200
              text-stone-400 hover:text-red-500 hover:border-red-200 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Código Único" error={errors.code} required>
              <input
                name="code" value={form.code} onChange={handleChange}
                placeholder="EJ: VERANO2025" className={inputClass(errors.code)}
                style={{ textTransform: "uppercase" }}
                disabled={isEditing && selectedCoupon?.usedCount > 0}
              />
            </Field>
            <Field label="Tipo de descuento" required>
              <select name="discountType" value={form.discountType} onChange={handleChange} className={inputClass()}>
                <option value="PERCENTAGE">Porcentaje (%)</option>
                <option value="FIXED">Monto Fijo (Q)</option>
              </select>
            </Field>
          </div>

          <Field label="Descripción" error={errors.description} required>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              placeholder="¿Qué incluye este cupón?" rows={2}
              className={`${inputClass(errors.description)} resize-none`}
            />
          </Field>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Field label="Valor" error={errors.discountValue} required>
              <input name="discountValue" type="number" value={form.discountValue}
                onChange={handleChange} placeholder="0.00" className={inputClass(errors.discountValue)} />
            </Field>
            <Field label="Compra mínima (Q)">
              <input name="minPurchaseAmount" type="number" value={form.minPurchaseAmount}
                onChange={handleChange} className={inputClass()} />
            </Field>
            {form.discountType === "PERCENTAGE" && (
              <Field label="Descuento máx. (Q)">
                <input name="maxDiscount" type="number" value={form.maxDiscount}
                  onChange={handleChange} placeholder="Ilimitado" className={inputClass()} />
              </Field>
            )}
          </div>

          {/* Fechas y opciones */}
          <div className="bg-stone-50 border border-stone-100 rounded-xl p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Inicia el" error={errors.validFrom} required>
                <input name="validFrom" type="datetime-local" value={form.validFrom}
                  onChange={handleChange} className={inputClass(errors.validFrom)} />
              </Field>
              <Field label="Expira el" error={errors.validUntil} required>
                <input name="validUntil" type="datetime-local" value={form.validUntil}
                  onChange={handleChange} className={inputClass(errors.validUntil)} />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-stone-200">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-stone-100 transition-colors">
                <input type="checkbox" name="newUsersOnly" checked={form.newUsersOnly}
                  onChange={handleChange} className="w-4 h-4 rounded accent-orange-500" />
                <div>
                  <p className="text-sm font-semibold text-stone-700">Solo nuevos usuarios</p>
                  <p className="text-[10px] text-stone-400">Primera compra únicamente</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-stone-100 transition-colors">
                <input type="checkbox" name="isActive" checked={form.isActive}
                  onChange={handleChange} className="w-4 h-4 rounded accent-emerald-500" />
                <div>
                  <p className="text-sm font-semibold text-stone-700">Cupón activo</p>
                  <p className="text-[10px] text-stone-400">Visible en la app</p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-stone-100">
            <button
              type="button" onClick={closeModal}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-stone-400
                hover:bg-stone-100 hover:text-stone-600 border border-transparent hover:border-stone-200 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white
                font-bold text-sm transition-all hover:-translate-y-0.5 shadow-md shadow-orange-200"
            >
              {isEditing ? "Guardar cambios" : "Activar cupón"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children, error, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
    {error && <p className="text-[10px] font-semibold text-red-500">✕ {error}</p>}
  </div>
);

const inputClass = (error) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all
   bg-white text-stone-700 placeholder-stone-300 focus:ring-2 focus:ring-orange-100
   ${error
     ? "border-red-200 bg-red-50 text-red-700"
     : "border-stone-200 focus:border-orange-400"}`;