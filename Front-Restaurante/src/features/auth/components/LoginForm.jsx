import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'

export const LoginForm = () => {
    const { login, loading, error, user } = useAuthStore()
    const navigate = useNavigate()

    const [form, setForm] = useState({ email: '', password: '' })

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await login(form)

        if (res?.success) {
            const role = res.user.role.name

            if (role === "ADMIN_GENERAL") {
                navigate("/adminGeneral")
            } else if (role === "ADMIN_RESTAURANTE") {
            navigate("/adminRestaurante")
            } else {
                navigate("/dashboard")
            }
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-[20px] p-10 w-full max-w-sm border border-orange-100">

            {/* BRAND ICON */}
            <div className="flex justify-center mb-4">
                <div className="w-13 h-13 bg-orange-400 rounded-[14px] flex items-center justify-center p-3">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                    <path strokeLinecap="round" d="M8 12h8M12 8v8"/>
                </svg>
                </div>
            </div>

            {/* BADGE */}
            <div className="flex justify-center mb-5">
                <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full border border-orange-200">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block"/>
                Kinal Gourmet House
                </span>
            </div>

            <h2 className="text-2xl font-medium text-center text-gray-900 mb-1">
                Bienvenido de vuelta
            </h2>
            <p className="text-sm text-gray-400 text-center mb-7">
                Ingresa tus credenciales para continuar
            </p>

            {/* EMAIL */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide">
                Correo electrónico
                </label>
                <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400">
                    <Mail size={15} />
                </span>
                <input
                    type="email" name="email"
                    placeholder="ejemplo@gmail.com"
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-[10px] text-sm bg-gray-50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition"
                />
                </div>
            </div>

            {/* PASSWORD */}
            <div className="mb-6">
                <label className="block text-xs font-medium text-gray-500 mb-1.5 tracking-wide">
                Contraseña
                </label>
                <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400">
                    <Lock size={15} />
                </span>
                <input
                    type="password" name="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-[10px] text-sm bg-gray-50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:bg-white transition"
                />
                </div>
            </div>

            {/* BOTÓN */}
            <button
                type="submit" disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium py-3 rounded-[10px] text-sm tracking-wide transition active:scale-[0.98]"
            >
                {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>

            {error && (
                <p className="text-red-500 text-xs mt-4 text-center">{error}</p>
            )}

            <div className="text-center text-sm text-gray-400 mt-4">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-orange-600 font-medium hover:underline">
                    Crear cuenta
                </Link>
            </div>

        </form>

        
    )
}