const express = require('express');
const { validationResult } = require('express-validator');

/**
 * @description Sanitizar los inputs de req.body y manejar errores de express-validator
 * @param {object} req - El objeto de petición de express
 * @param {object} res - El objeto de respuesta de express
 * @param {function} next - El callback para continuar con el siguiente middleware
 * @returns {void}
 */
const sanitizeInputs = (req, res, next) => {
    
    function validateInput(input) {
        if (typeof input === 'string') {
            const suspiciousPatterns = ['\'', '"', '--', ';', '/*', '*/', '@@', '0x'];
            for (let pattern of suspiciousPatterns) {
                if (input.includes(pattern)) {
                    return false;
                }
            }
        } else if (Array.isArray(input)) {
            for (let item of input) {
                if (!validateInput(item)) {
                    return false;
                }
            }
        } else if (typeof input === 'object' && input !== null) {
            for (let key in input) {
                if (!validateInput(input[key])) {
                    return false;
                }
            }
        }
        return true;
    }
    
    Object.keys(req.body).forEach(field => {
        if (!validateInput(req.body[field])) {
            return res.status(400).json({ error: 'Invalid input' });
        }
    });

    next(); // Continuar con el siguiente middleware
};

module.exports = sanitizeInputs;
