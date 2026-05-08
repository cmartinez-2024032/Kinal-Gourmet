import { useEffect, useState } from "react";
import { useReservationStore } from "../store/UseReservationStore";
import { ReservationCard } from "../components/ReservationCard";

const TABS = ["Todas", "PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];

const TAB_COLOR = {
    PENDIENTE:  "text-amber-600 bg-amber-50 border-amber-200",
    CONFIRMADA: "text-emerald-600 bg-emerald-50 border-emerald-200",
    CANCELADA:  "text-red-600 bg-red-50 border-red-200",
    COMPLETADA: "text-blue-600 bg-blue-50 border-blue-200",
};

export const ReservationsPage = () => {
    const { reservations, getReservations, deleteReservation, updateReservationStatus, loading, error } = useReservationStore();

    const [activeTab,     setActiveTab]     = useState("Todas");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => { getReservations(); }, []);

    const filtered = activeTab === "Todas"
        ? reservations
        : reservations.filter((r) => r.status === activeTab);

    const countBy = (s) => reservations.filter((r) => r.status === s).length;

    return (
        <div className="w-full min-h-screen bg-[#FDFCFB] pb-16">

            {/* HEADER */}
            <div className="flex items-start justify-between mb-8 flex-wrap gap-4 pt-4">
                <div>
                    <h1 className="text-3xl font-black text-stone-900 tracking-tight">Reservaciones</h1>
                    <p className="text-stone-400 text-sm mt-1">
                        {reservations.length} en total ·{" "}
                        <span className="text-emerald-500 font-semibold">{countBy("CONFIRMADA")} confirmadas</span>
                        {" · "}
                        <span className="text-amber-500 font-semibold">{countBy("PENDIENTE")} pendientes</span>
                    </p>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                    { label: "Pendientes",  count: countBy("PENDIENTE"),  bg: "bg-amber-50",   text: "text-amber-600",   icon: "⏳" },
                    { label: "Confirmadas", count: countBy("CONFIRMADA"), bg: "bg-emerald-50", text: "text-emerald-600", icon: "✅" },
                    { label: "Completadas", count: countBy("COMPLETADA"), bg: "bg-blue-50",    text: "text-blue-600",    icon: "🎉" },
                    { label: "Canceladas",  count: countBy("CANCELADA"),  bg: "bg-red-50",     text: "text-red-600",     icon: "✕" },
                ].map((s) => (
                    <div key={s.label} className={`${s.bg} rounded-2xl p-4 flex items-center gap-3`}>
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                            <p className={`text-2xl font-black ${s.text}`}>{s.count}</p>
                            <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ERROR */}
            {error && (
                <div className="mb-6 px-5 py-4 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-semibold flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* TABS */}
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

            {/* LOADING */}
            {loading && (
                <div className="flex items-center justify-center py-24 gap-3 text-stone-400">
                    <div className="w-5 h-5 rounded-full border-2 border-stone-200 border-t-orange-500 animate-spin" />
                    <span className="font-bold text-sm">Cargando reservaciones...</span>
                </div>
            )}

            {/* EMPTY */}
            {!loading && filtered.length === 0 && (
                <div className="bg-white rounded-[3rem] border-2 border-dashed border-stone-100 py-24 text-center">
                    <p className="text-5xl mb-4">🗓️</p>
                    <p className="text-stone-500 font-bold text-lg">Sin reservaciones</p>
                </div>
            )}

            {/* CARDS */}
            {!loading && filtered.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((r) => (
                        <ReservationCard
                            key={r._id}
                            reservation={r}
                            onStatusChange={(id, status) => updateReservationStatus(id, status)}
                            onDelete={(id) => setDeleteConfirm(id)}
                        />
                    ))}
                </div>
            )}

            {/* CONFIRM ELIMINAR */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-[1100] p-4">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5 mx-auto">
                            <span className="text-2xl">🗑️</span>
                        </div>
                        <h3 className="font-black text-xl text-stone-900 mb-2 text-center">¿Eliminar reservación?</h3>
                        <p className="text-sm text-stone-400 mb-8 leading-relaxed text-center">
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
                                onClick={async () => { await deleteReservation(deleteConfirm); setDeleteConfirm(null); }}
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