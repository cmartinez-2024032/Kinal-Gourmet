import { User, Role } from '../models/index.js'
import { createAdminRestaurant } from './user.service.js'
import { changePassword } from './user.service.js'



export const createAdminRest = async (req, res) => {

  const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL
  
  const { restaurantId } = req.body

  try {
    // 1. Verificar que el restaurante existe y está libre ANTES de crear el user
      const checkRes = await fetch(
        `${RESTAURANT_SERVICE_URL}/kinalGourmetHouse/v1/restaurants/${restaurantId}`,
        {
          headers: {
            Authorization: req.headers.authorization
          }
        }
      )

    if (!checkRes.ok) {
      return res.status(404).json({ error: 'Restaurante no encontrado' })
    }

    const checkData = await checkRes.json()

    if (checkData.data.ownerUserId) {
      return res.status(409).json({ error: 'Este restaurante ya tiene un administrador asignado' })
    }

    // 2. Crear el usuario en el Auth Service
    const user = await createAdminRestaurant(req.body)

    // 3. Llamar al Restaurant Service para vincular ownerUserId
      const assignRes = await fetch(
        `${RESTAURANT_SERVICE_URL}/kinalGourmetHouse/v1/restaurants/${restaurantId}/assign-admin`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: req.headers.authorization
          },
          body: JSON.stringify({
            userId: user.id,
            ownerInfo: { name: user.name, email: user.email }
          })
        }
      )

    if (!assignRes.ok) {
      // Rollback: eliminar el user recién creado
      await User.destroy({ where: { id: user.id } })
      return res.status(500).json({ error: 'Error al vincular con el restaurante, operación revertida' })
    }

    const assignData = await assignRes.json()

    res.status(201).json({
      message: 'Administrador creado y vinculado correctamente',
      user,
      restaurant: assignData.data
    })

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const updateMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const response = await changePassword(
      req.user.id,
      currentPassword,
      newPassword
    )

    res.json(response)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const assignRestaurant = async (req, res) => {
    try {
        const { id } = req.params
        const { restaurantId } = req.body

        const user = await User.findByPk(id)
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })

        await user.update({ restaurantId })

        const updated = user.toJSON()
        delete updated.password

        res.json({ message: 'Restaurante asignado correctamente', user: updated })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}