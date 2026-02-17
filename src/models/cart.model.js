// src/models/cart.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product', // Asegúrate de que 'Product' sea el nombre de tu modelo de productos
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  }
});
const CartSchema = new Schema({
  // Cambiado de 'userId' a 'user' para mayor consistencia con el req.user y el CartManager que te pasé
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Asegúrate de que 'User' sea el nombre de tu modelo de usuarios
    required: true,
    unique: true // Un usuario solo debe tener un carrito activo
  },
  products: [CartItemSchema] // Array de ítems del carrito
}, {
  timestamps: true // Opcional: añade campos createdAt y updatedAt
});
// Exporta el modelo para que pueda ser usado en otros archivos
module.exports = mongoose.model('Cart', CartSchema);