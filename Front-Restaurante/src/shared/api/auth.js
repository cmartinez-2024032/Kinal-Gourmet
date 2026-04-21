import api from './api'

// LOGIN
export const loginRequest = (data) =>
  api.post('/auth/login', data)

// REGISTER
export const registerRequest = (data) =>
  api.post('/auth/register', data)

// VERIFY
export const verifyRequest = (token) =>
  api.get(`/auth/verify/${token}`)

// PROFILE
export const profileRequest = () =>
  api.get('/auth/profile')