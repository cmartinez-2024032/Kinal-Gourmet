import { axiosPlatillos } from "./api"

export const getDishesRequest = () =>
    axiosPlatillos.get("/kinalGourmetHouse/v1/dishes/")

export const getDishByIdRequest = (id) =>
    axiosPlatillos.get(`/kinalGourmetHouse/v1/dishes/${id}`)

export const createDishRequest = (data) =>
    axiosPlatillos.post("/kinalGourmetHouse/v1/dishes/create", data)

export const updateDishRequest = (id, data) =>
    axiosPlatillos.put(`/kinalGourmetHouse/v1/dishes/${id}`, data)

export const deleteDishRequest = (id) =>
    axiosPlatillos.delete(`/kinalGourmetHouse/v1/dishes/${id}`)