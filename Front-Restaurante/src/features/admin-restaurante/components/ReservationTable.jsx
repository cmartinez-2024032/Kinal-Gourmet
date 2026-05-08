const ReservationTable = ({
  reservations,
  onEdit,
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Personas</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {reservations.map((reservation) => (
          <tr key={reservation._id}>
            <td>{reservation.name}</td>
            <td>{reservation.people}</td>

            <td>
              <button
                onClick={() => onEdit(reservation)}
              >
                Editar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReservationTable;