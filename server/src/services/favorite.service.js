const { Favorite, Book, User } = require('../../db/models');

class FavoriteService {
  static async getUserFavorites(userId) {
    const favorites = await Favorite.findAll({
      where: { userId },
      attributes: ['id', 'userId', 'bookId', 'createdAt'], // Явно указываем атрибуты Favorite
      include: [{
        model: Book,
        attributes: ['id', 'title', 'author', 'image']
      }],
      order: [['createdAt', 'DESC']],
      raw: false // Получаем экземпляры моделей
    });

    console.log('Найдено избранных:', favorites.length);
    
    const result = favorites
      .filter(fav => fav.Book) // Фильтруем записи, где книга существует
      .map(fav => {
        // Получаем id - он должен быть доступен напрямую
        const favoriteId = fav.id;
        
        console.log('Обработка избранного:', {
          favoriteId,
          bookId: fav.Book?.id,
          bookTitle: fav.Book?.title,
          favType: typeof fav,
          favHasId: fav.hasOwnProperty('id')
        });
        
        if (!favoriteId) {
          console.error('ОШИБКА: favoriteId не найден! fav объект:', {
            id: fav.id,
            dataValues: fav.dataValues,
            toJSON: fav.toJSON ? fav.toJSON() : 'no toJSON'
          });
        }
        
        const bookData = {
          id: fav.Book.id,
          title: fav.Book.title,
          author: fav.Book.author,
          image: fav.Book.image,
          favoriteId: favoriteId
        };
        
        return bookData;
      });

    console.log('Результат getUserFavorites:', JSON.stringify(result, null, 2));
    return result;
  }

  static async addToFavorites(userId, bookId) {
    // Проверяем существование пользователя
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    // Проверяем существование книги
    const book = await Book.findByPk(bookId);
    if (!book) {
      throw new Error('Книга не найдена');
    }

    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId, bookId },
      defaults: { userId, bookId }
    });

    return { favorite, created };
  }

  static async removeFromFavorites(favoriteId, userId) {
    const deleted = await Favorite.destroy({
      where: { id: favoriteId, userId }
    });
    return deleted;
  }
}

module.exports = FavoriteService;
