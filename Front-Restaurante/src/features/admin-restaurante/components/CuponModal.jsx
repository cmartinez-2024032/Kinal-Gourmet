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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-300 overflow-y-auto">
      <div
        className="bg-[#1C1A17] border border-white/10 rounded-[40px] w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.5)] my-auto overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              {isEditing ? "Editar Cupón" : "Nuevo Cupón"}
            </h2>
            <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] mt-1">
              Configuración de Descuento
            </p>
          </div>
          <button
            onClick={closeModal}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10
              text-[#6B6560] hover:text-white hover:bg-red-500 transition-all duration-300"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <option className="bg-[#1C1A17]" value="PERCENTAGE">Porcentaje (%)</option>
                <option className="bg-[#1C1A17]" value="FIXED">Monto Fijo (Q)</option>
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

          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Inicia el" error={errors.validFrom} required>
              <input name="validFrom" type="datetime-local" value={form.validFrom}
                onChange={handleChange} className={inputClass(errors.validFrom)} />
            </Field>
            <Field label="Expira el" error={errors.validUntil} required>
              <input name="validUntil" type="datetime-local" value={form.validUntil}
                onChange={handleChange} className={inputClass(errors.validUntil)} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="group flex items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-orange-500/30 transition-all duration-300">
              <div className="flex items-center gap-4">
                <input type="checkbox" name="newUsersOnly" checked={form.newUsersOnly}
                  onChange={handleChange} className="w-5 h-5 rounded accent-orange-600 bg-transparent border-white/10" />
                <div>
                  <p className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">Solo nuevos</p>
                  <p className="text-[10px] text-[#A09890] font-medium tracking-tight">Primera compra únicamente</p>
                </div>
              </div>
            </label>

            <label className="group flex items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-emerald-500/30 transition-all duration-300">
              <div className="flex items-center gap-4">
                <input type="checkbox" name="isActive" checked={form.isActive}
                  onChange={handleChange} className="w-5 h-5 rounded accent-emerald-500 bg-transparent border-white/10" />
                <div>
                  <p className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">Cupón activo</p>
                  <p className="text-[10px] text-[#A09890] font-medium tracking-tight">Visible en la aplicación</p>
                </div>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
            <button
              type="button" onClick={closeModal}
              className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#6B6560]
                hover:text-white transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-10 py-4 rounded-2xl bg-white text-black hover:bg-orange-500 hover:text-white
                font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 shadow-xl hover:shadow-orange-500/20 active:scale-95"
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
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-[#6B6560] uppercase tracking-[0.15em] ml-1">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
    {error && <p className="text-[10px] font-bold text-red-500 animate-pulse ml-1">✕ {error}</p>}
  </div>
);

const inputClass = (error) =>
  `w-full px-5 py-4 rounded-2xl border text-sm font-medium outline-none transition-all bg-[#1C1A17] text-white
   placeholder-[#6B6560] focus:ring-4 focus:ring-orange-500/5
   ${error
     ? "border-red-500/30 bg-red-500/5 text-red-400"
     : "border-white/5 focus:border-orange-500/30 focus:bg-[#25221F]"}`;