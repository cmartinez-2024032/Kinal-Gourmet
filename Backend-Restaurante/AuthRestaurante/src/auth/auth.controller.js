import * as authService from './auth.service.js'

export const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await authService.loginUser(email, password)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const verify = async (req, res) => {
  try {
    const { token } = req.params  // ← ahora viene del path
    const result = await authService.verifyAccount(token)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await authService.getUsers()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const result = await authService.forgotPasswordService(email)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { newPassword } = req.body
    const result = await authService.resetPasswordService(token, newPassword)
    res.status(200).json(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}