// controllers/authController.js
// 1. Importaciones:
//    
const { generateToken } = require("../utils/jwt"); 
const bcrypt = require("bcrypt");
const UserManager = require("../managers/UserManager");
const CartManager = require("../managers/Cart.manager"); 
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
    const isValid = bcrypt.compareSync(password, user.password);
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
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await userManager.createUser({ 
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });
   











    
    res.status(201).json({ message: "Usuario registrado con éxito" }); // Usamos 201
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
module.exports = {
  login,
  currentUser,
  register
};