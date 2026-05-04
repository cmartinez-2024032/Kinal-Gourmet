import { useEffect, useState } from "react";
import { UsePromotionStore } from "../store/UsePromotionStore";
import PromotionModal from "../components/PromotionModal";

const PromotionPage = () => {
  const { promotions, getPromotions, deletePromotion } =
    UsePromotionStore();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getPromotions();
  }, []);

  const handleDelete = async (id) => {
    await deletePromotion(id);
    getPromotions();
  };

  const handleEdit = (promo) => {
    setSelected(promo);
    setOpen(true);
  };

  const handleCreate = () => {
    setSelected(null);
    setOpen(true);
  };

  return (
    <div style={{ padding: "30px", background: "#f7f7f7", minHeight: "100vh" }}>

      {/* HEADER */}
      <div style={header}>
        <div>
          <h2 style={{ margin: 0 }}>Promociones</h2>
          <span style={{ color: "gray" }}>
            {promotions.length} en total
          </span>
        </div>

        <button onClick={handleCreate} style={addBtn}>
          + Agregar promoción
        </button>
      </div>

      {/* CARDS */}
      <div style={grid}>
        {promotions.length === 0 ? (
          <p style={{ color: "gray", marginTop: "20px" }}>
            No hay promociones
          </p>
        ) : (
          promotions.map((p) => (
            <div key={p._id} style={card}>

              <div style={top}>
                <h3 style={title}>{p.title}</h3>

                <span style={badge}>{p.type}</span>
              </div>

              <p style={desc}>
                {p.description || "Sin descripción"}
              </p>

              <span style={p.isActive ? active : inactive}>
                {p.isActive ? "Activo" : "Inactivo"}
              </span>

              <div style={actions}>
                <button style={editBtn} onClick={() => handleEdit(p)}>
                  Editar
                </button>

                <button style={deleteBtn} onClick={() => handleDelete(p._id)}>
                  Eliminar
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {open && (
        <PromotionModal
          onClose={() => {
            setOpen(false);
            getPromotions();
          }}
          promotion={selected}
        />
      )}
    </div>
  );
};

export default PromotionPage;

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const addBtn = {
  background: "linear-gradient(135deg, #ff6b00, #ff8c00)",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "12px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 10px 25px rgba(255,107,0,0.3)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const card = {
  background: "white",
  borderRadius: "18px",
  padding: "16px",
  boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  transition: "0.2s",
};

const top = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const title = {
  fontSize: "16px",
  fontWeight: "bold",
};

const badge = {
  background: "#ff6b00",
  color: "white",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
};

const desc = {
  fontSize: "13px",
  color: "#666",
};

const active = {
  background: "#d1fae5",
  color: "#065f46",
  padding: "4px 10px",
  borderRadius: "10px",
  fontSize: "12px",
  width: "fit-content",
};

const inactive = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "4px 10px",
  borderRadius: "10px",
  fontSize: "12px",
  width: "fit-content",
};

const actions = {
  display: "flex",
  gap: "8px",
  marginTop: "10px",
};

const editBtn = {
  flex: 1,
  padding: "8px",
  border: "none",
  borderRadius: "8px",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
};

const deleteBtn = {
  flex: 1,
  padding: "8px",
  border: "none",
  borderRadius: "8px",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
};