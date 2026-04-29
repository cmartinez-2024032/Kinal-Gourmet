import { useEffect, useState } from "react";
import { useMesaStore } from "../store/UseMesaStore";
import { MesaModal } from "../components/MesaModal";

const STATUS_STYLES = {
    AVAILABLE:   "bg-emerald-100 text-emerald-700",
    OCCUPIED:    "bg-red-100 text-red-700",
    RESERVED:    "bg-blue-100 text-blue-700",
    MAINTENANCE: "bg-amber-100 text-amber-700",
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

    const filtered  = getFilteredTables();
    const statuses  = getStatuses();
    const locations = getLocations();
    const totalActive = tables.filter((t) => t.isActive).length;

    return (
        <div className="p-7 w-full min-h-screen font-sans">

            {/* Error banner */}
            {error && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200
                    rounded-xl px-4 py-3 mb-6 text-sm text-red-700">
                    <span>{error}</span>
                    <button onClick={clearError} className="text-red-400 hover:text-red-600 text-base leading-none ml-4">
                        ✕
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-7 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mesas</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {tables.length} en total · {totalActive} activas
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    disabled={loading}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60
                        text-white text-sm font-semibold rounded-xl transition-colors"
                >
                    + Agregar mesa
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 mb-6">
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por número…"
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm w-56
                        outline-none focus:border-orange-400 transition-colors"
                />
                <div className="flex gap-2 flex-wrap">
                    {statuses.map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors
                                ${filterStatus === s
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300"}`}
                        >
                            {s === "Todas" ? "Todas" : STATUS_LABELS[s]}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {locations.map((l) => (
                        <button
                            key={l}
                            onClick={() => setFilterLocation(l)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors
                                ${filterLocation === l
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300"}`}
                        >
                            {l === "Todas" ? "Todas" : LOCATION_LABELS[l]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Contenido */}
            {loading ? (
                <div className="flex flex-col items-center py-20 gap-3">
                    <div className="w-9 h-9 rounded-full border-[3px] border-gray-100 border-t-orange-500 animate-spin" />
                    <p className="text-sm text-gray-400">Cargando mesas…</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-5xl mb-3">▦</p>
                    <p className="text-gray-400 text-sm">No se encontraron mesas.</p>
                </div>
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
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
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1100]">
                    <div className="bg-white rounded-2xl px-8 py-7 w-80 shadow-2xl">
                        <p className="font-semibold text-base text-gray-900 mb-4">
                            ¿Deseas eliminar esta mesa?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700
                                    hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => { deleteTable(deleteConfirm); setDeleteConfirm(null); }}
                                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600
                                    text-white text-sm font-semibold transition-colors"
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

function TableCard({ table, onEdit, onDelete }) {
    const statusClass = STATUS_STYLES[table.status] || "bg-gray-100 text-gray-600";

    return (
        <div className={`bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm
            hover:shadow-md transition-shadow ${!table.isActive ? "opacity-60" : ""}`}>
            {table.image && (
                <img
                    src={table.image}
                    alt={`Mesa ${table.number}`}
                    className="w-full h-36 object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                />
            )}
            <div className="p-4">
                <div className="flex gap-2 flex-wrap mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusClass}`}>
                        {STATUS_LABELS[table.status]}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">
                        {LOCATION_LABELS[table.location]}
                    </span>
                    {!table.isActive && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-400">
                            Inactiva
                        </span>
                    )}
                </div>

                <h3 className="font-semibold text-sm text-gray-900 mb-1">Mesa {table.number}</h3>

                <p className="text-xs text-gray-500 mb-1">
                    👥 {table.minCapacity}–{table.capacity} personas · {table.shape?.toLowerCase()}
                </p>

                {table.description && (
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-2">
                        {table.description}
                    </p>
                )}

                {table.extraCharge > 0 && (
                    <p className="text-xs font-semibold text-orange-500 mb-3">
                        + Q{parseFloat(table.extraCharge).toFixed(2)} cargo extra
                    </p>
                )}

                <div className="flex gap-2 mt-3">
                    <button
                        onClick={onEdit}
                        className="flex-1 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-xs
                            text-orange-600 hover:bg-orange-100 hover:border-orange-300 transition-colors font-medium"
                    >
                        Editar
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 py-1.5 rounded-lg border border-red-400 bg-red-500 text-xs
                            text-white hover:bg-red-600 transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}