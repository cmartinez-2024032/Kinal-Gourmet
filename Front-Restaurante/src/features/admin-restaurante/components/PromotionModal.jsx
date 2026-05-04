import { useState, useEffect } from "react";
import { UsePromotionStore } from "../store/UsePromotionStore";

const promotionTypes = [
  { value: "DESCUENTO_PORCENTAJE", label: "Porcentaje %" },
  { value: "DESCUENTO_FIJO", label: "Monto fijo" },
  { value: "2X1", label: "2x1" },
  { value: "COMBO", label: "Combo" },
  { value: "ENVIO_GRATIS", label: "Envío gratis" },
  { value: "REGALO", label: "Regalo" },
  { value: "HAPPY_HOUR", label: "Happy Hour" }
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
        discountValue:
          promotion.discountPercentage ??
          promotion.discountAmount ??
          "",
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
      title: form.title,
      description: form.description,
      type: form.type,
      startDate: new Date(form.startDate),
      endDate: new Date(form.endDate),
      isActive: form.isActive,
      restaurant: "69f911e74e89fe715645be87",
    };

    // 🔥 SOLO aplica según tipo
    if (form.type === "DESCUENTO_PORCENTAJE") {
      dataToSend.discountPercentage = value;
    }

    if (form.type === "DESCUENTO_FIJO") {
      dataToSend.discountAmount = value;
    }

    console.log("DATA TO SEND:", dataToSend);

    try {
      if (promotion) {
        await updatePromotion(promotion._id, dataToSend);
      } else {
        await createPromotion(dataToSend);
      }

      onClose();
    } catch (error) {
      console.log("ERROR SUBMIT:", error);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>

        <div style={header}>
          <h3>{promotion ? "Editar promoción" : "Nueva promoción"}</h3>
          <button onClick={onClose} style={closeBtn}>✖</button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>

          <div style={field}>
            <label>Título</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          <div style={field}>
            <label>Tipo</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              style={input}
            >
              {promotionTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div style={field}>
            <label>Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              style={textarea}
            />
          </div>

          {form.type !== "2X1" && form.type !== "ENVIO_GRATIS" && (
            <div style={field}>
              <label>Descuento</label>
              <input
                type="number"
                name="discountValue"
                value={form.discountValue}
                onChange={handleChange}
                style={input}
              />
            </div>
          )}

          <div style={row}>
            <div style={field}>
              <label>Inicio</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                style={input}
              />
            </div>

            <div style={field}>
              <label>Fin</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                style={input}
              />
            </div>
          </div>

          <div style={field}>
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
              />
              Activa
            </label>
          </div>

          <div style={actions}>
            <button type="button" onClick={onClose} style={btnCancel}>
              Cancelar
            </button>

            <button type="submit" style={btnSave}>
              Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const overlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" };
const modal = { background: "white", borderRadius: "16px", padding: "25px", width: "600px" };
const header = { display: "flex", justifyContent: "space-between", marginBottom: "20px" };
const closeBtn = { border: "none", background: "transparent", fontSize: "18px", cursor: "pointer" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const row = { display: "flex", gap: "10px" };
const field = { display: "flex", flexDirection: "column", flex: 1 };
const input = { padding: "10px", borderRadius: "8px", border: "1px solid #ccc" };
const textarea = { padding: "10px", borderRadius: "8px", border: "1px solid #ccc", minHeight: "80px" };
const actions = { display: "flex", justifyContent: "flex-end", gap: "10px" };
const btnSave = { background: "#ff6b00", color: "white", border: "none", padding: "10px 15px", borderRadius: "8px" };
const btnCancel = { background: "#ccc", border: "none", padding: "10px 15px", borderRadius: "8px" };

export default PromotionModal;  