const express = require('express')
const router = express.Router()
const FavoritesController = require('../controller/favorite.controller');
const verifyAccessToken = require('../middlewares/verifyAccessToken')


router.get('/', verifyAccessToken, FavoritesController.getBookByFavorites);           
router.post('/', verifyAccessToken, FavoritesController.addToFavorites);             
router.delete('/:id', verifyAccessToken, FavoritesController.removeFromFavorites);   

module.exports = router;