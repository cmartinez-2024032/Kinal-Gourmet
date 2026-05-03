import { axiosPlatillos } from "./api";

export const getCouponsRequest = () =>
    axiosPlatillos.get("/kinalGourmetHouse/v1/coupons/");

export const getCouponByIdRequest = (id) =>
    axiosPlatillos.get(`/kinalGourmetHouse/v1/coupons/${id}`);

export const getCouponByCodeRequest = (code) =>
    axiosPlatillos.get(`/kinalGourmetHouse/v1/coupons/code/${code}`);

export const createCouponRequest = (data) =>
    axiosPlatillos.post("/kinalGourmetHouse/v1/coupons/create", data);

export const updateCouponRequest = (id, data) =>
    axiosPlatillos.put(`/kinalGourmetHouse/v1/coupons/${id}`, data);

export const deleteCouponRequest = (id) =>
    axiosPlatillos.delete(`/kinalGourmetHouse/v1/coupons/${id}`);