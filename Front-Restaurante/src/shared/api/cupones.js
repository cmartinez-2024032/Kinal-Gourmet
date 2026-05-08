import { axiosRestaurante } from "./api";

export const getCouponsRequest = () =>
    axiosRestaurante.get("/kinalGourmetHouse/v1/coupons/");

export const getCouponByIdRequest = (id) =>
    axiosRestaurante.get(`/kinalGourmetHouse/v1/coupons/${id}`);

export const getCouponByCodeRequest = (code) =>
    axiosRestaurante.get(`/kinalGourmetHouse/v1/coupons/code/${code}`);

export const createCouponRequest = (data) =>
    axiosRestaurante.post("/kinalGourmetHouse/v1/coupons/create", data);

export const updateCouponRequest = (id, data) =>
    axiosRestaurante.put(`/kinalGourmetHouse/v1/coupons/${id}`, data);

export const deleteCouponRequest = (id) =>
    axiosRestaurante.delete(`/kinalGourmetHouse/v1/coupons/${id}`);