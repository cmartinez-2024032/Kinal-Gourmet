import { create } from 'zustand'
import { loginRequest, registerRequest, profileRequest } from '../../../shared/api/auth'

export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,

    login: async (data) => {
        try {
        set({ loading: true, error: null })

        const res = await loginRequest(data)

        localStorage.setItem('token', res.data.token)

        set({
            user: res.data.user,
            token: res.data.token,
            loading: false
        })

        return { success: true }

        } catch (err) {
        set({
            error: err.response?.data?.message || 'Error en login',
            loading: false
        })
        }
    },

    register: async (data) => {
        try {
        set({ loading: true, error: null })

        await registerRequest(data)

        set({ loading: false })

        return { success: true }

        } catch (err) {
        set({
            error: err.response?.data?.message || 'Error en registro',
            loading: false
        })
        }
    },

    getProfile: async () => {
        try {
        const res = await profileRequest()
        set({ user: res.data.user })
        } catch (error) {
        localStorage.removeItem('token')
        set({ user: null, token: null })
        }
    },

    logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
    }
}))