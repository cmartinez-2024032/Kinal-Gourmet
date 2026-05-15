import { useEffect, useState } from "react";
import { useMesaStore } from "../store/useMesaStore";
import { MesaModal } from "../components/MesaModal";

const STATUS_STYLES = {
  AVAILABLE:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10",
  OCCUPIED:    "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/10",
  RESERVED:    "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/10",
  MAINTENANCE: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/10",
};

const STATUS_DOT = {
  AVAILABLE:   "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]",
  OCCUPIED:    "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]",
  RESERVED:    "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]",
  MAINTENANCE: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
};

const STATUS_LABELS = {
  AVAILABLE:   "Disponible",
  OCCUPIED:    "Ocupada",
  RESERVED:    "Reservada",
  MAINTENANCE: "Mantenimiento",
};

const LOCATION_LABELS = {
  INTERIOR: "Interior",
  TERRAZA:  "Terraza",
  VIP:      "VIP",
  BAR:      "Bar",
  PRIVADO:  "Privado",
};

const LOCATION_ICONS = {
  INTERIOR: "🏠",
  TERRAZA:  "🌿",
  VIP:      "⭐",
  BAR:      "🍸",
  PRIVADO:  "🔒",
};

const SHAPE_ICONS = {
  CIRCULAR:    "⬤",
  RECTANGULAR: "▬",
  CUADRADA:    "■",
};

export const MesaPage = () => {
  const {
    tables, searchTerm, filterStatus, filterLocation,
    loading, error,
    getFilteredTables, getStatuses, getLocations, getTables,
    openCreateModal, openEditModal, deleteTable,
    setSearchTerm, setFilterStatus, setFilterLocation, clearError,
  } = useMesaStore();

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { getTables(); }, []);

  const filtered    = getFilteredTables();
  const statuses    = getStatuses();
  const locations   = getLocations();
  const totalActive = tables.filter((t) => t.isActive).length;
  const totalAvail  = tables.filter((t) => t.status === "AVAILABLE").length;
  const totalOcc    = tables.filter((t) => t.status === "OCCUPIED").length;

  return (
    <div className="w-full min-h-screen text-[#F2EDE8] relative overflow-x-hidden p-6 md:p-8 bg-[#0F0E0D]">
      
      {/* Cinematic Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-700/5 blur-[100px]" />
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between mb-8 bg-red-500/10 backdrop-blur-2xl border border-red-500/20 rounded-2xl px-6 py-4 text-sm text-red-200 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="flex items-center gap-3 font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">!</span> 
            {error}
          </span>
          <button onClick={clearError} className="hover:rotate-90 transition-transform duration-300 text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-orange-500 to-orange-700 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
            <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Mesas
            </h1>
          </div>
          <p className="text-sm font-medium text-[#A09890] pl-6">Gestión de distribución y estados en tiempo real</p>
        </div>

        <button
          onClick={openCreateModal}
          disabled={loading}
          className="group relative flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-2xl font-black transition-all duration-500 hover:bg-orange-500 hover:shadow-[0_15px_35px_-10px_rgba(234,88,12,0.4)] hover:-translate-y-1 active:scale-95 disabled:opacity-40"
        >
          <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>Agregar mesa</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total", val: tables.length, color: "from-orange-500/20 to-orange-500/5", border: "border-orange-500/30" },
          { label: "Activas", val: totalActive, color: "from-emerald-500/20 to-emerald-500/5", border: "border-emerald-500/30" },
          { label: "Libres", val: totalAvail, color: "from-blue-500/20 to-blue-500/5", border: "border-blue-500/30" },
          { label: "Ocupadas", val: totalOcc, color: "from-red-500/20 to-red-500/5", border: "border-red-500/30" }
        ].map((stat, i) => (
          <div key={i} className={`bg-white/[0.03] backdrop-blur-xl border ${stat.border} rounded-3xl p-6 group relative overflow-hidden transition-all duration-500 hover:border-white/20`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <p className="text-3xl font-black text-white relative z-10" style={{ fontFamily: 'Syne, sans-serif' }}>{stat.val}</p>
            <p className="text-[10px] text-[#A09890] mt-1 font-black uppercase tracking-[0.2em] relative z-10">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Glassmorphic Toolbar */}
      <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 mb-10 shadow-2xl space-y-6">
        <div className="relative">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6560]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por número de mesa o detalle…"
            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium text-white placeholder-[#6B6560] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/30 focus:bg-white/[0.06] transition-all duration-300"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-black text-[#6B6560] uppercase tracking-[0.2em]">Estado</span>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase transition-all duration-300 border ${
                  filterStatus === s
                    ? "bg-white text-black border-white shadow-lg scale-105"
                    : "bg-white/5 border-white/5 text-[#A09890] hover:border-white/20 hover:text-white"
                }`}
              >
                {s !== "Todas" && <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`} />}
                {s === "Todas" ? "Todas" : STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 hidden md:block" />

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-black text-[#6B6560] uppercase tracking-[0.2em]">Zona</span>
            {locations.map((l) => (
              <button
                key={l}
                onClick={() => setFilterLocation(l)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase transition-all duration-300 border ${
                  filterLocation === l
                    ? "bg-orange-600 text-white border-orange-500 shadow-lg scale-105"
                    : "bg-white/5 border-white/5 text-[#A09890] hover:border-white/20 hover:text-white"
                }`}
              >
                {l !== "Todas" && <span>{LOCATION_ICONS[l]}</span>}
                {l === "Todas" ? "Todas" : LOCATION_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="flex flex-col items-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-white/5 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-xs font-black text-[#6B6560] tracking-widest uppercase animate-pulse">Sincronizando Salón</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[40px] py-32 text-center backdrop-blur-sm shadow-2xl">
          <span className="text-6xl block mb-6 filter grayscale opacity-40">▦</span>
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Sin coincidencias</h3>
          <p className="text-[#6B6560] font-medium">No se encontraron mesas con los criterios seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((table) => (
            <TableCard
              key={table._id}
              table={table}
              onEdit={() => openEditModal(table)}
              onDelete={() => setDeleteConfirm(table._id)}
            />
          ))}
        </div>
      )}

      <MesaModal />

      {/* Modern Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[2000] p-6 animate-in fade-in duration-300">
          <div className="bg-[#1C1A17] border border-white/10 rounded-[40px] p-10 max-w-sm w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-8 mx-auto border border-red-500/20">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-4 text-center" style={{ fontFamily: 'Syne, sans-serif' }}>¿Eliminar mesa?</h2>
            <p className="text-[#A09890] mb-10 text-center font-medium leading-relaxed">Esta acción es irreversible y eliminará la configuración de esta mesa del salón.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-4 rounded-2xl font-bold text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10">Cancelar</button>
              <button onClick={() => { deleteTable(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-4 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 active:scale-95">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function TableCard({ table, onEdit, onDelete }) {
  const statusClass = STATUS_STYLES[table.status] || "bg-white/5 text-white border-white/10";
  const statusDot   = STATUS_DOT[table.status]    || "bg-[#6B6560]";

  return (
    <div className={`group relative bg-white/[0.04] border border-white/5 rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:border-white/20 hover:-translate-y-2 ${!table.isActive ? "opacity-50 grayscale" : ""}`}>
      
      {/* Top Status Gradient */}
      <div className={`h-1.5 w-full ${
        table.status === "AVAILABLE"   ? "bg-emerald-500" :
        table.status === "OCCUPIED"    ? "bg-red-500"     :
        table.status === "RESERVED"    ? "bg-blue-500"    :
        table.status === "MAINTENANCE" ? "bg-amber-500"   : "bg-white/10"
      }`} />

      {/* Header Info */}
      <div className="p-7 flex-1">
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#6B6560] uppercase tracking-widest mb-1">Identificador</span>
            <p className="text-4xl font-black text-white leading-none" style={{ fontFamily: 'Syne, sans-serif' }}>
              #{table.number}
            </p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider backdrop-blur-xl ${statusClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
            {STATUS_LABELS[table.status]}
          </div>
        </div>

        {/* Info Chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-bold text-white/80">
            {LOCATION_ICONS[table.location]} {LOCATION_LABELS[table.location]}
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-bold text-white/80">
            👥 {table.minCapacity}–{table.capacity}
          </span>
          {table.shape && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[11px] font-bold text-white/80 uppercase">
              {SHAPE_ICONS[table.shape] || "◆"} {table.shape}
            </span>
          )}
        </div>

        {/* Description */}
        {table.description && (
          <p className="text-sm text-[#A09890] leading-relaxed line-clamp-2 mb-6 font-medium italic">
            {table.description}
          </p>
        )}

        {/* Cargo Extra */}
        {table.extraCharge > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl px-4 py-2.5 mb-6">
            <p className="text-[11px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
              <span>💳 Cargo Extra:</span>
              <span className="text-white">Q{parseFloat(table.extraCharge).toFixed(2)}</span>
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-7 pt-0 grid grid-cols-5 gap-3">
        <button
          onClick={onEdit}
          className="col-span-4 py-4 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all duration-300 hover:shadow-lg active:scale-95"
        >
          Gestionar Mesa
        </button>
        <button
          onClick={onDelete}
          className="col-span-1 flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-[#6B6560] hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}