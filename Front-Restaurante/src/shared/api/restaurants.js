import { axiosRestaurante } from "./api"

export const getRestaurantsRequest = () =>
  axiosRestaurante.get("/kinalGourmetHouse/v1/restaurants/")

export const getRestaurantByIdRequest = (id) =>
  axiosRestaurante.get(`/kinalGourmetHouse/v1/restaurants/${id}`)

export const createRestaurantRequest = (data) =>
  axiosRestaurante.post(
    "/kinalGourmetHouse/v1/restaurants/create",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  )

export const updateRestaurantRequest = (id, data) =>
  axiosRestaurante.put(
    `/kinalGourmetHouse/v1/restaurants/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  )

export const deleteRestaurantRequest = (id) =>
  axiosRestaurante.delete(`/kinalGourmetHouse/v1/restaurants/${id}`)