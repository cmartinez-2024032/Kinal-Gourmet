import { Navbar } from '../../shared/components/layout/Navbar'

export const DashboardLayout = ({ children }) => {
    return (
        <div>
        <Navbar />

        <main style={{ padding: '2rem' }}>
            {children}
        </main>
        </div>
    )
}