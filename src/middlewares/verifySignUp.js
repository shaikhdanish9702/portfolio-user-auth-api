const db = require('../models')
const ROLES = db.ROLES
const User = db.user
const logger = require('../utils/logger') // adjust path to your winston logger config

class VerifySignUp {
  async checkDuplicateUsernameOrEmail(req, res, next) {
    try {
      // Check username
      const userByUsername = await User.findOne({ where: { username: req.body.username } })
      if (userByUsername) {
        logger.warn(`Duplicate username attempt: ${req.body.username} - IP: ${req.ip}`)
        return res.status(400).send({ message: 'Failed! Username is already in use!' })
      }

      // Check email
      const userByEmail = await User.findOne({ where: { email: req.body.email } })
      if (userByEmail) {
        logger.warn(`Duplicate email attempt: ${req.body.email} - IP: ${req.ip}`)
        return res.status(400).send({ message: 'Failed! Email is already in use!' })
      }

      next()
    } catch (err) {
      logger.error(`Error in checkDuplicateUsernameOrEmail - IP: ${req.ip} - Error: ${err.message}`)
      res.status(500).send({ message: 'Internal server error' })
    }
  }

  checkRolesExisted(req, res, next) {
    if (req.body.roles) {
      for (const role of req.body.roles) {
        if (!ROLES.includes(role)) {
          logger.warn(`Role does not exist: ${role} - IP: ${req.ip}`)
          return res.status(400).send({
            message: `Failed! Role does not exist = ${role}`
          })
        }
      }
    }
    next()
  }
}

module.exports.verifySignUp = new VerifySignUp()
