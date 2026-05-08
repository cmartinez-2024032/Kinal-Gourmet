import axios from 'axios'

const axiosAuth = axios.create({
  baseURL: 'http://localhost:3005/api'
})

const axiosRestaurante = axios.create({
  baseURL: "http://localhost:3006"
})



axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})



axiosRestaurante.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { axiosAuth, axiosRestaurante }