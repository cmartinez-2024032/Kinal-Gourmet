import { useState } from "react";
import { BarChart3, DollarSign, ShoppingBag, FileSpreadsheet, TrendingUp } from "lucide-react";
import { useReportStore } from "../store/useReportStore";

export const ReportsPage = () => {
    const { downloadSalesReport, fetchSalesSummary, loading, loadingSummary, summary } = useReportStore();

    const today = new Date().toISOString().split('T')[0];

    const [filters, setFilters] = useState({
        startDate: today,
        endDate:   today,
    });

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleApply = async () => {
        if (!filters.startDate || !filters.endDate) {
            alert("Debes seleccionar ambas fechas");
            return;
        }
        await fetchSalesSummary(filters.startDate, filters.endDate);
    };

    const handleDownload = async () => {
        if (!filters.startDate || !filters.endDate) {
            alert("Debes seleccionar ambas fechas");
            return;
        }
        await fetchSalesSummary(filters.startDate, filters.endDate);
        await downloadSalesReport(filters.startDate, filters.endDate);
    };

    const totalRevenue = summary?.totalRevenue   ?? null;
    const totalOrders  = summary?.totalOrders    ?? null;
    const avgOrder     = summary?.averageOrderValue ?? null;

    return (
        <div className="w-full min-h-screen text-[#F2EDE8] relative overflow-x-hidden p-6 md:p-8 bg-[#0F0E0D]">

            {/* Ambient glows */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-700/5 blur-[100px]" />
            </div>

            <div className="max-w-[1200px] mx-auto space-y-10">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-1.5 h-10 rounded-full bg-gradient-to-b from-orange-500 to-orange-700 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
                            <h1 className="text-4xl font-black tracking-tight text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                                Reportes
                            </h1>
                        </div>
                        <p className="text-sm font-medium text-[#A09890] pl-6">
                            Analiza el rendimiento y exporta métricas detalladas del restaurante.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#A09890]">
                            Sincronizado en tiempo real
                        </span>
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Ventas Totales */}
                    <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-[32px] p-7
                        hover:bg-white/[0.06] hover:border-orange-500/20 hover:-translate-y-1
                        transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#6B6560] mb-1">
                                    Ventas Totales
                                </p>
                                {loadingSummary ? (
                                    <div className="h-9 w-32 bg-white/10 rounded-xl animate-pulse mt-1" />
                                ) : (
                                    <p className="text-3xl font-black text-[#F2EDE8]" style={{ fontFamily: 'Syne, sans-serif' }}>
                                        {totalRevenue !== null
                                            ? <><span className="text-orange-400 text-base mr-1">Q</span>{totalRevenue.toFixed(2)}</>
                                            : <span className="text-[#6B6560] text-xl">—</span>
                                        }
                                    </p>
                                )}
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                                <DollarSign className="text-orange-400 w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-[#6B6560]">Ingresos brutos generados</p>
                    </div>

                    {/* Pedidos */}
                    <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-[32px] p-7
                        hover:bg-white/[0.06] hover:border-blue-500/20 hover:-translate-y-1
                        transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#6B6560] mb-1">
                                    Pedidos
                                </p>
                                {loadingSummary ? (
                                    <div className="h-9 w-20 bg-white/10 rounded-xl animate-pulse mt-1" />
                                ) : (
                                    <p className="text-3xl font-black text-[#F2EDE8]" style={{ fontFamily: 'Syne, sans-serif' }}>
                                        {totalOrders !== null ? totalOrders : <span className="text-[#6B6560] text-xl">—</span>}
                                    </p>
                                )}
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                <ShoppingBag className="text-blue-400 w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-[#6B6560]">Volumen de órdenes</p>
                    </div>

                    {/* Promedio */}
                    <div className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-[32px] p-7
                        hover:bg-white/[0.06] hover:border-emerald-500/20 hover:-translate-y-1
                        transition-all duration-500 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                        <div className="flex items-start justify-between mb-5">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#6B6560] mb-1">
                                    Ticket Promedio
                                </p>
                                {loadingSummary ? (
                                    <div className="h-9 w-32 bg-white/10 rounded-xl animate-pulse mt-1" />
                                ) : (
                                    <p className="text-3xl font-black text-[#F2EDE8]" style={{ fontFamily: 'Syne, sans-serif' }}>
                                        {avgOrder !== null
                                            ? <><span className="text-emerald-400 text-base mr-1">Q</span>{avgOrder.toFixed(2)}</>
                                            : <span className="text-[#6B6560] text-xl">—</span>
                                        }
                                    </p>
                                )}
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="text-emerald-400 w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-xs text-[#6B6560]">Valor promedio por orden</p>
                    </div>
                </div>

                {/* FILTROS */}
                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/3 via-transparent to-transparent pointer-events-none rounded-[40px]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    <div className="relative z-10 space-y-8">

                        {/* Título sección */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                <BarChart3 className="text-orange-400 w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-white uppercase tracking-wider" style={{ fontFamily: 'Syne, sans-serif' }}>
                                    Parámetros de Extracción
                                </h2>
                                <p className="text-[10px] text-[#6B6560] font-bold uppercase tracking-widest">
                                    Selecciona el rango de fechas
                                </p>
                            </div>
                        </div>

                        {/* Inputs de fecha */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase">
                                    Fecha inicial
                                </label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={filters.startDate}
                                    onChange={handleChange}
                                    className="w-full bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl
                                        px-4 py-3 text-sm text-[#F2EDE8]
                                        focus:outline-none focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/10
                                        focus:bg-white/[0.07] transition-all duration-200
                                        [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black tracking-widest text-[#6B6560] uppercase">
                                    Fecha final
                                </label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={filters.endDate}
                                    onChange={handleChange}
                                    className="w-full bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-2xl
                                        px-4 py-3 text-sm text-[#F2EDE8]
                                        focus:outline-none focus:border-orange-500/40 focus:ring-2 focus:ring-orange-500/10
                                        focus:bg-white/[0.07] transition-all duration-200
                                        [color-scheme:dark]"
                                />
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/5">
                            <button
                                onClick={handleApply}
                                disabled={loadingSummary}
                                className="w-full sm:w-auto px-8 py-3.5 bg-white/[0.06] border border-white/10 text-[#F2EDE8]
                                    rounded-2xl font-black text-xs uppercase tracking-[0.2em]
                                    hover:bg-white/[0.10] hover:border-white/20
                                    transition-all duration-300 active:scale-95 disabled:opacity-50
                                    flex items-center justify-center gap-2"
                            >
                                {loadingSummary ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Consultando...
                                    </>
                                ) : (
                                    <>
                                        <BarChart3 className="w-3.5 h-3.5" />
                                        Ver métricas
                                    </>
                                )}
                            </button>

                            <div className="group relative w-full sm:w-auto">
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                                <button
                                    onClick={handleDownload}
                                    disabled={loading}
                                    className="relative w-full sm:w-auto px-10 py-3.5
                                        bg-gradient-to-r from-orange-500 to-orange-600
                                        hover:from-orange-400 hover:to-orange-500
                                        text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em]
                                        shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40
                                        transition-all duration-300 active:scale-95 disabled:opacity-50
                                        flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Generando...
                                        </>
                                    ) : (
                                        <>
                                            <FileSpreadsheet className="w-3.5 h-3.5" />
                                            Exportar a Excel
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mensaje si hay datos */}
                {summary && !loadingSummary && (
                    <div className="bg-emerald-500/8 backdrop-blur-xl border border-emerald-400/20 rounded-2xl px-6 py-4 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                        <p className="text-sm text-emerald-300 font-bold">
                            Reporte listo · {summary.totalOrders} órdenes encontradas en el período seleccionado
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center py-6">
                    <p className="text-[10px] font-bold text-[#6B6560] uppercase tracking-[0.3em]">
                        Los archivos generados cumplen con el formato estándar de auditoría fiscal.
                    </p>
                </div>
            </div>
        </div>
    );
};