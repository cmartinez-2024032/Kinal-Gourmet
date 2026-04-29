import { Router } from "express";
import { createTable, getTables, getTableById, updateTable, deleteTable } from "./table.controller.js";
import { uploadDishImages } from "../../middlewares/files-uploaders.js";
import { verifyToken } from "../../middlewares/auth-integration.middleware.js";
import { isRestaurantAdmin, belongsToRestaurant } from "../../middlewares/role.middleware.js";

const router = Router();

router.get('/', verifyToken, getTables);
router.get('/:id', getTableById);
router.post('/create', verifyToken, isRestaurantAdmin, belongsToRestaurant, uploadDishImages.single('image'), createTable);
router.put('/:id', verifyToken, isRestaurantAdmin, belongsToRestaurant, uploadDishImages.single('image'), updateTable);
router.delete('/:id', verifyToken, isRestaurantAdmin, deleteTable);

export default router;