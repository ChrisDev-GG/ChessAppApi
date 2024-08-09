const jwt = require('jsonwebtoken');
const express = require('express');
const { connection } = require('../config/database');
const { QueryTypes } = require("sequelize");
require('dotenv').config();

// Secret key para firmar y verificar el token
const secretKey = process.env.JWT_SECRET;


const generateJWT = async ( payload ) => {

    return new Promise( (resolve, reject) => {

        // Generar el token
        jwt.sign( payload, secretKey, { expiresIn: '24h' }, ( error, token ) => {
            if ( error ) {
                console.log( error );
                reject( 'No se pudo generar el token' )
            } else {
                resolve( token );
            }
        })

    })
}

const verifyJWT = async (req, res, next) => {
    try{
        jwt.verify(token, secretKey, async (error, payload) => {
            if (error) {
                return res.status(401).json({ ok: false, msg: 'Sesión expirada. Porfavor, inicie sesión nuevamente' });
            } else {
                const user = await connection.query(`SELECT * FROM users WHERE email = $1`, { bind: [payload.email], type: QueryTypes.SELECT });
                req.email = user[0]?.email;
                req.user_id = user[0]?.user_id;
                
                if (!user[0]) return res.status(401).json({ ok: false, msg: 'Sesión expirada. Porfavor, inicie sesión nuevamente' });
                
                next();
            }
        });
    }
    catch (error) {
        return res.status(400).json({ ok: false, msg: 'Error al verificar el token' });
    }
}


module.exports = { generateJWT, verifyJWT }
