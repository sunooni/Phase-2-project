'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Комментарий принадлежит пользователю
      this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
      // Комментарий принадлежит книге
      this.belongsTo(models.Book, { foreignKey: 'bookId', as: 'book' });
    }
  }
  Comment.init({
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};