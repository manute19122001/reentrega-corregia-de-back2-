
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('./config/pass');
const sessionsRouter = require('./routes/sessions');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/CartRoutes');
const path = require('path');
// --- PASO 1: Importar express-handlebars ---
const handlebars = require('express-handlebars');
const app = express();
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));
app.use(express.json());
// --- PASO 2: Importante para procesar datos de formularios HTML ---
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
// --- PASO 3: Configuración de Handlebars ---
app.engine('handlebars', handlebars.engine({
  defaultLayout: 'main',
  // Usamos path.join para construir rutas de forma más robusta
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  extname: '.hbs' // <-- ¡Añade esta línea para especificar la extensión!
}));
// AQUÍ ESTÁ EL CAMBIO CLAVE:
app.set('view engine', 'handlebars'); // <-- ¡Debe ser 'handlebars', no '.hbs'!
app.set('views', path.join(__dirname, 'views'));
// --- PASO 4: Servir archivos estáticos (CSS, JS, imágenes) ---
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/carts', cartsRouter);
// --- PASO 5: Rutas para renderizar las vistas ---
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Bienvenido a mi E-commerce',
    message: 'Esta es la página de inicio. ¡Explora nuestros productos!',
    // Puedes pasar datos del usuario si está logueado, ajusta esto según tu `req.user`
    user: req.user ? req.user.first_name : null
  });
});
app.get('/login', (req, res) => {
  res.render('login', { title: 'Iniciar Sesión' });
});
app.get('/register', (req, res) => {
  res.render('register', { title: 'Registrarse' });
});
app.get('/forgot-password', (req, res) => {
  res.render('forgotPassword', { title: 'Olvidé mi Contraseña' });
});
// Esta ruta manejará la página para restablecer la contraseña, recibiendo el token de la URL
app.get('/reset-password/:token', (req, res) => {
  res.render('resetPassword', {
    title: 'Restablecer Contraseña',
    token: req.params.token // Pasamos el token a la vista para usarlo en el formulario
  });
});
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
  console.log(`Visita http://localhost:${port}`);
});