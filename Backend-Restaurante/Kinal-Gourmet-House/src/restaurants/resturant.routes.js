import { Router } from "express";
import { createRestaurant, getRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant, assignAdminToRestaurant } from "./restaurant.controller.js";
import { uploadRestaurantImages } from "../../middlewares/files-uploaders.js";
import { cleanUploaderFile } from "../../middlewares/delete-files-on-error.js";
import { verifyToken } from "../../middlewares/auth-integration.middleware.js";
import { isPlatformAdmin, isRestaurantAdmin } from "../../middlewares/role.middleware.js";

const router = Router();

router.get('/',     verifyToken, getRestaurants);
router.get('/:id',  getRestaurantById);


router.post('/create',
    uploadRestaurantImages.single('photo'),
    verifyToken,
    isPlatformAdmin,
    createRestaurant
);

router.delete('/:id',             verifyToken, isPlatformAdmin, deleteRestaurant);
router.patch('/:id/assign-admin', verifyToken, isPlatformAdmin, assignAdminToRestaurant);


router.put('/:id',
    uploadRestaurantImages.single('photo'),
    verifyToken,
    isRestaurantAdmin,
    updateRestaurant
);

export default router;