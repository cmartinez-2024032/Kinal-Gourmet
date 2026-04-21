import { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate, Link } from 'react-router-dom'

export const RegisterForm = () => {
    const { register, loading, error } = useAuthStore()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password !== form.confirmPassword) return
        const res = await register(form)
        if (res?.success) navigate('/dashboard')
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[20px] p-10 w-full max-w-sm border border-orange-100">

        {/* BADGE + ICONO (igual que LoginForm) */}

        <h2 className="text-2xl font-medium text-center text-gray-900 mb-1">Crear cuenta</h2>
        <p className="text-sm text-gray-400 text-center mb-6">Completa los datos para registrarte</p>

        {/* NOMBRE + APELLIDO */}
        <div className="mb-4">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Nombre completo</label>
        <input type="text" name="name" placeholder="Juan Pérez"
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-[10px] text-sm bg-gray-50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition" />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Correo electrónico</label>
            <input type="email" name="email" placeholder="ejemplo@gmail.com"
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-[10px] text-sm bg-gray-50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition" />
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Contraseña</label>
            <input type="password" name="password" placeholder="••••••••"
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-[10px] text-sm bg-gray-50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition" />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-6">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirmar contraseña</label>
            <input type="password" name="confirmPassword" placeholder="••••••••"
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-[10px] text-sm bg-gray-50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition" />
        </div>

        <button type="submit" disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium py-3 rounded-[10px] text-sm transition active:scale-[0.98]">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        {error && <p className="text-red-500 text-xs mt-4 text-center">{error}</p>}

        <div className="text-center text-sm text-gray-400 mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-orange-600 font-medium hover:underline">
            Iniciar sesión
            </Link>
        </div>
        </form>
    )
}