const CartManager = require('../managers/Cart.manager');
const cartManager = new CartManager();
const passport = require('passport'); // Para proteger las rutas
const cartController = {
  // Middleware para asegurar que el usuario tenga un carrito
  ensureCart: async (req, res, next) => {
    try {
      // Asume que req.user ya está disponible por el middleware de autenticación (JWT)
      if (!req.user) {
        return res.status(401).json({ message: "No autorizado. Inicia sesión para tener un carrito." });
      }
      let cart = await cartManager.getCartByUserId(req.user._id);
      if (!cart) {
        cart = await cartManager.createCart(req.user._id);
        console.log(`Carrito creado para el usuario: ${req.user._id}`);
      }
      req.cart = cart; // Adjunta el carrito al objeto de request para usarlo en otras funciones
      next();
    } catch (err) {
      console.error("Error al asegurar el carrito:", err);
      res.status(500).json({ message: "Error interno del servidor al verificar el carrito." });
    }
  },
  getCart: async (req, res) => {
    try {
      // El carrito ya está adjunto en req.cart por el middleware ensureCart
      res.json(req.cart);
    } catch (err) {
      console.error("Error al obtener el carrito:", err);
      res.status(500).json({ message: "Error interno del servidor al obtener el carrito." });
    }
  },
  addProduct: async (req, res) => {
    try {
      const { productId } = req.params; // ID del producto a añadir
      const { quantity } = req.body; // Cantidad del producto (por defecto 1)
      
      const updatedCart = await cartManager.addProductToCart(req.user._id, productId, quantity || 1);
      res.status(200).json({ message: "Producto añadido al carrito.", cart: updatedCart });
    } catch (err) {
      console.error("Error al añadir producto al carrito:", err.message);
      if (err.message.includes('stock')) {
          return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: "Error interno del servidor al añadir producto al carrito." });
    }
  },
  removeProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const updatedCart = await cartManager.removeProductFromCart(req.user._id, productId);
      res.status(200).json({ message: "Producto eliminado del carrito.", cart: updatedCart });
    } catch (err) {
      console.error("Error al eliminar producto del carrito:", err);
      res.status(500).json({ message: "Error interno del servidor al eliminar producto del carrito." });
    }
  },
  updateProductQuantity: async (req, res) => {
    try {
      const { productId } = req.params;
      const { quantity } = req.body; // Nueva cantidad
      
      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser un número positivo." });
      }
      const updatedCart = await cartManager.updateProductQuantity(req.user._id, productId, quantity);
      res.status(200).json({ message: "Cantidad de producto actualizada en el carrito.", cart: updatedCart });
    } catch (err) {
        console.error("Error al actualizar cantidad de producto en el carrito:", err.message);
        if (err.message.includes('stock')) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Error interno del servidor al actualizar cantidad de producto en el carrito." });
    }
  },
  clearCart: async (req, res) => {
    try {
      const updatedCart = await cartManager.clearCart(req.user._id);
      res.status(200).json({ message: "Carrito vaciado.", cart: updatedCart });
    } catch (err) {
      console.error("Error al vaciar el carrito:", err);
      res.status(500).json({ message: "Error interno del servidor al vaciar el carrito." });
    }
  }
};
module.exports = cartController;