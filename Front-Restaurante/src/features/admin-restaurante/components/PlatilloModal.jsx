import { useState, useEffect, useRef } from "react";
import { usePlatilloStore } from "../store/UsePlatilloStore";

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
  const { isModalOpen, selectedDish, closeModal, createDish, updateDish } =
    usePlatilloStore();

  const isEditing = !!selectedDish;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isModalOpen) {
        if (selectedDish) {
        setForm({
            name: selectedDish.name || "",
            description: selectedDish.description || "",
            price: parseFloat(selectedDish.price?.$numberDecimal ?? selectedDish.price ?? 0),
            type: selectedDish.type || "",
            category: selectedDish.category || "",
            ingredients: Array.isArray(selectedDish.ingredients)
            ? selectedDish.ingredients.join(", ")
            : selectedDish.ingredients || "",
            preparationTime: selectedDish.preparationTime || "",
            spicyLevel: selectedDish.spicyLevel || "",
            isAvailable: selectedDish.isAvailable ?? true,
        });
        setImagePreview(selectedDish.image || "");
        } else {
        setForm(emptyForm);
        setImagePreview("");
        }
        setImageFile(null);
        setErrors({});
    }
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "El nombre es requerido.";
    if (!form.description.trim()) errs.description = "La descripción es requerida.";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0)
      errs.price = "Ingresa un precio válido.";
    if (!form.ingredients.trim()) errs.ingredients = "Ingresa al menos un ingrediente.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    //obtener el restaurantId del token
    const token = localStorage.getItem("token");
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    const restaurantId = tokenData?.restaurantId || "";

    const payload = new FormData();
    payload.append("name", form.name.trim());
    payload.append("description", form.description.trim());
    payload.append("price", parseFloat(form.price));
    payload.append("type", form.type);
    payload.append("category", form.category);
    payload.append("spicyLevel", form.spicyLevel);
    payload.append("preparationTime", parseInt(form.preparationTime));
    payload.append("isAvailable", form.isAvailable);
    payload.append("restaurant", restaurantId);

    // Ingredients como array separado por comas
    const ingredientsArray = form.ingredients
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
    ingredientsArray.forEach((ing) => payload.append("ingredients[]", ing));

    if (imageFile) payload.append("image", imageFile);

    try {
      if (isEditing) {
        await updateDish(selectedDish._id, payload);
      } else {
        await createDish(payload);
      }
      closeModal();
    } catch {

    }
  };

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
            {isEditing ? "Editar Platillo" : "Nuevo Platillo"}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4" noValidate>

          {/* Nombre */}
          <Field label="Nombre del platillo" error={errors.name} required>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej. Pizza artesanal"
              className={inputClass(errors.name)}
            />
          </Field>

          {/* Descripción */}
          <Field label="Descripción" error={errors.description} required>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe brevemente el platillo…"
              rows={3}
              className={`${inputClass(errors.description)} resize-y`}
            />
          </Field>

          {/* Precio + Tiempo preparación */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Precio (Q)" error={errors.price} required>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className={inputClass(errors.price)}
              />
            </Field>

            <Field label="Tiempo de preparación (min)">
              <input
                name="preparationTime"
                type="number"
                min="1"
                max="180"
                value={form.preparationTime}
                onChange={handleChange}
                placeholder="15"
                className={inputClass()}
              />
            </Field>
          </div>

          {/* Tipo + Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tipo" required>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass()}>
                <option value="ENTRADA">Entrada</option>
                <option value="PLATO_FUERTE">Plato fuerte</option>
                <option value="POSTRE">Postre</option>
                <option value="BEBIDA">Bebida</option>
                <option value="GUARNICION">Guarnición</option>
              </select>
            </Field>

            <Field label="Categoría">
              <select name="category" value={form.category} onChange={handleChange} className={inputClass()}>
                <option value="NINGUNA">Ninguna</option>
                <option value="VEGETARIANO">Vegetariano</option>
                <option value="VEGANO">Vegano</option>
                <option value="SIN_GLUTEN">Sin gluten</option>
                <option value="KETO">Keto</option>
                <option value="LIGHT">Light</option>
                <option value="PICANTE">Picante</option>
                <option value="INFANTIL">Infantil</option>
                <option value="PREMIUM">Premium</option>
                <option value="ESPECIAL_DEL_DIA">Especial del día</option>
              </select>
            </Field>
          </div>

          {/* Nivel de picante */}
          <Field label="Nivel de picante">
            <select name="spicyLevel" value={form.spicyLevel} onChange={handleChange} className={inputClass()}>
              <option value="NINGUNO">Ninguno</option>
              <option value="SUAVE">Suave</option>
              <option value="MEDIO">Medio</option>
              <option value="PICANTE">Picante</option>
              <option value="MUY_PICANTE">Muy picante</option>
            </select>
          </Field>

          {/* Ingredientes */}
          <Field label="Ingredientes (separados por coma)" error={errors.ingredients} required>
            <input
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
              placeholder="pollo, queso, masa, tomate…"
              className={inputClass(errors.ingredients)}
            />
          </Field>

          {/* Imagen */}
          <Field label="Imagen del platillo">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden
                cursor-pointer hover:border-orange-400 hover:bg-orange-50/40 transition-colors
                min-h-[120px] flex items-center justify-center"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Vista previa" className="w-full h-44 object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400 py-6 text-center">
                  <span className="text-3xl">📷</span>
                  <span className="text-sm">Haz clic para subir una imagen</span>
                  <span className="text-xs text-gray-300">PNG, JPG, WEBP · máx 5 MB</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="mt-1.5 text-xs text-orange-500 hover:underline"
              >
                ✕ Borrar Imagen
              </button>
            )}
          </Field>

          {/* Disponible */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
              className="w-4 h-4 accent-orange-500 rounded"
            />
            <span className="text-sm text-gray-700">Disponible en menú</span>
          </label>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              {isEditing ? "Guardar cambios" : "Crear platillo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, error, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-orange-500">{error}</p>}
    </div>
  );
}

const inputClass = (error) =>
  `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors bg-white
  ${error ? "border-orange-500" : "border-gray-300 focus:border-orange-500"}`;