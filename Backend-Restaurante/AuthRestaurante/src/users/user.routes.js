import { Router } from 'express'
import { createAdminRest, updateMyPassword, assignRestaurant, updateAdminUser, deleteAdminUser } from './user.controller.js'
import { validateJWT } from '../../middlewares/validate-jwt.js'
import { validateRole } from '../../middlewares/validate-role.js'
import { uploadUserImages } from '../../middlewares/files-uploaders.js'

const router = Router()

router.post(
  '/create-admin-restaurant',
  validateJWT,
  validateRole('ADMIN_GENERAL'),
  uploadUserImages.single('image'),
  createAdminRest
)

router.patch(
  '/change-password',
  validateJWT,
  validateRole('ADMIN_RESTAURANTE', 'ADMIN_GENERAL', 'CLIENTE'),
  updateMyPassword
)

router.patch(
  '/:id/assign-restaurant',
  validateJWT,
  validateRole('ADMIN_GENERAL'),
  assignRestaurant
)

router.put(
  '/:id',
  validateJWT,
  validateRole('ADMIN_GENERAL'),
  uploadUserImages.single('image'),
  updateAdminUser
)

router.delete(
  '/:id',
  validateJWT,
  validateRole('ADMIN_GENERAL'),
  deleteAdminUser
)

export default router