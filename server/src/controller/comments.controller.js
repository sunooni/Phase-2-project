
const { Comment, Book, User } = require('../models');
// Get all comments for a specific book
exports.getCommentsByBook = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { bookId: req.params.bookId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] }, // adjust fields as needed
        { model: Book, as: 'book', attributes: ['id', 'title'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new comment
exports.createComment = async (req, res) => {
  try {
    const { body, rating } = req.body;
    const userId = req.user?.id || 1; // Get from auth middleware or default
    const { bookId } = req.params.bookId;

    const comment = await Comment.create({
      userId,
      bookId,
      body,
      sentimentScore: rating || null,
      isEmotional: false
    });

    // Include user and book data
    const populatedComment = await Comment.findByPk(comment.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: Book, as: 'book', attributes: ['id', 'title'] }
      ]
    });

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
