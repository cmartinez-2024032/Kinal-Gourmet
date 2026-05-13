import { useState, useEffect, useRef } from "react";
import { usePlatilloStore } from "../store/usePlatilloStore";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  type: "PLATO_FUERTE",
  category: "NINGUNA",
  ingredients: "",
  preparationTime: "15",
  spicyLevel: "NINGUNO",
  isAvailable: true,
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
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl border border-stone-100 animate-in zoom-in-95 duration-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-50 bg-stone-50/50">
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              {isEditing ? "Editar Platillo" : "Nuevo Platillo"}
            </h2>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Configuración del Menú</p>
          </div>
          <button onClick={closeModal} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-400 hover:text-red-500 transition-colors shadow-sm">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Nombre y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Field label="Nombre del Platillo" error={errors.name} required>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Ej. Lasaña de Carne" className={inputClass(errors.name)} />
              </Field>
            </div>
            <Field label="Precio (Q)" error={errors.price} required>
              <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" className={inputClass(errors.price)} />
            </Field>
          </div>

          <Field label="Descripción Corta" error={errors.description} required>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={`${inputClass(errors.description)} resize-none`} placeholder="Describe los sabores..." />
          </Field>

          {/* Clasificación */}
          <div className="p-6 bg-stone-50 rounded-[2rem] grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Tipo">
              <select name="type" value={form.type} onChange={handleChange} className={inputClass()}>
                <option value="ENTRADA">Entrada</option>
                <option value="PLATO_FUERTE">Plato fuerte</option>
                <option value="POSTRE">Postre</option>
                <option value="BEBIDA">Bebida</option>
              </select>
            </Field>
            <Field label="Categoría">
              <select name="category" value={form.category} onChange={handleChange} className={inputClass()}>
                <option value="NINGUNA">Ninguna</option>
                <option value="VEGETARIANO">Vegetariano</option>
                <option value="VEGANO">Vegano</option>
                <option value="SIN_GLUTEN">Sin gluten</option>
                <option value="PICANTE">Picante</option>
              </select>
            </Field>
            <Field label="Nivel Picante">
              <select name="spicyLevel" value={form.spicyLevel} onChange={handleChange} className={inputClass()}>
                <option value="NINGUNO">Ninguno</option>
                <option value="SUAVE">Suave 🌶️</option>
                <option value="MEDIO">Medio 🌶️🌶️</option>
                <option value="PICANTE">Picante 🌶️🌶️🌶️</option>
              </select>
            </Field>
          </div>

          {/* Ingredientes y Tiempo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <Field label="Ingredientes (separados por coma)" error={errors.ingredients} required>
                <input name="ingredients" value={form.ingredients} onChange={handleChange} placeholder="Sal, pimienta, ajo..." className={inputClass(errors.ingredients)} />
              </Field>
            </div>
            <Field label="Tiempo (min)">
              <input name="preparationTime" type="number" value={form.preparationTime} onChange={handleChange} className={inputClass()} />
            </Field>
          </div>

          {/* Imagen y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="h-32 rounded-[2rem] border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-2 hover:border-orange-400 hover:bg-orange-50/30 transition-all cursor-pointer overflow-hidden relative group"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <span className="text-white text-[10px] font-black uppercase">Cambiar Imagen</span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <span className="text-2xl mb-1 block">🖼️</span>
                  <span className="text-[10px] font-black text-stone-400 uppercase">Subir Foto</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 cursor-pointer hover:bg-stone-100 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-stone-600 uppercase tracking-tight">Disponibilidad</span>
                  <span className="text-[10px] text-stone-400 font-bold">Mostrar en el menú</span>
                </div>
                <input 
                  type="checkbox" 
                  name="isAvailable" 
                  checked={form.isAvailable} 
                  onChange={handleChange} 
                  className="w-6 h-6 rounded-lg accent-orange-500" 
                />
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={closeModal} className="px-8 py-4 rounded-2xl text-stone-400 font-bold hover:bg-stone-100 transition-all text-sm">
              Cancelar
            </button>
            <button type="submit" className="px-10 py-4 rounded-2xl bg-stone-900 text-white font-black text-sm shadow-xl hover:bg-orange-500 transition-all active:scale-95">
              {isEditing ? "Actualizar Plato" : "Guardar Platillo"}
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

const inputClass = (error) =>
  `w-full px-5 py-3 rounded-2xl border-2 text-sm font-bold outline-none transition-all
   ${error ? "border-red-100 bg-red-50 text-red-900" : "border-stone-100 bg-stone-50 text-stone-700 focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-50"}`;