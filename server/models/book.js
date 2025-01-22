"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.belongsTo(models.Author, { foreignKey: "author_id", as: "author" });
    }
  }
  Book.init(
    {
      title: DataTypes.STRING,
      publication_date: DataTypes.DATE,
      author_id: DataTypes.INTEGER,
      age: DataTypes.INTEGER,
      cost: DataTypes.NUMERIC,
    },
    {
      sequelize,
      modelName: "Book",
      tableName: "books",
      freezeTableName: true,
      timestamps: false,
    },
  );
  return Book;
};
