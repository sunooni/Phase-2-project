const BookService = require('../services/book.service');

class BookController {
  static async getAllBooks(req, res) {
    const book = await BookService.getAllBooks();
    return res.json(book);
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

}

module.exports = BookController;
