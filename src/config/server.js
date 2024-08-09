// Importar los módulos necesarios
//const fileUpload = require('express-fileupload');
const express = require('express');
const cors = require('cors');
const expressSanitizer = require('express-sanitizer');
const bodyParser = require('body-parser');
const { connection, createConnection } = require('./database'); // Importar la configuración de la base de datos

class Server {
   
  constructor() {
      this.app = express();
      this.port = process.env.PORT
      
      // Database connect
      createConnection();

      // Middlewares
      this.middlewares();

      // Rutas de la app
      this.routes();
  }

  middlewares() {
      //cors
      this.app.use(cors());

      // lectrua y parseo del body
      this.app.use(express.json({limit: '1mb'}))

      //directorio publico
      this.app.use(express.static('public'));

      // sanitizar inputs
      this.app.use(expressSanitizer());

      // carga de archivos
      // this.app.use(fileUpload());  
  }

  routes() {
    // this.app.use('/api/', require('../routes/'));
    this.app.use('/api/chess', require('../routes/chess'));
    this.app.use('/', require('../routes/all'));
  }
      
  /* listen() { // PARA DESARROLLO
    this.app.listen(this.port, '0.0.0.0',() => {console.log(`escuchando puerto: ${this.port}`)} )
  } */
  listen() { // PARA PRODUCCION
    this.app.listen(this.port, () => {console.log(`escuchando puerto: ${this.port}`)} )
  }
 
}


module.exports = Server;