import { axiosRestaurantAdmin } from "./api"

export const getDishesRequest = () =>
    axiosRestaurantAdmin.get("/kinalGourmetHouse/v1/dishes/")

export const getDishByIdRequest = (id) =>
    axiosRestaurantAdmin.get(`/kinalGourmetHouse/v1/dishes/${id}`)

export const createDishRequest = (data) =>
    axiosRestaurantAdmin.post("/kinalGourmetHouse/v1/dishes/", data)

export const updateDishRequest = (id, data) =>
    axiosRestaurantAdmin.put(`/kinalGourmetHouse/v1/dishes/${id}`, data)

export const deleteDishRequest = (id) =>
    axiosRestaurantAdmin.delete(`/kinalGourmetHouse/v1/dishes/${id}`)