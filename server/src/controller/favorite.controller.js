const FavoriteService = require('../services/favorite.service');

class FavoritesController {
  static async getBookByFavorites(req, res) {
      const userId = req.user.id;
      const books = await FavoriteService.getUserFavorites(userId);
      return res.json(books);
  }

  static async addToFavorites(req, res) {
    const { bookId } = req.body;
    const userId = req.user.id;
    const { favorite, created } = await FavoriteService.addToFavorites(userId, bookId);
    if (!created) {
      return res.status(400).json({
        message: 'Книга уже в избранном',
        favoriteId: favorite.id,
      });
    }
    return res.status(201).json({ message: 'Книга добавлена в избранное' });
  }

  static async removeFromFavorites(req, res) {
    try {
      const { id } = req.params;
      if (!id || id === 'undefined') {
        return res.status(400).json({ message: 'ID избранного обязателен' });
      }
      const favoriteId = parseInt(id, 10);
      if (isNaN(favoriteId)) {
        return res.status(400).json({ message: 'Некорректный ID избранного' });
      }
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'Пользователь не авторизован' });
      }
      const userId = req.user.id;
      const deleted = await FavoriteService.removeFromFavorites(favoriteId, userId);
      if (!deleted) {
        return res.status(404).json({ message: 'Избранное не найдено' });
      }
      return res.json({ message: 'Книга удалена из избранного' });
    } catch (error) {
      console.error('Ошибка при удалении из избранного:', error);
      return res.status(500).json({
        message: 'Ошибка сервера при удалении из избранного',
        error: error.message,
      });
    }
  }
}

module.exports = FavoritesController;
