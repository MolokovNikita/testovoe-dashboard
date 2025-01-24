const { sequelize } = require("../models");

class BooksController {
  async getAll(req, res) {
    try {
      const { limit = 10, offset = 0 } = req.query;
      const totalRecordsQuery = await sequelize.query(
        `SELECT COUNT(*) as count FROM books`,
        {
          type: sequelize.QueryTypes.SELECT,
        },
      );
      const totalRecords = totalRecordsQuery[0].count;
      const books = await sequelize.query(
        `SELECT * FROM books LIMIT :limit OFFSET :offset`,
        {
          replacements: { limit: parseInt(limit), offset: parseInt(offset) },
          type: sequelize.QueryTypes.SELECT,
        },
      );
      res.json({
        books,
        totalRecords: parseInt(totalRecords),
      });
    } catch (error) {
      console.error("Ошибка при получении списка книг:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async create(req, res) {
    try {
      const { title, publication_date, author_id, age, cost } = req.body;
      const book = await sequelize.query(
        `INSERT INTO books (title, publication_date, author_id, age, cost) 
                 VALUES (:title, :publication_date, :author_id, :age, :cost)
                 RETURNING *`,
        {
          replacements: { title, publication_date, author_id, age, cost },
          type: sequelize.QueryTypes.INSERT,
        },
      );
      res.json(book[0]);
    } catch (error) {
      console.error("Ошибка при создании книги:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const book = await sequelize.query(`SELECT * FROM books WHERE id = :id`, {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
      });
      if (book.length === 0) {
        return res.status(404).json({ message: "Книга не найдена" });
      }
      res.json(book[0]);
    } catch (error) {
      console.error("Ошибка при получении книги:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, publication_date, author_id, age, cost } = req.body;
      const [updated] = await sequelize.query(
        `UPDATE books 
                 SET title = :title, publication_date = :publication_date, author_id = :author_id, 
                     age = :age, cost = :cost
                 WHERE id = :id
                 RETURNING *`,
        {
          replacements: { id, title, publication_date, author_id, age, cost },
          type: sequelize.QueryTypes.UPDATE,
        },
      );
      if (!updated || updated.length === 0) {
        return res.status(404).json({ message: "Книга не найдена" });
      }
      res.json(updated);
    } catch (error) {
      console.error("Ошибка при обновлении книги:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await sequelize.query(
        `DELETE FROM books WHERE id = :id RETURNING *`,
        {
          replacements: { id },
          type: sequelize.QueryTypes.DELETE,
        },
      );
      if (deleted.length === 0) {
        return res.status(404).json({ message: "Книга не найдена" });
      }
      res.json({ message: "Книга удалена успешно" });
    } catch (error) {
      console.error("Ошибка при удалении книги:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}

module.exports = new BooksController();
