import { axiosRestaurantAdmin } from "./api";

export const getOrdersRequest = (params) =>
    axiosRestaurantAdmin.get("/kinalGourmetHouse/v1/orders/", { params });

export const getOrderByIdRequest = (id) =>
    axiosRestaurantAdmin.get(`/kinalGourmetHouse/v1/orders/${id}`);

export const cancelOrderRequest = (id) =>
    axiosRestaurantAdmin.patch(`/kinalGourmetHouse/v1/orders/${id}/cancel`);