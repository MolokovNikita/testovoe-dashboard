'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate(models) {
      Author.hasMany(models.Book, { foreignKey: 'author_id', as: 'books' });
    }
  }
  Author.init({
    name: DataTypes.STRING,
    birth_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Author',
    tableName: 'authors',
    freezeTableName: true, 
    timestamps: false
  });
  return Author;
};