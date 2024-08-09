// Descripción: Contiene la lógica de negocio para el inicio de sesión
const express = require('express');
const { connection } = require('../config/database');
const { QueryTypes } = require("sequelize");
const { encryptData, decryptData } = require('../utilities/encryption');

const jwt = require('jsonwebtoken');
const path = require('path');
const { generateJWT } = require('../middleware/jwt');

require('dotenv').config();


class ChessController {


    constructor() {
        this.connection = connection;
    }

    /* ============================= Chess ============================== */
    enterWithEmail = async (req, res) =>{

        const { email } = req.body;
        try {
            console.log(email);
            await connection.transaction( async (t) => {
                const verify = await connection.query( "SELECT * FROM users WHERE LOWER(email)=LOWER($1);", { bind: [email], type: QueryTypes.SELECT, transaction: t });
                console.log(verify);
                if (verify.length <= 0)  await connection.query( "INSERT INTO users (email, last_login) VALUES ($1, NOW());", { bind: [email], transaction: t });
                else await connection.query( "UPDATE users SET last_login = NOW() WHERE email = $1;", { bind: [email], transaction: t });
                const token = await generateJWT( { email: verify[0].email, user_id: verify[0].user_id } );
                console.log(token);
                return res.status(200).json({ ok: true, msg:'Sesión iniciada!', token: token });
            });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ ok: false, msg:'Problemas con el ingreso, por favor inténtelo de nuevo [CH:01].' });
        }    
    }

    saveGame = async (req, res) => {
        const user_id = req.user_id;
        const { game } = req.body;
        try{
            const game = await connection.query(
                "INSERT INTO games (user_id, game) VALUES ($1, $2);", 
                { bind: [user_id, req.body.game], type: QueryTypes.SELECT }
            );
            
            return res.status(200).json({ ok: true,  msg: 'Juego guardado con éxito.'  });
    
        } catch (error) {
            console.log(error);
            return res.status(400).json({ok: false, msg: 'Error al guardar el juego.' });
        }
    }

    getGames = async (req, res) => {
        const user_id = req.user_id;
        try{
            const games = await connection.query( "SELECT * FROM games WHERE user_id = $1;",  { bind: [user_id], type: QueryTypes.SELECT } );
            if(games.length <= 0) return res.status(200).json({ok: true, msg: 'No existen juegos.', games: [] });
            
            return res.status(200).json({ ok: true,  msg: 'Juegos obtenidos.', games: games });
    
        } catch (error) {
            console.log(error);
            return res.status(400).json({ok: false, msg: 'Error al obtener los juegos.' });
        }
    }

    verifyJWT = async (req, res) => {
        let newToken = null;
        try {
            const token = req.header('x-token');
            if (!token) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No hay token en la petición'
                });
            }
    
            const jwt_key = process.env.JWT_SECRET;
    
            jwt.verify(token, jwt_key, async (error, decoded) => {
                
                if (error) {
                    console.log(error);
                    if (error.name == 'TokenExpiredError') {
                        const decoded_token = jwt.decode(token);
                        newToken = await generateJWT({user_id: decoded_token.user_id, email: decoded_token.email});
                        throw new Error("Token expirado");       
                    } else {
                        return res.status(400).json({ msg: 'Token inválido', ok: false });
                    }
                } else {
                    const user = await connection.query(`SELECT * FROM users WHERE email = $1`, { bind: [decoded.email], type: QueryTypes.SELECT });
                    if( user.length <= 0 ) return res.status(401).json({ msg: 'Token inválido', ok: false });
                    return res.status(200).json({ msg: 'Token válido', ok: true });
                }
            });
        } catch (error) {
            console.log(error);
            if(newToken) return res.status(411).json({ msg: 'Token expirado', ok: false, token: newToken });
            return res.status(400).json({ msg: 'Token inválido', ok: false });
        }
    }



}

module.exports = ChessController


