'use strict';

import Table from './table.model.js';
import mongoose from 'mongoose';
import { cloudinary } from '../../middlewares/files-uploaders.js';

const parseTableData = (data) => {
    const parsed = { ...data };

    if (parsed.capacity !== undefined)    parsed.capacity    = Number(parsed.capacity);
    if (parsed.minCapacity !== undefined) parsed.minCapacity = Number(parsed.minCapacity);
    if (parsed.extraCharge !== undefined) parsed.extraCharge = Number(parsed.extraCharge);

    if (parsed.requiresReservation !== undefined)
        parsed.requiresReservation = parsed.requiresReservation === 'true' || parsed.requiresReservation === true;

    if (parsed.isActive !== undefined)
        parsed.isActive = parsed.isActive === 'true' || parsed.isActive === true;

    if (typeof parsed.features === 'string') {
        try { parsed.features = JSON.parse(parsed.features); }
        catch { parsed.features = {}; }
    }

    return parsed;
};

export const createTable = async (req, res) => {
    try {
        const tableData = parseTableData(req.body);

        if (req.file) {
            tableData.image = req.file.path || req.file.secure_url;
            tableData.image_public_id = req.file.filename || req.file.public_id;
        }

        const table = new Table(tableData);
        await table.save();

        res.status(201).json({
            success: true,
            message: 'Mesa creada exitosamente',
            data: table
        });
    } catch (error) {
        if (req.file?.filename) {
            await cloudinary.uploader.destroy(req.file.filename).catch(() => {});
        }
        res.status(400).json({
            success: false,
            message: 'Error al crear la mesa',
            error: error.message
        });
    }
};

export const getTables = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, location, restaurant } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (location) filter.location = location;
        if (restaurant) filter.restaurant = restaurant;

        if (req.user?.role === 'ADMIN_RESTAURANTE') {
            filter.restaurant = req.user.restaurantId;
        }

        const tables = await Table.find(filter)
            .populate('restaurant', 'name address phone')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ number: 1 });

        const total = await Table.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: tables,
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
            message: 'Error al obtener las mesas',
            error: error.message
        });
    }
};

export const getTableById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const table = await Table.findById(id)
            .populate('restaurant', 'name address phone email');

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Mesa no encontrada"
            });
        }

        res.status(200).json({
            success: true,
            data: table
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la mesa",
            error: error.message
        });
    }
};

export const updateTable = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "ID inválido" });
        }

        const currentTable = await Table.findById(id);
        if (!currentTable) {
            return res.status(404).json({ success: false, message: "Mesa no encontrada" });
        }

        const updateData = parseTableData(req.body);

        // Validación manual de capacidad mínima
        const finalCapacity    = updateData.capacity    ?? currentTable.capacity;
        const finalMinCapacity = updateData.minCapacity ?? currentTable.minCapacity;
        if (finalMinCapacity > finalCapacity) {
            return res.status(400).json({
                success: false,
                message: "La capacidad mínima no puede ser mayor que la capacidad máxima"
            });
        }

        if (req.file) {
            if (currentTable.image_public_id) {
                await cloudinary.uploader.destroy(currentTable.image_public_id).catch(() => {});
            }
            updateData.image = req.file.path || req.file.secure_url;
            updateData.image_public_id = req.file.filename || req.file.public_id;
        }

        const updatedTable = await Table.findByIdAndUpdate(id, updateData, {
            new: true,
        }).populate('restaurant', 'name address');

        res.status(200).json({
            success: true,
            message: "Mesa actualizada exitosamente",
            data: updatedTable
        });
    } catch (error) {
        if (req.file?.filename) {
            await cloudinary.uploader.destroy(req.file.filename).catch(() => {});
        }
        res.status(500).json({
            success: false,
            message: "Error al actualizar mesa",
            error: error.message
        });
    }
};

export const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID inválido"
            });
        }

        const table = await Table.findById(id);

        if (!table) {
            return res.status(404).json({
                success: false,
                message: "Mesa no encontrada"
            });
        }

        if (table.image_public_id) {
            await cloudinary.uploader.destroy(table.image_public_id).catch(() => {});
        }

        await table.deleteOne();

        res.status(200).json({
            success: true,
            message: "Mesa eliminada exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar mesa",
            error: error.message
        });
    }
};