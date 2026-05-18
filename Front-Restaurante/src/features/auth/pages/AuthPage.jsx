import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import { Navbar } from '../components/AuthNavbar.jsx'

export const AuthPage = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-700 via-orange-400 to-orange-200">
      
      <Navbar /> 

      <div className="flex flex-1 items-center justify-center">
        {children ? children : <LoginForm />}
      </div>

    </div>
  )
}