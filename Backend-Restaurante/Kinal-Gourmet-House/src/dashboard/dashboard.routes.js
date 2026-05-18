import { Router } from 'express';
import { getDashboardSummary } from './dashboard.controller.js';
import { checkRole } from '../../middlewares/role.middleware.js';
// Importamos tu middleware de integración correcto
import { verifyToken } from '../../middlewares/auth-integration.middleware.js';

const router = Router();

router.get(
    '/summary',
    [
        verifyToken,                  
        checkRole('ADMIN_RESTAURANTE') 
    ],
    getDashboardSummary
);

export default router;