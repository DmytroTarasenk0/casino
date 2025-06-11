const express = require('express');
const session = require('express-session');
const path = require('path');
require('./db/sequelize');

const userRoutes = require('./routes/userRoutes');
const pageRoutes = require('./routes/pageRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(require('./middleware/currentUser'));
app.use('/', userRoutes);
app.use('/', pageRoutes);

app.listen(3000, () => console.log('Server started on http://localhost:3000'));