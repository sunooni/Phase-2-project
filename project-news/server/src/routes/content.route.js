const express = require('express')
const router = express.Router()
const ContentController = require('../controller/content.controller');
const verifyRefreshToken = require('../middlewares/verifyRefreshToken')
const verifyAccessToken = require('../middlewares/verifyAccessToken')
const validateId = require('../middlewares/validateUser')

router.get('/my', verifyAccessToken, ContentController.getContentByAuthor)
router.get('/', ContentController.getAllContent);
router.post('/', verifyRefreshToken, ContentController.createContent);
router.get('/:id', verifyAccessToken, validateId, ContentController.getContentById);
router.put('/:id', ContentController.updateContent);
router.delete('/:id', verifyAccessToken, validateId, ContentController.deleteContent);


module.exports = router;