import ReactDOM from "react-dom";
import { useCartStore } from "../store/useCartStore";
import { useState } from "react";
import { axiosRestaurante } from "../../../shared/api/api";

/**
 * InvoiceModal — Flujo de pago multi-paso
 *
 * Paso 1 (solo DOMICILIO): Solicita dirección y teléfono de entrega
 * Paso 2: Datos de facturación + confirmación de pago
 *
 * Para PARA_LLEVAR va directo al paso 2.
 */
export const InvoiceModal = ({ isOpen, onClose, onConfirm }) => {
    const {
        items,
        getFinalTotal,
        restaurantName,
        discountAmount,
        orderType,
        deliveryAddress,
        deliveryPhone,
        setDeliveryAddress,
        setDeliveryPhone,
        buildCheckoutPayload,
    } = useCartStore();

    // ── Paso actual ──────────────────────────────────────────────
    // "delivery" solo aparece si orderType === "DOMICILIO"
    // "billing"  es siempre el último paso
    const [step, setStep] = useState("billing");

    // Reiniciar al paso correcto cuando el modal se abre
    const initialStep = orderType === "DOMICILIO" ? "delivery" : "billing";

    // Usamos un "key" de apertura para reiniciar el step al abrir
    // (se hace con un useEffect implícito al cambiar isOpen)

    // ── Estado del formulario de facturación ────────────────────
    const [invoiceData, setInvoiceData] = useState({
        nit:           "CF",
        name:          "",
        email:         "",
        paymentMethod: "EFECTIVO",
        notes:         "",
    });

    const [nitError, setNitError]   = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError]   = useState("");

    // ── Estado del formulario de domicilio ───────────────────────
    const [localAddress, setLocalAddress] = useState(deliveryAddress || "");
    const [localPhone,   setLocalPhone]   = useState(deliveryPhone   || "");
    const [deliveryError, setDeliveryError] = useState("");

    if (!isOpen) return null;

    // ── Validación NIT ────────────────────────────────────────────
    const handleNitChange = (e) => {
        const value = e.target.value.toUpperCase();

        if (value === "" || value === "C" || value === "CF") {
            setNitError("");
            setInvoiceData({ ...invoiceData, nit: value });
            return;
        }

        const onlyNums = value.replace(/[^0-9]/g, "");
        if (onlyNums.length <= 13) {
            setInvoiceData({ ...invoiceData, nit: onlyNums });
            setNitError(onlyNums.length > 0 && onlyNums.length < 13 ? "El NIT debe tener 13 dígitos" : "");
        }
    };

    // ── Paso 1: Confirmar dirección ───────────────────────────────
    const handleDeliveryNext = () => {
        if (!localAddress.trim()) {
            setDeliveryError("La dirección es requerida para envío a domicilio");
            return;
        }
        if (!localPhone.trim()) {
            setDeliveryError("El teléfono de contacto es requerido");
            return;
        }
        setDeliveryError("");
        // Persistir en el store para que buildCheckoutPayload lo tome
        setDeliveryAddress(localAddress.trim());
        setDeliveryPhone(localPhone.trim());
        setStep("billing");
    };

    // ── Paso 2: Enviar al backend ─────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        if (invoiceData.nit !== "CF" && invoiceData.nit.length !== 13) {
            setNitError("Por favor, ingrese un NIT válido (13 dígitos) o CF");
            return;
        }

        setIsLoading(true);

        try {
            const payload = buildCheckoutPayload(invoiceData);
            const response = await axiosRestaurante.post(
                "/kinalGourmetHouse/v1/checkout/process",
                payload
            );

            if (response.data.success) {
                onConfirm(response.data);
                onClose();
            } else {
                setApiError(response.data.message || "Error al procesar el pago");
            }
        } catch (err) {
            console.error("Error en checkout:", err);
            console.error("Respuesta del servidor:", err.response?.data);
            setApiError(err.response?.data?.message || "Error de conexión con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    // ── Etiqueta del tipo de orden ────────────────────────────────
    const orderTypeLabel = {
        PARA_LLEVAR: "🥡 Para llevar",
        DOMICILIO:   "🛵 Envío a domicilio",
    }[orderType] || orderType;

    // ── Render ────────────────────────────────────────────────────
    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-[#F8F8F8] w-full max-w-6xl rounded-[45px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300 max-h-[90vh]">

                {/* ── COLUMNA IZQUIERDA: Resumen del pedido ── */}
                <div className="w-full md:w-5/12 p-8 overflow-y-auto custom-scrollbar bg-[#F8F8F8]">
                    <div className="mb-6">
                        <h3 className="text-3xl font-[900] uppercase tracking-tighter">Tu Pedido</h3>
                        <div className="h-1 w-12 bg-orange-500 mt-1 rounded-full" />
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-2">
                            {orderTypeLabel}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.dishId} className="flex items-center gap-4 p-2">
                                <div className="relative">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded-[25px] shadow-md"
                                    />
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-[900] uppercase text-black leading-tight">{item.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Q{item.unitPrice.toFixed(2)} c/u</p>
                                </div>
                                <p className="text-sm font-[900] text-black">
                                    Q{(item.quantity * item.unitPrice).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Totales */}
                    <div className="mt-8 pt-6 border-t border-gray-200 space-y-2">
                        <div className="flex justify-between text-gray-400 text-[11px] font-[900] uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span>Q{(getFinalTotal() + discountAmount).toFixed(2)}</span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-red-500 text-[11px] font-[900] uppercase tracking-widest">
                                <span>Descuento</span>
                                <span>- Q{discountAmount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex flex-col items-end pt-6">
                            <span className="text-[10px] font-[900] uppercase text-gray-400 tracking-[0.2em]">Total a Pagar</span>
                            <div className="flex items-baseline">
                                <span className="text-xl font-[900] mr-1">Q</span>
                                <span className="text-5xl font-[900] text-black tracking-tighter">{getFinalTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info de domicilio confirmada */}
                    {orderType === "DOMICILIO" && step === "billing" && (
                        <div className="mt-6 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                            <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1">Dirección de entrega</p>
                            <p className="text-sm font-bold text-black">{localAddress || deliveryAddress}</p>
                            <p className="text-xs text-gray-500 mt-1">📞 {localPhone || deliveryPhone}</p>
                            <button
                                type="button"
                                onClick={() => setStep("delivery")}
                                className="mt-2 text-[9px] font-black text-orange-500 uppercase tracking-widest hover:underline"
                            >
                                Cambiar dirección
                            </button>
                        </div>
                    )}
                </div>

                {/* ── COLUMNA DERECHA: Formulario dinámico por paso ── */}
                <div className="w-full md:w-7/12 p-10 bg-white flex flex-col justify-center">

                    {/* ── PASO 1: Dirección de domicilio ── */}
                    {step === "delivery" && (
                        <div>
                            <div className="mb-8">
                                <h3 className="text-[32px] font-[900] uppercase tracking-tighter leading-none">
                                    Dirección de Entrega
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
                                    ¿Dónde llevamos tu pedido?
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-[900] uppercase text-gray-400 ml-2 tracking-widest">
                                        Dirección completa
                                    </label>
                                    <input
                                        type="text"
                                        value={localAddress}
                                        onChange={(e) => setLocalAddress(e.target.value)}
                                        placeholder="Ej: 5a Avenida 12-34, Zona 1"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-[22px] p-4 text-sm font-black focus:bg-white focus:border-black transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-[900] uppercase text-gray-400 ml-2 tracking-widest">
                                        Teléfono de contacto
                                    </label>
                                    <input
                                        type="tel"
                                        value={localPhone}
                                        onChange={(e) => setLocalPhone(e.target.value)}
                                        placeholder="Ej: 5555-1234"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-[22px] p-4 text-sm font-black focus:bg-white focus:border-black transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-[900] uppercase text-gray-400 ml-2 tracking-widest">
                                        Indicaciones adicionales (opcional)
                                    </label>
                                    <input
                                        type="text"
                                        value={invoiceData.notes}
                                        onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                                        placeholder="Ej: Apartamento 3B, tocar el timbre"
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-[22px] p-4 text-sm font-black focus:bg-white focus:border-black transition-all outline-none"
                                    />
                                </div>

                                {deliveryError && (
                                    <p className="text-[10px] text-red-500 font-bold ml-3 uppercase tracking-tighter">
                                        ⚠ {deliveryError}
                                    </p>
                                )}

                                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 py-5 text-[11px] font-[900] uppercase text-gray-400 hover:text-black transition-colors tracking-widest"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeliveryNext}
                                        className="flex-[2] py-5 bg-black text-white rounded-[24px] text-[11px] font-[900] uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 hover:bg-orange-600"
                                    >
                                        Continuar →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── PASO 2: Datos de facturación ── */}
                    {step === "billing" && (
                        <div>
                            <div className="mb-8">
                                <h3 className="text-[32px] font-[900] uppercase tracking-tighter leading-none">
                                    Detalles de Facturación
                                </h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">
                                    Estás comprando en: <span className="text-black">{restaurantName}</span>
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-[900] uppercase text-gray-400 ml-2 tracking-widest">NIT / Identificación</label>
                                        <input
                                            type="text"
                                            value={invoiceData.nit}
                                            onChange={handleNitChange}
                                            placeholder="CF o 13 dígitos"
                                            className={`w-full bg-gray-50 border-2 rounded-[22px] p-4 text-sm font-black transition-all outline-none
                                                ${nitError ? 'border-red-500' : 'border-transparent focus:border-black focus:bg-white'}`}
                                        />
                                        {nitError && <p className="text-[9px] text-red-500 font-bold ml-3 uppercase tracking-tighter">{nitError}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-[900] uppercase text-gray-400 ml-2 tracking-widest">Nombre Factura</label>
                                        <input
                                            type="text"
                                            required
                                            value={invoiceData.name}
                                            placeholder="Nombre completo"
                                            onChange={(e) => setInvoiceData({ ...invoiceData, name: e.target.value })}
                                            className="w-full bg-gray-50 border-2 border-transparent rounded-[22px] p-4 text-sm font-black focus:bg-white focus:border-black transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-[900] uppercase text-gray-400 ml-2 tracking-widest">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        required
                                        value={invoiceData.email}
                                        placeholder="Para enviar tu factura"
                                        onChange={(e) => setInvoiceData({ ...invoiceData, email: e.target.value })}
                                        className="w-full bg-gray-50 border-2 border-transparent rounded-[22px] p-4 text-sm font-black focus:bg-white focus:border-black transition-all outline-none"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-[900] uppercase text-gray-400 ml-2 tracking-widest">Método de Pago</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'WALLET'].map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setInvoiceData({ ...invoiceData, paymentMethod: m })}
                                                className={`py-4 rounded-[18px] text-[9px] font-[900] uppercase border-2 transition-all
                                                    ${invoiceData.paymentMethod === m
                                                        ? 'bg-black text-white border-black shadow-lg shadow-black/20'
                                                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {apiError && (
                                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                                        <p className="text-[10px] text-red-600 font-bold uppercase tracking-tighter">⚠ {apiError}</p>
                                    </div>
                                )}

                                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                                    {/* Si es DOMICILIO, permite volver al paso anterior */}
                                    {orderType === "DOMICILIO" ? (
                                        <button
                                            type="button"
                                            onClick={() => setStep("delivery")}
                                            className="flex-1 py-5 text-[11px] font-[900] uppercase text-gray-400 hover:text-black transition-colors tracking-widest"
                                        >
                                            ← Dirección
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 py-5 text-[11px] font-[900] uppercase text-gray-400 hover:text-black transition-colors tracking-widest"
                                        >
                                            Cancelar
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!!nitError || isLoading}
                                        className={`flex-[2] py-5 text-white rounded-[24px] text-[11px] font-[900] uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95
                                            ${nitError || isLoading
                                                ? 'bg-gray-300 cursor-not-allowed shadow-none'
                                                : 'bg-orange-600 shadow-orange-600/30 hover:bg-black'}`}
                                    >
                                        {isLoading ? "Procesando..." : `Pagar Q${getFinalTotal().toFixed(2)}`}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};