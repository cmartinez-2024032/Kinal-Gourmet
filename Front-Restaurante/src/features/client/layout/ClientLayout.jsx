import { Outlet } from "react-router-dom";
import { ClientNavbar } from "./ClientNavbar";
import { CartDrawer } from "../components/CartDrawer";

export const ClientLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Navbar fijo arriba */}
            <ClientNavbar />

            {/* Contenido de cada página */}
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
                <Outlet />
            </main>

            {/* Drawer del carrito */}
            <CartDrawer />
        </div>
    );
};