import { Routes, Route } from 'react-router-dom'

// Auth
import { AuthPage }      from '../../features/auth/pages/AuthPage'
import { VerifyPage }    from '../../features/auth/pages/VerifyPage'
import { RegisterForm }  from '../../features/auth/components/RegisterForm'
import { LandingPage }   from '../../features/auth/pages/LandingPage'

// Dashboard
import { DashboardPage }   from '../pages/DashboardPage'
import { DashboardLayout } from '../layouts/DashboardLayout'

// Admin General
import { AdminGeneralLayout } from '../../features/admin-general/layout/AdminGeneralLayout'
import { AdminGeneralPage }   from '../../features/admin-general/pages/AdminGeneralPage.jsx'
import { RestaurantesPage }   from '../../features/admin-general/pages/AdminRestaurantesPage.jsx'

// Admin Restaurante
import { AdminRestLayout } from '../../features/admin-restaurante/layout/AdminRestLayout.jsx'
import { PlatilloPage }    from '../../features/admin-restaurante/pages/PlatilloPage.jsx'
import { MesaPage }        from '../../features/admin-restaurante/pages/MesaPage.jsx'
import { CuponPage } from '../../features/admin-restaurante/pages/CuponPage.jsx'
import PromotionPage from '../../features/admin-restaurante/pages/PromotionPage.jsx'
import { PrivateRoute } from './PrivateRoute'

export const AppRoutes = () => {
    return (
        <Routes>

            {/* Públicas */}
            <Route path="/"               element={<LandingPage />} />
            <Route path="*"               element={<LandingPage />} />
            <Route path="/login"          element={<AuthPage />} />
            <Route path="/register"       element={<AuthPage><RegisterForm /></AuthPage>} />
            <Route path="/verify/:token"  element={<VerifyPage />} />

            {/* Dashboard */}
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

            {/* Admin General */}
            <Route
                path="/adminGeneral"
                element={
                    <PrivateRoute>
                        <AdminGeneralLayout />
                    </PrivateRoute>
                }
            >
                <Route index              element={<AdminGeneralPage />} />
                <Route path="restaurantes" element={<RestaurantesPage />} />
            </Route>

            {/* Admin Restaurante */}
            <Route
                path="/adminRestaurante"
                element={
                    <PrivateRoute>
                        <AdminRestLayout />
                    </PrivateRoute>
                }
            >
                <Route index           element={<div>Resumen</div>} />
                <Route path="platillos" element={<PlatilloPage />} />
                <Route path="mesas"     element={<MesaPage />} />
                <Route path="cupones"   element={<CuponPage />} />
                <Route path= "promociones" element={<PromotionPage/>}/>
            </Route>

        </Routes>
    )
}