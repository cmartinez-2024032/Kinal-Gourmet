import { useEffect, useState } from "react";
import { useReservationStore } from "../store/UseReservationStore";
import ReservationModal from "../components/ReservationModal";
import ReservationTable from "../components/ReservationTable";

const TABS = ["Todas", "PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];

const TAB_COLOR = {
  PENDIENTE:  "text-amber-600 bg-amber-50 border-amber-200",
  CONFIRMADA: "text-emerald-600 bg-emerald-50 border-emerald-200",
  CANCELADA:  "text-red-600 bg-red-50 border-red-200",
  COMPLETADA: "text-blue-600 bg-blue-50 border-blue-200",
};

export const ReservationsPage = () => {
  const {
    reservations,
    getReservations,
    deleteReservation,
    loading,
    error,
  } = useReservationStore();

  const [openModal,     setOpenModal]     = useState(false);
  const [selectedRes,   setSelectedRes]   = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab,     setActiveTab]     = useState("Todas");

  useEffect(() => { getReservations(); }, []);

  const handleCreate = () => { setSelectedRes(null); setOpenModal(true); };
  const handleEdit   = (r) => { setSelectedRes(r);   setOpenModal(true); };
  const handleClose  = () => { setOpenModal(false);  getReservations(); };

  const filtered = activeTab === "Todas"
    ? reservations
    : reservations.filter((r) => r.status === activeTab);

  const countBy = (s) => reservations.filter((r) => r.status === s).length;

  return (
    <div className="w-full min-h-screen bg-[#FDFCFB] pb-16">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4 pt-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Reservaciones</h1>
          <p className="text-stone-400 text-sm mt-1">
            {reservations.length} en total ·{" "}
            <span className="text-emerald-500 font-semibold">
              {countBy("CONFIRMADA")} confirmadas
            </span>
            {" · "}
            <span className="text-amber-500 font-semibold">
              {countBy("PENDIENTE")} pendientes
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

      {/* ── ERROR GLOBAL ── */}
      {error && (
        <div className="mb-6 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-semibold flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ── TABS ── */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((tab) => {
          const count = tab === "Todas" ? reservations.length : countBy(tab);
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all
                ${isActive
                  ? tab === "Todas"
                    ? "bg-stone-900 text-white border-stone-900"
                    : TAB_COLOR[tab] + " border"
                  : "bg-white text-stone-500 border-stone-200 hover:border-stone-400"
                }`}
            >
              {tab === "Todas" ? "Todas" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              <span className="ml-1.5 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* ── LOADING ── */}
      {loading && (
        <div className="flex items-center justify-center py-24 gap-3 text-stone-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          <span className="font-bold text-sm">Cargando reservaciones...</span>
        </div>
      )}

      {/* ── EMPTY ── */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-stone-100 py-24 text-center">
          <p className="text-5xl mb-4">🗓️</p>
          <p className="text-stone-500 font-bold text-lg">
            {activeTab === "Todas" ? "Sin reservaciones registradas" : `Sin reservaciones ${activeTab.toLowerCase()}s`}
          </p>
          <p className="text-stone-300 text-sm mt-1">
            {activeTab === "Todas" && "Crea la primera reservación para tu restaurante."}
          </p>
        </div>
      )}

      {/* ── TABLA ── */}
      {!loading && filtered.length > 0 && (
        <ReservationTable
          reservations={filtered}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteConfirm(id)}
        />
      )}

      {/* ── MODAL CREAR / EDITAR ── */}
      <ReservationModal
        open={openModal}
        onClose={handleClose}
        reservation={selectedRes}
      />

      {/* ── CONFIRM ELIMINAR ── */}
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
              Esta acción es permanente y no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3.5 rounded-2xl border border-stone-200 text-sm text-stone-600 font-bold hover:bg-stone-50 transition"
              >
                Volver
              </button>
              <button
                onClick={async () => {
                  await deleteReservation(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-200 transition"
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