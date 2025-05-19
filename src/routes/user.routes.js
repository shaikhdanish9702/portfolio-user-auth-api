const express = require('express')

const { accessController } = require('../controllers/AccessController')
const { authJwt } = require('../middlewares')

const router = express.Router()

router.get('/api/test/all', accessController.allAccess)

router.get('/api/test/user', [authJwt.verifyToken], accessController.userBoard)

router.get(
  '/api/test/mod',
  [authJwt.verifyToken, authJwt.isModerator],
  accessController.moderatorBoard
)

router.get('/api/test/admin', [authJwt.verifyToken, authJwt.isAdmin], accessController.adminBoard)

module.exports = router
