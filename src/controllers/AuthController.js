const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const db = require('../models')
const logger = require('../utils/logger') // Make sure you create this

const User = db.user
const Role = db.role
const Op = db.Op

class AuthController {
  async signup(req, res) {
    try {
      const { username, email, password, roles } = req.body

      const user = await User.create({
        username,
        email,
        password: bcrypt.hashSync(password, 8)
      })

      if (roles && roles.length > 0) {
        const foundRoles = await Role.findAll({
          where: {
            name: {
              [Op.or]: roles
            }
          }
        })
        await user.setRoles(foundRoles)
      } else {
        await user.setRoles([1]) // default role
      }

      res.send({ message: 'User was registered successfully!' })
    } catch (err) {
      logger.error('Signup Error:', err)
      res.status(500).send({ message: err.message })
    }
  }

  async signin(req, res) {
    try {
      const { username, password } = req.body

      const user = await User.findOne({ where: { username } })

      if (!user) {
        return res.status(404).send({ message: 'User Not found.' })
      }

      const passwordIsValid = bcrypt.compareSync(password, user.password)

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid Password!'
        })
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 86400
      })

      const roles = await user.getRoles()
      const authorities = roles.map((role) => `ROLE_${role.name.toUpperCase()}`)

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      })
    } catch (err) {
      logger.error('Signin Error:', err)
      res.status(500).send({ message: err.message })
    }
  }
}

module.exports.authController = new AuthController()
