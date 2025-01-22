const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorsController.js");

router.get('/', authorController.getAll); // Получить всех авторов
router.post('/', authorController.create); // Создать автора
router.get('/:id', authorController.getOne); // Получить одного автора
router.put('/:id', authorController.update); // Обновить автора
router.delete('/:id', authorController.delete); // Удалить автора

module.exports = router;
