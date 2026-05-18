import { Router } from 'express';
import { getDashboardSummary } from './dashboard.controller.js';
import { validateRole } from '../../middlewares/role.middleware.js';
import { validateJWT } from '../../middlewares/validate-jwt';

const router = Router();

router.get(
    '/summary',
    [
        validateJWT,
        validateRole('ADMIN_RESTAURANTE')
    ],
    getDashboardSummary
);

export default router;