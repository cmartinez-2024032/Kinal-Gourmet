import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import logo from "../../../assets/logo_1.png"

// Imagen sugerida para el ambiente de restaurante
const restaurantImage = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"

export const LoginForm = () => {
    const { login, loading, error } = useAuthStore()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await login(form)

        if (res?.success) {
            const role = res.user?.role?.name || res.user?.Role?.name
            if (role === "ADMIN_GENERAL") navigate("/adminGeneral")
            else if (role === "ADMIN_RESTAURANTE") navigate("/adminRestaurante")
            else navigate("/client")
        }
    }

    return (
        /* Contenedor que ocupa el 100% de la pantalla sin scroll */
        <main className="h-screen w-screen flex overflow-hidden bg-white">
            
            {/* SECCIÓN IZQUIERDA: IMAGEN A PANTALLA COMPLETA */}
            <section className="relative hidden lg:flex lg:w-7/12 xl:w-8/12 bg-orange-950">
                <img 
                    src={restaurantImage} 
                    alt="Interior del restaurante" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                {/* Overlay gradiente para mejorar legibilidad del texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-transparent to-black/20" />
                
                {/* Contenido flotante sobre la imagen */}
                <div className="relative z-10 p-16 mt-auto mb-12">
                    <div className="bg-orange-500 w-12 h-1 mb-6 rounded-full" />
                    <h1 className="text-6xl font-bold text-white mb-6 tracking-tight leading-none">
                        Kinal <br /> Gourmet House.
                    </h1>
                    <p className="text-orange-100 text-xl max-w-lg leading-relaxed font-light">
                        Gestiona cada detalle de tu cocina y servicio con una plataforma diseñada para la excelencia gastronómica.
                    </p>
                </div>

                {/* Decoración de puntos (rejilla) */}
                <div className="absolute top-10 right-10 w-32 h-32 opacity-20" 
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </section>

            {/* SECCIÓN DERECHA: FORMULARIO CENTRADO */}
            <section className="w-full lg:w-5/12 xl:w-4/12 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-12 xl:px-20 bg-white">
                
                <div className="max-w-md w-full mx-auto">
                    {/* Header del Formulario */}
                    <header className="mb-10 text-center lg:text-left">
                        <header className="mb-8 text-center"> 
                            {/* 1. Eliminamos lg:mx-0 para que mx-auto mande siempre */}
                            <img 
                                src={logo} 
                                alt="Logo" 
                                className="h-26 w-auto mb-6 mx-auto" 
                            />
                            
                            {/* 2. El contenedor o los textos ya heredan el text-center del header */}
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Inicia Sesión
                            </h2>
                            <p className="text-gray-500 text-sm">
                                Por favor, ingresa tus credenciales.
                            </p>
                        </header>
                    </header>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* INPUT EMAIL */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 ml-1">Correo electrónico</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                                <input
                                    type="email" name="email" required
                                    placeholder="chef@kinal.edu.gt"
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* INPUT PASSWORD */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-semibold text-gray-700">Contraseña</label>
                                <button type="button" className="text-xs font-bold text-orange-600 hover:text-orange-700">¿Olvidaste tu contraseña?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors" size={20} />
                                <input
                                    type="password" name="password" required
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* BOTÓN DE ACCIÓN */}
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>
                                    Iniciar Sesión
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Footer del Formulario */}
                    <footer className="mt-12 text-center">
                        <p className="text-gray-500 text-sm">
                            ¿No tienes cuenta? <br />
                            <Link to="/register" className="text-orange-600 font-bold hover:underline inline-flex items-center mt-2">
                                Crear Cuenta
                            </Link>
                        </p>
                    </footer>
                </div>
            </section>
        </main>
    )
}