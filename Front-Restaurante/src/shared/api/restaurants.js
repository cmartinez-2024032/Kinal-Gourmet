import { axiosRestaurantAdmin } from "./api"

export const getRestaurantsRequest = () =>
  axiosRestaurantAdmin.get("/kinalGourmetHouse/v1/restaurants/")

export const getRestaurantByIdRequest = (id) =>
  axiosRestaurantAdmin.get(`/kinalGourmetHouse/v1/restaurants/${id}`)

export const createRestaurantRequest = (data) =>
  axiosRestaurantAdmin.post(
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
  axiosRestaurantAdmin.put(
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
  axiosRestaurantAdmin.delete(`/kinalGourmetHouse/v1/restaurants/${id}`)