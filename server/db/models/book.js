'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      // Книга принадлежит пользователю, который её добавил
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'addedBy' });
      // У книги много комментариев
      this.hasMany(models.Comment, { foreignKey: 'bookId', as: 'comments' });
      // У книги много оценок
      this.hasMany(models.Rating, { foreignKey: 'bookId', as: 'ratings' });
      // Книга может быть в избранном у многих пользователей
      this.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'bookId',
      });
    }
  }
  Book.init(
    {
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.STRING,
      genre: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Book',
    },
  );
  return Book;
};
