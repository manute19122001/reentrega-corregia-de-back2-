const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true // Para quitar espacios en blanco al inicio y al final
  },
  description: {
    type: String,
    required: false // O true, dependiendo si siempre quieres una descripción
  },
  price: {
    type: Number,
    required: true,
    min: 0 // El precio no puede ser negativo
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0 // El stock no puede ser negativo
  },
  category: {
    type: String,
    required: false // Podrías hacerlo requerido si planeas usarlo mucho para filtrar
  },
  thumbnail: {
    type: String,
    required: false // Opcional, la URL de una imagen del producto
  }
}, {
  timestamps: true // Añade `createdAt` y `updatedAt` automáticamente
});
module.exports = mongoose.model('Product', ProductSchema);