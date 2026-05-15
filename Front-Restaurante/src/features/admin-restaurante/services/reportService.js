import { axiosRestaurante } from "../../../shared/api/api";

export const downloadSalesReportRequest = (startDate, endDate) => {
    return api.get("/reports/sales/excel", {
        params: { startDate, endDate },
        responseType: "arraybuffer",
    });
};
 
export const getSalesReportRequest = (startDate, endDate) => {
    return api.get("/reports/sales", {
        params: { startDate, endDate },
    });
};
 