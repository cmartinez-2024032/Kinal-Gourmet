import { useEffect, useState } from "react";
import { useReservationStore } from "../store/UseReservationStore";
import ReservationModal from "../components/ReservationModal";


export const ReservationsPage = () => {
  const {
    reservations,
    getReservations,
    deleteReservation,
    confirmReservation,
    loading
  } = useReservationStore();

  const [openModal, setOpenModal]           = useState(false);
  const [selectedReservation, setSelected]  = useState(null);
  const [deleteConfirm, setDeleteConfirm]   = useState(null);
  

  useEffect(() => { getReservations(); }, []);

  const handleCreate = () => { setSelected(null); setOpenModal(true); };
  const handleEdit   = (r)  => { setSelected(r);    setOpenModal(true); };

  const statusStyle = (s) => ({
    CONFIRMADA: "bg-emerald-50 text-emerald-600 border-emerald-100",
    CANCELADA:  "bg-red-50 text-red-500 border-red-100",
  }[s] ?? "bg-yellow-50 text-yellow-600 border-yellow-100");

  return (
    <div className="w-full min-h-screen bg-[#FDFCFB] font-sans pb-10">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4 pt-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Reservaciones</h1>
          <p className="text-stone-400 text-sm mt-1">
            {reservations.length} reservaciones ·{" "}
            <span className="text-orange-500 font-semibold">
              {reservations.filter(r => r.status === "CONFIRMADA").length} confirmadas
            </span>
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600
            text-white text-sm font-bold rounded-2xl transition-all duration-200
            shadow-lg shadow-orange-500/20 hover:-translate-y-0.5 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nueva Reservación
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="py-24 text-center text-stone-400 font-bold">Cargando reservaciones...</div>
      )}

      {/* EMPTY */}
      {!loading && reservations.length === 0 && (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-stone-100 py-24 text-center">
          <p className="text-5xl mb-4">🗓️</p>
          <p className="text-stone-500 font-bold text-lg">Sin reservaciones registradas</p>
          <p className="text-stone-300 text-sm mt-1">Crea la primera reservación para tu restaurante.</p>
        </div>
      )}

      {/* CARDS GRID */}
      {!loading && reservations.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {reservations.map((r) => (
            <div
              key={r._id}
              className="group bg-white border border-stone-100 rounded-3xl p-6 shadow-sm
              hover:shadow-xl transition-all duration-300 flex flex-col gap-4"
            >

              {/* HEADER BADGES */}
              <div className="flex justify-between items-start">

                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                  ${r.status === "CONFIRMADA"
                    ? "bg-emerald-100 text-emerald-700"
                    : r.status === "CANCELADA"
                    ? "bg-red-100 text-red-600"
                    : "bg-amber-100 text-amber-700"
                  }`}
                >
                  ● {r.status || "PENDIENTE"}
                </span>

                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-600 border border-orange-100">
                  {r.numberOfGuests} personas
                </span>
              </div>

              {/* NOMBRE */}
              <div>
                <p className="text-xl font-extrabold text-stone-900">
                  {r.userInfo?.name || "Sin nombre"}
                </p>
                <p className="text-sm text-stone-500">
                  {r.userInfo?.email || "Sin correo"}
                </p>
              </div>

              {/* INFO GRID */}
              <div className="grid grid-cols-2 gap-3">

                <Info label="Mesa" value={`Mesa ${r.table?.number || "—"}`} />
                <Info label="Fecha" value={new Date(r.date).toLocaleDateString("es-GT")} />
                <Info label="Hora" value={r.time || "—"} />
                <Info label="Notas" value={r.specialRequests || "—"} />

              </div>

              {/* BOTONES */}
              <div className="flex gap-2 pt-2">

                <button
                  onClick={() => handleEdit(r)}
                  className="flex-1 py-3 rounded-2xl bg-stone-900 text-white font-semibold
                  hover:bg-orange-500 transition"
                >
                  Editar
                </button>

                {r.status === "PENDIENTE" && (
                  <button
                    onClick={() => confirmReservation(r._id)}
                    className="flex-1 py-3 rounded-2xl bg-emerald-50 text-emerald-700 font-semibold
                    border border-emerald-200 hover:bg-emerald-500 hover:text-white transition"
                  >
                    Confirmar
                  </button>
                )}

                <button
                  onClick={() => setDeleteConfirm(r._id)}
                  className="px-4 py-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
                >
                  🗑
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CREAR / EDITAR */}
      <ReservationModal
        open={openModal}
        onClose={() => { setOpenModal(false); getReservations(); }}
        reservation={selectedReservation}
      />

      {/* CONFIRMACIÓN ELIMINAR */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-[1100] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </div>
            <h3 className="font-black text-xl text-stone-900 mb-2">¿Eliminar reservación?</h3>
            <p className="text-sm text-stone-400 mb-8 leading-relaxed">
              Esta reservación será eliminada permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3.5 rounded-2xl border border-stone-200 text-sm text-stone-600 font-bold hover:bg-stone-50"
              >
                Volver
              </button>
              <button
                onClick={async () => { await deleteReservation(deleteConfirm); setDeleteConfirm(null); }}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Info = ({ label, value }) => (
  <div className="bg-stone-50 border border-stone-100 rounded-2xl p-3">
    <p className="text-[10px] font-bold text-stone-400 uppercase">
      {label}
    </p>
    <p className="text-sm font-semibold text-stone-800 truncate">
      {value}
    </p>
  </div>
);

// Componente auxiliar para detalles de la card
const Detail = ({ icon, label, value }) => (
  <div className="bg-stone-50 rounded-2xl px-3 py-2 border border-stone-100">
    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{icon} {label}</p>
    <p className="text-xs font-bold text-stone-700 mt-0.5 truncate">{value}</p>
  </div>
);