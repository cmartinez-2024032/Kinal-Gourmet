import { useState } from "react";
import { useReservationStore } from "../store/UseReservationStore";

const ReservationForm = ({
  reservation,
  onClose,
}) => {
  const {
    createReservation,
    updateReservation,
    getReservations,
  } = useReservationStore();

  const [formData, setFormData] = useState({
    name: reservation?.name || "",
    people: reservation?.people || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (reservation) {
      await updateReservation(
        reservation._id,
        formData
      );
    } else {
      await createReservation(formData);
    }

    await getReservations();
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nombre"
      />

      <input
        type="number"
        name="people"
        value={formData.people}
        onChange={handleChange}
        placeholder="Personas"
      />

      <button type="submit">
        {reservation ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
};

export default ReservationForm;