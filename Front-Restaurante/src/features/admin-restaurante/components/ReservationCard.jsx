import { useState } from "react";

const STATUS_OPTIONS = [
    { value: "PENDIENTE",  label: "Pendiente",  bg: "bg-amber-500/20",  text: "text-amber-400",  border: "border-amber-500/30", icon: "⏳" },
    { value: "CONFIRMADA", label: "Confirmada", bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30", icon: "✅" },
    { value: "CANCELADA",  label: "Cancelada",  bg: "bg-rose-500/20",    text: "text-rose-400",    border: "border-rose-500/30",    icon: "✕" },
    { value: "COMPLETADA", label: "Completada", bg: "bg-sky-500/20",     text: "text-sky-400",     border: "border-sky-500/30",     icon: "🎉" },
];

const formatTime = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":").map(Number);
    const period = h < 12 ? "AM" : "PM";
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

export const ReservationCard = ({ reservation: r, onStatusChange, onDelete }) => {
    const [changing, setChanging] = useState(false);

    const current = STATUS_OPTIONS.find((s) => s.value === r.status) ?? STATUS_OPTIONS[0];

    const date = new Date(r.date).toLocaleDateString("es-GT", {
        weekday: "long", day: "numeric", month: "long"
    });

    const handleStatus = async (newStatus) => {
        if (newStatus === r.status) return;
        setChanging(true);
        await onStatusChange(r._id, newStatus);
        setChanging(false);
    };

    return (
        <div className="group relative bg-white/[0.04] border border-white/5 rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:border-white/20 hover:-translate-y-2">
            
            {/* Header Imagen con Glassmorphism */}
            <div className="relative h-48 bg-[#1C1A17] overflow-hidden m-3 rounded-[24px]">
                {r.table?.image ? (
                    <img
                        src={r.table.image}
                        alt={`Mesa ${r.table.number}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-amber-900/20 flex items-center justify-center">
                        <span className="text-6xl opacity-10">🍽️</span>
                    </div>
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0E0D] via-transparent to-transparent opacity-90" />
                
                {/* Badge mesa superior */}
                <div className="absolute top-4 right-4">
                    <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl shadow-xl">
                        🪑 {r.table?.number ? `Mesa ${r.table.number}` : "Por asignar"}
                    </span>
                </div>

                {/* Cliente Info sobre la imagen */}
                <div className="absolute bottom-4 left-5 right-5">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Reserva para</p>
                    <h3 className="font-black text-xl text-white leading-tight truncate" style={{ fontFamily: 'Syne, sans-serif' }}>
                        {r.userInfo?.name ?? "Cliente Invitado"}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] text-white/60 font-medium truncate">{r.userInfo?.email ?? "Sin correo"}</span>
                    </div>
                </div>
            </div>

            {/* Detalles de la reserva */}
            <div className="px-7 pb-7 pt-2 flex flex-col flex-1">
                
                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
                        <p className="text-[9px] font-black text-[#6B6560] uppercase tracking-widest mb-1">Fecha y Hora</p>
                        <p className="text-[11px] font-bold text-white leading-tight">
                            {date} <br/>
                            <span className="text-orange-400">{formatTime(r.time)}</span>
                        </p>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col justify-center">
                        <p className="text-[9px] font-black text-[#6B6560] uppercase tracking-widest mb-1">Comensales</p>
                        <p className="text-lg font-black text-white leading-none">
                            <span className="text-sm mr-1">👥</span>{r.numberOfGuests}
                        </p>
                    </div>
                </div>

                {/* Nota Especial Glass Card */}
                {r.specialRequests && (
                    <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 mb-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/40" />
                        <div className="flex items-start gap-3">
                            <span className="text-lg">📌</span>
                            <div>
                                <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Requerimientos</p>
                                <p className="text-xs text-white/80 font-medium italic leading-relaxed line-clamp-2">"{r.specialRequests}"</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gestión de Estado */}
                <div className="mt-auto space-y-5">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <p className="text-[10px] font-black text-[#6B6560] uppercase tracking-[0.2em]">Estado Actual</p>
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${current.bg} ${current.text} ${current.border}`}>
                                {current.label}
                            </span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleStatus(opt.value)}
                                    disabled={changing || opt.value === r.status}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all duration-300 border
                                        ${opt.value === r.status
                                            ? `${opt.bg} ${opt.text} ${opt.border} shadow-lg scale-105`
                                            : "bg-white/5 border-white/5 text-[#6B6560] hover:bg-white/10 hover:text-white"
                                        } disabled:opacity-30 disabled:scale-100`}
                                >
                                    <span>{opt.icon}</span> {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Botón Eliminar Estilizado */}
                    <button
                        onClick={() => onDelete(r._id)}
                        className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/5 text-[#6B6560] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
                        </svg>
                        Remover Registro
                    </button>
                </div>
            </div>
        </div>
    );
};