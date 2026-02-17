const mongoose = require('mongoose'); // Usamos mongoose directamente
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true // Generalmente el nombre es requerido
  },
  last_name: {
    type: String,
    required: true // Generalmente el apellido es requerido
  },
  email: {
    type: String,
    unique: true,
    required: true // El email es clave y único
  },
  age: {
    type: Number,
    // required: true // Quita el comentario si la edad es obligatoria
  },
  password: {
    type: String,
    required: true // La contraseña es obligatoria
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    default: null // Por si el carrito se crea después o no siempre existe
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Solo permite 'user' o 'admin'
    default: 'user'
  },
  resetPasswordToken: String, // Campo para guardar el token de restablecimiento
  resetPasswordExpires: Date  // Campo para guardar la fecha de expiración del token
}, {
  timestamps: true // Esto agrega createdAt y updatedAt automáticamente
});
module.exports = mongoose.model('User', userSchema);
