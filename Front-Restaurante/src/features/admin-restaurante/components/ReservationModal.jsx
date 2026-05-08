import ReservationForm from "./ReservationForm";

const ReservationModal = ({ open, onClose, reservation }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4 overflow-y-auto">
      <div
        className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl border border-stone-100 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone-50 bg-stone-50/50">
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              {reservation ? "Editar Reservación" : "Nueva Reservación"}
            </h2>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">
              Gestión de Mesas
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-stone-200 text-stone-400 hover:text-red-500 transition-colors shadow-sm"
          >
            ✕
          </button>
        </div>

        <ReservationForm reservation={reservation} onClose={onClose} />
      </div>
    </div>
  );
};

export default ReservationModal;