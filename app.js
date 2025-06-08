const express = require('express');
const session = require('express-session');
const path = require('path');
require('./db/sequelize');

const userRoutes = require('./routes/userRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: 'auction-secret',
  resave: false,
  saveUninitialized: false
}));

app.use('/', userRoutes);

app.listen(3000, () => console.log('Server started on http://localhost:3000'));