import { useState, useEffect } from "react";
import { UsePromotionStore } from "../store/usePromotionStore";

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
      restaurant: "69f911e74e89fe715645be87", 
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[2000] p-4 animate-in fade-in duration-300 overflow-y-auto">
      <div 
        className="bg-[#1C1A17] border border-white/10 rounded-[40px] w-full max-w-xl shadow-[0_0_100px_rgba(0,0,0,0.5)] my-auto relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/10 blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              {promotion ? "Editar Promoción" : "Nueva Promoción"}
            </h2>
            <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] mt-1">Campañas y Ofertas</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#6B6560] hover:text-white hover:bg-red-500 transition-all duration-300 shadow-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
          
          <Field label="Título de la promoción" required>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="Ej. Black Friday Especial" 
              className={inputClass()} 
              required 
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Tipo de Beneficio">
              <select name="type" value={form.type} onChange={handleChange} className={inputClass()}>
                {promotionTypes.map((t) => (
                  <option key={t.value} value={t.value} className="bg-[#1C1A17]">
                    {t.icon} {t.label}
                  </option>
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
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 grid grid-cols-2 gap-6">
            <Field label="Fecha Inicio">
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={inputClass()} />
            </Field>
            <Field label="Fecha Fin">
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className={inputClass()} />
            </Field>
          </div>

          {/* Estado */}
          <div>
            <label className="group flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-orange-500/30 transition-all duration-300">
              <div className="flex flex-col">
                <span className="text-sm font-black text-white group-hover:text-orange-400 transition-colors uppercase tracking-tight">Estado de Campaña</span>
                <span className="text-[10px] text-[#A09890] font-medium mt-1">Permitir aplicación del descuento</span>
              </div>
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="isActive" 
                  checked={form.isActive} 
                  onChange={handleChange} 
                  className="sr-only peer" 
                />
                <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 shadow-inner"></div>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#6B6560] hover:text-white transition-all"
            >
              Cerrar
            </button>
            <button 
              type="submit" 
              className="px-10 py-4 rounded-2xl bg-white text-black hover:bg-orange-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 shadow-xl hover:shadow-orange-500/20 active:scale-95"
            >
              {promotion ? "Guardar Cambios" : "Lanzar Campaña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children, required }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-[#6B6560] uppercase tracking-[0.15em] ml-1">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
  </div>
);

const inputClass = () =>
  `w-full px-5 py-4 rounded-2xl border border-white/5 bg-[#1C1A17] text-white text-sm font-medium outline-none transition-all focus:border-orange-500/30 focus:bg-[#25221F] focus:ring-4 focus:ring-orange-500/5 appearance-none`;

export default PromotionModal;