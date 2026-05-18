import { Router } from 'express'
import { register, login, verify, getUsers, forgotPassword, resetPassword  } from './auth.controller.js'

import { validateJWT } from '../../middlewares/validate-jwt.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.get('/verify/:token', verify)

router.get('/profile', validateJWT, (req, res) => {
  res.json({
    message: 'Acceso permitido',
    user: req.user
  })
})

router.get('/users', validateJWT, getUsers)

export default router
