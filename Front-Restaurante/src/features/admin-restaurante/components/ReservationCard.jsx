import { useState } from "react";

const STATUS_OPTIONS = [
    { value: "PENDIENTE",  label: "Pendiente",  bg: "bg-amber-400",   text: "text-amber-950",  icon: "⏳" },
    { value: "CONFIRMADA", label: "Confirmada", bg: "bg-emerald-400", text: "text-emerald-950",icon: "✅" },
    { value: "CANCELADA",  label: "Cancelada",  bg: "bg-rose-500",    text: "text-white",       icon: "✕" },
    { value: "COMPLETADA", label: "Completada", bg: "bg-sky-400",     text: "text-sky-950",     icon: "🎉" },
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
        <div className="bg-white rounded-[28px] border border-stone-100 shadow-lg shadow-black/5 overflow-hidden hover:translate-y-[-4px] hover:shadow-xl transition-all duration-300 group">

            {/* Imagen mesa */}
            <div className="relative h-44 bg-stone-100 overflow-hidden">
                {r.table?.image ? (
                    <img
                        src={r.table.image}
                        alt={`Mesa ${r.table.number}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-700 flex items-center justify-center">
                        <span className="text-6xl opacity-20">🍽️</span>
                    </div>
                )}

                {/* Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badge mesa */}
                <div className="absolute top-3 right-3">
                    <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">
                        🪑 {r.table?.number ? `Mesa ${r.table.number}` : "Por asignar"}
                    </span>
                </div>

                {/* Info sobre imagen */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                    <p className="font-black text-base text-white leading-tight drop-shadow-lg truncate">
                        {r.userInfo?.name ?? "Cliente"}
                    </p>
                    <p className="text-[11px] text-white/75 font-bold drop-shadow truncate">
                        {r.userInfo?.email ?? ""}
                    </p>
                    <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest drop-shadow mt-0.5">
                        🕐 {formatTime(r.time)} · {date}
                    </p>
                </div>
            </div>

            {/* Contenido */}
            <div className="p-4">

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-stone-50 rounded-2xl p-2.5 text-center">
                        <p className="text-[9px] font-black text-stone-400 uppercase tracking-wide mb-1">Restaurante</p>
                        <p className="text-xs font-black text-stone-700 truncate">{r.restaurant?.name ?? "—"}</p>
                    </div>
                    <div className="bg-orange-50 rounded-2xl p-2.5 text-center">
                        <p className="text-[9px] font-black text-orange-400 uppercase tracking-wide mb-1">Comensales</p>
                        <p className="text-sm font-black text-stone-800">👥 {r.numberOfGuests}</p>
                    </div>
                    <div className="bg-orange-50 rounded-2xl p-2.5 text-center">
                        <p className="text-[9px] font-black text-orange-400 uppercase tracking-wide mb-1">Ubicación</p>
                        <p className="text-xs font-black text-stone-800 truncate">{r.table?.location ?? "—"}</p>
                    </div>
                </div>

                {/* Nota especial */}
                {r.specialRequests && (
                    <div className="bg-zinc-900 rounded-2xl px-3 py-2.5 mb-4 flex gap-2 items-center">
                        <div className="shrink-0 w-7 h-7 bg-amber-400 rounded-xl flex items-center justify-center">
                            <span className="text-sm">📌</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest">Nota especial</p>
                            <p className="text-xs text-white font-medium">"{r.specialRequests}"</p>
                        </div>
                    </div>
                )}

                {/* Cambiar status */}
                <div className="mb-3">
                    <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Cambiar estado</p>
                    <div className="flex gap-1.5 flex-wrap">
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleStatus(opt.value)}
                                disabled={changing || opt.value === r.status}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide transition-all
                                    ${opt.value === r.status
                                        ? `${opt.bg} ${opt.text} shadow-md scale-105`
                                        : "bg-stone-100 text-stone-400 hover:bg-stone-200 disabled:opacity-50"
                                    }`}
                            >
                                {opt.icon} {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Eliminar */}
                <button
                    onClick={() => onDelete(r._id)}
                    className="w-full py-2.5 rounded-2xl bg-red-500 text-white text-xs font-black uppercase tracking-widest
                               shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                    🗑️ Eliminar reservación
                </button>
            </div>
        </div>
    );
};