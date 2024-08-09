
// Importar la configuración de la base de datos
require('dotenv').config();

// Importar el módulo de conexión a la base de datos
const { Sequelize } = require('sequelize');
const mysql = require('mysql2');

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: 'localhost',
  port: process.env.DB_PORT,
  dialect: 'mysql'
});

const createConnection = async () => {
  try {
    await connection.authenticate();
    console.log('Conectado a la BD MySql.');
  } catch (error) {
    console.error('Error al conectar a la BD:', error);
  }
} 


// Exportar la conexión para usarla en otros archivos
module.exports = { connection, createConnection };


// ================ CONEXION DIRECTA CON EL MODULO MYSQL2 ================
/* // Configuración de la conexión a la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

// Crear una conexión a la base de datos
const connection = mysql.createConnection(dbConfig);

// Conectar a la base de datos
const createConnection = async () => {
  connection.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err);
      return;
    }
    console.log('Conexión establecida a la base de datos MySQL');
  });
} */
// =====================================================================