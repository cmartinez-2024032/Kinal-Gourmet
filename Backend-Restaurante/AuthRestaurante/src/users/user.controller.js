import { User, Role } from '../models/index.js'
import { createAdminRestaurant, changePassword } from './user.service.js'

export const createAdminRest = async (req, res) => {
  const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL
  const { restaurantId } = req.body

  try {
    const checkRes = await fetch(
      `${RESTAURANT_SERVICE_URL}/kinalGourmetHouse/v1/restaurants/${restaurantId}`,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    )

    if (!checkRes.ok) {
      return res.status(404).json({
        error: 'Restaurante no encontrado'
      })
    }

    const checkData = await checkRes.json()

    if (checkData.data.ownerUserId) {
      return res.status(409).json({
        error: 'Este restaurante ya tiene un administrador asignado'
      })
    }

    const createdUser = await createAdminRestaurant(req.body)

    const user = await User.findByPk(createdUser.id)

    if (!user) {
      return res.status(404).json({
        error: 'Usuario creado pero no encontrado'
      })
    }

    // ✅ FIX: imagen viene de req.file, no de req.body
    await user.update({
      restaurantId,
      image: req.file?.path || req.file?.secure_url || null
    })

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
          ownerInfo: {
            name: user.name,
            email: user.email
          }
        })
      }
    )

    if (!assignRes.ok) {
      await User.destroy({
        where: { id: user.id }
      })

      return res.status(500).json({
        error: 'Error al vincular con el restaurante, operación revertida'
      })
    }

    const assignData = await assignRes.json()

    // ✅ Recargar usuario para que la respuesta incluya la imagen actualizada
    const updatedUser = await User.findByPk(user.id)
    const userJSON = updatedUser.toJSON()
    delete userJSON.password

    res.status(201).json({
      message: 'Administrador creado y vinculado correctamente',
      user: userJSON,
      restaurant: assignData.data
    })

  } catch (error) {
    res.status(400).json({
      error: error.message
    })
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
    res.status(400).json({
      error: error.message
    })
  }
}

export const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params

    // ✅ FIX: imagen viene de req.file, no de req.body
    const { name, email, isActive, restaurantId } = req.body
    const image = req.file?.path || req.file?.secure_url || undefined

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      })
    }

    const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL
    const oldRestaurantId = user.restaurantId
    const updateData = {}

    if (name !== undefined) updateData.name = name.trim()
    if (email !== undefined) updateData.email = email.trim()
    if (isActive !== undefined) updateData.isActive = isActive
    if (restaurantId !== undefined) updateData.restaurantId = restaurantId || null
    if (image !== undefined) updateData.image = image || null

    await user.update(updateData)

    if (oldRestaurantId && oldRestaurantId !== restaurantId) {
      await fetch(
        `${RESTAURANT_SERVICE_URL}/kinalGourmetHouse/v1/restaurants/${oldRestaurantId}/assign-admin`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: req.headers.authorization
          },
          body: JSON.stringify({
            userId: null,
            ownerInfo: null
          })
        }
      ).catch(() => {})
    }

    if (restaurantId && oldRestaurantId !== restaurantId) {
      await fetch(
        `${RESTAURANT_SERVICE_URL}/kinalGourmetHouse/v1/restaurants/${restaurantId}/assign-admin`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: req.headers.authorization
          },
          body: JSON.stringify({
            userId: user.id,
            ownerInfo: {
              name: user.name,
              email: user.email
            }
          })
        }
      ).catch(() => {})
    }

    const updated = user.toJSON()
    delete updated.password

    res.json({
      message: 'Usuario actualizado correctamente',
      user: updated
    })

  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}

export const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      })
    }

    if (user.restaurantId) {
      const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL

      await fetch(
        `${RESTAURANT_SERVICE_URL}/kinalGourmetHouse/v1/restaurants/${user.restaurantId}/assign-admin`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: req.headers.authorization
          },
          body: JSON.stringify({
            userId: null,
            ownerInfo: null
          })
        }
      ).catch(() => {})
    }

    await user.destroy()

    res.json({
      message: 'Usuario eliminado correctamente'
    })

  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
}

export const assignRestaurant = async (req, res) => {
  try {
    const { id } = req.params
    const { restaurantId } = req.body

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      })
    }

    await user.update({
      restaurantId
    })

    const updated = user.toJSON()
    delete updated.password

    res.json({
      message: 'Restaurante asignado correctamente',
      user: updated
    })

  } catch (error) {
    res.status(400).json({
      error: error.message
    })
  }
}