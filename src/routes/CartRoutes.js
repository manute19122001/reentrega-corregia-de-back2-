const { Router } = require('express');
const cartController = require('../controllers/CartController');
const passport = require('passport');
const router = Router();
// Todas las rutas del carrito deben estar protegidas y requerir un usuario autenticado
router.use(passport.authenticate('jwt', { session: false })); // Middleware de autenticación JWT
router.use(cartController.ensureCart); // Middleware para asegurar que el usuario tenga un carrito
// Obtener el carrito del usuario autenticado
router.get('/', cartController.getCart);
// Agregar un producto al carrito
router.post('/:productId', cartController.addProduct); // Envía productId en params, quantity en body
// Eliminar un producto del carrito
router.delete('/:productId', cartController.removeProduct);
// Actualizar la cantidad de un producto en el carrito
router.put('/:productId', cartController.updateProductQuantity); // Envía nueva quantity en body
// Vaciar el carrito completo
router.delete('/', cartController.clearCart);
module.exports = router;