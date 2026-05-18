'use strict';

import axios from 'axios';

const AUTH_API_URL = process.env.AUTH_API_URL || 'http://localhost:3005';

/**
 * Valida el token llamando a AuthRestaurante.
 * Traduce IDs de roles a strings legibles si es necesario.
 * Si es válido, pone req.user = { id, email, name, role, restaurantId } y continúa.
 */
export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado. Usa: Authorization: Bearer <token>'
            });
        }

        const token = authHeader.replace('Bearer ', '').trim();

        // Llama a AuthRestaurante para verificar el token
        const response = await axios.get(`${AUTH_API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data?.user;

        if (!userData) {
            return res.status(401).json({ success: false, message: 'Token inválido' });
        }

        // 1. Extraemos el valor del rol que viene desde el microservicio
        let userRole = userData.role?.name || userData.Role?.name || userData.role;

        // 2. SISTEMA DE MAPEO / TRADUCCIÓN DE ROLES
        // Si el rol viene en formato ID de Base de Datos, lo convertimos a texto plano
        const ROLE_MAP = {
            "8c044f58-94aa-411b-ba13-7b34164eabce": "ADMIN_RESTAURANTE",
            "ADMIN": "ADMIN_RESTAURANTE"
        };

        if (ROLE_MAP[userRole]) {
            userRole = ROLE_MAP[userRole];
        }

        // req.user queda disponible de forma limpia en todos los controladores siguientes
        req.user = {
            id:    userData.id || userData.uid,
            email: userData.email,
            name:  userData.name,
            role:  userRole, 
            restaurantId: userData.restaurantId || null
        };

        next();

    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            return res.status(503).json({
                success: false,
                message: 'AuthRestaurante no disponible. ¿Está corriendo en el puerto 3005?'
            });
        }
        if (error.response) {
            return res.status(error.response.status).json({
                success: false,
                message: error.response.data?.error || 'Token inválido o expirado'
            });
        }
        console.error('Error en verifyToken:', error.message);
        return res.status(500).json({ success: false, message: 'Error al verificar autenticación' });
    }
};