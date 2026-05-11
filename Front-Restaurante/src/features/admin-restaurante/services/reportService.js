import { axiosRestaurante } from "../../../shared/api/api";

// Descargar reporte de ventas en Excel
export const downloadSalesReportRequest = async (startDate, endDate) => {
    const response = await axiosRestaurante.get(
        "/kinalGourmetHouse/v1/reports/sales/excel",
        {
            params: {
                startDate,
                endDate
            },
            responseType: "blob"
        }
    );

    return response;
};