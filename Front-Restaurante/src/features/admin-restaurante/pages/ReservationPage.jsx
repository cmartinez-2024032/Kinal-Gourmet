import { useEffect, useState } from "react";
import { useReservationStore } from "../store/useReservationStore";
import { ReservationCard } from "../components/ReservationCard";

const TABS = ["Todas", "PENDIENTE", "CONFIRMADA", "CANCELADA", "COMPLETADA"];

const TAB_COLOR = {
    PENDIENTE: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10",
    CONFIRMADA: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10",
    CANCELADA: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/10",
    COMPLETADA: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/10",
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
        <div className="w-full min-h-screen text-[#F2EDE8] relative overflow-x-hidden p-6 md:p-8 bg-[#0F0E0D]">
            
            {/* Cinematic Background Glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-700/5 blur-[100px]" />
            </div>

            <div className="max-w-[1700px] mx-auto">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-orange-500 to-orange-700 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
                            <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                                Reservaciones
                            </h1>
                        </div>
                        <p className="text-sm font-medium text-[#A09890] pl-6">
                            <span className="text-white font-bold">{reservations.length}</span> en total ·{" "}
                            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                                {countBy("CONFIRMADA")} confirmadas
                            </span>
                            {" · "}
                            <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                                {countBy("PENDIENTE")} pendientes
                            </span>
                        </p>
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    {[
                        { label: "Pendientes", count: countBy("PENDIENTE"), color: "from-amber-500/20 to-amber-500/5", border: "border-amber-500/30", icon: "⏳", text: "text-amber-400" },
                        { label: "Confirmadas", count: countBy("CONFIRMADA"), color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30", icon: "✅", text: "text-emerald-400" },
                        { label: "Completadas", count: countBy("COMPLETADA"), color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30", icon: "🎉", text: "text-blue-400" },
                        { label: "Canceladas", count: countBy("CANCELADA"), color: "from-red-500/20 to-red-500/5", border: "border-red-500/30", icon: "✕", text: "text-red-400" },
                    ].map((s) => (
                        <div key={s.label} className={`bg-white/[0.03] backdrop-blur-xl border ${s.border} rounded-[32px] p-6 group relative overflow-hidden transition-all duration-500`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            <div className="flex items-center gap-4 relative z-10">
                                <span className="text-3xl filter drop-shadow-md">{s.icon}</span>
                                <div>
                                    <p className={`text-3xl font-black ${s.text}`} style={{ fontFamily: 'Syne, sans-serif' }}>{s.count}</p>
                                    <p className="text-[10px] text-[#A09890] font-black uppercase tracking-[0.2em]">{s.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ERROR BANNER */}
                {error && (
                    <div className="mb-8 bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-2xl px-6 py-4 text-sm text-red-200 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                        <span className="flex items-center gap-3 font-semibold">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">!</span> 
                            {error}
                        </span>
                    </div>
                )}

                {/* TABS / TOOLBAR */}
                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-4 mb-10 shadow-2xl flex gap-3 flex-wrap relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                    {TABS.map((tab) => {
                        const count = tab === "Todas" ? reservations.length : countBy(tab);
                        const isActive = activeTab === tab;

                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 border ${
                                    isActive
                                        ? tab === "Todas"
                                            ? "bg-white text-black border-white shadow-lg scale-105"
                                            : `${TAB_COLOR[tab]} shadow-lg scale-105`
                                        : "bg-white/5 border-white/5 text-[#A09890] hover:border-white/20 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                {tab === "Todas" ? "Todas" : tab.charAt(0) + tab.slice(1).toLowerCase()}
                                <span className="ml-2 opacity-60">({count})</span>
                            </button>
                        );
                    })}
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="flex flex-col items-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-white/5 border-t-orange-500 rounded-full animate-spin" />
                        <p className="text-xs font-black text-[#6B6560] tracking-widest uppercase animate-pulse">Sincronizando Reservas</p>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && filtered.length === 0 && (
                    <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[40px] py-32 text-center backdrop-blur-sm">
                        <span className="text-6xl block mb-6 filter grayscale opacity-40">🗓️</span>
                        <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Agenda libre</h3>
                        <p className="text-[#6B6560] font-medium">No se encontraron reservaciones en esta categoría.</p>
                    </div>
                )}

                {/* GRID OF CARDS */}
                {!loading && filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
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

                {/* DELETE MODAL */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[2000] p-6 animate-in fade-in duration-300">
                        <div className="bg-[#1C1A17] border border-white/10 rounded-[40px] p-10 max-w-sm w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-8 mx-auto border border-red-500/20">
                                <span className="text-4xl">🗑️</span>
                            </div>
                            <h2 className="text-2xl font-black text-white mb-4 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>
                                ¿Eliminar registro?
                            </h2>
                            <p className="text-[#A09890] mb-10 text-center font-medium leading-relaxed">
                                Esta reservación se borrará permanentemente del sistema. No podrás recuperar los datos.
                            </p>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 rounded-2xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                                    Cerrar
                                </button>
                                <button
                                    onClick={async () => {
                                        await deleteReservation(deleteConfirm);
                                        setDeleteConfirm(null);
                                    }}
                                    className="flex-1 py-4 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 active:scale-95"
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