const express = require('express')

const router = express.Router()
const { authController } = require('../controllers/AuthController')
const { verifySignUp } = require('../middlewares')

router.post(
  '/signup',
  [verifySignUp.checkRolesExisted, verifySignUp.checkDuplicateUsernameOrEmail],
  authController.signup
)
router.post('/signin', authController.signin)

module.exports = router
