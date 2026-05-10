import { useEffect, useState } from "react"; // Añadimos useState
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
    ExclamationTriangleIcon // Icono extra para el modal de borrar
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

    // --- ESTADO PARA EL MODAL DE ELIMINACIÓN ---
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        eventId: null,
        eventName: ""
    });

    useEffect(() => {
        getEvents();
    }, [filters]);

    // --- FUNCIONES PARA ELIMINAR ---
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
        <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Eventos</h1>
                    <p className="text-gray-500 mt-1">Organiza y supervisa los eventos de tu restaurante.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" />
                    Nuevo Evento
                </button>
            </div>

            {/* Barra de Filtros */}
            <div className="bg-white p-4 rounded-2xl shadow-sm mb-6 flex flex-wrap gap-4 items-center border border-gray-100">
                <select 
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-orange-500 transition-all"
                    value={filters.status}
                    onChange={(e) => setFilters({ status: e.target.value })}
                >
                    <option value="">Todos los estados</option>
                    <option value="PROGRAMADO">Programado</option>
                    <option value="EN_CURSO">En Curso</option>
                    <option value="FINALIZADO">Finalizado</option>
                    <option value="CANCELADO">Cancelado</option>
                </select>

                <button 
                    onClick={() => setFilters({ upcoming: !filters.upcoming, past: false })}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filters.upcoming ? 'bg-orange-500 text-white shadow-md shadow-orange-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    {filters.upcoming ? '✨ Próximos eventos' : 'Próximos (30 días)'}
                </button>
            </div>

            {/* Grid de Eventos */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            ) : events.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-20 text-center shadow-sm border border-dashed border-gray-200">
                    <CalendarIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium text-lg">No se encontraron eventos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {events.map((event) => (
                        <div key={event._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="p-7">
                                <div className="flex justify-between items-start mb-5">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusStyles[event.status]}`}>
                                        {event.status}
                                    </span>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEditModal(event)} className="p-2 bg-blue-50 text-blue-500 rounded-xl hover:bg-blue-100 transition-colors">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(event._id, event.name)} 
                                            className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{event.name}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10">{event.description}</p>

                                <div className="space-y-3 pt-5 border-t border-gray-50">
                                    <div className="flex items-center text-gray-700 text-sm font-medium gap-3">
                                        <div className="p-1.5 bg-orange-50 rounded-lg"><CalendarIcon className="w-4 h-4 text-orange-500" /></div>
                                        {new Date(event.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' })}
                                    </div>
                                    <div className="flex items-center text-gray-700 text-sm font-medium gap-3">
                                        <div className="p-1.5 bg-orange-50 rounded-lg"><ClockIcon className="w-4 h-4 text-orange-500" /></div>
                                        {event.startTime} - {event.endTime}
                                    </div>
                                    <div className="flex items-center text-gray-700 text-sm font-medium gap-3">
                                        <div className="p-1.5 bg-orange-50 rounded-lg"><UserGroupIcon className="w-4 h-4 text-orange-500" /></div>
                                        Capacidad: <span className="font-bold text-gray-900 ml-1">{event.capacity}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Paginación */}
            {!loading && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button 
                        disabled={pagination.currentPage === 1}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        className="p-3 rounded-2xl bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button 
                        disabled={pagination.currentPage === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        className="p-3 rounded-2xl bg-white border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* MODALES */}
            <EventModal />

            {/* MODAL DE ELIMINACIÓN ELEGANTE */}
            {deleteModal.open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
                    <div 
                        className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                                <ExclamationTriangleIcon className="w-10 h-10 text-red-500" />
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-2">
                                ¿Eliminar evento?
                            </h2>

                            <p className="text-gray-500 mb-6 leading-relaxed">
                                Estás a punto de borrar <span className="font-bold text-gray-800">"{deleteModal.eventName}"</span>. 
                                Esta acción es permanente y no se puede deshacer.
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={confirmDelete}
                                    className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-100 transition-all active:scale-95"
                                >
                                    Sí, eliminar permanentemente
                                </button>
                                <button
                                    onClick={closeDeleteModal}
                                    className="w-full py-4 rounded-2xl bg-gray-50 text-gray-500 font-bold hover:bg-gray-100 transition-all active:scale-95"
                                >
                                    No, mantener evento
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
    PROGRAMADO: "bg-blue-50 text-blue-600 border border-blue-100",
    EN_CURSO: "bg-green-50 text-green-600 border border-green-100 animate-pulse",
    FINALIZADO: "bg-gray-100 text-gray-500 border border-gray-200",
    CANCELADO: "bg-red-50 text-red-600 border border-red-100",
};