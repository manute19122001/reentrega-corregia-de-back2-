  
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('./config/pass');
const sessionsRouter = require('./routes/sessions');

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/mydatabase');

app.use(express.json());
app.use(passport.initialize());

app.use('/api/sessions', sessionsRouter);

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});