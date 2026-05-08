const ReservationTable = ({ reservations, onEdit }) => {
  return (
    <table className="w-full text-sm text-left">
      <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
        <tr>
          <th className="px-6 py-3">Cliente</th>
          <th className="px-6 py-3">Mesa</th>
          <th className="px-6 py-3">Fecha</th>
          <th className="px-6 py-3">Hora</th>
          <th className="px-6 py-3">Comensales</th>
          <th className="px-6 py-3">Estado</th>
          <th className="px-6 py-3">Acciones</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-100">
        {reservations.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
              No hay reservaciones registradas.
            </td>
          </tr>
        ) : (
          reservations.map((r) => (
            <tr key={r._id} className="hover:bg-gray-50 transition">

              <td className="px-6 py-4 font-medium text-gray-800">
                {r.userInfo?.name || "—"}
              </td>

              <td className="px-6 py-4 text-gray-600">
                {r.table?.number ? `Mesa ${r.table.number}` : "—"}
              </td>

              <td className="px-6 py-4 text-gray-600">
                {r.date ? new Date(r.date).toLocaleDateString("es-GT") : "—"}
              </td>

              <td className="px-6 py-4 text-gray-600">
                {r.time || "—"}
              </td>

              <td className="px-6 py-4 text-gray-600">
                {r.numberOfGuests ?? "—"}
              </td>

              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  r.status === "CONFIRMADA" ? "bg-green-100 text-green-700" :
                  r.status === "CANCELADA"  ? "bg-red-100 text-red-700"    :
                                              "bg-yellow-100 text-yellow-700"
                }`}>
                  {r.status || "PENDIENTE"}
                </span>
              </td>

              <td className="px-6 py-4">
                <button
                  onClick={() => onEdit(r)}
                  className="text-orange-500 hover:text-orange-700 font-medium transition"
                >
                  Editar
                </button>
              </td>

            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ReservationTable;