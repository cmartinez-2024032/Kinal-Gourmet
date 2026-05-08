import { useEffect, useState } from "react";
import { useReservationStore } from "../store/UseReservationStore";
import ReservationTable from "../components/ReservationTable";
import ReservationModal from "../components/ReservationModal";

export const ReservationsPage = () => {
  const { reservations, getReservations } =
    useReservationStore();

  const [openModal, setOpenModal] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState(null);

  useEffect(() => {
    getReservations();
  }, []);

  const handleCreate = () => {
    setSelectedReservation(null);
    setOpenModal(true);
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setOpenModal(true);
  };

  return (
    <div>
      <button onClick={handleCreate}>
        Nueva reservación
      </button>

      <ReservationTable
        reservations={reservations}
        onEdit={handleEdit}
      />

      <ReservationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        reservation={selectedReservation}
      />
    </div>
  );
};
