const express = require('express');
const router = express.Router();
const BookController = require('../controller/book.controller');
const multer = require('multer');  
const path = require('path');  
const fs = require('fs');      
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const validateId = require('../middlewares/validateUser');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    console.log('📁 Multer путь:', uploadPath);
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get('/', BookController.getAllBooks);
router.post('/', verifyAccessToken, upload.single('cover'), BookController.createBook);
router.get('/genres', BookController.getGenres);
router.post('/', verifyRefreshToken, BookController.createBook);
router.get('/:id', verifyAccessToken, validateId, BookController.getBookById);
router.put('/:id', BookController.updateBook);
router.delete('/:id', verifyAccessToken, validateId, BookController.deleteBook);

module.exports = router;
