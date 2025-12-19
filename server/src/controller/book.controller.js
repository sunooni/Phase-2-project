const BookService = require('../services/book.service');

class BookController {
  static async getAllBooks(req, res) {
    try {
      const { genre, author, minRating, sortByRating } = req.query;
      const filters = {};

      if (genre) filters.genre = genre;
      if (author) filters.author = author;
      if (minRating) filters.minRating = parseFloat(minRating);
      if (sortByRating) filters.sortByRating = sortByRating; // 'asc' или 'desc'

      const books = await BookService.getAllBooks(filters);
      return res.json(books);
    } catch (error) {
      console.error('Error getting books:', error);
      return res.status(500).json({ error: 'Ошибка получения книг' });
    }
  }

  

  static async getBookById(req, res) {
    const { id } = req.params;
    const book = await BookService.getBookById(id);
    if (!book) {
      return res.status(404).json({ error: 'Книга не найдена' });
    }
    return res.json(book);
  }

  static async createBook(req, res) {
    try {
      let image = null;
      if (req.file) {
        image = `/uploads/${req.file.filename}`;
      } else if (req.body.image) {
        image = req.body.image;
      }
      const data = {
        ...req.body,
        image,
        userId: res.locals.user.id,
      };
      delete data.imageUrl;

      const book = await BookService.createBook(data);
      return res.status(201).json(book);
    } catch (error) {
      console.error('Create book error:', error);
      return res.status(500).json({ error: 'Ошибка создания книги' });
    }
  }

  static async updateBook(req, res) {
    const { id } = req.params;
    const data = req.body;
    const book = await BookService.updateBook(id, data);
    if (!book) {
      return res.sendStatus(404);
    }
    return res.json(book);
  }

  static async deleteBook(req, res) {
    const { user } = res.locals;
    const { id } = req.params;
    const book = await BookService.getBookById(id);
    if (!book) {
      return res.sendStatus(404);
    }
    if (book.userId !== user.id) {
      return res.sendStatus(403);
    }
    await BookService.deleteBook(id);
    res.sendStatus(204);
  }
// Добавьте этот метод в BookController



  static async getGenres(req, res) {
    try {
      const genres = await BookService.getUniqueGenres();
      return res.json(genres);
    } catch (error) {
      console.error('Error getting genres:', error);
      return res.status(500).json({ error: 'Ошибка получения жанров' });
    }
  }

  static async addRating(req, res) {
    try {
      const { id } = req.params;
      const { rating } = req.body;
      const { user } = res.locals;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Рейтинг должен быть от 1 до 5' });
      }

      const result = await BookService.addRating(id, user.id, rating);
      return res.json(result);
    } catch (error) {
      console.error('Error adding rating:', error);
      return res.status(500).json({ error: 'Ошибка добавления рейтинга' });
    }
  }

  static async getUserRating(req, res) {
    try {
      const { id } = req.params;
      const { user } = res.locals;

      const rating = await BookService.getUserRating(id, user.id);
      return res.json({ rating });
    } catch (error) {
      console.error('Error getting user rating:', error);
      return res.status(500).json({ error: 'Ошибка получения рейтинга' });
    }
  }

  static async addComment(req, res) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const { user } = res.locals;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Комментарий не может быть пустым' });
      }

      const comment = await BookService.addComment(id, user.id, text.trim());
      return res.status(201).json(comment);
    } catch (error) {
      console.error('Error adding comment:', error);
      return res.status(500).json({ error: 'Ошибка добавления комментария' });
    }
  }

  static async updateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { text } = req.body;
      const { user } = res.locals;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Комментарий не может быть пустым' });
      }

      const comment = await BookService.updateComment(commentId, user.id, text.trim());
      if (!comment) {
        return res
          .status(404)
          .json({
            error: 'Комментарий не найден или у вас нет прав на его редактирование',
          });
      }

      return res.json(comment);
    } catch (error) {
      console.error('Error updating comment:', error);
      return res.status(500).json({ error: 'Ошибка обновления комментария' });
    }
  }

  static async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const { user } = res.locals;

      const success = await BookService.deleteComment(commentId, user.id);
      if (!success) {
        return res
          .status(404)
          .json({ error: 'Комментарий не найден или у вас нет прав на его удаление' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting comment:', error);
      return res.status(500).json({ error: 'Ошибка удаления комментария' });
    }
  }
}

module.exports = BookController;
