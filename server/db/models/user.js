'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // У пользователя много книг
      this.hasMany(models.Book, { foreignKey: 'userId', as: 'books' });
      // У пользователя много комментариев
      this.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' });
      // У пользователя много оценок
      this.hasMany(models.Rating, { foreignKey: 'userId', as: 'ratings' });
      // У пользователя много избранных книг через таблицу Favorites
      this.belongsToMany(models.Book, {
        through: models.Favorite,
        foreignKey: 'userId',
      });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      hashpass: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      validate: {
        // Проверяем, что хотя бы одно из полей заполнено
        eitherEmailOrPhone() {
          if (!this.email && !this.phone) {
            throw new Error('Either email or phone must be provided');
          }
        },
      },
    },
  );
  return User;
};
