import axios from 'axios'

const axiosAuth = axios.create({
  baseURL: 'http://localhost:3005/api'
})

const axiosRestaurantAdmin = axios.create({
  baseURL: "http://localhost:3006"
})

const axiosPlatillos = axios.create({
  baseURL: "http://localhost:3006"
})

axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosRestaurantAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosPlatillos.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { axiosAuth, axiosRestaurantAdmin, axiosPlatillos }