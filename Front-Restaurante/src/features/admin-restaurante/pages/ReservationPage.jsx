import { useEffect, useState } from "react";
import { useReservationStore } from "../store/UseReservationStore";
import { ReservationCard } from "../components/ReservationCard";

const TABS = ["Todas", "PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];

const TAB_COLOR = {
    PENDIENTE: "text-amber-700 bg-amber-100 border-amber-300",
    CONFIRMADA: "text-emerald-700 bg-emerald-100 border-emerald-300",
    CANCELADA: "text-red-700 bg-red-100 border-red-300",
    COMPLETADA: "text-blue-700 bg-blue-100 border-blue-300",
};

export const ReservationsPage = () => {
    const {
        reservations,
        getReservations,
        deleteReservation,
        updateReservationStatus,
        loading,
        error
    } = useReservationStore();

    const [activeTab, setActiveTab] = useState("Todas");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        getReservations();
    }, []);

    const filtered =
        activeTab === "Todas"
            ? reservations
            : reservations.filter((r) => r.status === activeTab);

    const countBy = (s) =>
        reservations.filter((r) => r.status === s).length;

    return (
        <div className="w-full min-h-screen bg-[#f5f3f0] pb-16 px-3">

            <div className="max-w-[1700px] mx-auto">

                {/* HEADER */}
                <div className="flex items-start justify-between mb-8 flex-wrap gap-4 pt-4">
                    <div>
                        <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                            Reservaciones
                        </h1>

                        <p className="text-stone-700 text-sm mt-1 font-bold">
                            {reservations.length} en total ·{" "}

                            <span className="text-emerald-700 font-black">
                                {countBy("CONFIRMADA")} confirmadas
                            </span>

                            {" · "}

                            <span className="text-amber-700 font-black">
                                {countBy("PENDIENTE")} pendientes
                            </span>
                        </p>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            label: "Pendientes",
                            count: countBy("PENDIENTE"),
                            bg: "bg-amber-100",
                            text: "text-amber-700",
                            icon: "⏳"
                        },
                        {
                            label: "Confirmadas",
                            count: countBy("CONFIRMADA"),
                            bg: "bg-emerald-100",
                            text: "text-emerald-700",
                            icon: "✅"
                        },
                        {
                            label: "Completadas",
                            count: countBy("COMPLETADA"),
                            bg: "bg-blue-100",
                            text: "text-blue-700",
                            icon: "🎉"
                        },
                        {
                            label: "Canceladas",
                            count: countBy("CANCELADA"),
                            bg: "bg-red-100",
                            text: "text-red-700",
                            icon: "✕"
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className={`${s.bg} rounded-3xl p-5 flex items-center gap-4 border border-white/60 shadow-sm`}
                        >
                            <span className="text-3xl">
                                {s.icon}
                            </span>

                            <div>
                                <p className={`text-3xl font-black ${s.text}`}>
                                    {s.count}
                                </p>

                                <p className="text-xs font-black text-stone-700 uppercase tracking-wider">
                                    {s.label}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 px-5 py-4 bg-red-100 border border-red-200 rounded-2xl text-sm text-red-700 font-black flex items-center gap-2">
                        <span>⚠️</span>
                        {error}
                    </div>
                )}

                {/* TABS */}
                <div className="flex gap-3 mb-8 flex-wrap">
                    {TABS.map((tab) => {
                        const count =
                            tab === "Todas"
                                ? reservations.length
                                : countBy(tab);

                        const isActive = activeTab === tab;

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 rounded-2xl text-xs font-black border transition-all duration-200
                                    ${
                                        isActive
                                            ? tab === "Todas"
                                                ? "bg-stone-900 text-white border-stone-900 shadow-lg"
                                                : TAB_COLOR[tab] + " shadow-md"
                                            : "bg-white text-stone-700 border-stone-300 hover:border-stone-500 hover:text-stone-900"
                                    }`}
                            >
                                {tab === "Todas"
                                    ? "Todas"
                                    : tab.charAt(0) + tab.slice(1).toLowerCase()}

                                <span className="ml-1.5 opacity-100 font-black">
                                    ({count})
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="flex items-center justify-center py-24 gap-3">
                        <div className="w-5 h-5 rounded-full border-2 border-stone-300 border-t-orange-600 animate-spin" />

                        <span className="font-black text-sm text-stone-800">
                            Cargando reservaciones...
                        </span>
                    </div>
                )}

                {/* EMPTY */}
                {!loading && filtered.length === 0 && (
                    <div className="bg-white rounded-[3rem] border-2 border-dashed border-stone-200 py-24 text-center shadow-sm">
                        <p className="text-5xl mb-4">
                            🗓️
                        </p>

                        <p className="text-stone-700 font-black text-lg">
                            Sin reservaciones
                        </p>
                    </div>
                )}

                {/* CARDS */}
                {!loading && filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                        {filtered.map((r) => (
                            <ReservationCard
                                key={r._id}
                                reservation={r}
                                onStatusChange={(id, status) =>
                                    updateReservationStatus(id, status)
                                }
                                onDelete={(id) =>
                                    setDeleteConfirm(id)
                                }
                            />
                        ))}
                    </div>
                )}

                {/* MODAL ELIMINAR */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-[1100] p-4">
                        <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl">

                            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-5 mx-auto">
                                <span className="text-2xl">
                                    🗑️
                                </span>
                            </div>

                            <h3 className="font-black text-xl text-stone-900 mb-2 text-center">
                                ¿Eliminar reservación?
                            </h3>

                            <p className="text-sm text-stone-600 mb-8 leading-relaxed text-center font-semibold">
                                Esta acción es permanente y no se puede deshacer.
                            </p>

                            <div className="flex gap-3">

                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-3.5 rounded-2xl border border-stone-300 text-sm text-stone-700 font-black hover:bg-stone-100 transition"
                                >
                                    Volver
                                </button>

                                <button
                                    onClick={async () => {
                                        await deleteReservation(deleteConfirm);
                                        setDeleteConfirm(null);
                                    }}
                                    className="flex-1 py-3.5 rounded-2xl bg-red-500 hover:bg-red-600 text-white text-sm font-black shadow-lg shadow-red-300 transition"
                                >
                                    Eliminar
                                </button>

                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};