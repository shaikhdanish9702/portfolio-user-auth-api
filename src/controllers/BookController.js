const db = require('../models')
const Book = db.books
const Op = db.Op
const logger = require('../utils/logger')

class BookController {
  async create(req, res) {
    if (!req.body.title) {
      logger.warn('Create Book failed: Title is missing.')
      return res.status(400).send({ message: 'Content can not be empty!' })
    }

    const book = {
      title: req.body.title,
      author: req.body.author,
      published: req.body.published || false
    }

    try {
      const data = await Book.create(book)
      logger.info(`Book created: ${data.title}`)
      res.send(data)
    } catch (err) {
      logger.error('Error creating book: ' + err.message)
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the Book.'
      })
    }
  }

  async findAll(req, res) {
    const title = req.query.title
    const condition = title ? { title: { [Op.like]: `%${title}%` } } : null

    try {
      const data = await Book.findAll({ where: condition })
      logger.info('Books fetched successfully.')
      res.send(data)
    } catch (err) {
      logger.error('Error retrieving books: ' + err.message)
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving books.'
      })
    }
  }

  async findOne(req, res) {
    const id = req.params.id

    try {
      const data = await Book.findByPk(id)
      if (data) {
        logger.info(`Book fetched with id=${id}`)
        res.send(data)
      } else {
        logger.warn(`Book with id=${id} not found.`)
        res.status(404).send({ message: `Book with id=${id} not found.` })
      }
    } catch (err) {
      logger.error(`Error retrieving book with id=${id}: ` + err.message)
      res.status(500).send({ message: `Error retrieving Book with id=${id}` })
    }
  }

  async update(req, res) {
    const id = req.params.id

    try {
      const [num] = await Book.update(req.body, { where: { id } })
      if (num === 1) {
        logger.info(`Book updated successfully with id=${id}`)
        res.send({ message: 'Book was updated successfully.' })
      } else {
        logger.warn(`Book not updated. id=${id}`)
        res.send({
          message: `Cannot update Book with id=${id}. Maybe Book was not found or req.body is empty!`
        })
      }
    } catch (err) {
      logger.error('Error updating Book with id=' + id + ': ' + err.message)
      res.status(500).send({ message: 'Error updating Book with id=' + id })
    }
  }

  async delete(req, res) {
    const id = req.params.id

    try {
      const num = await Book.destroy({ where: { id } })
      if (num === 1) {
        logger.info(`Book deleted successfully with id=${id}`)
        res.send({ message: 'Book was deleted successfully!' })
      } else {
        logger.warn(`Book with id=${id} not found for deletion.`)
        res.send({ message: `Cannot delete Book with id=${id}. Maybe Book was not found!` })
      }
    } catch (err) {
      logger.error('Error deleting Book with id=' + id + ': ' + err.message)
      res.status(500).send({ message: 'Could not delete Book with id=' + id })
    }
  }

  async deleteAll(req, res) {
    try {
      const nums = await Book.destroy({ where: {}, truncate: false })
      logger.info(`All books deleted. Count: ${nums}`)
      res.send({ message: `${nums} Books were deleted successfully!` })
    } catch (err) {
      logger.error('Error deleting all books: ' + err.message)
      res.status(500).send({
        message: err.message || 'Some error occurred while removing all books.'
      })
    }
  }

  async findAllPublished(req, res) {
    try {
      const data = await Book.findAll({ where: { published: true } })
      logger.info('Published books fetched successfully.')
      res.send(data)
    } catch (err) {
      logger.error('Error fetching published books: ' + err.message)
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving books.'
      })
    }
  }
}

module.exports.bookController = new BookController()
