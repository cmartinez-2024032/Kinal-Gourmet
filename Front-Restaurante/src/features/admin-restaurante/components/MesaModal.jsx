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
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-50 bg-stone-50/50">
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              {isEditing ? "Editar Mesa" : "Nueva Mesa"}
            </h2>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Gestión de distribución</p>
          </div>
          <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-400 hover:text-red-500 transition-colors shadow-sm">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Mesa #" error={errors.number} required>
              <input name="number" value={form.number} onChange={handleChange} placeholder="A1" className={inputClass(errors.number)} />
            </Field>
            <Field label="Cap. Máx" required>
              <input name="capacity" type="number" value={form.capacity} onChange={handleChange} className={inputClass()} />
            </Field>
            <Field label="Cap. Mín">
              <input name="minCapacity" type="number" value={form.minCapacity} onChange={handleChange} className={inputClass()} />
            </Field>
            <Field label="Cargo Q">
              <input name="extraCharge" type="number" value={form.extraCharge} onChange={handleChange} className={inputClass()} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Ubicación">
              <select name="location" value={form.location} onChange={handleChange} className={inputClass()}>
                <option value="INTERIOR">Interior</option>
                <option value="TERRAZA">Terraza</option>
                <option value="VIP">VIP</option>
                <option value="BAR">Bar</option>
              </select>
            </Field>
            <Field label="Estado">
              <select name="status" value={form.status} onChange={handleChange} className={inputClass()}>
                <option value="AVAILABLE">Disponible</option>
                <option value="OCCUPIED">Ocupada</option>
                <option value="MAINTENANCE">Mantenimiento</option>
              </select>
            </Field>
            <Field label="Forma">
              <select name="shape" value={form.shape} onChange={handleChange} className={inputClass()}>
                <option value="CUADRADA">Cuadrada</option>
                <option value="CIRCULAR">Circular</option>
                <option value="RECTANGULAR">Rectangular</option>
              </select>
            </Field>
          </div>

          {/* Características - Diseño de Tags */}
          <div className="p-6 bg-stone-50 rounded-[2rem]">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 px-1">Atributos de la Mesa</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: "isAccessible", label: "Accesible", icon: "♿" },
                { name: "hasView", label: "Vista", icon: "🌅" },
                { name: "isQuiet", label: "Silenciosa", icon: "🔇" },
                { name: "hasPowerOutlet", label: "Enchufe", icon: "🔌" },
                { name: "nearWindow", label: "Ventana", icon: "🪟" },
                { name: "nearKitchen", label: "Cocina", icon: "👨‍🍳" },
              ].map((feat) => (
                <label key={feat.name} className={`
                  flex items-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer
                  ${form.features[feat.name] ? "border-orange-500 bg-white shadow-sm" : "border-transparent bg-stone-100 text-stone-400"}
                `}>
                  <input type="checkbox" name={feat.name} checked={form.features[feat.name]} onChange={handleFeatureChange} className="hidden" />
                  <span className="text-base">{feat.icon}</span>
                  <span className="text-[11px] font-black uppercase tracking-tight">{feat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Imagen y Notas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="h-full min-h-[140px] rounded-[2rem] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-2 hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer overflow-hidden relative group"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <span className="text-white text-xs font-black uppercase">Cambiar Foto</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <span className="text-2xl mb-1 block">📸</span>
                  <span className="text-[10px] font-black text-stone-400 uppercase">Subir Imagen</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            <div className="space-y-4">
              <Field label="Notas Internas">
                <textarea name="internalNotes" value={form.internalNotes} onChange={handleChange} rows={3} className={`${inputClass()} resize-none`} placeholder="Solo staff..." />
              </Field>
              <div className="flex flex-col gap-3 pt-1">
                 <Toggle label="Requiere Reserva" name="requiresReservation" checked={form.requiresReservation} onChange={handleChange} />
                 <Toggle label="Mesa Activa" name="isActive" checked={form.isActive} onChange={handleChange} color="emerald" />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={closeModal} className="px-8 py-4 rounded-2xl text-stone-400 font-bold hover:bg-stone-100 transition-all text-sm">
              Cancelar
            </button>
            <button type="submit" className="px-10 py-4 rounded-2xl bg-stone-900 text-white font-black text-sm shadow-xl hover:bg-orange-500 transition-all active:scale-95">
              {isEditing ? "Guardar Cambios" : "Crear Mesa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children, error, required }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
    {error && <p className="text-[10px] font-bold text-red-500 ml-1">✕ {error}</p>}
  </div>
);

const Toggle = ({ label, name, checked, onChange, color = "orange" }) => (
  <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 cursor-pointer hover:bg-stone-100 transition-colors">
    <span className="text-[11px] font-black text-stone-600 uppercase tracking-tight">{label}</span>
    <input type="checkbox" name={name} checked={checked} onChange={onChange} className={`w-5 h-5 rounded-lg accent-${color}-500`} />
  </label>
);

const inputClass = (error) =>
  `w-full px-5 py-3.5 rounded-2xl border-2 text-sm font-bold outline-none transition-all
   ${error ? "border-red-100 bg-red-50 text-red-900" : "border-stone-100 bg-stone-50 text-stone-700 focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50"}`;