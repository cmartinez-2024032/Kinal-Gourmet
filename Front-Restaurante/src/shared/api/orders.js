import { axiosRestaurante } from "./api";

export const getOrdersRequest = (params) =>
    axiosRestaurante.get("/kinalGourmetHouse/v1/orders/", { params });

export const getOrderByIdRequest = (id) =>
    axiosRestaurante.get(`/kinalGourmetHouse/v1/orders/${id}`);

export const cancelOrderRequest = (id) =>
    axiosRestaurante.patch(`/kinalGourmetHouse/v1/orders/${id}/cancel`);