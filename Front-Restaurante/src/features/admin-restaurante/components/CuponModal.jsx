import { useState, useEffect } from "react";
import { useCuponStore } from "../store/useCuponStore";

// Fecha local en formato datetime-local
const toLocalDatetimeInput = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d - offset).toISOString().slice(0, 16);
};

const today = () => toLocalDatetimeInput(new Date().toISOString());

const emptyForm = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  maxDiscount: "",
  minPurchaseAmount: "0",
  validFrom: today(),
  validUntil: "",
  usageLimit: "",
  usageLimitPerUser: "1",
  newUsersOnly: false,
  isActive: true,
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
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const restaurantId = tokenData?.restaurantId || "";

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
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-50 bg-stone-50/50">
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              {isEditing ? "Editar Cupón" : "Crear Nuevo Cupón"}
            </h2>
            <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-1">Configuración de Descuento</p>
          </div>
          <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-400 hover:text-red-500 transition-colors shadow-sm">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Código */}
            <Field label="Código Único" error={errors.code} required>
              <input
                name="code"
                value={form.code}
                onChange={handleChange}
                placeholder="EJ: VERANO2025"
                className={inputClass(errors.code)}
                style={{ textTransform: "uppercase" }}
                disabled={isEditing && selectedCoupon?.usedCount > 0}
              />
            </Field>

            {/* Tipo de Descuento */}
            <Field label="Tipo" required>
              <select name="discountType" value={form.discountType} onChange={handleChange} className={inputClass()}>
                <option value="PERCENTAGE">Porcentaje (%)</option>
                <option value="FIXED">Monto Fijo (Q)</option>
              </select>
            </Field>
          </div>

          {/* Descripción */}
          <Field label="Descripción de la oferta" error={errors.description} required>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="¿Qué incluye este cupón?"
              rows={2}
              className={`${inputClass(errors.description)} resize-none`}
            />
          </Field>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <Field label="Valor" error={errors.discountValue} required>
              <input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} placeholder="0.00" className={inputClass(errors.discountValue)} />
            </Field>

            <Field label="Compra Mín." hint="Q">
              <input name="minPurchaseAmount" type="number" value={form.minPurchaseAmount} onChange={handleChange} className={inputClass()} />
            </Field>

            {form.discountType === "PERCENTAGE" && (
              <Field label="Tope Máx." hint="Q">
                <input name="maxDiscount" type="number" value={form.maxDiscount} onChange={handleChange} placeholder="Ilimitado" className={inputClass()} />
              </Field>
            )}
          </div>

          <div className="p-6 bg-stone-50 rounded-[2rem] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Inicia el" error={errors.validFrom} required>
                <input name="validFrom" type="datetime-local" value={form.validFrom} onChange={handleChange} className={inputClass(errors.validFrom)} />
              </Field>
              <Field label="Expira el" error={errors.validUntil} required>
                <input name="validUntil" type="datetime-local" value={form.validUntil} onChange={handleChange} className={inputClass(errors.validUntil)} />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-stone-200/50">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" name="newUsersOnly" checked={form.newUsersOnly} onChange={handleChange} className="w-5 h-5 rounded-lg accent-orange-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-stone-700">Solo nuevos</span>
                    <span className="text-[10px] text-stone-400 font-bold uppercase">Primera compra</span>
                  </div>
               </label>

               <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-5 h-5 rounded-lg accent-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-stone-700">Estado Activo</span>
                    <span className="text-[10px] text-stone-400 font-bold uppercase">Visible en app</span>
                  </div>
               </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-8 py-4 rounded-2xl text-stone-400 font-bold hover:text-stone-600 hover:bg-stone-100 transition-all text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-10 py-4 rounded-2xl bg-stone-900 text-white font-black text-sm shadow-xl shadow-stone-200 hover:bg-orange-500 hover:shadow-orange-200 transition-all active:scale-95"
            >
              {isEditing ? "Guardar Cambios" : "Activar Cupón"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function Field({ label, children, error, hint, required }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.1em]">
          {label} {required && <span className="text-orange-500">*</span>}
        </label>
        {hint && <span className="text-[10px] font-bold text-stone-300">{hint}</span>}
      </div>
      {children}
      {error && <p className="text-[10px] font-bold text-red-500 ml-1">✕ {error}</p>}
    </div>
  );
}

const inputClass = (error) =>
  `w-full px-5 py-3.5 rounded-2xl border-2 text-sm font-bold outline-none transition-all
   ${error 
     ? "border-red-100 bg-red-50 text-red-900 focus:border-red-200" 
     : "border-stone-100 bg-stone-50 text-stone-700 focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50"}`;