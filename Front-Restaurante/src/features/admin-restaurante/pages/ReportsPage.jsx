import { useState } from "react";
import { BarChart3, DollarSign, ShoppingBag, FileSpreadsheet } from "lucide-react";

import { ReportFilters } from "../components/ReportFilters";
import { DownloadExcelButton } from "../components/DownloadExcelButton";
import { ReportCard } from "../components/ReportCard";

import { useReportStore } from "../store/useReportStore";

export const ReportsPage = () => {

    const { downloadSalesReport, loading } = useReportStore();

    const [filters, setFilters] = useState({
        startDate: "",
        endDate: ""
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleDownload = async () => {
        if (!filters.startDate || !filters.endDate) {
            alert("Debes seleccionar ambas fechas");
            return;
        }

        await downloadSalesReport(
            filters.startDate,
            filters.endDate
        );
    };

    return (
        <div className="w-full min-h-screen text-[#F2EDE8] relative overflow-x-hidden p-6 md:p-8 bg-[#0F0E0D]">
            
            {/* Cinematic Background Glows */}
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
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#A09890]">Sincronizado en tiempo real</span>
                    </div>
                </div>

                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ReportCard
                        title="Ventas Totales"
                        value="Q 0.00"
                        icon={DollarSign}
                        description="Ingresos brutos generados"
                        className="bg-white/[0.03] backdrop-blur-xl border-white/5 rounded-[32px] p-8 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1"
                    />

                    <ReportCard
                        title="Pedidos"
                        value="0"
                        icon={ShoppingBag}
                        description="Volumen de órdenes"
                        className="bg-white/[0.03] backdrop-blur-xl border-white/5 rounded-[32px] p-8 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1"
                    />

                    <ReportCard
                        title="Exportación"
                        value="Excel"
                        icon={FileSpreadsheet}
                        description="Reporte de auditoría listo"
                        className="bg-white/[0.03] backdrop-blur-xl border-white/5 rounded-[32px] p-8 hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1"
                    />
                </div>

                {/* FILTROS SECTION (GLASS) */}
                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="text-orange-500 w-5 h-5" />
                            <h2 className="text-lg font-black text-white uppercase tracking-wider" style={{ fontFamily: 'Syne, sans-serif' }}>
                                Parámetros de Extracción
                            </h2>
                        </div>

                        <ReportFilters
                            startDate={filters.startDate}
                            endDate={filters.endDate}
                            onChange={handleChange}
                        />

                        {/* BOTÓN DE DESCARGA */}
                        <div className="flex justify-end pt-4 border-t border-white/5">
                            <div className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                <DownloadExcelButton
                                    onDownload={handleDownload}
                                    loading={loading}
                                    className="relative px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 active:scale-95 flex items-center gap-3"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* INFO FOOTER */}
                <div className="text-center py-6">
                    <p className="text-[10px] font-bold text-[#6B6560] uppercase tracking-[0.3em]">
                        Los archivos generados cumplen con el formato estándar de auditoría fiscal.
                    </p>
                </div>
            </div>
        </div>
    );
};