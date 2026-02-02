// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY || 'un_secreto_seguro', { expiresIn: '1h' });
  res.json({ token });
};

const currentUser = async (req, res) => {
  res.json(req.user);
};

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const user = new User({ first_name, last_name, email, age, password });
    await user.save();
    res.json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

module.exports = { login, currentUser, register };