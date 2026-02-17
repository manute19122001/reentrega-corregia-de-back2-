// managers/UserManager.js
const User = require('../models/user'); // Asegúrate de que la ruta sea correcta a tu modelo de usuario
const crypto = require('crypto'); // Módulo nativo de Node.js para generar tokens
const transporter = require('../config/nodemailer'); // Importa el transporter de Nodemailer (que crearemos)
const bcrypt = require('bcrypt'); // ¡IMPORTANTE! Asegúrate de que tienes bcrypt para hashear contraseñas
class UserManager {
  async getUserByEmail(email) {
    return await User.findOne({ email });
  }
  // <<<--- LA LÍNEA module.exports = UserManager; ESTABA AQUÍ, Y NO VA AQUÍ
  async getUserById(id) {
    return await User.findById(id);
  }
  async createUser(userData) {
    // Es CRUCIAL hashear la contraseña aquí antes de guardar un nuevo usuario
    // Asumiendo que `userData.password` contiene la contraseña en texto plano
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10); // Hash con salt de 10 rondas
    }
    const user = new User(userData);
    return await user.save();
  }
  // --- MÉTODOS PARA RECUPERACIÓN DE CONTRASEÑA ---
  async generateResetToken(email) {
    const user = await this.getUserByEmail(email); // Reutilizamos el método existente
    if (!user) {
      throw new Error('No existe un usuario registrado con ese email.');
    }
    // Generar un token aleatorio
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Guardar el token y la fecha de expiración en el usuario
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Expira en 1 hora (3600000 ms)
    await user.save();
    return resetToken; // Devolvemos el token para que el controlador lo use en el email
  }
  async sendPasswordResetEmail(userEmail, token) {
    const mailOptions = {
      to: userEmail,
      from: process.env.EMAIL_USER, // Tu email configurado en .env
      subject: 'Restablecimiento de Contraseña para tu cuenta de E-commerce',
      html: `
        <p>Hola,</p>
        <p>Estás recibiendo este correo porque se ha solicitado el restablecimiento de contraseña para tu cuenta.</p>
        <p>Por favor, haz clic en el siguiente enlace para completar el proceso:</p>
        <p><a href="${process.env.FRONTEND_URL}/reset-password/${token}">Restablecer Contraseña</a></p>
        <p>Este enlace es válido por 1 hora.</p>
        <p>Si no solicitaste esto, por favor, ignora este correo.</p>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email de restablecimiento enviado a ${userEmail}`);
  }
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Verifica que el token no haya expirado
    });
    if (!user) {
      throw new Error('El token de restablecimiento de contraseña es inválido o ha expirado.');
    }
    // ¡CRUCIAL! Hashear la nueva contraseña antes de guardarla
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined; // Limpiar el token
    user.resetPasswordExpires = undefined; // Limpiar la fecha de expiración
    await user.save();
    return user;
  }
}
// ESTA LÍNEA ES LA QUE DEBE IR AQUÍ, AL FINAL DEL ARCHIVO, FUERA DE LA CLASE.
module.exports = UserManager;