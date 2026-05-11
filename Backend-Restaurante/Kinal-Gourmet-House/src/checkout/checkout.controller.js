import mongoose from "mongoose";
import Order from "../orders/order.model.js";
import Invoice from "../invoices/invoice.model.js";

/**
 * Genera el número de factura antes de guardar.
 * Se hace fuera de cualquier transacción para evitar conflictos.
 */
const generateInvoiceNumber = async (series = "A") => {
    const count = await Invoice.countDocuments();
    const year  = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    return `${series}-${year}${month}-${String(count + 1).padStart(6, "0")}`;
};

export const checkout = async (req, res) => {
    // Variables para rollback manual si algo falla a mitad del proceso
    let savedOrder   = null;
    let savedInvoice = null;

    try {
        const {
            orderData,
            customerInfo,
            restaurantInfo,
            paymentMethod,
            amountPaid,
            couponCode,
        } = req.body;

        // ── Validaciones básicas ─────────────────────────────────────
        if (!orderData?.restaurant) {
            return res.status(400).json({ success: false, message: "Falta el restaurante en la orden" });
        }
        if (!orderData?.details?.length) {
            return res.status(400).json({ success: false, message: "La orden no tiene productos" });
        }
        if (!customerInfo?.name || !customerInfo?.email) {
            return res.status(400).json({ success: false, message: "Falta información del cliente" });
        }

        // ── Validación según tipo de orden ───────────────────────────
        const orderType = orderData.orderType || "PARA_LLEVAR";

        if (orderType === "EN_MESA") {
            return res.status(400).json({
                success: false,
                message: "Las órdenes en mesa se gestionan a través del módulo de reservaciones",
            });
        }

        if (orderType === "DOMICILIO") {
            if (!orderData.deliveryAddress?.street) {
                return res.status(400).json({ success: false, message: "Falta la dirección de entrega" });
            }
            if (!orderData.deliveryPhone) {
                return res.status(400).json({ success: false, message: "Falta el teléfono para el domicilio" });
            }
        }

        // ── 1. Calcular totales ──────────────────────────────────────
        let subtotal = 0;
        orderData.details.forEach((item) => {
            subtotal += item.quantity * item.unitPrice;
        });

        let discount = 0;
        let appliedCouponId = null;

        if (couponCode) {
            const Coupon = mongoose.model("Coupon");
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            if (coupon) {
                const validation = await coupon.validateForUse(req.user.id, orderData.restaurant, subtotal);
                if (validation.valid) {
                    discount =
                        coupon.discountType === "PERCENTAGE"
                            ? Math.min(subtotal * (coupon.discountValue / 100), coupon.maxDiscount || Infinity)
                            : coupon.discountValue;
                    discount = Math.min(discount, subtotal);
                    appliedCouponId = coupon._id;
                }
            }
        }

        const totalOrder = subtotal - discount;

        // ── 2. Guardar Orden ─────────────────────────────────────────
        const order = new Order({
            userId:    req.user.id,
            userInfo:  { name: req.user.name, email: req.user.email },
            restaurant: orderData.restaurant,
            orderType,
            details: orderData.details.map((d) => ({
                dish:      d.dish,
                quantity:  d.quantity,
                unitPrice: d.unitPrice,
                subtotal:  d.quantity * d.unitPrice,
                specialInstructions: d.specialInstructions || undefined,
            })),
            totalPrice: totalOrder,
            discount,
            notes: orderData.notes || undefined,
            ...(appliedCouponId && { appliedCoupon: appliedCouponId }),
            ...(orderType === "DOMICILIO" && {
                deliveryAddress: orderData.deliveryAddress,
                deliveryPhone:   orderData.deliveryPhone,
            }),
        });

        savedOrder = await order.save();

        // ── 3. Guardar Factura ───────────────────────────────────────
        const invoiceNumber = await generateInvoiceNumber();
        const taxRate       = 12;
        const taxAmount     = subtotal * (taxRate / 100);
        const totalInvoice  = subtotal + taxAmount - discount;
        const paid          = amountPaid ?? totalInvoice;

        const invoice = new Invoice({
            invoiceNumber,
            userId:    req.user.id,
            userInfo:  { name: req.user.name, email: req.user.email },
            restaurant: orderData.restaurant,
            order:     savedOrder._id,
            customerInfo,
            restaurantInfo,
            items: orderData.details.map((d) => ({
                dishName:  d.dishName || "Platillo",
                quantity:  d.quantity,
                unitPrice: d.unitPrice,
                subtotal:  d.quantity * d.unitPrice,
                dishId:    d.dish,
            })),
            subtotal,
            taxRate,
            taxAmount,
            discount,
            totalAmount:    totalInvoice,
            paymentMethod:  paymentMethod || "EFECTIVO",
            amountPaid:     paid,
            changeReturned: Math.max(0, paid - totalInvoice),
            paymentStatus:  paid >= totalInvoice ? "PAGADO" : "PENDIENTE",
            issuedAt: new Date(),
        });

        savedInvoice = await invoice.save();

        // ── 4. Registrar uso del cupón ───────────────────────────────
        if (appliedCouponId) {
            const Coupon = mongoose.model("Coupon");
            const coupon = await Coupon.findById(appliedCouponId);
            await coupon.recordUsage(req.user.id, savedOrder._id);
        }

        // ── Respuesta exitosa ────────────────────────────────────────
        res.status(201).json({
            success: true,
            message: "Compra procesada exitosamente",
            order:   savedOrder,
            invoice: savedInvoice,
        });

    } catch (error) {
        console.error("[CHECKOUT ERROR]", error);

        // Rollback manual: si la factura falló pero la orden ya se guardó, eliminarla
        if (savedOrder && !savedInvoice) {
            try {
                await Order.findByIdAndDelete(savedOrder._id);
                console.warn("[CHECKOUT ROLLBACK] Orden eliminada por fallo en factura:", savedOrder._id);
            } catch (rollbackErr) {
                console.error("[CHECKOUT ROLLBACK ERROR]", rollbackErr.message);
            }
        }

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: "Error de validación: " + messages.join(", "),
            });
        }

        res.status(500).json({
            success: false,
            message: "Error en el proceso de checkout",
            error: error.message,
        });
    }
};