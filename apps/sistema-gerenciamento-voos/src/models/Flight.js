const mongoose = require('mongoose');
const validator = require('validator');

const flightSchema = new mongoose.Schema({
    number: {
        type: String,
        required: [true, 'Número do voo é obrigatório'],
        trim: true,
        uppercase: true,
        validate: {
            validator: function(v) {
                return /^[A-Z]{2,3}\d{1,4}$/.test(v);
            },
            message: props => `${props.value} não é um número de voo válido!`
        }
    },
    origin: {
        type: String,
        required: [true, 'Origem é obrigatória'],
        trim: true,
        uppercase: true,
        minlength: [3, 'Código de aeroporto deve ter 3 caracteres'],
        maxlength: [3, 'Código de aeroporto deve ter 3 caracteres']
    },
    destination: {
        type: String,
        required: [true, 'Destino é obrigatório'],
        trim: true,
        uppercase: true,
        minlength: [3, 'Código de aeroporto deve ter 3 caracteres'],
        maxlength: [3, 'Código de aeroporto deve ter 3 caracteres'],
        validate: {
            validator: function(v) {
                return v !== this.origin;
            },
            message: 'Origem e destino não podem ser iguais'
        }
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['agendado', 'embarcando', 'cancelado', 'partiu', 'atrasado', 'aterrissado'],
            message: 'Status inválido para o voo'
        },
        default: 'agendado'
    },
    passengers: {
        type: Number,
        required: true,
        min: [0, 'Número de passageiros não pode ser negativo'],
        max: [500, 'Número máximo de passageiros é 500']
    },
    departureTime: {
        type: Date,
        required: [true, 'Horário de partida é obrigatório'],
        validate: {
            validator: function(v) {
                return v > Date.now();
            },
            message: 'Horário de partida deve ser no futuro'
        }
    },
    arrivalTime: {
        type: Date,
        required: [true, 'Horário de chegada é obrigatório'],
        validate: {
            validator: function(v) {
                return v > this.departureTime;
            },
            message: 'Horário de chegada deve ser após a partida'
        }
    },
    aircraftType: {
        type: String,
        required: true,
        trim: true,
        enum: {
            values: ['A320', 'A330', 'B737', 'B787', 'E190'],
            message: 'Tipo de aeronave não suportado'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    }
}, {
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.__v;
            delete ret._id;
            return ret;
        }
    },
    toObject: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.__v;
            delete ret._id;
            return ret;
        }
    }
});

// Índices para otimização de consultas - apenas um índice único explícito
flightSchema.index({ number: 1 }, { unique: true, name: 'unique_flight_number' });
flightSchema.index({ origin: 1, destination: 1 });
flightSchema.index({ status: 1 });
flightSchema.index({ departureTime: 1 });

// Middlewares
flightSchema.pre('save', function(next) {
    if (this.status === 'partiu' && !this.departureTime) {
        this.departureTime = Date.now();
    }
    next();
});

flightSchema.post('save', function(doc, next) {
    console.log(`Voo ${doc.number} salvo com sucesso`);
    next();
});

// Virtuals
flightSchema.virtual('duration').get(function() {
    return this.arrivalTime - this.departureTime;
});

flightSchema.virtual('formattedDuration').get(function() {
    const duration = this.arrivalTime - this.departureTime;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
});

module.exports = mongoose.model('Flight', flightSchema);
