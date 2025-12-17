const express = require('express');
const morgan = require('morgan');

const authRouter = require('./routes/auth.route');
const contentRouter = require('./routes/content.route')
const cookieParser = require('cookie-parser')

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/contents', contentRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500)
});

module.exports = app;