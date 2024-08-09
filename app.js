// Archivo principal de la API => Ejecución del servidor

require('dotenv').config();
const Server = require('./src/config/server');

const server = new Server();
server.listen(); // Iniciar el servidor