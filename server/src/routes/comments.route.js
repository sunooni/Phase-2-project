const express = require('express');
const router = express.Router();
const commentController = require('../controller/comments.controller');

// GET comments for a specific book
router.get('/books/:bookId/comments', commentController.getCommentsByBook);

// POST new comment for a book
router.post('/books/:bookId/comments', commentController.createComment);

module.exports = router;
