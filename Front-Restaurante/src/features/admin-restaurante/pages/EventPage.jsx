import { useEffect, useState } from "react";
import { useEventStore } from "../store/useEventStore";
import { EventModal } from "../components/EventModal";
import { 
    CalendarIcon, 
    PlusIcon, 
    ClockIcon, 
    UserGroupIcon, 
    TrashIcon, 
    PencilIcon, 
    ChevronLeftIcon,
    ChevronRightIcon,
    ExclamationTriangleIcon 
} from "@heroicons/react/24/outline";

export const EventsPage = () => {
    const { 
        events, 
        loading, 
        getEvents, 
        openCreateModal, 
        openEditModal, 
        deleteEvent, 
        filters, 
        setFilters, 
        pagination 
    } = useEventStore();

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        eventId: null,
        eventName: ""
    });

    useEffect(() => {
        getEvents();
    }, [filters]);

    const handleDeleteClick = (id, name) => {
        setDeleteModal({
            open: true,
            eventId: id,
            eventName: name
        });
    };

    const confirmDelete = async () => {
        try {
            await deleteEvent(deleteModal.eventId);
            setDeleteModal({ open: false, eventId: null, eventName: "" });
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const closeDeleteModal = () => {
        setDeleteModal({ open: false, eventId: null, eventName: "" });
    };

    const handlePageChange = (newPage) => {
        setFilters({ page: newPage });
    };

    return (
        <div className="w-full min-h-screen text-[#F2EDE8] relative overflow-x-hidden p-6 md:p-8 bg-[#0F0E0D]">
            
            {/* Cinematic Background Glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-700/5 blur-[100px]" />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-orange-500 to-orange-700 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
                        <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                            Eventos
                        </h1>
                    </div>
                    <p className="text-sm font-medium text-[#A09890] pl-6">Organiza y supervisa las experiencias de tu restaurante.</p>
                </div>

                <button 
                    onClick={openCreateModal}
                    className="group relative flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-2xl font-black transition-all duration-500 hover:bg-orange-500 hover:shadow-[0_15px_35px_-10px_rgba(234,88,12,0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-95"
                >
                    <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    <span>Nuevo Evento</span>
                </button>
            </div>

            {/* Glassmorphic Toolbar */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[32px] p-6 mb-10 shadow-2xl relative overflow-hidden flex flex-wrap gap-4 items-center">
                <div className="relative min-w-[200px]">
                    <select 
                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-white outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all appearance-none cursor-pointer"
                        value={filters.status}
                        onChange={(e) => setFilters({ status: e.target.value })}
                    >
                        <option value="" className="bg-[#1C1A17]">Todos los estados</option>
                        <option value="PROGRAMADO" className="bg-[#1C1A17]">Programado</option>
                        <option value="EN_CURSO" className="bg-[#1C1A17]">En Curso</option>
                        <option value="FINALIZADO" className="bg-[#1C1A17]">Finalizado</option>
                        <option value="CANCELADO" className="bg-[#1C1A17]">Cancelado</option>
                    </select>
                </div>

                <button 
                    onClick={() => setFilters({ upcoming: !filters.upcoming, past: false })}
                    className={`px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                        filters.upcoming 
                        ? 'bg-white text-black border-white shadow-lg scale-105' 
                        : 'bg-white/5 border-white/5 text-[#A09890] hover:border-white/20 hover:text-white hover:bg-white/10'
                    }`}
                >
                    {filters.upcoming ? '✨ Próximos eventos' : 'Próximos (30 días)'}
                </button>
            </div>

            {/* Grid Content */}
            {loading ? (
                <div className="flex flex-col items-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-white/5 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-xs font-black text-[#6B6560] tracking-widest uppercase animate-pulse">Sincronizando Agenda</p>
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white/[0.02] border-2 border-dashed border-white/5 rounded-[40px] py-32 text-center backdrop-blur-sm">
                    <CalendarIcon className="w-16 h-16 text-[#6B6560] mx-auto mb-6 opacity-20" />
                    <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Agenda vacía</h3>
                    <p className="text-[#6B6560] font-medium">No se encontraron eventos con los filtros actuales.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <div key={event._id} className="group relative bg-white/[0.04] border border-white/5 rounded-[32px] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:border-white/20 hover:-translate-y-2 p-7">
                            
                            {/* Status and Actions */}
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border ${statusStyles[event.status]}`}>
                                    {event.status}
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(event)} className="p-2.5 bg-white/5 text-[#A09890] rounded-xl border border-white/5 hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/20 transition-all">
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDeleteClick(event._id, event.name)} className="p-2.5 bg-white/5 text-[#A09890] rounded-xl border border-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-2xl font-extrabold text-white mb-3 group-hover:text-orange-400 transition-colors truncate" style={{ fontFamily: 'Syne, sans-serif' }}>
                                {event.name}
                            </h3>
                            <p className="text-sm text-[#A09890] leading-relaxed line-clamp-2 mb-8 h-10 font-medium">
                                {event.description}
                            </p>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex items-center text-[#F2EDE8] text-sm font-bold gap-4">
                                    <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20"><CalendarIcon className="w-4 h-4 text-orange-500" /></div>
                                    {new Date(event.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' })}
                                </div>
                                <div className="flex items-center text-[#F2EDE8] text-sm font-bold gap-4">
                                    <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20"><ClockIcon className="w-4 h-4 text-orange-500" /></div>
                                    {event.startTime} - {event.endTime}
                                </div>
                                <div className="flex items-center text-[#F2EDE8] text-sm font-bold gap-4">
                                    <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20"><UserGroupIcon className="w-4 h-4 text-orange-500" /></div>
                                    Capacidad: <span className="text-orange-400 ml-1">{event.capacity} pax</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-16">
                    <button 
                        disabled={pagination.currentPage === 1}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition-all active:scale-90"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-black text-[#6B6560] uppercase tracking-[0.3em]">
                        {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button 
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 hover:bg-white/10 transition-all active:scale-90"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Event Form Modal */}
            <EventModal />

            {/* Elegant Delete Confirmation */}
            {deleteModal.open && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-[#1C1A17] w-full max-w-md rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 text-center">
                            <div className="w-24 h-24 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                                <ExclamationTriangleIcon className="w-12 h-12" />
                            </div>

                            <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
                                ¿Eliminar evento?
                            </h2>

                            <p className="text-[#A09890] mb-10 leading-relaxed font-medium">
                                Estás a punto de borrar <span className="text-white font-black italic">"{deleteModal.eventName}"</span>. 
                                Esta acción es irreversible.
                            </p>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={confirmDelete}
                                    className="w-full py-4 rounded-2xl bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-500 shadow-lg shadow-red-600/20 transition-all active:scale-95"
                                >
                                    Confirmar Eliminación
                                </button>
                                <button
                                    onClick={closeDeleteModal}
                                    className="w-full py-4 rounded-2xl bg-white/5 text-[#6B6560] font-black text-xs uppercase tracking-widest hover:text-white transition-all active:scale-95 border border-white/5"
                                >
                                    Mantener en Agenda
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const statusStyles = {
    PROGRAMADO: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/10",
    EN_CURSO: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/10 animate-pulse",
    FINALIZADO: "bg-white/5 text-[#6B6560] border-white/10",
    CANCELADO: "bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/10",
};