const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}] ${stack || message}`;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp(),
                printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
            )
        }),
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            format: combine(
                timestamp(),
                printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
            )
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log',
            format: combine(
                timestamp(),
                printf(info => `${info.timestamp} [${info.level}] ${info.message}`)
            )
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ]
});

// Para lidar com rejeições de promises não tratadas
process.on('unhandledRejection', (reason) => {
    throw reason;
});

module.exports = logger;
