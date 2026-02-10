// controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserManager = require("../managers/UserManager");

const userManager = new UserManager();

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await userManager.getByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res
    .cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false // true en prod
    })
    .json({ message: "Login correcto" });
};

const currentUser = async (req, res) => {
  res.json(req.user);
};

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    await userManager.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });

    res.json({ message: "Usuario registrado con éxito" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

module.exports = {
  login,
  currentUser,
  register
};
