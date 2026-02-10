
require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('./config/pass');
const sessionsRouter = require('./routes/sessions');

const app = express();


mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));


app.use(express.json());
app.use(cookieParser()); 
app.use(passport.initialize());


app.use('/api/sessions', sessionsRouter);


const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
