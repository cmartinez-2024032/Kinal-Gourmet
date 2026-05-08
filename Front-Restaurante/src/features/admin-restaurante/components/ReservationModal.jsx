import ReservationForm from "./ReservationForm";

const ReservationModal = ({
  open,
  onClose,
  reservation,
}) => {
  if (!open) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          {reservation
            ? "Editar Reservación"
            : "Nueva Reservación"}
        </h2>

        <ReservationForm
          reservation={reservation}
          onClose={onClose}
        />

        <button onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ReservationModal;