import { Router } from "express";
import { checkout } from "./checkout.controller.js";
import { verifyToken } from "../../middlewares/auth-integration.middleware.js";
import { belongsToRestaurant } from "../../middlewares/role.middleware.js";

const router = Router();

// Endpoint unificado para pagar y crear todo
router.post('/process', verifyToken, checkout);

export default router;