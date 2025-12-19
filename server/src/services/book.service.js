const { Book, Rating } = require('../../db/models');
const { Op } = require('sequelize');

class BookService {
  static async getAllBooks(filters = {}) {
    const whereConditions = {};
    const includeOptions = [
      {
        model: Rating,
        as: 'ratings',
        attributes: ['mark'],
      },
    ];

    // Фильтр по жанру
    if (filters.genre) {
      whereConditions.genre = {
        [Op.iLike]: `%${filters.genre}%`,
      };
    }

    // Фильтр по автору
    if (filters.author) {
      whereConditions.author = {
        [Op.iLike]: `%${filters.author}%`,
      };
    }

    const books = await Book.findAll({
      where: whereConditions,
      include: includeOptions,
    });

    // Добавляем средний рейтинг к каждой книге
    const booksWithRating = books.map((book) => {
      const bookData = book.toJSON();
      if (bookData.ratings && bookData.ratings.length > 0) {
        bookData.avgRating =
          bookData.ratings.reduce((sum, r) => sum + r.mark, 0) / bookData.ratings.length;
      } else {
        bookData.avgRating = 0;
      }
      return bookData;
    });

    // Фильтр по минимальному рейтингу
    let filteredBooks = booksWithRating;
    if (filters.minRating) {
      filteredBooks = booksWithRating.filter(
        (book) =>
          // Если нет рейтингов, книга не проходит фильтр
          book.avgRating >= filters.minRating,
      );
    }

    // Сортировка по рейтингу
    if (filters.sortByRating) {
      filteredBooks.sort((a, b) => {
        if (filters.sortByRating === 'asc') {
          return a.avgRating - b.avgRating;
        }
        if (filters.sortByRating === 'desc') {
          return b.avgRating - a.avgRating;
        }
        return 0;
      });
    }

    return filteredBooks;
  }

  static async getBookById(id) {
    const book = await Book.findByPk(id, {
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: ['mark'],
        },
      ],
    });

    if (!book) {
      return null;
    }

    const bookData = book.toJSON();
    if (bookData.ratings && bookData.ratings.length > 0) {
      bookData.avgRating =
        bookData.ratings.reduce((sum, r) => sum + r.mark, 0) / bookData.ratings.length;
    } else {
      bookData.avgRating = 0;
    }

    return bookData;
  }
  
  static async createBook(data) {
    return Book.create(data);
  }

  static async updateBook(id, data) {
    const book = await Book.findByPk(id);
    if (!book) {
      return null;
    }
    return book.update(data);
  }

  static async deleteBook(id) {
    await Book.destroy({ where: { id } });
    return true;
  }

  static async getUniqueGenres() {
    const books = await Book.findAll({
      attributes: ['genre'],
      where: {
        genre: {
          [Op.not]: null,
          [Op.ne]: '',
        },
      },
      group: ['genre'],
      order: [['genre', 'ASC']],
    });

    return books.map((book) => book.genre).filter(Boolean);
  }
}

module.exports = BookService;
