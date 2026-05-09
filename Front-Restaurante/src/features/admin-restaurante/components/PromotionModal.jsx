import { useState, useEffect } from "react";
import { UsePromotionStore } from "../store/UsePromotionStore";

const promotionTypes = [
  { value: "DESCUENTO_PORCENTAJE", label: "Porcentaje %", icon: "📉" },
  { value: "DESCUENTO_FIJO", label: "Monto fijo", icon: "💰" },
  { value: "2X1", label: "2x1", icon: "👯" },
  { value: "COMBO", label: "Combo", icon: "🍔" },
  { value: "ENVIO_GRATIS", label: "Envío gratis", icon: "🛵" },
  { value: "REGALO", label: "Regalo", icon: "🎁" },
  { value: "HAPPY_HOUR", label: "Happy Hour", icon: "🍻" }
];

const PromotionModal = ({ onClose, promotion }) => {
  const { createPromotion, updatePromotion } = UsePromotionStore();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "DESCUENTO_PORCENTAJE",
    discountValue: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  useEffect(() => {
    if (promotion) {
      setForm({
        title: promotion.title || "",
        description: promotion.description || "",
        type: promotion.type || "DESCUENTO_PORCENTAJE",
        discountValue: promotion.discountPercentage ?? promotion.discountAmount ?? "",
        startDate: promotion.startDate?.slice(0, 10) || "",
        endDate: promotion.endDate?.slice(0, 10) || "",
        isActive: promotion.isActive ?? true,
      });
    }
  }, [promotion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = Number(form.discountValue);
    const dataToSend = {
      ...form,
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
      restaurant: "69f911e74e89fe715645be87", // ID Estático según tu código original
    };

    if (form.type === "DESCUENTO_PORCENTAJE") dataToSend.discountPercentage = value;
    if (form.type === "DESCUENTO_FIJO") dataToSend.discountAmount = value;

    try {
      if (promotion) await updatePromotion(promotion._id, dataToSend);
      else await createPromotion(dataToSend);
      onClose();
    } catch (error) {
      console.log("ERROR SUBMIT:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-50 bg-stone-50/50">
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              {promotion ? "Editar Promoción" : "Nueva Promoción"}
            </h2>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Campañas y Descuentos</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-400 hover:text-red-500 transition-colors shadow-sm">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <Field label="Título de la promoción" required>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="Ej. Black Friday" 
              className={inputClass()} 
              required 
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Tipo de Beneficio">
              <select name="type" value={form.type} onChange={handleChange} className={inputClass()}>
                {promotionTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                ))}
              </select>
            </Field>

            {form.type !== "2X1" && form.type !== "ENVIO_GRATIS" && (
              <Field label={form.type === "DESCUENTO_PORCENTAJE" ? "Porcentaje (%)" : "Monto (Q)"}>
                <input 
                  type="number" 
                  name="discountValue" 
                  value={form.discountValue} 
                  onChange={handleChange} 
                  placeholder="0" 
                  className={inputClass()} 
                />
              </Field>
            )}
          </div>

          <Field label="Descripción de la oferta">
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              rows={2} 
              className={`${inputClass()} resize-none`} 
              placeholder="Detalles de la promoción..." 
            />
          </Field>

          {/* Vigencia */}
          <div className="p-6 bg-stone-50 rounded-[2rem] grid grid-cols-2 gap-4 border border-stone-100">
            <Field label="Fecha Inicio">
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={inputClass()} />
            </Field>
            <Field label="Fecha Fin">
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className={inputClass()} />
            </Field>
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-3">
             <label className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 cursor-pointer hover:bg-stone-100 transition-colors border border-stone-100">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-stone-600 uppercase tracking-tight">Estado de Campaña</span>
                  <span className="text-[10px] text-stone-400 font-bold">Permitir aplicación del descuento</span>
                </div>
                <input 
                  type="checkbox" 
                  name="isActive" 
                  checked={form.isActive} 
                  onChange={handleChange} 
                  className="w-6 h-6 rounded-lg accent-orange-500" 
                />
              </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-8 py-4 rounded-2xl text-stone-400 font-bold hover:bg-stone-100 transition-all text-sm">
              Cancelar
            </button>
            <button type="submit" className="px-10 py-4 rounded-2xl bg-stone-900 text-white font-black text-sm shadow-xl hover:bg-orange-500 transition-all active:scale-95">
              {promotion ? "Actualizar" : "Crear Promoción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children, required }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
  </div>
);

const inputClass = () =>
  `w-full px-5 py-3 rounded-2xl border-2 border-stone-100 bg-stone-50 text-stone-700 text-sm font-bold outline-none transition-all focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50`;

export default PromotionModal;