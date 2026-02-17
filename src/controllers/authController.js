// controllers/authController.js
// 1. Importaciones:
//
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const UserManager = require("../managers/UserManager"); // ¡Ahora este manager tendrá los métodos de recuperación!
const CartManager = require("../managers/Cart.manager"); // Asumo que esta ruta es correcta
// Instancia los managers
const userManager = new UserManager();
const cartManager = new CartManager();

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userManager.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const isValid = await bcrypt.compare(password, user.password); // Usar await con bcrypt.compare
    if (!isValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = generateToken(user);
    res
      .cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",

        secure: process.env.NODE_ENV === "production"
      })
      .json({ message: "Login correcto" });
  } catch (err) {
    console.error("Error en el login:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const currentUser = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "No autenticado" });
  }
};

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const existingUser = await userManager.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "El correo electrónico ya está registrado." });
    }
    // ¡UserManager ahora hashea la contraseña, así que no es necesario aquí!
    const newUser = await userManager.createUser({
      first_name,
      last_name,
      email,
      age,
      password // Pasamos la contraseña sin hashear, el UserManager se encargará
    });

     if (newUser && newUser._id) {
         await cartManager.createCart(newUser._id);
         console.log(`Carrito creado exitosamente para el usuario: ${newUser._id}`);
     } else {
         console.warn("Advertencia: Usuario registrado, pero no se pudo crear el carrito.");
     }

    res.status(201).json({ message: "Usuario registrado con éxito" }); // Usamos 201
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// --- NUEVOS MÉTODOS PARA RECUPERACIÓN DE CONTRASEÑA ---

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const resetToken = await userManager.generateResetToken(email); // Usamos userManager
    await userManager.sendPasswordResetEmail(email, resetToken); // Usamos userManager

    res.status(200).json({ message: 'Se ha enviado un enlace de restablecimiento de contraseña a tu email.' });
  } catch (err) {
    console.error("Error en forgotPassword:", err.message);
    // Es buena práctica no revelar si el email existe o no por razones de seguridad,
    // o dar un mensaje genérico aunque haya fallado por otro motivo (ej. email no existe).
    // Aquí podemos ser un poco más específicos si la intención es que el usuario sepa que su email no está registrado.
    if (err.message.includes('No existe un usuario')) {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: "Error interno del servidor o al solicitar el restablecimiento de contraseña." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // El token viene de la URL
    const { newPassword } = req.body; // La nueva contraseña viene del cuerpo de la petición

    // Aquí podrías añadir validación de la nueva contraseña (ej. longitud mínima, caracteres especiales)
    if (!newPassword || newPassword.length < 6) { // Ejemplo de validación básica
      return res.status(400).json({ message: "La nueva contraseña debe tener al menos 6 caracteres." });
    }

    await userManager.resetPassword(token, newPassword); // Usamos userManager

    res.status(200).json({ message: 'Tu contraseña ha sido restablecida con éxito.' });
  } catch (err) {
    console.error("Error en resetPassword:", err.message);
    if (err.message.includes('inválido o ha expirado')) {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Error interno del servidor o al restablecer la contraseña." });
  }
};

module.exports = {
  login,
  currentUser,
  register,
  forgotPassword, // Añadido
  resetPassword   // Añadido
};