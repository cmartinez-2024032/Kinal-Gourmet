const STATUS_STYLE = {
  CONFIRMADA: "bg-emerald-100 text-emerald-700",
  CANCELADA:  "bg-red-100 text-red-600",
  COMPLETADA: "bg-blue-100 text-blue-700",
  PENDIENTE:  "bg-amber-100 text-amber-700",
};

const ReservationTable = ({ reservations = [], onEdit, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-sm">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-stone-50 border-b border-stone-100">
            {["Cliente", "Mesa", "Fecha", "Hora", "Comensales", "Estado", "Acciones"].map((h) => (
              <th
                key={h}
                className="px-5 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-stone-50">
          {reservations.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center">
                <p className="text-3xl mb-2">🗓️</p>
                <p className="text-stone-400 font-semibold text-sm">Sin reservaciones</p>
              </td>
            </tr>
          ) : (
            reservations.map((r) => (
              <tr
                key={r._id}
                className="hover:bg-orange-50/30 transition-colors duration-150 group"
              >
                {/* Cliente */}
                <td className="px-5 py-4">
                  <p className="font-bold text-stone-800 text-sm">
                    {r.userInfo?.name || "—"}
                  </p>
                  <p className="text-xs text-stone-400 truncate max-w-[140px]">
                    {r.userInfo?.email || ""}
                  </p>
                </td>

                {/* Mesa */}
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-600 font-bold text-xs">
                    {r.table?.number ? `Mesa ${r.table.number}` : "—"}
                  </span>
                </td>

                {/* Fecha */}
                <td className="px-5 py-4 text-stone-600 text-xs font-medium">
                  {r.date ? new Date(r.date).toLocaleDateString("es-GT") : "—"}
                </td>

                {/* Hora */}
                <td className="px-5 py-4 text-stone-600 text-xs font-medium">
                  {r.time || "—"}
                </td>

                {/* Comensales */}
                <td className="px-5 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full
                    bg-orange-50 text-orange-600 font-black text-xs">
                    {r.numberOfGuests ?? "—"}
                  </span>
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold
                    ${STATUS_STYLE[r.status] ?? STATUS_STYLE.PENDIENTE}`}>
                    {r.status || "PENDIENTE"}
                  </span>
                </td>

                {/* Acciones */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(r)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold
                        hover:bg-orange-500 transition-colors"
                    >
                      Editar
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(r._id)}
                        className="px-3 py-1.5 rounded-xl bg-red-50 text-red-500 text-xs font-bold
                          hover:bg-red-500 hover:text-white transition-colors"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;