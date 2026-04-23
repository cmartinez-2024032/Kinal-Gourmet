import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthPage } from '../../features/auth/pages/AuthPage'
import { VerifyPage } from '../../features/auth/pages/VerifyPage'
import { DashboardPage } from '../pages/DashboardPage'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { PrivateRoute } from './PrivateRoute'

import { RegisterForm } from '../../features/auth/components/RegisterForm'
import { LandingPage } from '../../features/auth/pages/LandingPage'
import{AdminGeneralPage} from '../../features/admin-general/pages/AdminGeneralPage.jsx'
export const AppRoutes = () => {
    return (
        <Routes>
        <Route path="/" element={<LandingPage />} /> 
        <Route path="*" element={<LandingPage />} /> 
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage><RegisterForm /></AuthPage>} />
        <Route path="/verify/:token" element={<VerifyPage />} />

        <Route
            path="/dashboard"
            element={
            <PrivateRoute>
                <DashboardLayout>
                <DashboardPage />
                </DashboardLayout>
            </PrivateRoute>
            }
        />

        <Route
            path="/adminGeneral"
            element={
            <PrivateRoute>
                <DashboardLayout>
                <AdminGeneralPage />
                </DashboardLayout>
            </PrivateRoute>
            }
        />
        </Routes>
    )
}