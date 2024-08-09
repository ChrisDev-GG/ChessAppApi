const winston = require('winston');
const path = require('path');

// Define los formatos de los mensajes de log
const logFormat = winston.format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

// Configuración de winston
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.label({ label: path.basename(__filename) }),
        winston.format.timestamp(),
        logFormat
    ),
    transports: [
        // Registro en la consola
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Registro de mensajes de nivel info y superiores en un archivo
        new winston.transports.File({ 
            filename: 'info.log', 
            level: 'info', 
            format: winston.format.combine(
                winston.format.uncolorize(), // Elimina el color de los logs en el archivo
                logFormat
            )
        }),
        // Registro de mensajes de nivel error en un archivo separado
        new winston.transports.File({ 
            filename: 'error.log', 
            level: 'error', 
            format: winston.format.combine(
                winston.format.uncolorize(), // Elimina el color de los logs en el archivo
                logFormat
            )
        })
    ]
});

module.exports = logger;
