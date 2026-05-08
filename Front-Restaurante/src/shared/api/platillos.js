import { axiosRestaurante } from "./api"

export const getDishesRequest = () =>
    axiosRestaurante.get("/kinalGourmetHouse/v1/dishes/")

export const getDishByIdRequest = (id) =>
    axiosRestaurante.get(`/kinalGourmetHouse/v1/dishes/${id}`)

export const createDishRequest = (data) =>
    axiosRestaurante.post("/kinalGourmetHouse/v1/dishes/create", data)

export const updateDishRequest = (id, data) =>
    axiosRestaurante.put(`/kinalGourmetHouse/v1/dishes/${id}`, data)

export const deleteDishRequest = (id) =>
    axiosRestaurante.delete(`/kinalGourmetHouse/v1/dishes/${id}`)