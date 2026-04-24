import axios from "axios"

const restaurantsApi = axios.create({
  baseURL: "http://localhost:3006"
})

restaurantsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getRestaurantsRequest = () =>
  restaurantsApi.get("/kinalGourmetHouse/v1/restaurants/")

export const getRestaurantByIdRequest = (id) =>
  restaurantsApi.get(`/kinalGourmetHouse/v1/restaurants/${id}`)

export const createRestaurantRequest = (data) =>
  restaurantsApi.post("/kinalGourmetHouse/v1/restaurants/create", data)