const jwt = require('jsonwebtoken')

const db = require('../models')
const User = db.user
const logger = require('../utils/logger') // adjust path to your winston logger config

class AuthJwt {
  async verifyToken(req, res, next) {
    const token = req.headers['x-access-token']

    if (!token) {
      logger.warn(`No token provided - IP: ${req.ip}`)
      return res.status(403).send({ message: 'No token provided!' })
    }

    try {
      const decoded = jwt.verify(token, process.env.auth.secret)
      req.userId = decoded.id
      logger.info(`Token verified successfully for userId: ${req.userId} - IP: ${req.ip}`)
      next()
    } catch (err) {
      logger.warn(`Unauthorized access attempt - IP: ${req.ip} - Error: ${err.message}`)
      return res.status(401).send({ message: 'Unauthorized!' })
    }
  }

  async isAdmin(req, res, next) {
    try {
      const user = await User.findByPk(req.userId)
      if (!user) {
        logger.warn(`User not found for isAdmin check - userId: ${req.userId} - IP: ${req.ip}`)
        return res.status(404).send({ message: 'User not found' })
      }

      const roles = await user.getRoles()
      for (const role of roles) {
        if (role.name === 'admin') {
          logger.info(`Admin role confirmed for userId: ${req.userId} - IP: ${req.ip}`)
          return next()
        }
      }

      logger.warn(`Access denied - Require Admin Role - userId: ${req.userId} - IP: ${req.ip}`)
      return res.status(403).send({ message: 'Require Admin Role!' })
    } catch (err) {
      logger.error(
        `Error in isAdmin middleware - userId: ${req.userId} - IP: ${req.ip} - Error: ${err.message}`
      )
      return res.status(500).send({ message: 'Internal server error' })
    }
  }

  async isModerator(req, res, next) {
    try {
      const user = await User.findByPk(req.userId)
      if (!user) {
        logger.warn(`User not found for isModerator check - userId: ${req.userId} - IP: ${req.ip}`)
        return res.status(404).send({ message: 'User not found' })
      }

      const roles = await user.getRoles()
      for (const role of roles) {
        if (role.name === 'moderator') {
          logger.info(`Moderator role confirmed for userId: ${req.userId} - IP: ${req.ip}`)
          return next()
        }
      }

      logger.warn(`Access denied - Require Moderator Role - userId: ${req.userId} - IP: ${req.ip}`)
      return res.status(403).send({ message: 'Require Moderator Role!' })
    } catch (err) {
      logger.error(
        `Error in isModerator middleware - userId: ${req.userId} - IP: ${req.ip} - Error: ${err.message}`
      )
      return res.status(500).send({ message: 'Internal server error' })
    }
  }

  async isModeratorOrAdmin(req, res, next) {
    try {
      const user = await User.findByPk(req.userId)
      if (!user) {
        logger.warn(
          `User not found for isModeratorOrAdmin check - userId: ${req.userId} - IP: ${req.ip}`
        )
        return res.status(404).send({ message: 'User not found' })
      }

      const roles = await user.getRoles()
      for (const role of roles) {
        if (role.name === 'moderator' || role.name === 'admin') {
          logger.info(`Moderator or Admin role confirmed for userId: ${req.userId} - IP: ${req.ip}`)
          return next()
        }
      }

      logger.warn(
        `Access denied - Require Moderator or Admin Role - userId: ${req.userId} - IP: ${req.ip}`
      )
      return res.status(403).send({ message: 'Require Moderator or Admin Role!' })
    } catch (err) {
      logger.error(
        `Error in isModeratorOrAdmin middleware - userId: ${req.userId} - IP: ${req.ip} - Error: ${err.message}`
      )
      return res.status(500).send({ message: 'Internal server error' })
    }
  }
}

module.exports.authJwt = new AuthJwt()
