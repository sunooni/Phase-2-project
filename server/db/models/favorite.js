'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    static associate(models) {
      // Favorite принадлежит пользователю
      this.belongsTo(models.User, { 
        foreignKey: 'userId',
      });
      
      // Favorite принадлежит книге
      this.belongsTo(models.Book, { 
        foreignKey: 'bookId',
      });
    }
  }
  Favorite.init({
    userId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};