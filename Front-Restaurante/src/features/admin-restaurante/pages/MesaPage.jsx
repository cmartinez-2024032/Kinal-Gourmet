import { useEffect, useState } from "react";
import { useMesaStore } from "../store/UseMesaStore";
import { MesaModal } from "../components/MesaModal";

const STATUS_STYLES = {
  AVAILABLE:   "bg-emerald-50 text-emerald-700 border border-emerald-200",
  OCCUPIED:    "bg-red-50 text-red-700 border border-red-200",
  RESERVED:    "bg-blue-50 text-blue-700 border border-blue-200",
  MAINTENANCE: "bg-amber-50 text-amber-700 border border-amber-200",
};

const STATUS_DOT = {
  AVAILABLE:   "bg-emerald-400",
  OCCUPIED:    "bg-red-400",
  RESERVED:    "bg-blue-400",
  MAINTENANCE: "bg-amber-400",
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
    <div className="w-full min-h-screen font-sans">

      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200
          rounded-2xl px-5 py-3.5 mb-6 text-sm text-red-700 shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
          <button onClick={clearError} className="text-red-400 hover:text-red-600 ml-4 transition-colors">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Mesas</h1>
          <p className="text-stone-400 text-sm mt-0.5">Gestiona la distribución y estado de las mesas</p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600
            disabled:opacity-60 text-white text-sm font-bold rounded-xl
            transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agregar mesa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border-t-4 border-t-orange-500 shadow-sm">
          <p className="text-3xl font-bold text-stone-900">{tables.length}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Total</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-t-4 border-t-emerald-500 shadow-sm">
          <p className="text-3xl font-bold text-stone-900">{totalActive}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Activas</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-t-4 border-t-blue-400 shadow-sm">
          <p className="text-3xl font-bold text-stone-900">{totalAvail}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Disponibles</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border-t-4 border-t-red-400 shadow-sm">
          <p className="text-3xl font-bold text-stone-900">{totalOcc}</p>
          <p className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wide">Ocupadas</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex flex-col gap-3">

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por número de mesa…"
            className="w-full border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm
              text-stone-700 bg-stone-50 placeholder-stone-300
              focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-1">Estado</span>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150
                ${filterStatus === s
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "bg-stone-50 text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-500"}`}
            >
              {s !== "Todas" && (
                <span className={`w-1.5 h-1.5 rounded-full ${filterStatus === s ? "bg-white" : STATUS_DOT[s]}`} />
              )}
              {s === "Todas" ? "Todas" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Location filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-1">Ubicación</span>
          {locations.map((l) => (
            <button
              key={l}
              onClick={() => setFilterLocation(l)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150
                ${filterLocation === l
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "bg-stone-50 text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-500"}`}
            >
              {l !== "Todas" && <span>{LOCATION_ICONS[l]}</span>}
              {l === "Todas" ? "Todas" : LOCATION_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center py-24 gap-4">
          <div className="w-10 h-10 rounded-full border-[3px] border-stone-100 border-t-orange-500 animate-spin" />
          <p className="text-sm text-stone-400">Cargando mesas…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-200 py-20 text-center shadow-sm">
          <p className="text-5xl mb-4">▦</p>
          <p className="text-stone-500 font-semibold">No se encontraron mesas</p>
          <p className="text-stone-300 text-sm mt-1">Intenta ajustar los filtros o agrega una nueva</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5">
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

      {/* Confirm delete */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1100]">
          <div className="bg-white rounded-2xl px-8 py-7 w-96 shadow-2xl border border-stone-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
              </svg>
            </div>
            <p className="font-bold text-base text-stone-900 mb-1">¿Eliminar esta mesa?</p>
            <p className="text-sm text-stone-400 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-sm text-stone-600
                  hover:bg-stone-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => { deleteTable(deleteConfirm); setDeleteConfirm(null); }}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white
                  text-sm font-bold transition-colors shadow-sm"
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

// ── Tarjeta de mesa ─────────────────────────────────────────────
function TableCard({ table, onEdit, onDelete }) {
  const statusClass = STATUS_STYLES[table.status] || "bg-stone-100 text-stone-600 border border-stone-200";
  const statusDot   = STATUS_DOT[table.status]    || "bg-stone-300";
  const isGeneral   = table.status === "AVAILABLE";

  return (
    <div className={`group bg-white border-2 rounded-3xl overflow-hidden
      transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
      ${!table.isActive ? "opacity-60 border-stone-200" : "border-orange-200 hover:border-orange-300"}`}
    >
      {/* Top accent bar */}
      <div className={`h-1.5 w-full ${
        table.status === "AVAILABLE"   ? "bg-emerald-400" :
        table.status === "OCCUPIED"    ? "bg-red-400"     :
        table.status === "RESERVED"    ? "bg-blue-400"    :
        table.status === "MAINTENANCE" ? "bg-amber-400"   : "bg-stone-300"
      }`} />

      {/* Image */}
      {table.image && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={table.image}
            alt={`Mesa ${table.number}`}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => { e.target.parentElement.style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      )}

      <div className="p-5">
        {/* Number + status */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Mesa</p>
            <p className="text-3xl font-black text-stone-900 leading-none">#{table.number}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${statusClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
            {STATUS_LABELS[table.status]}
          </div>
        </div>

        {/* Info chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-50 border border-stone-100 text-xs font-semibold text-stone-600">
            {LOCATION_ICONS[table.location]} {LOCATION_LABELS[table.location]}
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-50 border border-stone-100 text-xs font-semibold text-stone-600">
            👥 {table.minCapacity}–{table.capacity}
          </span>
          {table.shape && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-50 border border-stone-100 text-xs font-semibold text-stone-600">
              {SHAPE_ICONS[table.shape] || "◆"} {table.shape.toLowerCase()}
            </span>
          )}
          {!table.isActive && (
            <span className="px-2.5 py-1 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-500">
              Inactiva
            </span>
          )}
        </div>

        {/* Description */}
        {table.description && (
          <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 mb-3">
            {table.description}
          </p>
        )}

        {/* Extra charge */}
        {table.extraCharge > 0 && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 mb-4">
            <p className="text-xs font-bold text-orange-500">
              + Q{parseFloat(table.extraCharge).toFixed(2)} cargo extra
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-stone-100 mb-4" />

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 py-2 rounded-xl border-2 border-orange-200 bg-orange-50
              text-xs font-bold text-orange-600 hover:bg-orange-100 hover:border-orange-300
              transition-all duration-150"
          >
            ✏️ Editar
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-2 rounded-xl border-2 border-red-200 bg-red-50
              text-xs font-bold text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500
              transition-all duration-150"
          >
            🗑 Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}