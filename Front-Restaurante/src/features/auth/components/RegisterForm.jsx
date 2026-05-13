import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, User, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'
import logo from "../../../assets/logo_1.png"

// Mantenemos la misma imagen para consistencia visual
const restaurantImage = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"

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
        if (res?.success) {
            alert("Revisa tu correo para activar tu cuenta")
            navigate("/login")
        }
    }

    return (
        <main className="h-screen w-screen flex overflow-hidden bg-white">
            
            {/* SECCIÓN IZQUIERDA: IMAGEN (Consistente con Login) */}
            <section className="relative hidden lg:flex lg:w-7/12 xl:w-8/12 bg-orange-950">
                <img 
                    src={restaurantImage} 
                    alt="Interior del restaurante" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-transparent to-black/20" />
                
                <div className="relative z-10 p-16 mt-auto mb-12 text-white">
                    <div className="bg-orange-500 w-12 h-1 mb-6 rounded-full" />
                    <h1 className="text-6xl font-bold mb-6 tracking-tight leading-none">
                        Únete a <br /> la excelencia.
                    </h1>
                    <p className="text-orange-100 text-xl max-w-lg leading-relaxed font-light">
                        Forma parte de la red culinaria más exclusiva y gestiona tu experiencia gastronómica desde un solo lugar.
                    </p>
                </div>
            </section>

            {/* SECCIÓN DERECHA: FORMULARIO DE REGISTRO */}
            <section className="w-full lg:w-5/12 xl:w-4/12 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-12 xl:px-20 bg-white pt-20">
                
                <div className="max-w-md w-full mx-auto overflow-y-auto max-h-screen py-8 no-scrollbar">
                    <header className="mb-8 text-center lg:text-left">
                        <header className="mb-8 text-center"> 
                            {/* 1. Eliminamos lg:mx-0 para que mx-auto mande siempre */}
                            <img 
                                src={logo} 
                                alt="Logo" 
                                className="h-26 w-auto mb-6 mx-auto" 
                            />
                            
                            {/* 2. El contenedor o los textos ya heredan el text-center del header */}
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Crea tu cuenta
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Completa tus datos para empezar.
                            </p>
                        </header>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* NOMBRE */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Nombre Completo</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                                <input
                                    type="text" name="name" required
                                    placeholder="Juan Pérez"
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Correo electrónico</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                                <input
                                    type="email" name="email" required
                                    placeholder="ejemplo@kinal.edu.gt"
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                                <input
                                    type="password" name="password" required
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider ml-1">Confirmar contraseña</label>
                            <div className="relative group">
                                <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={18} />
                                <input
                                    type="password" name="confirmPassword" required
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* BOTÓN REGISTRO */}
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 mt-4"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    Registrar cuenta
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                            <p className="text-red-700 text-xs font-medium">{error}</p>
                        </div>
                    )}

                    <footer className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            ¿Ya tienes una cuenta activa? <br />
                            <Link to="/login" className="text-orange-600 font-bold hover:underline inline-flex items-center mt-2">
                                Iniciar sesión ahora
                            </Link>
                        </p>
                    </footer>
                </div>
            </section>
        </main>
    )
}