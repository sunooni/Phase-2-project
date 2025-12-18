const BookService = require('../services/book.service');
const Favorite = require('../../db/models');
const Book = require('../../db/models');

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

  static async getBookByFavorites(req, res) {
    const userId = req.user.id;
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Book,
          attributes: ['id', 'title', 'author', 'image'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const books = favorites.map((el) => ({
      id: el.Book.id,
      title: el.Book.title,
      author: el.Book.author,
      image: el.Book.image,
    }));
    res.json(books)
  }


  static async addToFavorites (req, res) {
  
    const { bookId } = req.body;
    const userId = req.user.id;

    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId, bookId },
      defaults: { userId, bookId }
    });

    if (!created) {
      return res.status(400).json({ message: 'Книга уже в избранном', favoriteId: favorite.id });
    }

    res.status(201).json({ message: 'Книга добавлена в избранное'});
  }

  static async removeFromFavorites (req, res) {
  
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await Favorite.destroy({
      where: { id, userId }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Избранное не найдено' });
    }

    res.json({ message: 'Книга удалена из избранного' });
  }


}

module.exports = BookController;
