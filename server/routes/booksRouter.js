const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController.js");

router.get("/", booksController.getAll); // Получить все книги
router.post("/", booksController.create); // Создать книгу
router.get("/:id", booksController.getOne); // Получить книгу по id
router.put("/:id", booksController.update); // Обновить книгу
router.delete("/:id", booksController.delete); // Удалить книгу

module.exports = router;
