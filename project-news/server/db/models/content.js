'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    static associate(models) {
      this.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  Content.init({
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    imagePath: DataTypes.STRING,
    isNSFW: DataTypes.BOOLEAN,
    views: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'Content',
  });
  return Content;
};