import { useState } from "react";
import { BarChart3, DollarSign, ShoppingBag } from "lucide-react";

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
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Reportes
                </h1>

                <p className="text-gray-500 mt-1">
                    Descarga reportes y visualiza estadísticas del restaurante
                </p>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                <ReportCard
                    title="Ventas Totales"
                    value="Q 0.00"
                    icon={DollarSign}
                    description="Ingresos generados"
                />

                <ReportCard
                    title="Pedidos"
                    value="0"
                    icon={ShoppingBag}
                    description="Pedidos realizados"
                />

                <ReportCard
                    title="Reportes"
                    value="Excel"
                    icon={BarChart3}
                    description="Exportación disponible"
                />

            </div>

            {/* FILTROS */}
            <ReportFilters
                startDate={filters.startDate}
                endDate={filters.endDate}
                onChange={handleChange}
            />

            {/* BOTÓN */}
            <div className="flex justify-end">
                <DownloadExcelButton
                    onDownload={handleDownload}
                    loading={loading}
                />
            </div>

        </div>
    );
};