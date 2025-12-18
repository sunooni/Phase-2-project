const { Favorite, Book, User } = require('../../db/models');

class FavoriteService {
  static async getUserFavorites(userId) {
    const favorites = await Favorite.findAll({
      where: { userId },
      attributes: ['id', 'userId', 'bookId', 'createdAt'],
      include: [
        {
          model: Book,
          attributes: ['id', 'title', 'author', 'image'],
        },
      ],
      order: [['createdAt', 'DESC']],
      raw: false,
    });

    const result = favorites
      .filter((fav) => fav.Book)
      .map((fav) => {
        const favoriteId = fav.id;

        const bookData = {
          id: fav.Book.id,
          title: fav.Book.title,
          author: fav.Book.author,
          image: fav.Book.image,
          favoriteId,
        };

        return bookData;
      });

    return result;
  }

  static async addToFavorites(userId, bookId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
      throw new Error('Книга не найдена');
    }

    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId, bookId },
      defaults: { userId, bookId },
    });

    return { favorite, created };
  }

  static async removeFromFavorites(favoriteId, userId) {
    const deleted = await Favorite.destroy({
      where: { id: favoriteId, userId },
    });
    return deleted;
  }
}

module.exports = FavoriteService;
