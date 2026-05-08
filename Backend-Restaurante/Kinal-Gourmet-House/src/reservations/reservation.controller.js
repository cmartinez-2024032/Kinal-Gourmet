import Reservation from './reservation.model.js';
import mongoose from 'mongoose';

// Crear reservación
export const createReservation = async (req, res) => {
  try {
    const { restaurant, table, date, time, numberOfGuests, specialRequests, userId, userInfo } = req.body;

    if (!restaurant || !table || !date || !time || !numberOfGuests) {
      return res.status(400).json({
        success: false,
        message: 'Restaurante, mesa, fecha, hora y número de comensales son requeridos'
      });
    }

    // Verifica que no exista otra reservación activa
    const existing = await Reservation.findOne({
      table,
      date: new Date(date),
      time,
      status: { $nin: ['CANCELADA'] }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una reservación para esa mesa en esa fecha y hora'
      });
    }

    // Definir userId y userInfo según rol
    let finalUserId = req.user.id;
    let finalUserInfo = { name: req.user.name, email: req.user.email };

    if (req.user.role === 'ADMIN_RESTAURANTE' && userId && userInfo) {
      finalUserId = userId;
      finalUserInfo = userInfo;
    }

    const reservation = new Reservation({
      userId: finalUserId,
      userInfo: finalUserInfo,
      restaurant,
      table,
      date,
      time,
      numberOfGuests,
      specialRequests
    });

    await reservation.save();

    res.status(201).json({
      success: true,
      message: 'Reservación creada exitosamente',
      data: reservation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear la reservación',
      error: error.message
    });
  }
};

// Obtener reservaciones
export const getReservations = async (req, res) => {
  try {
    const { page = 1, limit = 10, isActive, status, restaurant } = req.query;
    const filter = {};

    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (status) filter.status = status;

    // Filtro según rol
    if (req.user.role === 'CLIENTE') {
      filter.userId = req.user.id;
    } else if (req.user.role === 'ADMIN_RESTAURANTE') {
      // FIX: asegura que siempre filtre por su restaurante
      if (!req.user.restaurantId) {
        return res.status(403).json({
          success: false,
          message: 'Tu cuenta no tiene un restaurante asignado. Contacta al administrador.'
        });
      }
      filter.restaurant = req.user.restaurantId;
    } else if (req.user.role === 'ADMIN_GENERAL' && restaurant) {
      filter.restaurant = restaurant;
    }

    const reservations = await Reservation.find(filter)
      .populate('restaurant', 'name address phone')
      .populate('table', 'number capacity location')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1, time: -1 });

    const total = await Reservation.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: reservations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las reservaciones',
      error: error.message
    });
  }
};

// Obtener reservación por ID
export const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const reservation = await Reservation.findById(id)
      .populate('restaurant', 'name address phone')
      .populate('table', 'number capacity location');

    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservación no encontrada' });
    }

    // FIX: .toString() para comparar ObjectId con string
    if (req.user.role === 'CLIENTE' && reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta reservación' });
    }

    if (
      req.user.role === 'ADMIN_RESTAURANTE' &&
      reservation.restaurant._id.toString() !== req.user.restaurantId?.toString()
    ) {
      return res.status(403).json({ success: false, message: 'No puedes ver esta reservación' });
    }

    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener la reservación', error: error.message });
  }
};

// Actualizar reservación
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservación no encontrada' });
    }

    // FIX: .toString() para comparar ObjectId con string
    if (req.user.role === 'CLIENTE') {
      if (reservation.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'No tienes acceso' });
      }
      if (reservation.status !== 'PENDIENTE') {
        return res.status(400).json({ success: false, message: 'Solo puedes modificar reservaciones PENDIENTES' });
      }
    }

    if (
      req.user.role === 'ADMIN_RESTAURANTE' &&
      reservation.restaurant.toString() !== req.user.restaurantId?.toString()
    ) {
      return res.status(403).json({ success: false, message: 'No puedes editar reservaciones de otro restaurante' });
    }

    // Proteger campos sensibles
    delete req.body.userId;
    delete req.body.userInfo;

    const updatedReservation = await Reservation.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
      .populate('restaurant', 'name address')
      .populate('table', 'number capacity');

    res.status(200).json({ success: true, message: 'Reservación actualizada exitosamente', data: updatedReservation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar reservación', error: error.message });
  }
};

// Actualizar solo status
export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const allowedStatus = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: 'Estado inválido' });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservación no encontrada' });
    }

    if (req.user.role === 'ADMIN_RESTAURANTE') {
      if (reservation.restaurant.toString() !== req.user.restaurantId?.toString()) {
        return res.status(403).json({ success: false, message: 'No puedes modificar esta reservación' });
      }
    }

    // FIX: .toString() + solo puede cambiar a CANCELADA
    if (req.user.role === 'CLIENTE') {
      if (reservation.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'No tienes acceso' });
      }
      if (reservation.status !== 'PENDIENTE') {
        return res.status(400).json({ success: false, message: 'Solo puedes cancelar reservaciones pendientes' });
      }
      if (status !== 'CANCELADA') {
        return res.status(403).json({ success: false, message: 'Los clientes solo pueden cancelar reservaciones' });
      }
    }

    reservation.status = status;
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Estado actualizado correctamente',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar estado', error: error.message });
  }
};

// Eliminar reservación
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservación no encontrada' });
    }

    // FIX: .toString()
    if (req.user.role === 'CLIENTE' && reservation.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta reservación' });
    }

    if (
      req.user.role === 'ADMIN_RESTAURANTE' &&
      reservation.restaurant.toString() !== req.user.restaurantId?.toString()
    ) {
      return res.status(403).json({ success: false, message: 'No puedes eliminar esta reservación' });
    }

    await Reservation.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Reservación eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar reservación', error: error.message });
  }
};