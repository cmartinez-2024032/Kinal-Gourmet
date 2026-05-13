import { useEffect, useState } from "react";
import { useReservationClientStore } from "../store/useReservationClientStore";
import { ReservationModal, ReservationCard } from "../components/ReservationModal";

export const MyReservationsPage = () => {
    const {
        reservations, loading, error,
        isModalOpen, openModal, closeModal,
        fetchReservations, createReservation, cancelReservation,
        getStatusLabel, getStatusStyle, getStatusIcon,
        clearError,
    } = useReservationClientStore();

    const [filterStatus, setFilterStatus] = useState("TODAS");
    const [cancelConfirm, setCancelConfirm] = useState(null);

    useEffect(() => { fetchReservations(); }, []);

    const filtered = filterStatus === "TODAS"
        ? reservations
        : reservations.filter((r) => r.status === filterStatus);

    const handleCancel = async () => {
        if (!cancelConfirm) return;
        try { await cancelReservation(cancelConfirm); }
        finally { setCancelConfirm(null); }
    };

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="relative bg-zinc-950 text-white pt-24 pb-32 px-8 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1600"
                        className="w-full h-full object-cover"
                        alt="Hero Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                </div>

                <div className="max-w-[1400px] mx-auto relative z-10">
                    <div className="flex justify-between items-end flex-wrap gap-6">
                        <div>
                            <h1 className="text-6xl md:text-7xl font-[900] mb-6 tracking-tighter leading-none">
                                Mis <span className="text-orange-500 font-serif italic">Reservaciones</span>
                            </h1>
                            <p className="text-gray-300 text-xl max-w-xl font-medium leading-relaxed opacity-90">
                                Asegura tu lugar en los mejores puntos gastronómicos de la ciudad.
                            </p>
                        </div>
                        <button
                            onClick={openModal}
                            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-[900]
                                    rounded-2xl transition-all shadow-lg shadow-orange-500/20 hover:scale-105 uppercase text-xs tracking-widest"
                        >
                            + Nueva reservación
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-8 -mt-10 pb-20 relative z-20">
                {error && (
                    <div className="flex items-center justify-between bg-red-500 text-white rounded-2xl px-6 py-4 text-sm font-bold mb-6 shadow-xl animate-bounce">
                        <span>{error}</span>
                        <button onClick={clearError} className="hover:scale-125 transition-transform">✕</button>
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-xl shadow-black/5 p-4 border border-gray-100 flex gap-2 overflow-x-auto no-scrollbar mb-10">
                    {[
                        { value: "TODAS",     label: "Todas" },
                        { value: "PENDIENTE", label: "Pendientes" },
                        { value: "CONFIRMADA",label: "Confirmadas" },
                        { value: "COMPLETADA",label: "Completadas" },
                        { value: "CANCELADA", label: "Canceladas" },
                    ].map(({ value, label }) => (
                        <button
                            key={value}
                            onClick={() => setFilterStatus(value)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-[900] uppercase tracking-widest transition-all shrink-0 border-2
                                ${filterStatus === value
                                    ? "bg-black text-white shadow-lg shadow-black/20 border-black"
                                    : "bg-gray-50 text-gray-400 hover:bg-gray-100 border-transparent"}`}
                            style={{ minWidth: "max-content" }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-32 gap-4">
                        <div className="w-12 h-12 rounded-full border-[4px] border-gray-100 border-t-orange-500 animate-spin" />
                        <p className="font-black text-gray-400 uppercase tracking-tighter">Preparando tu agenda...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-200 py-32 text-center shadow-sm">
                        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-4xl">📅</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">No encontramos nada por aquí</h3>
                        <p className="text-gray-400 font-medium mb-8">
                            {filterStatus === "TODAS" ? "Parece que aún no has realizado ninguna reserva." : "No hay reservas con este estado."}
                        </p>
                        {filterStatus === "TODAS" && (
                            <button
                                onClick={openModal}
                                className="px-8 py-4 bg-black text-white font-[900] rounded-2xl hover:bg-orange-500 transition-all uppercase text-xs tracking-widest"
                            >
                                Hacer una reservación
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((res) => (
                            <ReservationCard
                                key={res._id}
                                reservation={res}
                                getStatusLabel={getStatusLabel}
                                getStatusStyle={getStatusStyle}
                                getStatusIcon={getStatusIcon}
                                onCancel={() => setCancelConfirm(res._id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <ReservationModal
                    onClose={closeModal}
                    onCreate={createReservation}
                    loading={loading}
                />
            )}

            {cancelConfirm && (
                <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[32px] px-8 py-8 w-full max-w-sm shadow-2xl border border-gray-100">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto text-2xl">⚠️</div>
                        <p className="text-xl font-black text-gray-900 mb-2 text-center">¿Cancelar reserva?</p>
                        <p className="text-sm text-gray-500 mb-8 text-center leading-relaxed">Esta acción liberará tu mesa y otros podrán tomarla.</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setCancelConfirm(null)}
                                className="px-4 py-3 rounded-xl border-2 border-gray-100 font-bold text-gray-400 hover:bg-gray-50 transition-all text-sm"
                            >
                                Mantener
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 text-sm disabled:opacity-50"
                            >
                                Sí, cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

