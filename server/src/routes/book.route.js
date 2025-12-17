const express = require('express')
const router = express.Router()
const BookController = require('../controller/book.controller');
const verifyRefreshToken = require('../middlewares/verifyRefreshToken')
const verifyAccessToken = require('../middlewares/verifyAccessToken')
const validateId = require('../middlewares/validateUser')

router.get('/myFavorites', verifyAccessToken, BookController.getBookByFavorites)
router.get('/', BookController.getAllBooks);
router.post('/', verifyRefreshToken, BookController.createBook);
router.get('/:id', verifyAccessToken, validateId, BookController.getBookById);
router.put('/:id', BookController.updateBook);
router.delete('/:id', verifyAccessToken, validateId, BookController.deleteBook);


module.exports = router;