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

      const [day, month, year] = publication_date.split(".");
      const formattedPublicationDate = new Date(`${year}-${month}-${day}`)
        .toISOString()
        .split("T")[0];
      console.log("publication_date - ", publication_date);
      console.log("formattedPublicationDate - ", formattedPublicationDate);

      const [currentData] = await sequelize.query(
        `SELECT title, publication_date, author_id, age, cost 
         FROM books 
         WHERE id = :id`,
        {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT,
        },
      );

      if (!currentData) {
        return res.status(404).json({ message: "Книга не найдена" });
      }

      const currentDBDate = new Date(currentData.publication_date)
        .toISOString()
        .split("T")[0];

      console.log("currentDBDate - ", currentDBDate);
      if (
        currentData.title === title &&
        currentDBDate === formattedPublicationDate &&
        currentData.author_id === author_id &&
        currentData.age === age &&
        currentData.cost === cost
      ) {
        return res.status(400).json({ message: "Данные не изменились" });
      }

      const [updated] = await sequelize.query(
        `UPDATE books 
         SET title = :title, 
             publication_date = :publication_date, 
             author_id = :author_id, 
             age = :age, 
             cost = :cost
         WHERE id = :id
         RETURNING *`,
        {
          replacements: {
            id,
            title,
            publication_date: formattedPublicationDate,
            author_id,
            age,
            cost,
          },
          type: sequelize.QueryTypes.UPDATE,
        },
      );
      if (!updated || updated.length === 0) {
        return res.status(404).json({ message: "Книга не найдена" });
      }
      res.json(updated);
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        console.error("Ошибка внешнего ключа:", error);
        res
          .status(400)
          .send({
            message: "Невозможно обновить книгу: автор с таким ID не найден",
          });
      } else {
        console.error("Ошибка при обновлении книги:", error);
        res.status(500).send({ message: "Ошибка при обновлении книги" });
      }
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
