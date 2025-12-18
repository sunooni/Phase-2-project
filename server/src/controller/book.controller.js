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
    const data = req.body;
    const book = await BookService.createBook({
      ...data,
      userId: res.locals.user.id,
    });
    return res.status(201).json(book);
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

    static async getGenres(req, res) {
    try {
      const genres = await BookService.getUniqueGenres();
      return res.json(genres);
    } catch (error) {
      console.error('Error getting genres:', error);
      return res.status(500).json({ error: 'Ошибка получения жанров' });
    }
  }

}

module.exports = BookController;
