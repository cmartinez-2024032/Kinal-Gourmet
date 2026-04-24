import { Router } from "express";
import { createRestaurant, getRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant, assignAdminToRestaurant  } from "./restaurant.controller.js";
import { uploadRestaurantImages } from "../../middlewares/files-uploaders.js";
import { verifyToken } from "../../middlewares/auth-integration.middleware.js";
import { isPlatformAdmin, isRestaurantAdmin } from "../../middlewares/role.middleware.js";

const router = Router();

router.get('/',     verifyToken, getRestaurants);
router.get('/:id',  getRestaurantById);

// Solo Admin General
router.post('/create',              verifyToken, isPlatformAdmin, uploadRestaurantImages.single('image'), createRestaurant);
router.delete('/:id',               verifyToken, isPlatformAdmin, deleteRestaurant);
router.patch('/:id/assign-admin',   verifyToken, isPlatformAdmin, assignAdminToRestaurant); // 👈 nuevo

// Admin Restaurante gestiona su propio restaurante
router.put('/:id', verifyToken, isRestaurantAdmin, uploadRestaurantImages.single('image'), updateRestaurant);

export default router;