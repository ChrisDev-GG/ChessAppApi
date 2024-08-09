// routes
const express = require('express');
const ChessController = require('../controllers/chess');
const sanitizeInputs = require('../middleware/input-sanitizer');

const { verifyJWT } = require('../middleware/jwt');


const router = express.Router();
const chess = new ChessController();

 // Ruta para registrar el email
router.post('/enter', chess.enterWithEmail );
router.get('/verifyToken', chess.verifyJWT );

 // Ruta para log/register usuarios
router.post('/save-game', [verifyJWT], chess.saveGame );
router.post('/get-games', [verifyJWT], chess.getGames );


router.get('*', function (req, res) {
    res.statusCode=404;
    res.setHeader('Content-Type', 'text/plain');
    return res.send('404 | page not found');
  })

module.exports = router;
