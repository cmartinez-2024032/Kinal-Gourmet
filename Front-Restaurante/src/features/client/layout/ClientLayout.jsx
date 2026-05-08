import { Outlet } from "react-router-dom";
import { ClientNavbar } from "./ClientNavbar";
import { CartDrawer } from "../components/CartDrawer.jsx";

export const ClientLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Navbar fijo arriba */}
            <ClientNavbar />
            
            <main className="flex-1 w-full">
                <Outlet />
            </main>

            {/* Drawer del carrito */}
            <CartDrawer />
        </div>
    );
};