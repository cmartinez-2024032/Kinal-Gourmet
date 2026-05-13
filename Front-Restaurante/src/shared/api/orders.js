import { axiosRestaurante } from "./api";

export const createOrderRequest = (orderData) =>
    axiosRestaurante.post("/kinalGourmetHouse/v1/orders/create", orderData);

export const updateOrderRequest = (id, orderData) =>
    axiosRestaurante.put(`/kinalGourmetHouse/v1/orders/${id}`, orderData);

export const updateOrderStatusRequest = (id, status) =>
    axiosRestaurante.patch(`/kinalGourmetHouse/v1/orders/${id}/status`, { status });

export const getOrdersRequest = (params) =>
    axiosRestaurante.get("/kinalGourmetHouse/v1/orders/", { params });

export const getOrderByIdRequest = (id) =>
    axiosRestaurante.get(`/kinalGourmetHouse/v1/orders/${id}`);

export const cancelOrderRequest = (id) =>
    axiosRestaurante.patch(`/kinalGourmetHouse/v1/orders/${id}/cancel`);