// routes/products.router.js
const { Router } = require('express');
const productController = require('../controllers/ProductController'); // Asegúrate de que la ruta sea correcta a tu ProductController.js
const passport = require('passport'); // Para usar la estrategia JWT si necesitas proteger rutas
const router = Router();
// Ruta para obtener todos los productos
router.get('/', productController.getAllProducts);
// Ruta para obtener un producto por ID
router.get('/:id', productController.getProductById);
// Ruta para crear un nuevo producto
// ¡Importante! Aquí protegeremos la ruta. Solo usuarios autenticados (y con el rol adecuado, si lo implementamos)
// deberían poder crear productos. Por ahora, solo verificaremos que estén autenticados con JWT.
router.post('/', 
  passport.authenticate('jwt', { session: false }), // Protege esta ruta con JWT
  productController.createProduct
);
// Aquí añadiríamos las rutas para actualizar y eliminar productos cuando implementemos esas funciones en el controlador
// router.put('/:id', passport.authenticate('jwt', { session: false }), productController.updateProduct);
// router.delete('/:id', passport.authenticate('jwt', { session: false }), productController.deleteProduct);
module.exports = router;