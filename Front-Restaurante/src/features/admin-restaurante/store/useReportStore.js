import { create } from "zustand";
import { downloadSalesReportRequest } from "../services/reportService";

export const useReportStore = create((set) => ({
    loading: false,
    error: null,

    downloadSalesReport: async (startDate, endDate) => {
        try {
            set({
                loading: true,
                error: null
            });

            const response = await downloadSalesReportRequest(
                startDate,
                endDate
            );

            const file = new Blob(
                [response.data],
                {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            );

            const url = window.URL.createObjectURL(file);

            const link = document.createElement("a");

            link.href = url;
            link.setAttribute(
                "download",
                "reporte_ventas.xlsx"
            );

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

            set({
                loading: false
            });

            return {
                success: true
            };

        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al descargar reporte"
            });

            return {
                success: false
            };
        }
    }
}));