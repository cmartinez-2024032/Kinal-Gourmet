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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 overflow-y-auto">
      <div
        className="bg-[#181714] border border-[#33302B] rounded-2xl w-full max-w-2xl shadow-2xl my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#33302B] bg-[#1C1A17]">
          <div>
            <h2 className="text-lg font-bold text-[#F2EDE8]" style={{ fontFamily: 'Syne, sans-serif' }}>
              {isEditing ? "Editar Platillo" : "Nuevo Platillo"}
            </h2>
            <p className="text-[10px] text-[#6B6560] font-semibold uppercase tracking-widest mt-0.5">
              Configuración del Menú
            </p>
          </div>
          <button
            onClick={closeModal}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#211F1C] border border-[#33302B]
              text-[#6B6560] hover:text-red-400 hover:border-red-500/30 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">

          {/* Nombre y Precio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
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
              rows={2} placeholder="Describe los sabores..."
              className={`${inputClass(errors.description)} resize-none`} />
          </Field>

          {/* Clasificación */}
          <div className="bg-[#211F1C] border border-[#33302B] rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <input name="ingredients" value={form.ingredients} onChange={handleChange}
                  placeholder="Sal, pimienta, ajo..." className={inputClass(errors.ingredients)} />
              </Field>
            </div>
            <Field label="Tiempo (min)">
              <input name="preparationTime" type="number" value={form.preparationTime}
                onChange={handleChange} className={inputClass()} />
            </Field>
          </div>

          {/* Imagen y Disponibilidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="h-32 rounded-xl border-2 border-dashed border-[#33302B] flex flex-col items-center
                justify-center gap-2 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all cursor-pointer
                overflow-hidden relative group"
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Cambiar imagen</span>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <span className="text-2xl block mb-1">🖼️</span>
                  <span className="text-[10px] font-bold text-[#6B6560] uppercase tracking-wider">Subir foto</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center justify-between p-4 rounded-xl bg-[#211F1C] border border-[#33302B] cursor-pointer hover:border-orange-500/30 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[#F2EDE8]">Disponible</p>
                  <p className="text-xs text-[#6B6560] mt-0.5">Mostrar en el menú</p>
                </div>
                <input
                  type="checkbox" name="isAvailable" checked={form.isAvailable}
                  onChange={handleChange} className="w-5 h-5 rounded accent-orange-500"
                />
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-[#33302B]">
            <button
              type="button" onClick={closeModal}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#A09890]
                hover:bg-[#211F1C] border border-transparent hover:border-[#33302B] transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white
                font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-orange-500/20"
            >
              {isEditing ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, children, error, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-bold text-[#6B6560] uppercase tracking-widest">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    {children}
    {error && <p className="text-[10px] font-semibold text-red-400">✕ {error}</p>}
  </div>
);

const inputClass = (error) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all bg-[#211F1C] text-[#F2EDE8]
   placeholder-[#6B6560] focus:ring-2 focus:ring-orange-500/10
   ${error
     ? "border-red-500/30 bg-red-500/5 text-red-400"
     : "border-[#33302B] focus:border-orange-500/40"}`;