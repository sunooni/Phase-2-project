'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      // Рейтинг принадлежит пользователю
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      // Рейтинг принадлежит книге
      this.belongsTo(models.Book, { foreignKey: 'bookId', as: 'book' });
    }
  }
  Rating.init({
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
    mark: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rating',
  });
  return Rating;
};