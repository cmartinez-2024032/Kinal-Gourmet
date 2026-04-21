import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'

export const AuthPage = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-700 via-orange-400 to-orange-200">
      {children ? children : <LoginForm />}
    </div>
  )
}