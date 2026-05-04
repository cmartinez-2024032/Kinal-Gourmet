import { Router } from "express";
import {
  createPromotion,
  getPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion
} from "./promotion.controller.js";
import { verifyToken } from "../../middlewares/auth-integration.middleware.js";

const router = Router();

router.get('/', verifyToken, getPromotions);


router.get('/:id', getPromotionById);


router.post('/create', verifyToken, createPromotion);


router.put('/:id', verifyToken, updatePromotion);

router.delete('/:id', verifyToken, deletePromotion);

export default router;