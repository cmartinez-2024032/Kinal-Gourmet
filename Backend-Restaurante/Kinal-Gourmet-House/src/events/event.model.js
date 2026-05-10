'use strict';

import mongoose from 'mongoose';

const eventSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del evento es requerido'],
            trim: true,
            maxLength: [150, 'El nombre no puede exceder 150 caracteres']
        },

        description: {
            type: String,
            required: [true, 'La descripción es requerida'],
            trim: true,
            maxLength: [1000, 'La descripción no puede exceder 1000 caracteres']
        },

        date: {
            type: Date,
            required: [true, 'La fecha del evento es requerida'],
            validate: {
                validator: function (value) {

                    // Permitir fechas desde hoy
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const eventDate = new Date(value);
                    eventDate.setHours(0, 0, 0, 0);

                    if (this.isNew) {
                        return eventDate >= today;
                    }

                    return true;
                },
                message: 'La fecha del evento debe ser actual o futura'
            }
        },

        startTime: {
            type: String,
            required: [true, 'La hora de inicio es requerida'],
            trim: true,
            match: [
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                'Formato de hora inválido (HH:MM)'
            ]
        },

        endTime: {
            type: String,
            required: [true, 'La hora de fin es requerida'],
            trim: true,
            match: [
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
                'Formato de hora inválido (HH:MM)'
            ],
            validate: {
                validator: function (value) {

                    if (this.startTime && value) {

                        const [startHour, startMin] = this.startTime
                            .split(':')
                            .map(Number);

                        const [endHour, endMin] = value
                            .split(':')
                            .map(Number);

                        const startMinutes = (startHour * 60) + startMin;
                        const endMinutes = (endHour * 60) + endMin;

                        return endMinutes > startMinutes;
                    }

                    return true;
                },
                message: 'La hora de fin debe ser posterior a la hora de inicio'
            }
        },

        additionalServices: {
            type: [String],
            default: []
        },

        capacity: {
            type: Number,
            required: [true, 'La capacidad es requerida'],
            min: [1, 'La capacidad debe ser al menos 1'],
            max: [10000, 'La capacidad no puede exceder 10000 personas']
        },

        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: [true, 'La referencia al restaurante es requerida']
        },

        isActive: {
            type: Boolean,
            default: true
        },

        status: {
            type: String,
            enum: {
                values: [
                    'PROGRAMADO',
                    'EN_CURSO',
                    'FINALIZADO',
                    'CANCELADO'
                ],
                message: 'Estado no válido'
            },
            default: 'PROGRAMADO'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// ==================== INDEXES ====================

eventSchema.index({ date: 1 });

eventSchema.index({ restaurant: 1 });

eventSchema.index({ status: 1 });

eventSchema.index({ isActive: 1 });

eventSchema.index({ restaurant: 1, date: 1 });

eventSchema.index({ restaurant: 1, status: 1 });

// ==================== VIRTUALS ====================

// Evento próximo (7 días)
eventSchema.virtual('isUpcoming').get(function () {

    const now = new Date();

    const eventDate = new Date(this.date);

    const sevenDaysFromNow = new Date(
        now.getTime() + (7 * 24 * 60 * 60 * 1000)
    );

    return eventDate >= now && eventDate <= sevenDaysFromNow;
});

// Evento pasado
eventSchema.virtual('isPast').get(function () {

    const now = new Date();

    const eventDate = new Date(this.date);

    return eventDate < now;
});

// ==================== CONFIG ====================

eventSchema.set('toJSON', { virtuals: true });

eventSchema.set('toObject', { virtuals: true });

// ==================== EXPORT ====================

export default mongoose.model('Event', eventSchema);