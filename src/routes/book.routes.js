const express = require('express')

const { bookController } = require('../controllers/BookController')

const router = express.Router()

router.post('/', bookController.create)
router.get('/', bookController.findAll)
router.get('/published', bookController.findAllPublished)
router.get('/:id', bookController.findOne)
router.put('/:id', bookController.update)
router.delete('/:id', bookController.delete)
router.delete('/', bookController.deleteAll)

module.exports = router
