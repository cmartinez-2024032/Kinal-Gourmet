import { Router } from "express";
import {
  createReservation,
  getReservations,
  getReservationById,
  updateReservation,
  deleteReservation,
  updateReservationStatus
} from "./reservation.controller.js";
import { verifyToken } from "../../middlewares/auth-integration.middleware.js";
import { belongsToRestaurant } from "../../middlewares/role.middleware.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

router.post('/create', belongsToRestaurant, createReservation);

router.get('/', getReservations);

router.get('/:id', getReservationById);

router.put('/:id', belongsToRestaurant, updateReservation);

// FIX: era "/reservations/:id/status" → ruta duplicada, corregida a "/:id/status"
router.patch('/:id/status', updateReservationStatus);

router.delete('/:id', deleteReservation);

export default router;