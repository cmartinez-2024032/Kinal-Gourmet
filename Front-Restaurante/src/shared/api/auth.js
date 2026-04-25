import{ axiosAuth } from './api'

// LOGIN
export const loginRequest = (data) =>
  axiosAuth.post('/auth/login', data)

// REGISTER
export const registerRequest = (data) =>
  axiosAuth.post('/auth/register', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

// VERIFY
export const verifyRequest = (token) =>
  axiosAuth.get(`/auth/verify/${token}`)

// PROFILE
export const profileRequest = () =>
  axiosAuth.get('/auth/profile')

// LISTAR USUARIOS
export const getUsersRequest = () =>
  axiosAuth.get('/auth/users', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

// CREAR ADMIN RESTAURANTE
export const createAdminRestaurantRequest = (data) =>
  axiosAuth.post('/users/create-admin-restaurant', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

export const removeRestaurantFromAdminRequest = (id) =>
  axiosAuth.patch(
    `/users/${id}/assign-restaurant`,
    {
      restaurantId: null
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  )

// ACTUALIZAR ADMIN RESTAURANTE
export const updateAdminUserRequest = (id, data) =>
  axiosAuth.put(`/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

// ELIMINAR ADMIN RESTAURANTE
export const deleteAdminUserRequest = (id) =>
  axiosAuth.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })