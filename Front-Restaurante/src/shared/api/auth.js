import api from './api'

// LOGIN
export const loginRequest = (data) =>
  api.post('/auth/login', data)

// REGISTER
export const registerRequest = (data) =>
  api.post('/auth/register', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

// VERIFY
export const verifyRequest = (token) =>
  api.get(`/auth/verify/${token}`)

// PROFILE
export const profileRequest = () =>
  api.get('/auth/profile')

// LISTAR USUARIOS
export const getUsersRequest = () =>
  api.get('/auth/users', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

// CREAR ADMIN RESTAURANTE
export const createAdminRestaurantRequest = (data) =>
  api.post('/users/create-admin-restaurant', data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

export const removeRestaurantFromAdminRequest = (id) =>
  api.patch(
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
  api.put(`/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

// ELIMINAR ADMIN RESTAURANTE
export const deleteAdminUserRequest = (id) =>
  api.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })