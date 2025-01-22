const { Author } = require('../models');
class AuthorsController {
    async getAll(req, res) {
        const authors = await Author.findAll();
        res.json(authors);
    }
    async create(req, res) {
            const { name, birth_date } = req.body;
            const author = await Author.create({ name, birth_date });
            res.json(author);
    }
    async getOne(req, res) {
        const authors = await Author.findAll();
        res.json(authors);
    }
    async update(req, res) {
        const authors = await Author.findAll();
        res.json(authors);
    }
    async delete(req, res) {
        const authors = await Author.findAll();
        res.json(authors);
    }

}
module.exports = new AuthorsController();

