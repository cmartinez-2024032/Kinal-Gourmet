import { useState, useEffect, useRef } from "react";
import { usePlatilloStore } from "../store/usePlatilloStore";

const emptyForm = {
  name: "", description: "", price: "", type: "PLATO_FUERTE",
  category: "NINGUNA", ingredients: "", preparationTime: "15",
  spicyLevel: "NINGUNO", isAvailable: true,
};

export const PlatilloModal = () => {
  const { isModalOpen, selectedDish, closeModal, createDish, updateDish } = usePlatilloStore();
  const isEditing = !!selectedDish;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isModalOpen) return;
    if (selectedDish) {
      setForm({
        name: selectedDish.name || "",
        description: selectedDish.description || "",
        price: parseFloat(selectedDish.price?.$numberDecimal ?? selectedDish.price ?? 0),
        type: selectedDish.type || "PLATO_FUERTE",
        category: selectedDish.category || "NINGUNA",
        ingredients: Array.isArray(selectedDish.ingredients)
          ? selectedDish.ingredients.join(", ")
          : selectedDish.ingredients || "",
        preparationTime: selectedDish.preparationTime || "15",
        spicyLevel: selectedDish.spicyLevel || "NINGUNO",
        isAvailable: selectedDish.isAvailable ?? true,
      });
      setImagePreview(selectedDish.image || "");
    } else {
      setForm(emptyForm);
      setImagePreview("");
    }
    setImageFile(null);
    setErrors({});
  }, [isModalOpen, selectedDish]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Requerido";
    if (!form.description.trim()) errs.description = "Requerido";
    if (!form.price || isNaN(form.price)) errs.price = "Inválido";
    if (!form.ingredients.trim()) errs.ingredients = "Mín. 1 ingrediente";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    const token = localStorage.getItem("token");
    const restaurantId = JSON.parse(atob(token.split(".")[1]))?.restaurantId || "";
    const payload = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "ingredients") {
        const arr = form.ingredients.split(",").map((i) => i.trim()).filter(Boolean);
        arr.forEach((ing) => payload.append("ingredients[]", ing));
      } else {
        payload.append(key, form[key]);
      }
    });
    payload.append("restaurant", restaurantId);
    if (imageFile) payload.append("image", imageFile);

    try {
      if (isEditing) await updateDish(selectedDish._id, payload);
      else await createDish(payload);
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

        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 relative z-10">
          <div>
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              {isEditing ? "Editar Platillo" : "Nuevo Platillo"}
            </h2>
            <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em] mt-1">
              {isEditing ? `ID: ${selectedDish._id.slice(-6)}` : "Configuración del Menú"}
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Field label="Nombre del Platillo" error={errors.name} required>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="Ej. Lasaña de Carne" className={inputClass(errors.name)} />
              </Field>
            </div>
            <Field label="Precio (Q)" error={errors.price} required>
              <input name="price" type="number" step="0.01" value={form.price}
                onChange={handleChange} placeholder="0.00" className={inputClass(errors.price)} />
            </Field>
          </div>

          <Field label="Descripción" error={errors.description} required>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Describe los sabores, texturas y detalles únicos..."
              className={`${inputClass(errors.description)} resize-none`} />
          </Field>

          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="Tipo">
              <select name="type" value={form.type} onChange={handleChange} className={inputClass()}>
                <option className="bg-[#1C1A17] text-white" value="ENTRADA">Entrada</option>
                <option className="bg-[#1C1A17] text-white" value="PLATO_FUERTE">Plato fuerte</option>
                <option className="bg-[#1C1A17] text-white" value="POSTRE">Postre</option>
                <option className="bg-[#1C1A17] text-white" value="BEBIDA">Bebida</option>
              </select>
            </Field>
            <Field label="Categoría">
              <select name="category" value={form.category} onChange={handleChange} className={inputClass()}>
                <option className="bg-[#1C1A17] text-white" value="NINGUNA">Ninguna</option>
                <option className="bg-[#1C1A17] text-white" value="VEGETARIANO">Vegetariano</option>
                <option className="bg-[#1C1A17] text-white" value="VEGANO">Vegano</option>
                <option className="bg-[#1C1A17] text-white" value="SIN_GLUTEN">Sin gluten</option>
                <option className="bg-[#1C1A17] text-white" value="PICANTE">Picante</option>
              </select>
            </Field>
            <Field label="Nivel Picante">
              <select name="spicyLevel" value={form.spicyLevel} onChange={handleChange} className={inputClass()}>
                <option className="bg-[#1C1A17] text-white" value="NINGUNO">Ninguno</option>
                <option className="bg-[#1C1A17] text-white" value="SUAVE">Suave 🌶️</option>
                <option className="bg-[#1C1A17] text-white" value="MEDIO">Medio 🌶️🌶️</option>
                <option className="bg-[#1C1A17] text-white" value="PICANTE">Picante 🌶️🌶️🌶️</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Field label="Ingredientes (separados por coma)" error={errors.ingredients} required>
                <input name="ingredients" value={form.ingredients} onChange={handleChange}
                  placeholder="Sal, pimienta, ajo..." className={inputClass(errors.ingredients)} />
              </Field>
            </div>
            <Field label="Tiempo (min)">
              <input name="preparationTime" type="number" value={form.preparationTime}
                onChange={handleChange} className={inputClass()} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-40 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center
                justify-center gap-3 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all cursor-pointer
                overflow-hidden relative group"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="preview" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm">
                    <span className="text-white text-[10px] font-black uppercase tracking-widest bg-orange-600 px-4 py-2 rounded-full">Cambiar imagen</span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <span className="text-3xl block mb-2 opacity-50">🖼️</span>
                  <span className="text-[10px] font-black text-[#6B6560] uppercase tracking-widest">Subir Fotografía</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            <div className="flex flex-col justify-center">
              <label className="group flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-orange-500/30 transition-all duration-300">
                <div>
                  <p className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">Estado de Venta</p>
                  <p className="text-[11px] text-[#A09890] mt-1 font-medium">Visible en el menú público</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox" name="isAvailable" checked={form.isAvailable}
                    onChange={handleChange} className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
            <button
              type="button" onClick={closeModal}
              className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#6B6560]
                hover:text-white transition-all"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="px-10 py-4 rounded-2xl bg-white text-black hover:bg-orange-500 hover:text-white
                font-black text-xs uppercase tracking-widest transition-all hover:-translate-y-1 shadow-xl hover:shadow-orange-500/20 active:scale-95"
            >
              {isEditing ? "Guardar Cambios" : "Crear Platillo"}
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
   placeholder-[#6B6560] focus:ring-4 focus:ring-orange-500/5 appearance-none
   ${error
     ? "border-red-500/30 bg-red-500/5 text-red-400"
     : "border-white/5 focus:border-orange-500/30 focus:bg-[#25221F]"}`;  