// managers/CartManager.js
const Cart = require('../models/cart.model'); // Asegúrate de que la ruta sea correcta a tu archivo de modelo de carrito
const Product = require('../models/product.model'); // ¡IMPORTANTE! Necesitamos el modelo Product para verificar el stock
class CartManager {
  // 1. Método para obtener el carrito de un usuario específico (por su ID de usuario)
  async getCartByUserId(userId) {
    // Busca el carrito del usuario. Populate 'products.product' para obtener los detalles completos del producto
    // Esto asume que el campo en tu modelo Cart se llama 'user' (como ajustamos antes)
    return await Cart.findOne({ user: userId }).populate('products.product');
  }
  // 2. Método para crear un carrito, ahora asociado a un ID de usuario
  async createCart(userId) {
    const newCart = new Cart({ user: userId, products: [] });
    return await newCart.save();
  }
  // 3. Método para añadir un producto al carrito
  async addProductToCart(userId, productId, quantity) { // Ahora recibe userId en lugar de cartId
    const cart = await Cart.findOne({ user: userId }); // Busca el carrito por userId
    if (!cart) {
      throw new Error('Carrito no encontrado para este usuario.');
    }
    const product = await Product.findById(productId); // Busca el producto para verificar stock
    if (!product) {
      throw new Error('Producto no encontrado.');
    }
    // Calcula la nueva cantidad total si el producto ya está en el carrito
    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    let newTotalQuantity = quantity;
    if (productIndex > -1) {
      newTotalQuantity = cart.products[productIndex].quantity + quantity;
    }
    // Verifica si hay suficiente stock ANTES de añadir/actualizar
    if (product.stock < newTotalQuantity) {
        throw new Error(`No hay suficiente stock para el producto "${product.name}". Stock disponible: ${product.stock}`);
    }
    if (productIndex > -1) {
      // Si el producto ya existe en el carrito, actualiza la cantidad
      cart.products[productIndex].quantity = newTotalQuantity; // Actualiza con la nueva cantidad total
    } else {
      // Si el producto no existe, lo añade
      cart.products.push({ product: productId, quantity });
    }
    return await cart.save();
  }
  // 4. Método para eliminar un producto del carrito
  async removeProductFromCart(userId, productId) { // También recibe userId
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Carrito no encontrado para este usuario.');
    }
    // Filtra el array de productos para quitar el que coincide con productId
    cart.products = cart.products.filter(item => item.product.toString()!== productId);
    return await cart.save();
  }
  // 5. Método para actualizar la cantidad de un producto específico en el carrito
  async updateProductQuantity(userId, productId, newQuantity) { // Recibe userId y la nueva cantidad
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Carrito no encontrado para este usuario.');
    }
    const product = await Product.findById(productId); // Verifica stock para la nueva cantidad
    if (!product) {
      throw new Error('Producto no encontrado.');
    }
    if (product.stock < newQuantity) {
        throw new Error(`No hay suficiente stock para el producto "${product.name}" para la cantidad solicitada. Stock disponible: ${product.stock}`);
    }
    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity = newQuantity; // Actualiza la cantidad
    } else {
      throw new Error('Producto no encontrado en el carrito.'); // Si no está, no se puede actualizar la cantidad
    }
    return await cart.save();
  }
  // 6. Método para vaciar completamente el carrito
  async clearCart(userId) { // Recibe userId
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new Error('Carrito no encontrado para este usuario.');
    }
    cart.products = []; // Simplemente vacía el array de productos
    return await cart.save();
  }
}
module.exports = CartManager;