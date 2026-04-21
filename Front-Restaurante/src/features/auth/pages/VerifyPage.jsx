import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { verifyRequest } from '../../../shared/api/auth'

export const VerifyPage = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('')

    useEffect(() => {
        verifyRequest(token)
        .then((res) => {
            setMessage(res.data.message)
            setStatus('success')
        })
        .catch(() => {
            setMessage('El enlace expiró o no es válido.')
            setStatus('error')
        })
    }, [token])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-700 via-orange-400 to-orange-200">
        <div className="bg-white rounded-[20px] p-10 w-full max-w-sm border border-orange-100 text-center">

            {/* ÍCONO según estado */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 border-2 ${
            status === 'loading' ? 'bg-orange-50 border-orange-200' :
            status === 'success' ? 'bg-green-50 border-green-300' :
            'bg-red-50 border-red-300'
            }`}>
            {status === 'loading' && (
                <div className="w-7 h-7 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
            )}
            {status === 'success' && (
                <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
                </svg>
            )}
            {status === 'error' && (
                <svg className="w-7 h-7 text-red-700" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            )}
            </div>

            {/* BADGE */}
            <div className="flex justify-center mb-4">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${
                status === 'loading' ? 'bg-orange-50 text-orange-800 border-orange-200' :
                status === 'success' ? 'bg-green-50 text-green-800 border-green-200' :
                'bg-red-50 text-red-800 border-red-200'
            }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                status === 'loading' ? 'bg-orange-400' :
                status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}/>
                {status === 'loading' ? 'Procesando' : status === 'success' ? 'Verificado' : 'Token inválido'}
            </span>
            </div>

            {/* TÍTULO */}
            <h2 className="text-xl font-medium text-gray-900 mb-2">
            {status === 'loading' && 'Verificando cuenta'}
            {status === 'success' && '¡Cuenta activada!'}
            {status === 'error'   && 'No se pudo verificar'}
            </h2>

            {/* MENSAJE */}
            <p className="text-sm text-gray-400 mb-6">
            {status === 'loading' ? 'Estamos validando tu enlace, un momento...' : message}
            </p>

            {/* BOTÓN */}
            {status === 'success' && (
            <Link to="/login"
                className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-[10px] text-sm transition">
                Ir al login
            </Link>
            )}
            {status === 'error' && (
            <Link to="/login"
                className="block w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-[10px] text-sm transition">
                Volver al login
            </Link>
            )}

        </div>
        </div>
    )
}