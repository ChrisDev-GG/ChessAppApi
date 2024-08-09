const { Router } = require('express');

const router = Router();

// Ruta para manejar todas las rutas no definidas
router.get('*', function (req, res) {
    res.statusCode=404;
    res.setHeader('Content-Type', 'text/html');
    return res.send('Error 404: No se encuentra la página solicitada.');
})


module.exports = router;