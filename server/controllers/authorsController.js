const { sequelize } = require("../models");

class AuthorsController {
  async getAll(req, res) {
    try {
      const { limit = 10, offset = 0 } = req.query;
      const authors = await sequelize.query(
        `SELECT * FROM authors LIMIT :limit OFFSET :offset`,
        {
          replacements: {
            limit: parseInt(limit),
            offset: parseInt(offset),
          },
          type: sequelize.QueryTypes.SELECT,
        },
      );
      res.json(authors);
    } catch (error) {
      console.error("Ошибка при получении авторов:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async create(req, res) {
    try {
      const { name, birth_date } = req.body;
      const author = await sequelize.query(
        `INSERT INTO authors (name, birth_date) 
                 VALUES (:name, :birth_date)
                 RETURNING *`,
        {
          replacements: { name, birth_date },
          type: sequelize.QueryTypes.INSERT,
        },
      );
      res.json(author[0]);
    } catch (error) {
      console.error("Ошибка при создании автора:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const author = await sequelize.query(
        `SELECT * FROM authors WHERE id = :id`,
        {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT,
        },
      );
      if (author.length === 0) {
        return res.status(404).json({ message: "Автор не найден" });
      }
      res.json(author[0]);
    } catch (error) {
      console.error("Ошибка при получении автора:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, birth_date } = req.body;
      const [currentData] = await sequelize.query(
        `SELECT name, birth_date 
         FROM authors 
         WHERE id = :id`,
        {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT,
        },
      );

      if (!currentData) {
        return res.status(404).json({ message: "Автор не найден" });
      }
      const birth_dateBD = new Date(birth_date).toISOString();
      const currentDBDate = new Date(currentData.birth_date).toISOString();
      if (currentData.name === name && currentDBDate === birth_dateBD) {
        return res.status(400).json({ message: "Данные не изменились" });
      }

      const [updated] = await sequelize.query(
        `UPDATE authors 
         SET name = :name, birth_date = :birth_date
         WHERE id = :id
         RETURNING *`,
        {
          replacements: { id, name, birth_date },
          type: sequelize.QueryTypes.UPDATE,
        },
      );

      if (!updated || updated.length === 0) {
        return res.status(404).json({ message: "Автор не найден" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Ошибка при обновлении автора:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await sequelize.query(
        `DELETE FROM authors WHERE id = :id RETURNING *`,
        {
          replacements: { id },
          type: sequelize.QueryTypes.DELETE,
        },
      );
      if (deleted.length === 0) {
        return res.status(404).json({ message: "Автор не найден" });
      }
      res.json({ message: "Автор удален успешно" });
    } catch (error) {
      console.error("Ошибка при удалении автора:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}

module.exports = new AuthorsController();
