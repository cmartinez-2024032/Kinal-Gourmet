import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { resetPasswordRequest } from '../../../shared/api/auth'
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  ArrowLeft
} from 'lucide-react'

import logo from "../../../assets/logo_1.png"

const restaurantImage =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"

export const ResetPasswordPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirm: ''
  })

  const [showPass, setShowPass] = useState({
    new: false,
    confirm: false
  })

  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (passwords.newPassword.trim().length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres.')
      setStatus('error')
      return
    }

    if (passwords.newPassword !== passwords.confirm) {
      setMessage('Las contraseñas no coinciden.')
      setStatus('error')
      return
    }

    try {
      setStatus('loading')

      const res = await resetPasswordRequest(
        token,
        passwords.newPassword
      )

      setMessage(res.data.message)
      setStatus('success')

      setTimeout(() => {
        navigate('/login')
      }, 2500)

    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        'Token inválido o expirado.'
      )

      setStatus('error')
    }
  }

  return (
    <main className="h-screen w-screen flex overflow-hidden bg-white">

      {/* IZQUIERDA */}
      <section className="relative hidden lg:flex lg:w-7/12 xl:w-8/12 bg-orange-950">

        <img
          src={restaurantImage}
          alt="Restaurant"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 via-transparent to-black/20" />

        <div className="relative z-10 p-16 mt-auto mb-12">
          <div className="bg-orange-500 w-12 h-1 mb-6 rounded-full" />

          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight leading-none">
            Restablece <br /> tu contraseña.
          </h1>

          <p className="text-orange-100 text-xl max-w-lg leading-relaxed font-light">
            Crea una nueva contraseña segura para proteger tu cuenta
            y continuar disfrutando de Kinal Gourmet House.
          </p>
        </div>

        <div
          className="absolute top-10 right-10 w-32 h-32 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
      </section>

      {/* DERECHA */}
      <section className="w-full lg:w-5/12 xl:w-4/12 flex flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-12 xl:px-20 bg-white">

        <div className="max-w-md w-full mx-auto">

          {/* HEADER */}
          <div className="mb-10 text-center">

            <img
              src={logo}
              alt="Logo"
              className="h-24 w-auto mb-6 mx-auto"
            />

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mb-5">
              <ShieldCheck size={30} />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Nueva contraseña
            </h1>

            <p className="text-gray-500 text-sm leading-relaxed">
              Elige una contraseña segura para tu cuenta.
            </p>
          </div>

          {/* SUCCESS */}
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-3xl p-6 text-center">

              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <ShieldCheck className="text-green-600" size={28} />
                </div>
              </div>

              <h2 className="text-lg font-bold text-green-700 mb-2">
                Contraseña actualizada
              </h2>

              <p className="text-sm text-green-700 leading-relaxed">
                {message}
              </p>

              <p className="text-xs text-green-600 mt-3">
                Redirigiendo al login...
              </p>

            </div>
          ) : (

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* NUEVA PASSWORD */}
              <div className="space-y-2">

                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Nueva contraseña
                </label>

                <div className="relative group">

                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors"
                    size={20}
                  />

                  <input
                    type={showPass.new ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="Mínimo 6 caracteres"
                    value={passwords.newPassword}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPass((p) => ({
                        ...p,
                        new: !p.new
                      }))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                  >
                    {showPass.new
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                    }
                  </button>
                </div>
              </div>

              {/* CONFIRMAR */}
              <div className="space-y-2">

                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Confirmar contraseña
                </label>

                <div className="relative group">

                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors"
                    size={20}
                  />

                  <input
                    type={showPass.confirm ? 'text' : 'password'}
                    name="confirm"
                    placeholder="Repite tu contraseña"
                    value={passwords.confirm}
                    onChange={handleChange}
                    disabled={status === 'loading'}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPass((p) => ({
                        ...p,
                        confirm: !p.confirm
                      }))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                  >
                    {showPass.confirm
                      ? <EyeOff size={20} />
                      : <Eye size={20} />
                    }
                  </button>
                </div>

                {passwords.confirm &&
                  passwords.newPassword !== passwords.confirm && (
                    <p className="text-red-500 text-sm ml-1">
                      Las contraseñas no coinciden
                    </p>
                )}
              </div>

              {/* ERROR */}
              {status === 'error' && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4">
                  <p className="text-red-700 text-sm font-medium">
                    {message}
                  </p>
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Guardando...
                  </>
                ) : (
                  'Cambiar contraseña'
                )}
              </button>

            </form>
          )}

          {/* FOOTER */}
          <footer className="mt-10 text-center">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
            >
              <ArrowLeft size={18} />
              Volver al inicio de sesión
            </Link>

          </footer>
        </div>
      </section>
    </main>
  )
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      