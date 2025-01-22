const { Book } = require('../models');
class BooksController {
    async getAll(req, res) {
        const authors = await Book.findAll();
        res.json(authors);
    }
    async create(req, res) {
        const { title, publication_date, author_id } = req.body;
        const book = await Book.create({ title, publication_date, author_id });
        res.json(book);
    }
    async getOne(req, res) {
        const authors = await Book.findAll();
        res.json(authors);
    }
    async update(req, res) {
        const authors = await Book.findAll();
        res.json(authors);
    }
    async delete(req, res) {
        const authors = await Book.findAll();
        res.json(authors);
    }

}
module.exports = new BooksController();

