const { Sequelize, DataTypes, Op } = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DAILECT,
  operatorsAliases: false
})

const db = {}

db.Sequelize = Sequelize
db.Op = Op
db.sequelize = sequelize

db.books = require('./book.model.js')(sequelize, Sequelize, DataTypes)
db.user = require('./user.model.js')(sequelize, Sequelize, DataTypes)
db.role = require('./role.model.js')(sequelize, Sequelize, DataTypes)

db.role.belongsToMany(db.user, {
  through: 'user_roles',
  foreignKey: 'role_id',
  otherKey: 'user_id'
})
db.user.belongsToMany(db.role, {
  through: 'user_roles',
  foreignKey: 'user_id',
  otherKey: 'role_id'
})

db.ROLES = ['user', 'admin', 'moderator']

module.exports = db
