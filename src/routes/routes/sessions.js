// ... (imports existentes, Router, sessionController)
const { Router } = require('express');
const sessionController = require('../controllers/SessionController'); // Asegúrate de la ruta
const router = Router();

// ... (tus rutas existentes de registro, login, etc.)

// Ruta para solicitar el restablecimiento de contraseña
router.post('/forgot-password', sessionController.forgotPassword);

// Ruta para restablecer la contraseña (recibe el token en la URL)
router.post('/reset-password/:token', sessionController.resetPassword);

module.exports = router;