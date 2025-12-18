const express = require('express');
const morgan = require('morgan');
const path = require('path')

const authRouter = require('./routes/auth.route');
const bookRouter = require('./routes/book.route');
const favoriteRouter = require('./routes/favorite.route')
const iaRouter = require('./routes/ai.route')
const cookieParser = require('cookie-parser')

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const i18next = require('i18next');
const i18nextBackend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');

i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'ru',
    preload: ['ru', 'en'],
    lng: 'ru',
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['querystring', 'cookie', 'header']
    }
  });

app.use(i18nextMiddleware.handle(i18next));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/ai', iaRouter)
app.use('/api/api/ai', iaRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500)
});

module.exports = app;