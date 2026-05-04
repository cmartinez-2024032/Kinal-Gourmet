import { useEffect, useState } from "react";
import { usePromotionStore } from "../store/UsePromotionStore";

export const PromotionModal = () => {
  const {
    isModalOpen,
    selectedPromo,
    closeModal,
    createPromotion,
    updatePromotion,
  } = usePromotionStore();

  const [form, setForm] = useState({
    name: "",
    description: "",
    discount: "",
  });

  useEffect(() => {
    if (selectedPromo) {
      setForm(selectedPromo);
    } else {
      setForm({ name: "", description: "", discount: "" });
    }
  }, [selectedPromo]);

  if (!isModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedPromo) {
      await updatePromotion(selectedPromo._id, form);
    } else {
      await createPromotion(form);
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-80">
        <h2 className="font-bold mb-4">
          {selectedPromo ? "Editar" : "Crear"} Promoción
        </h2>

        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mb-3 border px-3 py-2 rounded"
        />

        <input
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mb-3 border px-3 py-2 rounded"
        />

        <input
          type="number"
          placeholder="Descuento %"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
          className="w-full mb-4 border px-3 py-2 rounded"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={closeModal}>
            Cancelar
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};