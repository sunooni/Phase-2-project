const express = require('express');
const morgan = require('morgan');
const path = require('path');

const authRouter = require('./routes/auth.route');
const bookRouter = require('./routes/book.route');
const favoriteRouter = require('./routes/favorite.route');
const iaRouter = require('./routes/ai.route');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve uploaded files from server/uploads (one level above src)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/ai', iaRouter);
app.use('/api/api/ai', iaRouter);

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
