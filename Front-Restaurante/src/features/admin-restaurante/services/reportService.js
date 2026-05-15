import { axiosRestaurante } from "../../../shared/api/api";

export const downloadSalesReportRequest = (startDate, endDate) => {
    return axiosRestaurante.get("/kinalGourmetHouse/v1/reports/sales/excel", {
        params: { startDate, endDate },
        responseType: "arraybuffer",
    });
};

export const getSalesReportRequest = (startDate, endDate) => {
    return axiosRestaurante.get("/kinalGourmetHouse/v1/reports/sales", {
        params: { startDate, endDate },
    });
};